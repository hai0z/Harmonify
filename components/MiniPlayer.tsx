import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import React, {useCallback} from 'react';
import useKeyBoardStatus from '../hooks/useKeyBoardStatus';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useDarkColor from '../hooks/useDarkColor';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '../store/playerStore';
import TextTicker from 'react-native-text-ticker';
import {MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from '../constants';
import useToggleLikeSong from '../hooks/useToggleLikeSong';
import useThemeStore from '../store/themeStore';
import tinycolor from 'tinycolor2';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MiniPlayer = () => {
  const navigation = useNavigation<any>();

  const keyboardVisible = useKeyBoardStatus();

  const {color, currentSong, isLoadingTrack, tempSong, isPlayFromLocal} =
    usePlayerStore(state => state);

  const {darkMode, COLOR} = useThemeStore(state => state);
  const playerState = usePlaybackState();

  const progress = useProgress(1000);

  const track = useActiveTrack();

  const {handleAddToLikedList, isLiked} = useToggleLikeSong();

  const gradientColor = darkMode
    ? useDarkColor(color.dominant!, 35)
    : tinycolor(color.dominant!).isDark()
    ? tinycolor(color.dominant!).lighten(75).toString()
    : tinycolor(color.dominant!).lighten(15).toString();

  const togglePlay = useCallback(async (state: State | undefined) => {
    if (state !== State.Playing) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }, []);

  if (
    track === undefined ||
    track === null ||
    currentSong === null ||
    isLoadingTrack
  )
    return null;

  return (
    !keyboardVisible && (
      <View
        className=" flex flex-col justify-center absolute mb-[-1px]"
        style={{
          width: SCREEN_WIDTH * 0.96,
          height: MINI_PLAYER_HEIGHT,
          bottom: TABBAR_HEIGHT,
          transform: [{translateX: (SCREEN_WIDTH * 0.04) / 2}],
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Player')}
          activeOpacity={1}
          style={{
            flexDirection: 'column',
            borderRadius: 6,
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            zIndex: 2,
            backgroundColor: gradientColor,
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
            <View style={{marginLeft: 10, flex: 1, paddingRight: 20}}>
              <TextTicker
                duration={10000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={3000}
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
            </View>

            <View
              style={{
                marginLeft: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}>
              {!isPlayFromLocal && (
                <TouchableOpacity
                  onPress={() => {
                    handleAddToLikedList(tempSong);
                  }}>
                  <AntDesign
                    name={isLiked ? 'heart' : 'hearto'}
                    size={24}
                    color={isLiked ? COLOR.PRIMARY : COLOR.TEXT_PRIMARY}
                  />
                </TouchableOpacity>
              )}

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
            bottom: 4,
            borderRadius: 2.5,
            backgroundColor: darkMode ? '#ffffff90' : '#00000020',
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
    )
  );
};

export default MiniPlayer;
