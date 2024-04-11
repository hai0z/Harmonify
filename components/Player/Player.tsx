import {View, TouchableOpacity, ToastAndroid} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrackSlider from './Control/TrackSlider';
import PlayButton from './Control/PlayButton';
import NextButton from './Control/NextButton';
import PrevButton from './Control/PrevButton';
import LoopButton from './Control/LoopButton';
import useThemeStore from '../../store/themeStore';
import Animated from 'react-native-reanimated';
const Player = () => {
  const {COLOR} = useThemeStore(state => state);
  return (
    <View>
      <TrackSlider />
      <Animated.View className="flex flex-row justify-between pt-4">
        <TouchableOpacity
          onPress={() =>
            ToastAndroid.show(
              'Không làm đc tính năng trộn bài hát',
              ToastAndroid.SHORT,
            )
          }
          activeOpacity={1}
          className="w-[60px] h-[60px] items-start justify-center ">
          <MaterialIcons name="shuffle" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <PrevButton />
        <PlayButton />
        <NextButton />
        <LoopButton />
      </Animated.View>
    </View>
  );
};

export default Player;
