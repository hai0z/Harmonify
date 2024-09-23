import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';

import React, {useContext, useLayoutEffect} from 'react';
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
  Easing,
  FadeInUp,
  FadeOut,
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AddCircle} from 'iconsax-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TextAnimated = Animated.createAnimatedComponent(TextTicker);

const PlayerScreens = () => {
  const {tempSong, playFrom, isPlayFromLocal, isBlur} = usePlayerStore(
    state => state,
  );
  const navigation = useNavigation<any>();
  const currentSong = usePlayerStore(state => state.currentSong);

  const {showBottomSheet} = useContext(PlayerContext);

  const {COLOR} = useThemeStore(state => state);
  const {dominantColor: gradientColor} = useImageColor();
  const bgAnimated = useSharedValue(`transparent`);

  const changeBgAnimated = () => {
    'worklet';
    bgAnimated.value = withTiming(`${gradientColor}95`, {
      duration: 750,
      easing: Easing.inOut(Easing.quad),
    });
  };
  useLayoutEffect(() => {
    runOnUI(changeBgAnimated)();
  }, [gradientColor, COLOR]);

  return (
    <ScrollView
      bounces={false}
      style={{backgroundColor: COLOR.BACKGROUND, flex: 1}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100,
      }}>
      <View
        className="pt-[35px]"
        style={{
          backgroundColor: COLOR.BACKGROUND,
        }}>
        <LinearGradient
          locations={isBlur ? [0.5, 1] : [0, 1]}
          colors={['transparent', COLOR.BACKGROUND]}
          style={[
            StyleSheet.absoluteFill,
            {
              width: SCREEN_WIDTH,
              bottom: 10,
              height: hp(125),
              zIndex: 4,
            },
          ]}
        />
        {isBlur && (
          <View
            className="absolute"
            style={[
              {
                width: SCREEN_WIDTH,
                height: hp(125),
                zIndex: 3,
              },
            ]}>
            <Animated.Image
              blurRadius={125}
              key={currentSong?.id}
              exiting={FadeOut.duration(1500)}
              source={{uri: currentSong?.artwork?.replace('r1x1', 'r9x16')}}
              style={[
                StyleSheet.absoluteFill,
                {
                  width: SCREEN_WIDTH,
                  height: hp(125),
                  zIndex: -1,
                },
              ]}></Animated.Image>
            <View
              style={{
                width: SCREEN_WIDTH,
                height: hp(125),
                backgroundColor: COLOR.isDark
                  ? 'rgba(0,0,0,0.25)'
                  : 'rgba(255,255,255,0.6)',
                zIndex: 2,
              }}
            />
          </View>
        )}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              width: SCREEN_WIDTH,
              backgroundColor: bgAnimated,
              height: hp(125),
            },
          ]}
        />
        <View className="flex flex-row items-center justify-between px-6 z-10">
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            className="z-50"
            onPress={() => navigation.goBack()}>
            <Entypo name="chevron-down" size={28} color={COLOR.TEXT_PRIMARY} />
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
            onPress={() => {
              !isPlayFromLocal && showBottomSheet(tempSong);
            }}>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={COLOR.TEXT_PRIMARY}
            />
          </TouchableOpacity>
        </View>

        <ImageSlider />

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
                fontFamily: 'SVN-Gotham Black',
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
      <View className="px-6 w-full" style={{marginTop: 16}}>
        <Player />
        <View className="my-4 flex flex-row items-center justify-between">
          <TouchableOpacity
            disabled={isPlayFromLocal}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() =>
              navigation.navigate('PlaylistStack', {
                screen: 'AddToPlaylist',
                params: {song: tempSong},
              })
            }
            activeOpacity={0.8}
            style={{
              opacity: isPlayFromLocal ? 0.4 : 1,
            }}>
            <AddCircle size={24} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isPlayFromLocal}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => navigation.navigate('Queue')}
            activeOpacity={0.8}
            style={{
              opacity: isPlayFromLocal ? 0.4 : 1,
            }}>
            <MaterialIcons
              name="queue-music"
              size={24}
              color={COLOR.TEXT_PRIMARY}
            />
          </TouchableOpacity>
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
