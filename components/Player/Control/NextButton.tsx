import {TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import useThemeStore from '../../../store/themeStore';
import TrackPlayer from 'react-native-track-player';
import {Next} from 'iconsax-react-native';
const NextButton = () => {
  const {COLOR} = useThemeStore(state => state);
  const handleNext = async () => {
    await TrackPlayer.skipToNext();
  };
  return (
    <TouchableOpacity
      onPress={handleNext}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Next size={40} color={COLOR.TEXT_PRIMARY} variant="Bold" />
    </TouchableOpacity>
  );
};

export default NextButton;
