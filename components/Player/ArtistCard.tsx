import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import nodejs from 'nodejs-mobile-react-native';
import getThumbnail from '../../utils/getThumnail';
import {usePlayerStore} from '../../store/playerStore';
import {useNavigation} from '@react-navigation/native';

const ArtistCard = () => {
  const {color, currentSong} = usePlayerStore(state => state);
  const [data, setData] = useState({} as any);
  useEffect(() => {
    nodejs.channel.addListener('getArtist', (data: any) => {
      setData(data);
    });
    nodejs.channel.post('getArtist', currentSong?.artist.alias);
  }, []);

  useEffect(() => {
    setData(null);
    nodejs.channel.post('getArtist', currentSong?.artist.alias);
  }, [currentSong?.artist.alias]);

  const navigation = useNavigation<any>();

  const bgColor = color.vibrant === '#0098DB' ? color.average : color.vibrant;
  return (
    <TouchableOpacity
      activeOpacity={1}
      className="w-full rounded-2xl h-[340px] mt-8"
      onPress={() =>
        navigation.navigate('Artists', {
          id: currentSong?.artist.id,
          name: currentSong?.artist.alias,
        })
      }>
      <View className="absolute w-full h-full bg-black/30 z-10 rounded-2xl " />
      <Image
        style={[StyleSheet.absoluteFillObject]}
        source={{
          uri: getThumbnail(data?.thumbnail) || 'https://picsum.photos/200/300',
        }}
        className="w-full h-full rounded-2xl"
      />
      <View className="z-20 px-4 py-4">
        <Text className="text-white font-bold text-[16px]">
          Giới thiệu về nghệ sĩ
        </Text>
      </View>
      <View
        style={{backgroundColor: bgColor}}
        className="absolute bottom-0 h-20  w-full rounded-b-2xl px-4 py-2 flex justify-between z-20">
        <Text className="text-white font-bold text-[16px]">{data?.name}</Text>
        <Text className="text-white font-bold text-[12px]">
          Ngày sinh: {data?.birthday || 'không rõ'}
        </Text>
        <Text className="text-white  text-[12px]">
          {data?.follow} người theo dõi
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ArtistCard;
