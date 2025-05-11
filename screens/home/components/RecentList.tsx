import {View, Text} from "react-native";
import React, {memo, useCallback, useMemo} from "react";
import useThemeStore from "../../../store/themeStore";
import {handlePlay, objectToTrack} from "../../../service/trackPlayerService";
import {usePlayerStore} from "../../../store/playerStore";
import RecentTrackItem from "../../../components/track-item/RecentTrackItem";
import tinycolor from "tinycolor2";
import LinearGradient from "react-native-linear-gradient";
import Animated, {FadeIn} from "react-native-reanimated";

const RecentList = ({data}: any) => {
  const COLOR = useThemeStore(state => state.COLOR);

  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const id = useMemo(() => Math.random().toString(36).substring(7), []);

  const currentSong = usePlayerStore(state => state.currentSong);

  const handlePlaySong = useCallback(
    (song: any) => {
      setCurrentSong(objectToTrack(song));
      handlePlay(song, {
        id,
        items: data,
      });
      setPlayFrom({
        id: "history",
        name: "Bài hát gần đây",
      });
    },
    [data]
  );
  const renderData = useMemo(() => data?.slice(0, 6), [data]);

  if (data.length < 6 || !data) return null;
  return (
    <Animated.View
      entering={FadeIn.duration(500).springify()}
      style={{
        marginHorizontal: 12,
        marginVertical: 8,
      }}>
      <LinearGradient
        colors={[`${COLOR.PRIMARY}15`, `${COLOR.SECONDARY}10`]}
        style={{
          borderRadius: 16,
          padding: 16,
        }}>
        <View className="flex flex-row items-center justify-between mb-6">
          <Text
            className="text-2xl font-bold"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Nghe Lại
          </Text>
          <Text
            className="text-sm font-medium"
            style={{
              color: tinycolor(COLOR.TEXT_PRIMARY).setAlpha(0.7).toString(),
            }}>
            {data.length} bài hát
          </Text>
        </View>

        <View
          className="flex flex-wrap flex-row justify-between"
          style={{
            width: "100%",
            gap: 8,
          }}>
          {renderData?.map((e: any, index: number) => {
            return (
              <RecentTrackItem
                key={index}
                e={e}
                onClick={handlePlaySong}
                isActive={currentSong?.id === e?.encodeId}
              />
            );
          })}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default memo(RecentList);
