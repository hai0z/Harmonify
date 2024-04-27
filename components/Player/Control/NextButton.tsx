import {TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import useThemeStore from '../../../store/themeStore';
import TrackPlayer from 'react-native-track-player';
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
      <AntDesign name="stepforward" size={32} color={COLOR.TEXT_PRIMARY} />
    </TouchableOpacity>
  );
};

export default NextButton;
