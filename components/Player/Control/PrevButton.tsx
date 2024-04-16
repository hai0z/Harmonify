import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useThemeStore from '../../../store/themeStore';
import TrackPlayer from 'react-native-track-player';
const PrevButton = () => {
  const {COLOR} = useThemeStore(state => state);
  const PrevTrack = async () => {
    await TrackPlayer.skipToPrevious();
  };
  return (
    <TouchableOpacity
      onPress={PrevTrack}
      style={{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AntDesign name="stepbackward" size={32} color={COLOR.TEXT_PRIMARY} />
    </TouchableOpacity>
  );
};

export default PrevButton;
