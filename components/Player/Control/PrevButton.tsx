import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PrevTrack} from '../../../utils/musicControl';
const PrevButton = () => {
  return (
    <TouchableOpacity
      onPress={PrevTrack}
      style={{
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AntDesign name="stepbackward" size={32} color="white" />
    </TouchableOpacity>
  );
};

export default PrevButton;
