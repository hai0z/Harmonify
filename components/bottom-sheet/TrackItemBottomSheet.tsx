import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  BackHandler,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import {PlayerContext} from "../../context/PlayerProvider";
import getThumbnail from "../../utils/getThumnail";
import useBottomSheetStore from "../../store/bottomSheetStore";
import useToggleLikeSong from "../../hooks/useToggleLikeSong";
import {useNavigation} from "@react-navigation/native";
import useDownloadSong from "../../hooks/useDownloadSong";
import useThemeStore from "../../store/themeStore";
import tinycolor from "tinycolor2";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {usePlayerStore} from "../../store/playerStore";
import SleepTimerBottomSheet from "./SleepTimerBottomSheet";
import {removeSongFromPlaylist} from "../../service/firebase";
import {navigation} from "../../utils/types/RootStackParamList";
import {
  AddCircle,
  ArrowCircleDown2,
  HeartAdd,
  HeartRemove,
  MinusCirlce,
  MusicCircle,
  ProfileCircle,
  Timer1,
} from "iconsax-react-native";

interface Props {
  context?: "player" | null;
}

const TrackItemBottomSheet = (props: Props) => {
  const {context} = props;
  const {data} = useBottomSheetStore(state => state);
  const {bottomSheetModalRef} = useContext(PlayerContext);
  const {COLOR} = useThemeStore(state => state);
  const [isOpen, setIsOpen] = React.useState(false);
  const snapPoints = useMemo(() => ["50%", "75%"], []);
  const {dismiss} = useBottomSheetModal();

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

  const {isLiked, handleAddToLikedList} = useToggleLikeSong(data?.encodeId);
  const navigation =
    useNavigation<
      navigation<"AddToPlaylist" | "PlayListDetail" | "PlaylistStack">
    >();
  const {downloadFile} = useDownloadSong();
  const {sleepTimer, setSleepTimer} = usePlayerStore();
  const sleepTimerRef = useRef<BottomSheetModal>(null);

  const timerPress = () => {
    if (!sleepTimer) {
      sleepTimerRef.current?.present();
    } else {
      Alert.alert("Cảnh báo", "Xoá bộ hẹn giờ ngủ?", [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xoá",
          onPress: () => {
            setSleepTimer(null);
            ToastAndroid.show("Đã dừng bộ hẹn giờ ngủ", ToastAndroid.SHORT);
          },
          style: "destructive",
        },
      ]);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        bottomSheetModalRef.current?.dismiss();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isOpen, bottomSheetModalRef]);

  const renderActionButton = (
    icon: React.ReactNode,
    text: string,
    onPress: () => void,
    color?: string
  ) => (
    <TouchableOpacity
      className="w-full py-4 flex-row items-center gap-3 px-4 active:bg-gray-100/10"
      onPress={onPress}>
      {icon}
      <Text
        className="text-base font-medium"
        style={{color: color || COLOR.TEXT_PRIMARY}}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal
      enablePanDownToClose
      handleIndicatorStyle={{backgroundColor: COLOR.TEXT_SECONDARY}}
      ref={bottomSheetModalRef}
      onChange={index => setIsOpen(index !== -1)}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(3).toString(),
      }}
      snapPoints={snapPoints}>
      <BottomSheetView style={styles.container}>
        <View className="flex-row items-center p-4 border-b border-gray-500/20">
          <Image
            source={{uri: getThumbnail(data?.thumbnail)}}
            className="rounded-lg"
            style={{width: wp(15), height: wp(15)}}
          />
          <View className="ml-3 flex-1">
            <Text
              numberOfLines={1}
              className="font-semibold text-base mb-1"
              style={{color: COLOR.TEXT_PRIMARY}}>
              {data?.title}
            </Text>
            <Text
              numberOfLines={1}
              className="text-sm"
              style={{color: COLOR.TEXT_SECONDARY}}>
              {data?.artistsNames}
            </Text>
          </View>
        </View>

        <View className="py-2">
          {!isLiked
            ? renderActionButton(
                <HeartAdd size={24} color={COLOR.TEXT_PRIMARY} />,
                "Thêm vào yêu thích",
                () => {
                  handleAddToLikedList(data);
                  dismiss();
                }
              )
            : renderActionButton(
                <HeartRemove size={24} color={COLOR.TEXT_PRIMARY} />,
                "Xoá khỏi yêu thích",
                () => {
                  handleAddToLikedList(data);
                  dismiss();
                }
              )}

          {renderActionButton(
            <AddCircle size={24} color={COLOR.TEXT_PRIMARY} />,
            "Thêm vào danh sách phát",
            () => {
              dismiss();
              navigation.navigate("PlaylistStack", {
                screen: "AddToPlaylist",
                params: {song: data},
              });
            }
          )}

          {data?.playlistId &&
            renderActionButton(
              <MinusCirlce size={24} color={COLOR.TEXT_PRIMARY} />,
              "Xoá khỏi danh sách phát hiện tại",
              async () => {
                await removeSongFromPlaylist(data.playlistId, data);
                ToastAndroid.show("Đã xoá", ToastAndroid.SHORT);
                dismiss();
              }
            )}

          {data?.artists?.[0]?.alias &&
            renderActionButton(
              <ProfileCircle size={24} color={COLOR.TEXT_PRIMARY} />,
              "Xem nghệ sĩ",
              () => {
                navigation.navigate("Artists", {name: data?.artists[0].alias});
                dismiss();
              }
            )}

          {data?.album &&
            renderActionButton(
              <MusicCircle size={24} color={COLOR.TEXT_PRIMARY} />,
              "Xem Album",
              () => {
                navigation.navigate("PlayListDetail", {
                  data: {playListId: data?.album?.encodeId},
                });
                dismiss();
              }
            )}

          {context === "player" &&
            renderActionButton(
              <Timer1
                size={24}
                color={sleepTimer ? COLOR.PRIMARY : COLOR.TEXT_PRIMARY}
              />,
              sleepTimer
                ? `Hẹn giờ ngủ (${Math.ceil(sleepTimer / 60)} phút)`
                : "Hẹn giờ ngủ",
              timerPress,
              sleepTimer ? COLOR.PRIMARY : undefined
            )}

          {renderActionButton(
            <ArrowCircleDown2 size={24} color={COLOR.TEXT_PRIMARY} />,
            "Tải xuống",
            () => downloadFile(data)
          )}
        </View>
      </BottomSheetView>
      <SleepTimerBottomSheet ref={sleepTimerRef} />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TrackItemBottomSheet;
