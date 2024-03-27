import React, {useEffect} from 'react';
import {usePlayerStore} from '../store/playerStore';
import {getColors} from 'react-native-image-colors';
import TrackPlayer from 'react-native-track-player';
import getThumbnail from '../utils/getThumnail';
import nodejs from 'nodejs-mobile-react-native';
import {NULL_URL} from '../constants';
import {getData, storeData} from '../utils/localStorage';
import {objectToTrack} from '../utils/musicControl';
const PlayerContext = React.createContext({});

nodejs.start('main.js');

nodejs.channel.addListener('getLyric', async data => {
  usePlayerStore.getState().setLyrics(data);
});

const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const {
    setLyrics,
    setColor,
    playList,
    setPlayList,
    currentSong,
    setCurrentSong,
  } = usePlayerStore(state => state);

  const getSongColors = async () => {
    if (currentSong?.artwork !== undefined) {
      getColors(currentSong.artwork, {
        fallback: '#0098db',
      }).then(setColor);
    }
  };

  const getLatestSong = async () => {
    const data = await getData('currentSong');
    if (data != null) {
      setCurrentSong(data);
      getSongColors();
    }
  };

  const getDataPlaylist = async () => {
    const data = await getData('playlist');
    if (data != null) {
      setPlayList(data);
    }
  };

  const initPlayer = async () => {
    let dataPlaylist = await getData('playlist');
    let storedSong = await getData('currentSong');
    if (dataPlaylist.items.length > 0 && dataPlaylist) {
      await TrackPlayer.reset();
      setPlayList(dataPlaylist);
      await TrackPlayer.add(
        dataPlaylist.items.map((item: any) => objectToTrack(item)),
      );
      const index = dataPlaylist.items.findIndex(
        (item: any) => item?.encodeId === storedSong?.id,
      );
      await TrackPlayer.skip(index === -1 ? 0 : index);
    } else {
      if (storedSong != null) {
        await TrackPlayer.add(objectToTrack(storedSong));
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
    storeData('currentSong', currentSong);
    getSongColors();
    setLyrics([]);
    nodejs.channel.post('getLyric', currentSong?.id);
  }, [currentSong?.id]);

  return <PlayerContext.Provider value={{}}>{children}</PlayerContext.Provider>;
};

export default PlayerProvider;
