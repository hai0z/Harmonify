import {View, Text, ViewComponent} from 'react-native';
import React from 'react';
import useThemeStore from '../../store/themeStore';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {themeMap} from '../../constants/theme';
import {Appearance} from 'react-native';
import {navigation} from '../../utils/types/RootStackParamList';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {usePlayerStore} from '../../store/playerStore';
import {StatusBar} from 'expo-status-bar';
import Entypo from 'react-native-vector-icons/Entypo';
import {GREEN} from '../../constants';
const ThemeScreens = () => {
  const {theme, setTheme, COLOR} = useThemeStore(state => state);

  const offlineMode = usePlayerStore(state => state.offlineMode);
  const selectedColor = themeMap[theme]?.BACKGROUND;

  const bg = useSharedValue(`${selectedColor}`);

  const handleChangeColor = (color: string) => {
    bg.value = withTiming(`${color}`, {duration: 550});
  };

  const navigation = useNavigation<navigation<'Setting'>>();

  return (
    <Animated.ScrollView
      style={{flex: 1, backgroundColor: bg}}
      className="pt-[35px] px-6">
      {offlineMode && <StatusBar style="auto" backgroundColor="transparent" />}

      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          style={{color: COLOR?.TEXT_PRIMARY}}
          className="text-xl font-bold">
          Chủ đề
        </Text>
      </View>
      <View className="flex mt-8">
        <Text style={{color: COLOR?.TEXT_PRIMARY}}>Chủ đề sáng</Text>
        {['light', 'lemon', 'pastel', 'winter', 'silky'].map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex flex-row py-2 my-1 justify-between items-center"
            onPress={() => {
              Appearance.setColorScheme('light');
              setTheme(item as keyof typeof themeMap);
              handleChangeColor(
                themeMap[item as keyof typeof themeMap]?.BACKGROUND,
              );
            }}>
            <View className="flex flex-row items-center">
              <View
                className="items-center justify-center"
                style={{
                  width: 20,
                  height: 16,
                  borderRadius: 10,
                  backgroundColor:
                    (theme as string) === item
                      ? COLOR?.TEXT_PRIMARY
                      : 'transparent',
                  padding: 2,
                }}>
                <View
                  key={index}
                  className="flex flex-row items-center  h-3 w-4 rounded-full justify-center"
                  style={{
                    backgroundColor:
                      themeMap[item as keyof typeof themeMap]?.PRIMARY,
                  }}></View>
              </View>
              <Text
                style={{color: COLOR?.TEXT_PRIMARY}}
                className="capitalize ml-2">
                {item}
              </Text>
            </View>
            {theme === item && (
              <Entypo
                name="check"
                size={18}
                color={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex mt-4">
        <Text style={{color: COLOR.TEXT_PRIMARY}}>Chủ đề tối</Text>
        {['dark', 'halloween', 'bussiness', 'night', 'amoled'].map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              className="flex flex-row my-1 justify-between py-2"
              onPress={() => {
                Appearance.setColorScheme('light');
                setTheme(item as keyof typeof themeMap);
                handleChangeColor(
                  themeMap[item as keyof typeof themeMap]?.BACKGROUND,
                );
              }}>
              <View className="flex flex-row items-center justify-center">
                <View
                  className="items-center justify-center"
                  style={{
                    width: 20,
                    height: 16,
                    borderRadius: 10,
                    backgroundColor:
                      (theme as string) === item
                        ? COLOR?.TEXT_PRIMARY
                        : 'transparent',
                    padding: 2,
                  }}>
                  <View
                    key={index}
                    className="flex flex-row items-center  h-3 w-4 rounded-full justify-center"
                    style={{
                      backgroundColor:
                        themeMap[item as keyof typeof themeMap]?.PRIMARY,
                    }}></View>
                </View>
                <Text
                  style={{color: COLOR?.TEXT_PRIMARY}}
                  className="capitalize ml-2">
                  {item}
                </Text>
              </View>
              {theme === item && (
                <Entypo
                  name="check"
                  size={18}
                  color={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
                />
              )}
            </TouchableOpacity>
          ),
        )}
      </View>
    </Animated.ScrollView>
  );
};

export default ThemeScreens;
