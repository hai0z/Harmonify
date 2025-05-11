import {Text, View} from "react-native";
import React, {memo, useEffect, useState} from "react";
import {usePlayerStore} from "../../store/playerStore";
import dayjs from "dayjs";
import nodejs from "nodejs-mobile-react-native";
import useThemeStore from "../../store/themeStore";
import Animated, {FadeIn} from "react-native-reanimated";
import useImageColor from "../../hooks/useImageColor";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {
  Headphone,
  Heart,
  Calendar,
  User,
  MusicSquare,
  Category,
} from "iconsax-react-native";
import tinycolor from "tinycolor2";

function formatNumber(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  }
}

const SongInfoCard = () => {
  const currentSong = usePlayerStore(state => state.currentSong);
  const {COLOR} = useThemeStore(state => state);
  const {vibrantColor: bg} = useImageColor();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener("getSongInfo", (data: any) => {
      setData(data);
      setLoading(false);
    });
    nodejs.channel.post("getSongInfo", currentSong?.id);
  }, [currentSong?.id]);

  if (
    loading ||
    currentSong === undefined ||
    usePlayerStore.getState().isPlayFromLocal ||
    data === null
  ) {
    return null;
  }

  const InfoRow = ({icon, text}: {icon: React.ReactNode; text: string}) => (
    <View className="flex-row items-center space-x-3 py-2.5">
      {icon}
      <Text
        className="flex-1"
        style={{
          color: COLOR.TEXT_PRIMARY,
          fontSize: wp(4),
          fontFamily: "SVN-Gotham Regular",
        }}
        numberOfLines={2}>
        {text}
      </Text>
    </View>
  );

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={{
        backgroundColor: tinycolor(bg).setAlpha(0.15).toString(),
      }}
      className="w-full rounded-3xl px-5 py-4 mb-4">
      <InfoRow
        icon={<Calendar size={20} color={COLOR.TEXT_PRIMARY} variant="Bold" />}
        text={
          data?.releaseDate
            ? `Phát hành: ${dayjs.unix(data?.releaseDate).format("DD/MM/YYYY")}`
            : "Ngày phát hành: Không rõ"
        }
      />

      <InfoRow
        icon={
          <MusicSquare size={20} color={COLOR.TEXT_PRIMARY} variant="Bold" />
        }
        text={`Tác giả: ${
          data?.composers?.map((e: any) => e?.name).join(", ") || "Không rõ"
        }`}
      />

      <InfoRow
        icon={<Category size={20} color={COLOR.TEXT_PRIMARY} variant="Bold" />}
        text={`Thể loại: ${data?.genres?.map((e: any) => e?.name).join(", ")}`}
      />

      <InfoRow
        icon={<User size={20} color={COLOR.TEXT_PRIMARY} variant="Bold" />}
        text={`Nghệ sĩ: ${data?.artists?.map((e: any) => e?.name).join(", ")}`}
      />

      <View className="flex-row items-center space-x-6 mt-2">
        <View className="flex-row items-center space-x-2">
          <Heart size={20} color={COLOR.TEXT_PRIMARY} variant="Bold" />
          <Text style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4)}}>
            {formatNumber(data?.like)}
          </Text>
        </View>

        <View className="flex-row items-center space-x-2">
          <Headphone size={20} color={COLOR.TEXT_PRIMARY} variant="Bold" />
          <Text style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4)}}>
            {formatNumber(data?.listen)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default SongInfoCard;
