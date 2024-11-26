import React, { useEffect, useState } from 'react';
import { Plus, Loader2, Search } from 'lucide-react';
import { ShowCard } from '../components/ShowCard';
import { AddShowModal } from '../components/AddShowModal';
import { ShowDetail } from '../components/ShowDetail';
import { useShowStore } from '../store/useShowStore';
import { useAuthStore } from '../store/useAuthStore';
import { TrackedShow } from '../types/show';
import { SortControls } from '../components/SortControls';

type SortOption = 'lastWatched' | 'alphabetical' | 'progress';
type SortDirection = 'asc' | 'desc';

interface SortState {
  option: SortOption;
  direction: SortDirection;
}

const sortShows = (shows: TrackedShow[], sortState: SortState): TrackedShow[] => {
  const { option, direction } = sortState;
  const multiplier = direction === 'desc' ? 1 : -1; // Changed this line

  return [...shows].sort((a, b) => {
    if (option === 'alphabetical') {
      return multiplier * a.name.localeCompare(b.name);
    }
    
    if (option === 'progress') {
      const progressA = (a.episodes.filter(ep => ep.watched).length / a.episodes.length) * 100;
      const progressB = (b.episodes.filter(ep => ep.watched).length / b.episodes.length) * 100;
      return multiplier * (progressB - progressA);
    }
    
    if (option === 'lastWatched') {
      const lastWatchedA = Math.max(...a.episodes.filter(ep => ep.watched).map(ep => ep.watchedAt || 0), 0);
      const lastWatchedB = Math.max(...b.episodes.filter(ep => ep.watched).map(ep => ep.watchedAt || 0), 0);
      return multiplier * (lastWatchedB - lastWatchedA);
    }
    
    return 0;
  });
};

function Dashboard() {
  const {
    shows,
    loading,
    loadShows,
    addShow,
    toggleEpisodeWatched,
    updateEpisodeNote,
    setCurrentSeason,
  } = useShowStore();
  const { signOut, user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    option: 'lastWatched',
    direction: 'desc'
  });

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  const handleSortChange = (newOption: SortOption) => {
    setSortState(prev => ({
      option: newOption,
      direction: prev.option === newOption ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'desc'
    }));
  };

  const filteredShows = shows.filter((show) =>
    show.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inProgressShows = filteredShows.filter(
    show => {
      const watchedCount = show.episodes.filter(ep => ep.watched).length;
      return watchedCount > 0 && watchedCount < show.episodes.length;
    }
  );

  const upNextShows = filteredShows.filter(
    show => show.episodes.every(ep => !ep.watched)
  );

  const completedShows = filteredShows.filter(
    show => show.episodes.every(ep => ep.watched)
  );

  const sortedInProgress = sortShows(inProgressShows, sortState);
  const sortedUpNext = sortShows(upNextShows, {
    option: 'alphabetical',
    direction: sortState.option === 'alphabetical' ? sortState.direction : 'asc'
  });
  const sortedCompleted = sortShows(completedShows, {
    option: 'alphabetical',
    direction: sortState.option === 'alphabetical' ? sortState.direction : 'asc'
  });

  if (loading && shows.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="animate-spin w-8 h-8 text-emerald-400" />
      </div>
    );
  }

  if (selectedShow) {
    const show = shows.find((s) => s.id === selectedShow);
    if (show) {
      return (
        <ShowDetail
          show={show}
          onBack={() => setSelectedShow(null)}
          onToggleWatched={(episodeId) =>
            toggleEpisodeWatched(selectedShow, episodeId)
          }
          onUpdateNote={(episodeId, note) =>
            updateEpisodeNote(selectedShow, episodeId, note)
          }
          onSeasonChange={(season) => setCurrentSeason(selectedShow, season)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              MediaTracker
            </h1>
            <div className="flex items-center gap-6">
              <span className="text-gray-400">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-gray-200 font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-gray-100 rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-colors shadow-lg shadow-emerald-900/20"
          >
            <Plus size={20} />
            Add Show
          </button>
        </div>

        {shows.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Start Your Watch List
            </h3>
            <p className="text-gray-400 mb-8">
              Add your favorite shows and start tracking your progress
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-gray-100 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus size={20} />
              Add Your First Show
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {inProgressShows.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-100">In Progress</h2>
                  <SortControls
                    currentSort={sortState.option}
                    currentDirection={sortState.direction}
                    onSortChange={handleSortChange}
                    showProgressSort
                    showLastWatchedSort
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedInProgress.map((show) => (
                    <ShowCard
                      key={show.id}
                      show={show}
                      onClick={() => setSelectedShow(show.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {upNextShows.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-100">Up Next</h2>
                  <SortControls
                    currentSort={sortState.option}
                    currentDirection={sortState.direction}
                    onSortChange={handleSortChange}
                    showProgressSort={false}
                    showLastWatchedSort={false}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedUpNext.map((show) => (
                    <ShowCard
                      key={show.id}
                      show={show}
                      onClick={() => setSelectedShow(show.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {completedShows.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-100">Completed</h2>
                  <SortControls
                    currentSort={sortState.option}
                    currentDirection={sortState.direction}
                    onSortChange={handleSortChange}
                    showProgressSort={false}
                    showLastWatchedSort={false}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedCompleted.map((show) => (
                    <ShowCard
                      key={show.id}
                      show={show}
                      onClick={() => setSelectedShow(show.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddShowModal
          onClose={() => setShowAddModal(false)}
          onAddShow={addShow}
        />
      )}
    </div>
  );
}

export { Dashboard };