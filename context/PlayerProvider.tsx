import React, {useEffect} from 'react';
import {usePlayerStore} from '../store/playerStore';
import {getLyric} from '../apis/lyric';
import {getColors} from 'react-native-image-colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import nodejs from 'nodejs-mobile-react-native';
const PlayerContext = React.createContext({});

const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const {
    setLyrics,
    currentSong,
    setColor,
    setCurrentSong,
    playList,
    setPlayList,
  } = usePlayerStore(state => state);

  const getSongColors = async () => {
    getColors(currentSong?.artwork!, {
      fallback: '#0098db',
      quality: 'lowest',
      pixelSpacing: 100,
    }).then(setColor);
  };

  const getSongLyric = async () => {
    setLyrics([]);
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

  useEffect(() => {
    (async () => {
      try {
        let data = await AsyncStorage.getItem('playlist');
        if (data !== null) {
          setPlayList(JSON.parse(data));
        }
      } catch (e) {
        console.log(e);
      }
    })();
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
        let data = await AsyncStorage.getItem('currentSong');
        if (data !== null) {
          const s = JSON.parse(data);
          nodejs.channel.post('initSong', s?.id);
          setCurrentSong(s);
          nodejs.channel.addListener('initSong', async data => {
            TrackPlayer.load({
              ...s,
              url: data['128'],
            });
          });

          getSongColors();
          getSongLyric();
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('currentSong', JSON.stringify(currentSong));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [currentSong?.id]);

  useEffect(() => {
    getSongColors();
  }, [currentSong?.id]);

  useEffect(() => {
    getSongLyric();
  }, [currentSong?.id]);

  return <PlayerContext.Provider value={{}}>{children}</PlayerContext.Provider>;
};

export default PlayerProvider;
