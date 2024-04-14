import React, {useCallback, useEffect, useRef} from 'react';
import {usePlayerStore} from '../store/playerStore';
import {getColors} from 'react-native-image-colors';
import TrackPlayer from 'react-native-track-player';
import nodejs from 'nodejs-mobile-react-native';
import {objectToTrack} from '../service/trackPlayerService';
import getThumbnail from '../utils/getThumnail';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import useBottomSheetStore from '../store/bottomSheetStore';
import {NULL_URL} from '../constants';
import {collection, onSnapshot, query} from 'firebase/firestore';
import {auth, db} from '../firebase/config';

interface ContextType {
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  showBottomSheet: (item: any) => void;
}

export const PlayerContext = React.createContext({} as ContextType);

nodejs.start('main.js');

nodejs.channel.addListener('getLyric', async data => {
  usePlayerStore.getState().setLyrics(data);
});

const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const {playList, currentSong, isPlayFromLocal, setColor, setLikedSongs} =
    usePlayerStore(state => state);

  const getSongColors = async () => {
    if (currentSong?.artwork !== null) {
      getColors(getThumbnail(currentSong?.artwork!, 32), {
        fallback: '#0098DB',
        cache: true,
        key: currentSong?.id,
      }).then(setColor);
    }
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {setData} = useBottomSheetStore(state => state);

  const showBottomSheet = useCallback((item: any) => {
    bottomSheetModalRef.current?.present();
    setData(item);
  }, []);

  const initPlayer = async () => {
    console.log(currentSong);
    if (playList.items.length > 0 && playList.id !== '' && currentSong) {
      const index = playList.items.findIndex(
        (item: any) => item?.encodeId === currentSong?.id,
      );
      if (index === -1) {
        await TrackPlayer.add(currentSong);
        return;
      }
      await TrackPlayer.reset();
      await TrackPlayer.add(
        playList.items.map((item: any) => objectToTrack(item)),
      );
      await TrackPlayer.skip(index);
    } else {
      if (currentSong !== null && currentSong.url === NULL_URL) {
        await TrackPlayer.add(objectToTrack(currentSong));
      } else {
        await TrackPlayer.add(currentSong!);
      }
    }
  };

  useEffect(() => {
    const q = query(collection(db, `users/${auth.currentUser?.uid}/likedSong`));
    const unsub = onSnapshot(q, querySnapshot => {
      const songs = [] as any;
      querySnapshot.forEach(doc => {
        songs.push(doc.data());
      });
      setLikedSongs(songs);
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    initPlayer();
  }, []);

  useEffect(() => {
    if (!isPlayFromLocal) {
      if (currentSong) getSongColors();
      nodejs.channel.post('getLyric', currentSong?.id);
    }
  }, [currentSong?.id]);

  return (
    <PlayerContext.Provider value={{bottomSheetModalRef, showBottomSheet}}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
