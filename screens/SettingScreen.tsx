import {View, Text} from 'react-native';
import React from 'react';
import useThemeStore from '../store/themeStore';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {themeMap} from '../constants/theme';
import {auth} from '../firebase/config';
const SettingScreen = () => {
  const {theme, setTheme, COLOR} = useThemeStore(state => state);

  const selectedColor = themeMap[theme]?.BACKGROUND;

  const bg = useSharedValue(`${selectedColor}`);

  const handleChangeColor = (color: string) => {
    bg.value = withTiming(`${color}`, {duration: 550});
  };
  return (
    <Animated.ScrollView
      style={{flex: 1, backgroundColor: bg}}
      className="pt-[35px] px-6">
      <Text style={{color: COLOR?.TEXT_PRIMARY}} className="text-xl font-bold">
        Cài đặt
      </Text>
      <View className="mt-8 ">
        <Text style={{color: COLOR?.TEXT_PRIMARY}} className="text-lg">
          Chủ đề
        </Text>
      </View>
      <View className="flex mt-4">
        <Text style={{color: COLOR?.TEXT_PRIMARY}}>Chủ đề sáng</Text>
        {['light', 'lemon', 'pastel', 'garden', 'silky'].map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex flex-row gap-2 my-1"
            onPress={() => {
              setTheme(item as keyof typeof themeMap);
              handleChangeColor(
                themeMap[item as keyof typeof themeMap]?.BACKGROUND,
              );
            }}>
            <View
              className="items-center justify-center"
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor:
                  (theme as string) === item
                    ? COLOR?.TEXT_PRIMARY
                    : 'transparent',
                padding: 2,
              }}>
              <View
                key={index}
                className="flex flex-row items-center  h-4 w-4 rounded-full justify-center"
                style={{
                  backgroundColor:
                    themeMap[item as keyof typeof themeMap]?.PRIMARY,
                }}></View>
            </View>
            <View>
              <Text style={{color: COLOR?.TEXT_PRIMARY}} className="capitalize">
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex mt-4">
        <Text style={{color: COLOR.TEXT_PRIMARY}}>Chủ đề tối</Text>
        {['dark', 'synthWave', 'coffee', 'night', 'amoled'].map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              className="flex flex-row gap-2 my-1"
              onPress={() => {
                setTheme(item as keyof typeof themeMap);
                handleChangeColor(
                  themeMap[item as keyof typeof themeMap]?.BACKGROUND,
                );
              }}>
              <View
                className="items-center justify-center"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor:
                    (theme as string) === item
                      ? COLOR?.TEXT_PRIMARY
                      : 'transparent',
                  padding: 2,
                }}>
                <View
                  key={index}
                  className="flex flex-row items-center  h-4 w-4 rounded-full justify-center"
                  style={{
                    backgroundColor:
                      themeMap[item as keyof typeof themeMap]?.PRIMARY,
                  }}></View>
              </View>
              <View>
                <Text
                  style={{color: COLOR?.TEXT_PRIMARY}}
                  className="capitalize">
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        )}
      </View>
      <View className="mt-8 flex justify-center items-center">
        <TouchableOpacity
          onPress={() => {
            auth.signOut();
          }}
          style={{
            backgroundColor: COLOR?.PRIMARY,
            borderRadius: 10,
          }}
          className="flex justify-center items-center w-28 h-10">
          <Text
            style={{
              color: COLOR?.TEXT_PRIMARY,
            }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.ScrollView>
  );
};

export default SettingScreen;
