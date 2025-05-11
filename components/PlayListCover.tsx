import {TouchableOpacity, View} from "react-native";
import React, {memo} from "react";
import getThumbnail from "../utils/getThumnail";
import {useNavigation} from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import useThemeStore from "../store/themeStore";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {navigation} from "../utils/types/RootStackParamList";
import {Text} from "react-native-paper";
import tinycolor from "tinycolor2";
import LinearGradient from "react-native-linear-gradient";

interface coverProps {
  title: string;
  sortDescription?: string;
  thumbnail: string;
  encodeId: string;
  isAlbum?: boolean;
}

const PlayListCover = ({
  title,
  sortDescription,
  thumbnail,
  encodeId,
  isAlbum = false,
}: coverProps) => {
  const navigation = useNavigation<navigation<"PlayListDetail">>();
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);

  return (
    <TouchableOpacity
      style={{
        width: wp(42),
        backgroundColor: COLOR.isDark
          ? tinycolor(COLOR.BACKGROUND).lighten(4).toString()
          : tinycolor(COLOR.BACKGROUND).darken(2).toString(),
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: tinycolor(COLOR.TEXT_PRIMARY).setAlpha(0.1).toString(),
      }}
      activeOpacity={0.9}
      onPress={() =>
        navigation.push("PlayListDetail", {
          data: {
            playListId: encodeId,
          },
        })
      }>
      <View style={{position: "relative"}}>
        <FastImage
          source={{uri: getThumbnail(thumbnail) || ""}}
          style={{
            width: "100%",
            height: wp(42),
          }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", COLOR.isDark ? "#00000090" : "#ffffff90"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: wp(10),
          }}
        />
      </View>

      <View
        style={{
          padding: 12,
          backgroundColor: COLOR.isDark
            ? tinycolor(COLOR.BACKGROUND).lighten(6).toString()
            : tinycolor(COLOR.BACKGROUND).darken(3).toString(),
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: wp(3.8),
            color: COLOR.TEXT_PRIMARY,
            fontWeight: "800",
            marginBottom: 4,
            letterSpacing: 0.3,
          }}>
          {title}
        </Text>

        {!isAlbum && sortDescription && (
          <Text
            numberOfLines={2}
            style={{
              fontSize: wp(3.2),
              color: tinycolor(COLOR.TEXT_PRIMARY).setAlpha(0.8).toString(),
              lineHeight: wp(4.2),
              fontWeight: "500",
            }}>
            {sortDescription}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(PlayListCover);
