import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, PlayCircle, ChevronDown } from 'lucide-react';
import { Episode } from '../types/show';

interface SeasonSelectorProps {
  seasons: number[];
  currentSeason: number;
  episodes: Episode[];
  onSeasonChange: (season: number) => void;
}

export function SeasonSelector({ seasons, currentSeason, episodes, onSeasonChange }: SeasonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const currentStatus = getSeasonStatus(currentSeason);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-800 transition-colors border border-gray-700"
      >
        <div className="flex items-center gap-2">
          {currentStatus === 'completed' ? (
            <CheckCircle2 size={18} className="text-emerald-400" />
          ) : currentStatus === 'in-progress' ? (
            <PlayCircle size={18} className="text-blue-400" />
          ) : (
            <Circle size={18} className="text-gray-400" />
          )}
          <span className="font-medium text-gray-100">Season {currentSeason}</span>
          <span className="text-sm text-gray-400">({getSeasonProgress(currentSeason)})</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl max-h-[300px] overflow-y-auto">
          {seasons.map((season) => {
            const status = getSeasonStatus(season);
            const progress = getSeasonProgress(season);
            
            return (
              <button
                key={season}
                onClick={() => {
                  onSeasonChange(season);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-700/50 transition-colors
                  ${currentSeason === season ? 'bg-gray-700' : ''}
                `}
              >
                {status === 'completed' ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : status === 'in-progress' ? (
                  <PlayCircle size={18} className="text-blue-400" />
                ) : (
                  <Circle size={18} className="text-gray-400" />
                )}
                <span className={`font-medium ${currentSeason === season ? 'text-gray-100' : 'text-gray-300'}`}>
                  Season {season}
                </span>
                <span className="text-sm text-gray-400 ml-auto">
                  {progress}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}