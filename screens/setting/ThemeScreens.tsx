import {View, Text} from "react-native";
import React from "react";
import useThemeStore from "../../store/themeStore";
import Animated, {
  useSharedValue,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import {TouchableOpacity} from "react-native-gesture-handler";
import {themeMap} from "../../constants/theme";
import {Appearance} from "react-native";
import {navigation} from "../../utils/types/RootStackParamList";
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {usePlayerStore} from "../../store/playerStore";
import {StatusBar} from "expo-status-bar";
import Entypo from "react-native-vector-icons/Entypo";
import {GREEN} from "../../constants";
import tinycolor from "tinycolor2";
import {widthPercentageToDP} from "react-native-responsive-screen";

const ThemeScreens = () => {
  const {theme, setTheme, COLOR} = useThemeStore(state => state);
  const offlineMode = usePlayerStore(state => state.offlineMode);
  const selectedColor = themeMap[theme]?.BACKGROUND;
  const bg = useSharedValue(`${selectedColor}`);

  const handleChangeColor = (color: string) => {
    bg.value = withTiming(`${color}`, {duration: 550});
  };

  const navigation = useNavigation<navigation<"Setting">>();

  const renderThemeButton = (item: string, isDark: boolean = false) => (
    <Animated.View
      entering={FadeIn.duration(500).delay(isDark ? 200 : 0)}
      key={item}
      className="my-2">
      <TouchableOpacity
        className="flex flex-row py-3 px-4 rounded-xl justify-between items-center"
        style={{
          backgroundColor: tinycolor(COLOR.BACKGROUND).darken(3).toString(),
          borderWidth: theme === item ? 1 : 0,
          borderColor: theme === "amoled" ? GREEN : COLOR?.PRIMARY,
        }}
        onPress={() => {
          Appearance.setColorScheme("light");
          setTheme(item as keyof typeof themeMap);
          handleChangeColor(
            themeMap[item as keyof typeof themeMap]?.BACKGROUND
          );
        }}>
        <View className="flex flex-row items-center">
          <View
            className="items-center justify-center mr-4"
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: themeMap[item as keyof typeof themeMap]?.PRIMARY,
              padding: 2,
            }}>
            {theme === item && (
              <Entypo name="check" size={16} color={isDark ? "#fff" : "#000"} />
            )}
          </View>
          <Text
            style={{
              color: COLOR?.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(4),
              fontWeight: theme === item ? "600" : "400",
            }}
            className="capitalize">
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Animated.ScrollView
      style={{flex: 1, backgroundColor: bg}}
      className="pt-[35px]"
      showsVerticalScrollIndicator={false}>
      {offlineMode && <StatusBar style="auto" backgroundColor="transparent" />}

      <View className="flex flex-row items-center gap-3 px-4 mb-8">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full"
          style={{
            backgroundColor: tinycolor(COLOR.BACKGROUND).darken(3).toString(),
          }}>
          <Ionicons name="arrow-back" size={22} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          style={{color: COLOR?.TEXT_PRIMARY}}
          className="text-2xl font-bold">
          Chủ đề
        </Text>
      </View>

      <View className="px-4">
        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: "600",
            marginBottom: 12,
          }}>
          Chủ đề sáng
        </Text>
        {["light", "lemon", "pastel", "winter", "silky", "sunset"].map(item =>
          renderThemeButton(item)
        )}

        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: "600",
            marginTop: 24,
            marginBottom: 12,
          }}>
          Chủ đề tối
        </Text>
        {["dark", "halloween", "bussiness", "night", "amoled"].map(item =>
          renderThemeButton(item, true)
        )}
      </View>

      <View className="h-40" />
    </Animated.ScrollView>
  );
};

export default ThemeScreens;
