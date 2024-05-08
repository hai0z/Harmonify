import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, setDoc, updateDoc, writeBatch } from "firebase/firestore";
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
export const addToLikedPlaylist = async (
  playlist: any,
) => {
  try {
    const user = auth.currentUser?.uid;
    const likedPlaylist = useUserStore.getState().likedPlaylists;
    const docRef = doc(db, `users/${user}/likedPlaylists`, playlist.encodeId);
    if (likedPlaylist.some((pl: any) => pl.encodeId == playlist.encodeId)) {
      await deleteDoc(docRef);
      return false;
    } else {
      await setDoc(docRef, playlist);
      return true;
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
      return false;
    } else {
      await setDoc(docRef, artist);
      return true;
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
    const q = query(collection(db, `users/${user}/history`), orderBy("timestamp", "desc"), limit(100));
    const querySnapshot = await getDocs(q);
    const recentListening: any = []
    querySnapshot.forEach((doc) => {
      recentListening.push(doc.data());
    });
    return recentListening.sort(() => Math.random() - 0.5)
  } catch (err: any) {
    console.log(err.message);
  }
}

export const createPlaylist = async (playlist: {
  encodeId: string;
  title: string;
  thumbnail: string;
  songs: any[];
}) => {
  try {
    const user = auth.currentUser?.uid;
    const docRef = doc(db, `users/${user}/myPlaylists`, playlist.encodeId);
    await setDoc(docRef, playlist);
  } catch (err: any) {
    console.log(err.message);
  }
}
export const addSongToPlaylist = async (playlistId: string, song: any) => {
  try {
    const user = auth.currentUser?.uid;
    const docRef = doc(db, `users/${user}/myPlaylists`, playlistId);
    await updateDoc(docRef, {
      songs: [...useUserStore.getState().myPlaylists.find((pl: any) => pl.encodeId == playlistId).songs, song],
    });
  } catch (err: any) {
    console.log(err.message);
  }
}
export const removeSongFromPlaylist = async (playlistId: string, song: any) => {
  try {
    const user = auth.currentUser?.uid;
    const docRef = doc(db, `users/${user}/myPlaylists`, playlistId);
    await updateDoc(docRef, {
      songs: useUserStore.getState().myPlaylists.find((pl: any) => pl.encodeId == playlistId).songs.filter((s: any) => s.encodeId != song.encodeId),
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export const deletePlaylist = async (playlistId: string) => {
  try {
    const user = auth.currentUser?.uid;
    const docRef = doc(db, `users/${user}/myPlaylists`, playlistId);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.log(err.message);
  }
}
export const updatePlaylist = async (playlist: any) => {
  try {
    const user = auth.currentUser?.uid;
    const docRef = doc(db, `users/${user}/myPlaylists`, playlist.encodeId);
    await updateDoc(docRef, {
      ...playlist,
    });
  } catch (err: any) {
    console.log(err.message);
  }
}
export const deleteHistory = async () => {
  try {
    const user = auth.currentUser?.uid;
    const docRef = collection(db, `users/${user}/history`);
    getDocs(docRef).then((querySnapshot) => {
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      batch.commit();
    })
  } catch (err: any) {
    console.log(err.message);
  }
}