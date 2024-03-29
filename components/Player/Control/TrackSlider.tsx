import {View, Text} from 'react-native';
import React, {useCallback, useRef} from 'react';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import Slider from '@react-native-assets/slider';
import caculateTime from '../../../utils/caculateMusicTime';

const TrackSlider = () => {
  const progess = useProgress(500);

  const time = caculateTime(progess.duration, progess.position);

  const onSlidingComplete = useCallback((value: number) => {
    TrackPlayer.stop();
    TrackPlayer.seekTo(value);
    TrackPlayer.play();
  }, []);

  return (
    <View>
      <Slider
        minimumValue={0}
        step={0.25}
        value={progess.position}
        onSlidingComplete={onSlidingComplete}
        onSlidingStart={() => TrackPlayer.pause()}
        slideOnTap
        maximumValue={progess.duration}
        thumbStyle={{
          height: 8,
          width: 8,
          backgroundColor: 'white',
        }}
        trackStyle={{
          height: 3.5,
          backgroundColor: '#ffffff90',
        }}
        minTrackStyle={{
          backgroundColor: '#ffffff',
        }}
        style={{
          height: 20,
        }}
      />
      <View className="mt-2 flex flex-row justify-between items-center">
        <Text className="text-white/70 text-[12px] font-medium">
          {time.currentMin}:{time.currentSecond}
        </Text>
        <Text className="text-white/70 text-[12px] font-medium">
          {time.totalTime}
        </Text>
      </View>
    </View>
  );
};

export default TrackSlider;
