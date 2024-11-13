import React, { useState } from 'react';
import { TrackedShow, Episode } from '../types/show';
import { ChevronLeft, Check, MessageSquare } from 'lucide-react';

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

  const seasons = Array.from(
    new Set(show.episodes.map((ep) => ep.season))
  ).sort((a, b) => a - b);

  const currentSeasonEpisodes = show.episodes.filter(
    (ep) => ep.season === show.currentSeason
  );

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-64">
        <img
          src={show.image.original}
          alt={show.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="absolute bottom-0 p-6 text-white">
          <h1 className="text-3xl font-bold">{show.name}</h1>
          <div className="mt-2">
            <select
              value={show.currentSeason}
              onChange={(e) => onSeasonChange(Number(e.target.value))}
              className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-lg"
            >
              {seasons.map((season) => (
                <option key={season} value={season}>
                  Season {season}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {currentSeasonEpisodes.map((episode) => (
            <div key={episode.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggleWatched(episode.id)}
                    className={`p-2 rounded-full ${
                      episode.watched
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Check size={20} />
                  </button>
                  <div>
                    <h3 className="font-semibold">
                      Episode {episode.number}: {episode.name}
                    </h3>
                    <p className="text-sm text-gray-600"
                       dangerouslySetInnerHTML={{ __html: episode.summary || 'No description available.' }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEpisode(
                    selectedEpisode === episode.id ? null : episode.id
                  )}
                  className={`p-2 rounded-full ${
                    episode.note
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <MessageSquare size={20} />
                </button>
              </div>
              
              {selectedEpisode === episode.id && (
                <div className="mt-4">
                  <textarea
                    value={episode.note || ''}
                    onChange={(e) => onUpdateNote(episode.id, e.target.value)}
                    placeholder="Add your notes about this episode..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}