import {View, Text, TouchableOpacity} from "react-native";
import React, {useEffect, useMemo, useState} from "react";
import {FlashList} from "@shopify/flash-list";
import useSyncLyric from "../hooks/useSyncLyric";
import {useNavigation} from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import TrackPlayer, {useActiveTrack} from "react-native-track-player";
import TrackSlider from "../components/Player/Control/TrackSlider";
import PlayButton from "../components/Player/Control/PlayButton";
import {LinearGradient} from "react-native-linear-gradient";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import Animated, {FadeIn, SlideInDown} from "react-native-reanimated";
import useImageColor from "../hooks/useImageColor";
import use_local_auto_scroll from "../hooks/use_local_auto_scroll";
import {usePlayerStore} from "../store/playerStore";

const OFFSET = 3;
const DEFAULT_LINE = -1;

const LyricScreen = () => {
  const lyrics = usePlayerStore(state => state.lyrics);
  const currentLine = useSyncLyric();
  const currentSong = useActiveTrack();
  const navigation = useNavigation<any>();
  const {vibrantColor: bg} = useImageColor();
  const [textAlign, setTextAlign] = useState<any>("left");

  const textAlignArr = ["left", "center", "right"];
  const {onScroll, localAutoScroll} = use_local_auto_scroll({
    autoScroll: true,
    autoScrollAfterUserScroll: 2000,
  });

  const lyricsRef = React.useRef<FlashList<any>>(null);

  useEffect(() => {
    if (localAutoScroll && currentLine !== DEFAULT_LINE) {
      lyricsRef.current?.scrollToIndex({
        index: Math.max(0, currentLine - OFFSET),
        animated: true,
      });
    }
  }, [currentLine, localAutoScroll]);

  const renderHeader = useMemo(
    () => (
      <Animated.View
        entering={SlideInDown.duration(500)}
        className="flex flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={navigation.goBack}
          className="w-9 h-9 items-center justify-center rounded-full bg-black/20">
          <Entypo name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>

        <View className="flex-1 px-4">
          <Animated.Text
            entering={FadeIn.duration(400)}
            className="font-bold text-center text-base text-white"
            numberOfLines={1}>
            {currentSong?.title}
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.duration(400).delay(200)}
            className="text-sm text-center mt-0.5 text-white/70"
            numberOfLines={1}>
            {currentSong?.artist}
          </Animated.Text>
        </View>

        <View className="w-9" />
      </Animated.View>
    ),
    [currentSong]
  );

  const renderLyricItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          TrackPlayer.seekTo(+item.startTime / 1000);
          TrackPlayer.play();
        }}
        className="py-2">
        <Animated.Text
          entering={FadeIn.duration(400)}
          style={{
            color: index <= currentLine ? "#fff" : "#000",
            fontSize: wp(5),
            fontFamily: "SVN-Gotham Black",
            textAlign: textAlign,
          }}>
          {item.data}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1" style={{backgroundColor: bg}}>
      <View className="pt-12 flex-1">
        {renderHeader}

        <View className="flex-1 mt-4">
          <FlashList
            onScroll={onScroll}
            scrollEventThrottle={16}
            ref={lyricsRef}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 40,
            }}
            data={lyrics}
            estimatedItemSize={50}
            initialScrollIndex={Math.max(0, currentLine - OFFSET)}
            showsVerticalScrollIndicator={false}
            extraData={[currentLine, textAlign]}
            renderItem={renderLyricItem}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </View>

      <View className="px-4 py-6">
        <Animated.View
          entering={FadeIn.duration(500).delay(300)}
          className="w-full z-20">
          <TrackSlider />
          <View className="mt-6 items-center justify-between flex-row">
            <TouchableOpacity
              className="w-8 h-8 rounded-full"
              onPress={() => {
                const current = textAlignArr.findIndex(i => i === textAlign);
                setTextAlign(
                  current + 1 >= textAlignArr.length
                    ? textAlignArr[0]
                    : textAlignArr[current + 1]
                );
              }}>
              <Text>
                {textAlignArr[textAlignArr.findIndex(i => i === textAlign)]}
              </Text>
            </TouchableOpacity>
            <PlayButton />
            <TouchableOpacity
              className="w-8 h-8 rounded-full opacity-0"
              disabled>
              <Text>right</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default LyricScreen;
