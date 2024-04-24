import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, where } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { usePlayerStore } from "../../store/playerStore";
import { useUserStore } from "../../store/userStore";


export const addToLikedList = async (
  song: any,
): Promise<void> => {
  try {
    const user = auth.currentUser?.uid;
    const likedSongs = usePlayerStore.getState().likedSongs;
    const docRef = doc(db, `users/${user}/likedSong`, song.encodeId);
    if (likedSongs.some((s: any) => s.encodeId == song.encodeId)) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, song);
    }
  } catch (err: any) {
    console.log(err.message);
  }
};

export const followArtist = async (artist: any) => {
  try {
    const user = auth.currentUser?.uid;
    const listFollow = useUserStore.getState().listFollowArtists;
    const docRef = doc(db, `users/${user}/followedArtist`, artist.id);
    if (listFollow.some((s: any) => s.id == artist.id)) {
      await deleteDoc(doc(db, `users/${user}/followedArtist`, artist.id));
    } else {
      await setDoc(docRef, artist);
    }
  } catch (err: any) {
    console.log(err.message);
  }
};

export const saveToHistory = async (song: any) => {
  try {
    const user = auth.currentUser?.uid;
    const docRef = doc(db, `users/${user}/history`, song.encodeId);
    await setDoc(docRef, {
      ...song,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export const getRecentListening = async () => {
  try {
    const user = auth.currentUser?.uid;
    const q = query(collection(db, `users/${user}/history`), orderBy("timestamp", "desc"), limit(7));
    const querySnapshot = await getDocs(q);
    const recentListening: any = []
    querySnapshot.forEach((doc) => {
      recentListening.push(doc.data());
    });
    return recentListening.slice(1, 7)
  } catch (err: any) {
    console.log(err.message);
  }
}