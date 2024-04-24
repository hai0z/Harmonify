import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import useSyncLyric from '../hooks/useSyncLyric';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import TrackPlayer, {useActiveTrack} from 'react-native-track-player';
import TrackSlider from '../components/Player/Control/TrackSlider';
import PlayButton from '../components/Player/Control/PlayButton';
import {LinearGradient} from 'react-native-linear-gradient';
import useThemeStore from '../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import Animated, {FadeInDown} from 'react-native-reanimated';
import useImageColor from '../hooks/useImageColor';
import use_local_auto_scroll from '../hooks/use_local_auto_scroll';

const OFFSET = 3;

const DEFAULT_LINE = -1;

const LyricScreen = ({route}: {route: any}) => {
  const {lyrics} = route.params;
  const currentLine = useSyncLyric();

  const currentSong = useActiveTrack();
  const navigation = useNavigation<any>();

  const {onScroll, localAutoScroll} = use_local_auto_scroll({
    autoScroll: true,
    autoScrollAfterUserScroll: 2000,
  });

  useEffect(() => {
    if (localAutoScroll) {
      lyricsRef.current?.scrollToIndex({
        index:
          (currentLine as number) === DEFAULT_LINE
            ? 0
            : (currentLine as number) - OFFSET,
        animated: true,
      });
    }
  }, [currentLine, localAutoScroll]);

  const {COLOR} = useThemeStore();

  const {vibrantColor: bg} = useImageColor();

  const lyricsRef = React.useRef<FlashList<any>>(null);
  return (
    <View
      style={{
        backgroundColor: bg,
      }}
      className="pt-[35px] h-full w-full pb-10">
      <View className="flex flex-row items-center justify-between px-6 py-6 ">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-down" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View className="flex-1 flex justify-center items-center">
          <Animated.Text
            entering={FadeInDown.duration(300).springify()}
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

      <View className="flex-1 ">
        <FlashList
          onScroll={onScroll}
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
              onPress={() => {
                TrackPlayer.seekTo(+item.startTime / 1000);
              }}>
              <Text
                className="mb-4"
                style={{
                  color: (currentLine as number) >= index ? 'white' : 'black',
                  fontSize: wp(6),
                  fontFamily: 'GothamBold',
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
