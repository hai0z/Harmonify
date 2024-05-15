import {ToastAndroid, TouchableOpacity} from 'react-native';
import React from 'react';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useThemeStore from '../../../store/themeStore';
import {usePlayerStore} from '../../../store/playerStore';

const LoopButton = () => {
  const [repeatMode, setRepeatMode] = usePlayerStore(state => [
    state.repeatMode,
    state.setRepeatMode,
  ]);
  const {COLOR} = useThemeStore();

  const handleLoop = async () => {
    if (repeatMode === RepeatMode.Track) {
      setRepeatMode(RepeatMode.Queue);
      ToastAndroid.show('Lặp lại: Tắt', ToastAndroid.SHORT);
    } else {
      setRepeatMode(RepeatMode.Track);
      ToastAndroid.show('Lặp lại: Bật', ToastAndroid.SHORT);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="items-end justify-center flex-1"
      onPress={handleLoop}>
      <MaterialIcons
        name="loop"
        size={24}
        color={
          repeatMode === RepeatMode.Queue ? COLOR.TEXT_PRIMARY : COLOR.SECONDARY
        }
      />
    </TouchableOpacity>
  );
};

export default LoopButton;
