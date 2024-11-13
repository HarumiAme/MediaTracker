import { create } from 'zustand';
import { TrackedShow, Show, Episode } from '../types/show';
import axios from 'axios';

interface ShowStore {
  shows: TrackedShow[];
  addShow: (show: Show) => Promise<void>;
  toggleEpisodeWatched: (showId: number, episodeId: number) => void;
  updateEpisodeNote: (showId: number, episodeId: number, note: string) => void;
  setCurrentSeason: (showId: number, season: number) => void;
}

export const useShowStore = create<ShowStore>((set) => ({
  shows: [],
  addShow: async (show) => {
    const response = await axios.get(`https://api.tvmaze.com/shows/${show.id}/episodes`);
    const episodes: Episode[] = response.data.map((ep: any) => ({
      ...ep,
      watched: false,
      note: '',
    }));

    set((state) => ({
      shows: [...state.shows, {
        ...show,
        episodes,
        currentSeason: 1,
      }],
    }));
  },
  toggleEpisodeWatched: (showId, episodeId) => {
    set((state) => ({
      shows: state.shows.map((show) => {
        if (show.id === showId) {
          return {
            ...show,
            episodes: show.episodes.map((ep) =>
              ep.id === episodeId ? { ...ep, watched: !ep.watched } : ep
            ),
          };
        }
        return show;
      }),
    }));
  },
  updateEpisodeNote: (showId, episodeId, note) => {
    set((state) => ({
      shows: state.shows.map((show) => {
        if (show.id === showId) {
          return {
            ...show,
            episodes: show.episodes.map((ep) =>
              ep.id === episodeId ? { ...ep, note } : ep
            ),
          };
        }
        return show;
      }),
    }));
  },
  setCurrentSeason: (showId, season) => {
    set((state) => ({
      shows: state.shows.map((show) =>
        show.id === showId ? { ...show, currentSeason: season } : show
      ),
    }));
  },
}));