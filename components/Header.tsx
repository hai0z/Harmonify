import {View, Text} from 'react-native';
import React, {memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useThemeStore from '../store/themeStore';
import {usePlayerStore} from '../store/playerStore';
import {navigation} from '../utils/types/RootStackParamList';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const Header = () => {
  const COLOR = useThemeStore(state => state.COLOR);
  const offlineMode = usePlayerStore(state => state.offlineMode);
  const navigation = useNavigation<navigation<'Home'>>();
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
      <View className="flex flex-row gap-2 items-center justify-between">
        <Text
          className="font-bold capitalize text-xl z-[5]"
          style={{color: COLOR.TEXT_PRIMARY}}>
          {greeting()}
        </Text>
      </View>
      <View className="flex flex-row gap-4">
        {!offlineMode && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('History')}>
            <MaterialCommunityIcons
              name="history"
              size={24}
              color={COLOR.TEXT_PRIMARY}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SettingStack')}>
          <MaterialCommunityIcons
            name="cog-outline"
            size={24}
            color={COLOR.TEXT_PRIMARY}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(Header);
