import React from 'react';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { Episode } from '../types/show';

interface SeasonSelectorProps {
  seasons: number[];
  currentSeason: number;
  episodes: Episode[];
  onSeasonChange: (season: number) => void;
}

export function SeasonSelector({ seasons, currentSeason, episodes, onSeasonChange }: SeasonSelectorProps) {
  const getSeasonStatus = (season: number) => {
    const seasonEpisodes = episodes.filter(ep => ep.season === season);
    const watchedEpisodes = seasonEpisodes.filter(ep => ep.watched).length;
    const totalEpisodes = seasonEpisodes.length;
    
    if (watchedEpisodes === totalEpisodes) {
      return 'completed';
    } else if (watchedEpisodes === 0) {
      return 'unwatched';
    } else {
      return 'in-progress';
    }
  };

  const getSeasonProgress = (season: number) => {
    const seasonEpisodes = episodes.filter(ep => ep.season === season);
    const watchedEpisodes = seasonEpisodes.filter(ep => ep.watched).length;
    const totalEpisodes = seasonEpisodes.length;
    return `${watchedEpisodes}/${totalEpisodes}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {seasons.map((season) => {
        const status = getSeasonStatus(season);
        const progress = getSeasonProgress(season);
        
        return (
          <button
            key={season}
            onClick={() => onSeasonChange(season)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${currentSeason === season ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-gray-900' : ''}
              ${status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 
                status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 
                'bg-gray-800 text-gray-400 hover:bg-gray-700'}
            `}
          >
            <span className="relative">
              {status === 'completed' ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : status === 'in-progress' ? (
                <PlayCircle size={16} className="text-blue-400" />
              ) : (
                <Circle size={16} className="text-gray-400" />
              )}
            </span>
            <span className="font-medium">Season {season}</span>
            <span className="text-xs opacity-75">({progress})</span>
          </button>
        );
      })}
    </div>
  );
}