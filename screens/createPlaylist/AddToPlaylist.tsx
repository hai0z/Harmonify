import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ToastAndroid,
} from "react-native";
import React from "react";
import useThemeStore from "../../store/themeStore";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {useUserStore} from "../../store/userStore";
import {addSongToPlaylist} from "../../service/firebase";
import RenderPlaylistThumbnail from "../library/components/RenderPlaylistThumnail";
import getThumbnail from "../../utils/getThumnail";
import CheckBox from "./components/CheckBox";
import {usePlayerStore} from "../../store/playerStore";
import LinearGradient from "react-native-linear-gradient";
import Entypo from "react-native-vector-icons/Entypo";
import useToggleLikeSong from "../../hooks/useToggleLikeSong";
import {GREEN} from "../../constants";
import tinycolor from "tinycolor2";

const AddToPlaylist = ({route}: {route: any}) => {
  const {song} = route.params;
  const {COLOR, theme} = useThemeStore();
  const navigation = useNavigation<any>();
  const {myPlaylists} = useUserStore();
  const {likedSongs} = usePlayerStore();

  const [likedSongSelected, setLikedSongSelected] = React.useState(false);

  const {handleAddToLikedList} = useToggleLikeSong();

  const playlistIncluded = myPlaylists.filter((pl: any) =>
    pl.songs.find((s: any) => s.encodeId == song.encodeId)
  );

  const likedSongIncluded = likedSongs.some(
    (s: any) => s.encodeId == song.encodeId
  );

  const playListNotIncluded = myPlaylists.filter(
    (pl: any) => !pl.songs.find((s: any) => s.encodeId == song.encodeId)
  );

  const [selectedPlaylistId, setSelectedPlaylistId] = React.useState<string[]>(
    []
  );

  const handleAddToPlaylist = async () => {
    try {
      if (selectedPlaylistId.length == 0 && !likedSongSelected) {
        navigation.goBack();
        return;
      }
      if (likedSongSelected) {
        handleAddToLikedList(song);
        navigation.goBack();
      }
      if (selectedPlaylistId.length > 0) {
        const promise = [];
        for (const id of selectedPlaylistId) {
          promise.push(addSongToPlaylist(id, song));
        }
        await Promise.all(promise).then(() => {
          setSelectedPlaylistId([]);
        });
        ToastAndroid.show("Đã thêm vào danh sách phát", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Thất bại", "Có lỗi xảy ra");
    }
  };

  const handleSelectPlaylist = (id: string) => {
    if (selectedPlaylistId.includes(id)) {
      setSelectedPlaylistId(selectedPlaylistId.filter(item => item !== id));
    } else {
      setSelectedPlaylistId([...selectedPlaylistId, id]);
    }
  };

  return (
    <View className="flex-1" style={{backgroundColor: COLOR.BACKGROUND}}>
      {/* Header */}
      <View className="px-4 pt-[55px] pb-4 border-b border-gray-500/10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text
            style={{
              color: COLOR.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(4.5),
            }}
            className="font-bold">
            Thêm vào danh sách phát
          </Text>
          <View className="w-6" />
        </View>
      </View>

      {/* Create New Playlist Button */}
      <View className="px-4 py-4 border-b border-gray-500/10">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("CreatePlaylist")}
          className="flex-row items-center justify-center py-3 rounded-full"
          style={{backgroundColor: theme === "amoled" ? GREEN : COLOR.PRIMARY}}>
          <Text
            className="font-bold"
            style={{
              color: COLOR.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(4),
            }}>
            Tạo danh sách phát mới
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Already Added Section */}
        {(playlistIncluded.length > 0 || likedSongIncluded) && (
          <View className="mt-4 mb-6">
            <Text
              className="font-bold mb-4"
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontSize: widthPercentageToDP(4),
              }}>
              Đã lưu vào
            </Text>

            {likedSongIncluded && (
              <TouchableOpacity
                disabled
                activeOpacity={0.8}
                className="flex-row items-center p-2 mb-3 rounded-xl"
                style={{
                  backgroundColor: tinycolor(COLOR.BACKGROUND)
                    .lighten(3)
                    .toString(),
                }}>
                <LinearGradient
                  style={{
                    width: widthPercentageToDP(15),
                    height: widthPercentageToDP(15),
                  }}
                  colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
                  className="justify-center items-center rounded-lg">
                  <Entypo name="heart" size={28} color={COLOR.TEXT_PRIMARY} />
                </LinearGradient>
                <View className="flex-1 ml-3">
                  <Text
                    className="font-bold mb-1"
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    Bài hát đã thích
                  </Text>
                  <Text
                    className="text-sm"
                    style={{color: COLOR.TEXT_SECONDARY}}>
                    {likedSongs.length} bài hát
                  </Text>
                </View>
                <CheckBox isChecked={true} />
              </TouchableOpacity>
            )}

            {playlistIncluded.map(pl => (
              <TouchableOpacity
                key={pl.encodeId}
                disabled
                activeOpacity={0.8}
                className="flex-row items-center p-2 mb-3 rounded-xl"
                style={{
                  backgroundColor: tinycolor(COLOR.BACKGROUND)
                    .lighten(3)
                    .toString(),
                }}>
                {pl.songs.length > 0 ? (
                  <RenderPlaylistThumbnail
                    songs={pl.songs}
                    playlistLength={pl.songs.length}
                    height={widthPercentageToDP(15)}
                    width={widthPercentageToDP(15)}
                  />
                ) : (
                  <Image
                    source={{uri: getThumbnail(pl?.thumbnail)}}
                    className="rounded-lg"
                    style={{
                      width: widthPercentageToDP(15),
                      height: widthPercentageToDP(15),
                    }}
                  />
                )}
                <View className="flex-1 ml-3">
                  <Text
                    className="font-bold mb-1"
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {pl?.title}
                  </Text>
                  <Text
                    className="text-sm"
                    style={{color: COLOR.TEXT_SECONDARY}}>
                    {pl.songs.length} bài hát
                  </Text>
                </View>
                <CheckBox isChecked={true} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Available Playlists Section */}
        {playListNotIncluded.length > 0 && (
          <View className="mb-24">
            <Text
              className="font-bold mb-4"
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontSize: widthPercentageToDP(4),
              }}>
              Danh sách phát của bạn
            </Text>

            {!likedSongIncluded && (
              <TouchableOpacity
                onPress={() => setLikedSongSelected(!likedSongSelected)}
                activeOpacity={0.8}
                className="flex-row items-center p-2 mb-3 rounded-xl"
                style={{
                  backgroundColor: tinycolor(COLOR.BACKGROUND)
                    .lighten(3)
                    .toString(),
                }}>
                <LinearGradient
                  style={{
                    width: widthPercentageToDP(15),
                    height: widthPercentageToDP(15),
                  }}
                  colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
                  className="justify-center items-center rounded-lg">
                  <Entypo name="heart" size={28} color={COLOR.TEXT_PRIMARY} />
                </LinearGradient>
                <View className="flex-1 ml-3">
                  <Text
                    className="font-bold mb-1"
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    Bài hát đã thích
                  </Text>
                  <Text
                    className="text-sm"
                    style={{color: COLOR.TEXT_SECONDARY}}>
                    {likedSongs.length} bài hát
                  </Text>
                </View>
                <CheckBox isChecked={likedSongSelected} />
              </TouchableOpacity>
            )}

            {playListNotIncluded.map(pl => (
              <TouchableOpacity
                key={pl.encodeId}
                onPress={() => handleSelectPlaylist(pl.encodeId)}
                activeOpacity={0.8}
                className="flex-row items-center p-2 mb-3 rounded-xl"
                style={{
                  backgroundColor: tinycolor(COLOR.BACKGROUND)
                    .lighten(3)
                    .toString(),
                }}>
                {pl.songs.length > 0 ? (
                  <RenderPlaylistThumbnail
                    songs={pl.songs}
                    playlistLength={pl.songs.length}
                    height={widthPercentageToDP(15)}
                    width={widthPercentageToDP(15)}
                  />
                ) : (
                  <Image
                    source={{uri: getThumbnail(pl?.thumbnail)}}
                    className="rounded-lg"
                    style={{
                      width: widthPercentageToDP(15),
                      height: widthPercentageToDP(15),
                    }}
                  />
                )}
                <View className="flex-1 ml-3">
                  <Text
                    className="font-bold mb-1"
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {pl?.title}
                  </Text>
                  <Text
                    className="text-sm"
                    style={{color: COLOR.TEXT_SECONDARY}}>
                    {pl.songs.length} bài hát
                  </Text>
                </View>
                <CheckBox
                  isChecked={selectedPlaylistId.includes(pl.encodeId)}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-4"
        style={{
          backgroundColor: COLOR.BACKGROUND,
          borderTopWidth: 1,
          borderTopColor: tinycolor(COLOR.TEXT_PRIMARY)
            .setAlpha(0.1)
            .toString(),
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddToPlaylist}
          className="py-3 rounded-full items-center"
          style={{backgroundColor: theme === "amoled" ? GREEN : COLOR.PRIMARY}}>
          <Text
            className="font-bold"
            style={{
              color: COLOR.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(4),
            }}>
            Xong
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddToPlaylist;
