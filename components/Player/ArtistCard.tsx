import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import nodejs from 'nodejs-mobile-react-native';
import getThumbnail from '../../utils/getThumnail';
import {usePlayerStore} from '../../store/playerStore';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {DEFAULT_IMG} from '../../constants';
import tinycolor from 'tinycolor2';
import useThemeStore from '../../store/themeStore';
const ArtistCard = () => {
  const {color: bgColor} = usePlayerStore(state => state);

  const currentSong = usePlayerStore(state => state.currentSong);

  const [data, setData] = useState<any>(null);

  const navigation = useNavigation<any>();

  const {theme, COLOR} = useThemeStore(state => state);
  const bg = COLOR.isDark
    ? bgColor.vibrant === '#0098DB'
      ? tinycolor(bgColor.average).isDark()
        ? tinycolor(bgColor.average).lighten(20).toString()
        : bgColor.average
      : bgColor.vibrant
    : tinycolor(bgColor.dominant!).isDark()
    ? tinycolor(bgColor.dominant!).lighten(55).toString()
    : tinycolor(bgColor.dominant!).darken(5).toString();

  useEffect(() => {
    setData(null);
    nodejs.channel.addListener('getArtistBySongId', (data: any) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    setData(null);
    nodejs.channel.post('getArtistBySongId', currentSong?.id);
  }, [currentSong?.id]);

  if (data === null || usePlayerStore.getState().isPlayFromLocal) {
    return null;
  }
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        elevation: 10,
      }}
      className="w-full rounded-2xl h-[320px] mt-8"
      onPress={() =>
        navigation.navigate('Artists', {
          name: data.alias,
        })
      }>
      <View className="absolute w-full h-full bg-black/30 z-10 rounded-2xl " />
      <Image
        style={[StyleSheet.absoluteFillObject]}
        source={{
          uri: getThumbnail(data?.thumbnail) || DEFAULT_IMG,
        }}
        className="w-full h-full rounded-2xl"
      />
      <View className="z-20 px-4 py-4">
        <Text className="font-bold text-[16px] z-10" style={{color: '#ffffff'}}>
          Giới thiệu về nghệ sĩ
        </Text>
      </View>
      <View
        style={{backgroundColor: bg}}
        className="absolute bottom-0 h-20  w-full rounded-b-2xl px-4 py-2 flex justify-between flex-row z-20">
        <View className="flex justify-between">
          <Text
            className="font-bold text-[16px]"
            style={{color: COLOR.TEXT_PRIMARY}}>
            {data?.name}
          </Text>
          <Text
            className=" font-bold text-[12px]"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Ngày sinh: {data?.birthday || 'không rõ'}
          </Text>
          <Text className="  text-[12px]" style={{color: COLOR.TEXT_PRIMARY}}>
            {data?.follow} người theo dõi
          </Text>
        </View>
        <View className="flex justify-center rounded-full h-8 w-8 bg-white/50 self-center items-center">
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ArtistCard;
