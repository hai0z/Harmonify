import {View, Text, TouchableOpacity, Image, ScrollView} from "react-native";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {usePlayerStore} from "../../../store/playerStore";
import LinearGradient from "react-native-linear-gradient";
import Entypo from "react-native-vector-icons/Entypo";
import useThemeStore from "../../../store/themeStore";
import {useUserStore} from "../../../store/userStore";
import {widthPercentageToDP} from "react-native-responsive-screen";
import useLibraryStore from "../../../store/useLibraryStore";
import getThumbnail from "../../../utils/getThumnail";
import Animated, {FadeIn} from "react-native-reanimated";
import RenderPlaylistThumbnail from "./RenderPlaylistThumnail";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import PlaylistManagerBottomSheet from "../../../components/bottom-sheet/PlaylistManagerBottomSheet";
import {navigation} from "../../../utils/types/RootStackParamList";

const Playlist = () => {
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const {COLOR} = useThemeStore(state => state);
  const navigation =
    useNavigation<navigation<"LikedSong" | "MyPlaylist" | "PlayListDetail">>();
  const {viewType} = useLibraryStore();
  const {likedPlaylists, myPlaylists} = useUserStore();

  const playlistManagerRef = React.useRef<BottomSheetModal>(null);

  const [selectedPlaylistId, setSelectedPlaylistId] = React.useState<
    any | null
  >(null);

  const onLongPressPlaylist = (playList: any) => {
    setSelectedPlaylistId(playList);
    if (playlistManagerRef.current) {
      playlistManagerRef.current?.present();
    }
  };

  const renderListItem = (pl: any, type?: "myPlaylists" | "likedPlaylists") => {
    return (
      <TouchableOpacity
        delayLongPress={200}
        onLongPress={() => type && onLongPressPlaylist({...pl, type})}
        key={pl.encodeId}
        onPress={() =>
          type === "myPlaylists"
            ? navigation.push("MyPlaylist", {
                playlistId: pl.encodeId,
              })
            : navigation.push("PlayListDetail", {
                data: {
                  playListId: pl.encodeId,
                },
              })
        }
        activeOpacity={0.7}
        className="flex-row items-center mt-4 p-2 rounded-lg"
        style={{backgroundColor: `${COLOR.SECONDARY}15`}}>
        {type === "myPlaylists" && pl.songs.length > 0 ? (
          <RenderPlaylistThumbnail
            songs={pl.songs}
            playlistLength={pl.songs.length}
            height={widthPercentageToDP(18)}
            width={widthPercentageToDP(18)}
          />
        ) : (
          <Image
            source={{uri: getThumbnail(pl?.thumbnail)}}
            style={{
              width: widthPercentageToDP(18),
              height: widthPercentageToDP(18),
              borderRadius: 8,
            }}
          />
        )}
        <View style={{marginLeft: 12, flex: 1}}>
          <Text
            className="font-bold mb-[6px] text-[16px]"
            numberOfLines={1}
            style={{color: COLOR.TEXT_PRIMARY}}>
            {pl?.title}
          </Text>
          <Text style={{color: COLOR.TEXT_SECONDARY}} numberOfLines={1}>
            {pl.type === "album"
              ? "Album"
              : `Danh sách phát • ${
                  type === "myPlaylists" ? pl.songs.length : pl.totalSong
                } bài hát`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGridItem = (pl: any, type?: "myPlaylists" | "likedPlaylists") => {
    return (
      <TouchableOpacity
        delayLongPress={200}
        onLongPress={() => type && onLongPressPlaylist({...pl, type})}
        style={{
          width: widthPercentageToDP(33) - 16,
          backgroundColor: `${COLOR.SECONDARY}15`,
          borderRadius: 12,
          padding: 8,
        }}
        key={pl.encodeId}
        onPress={() =>
          type === "myPlaylists"
            ? navigation.push("MyPlaylist", {
                playlistId: pl.encodeId,
              })
            : navigation.push("PlayListDetail", {
                data: {
                  playListId: pl.encodeId,
                },
              })
        }
        activeOpacity={0.7}
        className="flex-col flex mb-4">
        {type === "myPlaylists" && pl.songs.length > 0 ? (
          <RenderPlaylistThumbnail
            songs={pl.songs}
            playlistLength={pl.songs.length}
            height={widthPercentageToDP(33) - 32}
            width={widthPercentageToDP(33) - 32}
          />
        ) : (
          <Image
            source={{uri: getThumbnail(pl?.thumbnail)}}
            style={{
              width: widthPercentageToDP(33) - 32,
              height: widthPercentageToDP(33) - 32,
              borderRadius: 8,
            }}
          />
        )}
        <View className="mt-2">
          <Text
            numberOfLines={2}
            className="font-semibold text-[14px]"
            style={{color: COLOR.TEXT_PRIMARY}}>
            {pl?.title}
          </Text>
          <Text
            style={{color: COLOR.TEXT_SECONDARY, fontSize: 12}}
            numberOfLines={1}>
            {pl.type === "album"
              ? "Album"
              : `${
                  type === "myPlaylists" ? pl.songs.length : pl.totalSong
                } bài hát`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={{flex: 1, marginHorizontal: 16, marginTop: 12}}
      className="pb-[200px]"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      {viewType === "list" ? (
        <Animated.View entering={FadeIn.duration(500).springify()}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("LikedSong");
            }}
            activeOpacity={0.7}
            className="flex-row items-center p-2 rounded-lg"
            style={{backgroundColor: `${COLOR.SECONDARY}15`}}>
            <LinearGradient
              style={{
                width: widthPercentageToDP(18),
                height: widthPercentageToDP(18),
                borderRadius: 8,
              }}
              colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
              className="justify-center items-center">
              <Entypo name="heart" size={36} color={COLOR.TEXT_PRIMARY} />
            </LinearGradient>
            <View style={{marginLeft: 12}}>
              <Text
                className="font-bold mb-[6px] text-[16px]"
                style={{color: COLOR.TEXT_PRIMARY}}>
                Bài hát đã thích
              </Text>
              <Text style={{color: COLOR.TEXT_SECONDARY}}>
                Danh sách phát • {likedSongs.length} bài hát
              </Text>
            </View>
          </TouchableOpacity>

          {myPlaylists.map(pl => renderListItem(pl, "myPlaylists"))}
          {likedPlaylists.map(pl => renderListItem(pl, "likedPlaylists"))}
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeIn.duration(500).springify()}
          className="flex flex-row justify-between flex-wrap">
          <TouchableOpacity
            style={{
              width: widthPercentageToDP(33) - 16,
              backgroundColor: `${COLOR.SECONDARY}15`,
              borderRadius: 12,
              padding: 8,
            }}
            onPress={() => {
              navigation.navigate("LikedSong");
            }}
            activeOpacity={0.7}
            className="flex-col items-center flex mb-4">
            <LinearGradient
              style={{
                width: widthPercentageToDP(33) - 32,
                height: widthPercentageToDP(33) - 32,
                borderRadius: 8,
              }}
              colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
              className="justify-center items-center">
              <Entypo name="heart" size={48} color={COLOR.TEXT_PRIMARY} />
            </LinearGradient>
            <View className="mt-2">
              <Text
                className="font-bold text-[14px]"
                style={{color: COLOR.TEXT_PRIMARY}}
                numberOfLines={2}>
                Bài hát đã thích
              </Text>
              <Text
                style={{color: COLOR.TEXT_SECONDARY, fontSize: 12}}
                numberOfLines={1}>
                {likedSongs.length} bài hát
              </Text>
            </View>
          </TouchableOpacity>

          {myPlaylists.map(pl => renderGridItem(pl, "myPlaylists"))}
          {likedPlaylists.map(pl => renderGridItem(pl, "likedPlaylists"))}

          {likedPlaylists.length % 3 !== 0 && (
            <TouchableOpacity
              style={{width: widthPercentageToDP(33) - 16}}
              activeOpacity={0.8}
              className="flex-col items-center flex my-1"
            />
          )}
        </Animated.View>
      )}
      <PlaylistManagerBottomSheet
        playlist={selectedPlaylistId}
        ref={playlistManagerRef}
      />
    </ScrollView>
  );
};

export default Playlist;
