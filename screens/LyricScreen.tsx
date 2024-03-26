import {View, Text, TouchableOpacity, Animated, Dimensions} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
const OFFSET = 3;
const DEFAULT_LINE = -1;
const LyricScreen = ({route}: {route: any}) => {
  const {lyrics} = route.params;
  let {color: bgColor} = usePlayerStore(state => state);
  const {currentLine} = useSyncLyric(lyrics);

  const currentSong = useActiveTrack();
  const navigation = useNavigation<any>();

  useEffect(() => {
    lyricsRef.current?.scrollToIndex({
      index:
        (currentLine as number) === DEFAULT_LINE
          ? 0
          : (currentLine as number) - OFFSET,
      animated: true,
    });
  }, [currentLine]);

  const bg =
    bgColor.vibrant === '#0098DB'
      ? tinycolor(bgColor.average).isDark()
        ? tinycolor(bgColor.average).lighten(20).toString()
        : bgColor.average
      : bgColor.vibrant;

  const lyricsRef = React.useRef<FlashList<any>>(null);
  return (
    <View
      style={{
        backgroundColor: bg,
      }}
      className="pt-[35px] h-full w-full pb-10">
      <View className="flex flex-row items-center justify-between px-6 py-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-down" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1 flex justify-center items-center">
          <Text className="text-white font-bold">{currentSong?.title}</Text>
          <Text className="text-white font-bold">{currentSong?.artist}</Text>
        </View>
      </View>
      <LinearGradient
        colors={[bg!, bg!, 'transparent']}
        className="absolute top-24 left-0 right-0 bottom-0 h-16 z-[2]"
      />

      <View className="flex-1">
        <FlashList
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
        <LinearGradient
          colors={['transparent', bg!, bg!]}
          className="absolute bottom-0 left-0 right-0 h-8 z-[2]"
        />
      </View>
      <View className="px-6 py-1 justify-center items-center">
        <View className="w-full">
          <TrackSlider />
        </View>
        <PlayButton />
      </View>
    </View>
  );
};

export default LyricScreen;
