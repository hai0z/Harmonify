import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {handlePlay} from "../../service/trackPlayerService";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import nodejs from "nodejs-mobile-react-native";
import useThemeStore from "../../store/themeStore";
import {usePlayerStore} from "../../store/playerStore";
import LinearGradient from "react-native-linear-gradient";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {followArtist} from "../../service/firebase";
import {useUserStore} from "../../store/userStore";
import Loading from "../../components/Loading";
import TrackItem from "../../components/track-item/TrackItem";
import {PlayerContext} from "../../context/PlayerProvider";
import {FlashList} from "@shopify/flash-list";
import {navigation} from "../../utils/types/RootStackParamList";
import PlayListCover from "../../components/PlayListCover";
import tinycolor from "tinycolor2";
import {Play, Heart} from "iconsax-react-native";

interface artistType {
  id: string;
  name: string;
  thumbnailM: string;
  sortBiography: string;
  realname: string;
  birthday: string;
  totalFollow: number;
  sections: any[];
  alias: string;
  biography: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

function isKeyExistsInArrayObjects(arr: any, key: any, value: any) {
  for (let obj of arr) {
    if (obj.hasOwnProperty(key) && obj[key] === value) {
      return true;
    }
  }
  return false;
}

const ArtistScreens = ({route}: any) => {
  const {name} = route.params;
  const [loading, setLoading] = React.useState(true);
  const [dataDetailArtist, setDataDetailArtist] = useState<artistType>();
  const COLOR = useThemeStore(state => state.COLOR);
  const {listFollowArtists} = useUserStore();
  const {showBottomSheet} = useContext(PlayerContext);
  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const currentSong = usePlayerStore(state => state.currentSong);

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener("getArtist", (data: any) => {
      setDataDetailArtist(data);
      setLoading(false);
    });
    scrollY.setValue(0);
    nodejs.channel.post("getArtist", name);
  }, [name]);

  const topSong = useMemo(
    () =>
      dataDetailArtist?.sections
        ?.filter((type: any) => type.sectionId === "aSongs")[0]
        ?.items.filter((i: any) => i.streamingStatus === 1)
        .slice(0, 5),
    [dataDetailArtist]
  );

  const headerColor = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.6],
    outputRange: ["transparent", COLOR.BACKGROUND],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.6, SCREEN_WIDTH],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const navigation = useNavigation<navigation<"Artists" | "ArtistsSong">>();

  if (loading) {
    return (
      <View
        style={{backgroundColor: COLOR.BACKGROUND}}
        className="flex-1 items-center justify-center">
        <Loading />
      </View>
    );
  }

  const handlePlayArtist = () => {
    const songs = dataDetailArtist?.sections
      .filter((type: any) => type.sectionId === "aSongs")[0]
      .items.filter((i: any) => i.streamingStatus === 1);

    if (songs && songs.length > 0) {
      handlePlay(songs[0], {
        id: name,
        items: songs,
      });
      setPlayFrom({
        id: "artist",
        name: dataDetailArtist?.name!,
      });
    }
  };

  return (
    <View className="flex-1" style={{backgroundColor: COLOR.BACKGROUND}}>
      {/* Header */}
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-[999] h-20 items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: tinycolor(COLOR.TEXT_PRIMARY)
              .setAlpha(0.1)
              .toString(),
          }}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Animated.Text
          className="font-bold ml-4 text-lg"
          style={{color: COLOR.TEXT_PRIMARY, opacity: headerOpacity}}>
          {dataDetailArtist?.name}
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 200}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}>
        {/* Hero Section */}
        <View className="relative" style={{height: SCREEN_WIDTH}}>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
                zIndex: 3,
                backgroundColor: COLOR.BACKGROUND + "35",
              },
            ]}
          />
          <LinearGradient
            colors={["transparent", COLOR.BACKGROUND]}
            className="absolute left-0 right-0 bottom-0 z-10"
            style={{height: 200, width: SCREEN_WIDTH}}
          />
          <Animated.Image
            source={{uri: dataDetailArtist?.thumbnailM}}
            style={[
              StyleSheet.absoluteFillObject,
              {
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
                zIndex: 2,
              },
            ]}
          />

          <View className="absolute bottom-8 z-20 px-6 w-full">
            <Text
              className="mb-4"
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontFamily: "SVN-Gotham Black",
                fontSize: wp(10),
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: {width: 1, height: 1},
                textShadowRadius: 10,
              }}>
              {dataDetailArtist?.name}
            </Text>

            <Text
              style={{color: COLOR.TEXT_SECONDARY}}
              className="text-base mb-6">
              {formatNumber(dataDetailArtist?.totalFollow || 0)} người quan tâm
            </Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                style={{
                  backgroundColor: listFollowArtists.some(
                    (item: any) => item.id === dataDetailArtist?.id
                  )
                    ? COLOR.PRIMARY
                    : tinycolor(COLOR.PRIMARY).setAlpha(0.2).toString(),
                }}
                className="flex-1 h-12 rounded-full items-center justify-center flex-row gap-2"
                onPress={() =>
                  followArtist({
                    thumbnailM: dataDetailArtist?.thumbnailM,
                    name: dataDetailArtist?.name,
                    id: dataDetailArtist?.id,
                    alias: dataDetailArtist?.alias,
                    totalFollow: dataDetailArtist?.totalFollow,
                  })
                }>
                <Heart
                  size={20}
                  color={COLOR.TEXT_PRIMARY}
                  variant={
                    listFollowArtists.some(
                      (item: any) => item.id === dataDetailArtist?.id
                    )
                      ? "Bold"
                      : "Linear"
                  }
                />
                <Text
                  style={{color: COLOR.TEXT_PRIMARY}}
                  className="text-base font-medium">
                  {listFollowArtists.some(
                    (item: any) => item.id === dataDetailArtist?.id
                  )
                    ? "Đã theo dõi"
                    : "Theo dõi"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePlayArtist}
                style={{
                  backgroundColor: COLOR.PRIMARY,
                }}
                className="w-12 h-12 rounded-full items-center justify-center">
                <Play size={24} color={COLOR.TEXT_PRIMARY} variant="Bold" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Top Songs */}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          "sectionId",
          "aSongs"
        ) && (
          <View className="mt-6">
            <View className="px-6 mb-4 flex-row justify-between items-center">
              <Text
                className="text-xl font-bold"
                style={{color: COLOR.TEXT_PRIMARY}}>
                Bài hát nổi bật
              </Text>
            </View>

            <View style={{minHeight: 3}}>
              <FlashList
                estimatedItemSize={70}
                extraData={currentSong?.id}
                data={topSong}
                renderItem={({item}: any) => (
                  <TrackItem
                    isActive={currentSong?.id === item.encodeId}
                    showBottomSheet={showBottomSheet}
                    item={item}
                    key={item.encodeId}
                    onClick={() => {
                      handlePlay(item, {
                        id: name,
                        items: dataDetailArtist?.sections
                          .filter((type: any) => type.sectionId === "aSongs")[0]
                          .items.filter((i: any) => i.streamingStatus === 1),
                      });
                      setPlayFrom({
                        id: "artist",
                        name: dataDetailArtist?.name!,
                      });
                    }}
                  />
                )}
              />
            </View>

            <View className="w-full items-center my-4">
              <TouchableOpacity
                style={{
                  backgroundColor: tinycolor(COLOR.PRIMARY)
                    .setAlpha(0.2)
                    .toString(),
                }}
                className="w-36 h-12 rounded-full items-center justify-center"
                onPress={() => {
                  navigation.push("ArtistsSong", {
                    id: dataDetailArtist?.id,
                    name: dataDetailArtist?.alias,
                  });
                }}>
                <Text
                  style={{color: COLOR.TEXT_PRIMARY}}
                  className="text-base font-medium">
                  Xem thêm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Albums */}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          "sectionId",
          "aAlbum"
        ) && (
          <View className="mt-6">
            <Text
              style={{color: COLOR.TEXT_PRIMARY}}
              className="text-xl font-bold px-6 mb-4">
              Albums
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                gap: 16,
                minWidth: SCREEN_WIDTH,
              }}>
              {dataDetailArtist?.sections
                ?.filter((type: any) => type.sectionId === "aAlbum")[0]
                ?.items.map((item: any, index: number) => (
                  <PlayListCover
                    isAlbum={true}
                    key={index}
                    encodeId={item.encodeId}
                    sortDescription={item.sortDescription}
                    title={item.title}
                    thumbnail={item.thumbnail}
                  />
                ))}
            </ScrollView>
          </View>
        )}

        {/* Playlists */}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          "sectionId",
          "aPlaylist"
        ) && (
          <View className="mt-6">
            {dataDetailArtist?.sections
              ?.filter((type: any) => type.sectionId === "aPlaylist")
              ?.map((item: any, index: number) => (
                <View key={index} className="mb-6">
                  <Text
                    style={{color: COLOR.TEXT_PRIMARY}}
                    className="text-xl font-bold px-6 mb-4">
                    {item.title}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 24,
                      gap: 16,
                      minWidth: SCREEN_WIDTH,
                    }}>
                    {item.items.map((item: any, index: number) => (
                      <PlayListCover
                        key={index}
                        encodeId={item.encodeId}
                        sortDescription={item.sortDescription}
                        title={item.title}
                        thumbnail={item.thumbnail}
                      />
                    ))}
                  </ScrollView>
                </View>
              ))}
          </View>
        )}

        {/* Singles */}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          "sectionId",
          "aSingle"
        ) && (
          <View className="mt-6">
            <Text
              style={{color: COLOR.TEXT_PRIMARY}}
              className="text-xl font-bold px-6 mb-4">
              Đĩa đơn
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                gap: 16,
                minWidth: SCREEN_WIDTH,
              }}>
              {dataDetailArtist?.sections
                ?.filter((type: any) => type.sectionId === "aSingle")[0]
                ?.items.map((item: any, index: number) => (
                  <PlayListCover
                    isAlbum
                    key={index}
                    encodeId={item.encodeId}
                    sortDescription={item.sortDescription}
                    title={item.title}
                    thumbnail={item.thumbnail}
                  />
                ))}
            </ScrollView>
          </View>
        )}

        {/* Related Artists */}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          "sectionId",
          "aReArtist"
        ) && (
          <View className="mt-6">
            {dataDetailArtist?.sections?.filter(
              (type: any) => type.sectionId === "aReArtist"
            )[0].items.length > 0 && (
              <Text
                className="text-xl font-bold px-6 mb-4"
                style={{color: COLOR.TEXT_PRIMARY}}>
                Có thể bạn thích
              </Text>
            )}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 24, gap: 16}}>
              {dataDetailArtist?.sections
                .filter((type: any) => type.sectionId === "aReArtist")[0]
                ?.items.map((item: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate("Artists", {
                        name: item.alias,
                      });
                    }}
                    className="items-center">
                    <Image
                      source={{uri: item.thumbnailM}}
                      className="w-32 h-32 rounded-full mb-3"
                    />
                    <Text
                      className="text-base font-medium text-center"
                      style={{color: COLOR.TEXT_PRIMARY}}>
                      {item.name}
                    </Text>
                    <Text
                      className="text-sm mt-1"
                      style={{color: COLOR.TEXT_SECONDARY}}>
                      {formatNumber(item.totalFollow)} quan tâm
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        {/* Artist Info */}
        <View className="px-6 mt-8 mb-4">
          <Text
            className="text-xl font-bold mb-4"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Thông tin
          </Text>

          <View
            style={{
              backgroundColor: tinycolor(COLOR.TEXT_PRIMARY)
                .setAlpha(0.1)
                .toString(),
            }}
            className="rounded-2xl p-4 space-y-3">
            <Text style={{color: COLOR.TEXT_PRIMARY}} className="text-base">
              <Text className="font-medium">Tên thật: </Text>
              {dataDetailArtist?.realname}
            </Text>

            <Text style={{color: COLOR.TEXT_PRIMARY}} className="text-base">
              <Text className="font-medium">Ngày sinh: </Text>
              {dataDetailArtist?.birthday || "Không rõ"}
            </Text>

            <Text
              style={{color: COLOR.TEXT_SECONDARY}}
              className="text-base leading-6 mt-2">
              {dataDetailArtist?.sortBiography.replaceAll("<br>", "")}
            </Text>

            <Text
              style={{color: COLOR.TEXT_SECONDARY}}
              className="text-base leading-6">
              {dataDetailArtist?.biography.replaceAll("<br>", "")}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export default ArtistScreens;
