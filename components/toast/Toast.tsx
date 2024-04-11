import {View, Text, Dimensions, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import useToastStore from '../../store/toastStore';
import {MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from '../../constants';

const PADDING = 8;
const SCREEN_WIDTH = Dimensions.get('window').width;
const Toast = () => {
  const {visible, duration, message} = useToastStore(state => state);

  useEffect(() => {
    const timer = setTimeout(() => {
      useToastStore.setState({visible: false});
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [visible]);
  if (!visible) return null;
  return (
    <View
      className="h-12 bg-white rounded-md flex-col justify-center flex absolute"
      style={{
        width: SCREEN_WIDTH * 0.96,
        transform: [{translateX: (SCREEN_WIDTH * 0.04) / 2}],
        bottom: TABBAR_HEIGHT + MINI_PLAYER_HEIGHT + PADDING,
        elevation: 10,
      }}>
      <Text className="text-black ml-2">{message}</Text>
    </View>
  );
};

export default Toast;
