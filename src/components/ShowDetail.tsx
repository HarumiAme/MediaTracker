import React, { useState } from 'react';
import { TrackedShow, Episode } from '../types/show';
import { ChevronLeft, Check, MessageSquare, Trash2, X, ListChecks, ListTodo, ArrowDownUp, PlayCircle } from 'lucide-react';
import { useShowStore } from '../store/useShowStore';
import { ConfirmationModal } from './ConfirmationModal';
import { SeasonSelector } from './SeasonSelector';

interface EpisodeListProps {
  episodes: Episode[];
  selectedEpisode: number | null;
  onToggleWatched: (episodeId: number) => void;
  onWatchUntilHere: (episodeId: number) => void;
  onUpdateNote: (episodeId: number, note: string) => void;
  setSelectedEpisode: (episodeId: number | null) => void;
}

function EpisodeList({ 
  episodes, 
  selectedEpisode, 
  onToggleWatched, 
  onWatchUntilHere,
  onUpdateNote, 
  setSelectedEpisode 
}: EpisodeListProps) {
  const [showWatchUntilModal, setShowWatchUntilModal] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className={`rounded-xl border overflow-hidden transition-all duration-200 hover:border-gray-600 ${
            episode.watched
              ? 'bg-emerald-900/20 border-emerald-800/50'
              : 'bg-gray-800 border-gray-700'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              {!episode.watched && (
                <button
                  onClick={() => setShowWatchUntilModal(episode.id)}
                  className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                  title="Watch until here (marks all previous episodes as watched)"
                >
                  <PlayCircle size={20} />
                </button>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${episode.watched ? 'text-emerald-300' : 'text-gray-100'}`}>
                    Episode {episode.number}: {episode.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedEpisode(
                        selectedEpisode === episode.id ? null : episode.id
                      )}
                      className={`p-2 rounded-lg transition-colors ${
                        episode.note
                          ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                          : 'bg-gray-900 text-gray-500 hover:text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <MessageSquare size={20} />
                    </button>
                    <button
                      onClick={() => onToggleWatched(episode.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        episode.watched
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-gray-900 text-gray-500 hover:text-gray-400 hover:bg-gray-700'
                      }`}
                      title={episode.watched ? "Mark as unwatched" : "Mark as watched"}
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
                <p 
                  className={`text-sm mt-1 ${episode.watched ? 'text-emerald-300/70' : 'text-gray-400'}`}
                  dangerouslySetInnerHTML={{ __html: episode.summary || 'No description available.' }}
                />
              </div>
            </div>
            
            {selectedEpisode === episode.id && (
              <div className="mt-4 pl-14">
                <textarea
                  value={episode.note || ''}
                  onChange={(e) => onUpdateNote(episode.id, e.target.value)}
                  placeholder="Add your notes about this episode..."
                  className="w-full p-3 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500 resize-none"
                  rows={4}
                />
              </div>
            )}
          </div>

          <ConfirmationModal
            isOpen={showWatchUntilModal === episode.id}
            onClose={() => setShowWatchUntilModal(null)}
            onConfirm={() => {
              onWatchUntilHere(episode.id);
              setShowWatchUntilModal(null);
            }}
            title="Watch Until Here"
            message={`This will mark this episode and all previous episodes as watched. Are you sure?`}
            confirmText="Yes, mark as watched"
          />
        </div>
      ))}
    </div>
  );
}

interface ShowDetailProps {
  show: TrackedShow;
  onBack: () => void;
  onToggleWatched: (episodeId: number) => void;
  onUpdateNote: (episodeId: number, note: string) => void;
  onSeasonChange: (season: number) => void;
}

export function ShowDetail({
  show,
  onBack,
  onToggleWatched,
  onUpdateNote,
  onSeasonChange,
}: ShowDetailProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkWatchedModal, setShowMarkWatchedModal] = useState(false);
  const [showMarkUnwatchedModal, setShowMarkUnwatchedModal] = useState(false);
  const [separateWatched, setSeparateWatched] = useState(true);
  const { deleteShow, markAllEpisodesWatched, watchUntilEpisode } = useShowStore();

  const seasons = Array.from(
    new Set(show.episodes.map((ep) => ep.season))
  ).sort((a, b) => a - b);

  const currentSeasonEpisodes = show.episodes.filter(
    (ep) => ep.season === show.currentSeason
  );

  let unwatchedEpisodes: Episode[] = [];
  let watchedEpisodes: Episode[] = [];

  if (separateWatched) {
    unwatchedEpisodes = currentSeasonEpisodes.filter(ep => !ep.watched)
      .sort((a, b) => a.number - b.number);
    watchedEpisodes = currentSeasonEpisodes.filter(ep => ep.watched)
      .sort((a, b) => a.number - b.number);
  } else {
    unwatchedEpisodes = currentSeasonEpisodes.sort((a, b) => a.number - b.number);
    watchedEpisodes = [];
  }

  const handleDelete = async () => {
    await deleteShow(show.id);
    onBack();
  };

  const handleMarkSeasonWatched = async () => {
    await markAllEpisodesWatched(show.id, show.currentSeason);
  };

  const handleMarkSeasonUnwatched = async () => {
    await markAllEpisodesWatched(show.id, show.currentSeason, false);
  };

  const handleWatchUntilHere = async (episodeId: number) => {
    await watchUntilEpisode(show.id, episodeId);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900">
        <div className="relative h-[300px]">
          <img
            src={show.image.original}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          <button
            onClick={onBack}
            className="absolute top-6 left-6 p-2.5 bg-gray-900/50 hover:bg-gray-900/70 rounded-full text-gray-100 backdrop-blur-sm transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="absolute top-6 right-6 p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-full text-red-400 hover:text-red-300 backdrop-blur-sm transition-colors"
          >
            <Trash2 size={24} />
          </button>
          <div className="absolute bottom-0 p-8 w-full">
            <h1 className="text-4xl font-bold text-gray-100 mb-6">{show.name}</h1>
            <div className="flex flex-col md:flex-row gap-4">
              <SeasonSelector
                seasons={seasons}
                currentSeason={show.currentSeason}
                episodes={show.episodes}
                onSeasonChange={onSeasonChange}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMarkWatchedModal(true)}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check size={20} />
                  Mark Season as Watched
                </button>
                <button
                  onClick={() => setShowMarkUnwatchedModal(true)}
                  className="px-4 py-2 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 border border-gray-700"
                >
                  <X size={20} />
                  Mark Season as Unwatched
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-100">Season {show.currentSeason} Episodes</h2>
            <button
              onClick={() => setSeparateWatched(!separateWatched)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                separateWatched
                  ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <ArrowDownUp size={20} />
              {separateWatched ? 'Separate Watched' : 'Show Chronologically'}
            </button>
          </div>

          {unwatchedEpisodes.length > 0 && (
            <div className="mb-12">
              {separateWatched && (
                <div className="flex items-center gap-2 mb-6 text-gray-100">
                  <ListTodo className="text-blue-400" size={20} />
                  <h2 className="text-lg font-semibold">Episodes to Watch ({unwatchedEpisodes.length})</h2>
                </div>
              )}
              <EpisodeList
                episodes={unwatchedEpisodes}
                selectedEpisode={selectedEpisode}
                onToggleWatched={onToggleWatched}
                onWatchUntilHere={handleWatchUntilHere}
                onUpdateNote={onUpdateNote}
                setSelectedEpisode={setSelectedEpisode}
              />
            </div>
          )}

          {watchedEpisodes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6 text-gray-100">
                <ListChecks className="text-emerald-400" size={20} />
                <h2 className="text-lg font-semibold">Watched Episodes ({watchedEpisodes.length})</h2>
              </div>
              <EpisodeList
                episodes={watchedEpisodes}
                selectedEpisode={selectedEpisode}
                onToggleWatched={onToggleWatched}
                onWatchUntilHere={handleWatchUntilHere}
                onUpdateNote={onUpdateNote}
                setSelectedEpisode={setSelectedEpisode}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Show"
        message={`Are you sure you want to delete "${show.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
      />

      <ConfirmationModal
        isOpen={showMarkWatchedModal}
        onClose={() => setShowMarkWatchedModal(false)}
        onConfirm={handleMarkSeasonWatched}
        title="Mark Season as Watched"
        message={`Are you sure you want to mark all episodes of Season ${show.currentSeason} as watched?`}
        confirmText="Mark Season as Watched"
      />

      <ConfirmationModal
        isOpen={showMarkUnwatchedModal}
        onClose={() => setShowMarkUnwatchedModal(false)}
        onConfirm={handleMarkSeasonUnwatched}
        title="Mark Season as Unwatched"
        message={`Are you sure you want to mark all episodes of Season ${show.currentSeason} as unwatched?`}
        confirmText="Mark Season as Unwatched"
      />
    </>
  );
}