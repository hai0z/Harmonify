import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {forwardRef, useCallback, useMemo} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import useThemeStore from '../../store/themeStore';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import tinycolor from 'tinycolor2';
import RenderPlaylistThumbnail from '../../screens/library/components/RenderPlaylistThumnail';
import getThumbnail from '../../utils/getThumnail';
import {deletePlaylist} from '../../service/firebase';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface Props {
  playlist: any | null;
}
const PlaylistManagerBottomSheet = forwardRef(
  (props: Props, ref: React.ForwardedRef<BottomSheetModal>) => {
    const {COLOR} = useThemeStore(state => state);

    const {playlist} = props;

    const snapPoints = useMemo(() => ['30%'], []);

    const {dismiss} = useBottomSheetModal();

    const navigation = useNavigation<any>();

    const handleDeletePlaylist = async () => {
      Alert.alert('Xóa Playlist', 'Bản có muốn xóa Playlist này', [
        {
          text: 'Huỷ',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await deletePlaylist(playlist.encodeId);
              dismiss();
              ToastAndroid.show('Xóa Playlist thành công', ToastAndroid.SHORT);
            } catch (error) {
              console.log(error);
            }
          },
          style: 'destructive',
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
      [],
    );
    return (
      <BottomSheetModal
        enablePanDownToClose
        handleIndicatorStyle={{backgroundColor: COLOR.TEXT_SECONDARY}}
        ref={ref}
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
          <View className="flex justify-center">
            <View className="flex-row items-center">
              {playlist?.songs.length > 0 ? (
                <RenderPlaylistThumbnail
                  songs={playlist?.songs}
                  playlistLength={playlist?.songs.length}
                  height={widthPercentageToDP(18)}
                  width={widthPercentageToDP(18)}
                />
              ) : (
                <Image
                  source={{uri: getThumbnail(playlist?.thumbnail)}}
                  style={{
                    width: widthPercentageToDP(18),
                    height: widthPercentageToDP(18),
                  }}
                />
              )}
              <View style={{marginLeft: 10}}>
                <Text
                  className="font-bold mb-[5px]"
                  style={{color: COLOR.TEXT_PRIMARY}}>
                  {playlist?.title}
                </Text>
                <Text style={{color: COLOR.TEXT_SECONDARY}}>
                  {`Danh sách phát • ${playlist?.songs.length} bài hát`}
                </Text>
              </View>
            </View>
          </View>
          <View
            className="w-full h-[1px] mt-4"
            style={{backgroundColor: COLOR.TEXT_SECONDARY}}></View>
          <View className="mt-4 flex flex-col flex-1">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PlaylistStack', {
                  screen: 'EditPlaylist',
                  params: {playlist},
                });
                dismiss();
              }}
              className="w-full flex-row items-center py-3 gap-2">
              <MaterialCommunityIcons
                name="pencil-circle-outline"
                size={24}
                color={`${COLOR.TEXT_PRIMARY}90`}
              />
              <Text style={{color: COLOR.TEXT_PRIMARY}} className="font-bold">
                Sửa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeletePlaylist}
              className="w-full flex-row items-center gap-2  py-3">
              <Feather
                name="x-circle"
                size={24}
                color={`${COLOR.TEXT_PRIMARY}90`}
              />
              <Text style={{color: COLOR.TEXT_PRIMARY}} className="font-bold">
                Xoá
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default PlaylistManagerBottomSheet;
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
