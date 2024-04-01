import {View, Text, Switch} from 'react-native';
import React from 'react';
import useThemeStore, {darkTheme, lightTheme} from '../store/themeStore';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';

const SettingScreen = () => {
  const {darkMode, setDarkMode, COLOR} = useThemeStore(state => state);
  const selectedColor = darkMode ? darkTheme.BACKGROUND : lightTheme.BACKGROUND;
  const bg = useSharedValue(`${selectedColor}`);
  const handleChangeColor = (color: string) => {
    bg.value = withTiming(`${color}`, {duration: 750});
  };

  return (
    <Animated.View
      style={{flex: 1, backgroundColor: bg}}
      className="pt-[35px] px-6">
      <Text style={{color: COLOR.TEXT_PRIMARY}} className="text-lg font-bold">
        Cài đặt
      </Text>
      <View className="flex flex-row items-center justify-between mt-8">
        <Text style={{color: COLOR.TEXT_PRIMARY}}>Chế độ tối</Text>
        <Switch
          thumbColor={COLOR.PRIMARY}
          trackColor={{false: COLOR.GRADIENT, true: COLOR.TEXT_SECONDARY}}
          onValueChange={() => {
            handleChangeColor(
              darkMode ? lightTheme.BACKGROUND : darkTheme.BACKGROUND,
            );
            setDarkMode();
          }}
          value={darkMode}
        />
      </View>
    </Animated.View>
  );
};

export default SettingScreen;
