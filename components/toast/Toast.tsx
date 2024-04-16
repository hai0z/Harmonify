import {View, Text, Dimensions, LayoutAnimation} from 'react-native';
import React, {useEffect, useRef} from 'react';
import useToastStore from '../../store/toastStore';
import {MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from '../../constants';
import Animated, {
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import useThemeStore from '../../store/themeStore';

const PADDING = 8;
const SCREEN_WIDTH = Dimensions.get('window').width;
const Toast = () => {
  const {visible, duration, message} = useToastStore(state => state);
  const {COLOR} = useThemeStore();
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        useToastStore.setState({visible: false});
      }, duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      exiting={FadeOutDown.duration(300).springify()}>
      <View
        className="h-12 rounded-md flex-col justify-center flex absolute"
        style={{
          width: SCREEN_WIDTH * 0.96,
          transform: [{translateX: (SCREEN_WIDTH * 0.04) / 2}],
          bottom: TABBAR_HEIGHT + MINI_PLAYER_HEIGHT + PADDING,
          backgroundColor: COLOR.isDark ? 'white' : '#e4d8b4',
        }}>
        <Text className="text-black ml-2">{message}</Text>
      </View>
    </Animated.View>
  );
};

export default Toast;
