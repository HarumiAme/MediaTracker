import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ShowCard } from '../components/ShowCard';
import { AddShowModal } from '../components/AddShowModal';
import { ShowDetail } from '../components/ShowDetail';
import { useShowStore } from '../store/useShowStore';
import { useAuthStore } from '../store/useAuthStore';
import { Show } from '../types/show';

export function Dashboard() {
  const { shows, addShow, toggleEpisodeWatched, updateEpisodeNote, setCurrentSeason } = useShowStore();
  const { signOut, user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState<number | null>(null);

  const handleAddShow = async (show: Show) => {
    await addShow(show);
    setShowAddModal(false);
  };

  const selectedShowData = shows.find((s) => s.id === selectedShow);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">ShowTracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {selectedShowData ? (
        <ShowDetail
          show={selectedShowData}
          onBack={() => setSelectedShow(null)}
          onToggleWatched={(episodeId) => toggleEpisodeWatched(selectedShowData.id, episodeId)}
          onUpdateNote={(episodeId, note) => updateEpisodeNote(selectedShowData.id, episodeId, note)}
          onSeasonChange={(season) => setCurrentSeason(selectedShowData.id, season)}
        />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">My Shows</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add Show
            </button>
          </div>

          {shows.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl text-gray-600 mb-4">No shows added yet</h3>
              <p className="text-gray-500">
                Click the "Add Show" button to start tracking your favorite shows
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shows.map((show) => (
                <ShowCard
                  key={show.id}
                  show={show}
                  onClick={() => setSelectedShow(show.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddShowModal
          onClose={() => setShowAddModal(false)}
          onAddShow={handleAddShow}
        />
      )}
    </div>
  );
}