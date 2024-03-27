import {TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../../constants';

const LoopButton = () => {
  const [repeatMode, setRepeatMode] = useState(RepeatMode.Queue);

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
    } else {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode(RepeatMode.Track);
    }
  };

  return (
    <TouchableOpacity
      className="w-[60px] h-[60px] items-end justify-center "
      onPress={handleLoop}>
      <MaterialIcons
        name="loop"
        size={24}
        color={repeatMode === RepeatMode.Queue ? '#fff' : COLOR.PRIMARY}
      />
    </TouchableOpacity>
  );
};

export default LoopButton;
