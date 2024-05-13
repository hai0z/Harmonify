import {View} from 'react-native';
import React from 'react';
import TrackSlider from './Control/TrackSlider';
import PlayButton from './Control/PlayButton';
import NextButton from './Control/NextButton';
import PrevButton from './Control/PrevButton';
import LoopButton from './Control/LoopButton';
import Animated from 'react-native-reanimated';
import ShuffleButton from './Control/ShuffleButton';
const Player = () => {
  return (
    <View>
      <TrackSlider />
      <Animated.View className="flex flex-row justify-between pt-4">
        <ShuffleButton />
        <PrevButton />
        <PlayButton />
        <NextButton />
        <LoopButton />
      </Animated.View>
    </View>
  );
};

export default Player;
