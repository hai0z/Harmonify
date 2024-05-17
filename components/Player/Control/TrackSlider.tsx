import {View, Text} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import TrackPlayer, {
  useActiveTrack,
  useProgress,
} from 'react-native-track-player';
import Slider from '@react-native-assets/slider';
import caculateTime, {seconds2MMSS} from '../../../utils/caculateMusicTime';
import useThemeStore from '../../../store/themeStore';

const TrackSlider = () => {
  const COLOR = useThemeStore(state => state.COLOR);
  const progess = useProgress(1000);

  const track = useActiveTrack();

  const time = useMemo(() => {
    if (track?.duration) {
      return caculateTime(
        Math.floor(track.duration),
        Math.floor(progess.position),
      );
    }
  }, [progess.position, track?.id]);

  const onSlidingComplete = useCallback(async (value: number) => {
    TrackPlayer.pause();
    TrackPlayer.seekTo(value);
    TrackPlayer.play();
  }, []);

  return (
    <View>
      <Slider
        minimumValue={0}
        step={1}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        value={progess.position}
        onSlidingComplete={onSlidingComplete}
        onSlidingStart={() => TrackPlayer.pause()}
        slideOnTap
        maximumValue={progess.duration - 2}
        thumbStyle={{
          height: 8,
          width: 8,
          backgroundColor: COLOR.TEXT_PRIMARY,
        }}
        trackStyle={{
          height: 3.25,
          backgroundColor: COLOR.isDark ? '#ffffff20' : '#00000020',
        }}
        minTrackStyle={{
          backgroundColor: COLOR.isDark ? '#ffffff' : '#000000',
        }}
        style={{
          height: 20,
        }}
      />
      <View className="flex flex-row justify-between items-center">
        <Text
          className="text-[12px] font-semibold"
          style={{color: `${COLOR.TEXT_PRIMARY}90`}}>
          {seconds2MMSS(Math.floor(progess.position))}
        </Text>
        <Text
          className="text-[12px] font-semibold"
          style={{color: `${COLOR.TEXT_PRIMARY}90`}}>
          {time?.totalTime}
        </Text>
      </View>
    </View>
  );
};

export default TrackSlider;
