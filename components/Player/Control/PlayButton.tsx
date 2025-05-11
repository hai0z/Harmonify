import {TouchableOpacity} from "react-native";
import React from "react";
import TrackPlayer, {State, usePlaybackState} from "react-native-track-player";
import Entypo from "react-native-vector-icons/Entypo";
import useThemeStore from "../../../store/themeStore";
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
      className="rounded-full items-center justify-center"
      style={{
        backgroundColor: COLOR.TEXT_PRIMARY,
        width: 64,
        height: 64,
        elevation: 4,
      }}>
      <Entypo
        name={
          playerState.state !== State.Playing
            ? "controller-play"
            : "controller-paus"
        }
        size={40}
        color={COLOR.isDark ? "black" : "white"}
      />
    </TouchableOpacity>
  );
};

export default PlayButton;
