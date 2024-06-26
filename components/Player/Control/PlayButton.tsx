import {TouchableOpacity} from 'react-native';
import React from 'react';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import Entypo from 'react-native-vector-icons/Entypo';
import useThemeStore from '../../../store/themeStore';
const PlayButton = () => {
  const playerState = usePlaybackState();
  const {COLOR} = useThemeStore(state => state);
  const togglePlay = async (state: State | undefined) => {
    if (state !== State.Playing) {
      TrackPlayer.play();
    } else {
      TrackPlayer.pause();
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => togglePlay(playerState.state)}
      style={{
        borderRadius: 9999,
        backgroundColor: COLOR.TEXT_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
      }}>
      <Entypo
        name={
          playerState.state !== State.Playing
            ? 'controller-play'
            : 'controller-paus'
        }
        size={36}
        color={COLOR.isDark ? 'black' : 'white'}
      />
    </TouchableOpacity>
  );
};

export default PlayButton;
