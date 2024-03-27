import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrackSlider from './Control/TrackSlider';
import PlayButton from './Control/PlayButton';
import NextButton from './Control/NextButton';
import PrevButton from './Control/PrevButton';
import LoopButton from './Control/LoopButton';
const Player = () => {
  return (
    <View>
      <TrackSlider />
      <View className="flex flex-row justify-between pt-4">
        <TouchableOpacity
          activeOpacity={1}
          className="w-[60px] h-[60px] items-start justify-center ">
          <MaterialIcons name="shuffle" size={24} color={'#fff'} />
        </TouchableOpacity>
        <PrevButton />
        <PlayButton />
        <NextButton />
        <LoopButton />
      </View>
    </View>
  );
};

export default Player;
