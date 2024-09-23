import {View, Text, Alert, Switch, ToastAndroid} from 'react-native';
import React, {useEffect} from 'react';
import useThemeStore from '../../store/themeStore';
import Animated from 'react-native-reanimated';
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
import {GREEN} from '../../constants';
import TrackPlayer from 'react-native-track-player';
import {StatusBar} from 'expo-status-bar';
const SettingScreen = () => {
  const {theme, COLOR} = useThemeStore();
  const {
    savePlayerState,
    setSavePlayerState,
    imageQuality,
    setImageQuality,
    saveHistory,
    setSaveHistory,
    offlineMode,
    setOfflineMode,
    setPlayList,
    setCurrentSong,
    setIsPlayFromLocal,
    setIsFistInit,
    isBlur,
    setIsBlur,
  } = usePlayerStore();
  const {isTrackThumbnailBorder, setIsTrackThumbnailBorder} = useThemeStore();
  const selectedColor = COLOR.isDark
    ? tinycolor(themeMap[theme]?.BACKGROUND).lighten(10).toString()
    : tinycolor(themeMap[theme]?.BACKGROUND).darken().toString();

  const navigation = useNavigation<navigation<'Setting'>>();

  const changeOfflineMode = async () => {
    setCurrentSong(null);
    setOfflineMode(!offlineMode);
    setIsFistInit(false);
    await TrackPlayer.reset();
    await TrackPlayer.pause();
    setPlayList({
      id: '',
      items: [],
    });
    setIsPlayFromLocal(!offlineMode ? true : false);
    navigation.replace(!offlineMode ? 'OfflineStack' : 'Home');
  };
  useEffect(() => {
    FastImage.clearDiskCache();
    FastImage.clearMemoryCache();
  }, [imageQuality]);

  return (
    <Animated.ScrollView
      style={{flex: 1, backgroundColor: COLOR.BACKGROUND}}
      className="pt-[35px] px-4">
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
          Cài đặt
        </Text>
      </View>

      <View
        className="mt-8 px-2 py-2 rounded-md"
        style={{backgroundColor: selectedColor}}>
        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: '500',
          }}>
          Ứng dụng
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
                color: theme === 'amoled' ? GREEN : COLOR?.PRIMARY,
                fontSize: widthPercentageToDP(3.5),
              }}
              className="mr-2 capitalize">
              {theme}
            </Text>
            <Entypo
              name="chevron-down"
              size={18}
              color={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
            />
          </View>
        </TouchableOpacity>
        <View className="flex flex-row justify-between items-center">
          <Text
            style={{
              color: COLOR?.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(3.5),
            }}>
            Chế độ offline
          </Text>
          <View className="flex flex-row items-center">
            <Switch
              thumbColor={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
              trackColor={{false: '#cccccc', true: '#cccccc'}}
              value={offlineMode}
              onChange={changeOfflineMode}
            />
          </View>
        </View>
      </View>
      <View
        className="mt-4 px-2 py-2 rounded-md"
        style={{backgroundColor: selectedColor}}>
        <Text
          style={{
            color: COLOR?.TEXT_PRIMARY,
            fontSize: widthPercentageToDP(4.5),
            fontWeight: '500',
          }}>
          Lịch sử nghe
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
              thumbColor={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
              trackColor={{
                false: '#ccc',
                true: '#ccc',
              }}
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
                color: theme === 'amoled' ? GREEN : COLOR?.PRIMARY,
                fontSize: widthPercentageToDP(3.5),
              }}>
              Xoá lịch sử nghe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        className="mt-4 px-2 py-2 rounded-md"
        style={{backgroundColor: selectedColor}}>
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
                  <Entypo
                    name="check"
                    size={18}
                    color={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
                  />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text
            style={{
              color: COLOR?.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(3.5),
            }}>
            Bo góc hình ảnh
          </Text>
          <View className="flex flex-row items-center">
            <Switch
              thumbColor={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
              trackColor={{false: '#cccccc', true: '#cccccc'}}
              value={isTrackThumbnailBorder}
              onChange={() =>
                setIsTrackThumbnailBorder(!isTrackThumbnailBorder)
              }
            />
          </View>
        </View>
      </View>
      <View
        className="mt-4 px-2 py-2 rounded-md"
        style={{backgroundColor: selectedColor}}>
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
              thumbColor={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
              trackColor={{false: '#cccccc', true: '#cccccc'}}
              value={savePlayerState}
              onChange={() => setSavePlayerState(!savePlayerState)}
            />
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text
            style={{
              color: COLOR?.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(3.5),
            }}>
            Hiệu ứng blur
          </Text>
          <View className="flex flex-row items-center">
            <Switch
              thumbColor={theme === 'amoled' ? GREEN : COLOR?.PRIMARY}
              trackColor={{false: '#cccccc', true: '#cccccc'}}
              value={isBlur}
              onChange={() => setIsBlur(!isBlur)}
            />
          </View>
        </View>
      </View>

      <View
        className="mt-4 flex px-2 py-2 rounded-md"
        style={{backgroundColor: selectedColor}}>
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
              color: theme === 'amoled' ? GREEN : COLOR?.PRIMARY,
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
