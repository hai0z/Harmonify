import React, {useCallback, useContext, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  useBottomSheet,
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
import {objectToTrack} from '../../utils/musicControl';
import Feather from 'react-native-vector-icons/Feather';
import useDownloadSong from '../../hooks/useDownloadSong';
import {
  check,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

const TrackItemBottomSheet = () => {
  // ref
  const {data} = useBottomSheetStore(state => state);
  const {bottomSheetModalRef} = useContext(PlayerContext);

  // variables

  const snapPoints = useMemo(() => ['55%'], []);

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

  return (
    <BottomSheetModal
      enablePanDownToClose
      handleIndicatorStyle={{backgroundColor: '#ffffff90'}}
      ref={bottomSheetModalRef}
      index={0}
      backdropComponent={renderBackdrop}
      backgroundStyle={{backgroundColor: '#242424'}}
      snapPoints={snapPoints}>
      <BottomSheetView style={styles.contentContainer}>
        <View className="flex flex-row items-center">
          <Image
            source={{uri: getThumbnail(data?.thumbnail)}}
            className="w-14 h-14 rounded-md"
          />
          <View className="ml-2 w-full flex flex-col">
            <Text className="text-white font-semibold w-[80%]">
              {data?.title}
            </Text>
            <Text className="text-zinc-400">{data?.artistsNames}</Text>
          </View>
        </View>
        <View className="w-full bg-[#ffffff30] h-[0.5px] mt-4" />
        <View className="mt-4 flex-col">
          {!isLiked && (
            <TouchableOpacity
              className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
              onPress={() => {
                handleAddToLikedList(data);
                dismiss();
              }}>
              <AntDesign name="hearto" size={24} color="#ffffff90" />
              <Text className="text-white text-base">Thêm vào yêu thích</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
            onPress={() => {
              navigation.push('Artists', {name: data?.artists[0].alias});
              dismiss();
            }}>
            <FontAwesome5 name="user" size={24} color="#ffffff90" />
            <Text className="text-white text-base">Xem nghệ sĩ</Text>
          </TouchableOpacity>
          {data?.album && (
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
                color="#ffffff90"
              />
              <Text className="text-white text-base">Xem Album</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
            onPress={async () => {
              downloadFile(data);
            }}>
            <Feather name="download" size={24} color="#ffffff90" />
            <Text className="text-white text-base">Tải xuống</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#242424',
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default TrackItemBottomSheet;
