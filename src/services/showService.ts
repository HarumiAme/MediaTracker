import { 
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TrackedShow, Show, Episode } from '../types/show';

export const showService = {
  async getShows(userId: string): Promise<TrackedShow[]> {
    const showsRef = collection(db, 'shows');
    const q = query(showsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as TrackedShow);
  },

  async addShow(userId: string, show: Show, episodes: Episode[]): Promise<void> {
    // Create document ID in the format: userId_showId
    const docId = `${userId}_${show.id}`;
    const showRef = doc(db, 'shows', docId);
    const trackedShow: TrackedShow = {
      ...show,
      episodes,
      currentSeason: 1,
      userId
    };
    await setDoc(showRef, trackedShow);
  },

  async updateShow(userId: string, show: TrackedShow): Promise<void> {
    const docId = `${userId}_${show.id}`;
    const showRef = doc(db, 'shows', docId);
    await updateDoc(showRef, show);
  },

  async deleteShow(userId: string, showId: number): Promise<void> {
    const docId = `${userId}_${showId}`;
    const showRef = doc(db, 'shows', docId);
    await deleteDoc(showRef);
  }
};