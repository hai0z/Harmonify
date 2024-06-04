import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useThemeStore from '../../../store/themeStore';
import TrackPlayer from 'react-native-track-player';
import {Previous} from 'iconsax-react-native';
const PrevButton = () => {
  const {COLOR} = useThemeStore(state => state);
  const PrevTrack = async () => {
    await TrackPlayer.skipToPrevious();
  };
  return (
    <TouchableOpacity
      onPress={PrevTrack}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Previous size={40} color={COLOR.TEXT_PRIMARY} variant="Bold" />
    </TouchableOpacity>
  );
};

export default PrevButton;
