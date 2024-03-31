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
import {COLOR, DEFAULT_IMG} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

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
  const navigation = useNavigation<any>();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('LocalSong');
        }}
        activeOpacity={0.8}
        className="flex-row items-center mt-[20px] mx-[10px]">
        <LinearGradient
          colors={[COLOR.PRIMARY, '#bdbdbd']}
          className="w-16 h-16 justify-center items-center">
          <Feather name="folder" size={24} color={COLOR.SECONDARY} />
        </LinearGradient>
        <View style={{marginLeft: 10}}>
          <Text className="text-white font-bold mb-[5px]">
            Bài hát trên thiết bị
          </Text>
          <Text style={{color: '#bdbdbd'}}>Bài hát đã tải về</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LocalSong;
