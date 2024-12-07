import { create } from 'zustand';
import { TrackedShow, Show, Episode } from '../types/show';
import { showService } from '../services/showService';
import { useAuthStore } from './useAuthStore';
import axios from 'axios';

interface ShowStore {
  shows: TrackedShow[];
  loading: boolean;
  error: string | null;
  loadShows: () => Promise<void>;
  addShow: (show: Show) => Promise<void>;
  toggleEpisodeWatched: (showId: number, episodeId: number) => Promise<void>;
  updateEpisodeNote: (showId: number, episodeId: number, note: string) => Promise<void>;
  setCurrentSeason: (showId: number, season: number) => Promise<void>;
  deleteShow: (showId: number) => Promise<void>;
  markAllEpisodesWatched: (showId: number, season?: number, watched?: boolean) => Promise<void>;
  watchUntilEpisode: (showId: number, episodeId: number) => Promise<void>;
  clearShows: () => void;
}

// Helper function to clean object for Firestore
const cleanForFirestore = (obj: any): any => {
  const cleaned: any = {};
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        cleaned[key] = obj[key].map(cleanForFirestore);
      } else if (obj[key] && typeof obj[key] === 'object') {
        cleaned[key] = cleanForFirestore(obj[key]);
      } else {
        cleaned[key] = obj[key];
      }
    }
  });
  
  return cleaned;
};

export const useShowStore = create<ShowStore>((set, get) => ({
  shows: [],
  loading: false,
  error: null,

  clearShows: () => {
    set({ shows: [], loading: false, error: null });
  },

  loadShows: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const shows = await showService.getShows(user.uid);
      set({ shows });
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
        id: ep.id,
        name: ep.name,
        season: ep.season,
        number: ep.number,
        summary: ep.summary,
        watched: false,
      }));

      const trackedShow: TrackedShow = {
        ...show,
        userId: user.uid,
        episodes,
        currentSeason: 1,
      };

      await showService.addShow(user.uid, show, episodes);
      
      const { shows } = get();
      set({ shows: [...shows, trackedShow] });
    } catch (error) {
      set({ error: 'Failed to add show' });
      console.error('Error adding show:', error);
      throw error;
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
        const episodes = show.episodes.map((ep) =>
          ep.id === episodeId
            ? {
                ...ep,
                watched: !ep.watched,
                watchedAt: !ep.watched ? Date.now() : null,
              }
            : ep
        );
        return { ...show, episodes };
      }
      return show;
    });

    set({ shows: updatedShows });
    const updatedShow = updatedShows.find((s) => s.id === showId);
    if (updatedShow) {
      await showService.updateShow(user.uid, cleanForFirestore(updatedShow));
    }
  },

  watchUntilEpisode: async (showId: number, episodeId: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { shows } = get();
    const now = Date.now();
    
    const updatedShows = shows.map((show) => {
      if (show.id === showId) {
        const targetEpisode = show.episodes.find(ep => ep.id === episodeId);
        if (!targetEpisode) return show;

        const episodes = show.episodes.map((ep) => {
          // Mark as watched if:
          // 1. Episode is in an earlier season, or
          // 2. Episode is in the same season but has a lower or equal episode number
          if (ep.season < targetEpisode.season || 
              (ep.season === targetEpisode.season && ep.number <= targetEpisode.number)) {
            return {
              ...ep,
              watched: true,
              watchedAt: ep.watched ? ep.watchedAt : now,
            };
          }
          return ep;
        });
        return { ...show, episodes };
      }
      return show;
    });

    set({ shows: updatedShows });
    const updatedShow = updatedShows.find((s) => s.id === showId);
    if (updatedShow) {
      await showService.updateShow(user.uid, cleanForFirestore(updatedShow));
    }
  },

  updateEpisodeNote: async (showId: number, episodeId: number, note: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { shows } = get();
    const updatedShows = shows.map((show) => {
      if (show.id === showId) {
        const episodes = show.episodes.map((ep) =>
          ep.id === episodeId ? { ...ep, note } : ep
        );
        return { ...show, episodes };
      }
      return show;
    });

    set({ shows: updatedShows });
    const updatedShow = updatedShows.find((s) => s.id === showId);
    if (updatedShow) {
      await showService.updateShow(user.uid, cleanForFirestore(updatedShow));
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
      await showService.updateShow(user.uid, cleanForFirestore(updatedShow));
    }
  },

  markAllEpisodesWatched: async (showId: number, season?: number, watched: boolean = true) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const now = Date.now();
    const { shows } = get();
    const updatedShows = shows.map((show) => {
      if (show.id === showId) {
        const episodes = show.episodes.map((ep) => {
          if (season === undefined || ep.season === season) {
            return {
              ...ep,
              watched,
              watchedAt: watched ? now : null,
            };
          }
          return ep;
        });
        return { ...show, episodes };
      }
      return show;
    });

    set({ shows: updatedShows });
    const updatedShow = updatedShows.find((s) => s.id === showId);
    if (updatedShow) {
      await showService.updateShow(user.uid, cleanForFirestore(updatedShow));
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
}));