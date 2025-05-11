import {View, Text, Dimensions} from "react-native";
import React, {useEffect} from "react";
import useToastStore from "../../store/toastStore";
import {MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from "../../constants";
import Animated, {FadeInDown, FadeOutDown} from "react-native-reanimated";
import useThemeStore from "../../store/themeStore";
import useInternetState from "../../hooks/useInternetState";

const PADDING = 8;
const SCREEN_WIDTH = Dimensions.get("window").width;
const Toast = () => {
  const {visible, duration, message} = useToastStore(state => state);
  const {COLOR} = useThemeStore();
  const isConnected = useInternetState();
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
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      exiting={FadeOutDown.duration(300).springify()}>
      <View
        className="h-14 rounded-xl flex-row items-center justify-start absolute px-4"
        style={{
          width: SCREEN_WIDTH * 0.92,
          transform: [{translateX: (SCREEN_WIDTH * 0.08) / 2}],
          bottom: isConnected
            ? TABBAR_HEIGHT + MINI_PLAYER_HEIGHT + PADDING
            : TABBAR_HEIGHT + MINI_PLAYER_HEIGHT + PADDING + 15,
          backgroundColor: COLOR.isDark ? "rgba(255,255,255,0.95)" : "#FEECE2",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Text
          className="text-base font-medium"
          style={{
            color: COLOR.isDark ? "#1a1a1a" : "#000",
          }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default Toast;
