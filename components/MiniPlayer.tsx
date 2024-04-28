import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import React, {useCallback, useContext, useEffect, useMemo} from 'react';
import useKeyBoardStatus from '../hooks/useKeyBoardStatus';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import Entypo from 'react-native-vector-icons/Entypo';
import useDarkColor from '../hooks/useDarkColor';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '../store/playerStore';
import TextTicker from 'react-native-text-ticker';
import {MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from '../constants';
import useThemeStore from '../store/themeStore';
import tinycolor from 'tinycolor2';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOut,
  LightSpeedInLeft,
  SlideInLeft,
  SlideInRight,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import HeartButton from './HeartButton';
import {PlayerContext} from '../context/PlayerProvider';
import useImageColor from '../hooks/useImageColor';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MiniPlayer = () => {
  const navigation = useNavigation<any>();

  const keyboardVisible = useKeyBoardStatus();

  const {color, currentSong, isPlayFromLocal, lastPosition} = usePlayerStore(
    state => state,
  );

  const {COLOR} = useThemeStore(state => state);

  const playerState = usePlaybackState();

  const progress = useProgress(1000 / 120); //120fps

  const {dominantColor: gradientColor} = useImageColor();
  const bgAnimated = useSharedValue(`transparent`);

  const togglePlay = useCallback(async (state: State | undefined) => {
    if (state !== State.Playing) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }, []);

  const bgAnimatedFn = () => {
    'worklet';
    bgAnimated.value = withTiming(`${gradientColor}`, {
      duration: 550,
      easing: Easing.out(Easing.ease),
    });
  };
  useEffect(() => {
    runOnUI(bgAnimatedFn)();
  }, [color.dominant, gradientColor, keyboardVisible, COLOR]);

  // useEffect(() => {
  //   (async () => {
  //     console.log(lastPosition);
  //     await TrackPlayer.seekTo(lastPosition);
  //   })();
  // }, []);

  if (!currentSong || keyboardVisible) {
    return null;
  }

  return (
    <Animated.View
      className=" flex flex-col justify-center absolute"
      style={[
        {
          width: SCREEN_WIDTH * 0.96,
          height: MINI_PLAYER_HEIGHT,
          transform: [{translateX: SCREEN_WIDTH * 0.02}],
          backgroundColor: bgAnimated,
          borderRadius: 6,
          overflow: 'hidden',
        },
      ]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PlayerStack')}
        activeOpacity={1}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Image
            source={{
              uri: currentSong?.artwork,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 5,
              marginLeft: 7,
              zIndex: 10,
            }}
          />
          <Animated.View
            style={{
              marginLeft: 10,
              flex: 1,
              paddingRight: 20,
              zIndex: 1,
              overflow: 'hidden',
            }}
            key={currentSong?.id}
            entering={FadeInUp.duration(300).delay(300)}
            exiting={FadeOut.duration(300)}>
            <TextTicker
              duration={6000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontWeight: '600',
                fontSize: 14,
              }}>
              {currentSong?.title}
            </TextTicker>

            <Text
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontSize: 12,
              }}
              numberOfLines={1}>
              {currentSong?.artist || currentSong?.artistName}
            </Text>
          </Animated.View>

          <View
            style={{
              marginLeft: 'auto',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}>
            {!isPlayFromLocal && <HeartButton heartIconSize={24} />}

            <TouchableOpacity
              className=" mr-4"
              onPress={() => togglePlay(playerState.state)}>
              <Entypo
                name={
                  playerState.state !== State.Playing
                    ? 'controller-play'
                    : 'controller-paus'
                }
                size={30}
                color={COLOR.TEXT_PRIMARY}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          height: 2.5,
          maxWidth: '100%',
          position: 'relative',
          marginHorizontal: 8,
          bottom: 1.5,
          borderRadius: 2.5,
          backgroundColor: COLOR.isDark ? '#ffffff50' : '#00000025',
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
    </Animated.View>
  );
};

export default MiniPlayer;
