import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  SafeAreaViewBase,
  Easing,
} from 'react-native';

import React, {useContext, useEffect, useRef} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {LinearGradient} from 'react-native-linear-gradient';
import {playFromMapping, usePlayerStore} from '../store/playerStore';
import Player from '../components/Player/Player';
import {useNavigation} from '@react-navigation/native';
import Lyric from '../components/Player/Lyric';
import TextTicker from 'react-native-text-ticker';
import ImageSlider from '../components/Player/ImageSlider';
import ArtistCard from '../components/Player/ArtistCard';
import SongInfoCard from '../components/Player/SongInfoCard';
import {useActiveTrack} from 'react-native-track-player';
import useThemeStore from '../store/themeStore';
import {PlayerContext} from '../context/PlayerProvider';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  runOnJS,
  runOnUI,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HeartButton from '../components/HeartButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import useImageColor from '../hooks/useImageColor';
import TrackItemBottomSheet from '../components/bottom-sheet/TrackItemBottomSheet';
import {SafeAreaFrameContext} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
const SCREEN_WIDTH = Dimensions.get('window').width;

const TextAnimated = Animated.createAnimatedComponent(TextTicker);
const PlayerScreens = () => {
  const {playList, tempSong, playFrom, isPlayFromLocal} = usePlayerStore(
    state => state,
  );
  const navigation = useNavigation<any>();

  const currentSong = useActiveTrack();
  const {COLOR} = useThemeStore(state => state);

  const {showBottomSheet} = useContext(PlayerContext);

  const {dominantColor: gradientColor} = useImageColor();

  const bgAnimated = useSharedValue(`transparent`);

  const changeBgAnimated = () => {
    'worklet';
    bgAnimated.value = withTiming(`${gradientColor}95`, {
      duration: 750,
    });
  };
  useEffect(() => {
    runOnUI(changeBgAnimated)();
  }, [gradientColor]);

  return (
    <ScrollView
      style={{backgroundColor: COLOR.BACKGROUND, flex: 1}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100,
      }}>
      <View
        className="pt-[35px]"
        style={{
          height: hp(75) - 35,
          backgroundColor: COLOR.BACKGROUND,
        }}>
        <LinearGradient
          colors={['transparent', COLOR.BACKGROUND]}
          style={[
            StyleSheet.absoluteFill,
            {
              width: SCREEN_WIDTH,
              height: hp(100),
              bottom: 0,
              zIndex: 1,
            },
          ]}
        />
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              width: SCREEN_WIDTH,
              height: hp(100),
              backgroundColor: bgAnimated,
            },
          ]}
        />
        <View className="flex flex-row items-center justify-between px-6">
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            className="z-50"
            onPress={() => navigation.goBack()}>
            <Entypo name="chevron-down" size={24} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text
              className=" uppercase text-center text-[12px]"
              style={{color: COLOR.TEXT_PRIMARY}}>
              Đang phát từ {playFromMapping[playFrom.id]}
            </Text>
            <Text
              className=" font-semibold text-center"
              style={{color: COLOR.TEXT_PRIMARY}}>
              {playFrom.name}
            </Text>
          </View>
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            className="z-50"
            onPress={() => showBottomSheet(tempSong)}>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={COLOR.TEXT_PRIMARY}
            />
          </TouchableOpacity>
        </View>
        {playList?.items?.length > 0 ? (
          <ImageSlider />
        ) : (
          <View
            style={{
              marginTop: hp(10),
              zIndex: 100,
              width: SCREEN_WIDTH,
            }}>
            <View
              style={{
                width: SCREEN_WIDTH,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Animated.Image
                entering={FadeIn.duration(300).springify().delay(300)}
                exiting={FadeOut.duration(300).springify()}
                source={{uri: currentSong?.artwork}}
                className="rounded-md z-20"
                style={{
                  height: SCREEN_WIDTH * 0.85,
                  width: SCREEN_WIDTH * 0.85,
                }}
              />
            </View>
          </View>
        )}
        <View
          className="flex flex-row justify-between mx-6 items-center z-50"
          style={{
            marginTop: hp(10),
          }}>
          <Animated.View
            className="z-50 flex-1 mr-4"
            key={currentSong?.id}
            entering={FadeInUp.duration(300).springify().delay(300)}
            exiting={FadeOut.duration(300)}>
            <TextAnimated
              key={currentSong?.id}
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontFamily: 'GothamBold',
                fontSize: wp(5),
              }}
              duration={10000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={3000}>
              {currentSong?.title}
            </TextAnimated>
            <Animated.Text
              className=" font-semibold"
              style={{color: COLOR.TEXT_SECONDARY}}>
              {currentSong?.artist}
            </Animated.Text>
          </Animated.View>
          {!isPlayFromLocal && <HeartButton heartIconSize={28} />}
        </View>
      </View>
      <View className="px-6 w-full ">
        <View style={{marginTop: hp(8)}}>
          <Player />
        </View>
        <Lyric />
        <ArtistCard />
        <SongInfoCard />
      </View>
      <TrackItemBottomSheet context="player" />
    </ScrollView>
  );
};

export default PlayerScreens;
