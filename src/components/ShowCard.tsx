import React from 'react';
import { TrackedShow } from '../types/show';
import { Play, CheckCircle2 } from 'lucide-react';

interface ShowCardProps {
  show: TrackedShow;
  onClick: () => void;
}

export function ShowCard({ show, onClick }: ShowCardProps) {
  const watchedEpisodes = show.episodes.filter((ep) => ep.watched).length;
  const progress = (watchedEpisodes / show.episodes.length) * 100;

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer border border-gray-700 group"
    >
      <div className="relative h-48">
        <img
          src={show.image.medium}
          alt={show.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
        <div className="absolute bottom-0 p-4 text-gray-100">
          <h3 className="text-xl font-bold">{show.name}</h3>
          <div className="flex items-center gap-2 mt-2 text-gray-300">
            <Play size={16} />
            <span className="text-sm">
              Season {show.currentSeason}
            </span>
            <CheckCircle2 size={16} className="ml-2" />
            <span className="text-sm">
              {watchedEpisodes}/{show.episodes.length} episodes
            </span>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-700 h-1">
        <div
          className="bg-emerald-500 h-1 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}