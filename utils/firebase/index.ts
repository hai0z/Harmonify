import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";


export const addToLikedList = async (
  likedSong: any,
  currentSong: any,
  ListFavourite: any,
): Promise<void> => {
  try {
    const user = auth.currentUser?.uid

    const docRef = doc(db, `users/${user}/likedSong`, currentSong.id);
    if (ListFavourite.some((s: any) => s.id == likedSong.id)) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, likedSong);
    }
  } catch (err: any) {
    console.log(err.message);
  }
};