import React, {useEffect} from 'react';
import {usePlayerStore} from '../store/playerStore';
import {getColors} from 'react-native-image-colors';
import TrackPlayer from 'react-native-track-player';
import nodejs from 'nodejs-mobile-react-native';
import {getData, storeData} from '../utils/localStorage';
import {objectToTrack} from '../utils/musicControl';
import getThumbnail from '../utils/getThumnail';
const PlayerContext = React.createContext({});

nodejs.start('main.js');

nodejs.channel.addListener('getLyric', async data => {
  usePlayerStore.getState().setLyrics(data);
});

export const getSongColors = async () => {
  if (usePlayerStore.getState().currentSong?.artwork !== null) {
    getColors(
      getThumbnail(usePlayerStore.getState().currentSong?.artwork!, 48),
      {
        fallback: '#0098DB',
      },
    ).then(usePlayerStore.getState().setColor);
  }
};

const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const {setLyrics, playList, setPlayList, currentSong, setCurrentSong} =
    usePlayerStore(state => state);

  const getLatestSong = async () => {
    const data = await getData('currentSong');
    if (data != null) {
      setCurrentSong(data);
      getSongColors();
      return data;
    }
  };

  const getDataPlaylist = async () => {
    const data = await getData('playlist');
    if (data != null) {
      setPlayList(data);
      return data;
    }
  };

  const initPlayer = async () => {
    let dataPlaylist = await getData('playlist');
    let storedSong = await getData('currentSong');
    console.log({storedSong, dataPlaylist});
    if (dataPlaylist.items.length > 0 && dataPlaylist.id !== '' && storedSong) {
      await TrackPlayer.reset();
      setPlayList(dataPlaylist);
      await TrackPlayer.add(
        dataPlaylist.items.map((item: any) => objectToTrack(item)),
      );
      const index = dataPlaylist.items.findIndex(
        (item: any) => item?.encodeId === storedSong?.id,
      );
      await TrackPlayer.skip(index);
    } else {
      if (storedSong !== null) {
        setCurrentSong(objectToTrack(storedSong));
        await TrackPlayer.add([objectToTrack(storedSong)]);
      }
    }
  };

  useEffect(() => {
    getLatestSong();
    getDataPlaylist();
    initPlayer();
  }, []);

  useEffect(() => {
    storeData('playlist', playList);
  }, [playList.id]);

  useEffect(() => {
    if (currentSong) getSongColors();
    storeData('currentSong', currentSong);
    setLyrics([]);
    nodejs.channel.post('getLyric', currentSong?.id);
  }, [currentSong?.id]);

  return <PlayerContext.Provider value={{}}>{children}</PlayerContext.Provider>;
};

export default PlayerProvider;
