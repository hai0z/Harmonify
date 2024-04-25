import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';

import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import useThemeStore from '../../../store/themeStore';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import useLibraryStore from '../../../store/useLibraryStore';
import Animated, {FadeIn} from 'react-native-reanimated';

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
  const {viewType} = useLibraryStore();
  return (
    <View className="mt-2 mx-4">
      {viewType === 'list' ? (
        <Animated.View entering={FadeIn.duration(1000)} key={viewType}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LocalSong');
            }}
            activeOpacity={0.8}
            className="flex-row items-center ">
            <LinearGradient
              colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
              className="justify-center items-center"
              style={{
                width: widthPercentageToDP(18),
                height: widthPercentageToDP(18),
              }}>
              <Entypo name="folder" size={24} color={COLOR.TEXT_PRIMARY} />
            </LinearGradient>
            <View style={{marginLeft: 10}}>
              <Text
                className=" font-bold mb-[5px]"
                style={{color: COLOR.TEXT_PRIMARY}}>
                Bài hát trên thiết bị
              </Text>
              <Text style={{color: COLOR.TEXT_SECONDARY}}>
                Bài hát đã tải về
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(1000)} key={viewType}>
          <TouchableOpacity
            style={{width: widthPercentageToDP(33) - 16}}
            onPress={() => {
              navigation.navigate('LocalSong');
            }}
            activeOpacity={0.8}
            className="flex-col items-center flex mb-4">
            <LinearGradient
              style={{
                width: widthPercentageToDP(33) - 16,
                height: widthPercentageToDP(33) - 16,
              }}
              colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
              className="justify-center items-center">
              <Entypo name="folder" size={36} color={COLOR.TEXT_PRIMARY} />
            </LinearGradient>
            <View>
              <Text
                className="font-bold"
                style={{color: COLOR.TEXT_PRIMARY}}
                numberOfLines={2}>
                Bài hát trên thiết bị
              </Text>
              <Text style={{color: COLOR.TEXT_SECONDARY}}>
                Bài hát đã tải về
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default LocalSong;
