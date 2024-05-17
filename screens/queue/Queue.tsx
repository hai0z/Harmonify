import {View, Text} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import useThemeStore from '../../store/themeStore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {playFromMapping, usePlayerStore} from '../../store/playerStore';
import {useNavigation} from '@react-navigation/native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {FlashList} from '@shopify/flash-list';
import Animated, {
  Easing,
  FadeInDown,
  FadeOut,
  runOnUI,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import PlayButton from '../../components/Player/Control/PlayButton';
import PrevButton from '../../components/Player/Control/PrevButton';
import NextButton from '../../components/Player/Control/NextButton';
import TrackPlayer, {Track, useActiveTrack} from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';
import useImageColor from '../../hooks/useImageColor';
import {PlayerContext} from '../../context/PlayerProvider';
import TrackItem from '../../components/track-item/TrackItem';
import TrackItemBottomSheet from '../../components/bottom-sheet/TrackItemBottomSheet';
import ProgressBar from './components/ProgressBar';
import LocalTrackItem from '../../components/track-item/LocalTrackItem';

import {Song} from '../../utils/types/type';
import {getQueue} from 'react-native-track-player/lib/trackPlayer';

const Queue = () => {
  const COLOR = useThemeStore(state => state.COLOR);

  const playFrom = usePlayerStore(state => state.playFrom);

  const playList = usePlayerStore(state => state.playList);

  const isPlayFromLocal = usePlayerStore(state => state.isPlayFromLocal);

  const navigation = useNavigation<any>();

  const currentSong = useActiveTrack();

  const trackIndex = playList.items.findIndex(
    item => item.encodeId == currentSong?.id,
  );

  const [copyPlaylist, setCopyPlaylist] = useState<any[]>([...playList.items]);

  const {dominantColor: gradientColor} = useImageColor();

  const {showBottomSheet} = useContext(PlayerContext);

  const handlePlay = useCallback(
    async (item: Song) => {
      const queue = await getQueue();
      const index = queue.findIndex(track => track.id == item.encodeId);
      await TrackPlayer.skip(index);
    },
    [playList],
  );

  const $bg = useSharedValue(`transparent`);

  const flashListRef = React.useRef<FlashList<any>>(null);

  useEffect(() => {
    const queue = [...playList.items];
    const head = queue.slice(0, trackIndex);
    const tail = queue.slice(trackIndex + 1);
    setCopyPlaylist([...tail, ...head]);
  }, [currentSong?.id, playList.items]);

  const changeBgAnimated = () => {
    'worklet';
    $bg.value = withTiming(`${gradientColor}70`, {
      duration: 750,
      easing: Easing.inOut(Easing.quad),
    });
  };
  useLayoutEffect(() => {
    runOnUI(changeBgAnimated)();
  }, [gradientColor]);

  return (
    <View
      className="pt-[35px] flex-1"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 left-0 right-0"
        style={{height: hp(15), backgroundColor: $bg}}
      />
      <LinearGradient
        style={{height: hp(15)}}
        colors={[`transparent`, `${COLOR.BACKGROUND}`]}
        className="absolute top-0 left-0 right-0 h-full"
      />

      <View className="flex flex-row items-center justify-between px-4">
        <Animated.View
          entering={FadeInDown.duration(300).delay(300)}
          exiting={FadeOut}>
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            className="z-50"
            onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={28} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>
        </Animated.View>
        <View className="flex-1">
          <Animated.Text
            entering={FadeInDown.duration(300).springify()}
            className=" uppercase text-center text-[12px]"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Đang phát từ {playFromMapping[playFrom.id]}
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(300).delay(300).springify()}
            className=" font-semibold text-center"
            style={{color: COLOR.TEXT_PRIMARY}}>
            {playFrom.name}
          </Animated.Text>
        </View>
        <TouchableOpacity className="w-6 h-6 "></TouchableOpacity>
      </View>
      {currentSong?.id && (
        <>
          <View className="mt-4">
            {
              <View>
                <Text
                  style={{
                    color: COLOR.TEXT_PRIMARY,
                    fontSize: widthPercentageToDP(5),
                  }}
                  className="font-bold px-4 mb-4">
                  Đang phát
                </Text>
                <Animated.View
                  entering={FadeInDown.duration(300).springify().damping(200)}
                  key={currentSong?.id}>
                  {!isPlayFromLocal ? (
                    <TrackItem
                      isAlbum={playList.isAlbum}
                      index={0}
                      isActive={
                        currentSong?.id == playList?.items[trackIndex]?.encodeId
                      }
                      showBottomSheet={showBottomSheet}
                      item={playList.items[trackIndex]}
                      onClick={handlePlay}
                    />
                  ) : (
                    <LocalTrackItem
                      item={playList?.items[trackIndex]}
                      onClick={handlePlay}
                    />
                  )}
                </Animated.View>
              </View>
            }
            <View className="px-4 mt-[2px]">
              <Text
                style={{
                  color: COLOR.TEXT_PRIMARY,
                  fontSize: widthPercentageToDP(5),
                }}
                className="font-bold">
                Hàng đợi ({playList?.items.length - 1})
              </Text>
            </View>
          </View>
          <View className="flex-1 pt-4">
            <FlashList
              ref={flashListRef}
              ListFooterComponent={<View className="h-10" />}
              ListEmptyComponent={
                <View className="flex justify-center items-center pt-10">
                  <Text
                    style={{color: COLOR.TEXT_PRIMARY}}
                    className="text-center">
                    Hàng chờ trống...
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              data={copyPlaylist}
              estimatedItemSize={70}
              extraData={playList}
              renderItem={({item, index}) => {
                return !isPlayFromLocal ? (
                  <TrackItem
                    showBottomSheet={showBottomSheet}
                    item={item}
                    onClick={handlePlay}
                    isAlbum={playList.isAlbum}
                    index={index + 1}
                  />
                ) : (
                  <LocalTrackItem item={item} onClick={handlePlay} />
                );
              }}
            />
          </View>
          <View className="py-4 flex items-center justify-center w-full">
            <ProgressBar />
            <View className="flex flex-row justify-between items-center w-[240px]">
              <PrevButton />
              <PlayButton />
              <NextButton />
            </View>
          </View>
        </>
      )}

      {!isPlayFromLocal && <TrackItemBottomSheet />}
    </View>
  );
};

export default Queue;
