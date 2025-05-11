import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React, {useContext, useEffect, useMemo, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useDebounce} from "../hooks/useDebounce";
import getThumbnail from "../utils/getThumnail";
import {handlePlay} from "../service/trackPlayerService";
import nodejs from "nodejs-mobile-react-native";
import {useNavigation} from "@react-navigation/native";
import useThemeStore from "../store/themeStore";
import {usePlayerStore} from "../store/playerStore";
import {PlayerContext} from "../context/PlayerProvider";
import TrackItem from "../components/track-item/TrackItem";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Loading from "../components/Loading";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import tinycolor from "tinycolor2";
import {useUserStore} from "../store/userStore";
import {GREEN} from "../constants";
import {FlatList} from "react-native-gesture-handler";

const SearchScreens = () => {
  const [text, setText] = useState<string>("");
  const [data, setData] = useState<any>([]);
  const debouncedValue = useDebounce(text, 250);
  const {COLOR, theme} = useThemeStore();
  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);
  const {showBottomSheet} = useContext(PlayerContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<any>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const currentSong = usePlayerStore(state => state.currentSong);
  const [recommenData, setRecommenData] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const searchHistory = useUserStore(state => state.searchHistory);
  const setSearchHistory = useUserStore(state => state.setSearchHistory);
  const [filterData, setFilterData] = useState<any>([]);

  useEffect(() => {
    nodejs.channel.post("getSuggest", debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    nodejs.channel.addListener("getSuggest", (data: any) => {
      setSuggestion(data);
    });
    nodejs.channel.addListener("search", (data: any) => {
      if (data?.songs?.length > 0) {
        nodejs.channel.post("getRecommend", data.songs[0].encodeId);
      }
      setData(data);
      setFilterData(data);
      setLoading(false);
    });
    nodejs.channel.addListener("getRecommend", (data: any) => {
      setRecommenData(data.items || []);
      setLoading(false);
    });
  }, []);

  const navigation = useNavigation<any>();

  const handleFilter = (tab: number) => {
    setSelectedTab(tab);
    switch (tab) {
      case 0:
        setFilterData(data);
        break;
      case 1:
        const songs = {...data};
        delete songs.playlists;
        delete songs.artists;
        setFilterData(songs);
        break;
      case 2:
        const playlists = {...data};
        delete playlists.songs;
        delete playlists.artists;
        setFilterData(playlists);
        break;
      case 3:
        const artists = {...data};
        delete artists.songs;
        delete artists.playlists;
        setFilterData(artists);
        break;
      default:
        break;
    }
  };

  return (
    <View
      className="flex-1 pt-[35px]"
      style={{
        backgroundColor: COLOR.BACKGROUND,
      }}>
      {/* Search Header */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>

          <View className="flex-1 relative">
            <TextInput
              keyboardType="web-search"
              value={text}
              style={{
                color: COLOR.TEXT_PRIMARY,
                backgroundColor: COLOR.isDark
                  ? tinycolor(COLOR.BACKGROUND).lighten(15).toString()
                  : tinycolor(COLOR.BACKGROUND).darken(5).toString(),
              }}
              onChangeText={text => {
                setIsSearched(false);
                setText(text);
              }}
              placeholderTextColor={COLOR.TEXT_SECONDARY}
              placeholder="Nhập tên bài hát, nghệ sĩ..."
              className="h-12 rounded-full px-6"
            />
            {text.length > 0 && (
              <TouchableOpacity
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                className="absolute right-4 top-3"
                onPress={() => {
                  setText("");
                  setData([]);
                  setSuggestion([]);
                  setIsSearched(false);
                }}>
                <AntDesign name="close" size={20} color={COLOR.TEXT_PRIMARY} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      {isSearched && !loading && (
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            className="flex-row space-x-3">
            {["Tất cả", "Bài hát", "Danh sách phát", "Nghệ sĩ"].map(
              (item, index) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleFilter(index)}
                  className="px-4 py-2 rounded-full"
                  key={index}
                  style={{
                    backgroundColor:
                      selectedTab === index
                        ? theme === "amoled"
                          ? GREEN
                          : COLOR.PRIMARY
                        : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
                  }}>
                  <Text
                    style={{
                      color:
                        selectedTab === index ? "#fff" : COLOR.TEXT_PRIMARY,
                      fontWeight: selectedTab === index ? "600" : "400",
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      {isSearched ? (
        loading ? (
          <View className="flex-1 items-center justify-center">
            <Loading />
          </View>
        ) : (
          debouncedValue.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 200}}>
              {data?.top &&
                (data?.top?.objectType === "song" ||
                  data?.top?.objectType === "artist") &&
                selectedTab === 0 && (
                  <View className="mb-6">
                    <Text
                      className="px-4 font-bold mb-4"
                      style={{
                        color: COLOR.TEXT_PRIMARY,
                        fontSize: widthPercentageToDP(5),
                      }}>
                      Kết quả hàng đầu
                    </Text>
                    {data?.top?.objectType === "song" ? (
                      <TrackItem
                        isActive={currentSong?.id === data?.top?.encodeId}
                        showBottomSheet={showBottomSheet}
                        item={data?.top}
                        onClick={() => {
                          handlePlay(data?.top, {
                            id: data?.top?.encodeId,
                            items: [data?.top, ...recommenData],
                          });
                          setPlayFrom({
                            id: "search",
                            name: data?.top?.title,
                          });
                        }}
                      />
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-row items-center px-4 py-2"
                        onPress={() => {
                          navigation.navigate("Artists", {
                            name: data?.top.alias,
                          });
                        }}>
                        <Image
                          source={{
                            uri: getThumbnail(data?.top.thumbnail) || "",
                          }}
                          className="w-16 h-16 rounded-full"
                        />
                        <View className="ml-4">
                          <Text
                            className="text-base font-medium mb-1"
                            style={{color: COLOR.TEXT_PRIMARY}}>
                            {data?.top.name}
                          </Text>
                          <Text
                            className="text-sm"
                            style={{color: COLOR.TEXT_SECONDARY}}>
                            Nghệ sĩ
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

              {/* Songs Section */}
              {(selectedTab == 0 || selectedTab == 1) && data?.songs && (
                <View className="mb-6">
                  <Text
                    className="px-4 font-bold mb-4"
                    style={{
                      color: COLOR.TEXT_PRIMARY,
                      fontSize: widthPercentageToDP(5),
                    }}>
                    Bài hát
                  </Text>
                  <FlatList
                    scrollEnabled={false}
                    extraData={currentSong?.id}
                    data={filterData?.songs?.filter(
                      (e: any) => e.streamingStatus !== 2
                    )}
                    renderItem={({item: e}: any) => (
                      <TrackItem
                        isActive={currentSong?.id === e.encodeId}
                        onClick={() => {
                          handlePlay(e, {
                            id: e.encodeId,
                            items: [e, ...recommenData],
                          });
                          setPlayFrom({
                            id: "search",
                            name: e.title,
                          });
                        }}
                        item={e}
                        showBottomSheet={showBottomSheet}
                      />
                    )}
                  />
                </View>
              )}

              {/* Playlists Section */}
              {(selectedTab == 0 || selectedTab == 2) && data?.playlists && (
                <View className="mb-6">
                  <Text
                    className="px-4 font-bold mb-4"
                    style={{
                      color: COLOR.TEXT_PRIMARY,
                      fontSize: widthPercentageToDP(5),
                    }}>
                    Danh sách phát
                  </Text>
                  {filterData?.playlists?.map((e: any, index: number) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={index}
                      className="flex-row items-center px-4 py-2"
                      onPress={() => {
                        navigation.navigate("PlayListDetail", {
                          data: {
                            playListId: e.encodeId,
                            thumbnail: e.thumbnail,
                          },
                        });
                      }}>
                      <Image
                        source={{uri: getThumbnail(e.thumbnail) || ""}}
                        className="w-16 h-16 rounded-lg"
                      />
                      <View className="flex-1 ml-4">
                        <Text
                          className="text-base font-medium mb-1"
                          numberOfLines={1}
                          style={{color: COLOR.TEXT_PRIMARY}}>
                          {e.title}
                        </Text>
                        <Text
                          className="text-sm"
                          numberOfLines={1}
                          style={{color: COLOR.TEXT_SECONDARY}}>
                          {e.artistsNames || "Danh sách phát"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Artists Section */}
              {(selectedTab == 0 || selectedTab == 3) && data?.artists && (
                <View className="mb-6">
                  <Text
                    className="px-4 font-bold mb-4"
                    style={{
                      color: COLOR.TEXT_PRIMARY,
                      fontSize: widthPercentageToDP(5),
                    }}>
                    Nghệ sĩ
                  </Text>
                  {filterData?.artists?.map((e: any, index: number) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={index}
                      className="flex-row items-center px-4 py-2"
                      onPress={() => {
                        navigation.navigate("Artists", {name: e.alias});
                      }}>
                      <Image
                        source={{uri: getThumbnail(e.thumbnail) || ""}}
                        className="w-16 h-16 rounded-full"
                      />
                      <View className="ml-4">
                        <Text
                          className="text-base font-medium mb-1"
                          numberOfLines={1}
                          style={{color: COLOR.TEXT_PRIMARY}}>
                          {e.name}
                        </Text>
                        <Text
                          className="text-sm"
                          numberOfLines={1}
                          style={{color: COLOR.TEXT_SECONDARY}}>
                          Nghệ sĩ
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          )
        )
      ) : (
        <View className="px-4">
          {/* Search History */}
          {searchHistory.length > 0 && text === "" && (
            <View className="py-2">
              {searchHistory.map((item: any, index: number) => (
                <TouchableWithoutFeedback
                  accessible={false}
                  onPress={() => {
                    setLoading(true);
                    Keyboard.dismiss();
                    setText(item);
                    setIsSearched(true);
                    nodejs.channel.post("search", item);
                  }}
                  key={index}>
                  <View className="flex-row justify-between items-center py-3 border-b border-gray-500/10">
                    <Text
                      className="text-base"
                      style={{color: COLOR.TEXT_PRIMARY}}>
                      {item}
                    </Text>
                    <AntDesign
                      onPress={() => {
                        setSearchHistory(
                          searchHistory.filter((e: any) => e !== item)
                        );
                      }}
                      name="close"
                      size={20}
                      color={COLOR.TEXT_SECONDARY}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ))}

              <TouchableOpacity
                className="mt-4"
                onPress={() => {
                  Alert.alert(
                    "Cảnh báo",
                    "Bạn có muốn xoá toàn bộ lịch sử tìm kiếm?",
                    [
                      {
                        text: "Huỷ",
                        style: "cancel",
                      },
                      {
                        text: "Xóa",
                        onPress: () => setSearchHistory([]),
                        style: "destructive",
                      },
                    ]
                  );
                }}>
                <Text
                  className="text-base font-semibold"
                  style={{
                    color: theme === "amoled" ? GREEN : COLOR.PRIMARY,
                  }}>
                  Xoá lịch sử tìm kiếm
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Search Suggestions */}
          {suggestion?.items?.[0]?.keywords?.map((item: any, index: number) => (
            <TouchableWithoutFeedback
              accessible={false}
              onPress={() => {
                setLoading(true);
                Keyboard.dismiss();
                setText(item.keyword);
                setIsSearched(true);
                setSearchHistory([item.keyword, ...searchHistory]);
                nodejs.channel.post("search", item.keyword);
              }}
              key={index}>
              <View className="flex-row justify-between items-center py-3 border-b border-gray-500/10">
                <Text className="text-base" style={{color: COLOR.TEXT_PRIMARY}}>
                  {item.keyword}
                </Text>
                <Feather
                  name="arrow-up-right"
                  size={20}
                  color={COLOR.TEXT_SECONDARY}
                />
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchScreens;
