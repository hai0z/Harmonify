import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {LinearGradient} from 'react-native-linear-gradient';
import {usePlayerStore} from '../store/playerStore';
import Player from '../components/Player/Player';
import {useNavigation} from '@react-navigation/native';
import Lyric from '../components/Player/Lyric';
import TextTicker from 'react-native-text-ticker';
import ImageSlider from '../components/Player/ImageSlider';
import ArtistCard from '../components/Player/ArtistCard';
import SongInfoCard from '../components/Player/SongInfoCard';
import {useActiveTrack} from 'react-native-track-player';
import {COLOR, DEFAULT_IMG} from '../constants';
import useDarkColor from '../hooks/useDarkColor';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const PlayerScreens = () => {
  const {playList, color} = usePlayerStore(state => state);
  const navigation = useNavigation<any>();
  const track = useActiveTrack();
  return (
    <ScrollView
      className="bg-[#121212]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100,
      }}>
      <View
        className="pt-[35px]"
        style={{
          height: SCREEN_HEIGHT * 0.75,
          backgroundColor: COLOR.BACKGROUND,
        }}>
        <LinearGradient
          colors={[useDarkColor(color.dominant!, 25), COLOR.BACKGROUND]}
          style={[
            StyleSheet.absoluteFill,
            {
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 1.25,
            },
          ]}
        />
        <View className="flex flex-row items-center justify-between px-6">
          <TouchableOpacity
            className="z-50"
            onPress={() => navigation.goBack()}>
            <Entypo name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-bold">Đang phát từ thư viện</Text>
          <Entypo name="dots-three-vertical" size={20} color="white" />
        </View>
        {playList?.items?.length > 0 ? (
          <ImageSlider />
        ) : (
          <View
            style={{
              marginTop: SCREEN_HEIGHT * 0.1,
              zIndex: 100,
              width: SCREEN_WIDTH,
            }}>
            <View
              style={{
                width: SCREEN_WIDTH,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: track?.artwork || DEFAULT_IMG}}
                className="rounded-md z-20"
                style={{
                  height: SCREEN_WIDTH * 0.85,
                  width: SCREEN_WIDTH * 0.85,
                }}
              />
            </View>
          </View>
        )}
        <View
          className="flex flex-row justify-between px-6"
          style={{
            marginTop: SCREEN_HEIGHT * 0.1,
          }}>
          <View className="z-50">
            <TextTicker
              className="text-white font-bold text-lg"
              duration={10000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={3000}>
              {track?.title}
            </TextTicker>
            <Text className="text-zinc-400 font-semibold">{track?.artist}</Text>
          </View>
        </View>
      </View>
      <View className="px-6 w-full">
        <View className="mt-4">
          <Player />
        </View>
        <Lyric />
        <ArtistCard />
        <SongInfoCard />
      </View>
    </ScrollView>
  );
};

export default PlayerScreens;
