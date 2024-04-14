import {ToastAndroid, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useThemeStore from '../../../store/themeStore';

const LoopButton = () => {
  const [repeatMode, setRepeatMode] = useState(RepeatMode.Queue);
  const {COLOR} = useThemeStore(state => state);
  useEffect(() => {
    (async () => {
      const repeatMode = await TrackPlayer.getRepeatMode();
      setRepeatMode(repeatMode);
    })();
  }, []);

  const handleLoop = async () => {
    if (repeatMode === RepeatMode.Track) {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode(RepeatMode.Queue);
      ToastAndroid.show('Lặp lại: Tắt', ToastAndroid.SHORT);
    } else {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode(RepeatMode.Track);
      ToastAndroid.show('Lặp lại: Bật', ToastAndroid.SHORT);
    }
  };

  return (
    <TouchableOpacity
      className="w-[60px] h-[60px] items-end justify-center "
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
