import {View, Text, TouchableOpacity, Dimensions} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";
import {handlePlay, objectToTrack} from "../service/trackPlayerService";
import getThumbnail from "../utils/getThumnail";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import nodejs from "nodejs-mobile-react-native";
import useThemeStore from "../store/themeStore";
import {usePlayerStore} from "../store/playerStore";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import Loading from "../components/Loading";
import FastImage from "react-native-fast-image";
import tinycolor from "tinycolor2";
import useToggleLikeSong from "../hooks/useToggleLikeSong";
import {Heart, Play} from "iconsax-react-native";

const ChartScreens = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const COLOR = useThemeStore(state => state.COLOR);
  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);
  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);
  const navigation = useNavigation<any>();

  useEffect(() => {
    nodejs.channel.addListener("charthome", (data: any) => {
      setData(data.RTChart.items);
      setLoading(false);
    });
    nodejs.channel.post("charthome");
  }, []);

  const handlePlaySong = useCallback(
    (song: any) => {
      setCurrentSong(objectToTrack(song));
      handlePlay(song, {
        id: "chart",
        items: data,
      });
      setPlayFrom({
        id: "chart",
        name: "Bảng xếp hạng V-POP",
      });
    },
    [data]
  );

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Loading />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{backgroundColor: COLOR.BACKGROUND}}>
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full"
          style={{backgroundColor: `${COLOR.TEXT_SECONDARY}20`}}>
          <Ionicons name="arrow-back" size={22} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          style={{
            color: COLOR.TEXT_PRIMARY,
            fontFamily: "SVN-Gotham Black",
            fontSize: wp(4.5),
          }}>
          Bảng xếp hạng
        </Text>
        <View className="w-10" />
      </View>

      <FlashList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-4 py-6">
            <TopChart data={data[0]} onPlay={handlePlaySong} />
            <View className="flex-row mt-1">
              <TopChartItem data={data[1]} rank={2} onPlay={handlePlaySong} />
              <View className="w-1" />
              <TopChartItem data={data[2]} rank={3} onPlay={handlePlaySong} />
            </View>
          </View>
        }
        ListFooterComponent={() => <View style={{height: 100}} />}
        estimatedItemSize={70}
        data={[...data].splice(3, data.length)}
        renderItem={({item, index}) => (
          <ChartItem item={item} index={index} onPlay={handlePlaySong} />
        )}
      />
    </View>
  );
};

const TopChart = ({data, onPlay}: any) => {
  const COLOR = useThemeStore(state => state.COLOR);
  const {isLiked, handleAddToLikedList} = useToggleLikeSong(data?.encodeId);

  return (
    <View
      className="rounded-3xl p-4"
      style={{
        backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(3).toString(),
      }}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Text
            className="text-4xl font-black"
            style={{
              color: COLOR.PRIMARY,
              fontFamily: "SVN-Gotham Black",
            }}>
            01
          </Text>
          <View>
            <Text
              className="font-bold mb-1"
              style={{
                fontSize: wp(4),
                color: COLOR.TEXT_PRIMARY,
                fontFamily: "SVN-Gotham Bold",
              }}>
              {data?.title}
            </Text>
            <Text
              style={{
                fontSize: wp(3.2),
                color: COLOR.TEXT_SECONDARY,
              }}>
              {data?.artistsNames}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleAddToLikedList(data)}
          className="p-2 rounded-full"
          style={{
            backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(6).toString(),
          }}>
          <Heart
            size={20}
            variant={isLiked ? "Bold" : "Linear"}
            color={isLiked ? "#ff4757" : COLOR.TEXT_SECONDARY}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPlay(data)}
        className="relative">
        <FastImage
          source={{uri: getThumbnail(data?.thumbnailM)}}
          className="w-full aspect-square rounded-2xl"
        />
        <View className="absolute inset-0 bg-black/30 rounded-2xl items-center justify-center">
          <View
            className="p-4 rounded-full"
            style={{backgroundColor: COLOR.PRIMARY}}>
            <Play variant="Bold" color="#fff" size={24} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const TopChartItem = ({data, rank, onPlay}: any) => {
  const COLOR = useThemeStore(state => state.COLOR);
  const {isLiked, handleAddToLikedList} = useToggleLikeSong(data?.encodeId);

  return (
    <View
      className="flex-1 rounded-2xl p-3"
      style={{
        backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(3).toString(),
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPlay(data)}
        className="relative mb-3">
        <FastImage
          source={{uri: getThumbnail(data?.thumbnailM)}}
          className="w-full aspect-square rounded-xl"
        />
        <View className="absolute inset-0 bg-black/30 rounded-xl items-center justify-center">
          <View
            className="p-2 rounded-full"
            style={{backgroundColor: COLOR.PRIMARY}}>
            <Play variant="Bold" color="#fff" size={16} />
          </View>
        </View>
      </TouchableOpacity>

      <View className="flex-row items-center justify-between mb-2">
        <Text
          className="text-2xl font-black"
          style={{
            color: COLOR.PRIMARY,
            fontFamily: "SVN-Gotham Black",
          }}>
          {rank < 10 ? `0${rank}` : rank}
        </Text>
        <TouchableOpacity
          onPress={() => handleAddToLikedList(data)}
          className="p-1.5 rounded-full"
          style={{
            backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(6).toString(),
          }}>
          <Heart
            size={16}
            variant={isLiked ? "Bold" : "Linear"}
            color={isLiked ? "#ff4757" : COLOR.TEXT_SECONDARY}
          />
        </TouchableOpacity>
      </View>

      <Text
        numberOfLines={1}
        className="font-bold mb-1"
        style={{
          fontSize: wp(3.5),
          color: COLOR.TEXT_PRIMARY,
          fontFamily: "SVN-Gotham Bold",
        }}>
        {data?.title}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontSize: wp(3),
          color: COLOR.TEXT_SECONDARY,
        }}>
        {data?.artistsNames}
      </Text>
    </View>
  );
};

const ChartItem = React.memo(({item, index, onPlay}: any) => {
  const COLOR = useThemeStore(state => state.COLOR);
  const {isLiked, handleAddToLikedList} = useToggleLikeSong(item?.encodeId);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center mx-4 mb-4 p-3 rounded-2xl"
      style={{
        backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(3).toString(),
      }}
      onPress={() => onPlay(item)}>
      <Text
        className="font-bold mr-4 text-2xl w-10"
        style={{
          color: COLOR.PRIMARY,
          textAlign: "center",
          fontFamily: "SVN-Gotham Black",
        }}>
        {index + 4 < 10 ? `0${index + 4}` : index + 4}
      </Text>
      <FastImage
        source={{uri: getThumbnail(item.thumbnail)}}
        key={item.encodeId}
        className="rounded-xl"
        style={{
          width: wp(15),
          height: wp(15),
        }}
      />

      <View className="flex justify-center ml-3 flex-1">
        <Text
          numberOfLines={1}
          style={{
            fontSize: wp(3.8),
            fontFamily: "SVN-Gotham Bold",
            color: COLOR.TEXT_PRIMARY,
            marginBottom: 4,
          }}>
          {item?.title}
        </Text>

        <Text
          numberOfLines={1}
          style={{
            color: COLOR.TEXT_SECONDARY,
            fontSize: wp(3.2),
          }}>
          {item?.artistsNames}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleAddToLikedList(item)}
        className="p-2 rounded-full"
        style={{
          backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(6).toString(),
        }}>
        <Heart
          size={20}
          variant={isLiked ? "Bold" : "Linear"}
          color={isLiked ? "#ff4757" : COLOR.TEXT_SECONDARY}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

export default ChartScreens;
