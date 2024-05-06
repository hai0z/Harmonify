import React, {useEffect} from 'react';
import {collection, onSnapshot, query} from 'firebase/firestore';
import {auth, db} from '../firebase/config';
import {usePlayerStore} from '../store/playerStore';
import {useUserStore} from '../store/userStore';
import mmkv from '../utils/mmkv';
interface AuthContextType {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}
export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLogin, setIsLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const setLikedPlaylists = useUserStore(state => state.setLikedPlaylists);
  const setMyPlaylists = useUserStore(state => state.setMyPlaylists);
  const setLikedSongs = usePlayerStore(state => state.setLikedSongs);
  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
        setLoading(false);
        const q = query(
          collection(db, `users/${auth.currentUser?.uid}/likedSong`),
        );
        const unsub = onSnapshot(q, querySnapshot => {
          const songs = [] as any;
          querySnapshot.forEach(doc => {
            songs.push(doc.data());
          });
          setLikedSongs(songs);
          mmkv.set('liked-songs', JSON.stringify(songs));
        });
        const q1 = query(
          collection(db, `users/${auth.currentUser?.uid}/likedPlaylists`),
        );
        const unsub1 = onSnapshot(q1, querySnapshot => {
          const likedPlaylists = [] as any;
          querySnapshot.forEach(doc => {
            likedPlaylists.push(doc.data());
          });
          setLikedPlaylists(likedPlaylists);
        });
        const q2 = query(
          collection(db, `users/${auth.currentUser?.uid}/myPlaylists`),
        );
        const unsub2 = onSnapshot(q2, querySnapshot => {
          const myPlaylists = [] as any;
          querySnapshot.forEach(doc => {
            myPlaylists.push(doc.data());
          });
          setMyPlaylists(myPlaylists);
        });
        return () => {
          unsub();
          unsub1();
          unsub2();
        };
      } else {
        setIsLogin(false);
        setLoading(false);
      }
    });
    return () => unsubcribe();
  }, []);

  return (
    <AuthContext.Provider value={{isLogin, setIsLogin, loading}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
