import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Header from '../../components/Header';
import NewRelease from './components/NewRelease';
import LinearGradient from 'react-native-linear-gradient';
import useThemeStore from '../../store/themeStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import RecentList from './components/RecentList';
import Loading from '../../components/Loading';
import useGetHomeData from '../../hooks/useGetHomeData';
import {typePlaylistCover} from '../../utils/types/type';
import Animated, {FadeIn} from 'react-native-reanimated';
import PlayListCover from '../../components/PlayListCover';
import {FlashList} from '@shopify/flash-list';

function HomeScreens() {
  const {COLOR, HEADER_GRADIENT} = useThemeStore(state => state);
  const {dataHome, dataNewRelease, loading, dataRecent, hub} = useGetHomeData();
  if (loading) {
    return (
      <Animated.View
        entering={FadeIn.duration(500)}
        className="flex-1 items-center justify-center "
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Loading />
      </Animated.View>
    );
  }
  const timeColor = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return HEADER_GRADIENT.MORNING;
    } else if (hour < 18) {
      return HEADER_GRADIENT.AFTERNOON;
    } else {
      return HEADER_GRADIENT.EVENING;
    }
  };

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      className=" h-full w-full pb-[200px]"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View>
        <Header />
        <View
          className="top-0"
          style={[StyleSheet.absoluteFill, {height: hp(45)}]}>
          <LinearGradient
            colors={[timeColor(), `${timeColor()}50`, COLOR.BACKGROUND]}
            className="h-full"
          />
        </View>
        <View>
          <RecentList data={dataRecent} />
        </View>
        <View className="mt-4">
          {dataNewRelease && <NewRelease data={dataNewRelease} />}
        </View>

        <View className="-mt-4">
          {dataHome?.map((e: typePlaylistCover, index: number) => {
            return (
              <View key={index}>
                <View>
                  <Text
                    className="text-xl flex justify-between items-end mt-8 mb-3 uppercase mx-4 "
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {e.title === '' ? e.sectionId.slice(1) : e.title}
                  </Text>
                </View>
                <FlashList
                  data={e.items}
                  renderItem={({item}: any) => (
                    <View className="mr-3">
                      <PlayListCover {...item} />
                    </View>
                  )}
                  horizontal
                  estimatedItemSize={hp(20)}
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                  }}></FlashList>
              </View>
            );
          })}
        </View>
        <View className="-mt-4">
          {hub?.map((e: any, index: number) => {
            return (
              <View key={index}>
                <View>
                  <Text
                    className="text-xl flex justify-between items-end mt-8 mb-3 uppercase mx-4 "
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {e.title === '' ? e.sectionId.slice(1) : e.title}
                  </Text>
                </View>
                <FlashList
                  estimatedItemSize={hp(20)}
                  data={e?.playlists}
                  renderItem={({item}: any) => (
                    <View className="mr-3">
                      <PlayListCover {...item} />
                    </View>
                  )}
                  horizontal
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                  }}>
                  {/* {e?.playlists?.map(
                    (element: typePlaylistCover, index: number) => (
                      <PlayListCover
                        key={index}
                        title={element.title}
                        encodeId={`${element.encodeId}`}
                        thumbnail={element.thumbnail}
                        sortDescription={element.sortDescription}
                      />
                    ),
                  )} */}
                </FlashList>
              </View>
            );
          })}
        </View>
        <View className="h-48"></View>
      </Animated.View>
    </ScrollView>
  );
}

export default HomeScreens;
