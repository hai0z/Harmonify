import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
import {addToLikedList} from '../utils/firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MiniPlayer = () => {
  const navigation = useNavigation<any>();

  const keyboardVisible = useKeyBoardStatus();

  const track = useActiveTrack();

  const [color] = usePlayerStore(state => [state.color]);

  const playerState = usePlaybackState();

  const progress = useProgress(1000);

  const togglePlay = useCallback(async (state: State | undefined) => {
    if (state !== State.Playing) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }, []);
  if (track === undefined) return null;
  return (
    !keyboardVisible && (
      <View
        className="bottom-[59px] h-[60px] flex flex-col justify-center absolute"
        style={{
          width: SCREEN_WIDTH * 0.96,
          transform: [{translateX: (SCREEN_WIDTH * 0.04) / 2}],
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Player')}
          activeOpacity={1}
          style={{
            backgroundColor: useDarkColor(color.dominant),
            flexDirection: 'column',
            borderRadius: 6,
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri: track?.artwork,
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 5,
                marginLeft: 7,
                zIndex: 50,
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
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 14,
                }}>
                {track?.title}
              </TextTicker>

              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                }}
                numberOfLines={1}>
                {track?.artist}
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
              <TouchableOpacity>
                <AntDesign name={'hearto'} size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                className=" mr-4"
                onPress={() => togglePlay(playerState.state)}>
                {playerState.state === State.Buffering ||
                playerState.state === State.Loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Entypo
                    name={
                      playerState.state !== State.Playing
                        ? 'controller-play'
                        : 'controller-paus'
                    }
                    size={30}
                    color="#fff"
                  />
                )}
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
            backgroundColor: '#ffffff50',
          }}>
          <View
            style={{
              width: `${(progress.position / progress.duration) * 100}%`,
              height: 2.5,
              backgroundColor: 'white',
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
