import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { Track } from "react-native-track-player";
import { IPlaylist } from "../../store/playerStore";


export const addToLikedList = async (
  song: Track,
  ListFavourite: IPlaylist,
): Promise<void> => {
  try {
    const user = auth.currentUser?.uid
    const docRef = doc(db, `users/${user}/likedSong`, song.id);
    if (ListFavourite.items.some((s: any) => s.id == song.id)) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, song);
    }
  } catch (err: any) {
    console.log(err.message);
  }
};