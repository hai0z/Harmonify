import {TouchableOpacity} from 'react-native';
import React, {memo} from 'react';

import useThemeStore from '../../../store/themeStore';
import TrackPlayer from 'react-native-track-player';
import {usePlayerStore} from '../../../store/playerStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {objectToTrack} from '../../../service/trackPlayerService';
const NextButton = () => {
  const {COLOR} = useThemeStore(state => state);
  const {
    nextTrackLoaded,
    setNextTrackLoaded,
    isPlayFromLocal,
    currentSong,
    setCurrentSong,
    setTempSong,
  } = usePlayerStore();
  const handleNext = async () => {
    if (!isPlayFromLocal) setNextTrackLoaded(false);
    const nextTrack = usePlayerStore
      .getState()
      .playList.items.findIndex(item => item.encodeId === currentSong?.id);
    const queue = usePlayerStore.getState().playList.items;
    if (nextTrack === queue.length - 1) {
      setCurrentSong(objectToTrack(queue[0]));
      setTempSong(queue[0]);
    } else {
      setCurrentSong(objectToTrack(queue[nextTrack + 1]));
      setTempSong(queue[nextTrack + 1]);
    }
    TrackPlayer.skipToNext();
  };
  console.log('next btn');
  return (
    <TouchableOpacity
      onPress={handleNext}
      disabled={!nextTrackLoaded}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: nextTrackLoaded ? 1 : 0.5,
      }}>
      <MaterialCommunityIcons
        name="skip-next"
        size={48}
        color={COLOR.TEXT_PRIMARY}
      />
    </TouchableOpacity>
  );
};

export default memo(NextButton);
