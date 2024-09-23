import {useEffect, useState} from 'react';
import {usePlayerStore} from '../store/playerStore';
import useInternetState from './useInternetState';
import nodejs from 'nodejs-mobile-react-native';
import mmkv from '../utils/mmkv';
import {getRecentListening} from '../service/firebase';
export default function useGetHomeData() {
  const [dataHome, setdataHome] = useState<any>([]);
  const [dataNewRelease, setDataNewRelease] = useState<any>([]);
  const [hub, setHub] = useState<any>([]);

  const [loading, setLoading] = usePlayerStore(state => [
    state.homeLoading,
    state.setHomeLoading,
  ]);

  const [dataRecent, setDataRecent] = useState<any>([]);
  const setLikedSongs = usePlayerStore(state => state.setLikedSongs);
  const isConnected = useInternetState();

  useEffect(() => {
    setLoading(true);
    if (isConnected) {
      nodejs.channel.addListener('getHub', data => {
        setHub(data.genre);
      });
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
      Promise.all([
        getRecentList(),
        nodejs.channel.post('home'),
        nodejs.channel.post('getHub'),
      ]);
    } else {
      setdataHome(JSON.parse(mmkv.getString('home') || '[]'));
      setDataNewRelease(JSON.parse(mmkv.getString('new-release') || '[]'));
      setDataRecent(JSON.parse(mmkv.getString('recent-listening') || '[]'));
      setLikedSongs(JSON.parse(mmkv.getString('liked-songs') || '[]'));
      setLoading(false);
    }
  }, [isConnected]);

  return {dataHome, dataNewRelease, dataRecent, loading, hub};
}
