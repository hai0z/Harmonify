import {View, Text} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Animated} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useThemeStore from '../store/themeStore';
const Header = () => {
  const COLOR = useThemeStore(state => state.COLOR);
  const navigation = useNavigation<any>();
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Chào buổi sáng';
    } else if (hour < 18) {
      return 'Chào buổi chiều';
    } else {
      return 'Chào buổi tối';
    }
  };
  return (
    <View className="h-16 w-full flex flex-row justify-between items-center px-4 mt-[35px] z-[999]">
      <View className="flex flex-row gap-2 items-center">
        <Animated.Text
          className="font-bold capitalize text-xl z-[5]"
          style={{color: COLOR.TEXT_PRIMARY}}>
          {greeting()}
        </Animated.Text>
      </View>
      <TouchableOpacity
        className="z-[5]"
        onPress={() => navigation.navigate('Setting')}>
        <AntDesign name="setting" size={24} color={COLOR.TEXT_PRIMARY} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
