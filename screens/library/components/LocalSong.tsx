import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
import {
  getAll,
  SortSongFields,
  SortSongOrder,
} from 'react-native-get-music-files';
import {FlashList} from '@shopify/flash-list';
import {FlatList} from 'react-native-gesture-handler';
import {DEFAULT_IMG} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const hasPermissions = async () => {
  if (Platform.OS === 'android') {
    let hasPermission: any =
      (await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)) ===
        RESULTS.GRANTED ||
      (await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO)) === RESULTS.GRANTED;
    if (!hasPermission) {
      hasPermission = await requestMultiple([
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      ]);
    }

    return hasPermission;
  }

  if (Platform.OS === 'ios') {
    let hasPermission =
      (await check(PERMISSIONS.IOS.MEDIA_LIBRARY)) === RESULTS.GRANTED;
    if (!hasPermission) {
      hasPermission =
        (await request(PERMISSIONS.IOS.MEDIA_LIBRARY)) === RESULTS.GRANTED;
    }
    return hasPermission;
  }

  return false;
};

export interface ILocalSong {
  title: string;
  author: string;
  album: string;
  genre: string;
  duration: number;
  cover: string;
  url: string;
}

const LocalSong = () => {
  const [localSong, setLocalSong] = React.useState<any>([]);
  useEffect(() => {
    const getLocalSong = async () => {
      const permissions = await hasPermissions();
      if (permissions) {
        const songsOrError = await getAll({
          limit: 20,
          offset: 0,
          coverQuality: 50,
          minSongDuration: 1000,
          sortBy: SortSongFields.TITLE,
          sortOrder: SortSongOrder.DESC,
        });

        if (typeof songsOrError === 'string') {
          // do something with the error
          return;
        } else {
          setLocalSong(
            songsOrError.map((song: any, index) => ({
              title: song.title,
              artistsNames: song.artist,
              duration: song.duration / 1000,
              thumbnail: DEFAULT_IMG,
              url: `file://${song.url}`,
              encodeId: index,
            })),
          );
        }
      }
    };
    getLocalSong();
  }, []);
  const navigation = useNavigation<any>();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('LocalSong', {
            data: localSong,
          });
        }}
        activeOpacity={0.8}
        className="flex-row items-center mt-[20px] mx-[10px]">
        <LinearGradient
          colors={['blue', '#bdbdbd']}
          className="w-20 h-20 justify-center items-center">
          <MaterialCommunityIcons
            name="cellphone-arrow-down"
            size={36}
            color="#fff"
          />
        </LinearGradient>
        <View style={{marginLeft: 10}}>
          <Text className="text-white font-bold mb-[5px]">
            Bài hát trên thiết bị
          </Text>
          <Text style={{color: '#bdbdbd'}}>
            Danh sách phát • {localSong?.length} bài hát
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LocalSong;
