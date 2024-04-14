import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {usePlayerStore} from '../store/playerStore';
import {FlashList} from '@shopify/flash-list';
import useSyncLyric from '../hooks/useSyncLyric';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import TrackPlayer, {useActiveTrack} from 'react-native-track-player';
import TrackSlider from '../components/Player/Control/TrackSlider';
import PlayButton from '../components/Player/Control/PlayButton';
import {LinearGradient} from 'react-native-linear-gradient';
import tinycolor from 'tinycolor2';
import useThemeStore from '../store/themeStore';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
const OFFSET = 3;
const DEFAULT_LINE = -1;
const LyricScreen = ({route}: {route: any}) => {
  const {lyrics} = route.params;
  let {color: bgColor} = usePlayerStore(state => state);
  const {currentLine} = useSyncLyric(lyrics);

  const currentSong = useActiveTrack();
  const navigation = useNavigation<any>();

  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    setIsScrolling(false);
    !isScrolling &&
      lyricsRef.current?.scrollToIndex({
        index:
          (currentLine as number) === DEFAULT_LINE
            ? 0
            : (currentLine as number) - OFFSET,
        animated: true,
      });
  }, [currentLine]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScrolling(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  const {COLOR} = useThemeStore();

  const bg = useMemo(() => {
    return COLOR.isDark
      ? bgColor.vibrant === '#0098DB'
        ? tinycolor(bgColor.average).isDark()
          ? tinycolor(bgColor.average).lighten(20).toString()
          : bgColor.average
        : bgColor.vibrant
      : tinycolor(bgColor.dominant!).isDark()
      ? tinycolor(bgColor.dominant!).lighten(30).toString()
      : tinycolor(bgColor.dominant!).darken().toString();
  }, [bgColor.dominant, COLOR]);

  const lyricsRef = React.useRef<FlashList<any>>(null);
  return (
    <View
      style={{
        backgroundColor: bg,
      }}
      className="pt-[35px] h-full w-full pb-10">
      <View className="flex flex-row items-center justify-between px-6 py-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-down" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View className="flex-1 flex justify-center items-center">
          <Animated.Text
            entering={FadeInUp.duration(300).delay(300).springify()}
            className=" font-bold z-30"
            style={{color: COLOR.TEXT_PRIMARY}}>
            {currentSong?.title}
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(400).springify().delay(400)}
            className=" font-bold z-30"
            style={{color: COLOR.TEXT_PRIMARY}}>
            {currentSong?.artist}
          </Animated.Text>
        </View>
        <View className="w-4" />
        <LinearGradient
          colors={[bg!, bg!, 'transparent']}
          className="absolute -bottom-10 left-0 right-0 h-16 z-[2]"
        />
      </View>

      <View className="flex-1">
        <FlashList
          onScroll={({nativeEvent}) => {
            setIsScrolling(true);
          }}
          scrollEventThrottle={16}
          ref={lyricsRef}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 40,
            paddingBottom: 40,
          }}
          data={lyrics}
          estimatedItemSize={38}
          initialScrollIndex={currentLine! - OFFSET}
          showsVerticalScrollIndicator={false}
          extraData={currentLine}
          renderItem={({item, index}: any) => (
            <TouchableOpacity
              onPress={() => TrackPlayer.seekTo(+item.startTime / 1000)}>
              <Text
                className=" font-extrabold text-[24px] mb-4"
                style={{
                  color: (currentLine as number) >= index ? 'white' : 'black',
                }}>
                {item.data}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
      <View className="px-6 py-1 justify-center items-center">
        <LinearGradient
          colors={['transparent', bg!, bg!]}
          className="absolute -top-10 left-0 right-0 h-16 z-[2]"
        />
        <View className="w-full z-30">
          <TrackSlider />
        </View>
        <PlayButton />
      </View>
    </View>
  );
};

export default LyricScreen;
