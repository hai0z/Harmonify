import {View, Text, TouchableOpacity, Alert, ToastAndroid} from 'react-native';
import React from 'react';
import useThemeStore from '../../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {updatePlaylist} from '../../service/firebase';

const EditPlaylist = ({route}: any) => {
  const {playlist} = route.params;

  const {COLOR} = useThemeStore();

  const navigation = useNavigation<any>();

  const [playlistName, setPlaylistName] = React.useState(playlist.title);

  const handleCreatePlaylist = async () => {
    if (playlistName.trim().length === 0) {
      Alert.alert('Thất bại', 'Vui lòng đặt tên cho playlist');
    } else {
      const playlistUpdate = {
        ...playlist,
        title: playlistName,
      };
      try {
        await updatePlaylist(playlistUpdate);
        navigation.goBack();
        ToastAndroid.show('Cập nhật playlist thành công', ToastAndroid.SHORT);
      } catch (error) {
        Alert.alert('Thất bại', 'Có lỗi xảy ra vui lòng thử lại sau');
      }
    }
  };
  return (
    <View
      className="flex-1 w-full justify-center items-center"
      style={{
        backgroundColor: COLOR.BACKGROUND,
      }}>
      <View className="w-full px-6">
        <Text
          style={{
            fontFamily: 'SVN-Gotham Black',
            fontSize: wp(6),
            color: COLOR.TEXT_PRIMARY,
          }}>
          Sửa tên cho playlist của bạn
        </Text>
        <TextInput
          value={playlistName}
          onChangeText={setPlaylistName}
          className="border-b py-4"
          placeholder="Tên playlist"
          placeholderTextColor={COLOR.TEXT_SECONDARY}
          style={{
            fontFamily: 'SVN-Gotham Black',
            fontSize: wp(4),
            borderColor: COLOR.TEXT_SECONDARY,
            color: COLOR.TEXT_PRIMARY,
          }}
        />
        <View className="flex flex-row justify-center items-center mt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-8"
            style={{
              borderColor: COLOR.SECONDARY,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 4,
              borderWidth: 1,
            }}>
            <Text
              style={{
                fontFamily: 'SVN-Gotham Black',
                fontSize: wp(4.5),
                color: COLOR.TEXT_SECONDARY,
              }}>
              Huỷ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreatePlaylist}
            style={{
              backgroundColor: COLOR.PRIMARY,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 4,
            }}>
            <Text
              style={{
                fontFamily: 'SVN-Gotham Black',
                fontSize: wp(4.5),
                color: COLOR.TEXT_PRIMARY,
              }}>
              Cập nhật
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditPlaylist;
