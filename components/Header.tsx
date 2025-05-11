import {View, Text} from "react-native";
import React, {memo} from "react";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native-gesture-handler";
import useThemeStore from "../store/themeStore";
import {usePlayerStore} from "../store/playerStore";
import {navigation} from "../utils/types/RootStackParamList";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {FadeIn} from "react-native-reanimated";

const Header = () => {
  const COLOR = useThemeStore(state => state.COLOR);
  const offlineMode = usePlayerStore(state => state.offlineMode);
  const navigation = useNavigation<navigation<"Home">>();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Chào buổi sáng";
    } else if (hour < 18) {
      return "Chào buổi chiều";
    } else {
      return "Chào buổi tối";
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="h-16 w-full flex flex-row justify-between items-center px-6 mt-[35px] z-[999]">
      <View className="flex flex-row gap-3 items-center">
        <Text
          className="font-bold capitalize text-2xl z-[5]"
          style={{color: COLOR.TEXT_PRIMARY}}>
          {greeting()}
        </Text>
      </View>

      <View className="flex flex-row gap-6">
        {!offlineMode && (
          <TouchableOpacity
            className="bg-white/10 p-2 rounded-full"
            activeOpacity={0.7}
            onPress={() => navigation.navigate("History")}>
            <Ionicons
              name="time-outline"
              size={24}
              color={COLOR.TEXT_PRIMARY}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="bg-white/10 p-2 rounded-full"
          activeOpacity={0.7}
          onPress={() => navigation.navigate("SettingStack")}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={COLOR.TEXT_PRIMARY}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default memo(Header);
