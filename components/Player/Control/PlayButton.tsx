import {ActivityIndicator, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import Entypo from 'react-native-vector-icons/Entypo';
const PlayButton = () => {
  const playerState = usePlaybackState();
  const togglePlay = useCallback(async (state: State | undefined) => {
    if (state !== State.Playing) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }, []);
  return (
    <TouchableOpacity
      onPress={() => togglePlay(playerState.state)}
      style={{
        width: 60,
        height: 60,
        borderRadius: 9999,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Entypo
        name={
          playerState.state !== State.Playing
            ? 'controller-play'
            : 'controller-paus'
        }
        size={36}
        color="#000"
      />
    </TouchableOpacity>
  );
};

export default PlayButton;
