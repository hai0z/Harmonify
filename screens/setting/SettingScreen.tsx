import {View, Text, Alert, Switch, ToastAndroid} from 'react-native';
import React, {useEffect} from 'react';
import useThemeStore from '../../store/themeStore';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {themeMap} from '../../constants/theme';
import {auth} from '../../firebase/config';
import {navigation} from '../../utils/types/RootStackParamList';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import tinycolor from 'tinycolor2';
import {usePlayerStore} from '../../store/playerStore';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {deleteHistory} from '../../service/firebase';
const SettingScreen = () => {
  const {theme, COLOR} = useThemeStore();
  const {
    savePlayerState,
    setSavePlayerState,
    imageQuality,
    setImageQuality,
    saveHistory,
    setSaveHistory,
  } = usePlayerStore();
  const selectedColor = COLOR.isDark
    ? tinycolor(themeMap[theme]?.BACKGROUND).lighten(5).toString()
    : tinycolor(themeMap[theme]?.BACKGROUND).darken(5).toString();

  const navigation = useNavigation<navigation<'Setting'>>();

  useEffect(() => {
    FastImage.clearDiskCache();
    FastImage.clearMemoryCache();
  }, [imageQuality]);

  return (
    <Animated.ScrollView
      style={{flex: 1, backgroundColor: selectedColor}}
      className="pt-[35px] px-4">
      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          style={{color: COLOR?.TEXT_PRIMARY}}
          className="text-xl font-bold">
          Cài đặt
        </Text>
      </View>

      <View
        className="mt-4 px-1 py-2 rounded-md"
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: '500',
          }}>
          Chủ đề
        </Text>
        <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.8}
          className="flex flex-row justify-between items-center mt-2"
          onPress={() => navigation.navigate('Theme')}>
          <Text
            style={{
              color: COLOR?.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(3.5),
            }}>
            Chủ đề hiện tại
          </Text>
          <View className="flex flex-row items-center">
            <Text
              style={{
                color: COLOR?.PRIMARY,
                fontSize: widthPercentageToDP(3.5),
              }}
              className="mr-2 capitalize">
              {theme}
            </Text>
            <Entypo name="chevron-down" size={18} color={COLOR?.PRIMARY} />
          </View>
        </TouchableOpacity>
      </View>
      <View
        className="mt-4 px-1 py-2 rounded-md"
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: '500',
          }}>
          Ứng dụng
        </Text>
        <View className="flex flex-row justify-between items-center">
          <Text
            style={{
              color: COLOR?.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(3.5),
            }}>
            Lưu lại lịch sử nghe
          </Text>
          <View className="flex flex-row items-center mt-2">
            <Switch
              thumbColor={COLOR?.PRIMARY}
              trackColor={{false: selectedColor, true: selectedColor}}
              value={saveHistory}
              onChange={() => setSaveHistory(!saveHistory)}
            />
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={() => {
              Alert.alert(
                'Xóa lịch sử nghe',
                'Bạn có muốn xoá toàn bộ lịch sử nghe?',
                [
                  {
                    text: 'Huỷ',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: 'Xóa',
                    onPress: async () => {
                      await deleteHistory().then(() => {
                        ToastAndroid.show('Đã xóa', ToastAndroid.SHORT);
                      });
                    },
                    style: 'destructive',
                  },
                ],
              );
            }}>
            <Text
              style={{
                color: COLOR?.PRIMARY,
                fontSize: widthPercentageToDP(3.5),
              }}>
              Xoá lịch sử nghe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        className="mt-4 px-1 py-2 rounded-md"
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: '500',
          }}>
          Chất lượng hình ảnh
        </Text>
        <View className="flex justify-center">
          <View className="flex flex-col">
            {['low', 'medium', 'high'].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex flex-row justify-between items-center mt-2"
                onPress={() => {
                  setImageQuality(item as any);
                }}>
                <Text
                  className="capitalize"
                  style={{
                    color: COLOR?.TEXT_PRIMARY,
                    fontSize: widthPercentageToDP(3.5),
                  }}>
                  {item === 'low'
                    ? 'Thấp'
                    : item === 'medium'
                    ? 'Trung bình'
                    : 'Cao'}
                </Text>
                {imageQuality === item ? (
                  <Entypo name="check" size={18} color={COLOR?.PRIMARY} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View
        className="mt-4 px-1 py-2 rounded-md"
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: '500',
          }}>
          Trình phát nhạc
        </Text>
        <View className="flex flex-row justify-between items-center">
          <Text
            style={{
              color: COLOR?.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(3.5),
            }}>
            Lưu lại trạng thái trình phát nhạc
          </Text>
          <View className="flex flex-row items-center">
            <Switch
              thumbColor={COLOR?.PRIMARY}
              trackColor={{false: selectedColor, true: selectedColor}}
              value={savePlayerState}
              onChange={() => setSavePlayerState(!savePlayerState)}
            />
          </View>
        </View>
      </View>

      <View
        className="mt-4 flex px-1 py-2 rounded-md"
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: '500',
          }}>
          Tài khoản
        </Text>
        <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.8}
          className="mt-2"
          onPress={() => {
            Alert.alert('Đăng xuất', 'Bạn có muốn đăng xuất không?', [
              {
                text: 'Huỷ',
              },
              {
                text: 'Đăng xuất',
                onPress: () => {
                  auth.signOut();
                },
              },
            ]);
          }}>
          <Text
            style={{
              color: COLOR?.PRIMARY,
              fontSize: widthPercentageToDP(3.5),
            }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.ScrollView>
  );
};

export default SettingScreen;
