import React from 'react';
import { ArrowDownAZ, ArrowUpAZ, Percent, Clock, ArrowDown, ArrowUp } from 'lucide-react';

type SortOption = 'lastWatched' | 'alphabetical' | 'progress';
type SortDirection = 'asc' | 'desc';

interface SortControlsProps {
  currentSort: SortOption;
  currentDirection: SortDirection;
  onSortChange: (sort: SortOption) => void;
  showProgressSort?: boolean;
  showLastWatchedSort?: boolean;
}

export function SortControls({ 
  currentSort, 
  currentDirection,
  onSortChange, 
  showProgressSort = false,
  showLastWatchedSort = false 
}: SortControlsProps) {
  return (
    <div className="flex gap-2">
      {showLastWatchedSort && (
        <button
          onClick={() => onSortChange('lastWatched')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentSort === 'lastWatched'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Clock size={18} />
          Last Watched
          {currentSort === 'lastWatched' && (
            currentDirection === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />
          )}
        </button>
      )}
      <button
        onClick={() => onSortChange('alphabetical')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentSort === 'alphabetical'
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        {currentSort === 'alphabetical' && currentDirection === 'desc' ? (
          <ArrowUpAZ size={18} />
        ) : (
          <ArrowDownAZ size={18} />
        )}
        A-Z
      </button>
      {showProgressSort && (
        <button
          onClick={() => onSortChange('progress')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentSort === 'progress'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Percent size={18} />
          Progress
          {currentSort === 'progress' && (
            currentDirection === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />
          )}
        </button>
      )}
    </div>
  );
}