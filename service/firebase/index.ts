import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { usePlayerStore } from "../../store/playerStore";


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

export const followArtist = async (artistId: string) => {
  try {
    const user = auth.currentUser?.uid;
    const docRef = doc(db, `users/${user}/followedArtist`, artistId);
    await setDoc(docRef, { artistId });
  } catch (err: any) {
    console.log(err.message);
  }
};