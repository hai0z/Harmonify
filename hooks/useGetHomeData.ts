import {useEffect, useState} from 'react';
import {usePlayerStore} from '../store/playerStore';
import useInternetState from './useInternetState';
import nodejs from 'nodejs-mobile-react-native';
import mmkv from '../utils/mmkv';
import {getRecentListening} from '../service/firebase';
import {createJSONStorage, persist} from 'zustand/middleware';
import {create} from 'zustand';
import zustandStorage from '../store/zustandStorage';

interface HomeData {
  home: any[];
  newRelease: any;
  hub: any[];
  dataRecent: any[];
  homeLoading: boolean;
  setHomeLoading: (homeLoading: boolean) => void;
  setNewRelease: (data: any) => void;
  setHub: (data: any) => void;
  setRecent: (data: any) => void;
  setHome: (data: any) => void;
}
export const useHomeDataStore = create<HomeData>(set => ({
  home: [],
  newRelease: [],
  hub: [],
  dataRecent: [],
  homeLoading: true,
  setHomeLoading: (homeLoading: boolean) => set({homeLoading}),
  setHome: (data: any) => set({home: data}),
  setNewRelease: (data: any) => set({newRelease: data}),
  setHub: (data: any) => set({hub: data}),
  setRecent: (data: any) => set({dataRecent: data}),
}));
export default function useGetHomeData() {
  const {
    setHomeLoading,
    setHub,
    setNewRelease,
    setRecent,
    setHome,
    homeLoading,
  } = useHomeDataStore();

  const setLikedSongs = usePlayerStore(state => state.setLikedSongs);
  const isConnected = useInternetState();

  useEffect(() => {
    setHomeLoading(true);
    if (isConnected) {
      nodejs.channel.addListener('getHub', data => {
        setHub(data?.genre);
      });
      nodejs.channel.addListener('home', data => {
        setHome(data.filter((e: any) => e.sectionType === 'playlist'));
        setNewRelease(
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
        setRecent(res);
        mmkv.set('recent-listening', JSON.stringify(res));
        setHomeLoading(false);
      };
      Promise.all([
        getRecentList(),
        nodejs.channel.post('home'),
        nodejs.channel.post('getHub'),
      ]);
    } else {
      setHome(JSON.parse(mmkv.getString('home') || '[]'));
      setNewRelease(JSON.parse(mmkv.getString('new-release') || '[]'));
      setRecent(JSON.parse(mmkv.getString('recent-listening') || '[]'));
      setLikedSongs(JSON.parse(mmkv.getString('liked-songs') || '[]'));
      setHome(false);
    }
  }, [isConnected]);
  return {homeLoading};
}
