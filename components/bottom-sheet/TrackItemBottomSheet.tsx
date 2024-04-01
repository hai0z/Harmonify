import React, {useCallback, useContext, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
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

const TrackItemBottomSheet = () => {
  // ref
  const {data} = useBottomSheetStore(state => state);
  const {bottomSheetModalRef} = useContext(PlayerContext);

  const {COLOR} = useThemeStore(state => state);
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
            className="w-14 h-14 rounded-md"
          />
          <View className="ml-2 w-full flex flex-col">
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
        <View className="w-full  h-[0.5px] mt-4" />
        <View className="mt-4 flex-col">
          {!isLiked && (
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
          )}
          <TouchableOpacity
            className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
            onPress={() => {
              navigation.push('Artists', {name: data?.artists[0].alias});
              dismiss();
            }}>
            <FontAwesome5
              name="user"
              size={24}
              color={`${COLOR.TEXT_PRIMARY}90`}
            />
            <Text className="text-base" style={{color: COLOR.TEXT_PRIMARY}}>
              Xem nghệ sĩ
            </Text>
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
                color={`${COLOR.TEXT_PRIMARY}90`}
              />
              <Text className=" text-base" style={{color: COLOR.TEXT_PRIMARY}}>
                Xem Album
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="w-full py-3 flex flex-row items-center  mb-3 gap-2"
            onPress={async () => {
              downloadFile(data);
            }}>
            <Feather
              name="download"
              size={24}
              color={`${COLOR.TEXT_PRIMARY}90`}
            />
            <Text className="text-base" style={{color: COLOR.TEXT_PRIMARY}}>
              Tải xuống
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
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
