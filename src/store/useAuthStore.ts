import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useShowStore } from './useShowStore';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Set up auth state listener
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
    if (!user) {
      // Clear shows when user logs out
      useShowStore.getState().clearShows();
    }
  });

  return {
    user: null,
    loading: true,
    error: null,
    signUp: async (email, password) => {
      try {
        set({ error: null });
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },
    signIn: async (email, password) => {
      try {
        set({ error: null });
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },
    signOut: async () => {
      try {
        await firebaseSignOut(auth);
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },
  };
});