import {View, Text, Image, StyleSheet, TouchableOpacity} from "react-native";
import React, {Fragment, memo, useEffect, useState} from "react";
import nodejs from "nodejs-mobile-react-native";
import getThumbnail from "../../utils/getThumnail";
import {usePlayerStore} from "../../store/playerStore";
import {useNavigation} from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import {DEFAULT_IMG} from "../../constants";
import useThemeStore from "../../store/themeStore";
import useImageColor from "../../hooks/useImageColor";
import {widthPercentageToDP} from "react-native-responsive-screen";
import Animated, {FadeIn} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import tinycolor from "tinycolor2";

const ArtistCard = () => {
  const tempSong = usePlayerStore(state => state.tempSong);
  const [data, setData] = useState<any>(null);
  const navigation = useNavigation<any>();
  const {COLOR} = useThemeStore(state => state);
  const {vibrantColor: bg} = useImageColor();

  useEffect(() => {
    nodejs.channel.addListener("getArtist", (data: any) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (
      !usePlayerStore.getState().isPlayFromLocal &&
      tempSong?.artists?.[0]?.alias &&
      tempSong?.artists?.length > 0
    ) {
      nodejs.channel.post("getArtist", tempSong?.artists[0]?.alias);
    } else {
      setData(null);
    }
  }, [tempSong?.encodeId]);

  if (data === null || usePlayerStore.getState().isPlayFromLocal) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="w-full rounded-3xl overflow-hidden h-[360px] mb-6">
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() =>
          navigation.navigate("Artists", {
            name: data?.alias,
          })
        }
        className="w-full h-full">
        <Image
          source={{uri: getThumbnail(data?.thumbnail) || DEFAULT_IMG}}
          className="w-full h-full"
          style={{resizeMode: "cover"}}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          className="absolute bottom-0 left-0 right-0 h-[200px]"
        />

        <View className="absolute top-5 left-5 right-5">
          <Text
            className="font-bold text-lg"
            style={{
              color: "#ffffff",
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 3,
              textShadowColor: "rgba(0,0,0,0.5)",
            }}>
            Giới thiệu về nghệ sĩ
          </Text>
        </View>

        <View className="absolute bottom-0 left-0 right-0 p-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text
              style={{
                color: "#ffffff",
                fontFamily: "SVN-Gotham Black",
                fontSize: widthPercentageToDP(6),
                textShadowOffset: {width: 1, height: 1},
                textShadowRadius: 3,
                textShadowColor: "rgba(0,0,0,0.5)",
              }}>
              {data?.name}
            </Text>

            <View
              style={{
                backgroundColor: tinycolor("#ffffff").setAlpha(0.2).toString(),
              }}
              className="h-10 w-10 rounded-full items-center justify-center">
              <Entypo name="chevron-right" size={24} color="#ffffff" />
            </View>
          </View>

          <View className="space-y-1">
            <Text
              className="text-sm"
              style={{
                color: tinycolor("#ffffff").setAlpha(0.9).toString(),
              }}>
              Ngày sinh: {data?.birthday || "Không rõ"}
            </Text>
            <Text
              className="text-sm"
              style={{
                color: tinycolor("#ffffff").setAlpha(0.9).toString(),
              }}>
              Người theo dõi: {data?.follow}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ArtistCard;
