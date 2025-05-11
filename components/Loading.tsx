import {View} from "react-native";
import {GREEN} from "../constants";
import useThemeStore from "../store/themeStore";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";

const Loading = () => {
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);

  const dotStyle = useAnimatedStyle(() => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme !== "amoled" ? COLOR.SECONDARY : GREEN,
    marginHorizontal: 4,
  }));

  const createDotAnimation = (delay: number) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withDelay(delay, withTiming(1.4, {duration: 300})),
              withTiming(1, {duration: 300})
            ),
            -1,
            true
          ),
        },
        {
          translateY: withRepeat(
            withSequence(
              withDelay(delay, withTiming(-15, {duration: 300})),
              withTiming(0, {duration: 300})
            ),
            -1,
            true
          ),
        },
      ],
      opacity: withRepeat(
        withSequence(
          withDelay(delay, withTiming(0.5, {duration: 300})),
          withTiming(1, {duration: 300})
        ),
        -1,
        true
      ),
    }));

  const dot1Style = createDotAnimation(0);
  const dot2Style = createDotAnimation(100);
  const dot3Style = createDotAnimation(200);

  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-row">
        <Animated.View style={[dotStyle, dot1Style]} />
        <Animated.View style={[dotStyle, dot2Style]} />
        <Animated.View style={[dotStyle, dot3Style]} />
      </View>
    </View>
  );
};

export default Loading;
