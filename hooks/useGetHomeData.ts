import { useEffect, useState } from "react";
import { usePlayerStore } from "../store/playerStore";
import { useUserStore } from "../store/userStore";
import useInternetState from "./useInternetState";
import { collection, onSnapshot, query } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import nodejs from "nodejs-mobile-react-native";
import mmkv from "../utils/mmkv";
import { getRecentListening } from "../service/firebase";
export default function useGetHomeData() {

  const [dataHome, setdataHome] = useState<any>([]);
  const [dataNewRelease, setDataNewRelease] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataRecent, setDataRecent] = useState<any>([]);
  const { setLikedSongs } = usePlayerStore();
  const { setLikedPlaylists } = useUserStore();
  const isConnected = useInternetState();


  useEffect(() => {
    setLoading(true);
    if (isConnected) {
      nodejs.channel.addListener('home', data => {
        setdataHome(data.filter((e: any) => e.sectionType === 'playlist'));
        setDataNewRelease(
          data.filter((e: any) => e.sectionType === 'new-release')[0],
        );
        mmkv.set(
          'home',
          JSON.stringify(data.filter((e: any) => e.sectionType === 'playlist')),
        );
        mmkv.set(
          'new-release',
          JSON.stringify(
            data.filter((e: any) => e.sectionType === 'new-release')[0],
          ),
        );
      });
      const getRecentList = async () => {
        const res = await getRecentListening();
        setDataRecent(res);
        mmkv.set('recent-listening', JSON.stringify(res));
        setLoading(false);
      };
      Promise.all([getRecentList(), nodejs.channel.post('home')]);
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
      return () => {
        unsub();
        unsub1();
      };
    } else {
      setdataHome(JSON.parse(mmkv.getString('home') || '[]'));
      setDataNewRelease(JSON.parse(mmkv.getString('new-release') || '[]'));
      setDataRecent(JSON.parse(mmkv.getString('recent-listening') || '[]'));
      setLikedSongs(JSON.parse(mmkv.getString('liked-songs') || '[]'));
      setLoading(false);
    }
  }, [isConnected]);

  return { dataHome, dataNewRelease, dataRecent, loading }
}