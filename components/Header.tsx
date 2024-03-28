import {View, Text} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Animated} from 'react-native';
const Header = () => {
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
    <View className="h-16 w-full flex flex-row justify-between items-center px-4 mt-[35px]">
      <View className="flex flex-row gap-2 items-center">
        <Animated.Text
          className="font-bold capitalize text-xl  z-[5]"
          style={{color: '#ffffff'}}>
          {greeting()}
        </Animated.Text>
      </View>
    </View>
  );
};

export default Header;
