import {View, Text} from 'react-native';
import React, {memo} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useThemeStore from '../store/themeStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {usePlayerStore} from '../store/playerStore';
import {navigation} from '../utils/types/RootStackParamList';

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
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <MaterialIcons
              name="history"
              size={26}
              color={COLOR.TEXT_PRIMARY}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="z-[5]"
          onPress={() => navigation.navigate('SettingStack')}>
          <AntDesign name="setting" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(Header);
