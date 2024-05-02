import {View, Text, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import useThemeStore from '../../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {DEFAULT_IMG} from '../../constants';
import {createPlaylist} from '../../service/firebase';
const CreatePlaylist = () => {
  const {COLOR} = useThemeStore();

  const navigation = useNavigation<any>();

  const [playlistName, setPlaylistName] = React.useState('');

  const handleCreatePlaylist = async () => {
    if (playlistName.trim().length === 0) {
      Alert.alert('Thất bại', 'Vui lòng đặt tên cho playlist');
    } else {
      const playlist = {
        encodeId: Math.random().toString(36).substring(10),
        title: playlistName,
        thumbnail: DEFAULT_IMG,
        songs: [],
      };
      try {
        await createPlaylist(playlist).then(() => {
          navigation.goBack();
        });
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
      <View>
        <Text
          style={{
            fontFamily: 'GothamBold',
            fontSize: wp(6),
            color: COLOR.TEXT_PRIMARY,
          }}>
          Đặt tên cho playlist của bạn
        </Text>
        <TextInput
          value={playlistName}
          onChangeText={setPlaylistName}
          className="border-b py-4"
          placeholder="Tên playlist"
          placeholderTextColor={COLOR.TEXT_SECONDARY}
          style={{
            fontFamily: 'GothamBold',
            fontSize: wp(4),
            borderColor: COLOR.TEXT_SECONDARY,
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
                fontFamily: 'GothamBold',
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
                fontFamily: 'GothamBold',
                fontSize: wp(4.5),
                color: COLOR.TEXT_PRIMARY,
              }}>
              Tạo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CreatePlaylist;
