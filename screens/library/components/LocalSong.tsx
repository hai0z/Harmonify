import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';

import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import useThemeStore from '../../../store/themeStore';

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
  const {COLOR} = useThemeStore(state => state);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('LocalSong');
        }}
        activeOpacity={0.8}
        className="flex-row items-center mt-[20px] mx-[16px]">
        <LinearGradient
          colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
          className="w-16 h-16 justify-center items-center">
          <Entypo name="folder" size={24} color={COLOR.TEXT_PRIMARY} />
        </LinearGradient>
        <View style={{marginLeft: 10}}>
          <Text
            className=" font-bold mb-[5px]"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Bài hát trên thiết bị
          </Text>
          <Text style={{color: COLOR.TEXT_SECONDARY}}>Bài hát đã tải về</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LocalSong;
