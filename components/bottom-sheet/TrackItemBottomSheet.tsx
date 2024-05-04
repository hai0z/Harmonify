import React, {useCallback, useContext, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';

import {PlayerContext} from '../../context/PlayerProvider';
import getThumbnail from '../../utils/getThumnail';
import useBottomSheetStore from '../../store/bottomSheetStore';
import useToggleLikeSong from '../../hooks/useToggleLikeSong';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import useDownloadSong from '../../hooks/useDownloadSong';
import useThemeStore from '../../store/themeStore';
import tinycolor from 'tinycolor2';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {usePlayerStore} from '../../store/playerStore';
import SleepTimerBottomSheet from './SleepTimerBottomSheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {removeSongFromPlaylist} from '../../service/firebase';
interface Props {
  context?: 'player' | null;
}
const TrackItemBottomSheet = (props: Props) => {
  // ref
  const {context} = props;
  const {data} = useBottomSheetStore(state => state);
  const {bottomSheetModalRef} = useContext(PlayerContext);
  const {COLOR} = useThemeStore(state => state);

  // variables

  const snapPoints = useMemo(() => ['55%', '75%'], []);

  const {dismiss} = useBottomSheetModal();
  // renders
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  const {isLiked, handleAddToLikedList} = useToggleLikeSong(data?.encodeId);

  const navigation = useNavigation<any>();
  const {downloadFile} = useDownloadSong();
  const {sleepTimer, setSleepTimer} = usePlayerStore();

  const sleepTimerRef = useRef<BottomSheetModal>(null);

  const timerPress = () => {
    if (!sleepTimer) {
      sleepTimerRef.current?.present();
    } else {
      Alert.alert('Cảnh báo', 'Xoá bộ hẹn giờ ngủ?', [
        {
          text: 'Huỷ',
          style: 'cancel',
        },
        {
          text: 'Xoá',
          onPress: () => {
            setSleepTimer(null);
            ToastAndroid.show('Đã dừng bộ hẹn giờ ngủ', ToastAndroid.SHORT);
          },
          style: 'destructive',
        },
      ]);
    }
  };

  return (
    <BottomSheetModal
      enablePanDownToClose
      handleIndicatorStyle={{backgroundColor: COLOR.TEXT_SECONDARY}}
      ref={bottomSheetModalRef}
      index={0}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(5).toString(),
      }}
      snapPoints={snapPoints}>
      <BottomSheetView
        style={{
          ...styles.contentContainer,
          backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(5).toString(),
        }}>
        <View className="flex flex-row items-center">
          <Image
            source={{uri: getThumbnail(data?.thumbnail)}}
            style={{
              width: wp(15),
              height: wp(15),
            }}
          />
          <View className="ml-2 w-full flex flex-col flex-1">
            <Text
              className=" font-semibold w-[80%]"
              style={{color: COLOR.TEXT_PRIMARY}}>
              {data?.title}
            </Text>
            <Text style={{color: COLOR.TEXT_SECONDARY}}>
              {data?.artistsNames}
            </Text>
          </View>
        </View>
        <View
          className="w-full h-[1px] mt-4"
          style={{backgroundColor: COLOR.TEXT_SECONDARY}}></View>
        <View className="mt-4 flex-col">
          {!isLiked ? (
            <TouchableOpacity
              className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
              onPress={() => {
                handleAddToLikedList(data);
                dismiss();
              }}>
              <AntDesign
                name="hearto"
                size={24}
                color={`${COLOR.TEXT_PRIMARY}90`}
              />
              <Text className=" text-base" style={{color: COLOR.TEXT_PRIMARY}}>
                Thêm vào yêu thích
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="w-full py-3 flex flex-row items-center mb-3 gap-2"
              onPress={() => {
                handleAddToLikedList(data);
                dismiss();
              }}>
              <MaterialCommunityIcons
                name="heart-off-outline"
                size={24}
                color={`${COLOR.TEXT_PRIMARY}90`}
              />
              <Text className=" text-base" style={{color: COLOR.TEXT_PRIMARY}}>
                Xoá khỏi yêu thích
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
            onPress={() => {
              dismiss();
              navigation.navigate('PlaylistStack', {
                screen: 'AddToPlaylist',
                params: {song: data},
              });
            }}>
            <Feather
              name="plus-circle"
              size={24}
              color={`${COLOR.TEXT_PRIMARY}90`}
            />

            <Text className="text-base" style={{color: COLOR.TEXT_PRIMARY}}>
              Thêm vào danh sách phát
            </Text>
          </TouchableOpacity>
          {data?.playlistId && (
            <TouchableOpacity
              className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
              onPress={async () => {
                await removeSongFromPlaylist(data.playlistId, data).then(() => {
                  ToastAndroid.show('Đã xoá', ToastAndroid.SHORT);
                  dismiss();
                });
              }}>
              <Feather
                name="minus-circle"
                size={24}
                color={`${COLOR.TEXT_PRIMARY}90`}
              />

              <Text className="text-base" style={{color: COLOR.TEXT_PRIMARY}}>
                Xoá khỏi danh sách phát hiện tại
              </Text>
            </TouchableOpacity>
          )}
          {data?.artists[0]?.alias && (
            <TouchableOpacity
              className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
              onPress={() => {
                navigation.navigate('Artists', {name: data?.artists[0].alias});
                dismiss();
              }}>
              <FontAwesome5
                name="user-circle"
                size={24}
                color={`${COLOR.TEXT_PRIMARY}90`}
              />
              <Text className="text-base" style={{color: COLOR.TEXT_PRIMARY}}>
                Xem nghệ sĩ
              </Text>
            </TouchableOpacity>
          )}
          {data?.album?.endcodeId && (
            <TouchableOpacity
              className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
              onPress={() => {
                navigation.navigate('PlayListDetail', {
                  data: {playListId: data?.album?.encodeId},
                });
                dismiss();
              }}>
              <MaterialCommunityIcons
                name="music-circle-outline"
                size={24}
                color={`${COLOR.TEXT_PRIMARY}90`}
              />
              <Text className=" text-base" style={{color: COLOR.TEXT_PRIMARY}}>
                Xem Album
              </Text>
            </TouchableOpacity>
          )}
          {context === 'player' && (
            <TouchableOpacity
              onPress={timerPress}
              className="w-full py-3 flex flex-row items-center  mb-3 gap-2">
              <MaterialCommunityIcons
                name="clock-time-nine-outline"
                size={24}
                color={sleepTimer ? COLOR.PRIMARY : `${COLOR.TEXT_PRIMARY}90`}
              />
              <Text
                className="text-base"
                style={{
                  color: sleepTimer ? COLOR.PRIMARY : COLOR.TEXT_PRIMARY,
                }}>
                {sleepTimer
                  ? `Hẹn giờ ngủ (${Math.ceil(sleepTimer / 60)} phút)`
                  : 'Hẹn giờ ngủ'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
            onPress={async () => {
              downloadFile(data);
            }}>
            <Feather
              name="arrow-down-circle"
              size={24}
              color={`${COLOR.TEXT_PRIMARY}90`}
            />
            <Text className="text-base" style={{color: COLOR.TEXT_PRIMARY}}>
              Tải xuống
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
      <SleepTimerBottomSheet ref={sleepTimerRef} />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default TrackItemBottomSheet;
