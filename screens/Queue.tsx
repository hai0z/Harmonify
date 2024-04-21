import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import useThemeStore from '../store/themeStore';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {playFromMapping, usePlayerStore} from '../store/playerStore';
import {useNavigation} from '@react-navigation/native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlashList} from '@shopify/flash-list';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInLeft,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import PlayButton from '../components/Player/Control/PlayButton';
import PrevButton from '../components/Player/Control/PrevButton';
import NextButton from '../components/Player/Control/NextButton';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';
import useImageColor from '../hooks/useImageColor';
import {PlayerContext} from '../context/PlayerProvider';
import TrackItem from '../components/TrackItem';
import TrackItemBottomSheet from '../components/bottom-sheet/TrackItemBottomSheet';
const Queue = () => {
  const {COLOR} = useThemeStore(state => state);

  const {playFrom, currentSong, playList, tempSong} = usePlayerStore(
    state => state,
  );

  const navigation = useNavigation<any>();

  const trackIndex = playList.items.findIndex(
    item => item.encodeId == currentSong?.id,
  );
  const [copyPlaylist, setCopyPlaylist] = useState([...playList.items]);

  const progress = useProgress(1000 / 120);

  const {dominantColor: gradientColor} = useImageColor();
  const {showBottomSheet} = useContext(PlayerContext);

  const handlePlay = async (item: any) => {
    const index = playList.items.findIndex(
      items => items.encodeId == item?.encodeId,
    );
    await TrackPlayer.skip(index);
  };
  const $bg = useSharedValue(`transparent`);
  useEffect(() => {
    setCopyPlaylist(
      playList.items
        .filter(item => item.encodeId !== currentSong?.id)
        .splice(trackIndex, playList.items.length - trackIndex),
    );
  }, [currentSong?.id]);

  useEffect(() => {
    $bg.value = withTiming(`${gradientColor}`, {duration: 750});
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

      <View className="flex flex-row items-center justify-between px-6">
        <Animated.View
          entering={FadeIn.duration(300).delay(300)}
          exiting={FadeOut}>
          <TouchableOpacity
            className="z-50"
            onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={24} color={COLOR.TEXT_PRIMARY} />
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
        <TouchableOpacity className="w-5 h-5"></TouchableOpacity>
      </View>
      <View className="pt-4 flex-1">
        <FlashList
          ListFooterComponent={<View className="h-10" />}
          ListEmptyComponent={
            <View className="flex justify-center items-center pt-10">
              <Text style={{color: COLOR.TEXT_PRIMARY}} className="text-center">
                Hàng chờ trống...
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View>
                <Text
                  style={{color: COLOR.TEXT_PRIMARY}}
                  className="font-bold px-6 mb-4">
                  Đang phát
                </Text>
                <Animated.View
                  className="px-2"
                  entering={SlideInLeft.duration(300)}
                  key={currentSong?.id}>
                  <TrackItem
                    item={tempSong}
                    showBottomSheet={showBottomSheet}
                    onClick={handlePlay}
                  />
                </Animated.View>
              </View>
              <View className="mt-4">
                <Text
                  style={{color: COLOR.TEXT_PRIMARY}}
                  className="font-bold mb-4 px-6">
                  Hàng đợi
                </Text>
              </View>
            </View>
          }
          data={[...copyPlaylist]}
          estimatedItemSize={70}
          keyExtractor={item => item.encodeId}
          renderItem={({item, index}) => {
            return (
              <View className="px-2">
                <TrackItem
                  showBottomSheet={showBottomSheet}
                  item={item}
                  index={index}
                  onClick={handlePlay}
                />
              </View>
            );
          }}
        />
      </View>
      <View className=" py-4 flex items-center justify-center w-full">
        <View className="absolute top-0 w-full">
          <View
            style={{
              height: 2.5,
              maxWidth: '100%',
              position: 'relative',
              marginHorizontal: 8,
              borderRadius: 2.5,
              backgroundColor: COLOR.isDark ? '#ffffff90' : '#00000020',
              zIndex: 2,
            }}>
            <View
              style={{
                width: `${(progress.position / progress.duration) * 100}%`,
                height: 2.5,
                backgroundColor: COLOR.TEXT_PRIMARY,
                position: 'absolute',
                borderTopLeftRadius: 2.5,
                borderBottomLeftRadius: 2.5,
              }}
            />
          </View>
        </View>
        <Animated.View className="flex flex-row justify-center items-center px-6">
          <PrevButton />
          <PlayButton />
          <NextButton />
        </Animated.View>
      </View>
      <TrackItemBottomSheet />
    </View>
  );
};

export default Queue;
