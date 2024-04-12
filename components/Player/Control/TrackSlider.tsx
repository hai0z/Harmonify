import {View, Text} from 'react-native';
import React, {useCallback} from 'react';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import Slider from '@react-native-assets/slider';
import caculateTime from '../../../utils/caculateMusicTime';
import useThemeStore from '../../../store/themeStore';

const TrackSlider = () => {
  const COLOR = useThemeStore(state => state.COLOR);
  const progess = useProgress(500);

  const time = caculateTime(progess.duration, progess.position);

  const onSlidingComplete = useCallback(async (value: number) => {
    await TrackPlayer.pause();
    await TrackPlayer.seekTo(value);
    await TrackPlayer.play();
  }, []);

  return (
    <View>
      <Slider
        minimumValue={0}
        step={0.5}
        value={progess.position}
        onSlidingComplete={onSlidingComplete}
        onSlidingStart={() => TrackPlayer.pause()}
        slideOnTap
        maximumValue={progess.duration}
        thumbStyle={{
          height: 8,
          width: 8,
          backgroundColor: COLOR.TEXT_PRIMARY,
        }}
        trackStyle={{
          height: 3.5,
          backgroundColor: COLOR.isDark ? '#ffffff90' : '#00000020',
        }}
        minTrackStyle={{
          backgroundColor: COLOR.isDark ? '#ffffff' : '#000000',
        }}
        style={{
          height: 20,
        }}
      />
      <View className="mt-2 flex flex-row justify-between items-center">
        <Text
          className="text-[12px] font-medium"
          style={{color: COLOR.TEXT_PRIMARY}}>
          {time.currentMin}:{time.currentSecond}
        </Text>
        <Text
          className="text-[12px] font-medium"
          style={{color: COLOR.TEXT_PRIMARY}}>
          {time.totalTime}
        </Text>
      </View>
    </View>
  );
};

export default TrackSlider;
