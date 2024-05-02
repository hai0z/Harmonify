import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import useThemeStore from '../../store/themeStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useUserStore} from '../../store/userStore';
import {addSongToPlaylist} from '../../service/firebase';

const AddToPlaylist = ({route}: {route: any}) => {
  const {song} = route.params;
  const {COLOR} = useThemeStore();
  const navigation = useNavigation<any>();
  const {myPlaylists} = useUserStore();

  const handleAddToPlaylist = async (playListId: string) => {
    try {
      await addSongToPlaylist(playListId, song);
      ToastAndroid.show('Đã thêm vào danh sách phát', ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert('Thất bại', 'Có lỗi xảy ra');
    }
  };

  return (
    <View
      className="flex-1 pt-[55px] px-4"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <View className="flex flex-row justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          style={{
            color: COLOR.TEXT_PRIMARY,
            fontWeight: 'bold',
            fontSize: widthPercentageToDP(5),
          }}>
          Thêm vào danh sách phát
        </Text>
        <View className="w-4"></View>
      </View>
      <View className="justify-center items-center mt-6 flex">
        <TouchableOpacity
          className="py-3 rounded-full px-6"
          style={{backgroundColor: COLOR.PRIMARY}}>
          <Text style={{color: COLOR.TEXT_PRIMARY}}> Danh sách phát mới</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-8">
        <Text
          style={{color: COLOR.TEXT_PRIMARY, fontSize: widthPercentageToDP(4)}}
          className="font-bold">
          Danh sách phát của bạn
        </Text>
        <ScrollView>
          {myPlaylists.map((pl, index) => (
            <TouchableOpacity
              key={pl.encodeId}
              onPress={() => handleAddToPlaylist(pl.encodeId)}
              activeOpacity={0.8}
              className="flex-row items-center mt-4">
              <Image
                source={{uri: pl?.thumbnail}}
                style={{
                  width: widthPercentageToDP(18),
                  height: widthPercentageToDP(18),
                }}
              />
              <View style={{marginLeft: 10}}>
                <Text
                  className="font-bold mb-[5px]"
                  style={{color: COLOR.TEXT_PRIMARY}}>
                  {pl?.title}
                </Text>
                <Text style={{color: COLOR.TEXT_SECONDARY}}>
                  {`Danh sách phát • ${pl.songs.length} bài hát`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default AddToPlaylist;
