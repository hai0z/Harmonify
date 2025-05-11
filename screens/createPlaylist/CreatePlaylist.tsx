import {View, Text, TouchableOpacity, Alert} from "react-native";
import React from "react";
import useThemeStore from "../../store/themeStore";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {TextInput} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";
import {DEFAULT_IMG} from "../../constants";
import {createPlaylist} from "../../service/firebase";
import {ArrowLeft} from "iconsax-react-native";
import tinycolor from "tinycolor2";

const CreatePlaylist = () => {
  const {COLOR} = useThemeStore();
  const navigation = useNavigation<any>();
  const [playlistName, setPlaylistName] = React.useState("");

  const handleCreatePlaylist = async () => {
    if (playlistName.trim().length === 0) {
      Alert.alert("Thất bại", "Vui lòng đặt tên cho playlist");
    } else {
      const playlist = {
        encodeId: Math.random().toString(36).substring(3),
        title: playlistName,
        thumbnail: DEFAULT_IMG,
        songs: [],
      };
      try {
        await createPlaylist(playlist).then(() => {
          navigation.goBack();
        });
      } catch (error) {
        Alert.alert("Thất bại", "Có lỗi xảy ra vui lòng thử lại sau");
      }
    }
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: COLOR.BACKGROUND,
      }}>
      <View className="flex-row items-center px-4 pt-12 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full"
          style={{
            backgroundColor: tinycolor(COLOR.BACKGROUND)
              .setAlpha(0.5)
              .toString(),
          }}>
          <ArrowLeft size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          className="ml-4"
          style={{
            fontFamily: "SVN-Gotham Black",
            fontSize: wp(5),
            color: COLOR.TEXT_PRIMARY,
          }}>
          Tạo playlist mới
        </Text>
      </View>

      <View className="flex-1 px-6 justify-center">
        <View
          className="bg-opacity-10 rounded-xl p-6"
          style={{
            backgroundColor: tinycolor(COLOR.PRIMARY).setAlpha(0.1).toString(),
          }}>
          <Text
            style={{
              fontFamily: "SVN-Gotham Black",
              fontSize: wp(6),
              color: COLOR.TEXT_PRIMARY,
              marginBottom: 20,
            }}>
            Đặt tên cho playlist của bạn
          </Text>

          <TextInput
            value={playlistName}
            onChangeText={setPlaylistName}
            className="border-b py-4 mb-8"
            placeholder="Tên playlist"
            placeholderTextColor={COLOR.TEXT_SECONDARY}
            style={{
              fontFamily: "SVN-Gotham Black",
              fontSize: wp(4),
              borderColor: tinycolor(COLOR.TEXT_SECONDARY)
                .setAlpha(0.3)
                .toString(),
              color: COLOR.TEXT_PRIMARY,
            }}
          />

          <View className="flex-row justify-end items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-4 px-6 py-3 rounded-full"
              style={{
                borderColor: COLOR.TEXT_SECONDARY,
                borderWidth: 1,
              }}>
              <Text
                style={{
                  fontFamily: "SVN-Gotham Black",
                  fontSize: wp(4),
                  color: COLOR.TEXT_SECONDARY,
                }}>
                Huỷ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreatePlaylist}
              className="px-6 py-3 rounded-full"
              style={{
                backgroundColor: COLOR.PRIMARY,
              }}>
              <Text
                style={{
                  fontFamily: "SVN-Gotham Black",
                  fontSize: wp(4),
                  color: COLOR.TEXT_PRIMARY,
                }}>
                Tạo playlist
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CreatePlaylist;
