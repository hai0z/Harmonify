import React, {useEffect} from 'react';
import {usePlayerStore} from '../store/playerStore';
import {getLyric} from '../apis/lyric';
import {getColors} from 'react-native-image-colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, {Event, useActiveTrack} from 'react-native-track-player';
import getThumbnail from '../utils/getThumnail';
import {DEFAULT_IMG} from '../constants';
const PlayerContext = React.createContext({});

const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const {setLyrics, setColor, playList, setPlayList} = usePlayerStore(
    state => state,
  );

  const currentSong = useActiveTrack();

  const getSongColors = async () => {
    if (currentSong !== undefined) {
      getColors(currentSong.artwork || DEFAULT_IMG, {
        fallback: '#0098db',
        quality: 'lowest',
        pixelSpacing: 1000,
      }).then(setColor);
    }
  };

  const getSongLyric = async () => {
    if (currentSong !== undefined) {
      const dataLyric: any = await getLyric(currentSong?.id as string);
      let customLyr: {startTime: number; endTime: number; data: string}[] = [];
      if (dataLyric) {
        dataLyric?.sentences &&
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
    }
  };

  const initPlayer = async () => {
    let data = await AsyncStorage.getItem('playlist');
    data = JSON.parse(data as string);
    let storedSong = await AsyncStorage.getItem('currentSong');
    storedSong = JSON.parse(storedSong as string);
    const dataPlaylist = data as any;
    const currentSong = storedSong as any;
    if (data != null && data.length > 0) {
      await TrackPlayer.reset();
      setPlayList(dataPlaylist);
      await TrackPlayer.add(
        dataPlaylist.items.map((item: any) => {
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
      if (currentSong != null) {
        await TrackPlayer.add({
          id: currentSong?.id,
          url: 'null',
          title: currentSong.title,
          artist: currentSong.artist,
          artwork: getThumbnail(currentSong.artwork) || '',
          duration: currentSong.duration,
        });
      }
    }
  };

  useEffect(() => {
    initPlayer();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (playList)
          await AsyncStorage.setItem('playlist', JSON.stringify(playList));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [playList.id]);

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
    getSongColors();
  }, [currentSong?.id]);

  useEffect(() => {
    setLyrics([]);
    getSongLyric();
  }, [currentSong?.id]);

  return <PlayerContext.Provider value={{}}>{children}</PlayerContext.Provider>;
};

export default PlayerProvider;
