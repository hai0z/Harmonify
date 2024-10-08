import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {Fragment, memo, useEffect, useState} from 'react';
import nodejs from 'nodejs-mobile-react-native';
import getThumbnail from '../../utils/getThumnail';
import {usePlayerStore} from '../../store/playerStore';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {DEFAULT_IMG} from '../../constants';
import useThemeStore from '../../store/themeStore';
import useImageColor from '../../hooks/useImageColor';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const ArtistCard = () => {
  const tempSong = usePlayerStore(state => state.tempSong);
  const [data, setData] = useState<any>(null);

  const navigation = useNavigation<any>();

  const {COLOR} = useThemeStore(state => state);

  const {vibrantColor: bg} = useImageColor();

  useEffect(() => {
    nodejs.channel.addListener('getArtist', (data: any) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (
      !usePlayerStore.getState().isPlayFromLocal &&
      tempSong?.artists?.[0]?.alias &&
      tempSong?.artists?.length > 0
    ) {
      nodejs.channel.post('getArtist', tempSong?.artists[0]?.alias);
    } else {
      setData(null);
    }
  }, [tempSong?.encodeId]);

  if (data === null || usePlayerStore.getState().isPlayFromLocal) {
    return null;
  }
  return (
    <TouchableOpacity
      activeOpacity={1}
      className="w-full rounded-2xl h-[340px] mb-4"
      onPress={() =>
        navigation.navigate('Artists', {
          name: data?.alias,
        })
      }>
      <View className="absolute w-full h-full bg-black/30 z-10 rounded-2xl " />
      <Image
        style={[StyleSheet.absoluteFillObject]}
        source={{
          uri: getThumbnail(data?.thumbnail) || DEFAULT_IMG,
        }}
        className="w-full h-[310px] rounded-2xl"
      />
      <View className="z-20 px-4 py-4">
        <Text
          className="font-bold text-[16px] z-10"
          style={{
            color: '#ffffff',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 1.5,
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
          }}>
          Giới thiệu về nghệ sĩ
        </Text>
      </View>
      <View
        style={{backgroundColor: bg}}
        className="absolute bottom-0 h-20  w-full rounded-b-2xl px-4 py-2 flex justify-between flex-row z-20">
        <View className="flex justify-between">
          <Text
            style={{
              color: COLOR.TEXT_PRIMARY,
              fontFamily: 'SVN-Gotham Black',
              fontSize: widthPercentageToDP(5),
            }}>
            {data?.name}
          </Text>
          <Text className="text-[12px]" style={{color: COLOR.TEXT_PRIMARY}}>
            Ngày sinh: {data?.birthday || 'không rõ'}
          </Text>
          <Text className="  text-[12px]" style={{color: COLOR.TEXT_PRIMARY}}>
            Người theo dõi: {data?.follow}
          </Text>
        </View>
        <View
          style={{backgroundColor: COLOR.isDark ? '#00000020' : '#ffffff80'}}
          className="flex justify-center rounded-full h-8 w-8 self-center items-center">
          <Entypo name="chevron-right" size={24} color={COLOR.TEXT_PRIMARY} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ArtistCard;
