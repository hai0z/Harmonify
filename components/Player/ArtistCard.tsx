import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import nodejs from 'nodejs-mobile-react-native';
import getThumbnail from '../../utils/getThumnail';
import {usePlayerStore} from '../../store/playerStore';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useActiveTrack} from 'react-native-track-player';
import {DEFAULT_IMG} from '../../constants';
import tinycolor from 'tinycolor2';
const ArtistCard = () => {
  const {color: bgColor} = usePlayerStore(state => state);

  const currentSong = usePlayerStore(state => state.currentSong);

  const [data, setData] = useState<any>(null);

  const navigation = useNavigation<any>();

  const bg =
    bgColor.vibrant === '#0098DB'
      ? tinycolor(bgColor.average).isDark()
        ? tinycolor(bgColor.average).lighten(20).toString()
        : bgColor.average
      : bgColor.vibrant;

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
        <Text className="text-white font-bold text-[16px]">
          Giới thiệu về nghệ sĩ
        </Text>
      </View>
      <View
        style={{backgroundColor: bg}}
        className="absolute bottom-0 h-20  w-full rounded-b-2xl px-4 py-2 flex justify-between flex-row z-20">
        <View className="flex justify-between">
          <Text className="text-white font-bold text-[16px]">{data?.name}</Text>
          <Text className="text-white font-bold text-[12px]">
            Ngày sinh: {data?.birthday || 'không rõ'}
          </Text>
          <Text className="text-white  text-[12px]">
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
