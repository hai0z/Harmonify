import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import useKeyBoardStatus from '../../hooks/useKeyBoardStatus';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '../../store/playerStore';
import TextTicker from 'react-native-text-ticker';
import {MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from '../../constants';
import useThemeStore from '../../store/themeStore';
import Animated, {
  FadeInUp,
  FadeOutDown,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HeartButton from '../HeartButton';
import useImageColor from '../../hooks/useImageColor';
import MiniPlayerProgress from './Control/MiniPlayerProgress';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MiniPlayer = () => {
  const navigation = useNavigation<any>();

  const keyboardVisible = useKeyBoardStatus();

  const currentSong = usePlayerStore(state => state.currentSong);

  const isPlayFromLocal = usePlayerStore(state => state.isPlayFromLocal);

  const COLOR = useThemeStore(state => state.COLOR);

  const playerState = usePlaybackState();

  const {dominantColor: gradientColor} = useImageColor();

  const bgAnimated = useSharedValue('#494949');

  const togglePlay = useCallback(async (state: State | undefined) => {
    if (state !== State.Playing) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }, []);

  useEffect(() => {
    bgAnimated.value = withTiming(`${gradientColor}`, {
      duration: 550,
    });
  });

  if (!currentSong || keyboardVisible) {
    return null;
  }
  return (
    <Animated.View exiting={FadeOutDown.springify()}>
      <Animated.View
        className="flex flex-col justify-center absolute"
        style={[
          {
            width: SCREEN_WIDTH * 0.96,
            height: MINI_PLAYER_HEIGHT,
            transform: [{translateX: SCREEN_WIDTH * 0.02}],
            backgroundColor: bgAnimated,
            borderRadius: 6,
            overflow: 'hidden',
            bottom: TABBAR_HEIGHT,
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
          <Animated.View
            key={currentSong?.id}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Animated.Image
              exiting={FadeOutDown.duration(300).springify()}
              entering={FadeInUp.duration(300).springify()}
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
              entering={FadeInUp.duration(300).springify()}
              exiting={FadeOutDown.duration(300).springify()}>
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
                {currentSong?.artist}
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
          </Animated.View>
        </TouchableOpacity>
        <MiniPlayerProgress />
      </Animated.View>
    </Animated.View>
  );
};

export default MiniPlayer;
