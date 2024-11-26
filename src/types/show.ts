export interface Show {
  id: number;
  name: string;
  image: {
    medium: string;
    original: string;
  };
  summary: string;
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  summary: string;
  watched: boolean;
  note?: string;
  watchedAt?: number; // Unix timestamp in milliseconds
}

export interface TrackedShow extends Show {
  userId: string;
  episodes: Episode[];
  currentSeason: number;
  lastWatchedEpisode?: Episode;
}