import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
} from "react-native";
import React, {forwardRef, useCallback, useMemo} from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import useThemeStore from "../../store/themeStore";
import {widthPercentageToDP} from "react-native-responsive-screen";
import tinycolor from "tinycolor2";
import RenderPlaylistThumbnail from "../../screens/library/components/RenderPlaylistThumnail";
import getThumbnail from "../../utils/getThumnail";
import {addToLikedPlaylist, deletePlaylist} from "../../service/firebase";
import {useNavigation} from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
  playlist: any | null;
}

const PlaylistManagerBottomSheet = forwardRef(
  (props: Props, ref: React.ForwardedRef<BottomSheetModal>) => {
    const {COLOR} = useThemeStore(state => state);
    const {playlist} = props;
    const snapPoints = useMemo(() => ["35%"], []);
    const {dismiss} = useBottomSheetModal();
    const navigation = useNavigation<any>();

    const handleDeletePlaylist = async () => {
      Alert.alert("Xóa Playlist", "Bạn có chắc muốn xóa Playlist này?", [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await deletePlaylist(playlist.encodeId);
              dismiss();
              ToastAndroid.show("Xóa Playlist thành công", ToastAndroid.SHORT);
            } catch (error) {
              console.log(error);
            }
          },
          style: "destructive",
        },
      ]);
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        enablePanDownToClose
        handleIndicatorStyle={{
          backgroundColor: tinycolor(COLOR.TEXT_PRIMARY)
            .setAlpha(0.5)
            .toString(),
          width: 40,
        }}
        ref={ref}
        index={0}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(5).toString(),
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        snapPoints={snapPoints}>
        <BottomSheetView
          style={{
            ...styles.contentContainer,
            backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(5).toString(),
          }}>
          <View className="flex justify-center mb-6">
            <View className="flex-row items-center">
              {playlist?.type !== "likedPlaylists" ? (
                playlist?.songs?.length > 0 ? (
                  <RenderPlaylistThumbnail
                    songs={playlist?.songs}
                    playlistLength={playlist?.songs.length}
                    height={widthPercentageToDP(20)}
                    width={widthPercentageToDP(20)}
                  />
                ) : (
                  <Image
                    source={{uri: getThumbnail(playlist?.thumbnail)}}
                    style={{
                      width: widthPercentageToDP(20),
                      height: widthPercentageToDP(20),
                      borderRadius: 12,
                    }}
                  />
                )
              ) : (
                <Image
                  source={{uri: getThumbnail(playlist?.thumbnail)}}
                  style={{
                    width: widthPercentageToDP(20),
                    height: widthPercentageToDP(20),
                    borderRadius: 12,
                  }}
                />
              )}
              <View style={{marginLeft: 16, flex: 1}}>
                <Text
                  className="font-bold text-lg mb-1"
                  numberOfLines={2}
                  style={{color: COLOR.TEXT_PRIMARY}}>
                  {playlist?.title}
                </Text>
                <Text style={{color: COLOR.TEXT_SECONDARY}} className="text-sm">
                  {playlist?.type === "likedPlaylists"
                    ? `Danh sách phát • ${playlist?.totalSong} bài hát`
                    : `Danh sách phát • ${playlist?.songs.length} bài hát`}
                </Text>
              </View>
            </View>
          </View>

          <View
            className="w-full h-[0.5px] mb-4"
            style={{backgroundColor: `${COLOR.TEXT_SECONDARY}40`}}
          />

          {playlist?.type === "likedPlaylists" && (
            <TouchableOpacity
              onPress={async () => {
                await addToLikedPlaylist(playlist);
                ToastAndroid.show(
                  "Đã xóa khỏi danh sách yêu thích",
                  ToastAndroid.SHORT
                );
                dismiss();
              }}
              className="flex-row items-center py-4 px-2 active:opacity-70 rounded-xl"
              style={{backgroundColor: `${COLOR.TEXT_PRIMARY}10`}}>
              <Feather name="x-circle" size={22} color={COLOR.TEXT_PRIMARY} />
              <Text
                style={{color: COLOR.TEXT_PRIMARY}}
                className="font-semibold ml-3">
                Xoá khỏi yêu thích
              </Text>
            </TouchableOpacity>
          )}

          {playlist?.type === "myPlaylists" && (
            <View className="flex-col gap-3">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PlaylistStack", {
                    screen: "EditPlaylist",
                    params: {playlist},
                  });
                  dismiss();
                }}
                className="flex-row items-center py-4 px-2 rounded-xl"
                style={{backgroundColor: `${COLOR.TEXT_PRIMARY}10`}}>
                <MaterialCommunityIcons
                  name="pencil-circle-outline"
                  size={22}
                  color={COLOR.TEXT_PRIMARY}
                />
                <Text
                  style={{color: COLOR.TEXT_PRIMARY}}
                  className="font-semibold ml-3">
                  Chỉnh sửa playlist
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeletePlaylist}
                className="flex-row items-center py-4 px-2 rounded-xl"
                style={{backgroundColor: `${COLOR.TEXT_PRIMARY}10`}}>
                <Feather name="trash-2" size={22} color={COLOR.TEXT_PRIMARY} />
                <Text
                  style={{color: COLOR.TEXT_PRIMARY}}
                  className="font-semibold ml-3">
                  Xoá playlist
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default PlaylistManagerBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
