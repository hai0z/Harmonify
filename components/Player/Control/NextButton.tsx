import {TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {NextTrack} from '../../../service/trackPlayerService';
import useThemeStore from '../../../store/themeStore';
const NextButton = () => {
  const {COLOR} = useThemeStore(state => state);
  const handleNext = async () => {
    NextTrack();
  };
  return (
    <TouchableOpacity
      onPress={handleNext}
      style={{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AntDesign name="stepforward" size={32} color={COLOR.TEXT_PRIMARY} />
    </TouchableOpacity>
  );
};

export default NextButton;
