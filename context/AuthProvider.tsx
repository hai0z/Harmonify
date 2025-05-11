import React, {useEffect, useCallback} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {auth, db} from "../firebase/config";
import {usePlayerStore} from "../store/playerStore";
import {useUserStore} from "../store/userStore";
import mmkv from "../utils/mmkv";

interface AuthContextType {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType
);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLogin, setIsLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const setLikedPlaylists = useUserStore(state => state.setLikedPlaylists);
  const setMyPlaylists = useUserStore(state => state.setMyPlaylists);
  const setLikedSongs = usePlayerStore(state => state.setLikedSongs);

  const handleSnapshot = useCallback(
    (querySnapshot: any, setter: Function, storageKey?: string) => {
      const items: any[] = [];
      querySnapshot.forEach((doc: any) => {
        items.push(doc.data());
      });
      setter(items);
      if (storageKey) {
        mmkv.set(storageKey, JSON.stringify(items));
      }
    },
    []
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
        setLoading(false);

        const unsubscribers: Function[] = [];

        // Listen to liked songs
        const likedSongsQuery = query(
          collection(db, `users/${auth.currentUser?.uid}/likedSong`)
        );
        const likedSongsUnsub = onSnapshot(likedSongsQuery, querySnapshot =>
          handleSnapshot(querySnapshot, setLikedSongs, "liked-songs")
        );
        unsubscribers.push(likedSongsUnsub);

        // Listen to liked playlists
        const likedPlaylistsQuery = query(
          collection(db, `users/${auth.currentUser?.uid}/likedPlaylists`)
        );
        const likedPlaylistsUnsub = onSnapshot(
          likedPlaylistsQuery,
          querySnapshot => handleSnapshot(querySnapshot, setLikedPlaylists)
        );
        unsubscribers.push(likedPlaylistsUnsub);

        // Listen to my playlists
        const myPlaylistsQuery = query(
          collection(db, `users/${auth.currentUser?.uid}/myPlaylists`)
        );
        const myPlaylistsUnsub = onSnapshot(myPlaylistsQuery, querySnapshot =>
          handleSnapshot(querySnapshot, setMyPlaylists)
        );
        unsubscribers.push(myPlaylistsUnsub);

        return () => {
          unsubscribers.forEach(unsub => unsub());
        };
      } else {
        setIsLogin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [handleSnapshot]);

  return (
    <AuthContext.Provider value={{isLogin, setIsLogin, loading}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
