import React, { useEffect, useState } from 'react';
import { Plus, Loader2, Search, ListTodo, PlayCircle, CheckCircle2 } from 'lucide-react';
import { ShowCard } from '../components/ShowCard';
import { AddShowModal } from '../components/AddShowModal';
import { ShowDetail } from '../components/ShowDetail';
import { useShowStore } from '../store/useShowStore';
import { useAuthStore } from '../store/useAuthStore';
import { TrackedShow } from '../types/show';
import { SortControls } from '../components/SortControls';

type SortOption = 'lastWatched' | 'alphabetical' | 'progress';

function ShowSection({ 
  title, 
  shows, 
  icon: Icon, 
  description, 
  onClick,
  sortOption,
  onSortChange,
  showProgressSort = false,
  showLastWatchedSort = false
}: { 
  title: string; 
  shows: TrackedShow[]; 
  icon: React.ElementType;
  description: string;
  onClick: (show: TrackedShow) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  showProgressSort?: boolean;
  showLastWatchedSort?: boolean;
}) {
  if (shows.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-800">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-100">{title}</h2>
          <span className="text-gray-500 text-sm">({shows.length})</span>
        </div>
        <SortControls
          currentSort={sortOption}
          onSortChange={onSortChange}
          showProgressSort={showProgressSort}
          showLastWatchedSort={showLastWatchedSort}
        />
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} onClick={() => onClick(show)} />
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inProgressSort, setInProgressSort] = useState<SortOption>('lastWatched');
  const [pendingSort, setPendingSort] = useState<SortOption>('alphabetical');
  const [completedSort, setCompletedSort] = useState<SortOption>('alphabetical');

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

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  const filteredShows = shows.filter((show) =>
    show.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortShows = (shows: TrackedShow[], sortOption: SortOption): TrackedShow[] => {
    return [...shows].sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      
      if (sortOption === 'progress') {
        const progressA = (a.episodes.filter(ep => ep.watched).length / a.episodes.length) * 100;
        const progressB = (b.episodes.filter(ep => ep.watched).length / b.episodes.length) * 100;
        return progressB - progressA;
      }
      
      if (sortOption === 'lastWatched') {
        const lastWatchedA = Math.max(...a.episodes.filter(ep => ep.watched).map(ep => ep.id), 0);
        const lastWatchedB = Math.max(...b.episodes.filter(ep => ep.watched).map(ep => ep.id), 0);
        return lastWatchedB - lastWatchedA;
      }
      
      return 0;
    });
  };

  const categorizedShows = filteredShows.reduce(
    (acc, show) => {
      const watchedEpisodes = show.episodes.filter((ep) => ep.watched).length;
      const totalEpisodes = show.episodes.length;
      
      if (watchedEpisodes === 0) {
        acc.pending.push(show);
      } else if (watchedEpisodes === totalEpisodes) {
        acc.completed.push(show);
      } else {
        acc.inProgress.push(show);
      }
      
      return acc;
    },
    { pending: [] as TrackedShow[], inProgress: [] as TrackedShow[], completed: [] as TrackedShow[] }
  );

  // Sort each category
  const sortedInProgress = sortShows(categorizedShows.inProgress, inProgressSort);
  const sortedPending = sortShows(categorizedShows.pending, pendingSort);
  const sortedCompleted = sortShows(categorizedShows.completed, completedSort);

  if (loading && shows.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="animate-spin w-8 h-8 text-emerald-400" />
      </div>
    );
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

      {selectedShow ? (
        <ShowDetail
          show={shows.find((s) => s.id === selectedShow)!}
          onBack={() => setSelectedShow(null)}
          onToggleWatched={(episodeId) =>
            toggleEpisodeWatched(selectedShow, episodeId)
          }
          onUpdateNote={(episodeId, note) =>
            updateEpisodeNote(selectedShow, episodeId, note)
          }
          onSeasonChange={(season) => setCurrentSeason(selectedShow, season)}
        />
      ) : (
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
            <div className="space-y-8">
              <ShowSection
                title="In Progress"
                shows={sortedInProgress}
                icon={PlayCircle}
                description="Shows you're currently watching"
                onClick={(show) => setSelectedShow(show.id)}
                sortOption={inProgressSort}
                onSortChange={setInProgressSort}
                showProgressSort={true}
                showLastWatchedSort={true}
              />
              <ShowSection
                title="Up Next"
                shows={sortedPending}
                icon={ListTodo}
                description="Shows you haven't started watching yet"
                onClick={(show) => setSelectedShow(show.id)}
                sortOption={pendingSort}
                onSortChange={setPendingSort}
              />
              <ShowSection
                title="Completed"
                shows={sortedCompleted}
                icon={CheckCircle2}
                description="Shows you've finished watching"
                onClick={(show) => setSelectedShow(show.id)}
                sortOption={completedSort}
                onSortChange={setCompletedSort}
              />
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddShowModal
          onClose={() => setShowAddModal(false)}
          onAddShow={addShow}
        />
      )}
    </div>
  );
}