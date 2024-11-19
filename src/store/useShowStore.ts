import { create } from 'zustand';
import { TrackedShow, Show, Episode } from '../types/show';
import { showService } from '../services/showService';
import { useAuthStore } from './useAuthStore';
import axios from 'axios';

interface ShowStore {
  shows: TrackedShow[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  loadShows: () => Promise<void>;
  addShow: (show: Show) => Promise<void>;
  toggleEpisodeWatched: (showId: number, episodeId: number) => Promise<void>;
  updateEpisodeNote: (showId: number, episodeId: number, note: string) => Promise<void>;
  setCurrentSeason: (showId: number, season: number) => Promise<void>;
  deleteShow: (showId: number) => Promise<void>;
  markAllEpisodesWatched: (showId: number, season?: number, watched?: boolean) => Promise<void>;
}

export const useShowStore = create<ShowStore>((set, get) => ({
  shows: [],
  loading: false,
  error: null,
  initialized: false,

  loadShows: async () => {
    const { user } = useAuthStore.getState();
    if (!user || get().initialized) return;

    set({ loading: true, error: null });
    try {
      const shows = await showService.getShows(user.uid);
      set({ shows, initialized: true });
    } catch (error) {
      set({ error: 'Failed to load shows' });
      console.error('Error loading shows:', error);
    } finally {
      set({ loading: false });
    }
  },

  addShow: async (show: Show) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const response = await axios.get(`https://api.tvmaze.com/shows/${show.id}/episodes`);
      const episodes: Episode[] = response.data.map((ep: any) => ({
        ...ep,
        watched: false,
        note: '',
      }));

      await showService.addShow(user.uid, show, episodes);
      const shows = await showService.getShows(user.uid);
      set({ shows });
    } catch (error) {
      set({ error: 'Failed to add show' });
      console.error('Error adding show:', error);
    } finally {
      set({ loading: false });
    }
  },

  toggleEpisodeWatched: async (showId: number, episodeId: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { shows } = get();
    const updatedShows = shows.map((show) => {
      if (show.id === showId) {
        return {
          ...show,
          episodes: show.episodes.map((ep) =>
            ep.id === episodeId ? { ...ep, watched: !ep.watched } : ep
          ),
        };
      }
      return show;
    });

    set({ shows: updatedShows });
    const updatedShow = updatedShows.find((s) => s.id === showId);
    if (updatedShow) {
      await showService.updateShow(user.uid, updatedShow);
    }
  },

  updateEpisodeNote: async (showId: number, episodeId: number, note: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { shows } = get();
    const updatedShows = shows.map((show) => {
      if (show.id === showId) {
        return {
          ...show,
          episodes: show.episodes.map((ep) =>
            ep.id === episodeId ? { ...ep, note } : ep
          ),
        };
      }
      return show;
    });

    set({ shows: updatedShows });
    const updatedShow = updatedShows.find((s) => s.id === showId);
    if (updatedShow) {
      await showService.updateShow(user.uid, updatedShow);
    }
  },

  setCurrentSeason: async (showId: number, season: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { shows } = get();
    const updatedShows = shows.map((show) =>
      show.id === showId ? { ...show, currentSeason: season } : show
    );

    set({ shows: updatedShows });
    const updatedShow = updatedShows.find((s) => s.id === showId);
    if (updatedShow) {
      await showService.updateShow(user.uid, updatedShow);
    }
  },

  deleteShow: async (showId: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true, error: null });
    try {
      await showService.deleteShow(user.uid, showId);
      const { shows } = get();
      set({ shows: shows.filter(show => show.id !== showId) });
    } catch (error) {
      set({ error: 'Failed to delete show' });
      console.error('Error deleting show:', error);
    } finally {
      set({ loading: false });
    }
  },

  markAllEpisodesWatched: async (showId: number, season?: number, watched: boolean = true) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { shows } = get();
    const updatedShows = shows.map((show) => {
      if (show.id === showId) {
        return {
          ...show,
          episodes: show.episodes.map((ep) => {
            if (season === undefined || ep.season === season) {
              return { ...ep, watched };
            }
            return ep;
          }),
        };
      }
      return show;
    });

    set({ shows: updatedShows });
    const updatedShow = updatedShows.find((s) => s.id === showId);
    if (updatedShow) {
      await showService.updateShow(user.uid, updatedShow);
    }
  },
}));