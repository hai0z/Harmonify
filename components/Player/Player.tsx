import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrackSlider from './Control/TrackSlider';
import PlayButton from './Control/PlayButton';
import NextButton from './Control/NextButton';
import PrevButton from './Control/PrevButton';
import LoopButton from './Control/LoopButton';
import useThemeStore from '../../store/themeStore';
import Animated from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
const Player = () => {
  const {COLOR} = useThemeStore(state => state);
  const navigation = useNavigation<any>();
  return (
    <View>
      <TrackSlider />
      <Animated.View className="flex flex-row justify-between pt-4">
        <LoopButton />
        <PrevButton />
        <PlayButton />
        <NextButton />

        <TouchableOpacity
          onPress={() => navigation.navigate('Queue')}
          activeOpacity={1}
          className="w-[60px] h-[60px] items-end justify-center ">
          <MaterialIcons
            name="queue-music"
            size={24}
            color={COLOR.TEXT_PRIMARY}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Player;
