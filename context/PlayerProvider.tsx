import React, {useEffect} from 'react';
import {usePlayerStore} from '../store/playerStore';
import {getLyric} from '../apis/lyric';
import {getColors} from 'react-native-image-colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, {Event, useActiveTrack} from 'react-native-track-player';
import nodejs from 'nodejs-mobile-react-native';
import getThumbnail from '../utils/getThumnail';
const PlayerContext = React.createContext({});

const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const {setLyrics, setColor, playList, setPlayList, setCurrentSong} =
    usePlayerStore(state => state);

  const currentSong = useActiveTrack();

  const getSongColors = async (url: string) => {
    getColors(url, {
      fallback: '#0098db',
      quality: 'lowest',
      pixelSpacing: 100,
    }).then(setColor);
  };

  const getSongLyric = async () => {
    if (currentSong?.id !== null && currentSong?.id !== '') {
      const dataLyric: any = await getLyric(currentSong?.id as string);
      let customLyr: {startTime: number; endTime: number; data: string}[] = [];
      dataLyric.sentences &&
        dataLyric.sentences.forEach((e: {words: []}, _: number) => {
          let lineLyric: string = '';
          let sTime: number = 0;
          let eTime: number = 0;
          e.words.forEach(
            (
              element: {data: string; startTime: number; endTime: number},
              index: number,
            ) => {
              if (index === 0) {
                sTime = element.startTime;
              }
              if (index === e.words.length - 1) {
                eTime = element.endTime;
              }
              lineLyric = lineLyric + element.data + ' ';
            },
          );
          customLyr.push({
            startTime: sTime,
            endTime: eTime,
            data: lineLyric,
          });
        });
      setLyrics(customLyr);
    }
  };

  const initPlayer = async () => {
    let data = await AsyncStorage.getItem('playlist');
    data = JSON.parse(data as string);
    let storedSong = await AsyncStorage.getItem('currentSong');
    storedSong = JSON.parse(storedSong as string);
    if (data != null && storedSong != null) {
      await TrackPlayer.reset();
      const dataPlaylist = data as any;
      const currentSong = storedSong as any;
      setPlayList(dataPlaylist);
      await TrackPlayer.add(
        dataPlaylist.map((item: any) => {
          return {
            id: item?.encodeId,
            url: 'null',
            title: item.title,
            artist: item.artistsNames,
            artwork: getThumbnail(item.thumbnail) || '',
            duration: item.duration,
          };
        }),
      );
      const index = dataPlaylist.findIndex(
        (item: any) => item?.encodeId === currentSong?.id,
      );
      await TrackPlayer.skip(index === -1 ? 0 : index);
    } else {
      setPlayList([]);
      await TrackPlayer.reset();
    }
  };

  useEffect(() => {
    initPlayer();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('playlist', JSON.stringify(playList));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [playList]);

  useEffect(() => {
    (async () => {
      try {
        if (currentSong) {
          await AsyncStorage.setItem(
            'currentSong',
            JSON.stringify(currentSong),
          );
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [currentSong?.id]);

  useEffect(() => {
    getSongColors(currentSong?.artwork ?? '');
  }, [currentSong?.id]);

  useEffect(() => {
    getSongLyric();
  }, [currentSong?.id]);

  return <PlayerContext.Provider value={{}}>{children}</PlayerContext.Provider>;
};

export default PlayerProvider;
