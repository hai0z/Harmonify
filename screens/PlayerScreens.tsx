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

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const PlayerScreens = () => {
  const {currentSong, playList} = usePlayerStore(state => state);
  const navigation = useNavigation<any>();
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
          backgroundColor: '#121212',
        }}>
        <LinearGradient
          colors={['transparent', '#121212']}
          className="absolute bottom-0 h-80 left-0 right-0 z-10"
        />

        <Image
          source={{uri: currentSong?.artwork}}
          blurRadius={1000}
          style={[
            StyleSheet.absoluteFillObject,
            {
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.75,
            },
          ]}
        />
        <View className="flex flex-row items-center justify-between px-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-bold">Đang phát từ thư viện</Text>
          <Entypo name="dots-three-vertical" size={20} color="white" />
        </View>
        {playList.length > 0 ? (
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
                source={{uri: currentSong?.artwork!}}
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
              {currentSong?.title}
            </TextTicker>
            <Text className="text-zinc-500 font-semibold">
              {currentSong?.artist?.name}
            </Text>
          </View>
        </View>
      </View>
      <View className="px-6 w-full">
        <View className="mt-4">
          <Player />
        </View>
        <Lyric />
        <ArtistCard />
      </View>
    </ScrollView>
  );
};

export default PlayerScreens;
