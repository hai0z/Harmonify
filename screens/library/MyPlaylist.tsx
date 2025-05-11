import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Text,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
import {LinearGradient} from "react-native-linear-gradient";
import {FlashList} from "@shopify/flash-list";
import {handlePlay} from "../../service/trackPlayerService";
import {useNavigation} from "@react-navigation/native";
import {usePlayerStore} from "../../store/playerStore";
import TrackItem from "../../components/track-item/TrackItem";
import {PlayerContext} from "../../context/PlayerProvider";
import useThemeStore from "../../store/themeStore";
import {useUserStore} from "../../store/userStore";
import getThumbnail from "../../utils/getThumnail";
import RenderPlaylistThumbnail from "./components/RenderPlaylistThumnail";
import RAnimated, {useSharedValue, withTiming} from "react-native-reanimated";
import {getColors} from "react-native-image-colors";
import useDarkColor from "../../hooks/useDarkColor";
import tinycolor from "tinycolor2";
import stringToSlug from "../../utils/removeSign";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {route} from "../../utils/types/RootStackParamList";
import {SearchNormal, Play} from "iconsax-react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const caculateTotalTime = (playlistData: any) => {
  let total = 0;
  playlistData?.songs.forEach((item: any) => {
    total += item.duration;
  });
  const hours = Math.floor(total / 3600);
  const remainingSeconds = total % 3600;
  const minutes = Math.floor(remainingSeconds / 60);

  return {hours, minutes};
};

const MyPlaylist = ({route}: {route: route<"MyPlaylist">}) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const {playlistId} = route.params;

  const COLOR = useThemeStore(state => state.COLOR);

  const navigation = useNavigation<any>();

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const myPlaylists = useUserStore(state => state.myPlaylists);

  const currentSong = usePlayerStore(state => state.currentSong);

  const data = myPlaylists.find((item: any) => item.encodeId == playlistId);

  const [color, setColor] = React.useState<any>(null);

  const bgAnimated = useSharedValue("transparent");

  const [searchText, setSearchText] = React.useState<string>("");

  const [searchData, setSearchData] = React.useState<any>(data.songs);

  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  const flashListRef = React.useRef<FlashList<any>>(null);

  const {showBottomSheet} = useContext(PlayerContext);

  const textInputRef = React.useRef<TextInput>(null);

  const handleShowBottomSheet = useCallback((item: any) => {
    showBottomSheet({
      ...item,
      playlistId: data?.encodeId,
    });
  }, []);

  useEffect(() => {
    flashListRef.current?.scrollToOffset({animated: true, offset: 0});
    textInputRef.current?.focus();
  }, [isSearching, searchText]);

  useEffect(() => {
    setSearchData(data.songs);
  }, [data]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filteredData = data.songs.filter((item: any) => {
        return stringToSlug(item.title)
          .toLowerCase()
          .includes(stringToSlug(text).toLowerCase());
      });
      setSearchData(filteredData);
    } else {
      setSearchData(data.songs);
    }
  };

  useEffect(() => {
    (async () => {
      getColors(
        data.songs.at(Math.floor(Math.random() * data.songs.length - 1))
          .thumbnail
      ).then((res: any) => {
        setColor(res);
      });
    })();
  }, []);

  useLayoutEffect(() => {
    if (color) {
      bgAnimated.value = withTiming(
        `${
          COLOR.isDark
            ? useDarkColor(color.dominant, 35)
            : tinycolor(color.dominant).isDark()
            ? tinycolor(color.dominant).lighten(30)
            : tinycolor(color.dominant).darken()
        }95`,
        {
          duration: 750,
        }
      );
    }
  }, [color, isSearching, showBottomSheet]);

  const headerColor = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.8],
    outputRange: ["transparent", COLOR.BACKGROUND],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.8],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const imgScale = scrollY.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
    outputRange: [1, 0.6, 0.4],
    extrapolate: "clamp",
  });

  const handlePlaySong = useCallback((song: any) => {
    handlePlay(song, {
      id: `${data?.songs?.length}-${data?.encodeId}`,
      items: data?.songs,
      isAlbum: false,
    });
    setPlayFrom({
      id: "playlist",
      name: data?.title,
    });
  }, []);

  return (
    <View className="flex-1 w-full" style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 left-0 right-0 z-30 h-20 pt-[35px] justify-between items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-black/20 items-center justify-center"
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View className="justify-center items-center flex-1">
          <Animated.Text
            style={{
              opacity: headerTitleOpacity,
              color: COLOR.TEXT_PRIMARY,
              fontFamily: "SVN-Gotham Black",
              fontSize: wp(4.5),
            }}
            className="text-center">
            {data?.title}
          </Animated.Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-black/20 items-center justify-center"
          onPress={() => setIsSearching(true)}>
          <SearchNormal size={20} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
      </Animated.View>

      {isSearching && (
        <View
          style={{backgroundColor: COLOR.BACKGROUND}}
          className="absolute top-0 left-0 right-0 z-30 h-20 pt-[35px] items-center justify-between flex-row px-6">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-black/20 items-center justify-center"
            onPress={() => {
              setIsSearching(false);
              setSearchText("");
              setSearchData(data.songs);
              scrollY.setValue(0);
            }}>
            <Ionicons name="arrow-back" size={20} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View className="justify-center items-center p-1 flex-1 ml-2">
            <TextInput
              ref={textInputRef}
              value={searchText}
              onChangeText={text => handleSearch(text)}
              placeholder="Tìm kiếm bài hát..."
              className="w-full rounded-full p-2 px-4"
              placeholderTextColor={COLOR.TEXT_SECONDARY}
              style={{
                color: COLOR.TEXT_PRIMARY,
                backgroundColor: !COLOR.isDark
                  ? tinycolor(COLOR.BACKGROUND).darken(5).toString()
                  : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
              }}
            />
          </View>
          <View className="w-10" />
        </View>
      )}

      <FlashList
        ref={flashListRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}
        ListHeaderComponent={
          !isSearching ? (
            <View>
              <View
                className="flex justify-end items-center pb-4"
                style={{height: SCREEN_WIDTH * 0.8}}>
                <LinearGradient
                  colors={["transparent", COLOR.BACKGROUND]}
                  className="absolute bottom-0 h-full left-0 right-0 z-50"
                />
                <RAnimated.View
                  className="absolute"
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_WIDTH * 0.8,
                    backgroundColor: bgAnimated,
                  }}
                />
                {data?.songs.length > 0 ? (
                  <Animated.View
                    style={{
                      opacity: titleOpacity,
                      transform: [{scale: imgScale}],
                      zIndex: 9999,
                    }}>
                    <RenderPlaylistThumbnail
                      playlistLength={data?.songs?.length}
                      songs={data?.songs}
                      width={SCREEN_WIDTH * 0.6}
                      height={SCREEN_WIDTH * 0.6}
                    />
                  </Animated.View>
                ) : (
                  <Animated.Image
                    source={{uri: getThumbnail(data?.thumbnailM)}}
                    className="rounded-2xl"
                    style={{
                      width: SCREEN_WIDTH * 0.6,
                      height: SCREEN_WIDTH * 0.6,
                      zIndex: 9999,
                      opacity: titleOpacity,
                      transform: [{scale: imgScale}],
                    }}
                  />
                )}
              </View>
              <View className="z-50 mt-4 px-6 mb-4">
                <Animated.Text
                  style={{
                    opacity: titleOpacity,
                    color: COLOR.TEXT_PRIMARY,
                    fontFamily: "SVN-Gotham Black",
                    fontSize: wp(8),
                  }}
                  className="text-center">
                  {data?.title}
                </Animated.Text>
                <View className="flex-row justify-between items-center mt-8">
                  <View className="flex-1">
                    <Text
                      style={{color: COLOR.TEXT_SECONDARY}}
                      className="text-center text-sm">
                      {data?.songs.length} bài hát{" • "}
                      {caculateTotalTime(data).hours > 0 && (
                        <Text>{caculateTotalTime(data).hours} giờ </Text>
                      )}
                      {caculateTotalTime(data).minutes} phút
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-center gap-4 mt-8">
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full bg-[#1DB954] items-center justify-center"
                    onPress={() => handlePlaySong(data?.songs[0])}>
                    <Play size={24} color="#fff" variant="Bold" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View className="h-28" />
          )
        }
        ListFooterComponent={<View style={{height: SCREEN_WIDTH}} />}
        nestedScrollEnabled
        data={searchData}
        estimatedItemSize={72}
        extraData={currentSong?.id}
        renderItem={({item}: any) => {
          return (
            <TrackItem
              item={item}
              onClick={handlePlaySong}
              isAlbum={false}
              isActive={currentSong?.id === item.encodeId}
              showBottomSheet={handleShowBottomSheet}
            />
          );
        }}
      />
    </View>
  );
};

export default MyPlaylist;
