import {ViewStyle} from 'react-native';
import React from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import changeSVGColor from '@killerwink/lottie-react-native-color';
import useThemeStore from '../../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {State, usePlaybackState} from 'react-native-track-player';
import {GREEN} from '../../constants';
interface Props {
  isAlbum?: boolean;
  style?: ViewStyle;
}
const ActiveTrackAnimation = ({isAlbum, style}: Props) => {
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);
  const isPlaying = usePlaybackState();
  return (
    isPlaying.state === State.Playing && (
      <Animated.View
        exiting={FadeOut.duration(300)}
        entering={FadeIn.duration(300)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: !isAlbum ? '#00000075' : COLOR.BACKGROUND,
          justifyContent: 'center',
          alignItems: 'center',
          ...style,
        }}>
        <LottieView
          style={{width: wp(10), height: wp(10)}}
          autoPlay
          speed={1}
          source={changeSVGColor(
            require('../../assets/animation/musicwave.json'),
            theme !== 'amoled' ? COLOR.PRIMARY : GREEN,
          )}
        />
      </Animated.View>
    )
  );
};

export default ActiveTrackAnimation;
