import React, {memo, useMemo} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Header from "../../components/Header";
import NewRelease from "./components/NewRelease";
import LinearGradient from "react-native-linear-gradient";
import useThemeStore from "../../store/themeStore";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import RecentList from "./components/RecentList";
import Loading from "../../components/Loading";
import useGetHomeData from "../../hooks/useGetHomeData";
import {typePlaylistCover} from "../../utils/types/type";
import Animated, {FadeIn} from "react-native-reanimated";
import PlayListCover from "../../components/PlayListCover";
import {FlashList} from "@shopify/flash-list";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const getTimeColor = (HEADER_GRADIENT: any) => {
  const hour = new Date().getHours();
  if (hour < 12) return HEADER_GRADIENT.MORNING;
  if (hour < 18) return HEADER_GRADIENT.AFTERNOON;
  return HEADER_GRADIENT.EVENING;
};

const PlaylistItem = memo(({item}: {item: any}) => (
  <View className="mr-4 mb-2">
    <PlayListCover
      encodeId={item.encodeId}
      thumbnail={item.thumbnail}
      title={item.title}
    />
  </View>
));

const PlaylistSection = memo(
  ({data, COLOR}: {data: typePlaylistCover; COLOR: any}) => (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mx-4 mb-4">
        <View className="flex-row items-center">
          <MaterialIcons
            name="playlist-play"
            size={28}
            color={COLOR.TEXT_PRIMARY}
          />
          <Text
            className="text-xl font-bold uppercase ml-2"
            style={{color: COLOR.TEXT_PRIMARY}}>
            {data.title || data.sectionId.slice(1)}
          </Text>
        </View>
      </View>
      <FlashList
        data={data.items}
        renderItem={({item}) => <PlaylistItem item={item} />}
        horizontal
        estimatedItemSize={150}
        contentContainerStyle={{paddingHorizontal: 16}}
        removeClippedSubviews={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
);

const HubSection = memo(({data, COLOR}: {data: any; COLOR: any}) => (
  <View className="mb-6">
    <View className="flex-row justify-between items-center mx-4 mb-4">
      <View className="flex-row items-center">
        <Ionicons name="musical-notes" size={24} color={COLOR.TEXT_PRIMARY} />
        <Text
          className="text-xl font-bold uppercase ml-2"
          style={{color: COLOR.TEXT_PRIMARY}}>
          {data.title || data.sectionId.slice(1)}
        </Text>
      </View>
    </View>
    <FlashList
      estimatedItemSize={150}
      data={data?.playlists}
      renderItem={({item}) => <PlaylistItem item={item} />}
      horizontal
      contentContainerStyle={{paddingHorizontal: 16}}
      removeClippedSubviews={true}
      showsHorizontalScrollIndicator={false}
    />
  </View>
));

function HomeScreens() {
  const {COLOR, HEADER_GRADIENT} = useThemeStore(state => state);
  const {home, hub, dataRecent, newRelease, homeLoading} = useGetHomeData();

  const timeColor = useMemo(
    () => getTimeColor(HEADER_GRADIENT),
    [HEADER_GRADIENT]
  );

  if (homeLoading) {
    return (
      <Animated.View
        entering={FadeIn.duration(500)}
        className="flex-1 items-center justify-center"
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Loading />
      </Animated.View>
    );
  }

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      className="h-full w-full pb-[200px]"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Header />
        <View
          className="top-0"
          style={[StyleSheet.absoluteFill, {height: hp(45)}]}>
          <LinearGradient
            colors={[timeColor, `${timeColor}30`, COLOR.BACKGROUND]}
            className="h-full"
          />
        </View>

        <RecentList data={dataRecent} />

        {newRelease?.items?.all?.length > 0 && (
          <View className="mt-6">
            <NewRelease data={newRelease} />
          </View>
        )}

        <View className="mt-6">
          {home?.map((section, index) => (
            <PlaylistSection key={index} data={section} COLOR={COLOR} />
          ))}
        </View>

        <View className="mt-6 flex-1">
          {hub?.map((section, index) => (
            <HubSection key={index} data={section} COLOR={COLOR} />
          ))}
        </View>

        <View className="h-48" />
      </Animated.View>
    </ScrollView>
  );
}

export default memo(HomeScreens);
