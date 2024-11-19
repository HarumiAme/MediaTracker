import React, { useState } from 'react';
import { TrackedShow, Episode } from '../types/show';
import { ChevronLeft, Check, MessageSquare, ChevronDown, Trash2 } from 'lucide-react';
import { useShowStore } from '../store/useShowStore';
import { ConfirmationModal } from './ConfirmationModal';

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
  const { deleteShow } = useShowStore();

  const seasons = Array.from(
    new Set(show.episodes.map((ep) => ep.season))
  ).sort((a, b) => a - b);

  const currentSeasonEpisodes = show.episodes.filter(
    (ep) => ep.season === show.currentSeason
  );

  const handleDelete = async () => {
    await deleteShow(show.id);
    onBack();
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
            <h1 className="text-4xl font-bold text-gray-100 mb-4">{show.name}</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={show.currentSeason}
                  onChange={(e) => onSeasonChange(Number(e.target.value))}
                  className="appearance-none bg-gray-800 text-gray-100 px-4 py-2 pr-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      Season {season}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {currentSeasonEpisodes.map((episode) => (
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
                    <button
                      onClick={() => onToggleWatched(episode.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        episode.watched
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-gray-900 text-gray-500 hover:text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <Check size={20} />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${episode.watched ? 'text-emerald-300' : 'text-gray-100'}`}>
                          Episode {episode.number}: {episode.name}
                        </h3>
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
              </div>
            ))}
          </div>
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
    </>
  );
}