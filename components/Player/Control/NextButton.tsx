import {TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {NextTrack} from '../../../utils/musicControl';
const NextButton = () => {
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
      <AntDesign name="stepforward" size={32} color="white" />
    </TouchableOpacity>
  );
};

export default NextButton;
