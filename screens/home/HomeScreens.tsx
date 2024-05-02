import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import PlayListCover from '../../components/PlayListCover';
import Header from '../../components/Header';
import NewRelease from './components/NewRelease';
import LinearGradient from 'react-native-linear-gradient';
import useThemeStore from '../../store/themeStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import RecentList from './components/RecentList';

import {SafeAreaView} from 'react-native';
import Loading from '../../components/Loading';
import useGetHomeData from '../../hooks/useGetHomeData';
interface typePlaylistCover {
  items: [];
  title: string;
  encodeId: string;
  thumbnail: string;
  sortDescription: string;
  sectionId: string;
}

function HomeScreens() {
  const {COLOR, HEADER_GRADIENT} = useThemeStore(state => state);
  const {dataHome, dataNewRelease, loading, dataRecent} = useGetHomeData();
  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center "
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Loading />
      </View>
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
      <SafeAreaView>
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
          {dataHome?.map((e: any, index: number) => {
            return (
              <View key={index}>
                <View>
                  <Text
                    className="text-xl flex justify-between items-end mt-8 mb-3 uppercase mx-4 "
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {e.title === '' ? e.sectionId.slice(1) : e.title}
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  contentContainerStyle={{
                    gap: 10,
                    paddingHorizontal: 16,
                    minWidth: widthPercentageToDP(100),
                  }}>
                  {e.items.map((element: typePlaylistCover, index: number) => (
                    <PlayListCover
                      key={index}
                      title={element.title}
                      encodeId={`${element.encodeId}`}
                      thumbnail={element.thumbnail}
                      sortDescription={element.sortDescription}
                    />
                  ))}
                </ScrollView>
              </View>
            );
          })}
        </View>
        <View className="h-48"></View>
      </SafeAreaView>
    </ScrollView>
  );
}

export default HomeScreens;
