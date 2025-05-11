import {View, Text, TouchableOpacity, Image} from "react-native";
import React from "react";
import useThemeStore from "../../store/themeStore";
import useInternetState from "../../hooks/useInternetState";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import tinycolor from "tinycolor2";
import {GREEN} from "../../constants";
import Entypo from "react-native-vector-icons/Entypo";
import getThumbnail from "../../utils/getThumnail";

interface Props {
  e: any;
  onClick: (item: any) => void;
  isActive: boolean;
}

const RecentTrackItem = (props: Props) => {
  const {e, onClick, isActive} = props;
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);
  const isConnected = useInternetState();

  return (
    <TouchableOpacity
      disabled={!isConnected}
      onPress={() => onClick(e)}
      activeOpacity={0.8}
      style={{
        width: wp(50) - 35,
        backgroundColor: COLOR.isDark
          ? tinycolor(COLOR.BACKGROUND).brighten(2).toString()
          : tinycolor(COLOR.BACKGROUND).darken(2).toString(),
        opacity: isConnected ? 1 : 0.5,
        elevation: 2,
        flexDirection: "row",
      }}
      className="my-1 rounded-lg overflow-hidden">
      <View
        className="relative"
        style={{
          width: wp(15),
          height: wp(15),
        }}>
        <Image
          source={{uri: getThumbnail(e?.thumbnailM)}}
          className="rounded-l-lg"
          style={{width: wp(15), height: wp(15)}}
        />
        {isActive && (
          <View
            className="absolute bottom-1 right-1 p-1.5 rounded-full"
            style={{
              backgroundColor: tinycolor(COLOR.BACKGROUND)
                .setAlpha(0.8)
                .toString(),
            }}>
            <Entypo
              name="controller-play"
              size={12}
              color={theme !== "amoled" ? COLOR.PRIMARY : GREEN}
            />
          </View>
        )}
      </View>

      <View className="flex-1 p-1.5">
        <Text
          numberOfLines={2}
          style={{
            color: isActive
              ? theme !== "amoled"
                ? COLOR.PRIMARY
                : GREEN
              : COLOR.TEXT_PRIMARY,
            fontWeight: "600",
            fontSize: wp(3),
            lineHeight: wp(4),
          }}>
          {e?.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: tinycolor(COLOR.TEXT_PRIMARY).setAlpha(0.6).toString(),
            fontSize: wp(2.5),
            marginTop: 2,
          }}>
          {e?.artistsNames}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(RecentTrackItem);
