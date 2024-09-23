import {TouchableOpacity} from 'react-native';
import React from 'react';
import useThemeStore from '../../../store/themeStore';
import TrackPlayer from 'react-native-track-player';
import {usePlayerStore} from '../../../store/playerStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {objectToTrack} from '../../../service/trackPlayerService';
const PrevButton = () => {
  const {COLOR} = useThemeStore(state => state);
  const {
    nextTrackLoaded,
    setNextTrackLoaded,
    isPlayFromLocal,
    currentSong,
    setCurrentSong,
    setTempSong,
  } = usePlayerStore();

  const PrevTrack = async () => {
    if (!isPlayFromLocal) setNextTrackLoaded(false);
    const nextTrack = usePlayerStore
      .getState()
      .playList.items.findIndex(item => item.encodeId === currentSong?.id);
    const queue = usePlayerStore.getState().playList.items;
    if (nextTrack === 0) {
      setCurrentSong(objectToTrack(queue[queue.length - 1]));
      setTempSong(queue[queue.length - 1]);
    } else {
      setCurrentSong(objectToTrack(queue[nextTrack - 1]));
      setTempSong(queue[nextTrack - 1]);
    }
    TrackPlayer.skipToPrevious();
  };
  return (
    <TouchableOpacity
      disabled={!nextTrackLoaded}
      onPress={PrevTrack}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: nextTrackLoaded ? 1 : 0.5,
      }}>
      <MaterialCommunityIcons
        name="skip-previous"
        size={48}
        color={COLOR.TEXT_PRIMARY}
      />
    </TouchableOpacity>
  );
};

export default PrevButton;
