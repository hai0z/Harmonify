import {View, Text} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import useThemeStore from "../store/themeStore";
import AntDesign from "react-native-vector-icons/AntDesign";
import {usePlayerStore} from "../store/playerStore";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {FlashList} from "@shopify/flash-list";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  runOnUI,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import {auth, db} from "../firebase/config";
import "dayjs/locale/vi";
import {handlePlay} from "../service/trackPlayerService";
import {PlayerContext} from "../context/PlayerProvider";
import useImageColor from "../hooks/useImageColor";
import TrackItem from "../components/track-item/TrackItem";
import Loading from "../components/Loading";
import {navigation} from "../utils/types/RootStackParamList";
import {GREEN} from "../constants";

const ITEM_PER_PAGE = 20;

const HistoryScreens = () => {
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);
  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);
  const playerContext = useContext(PlayerContext);
  const currentSong = usePlayerStore(state => state.currentSong);
  const saveHistory = usePlayerStore(state => state.saveHistory);
  const navigation = useNavigation<navigation<"History">>();
  const [historyData, setHistoryData] = useState<any>([]);
  const id = useMemo(
    () => Math.random().toString(36).substring(7),
    [historyData.length]
  );
  const [loading, setLoading] = useState(false);
  const {dominantColor: gradientColor} = useImageColor();
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false);
  const $bg = useSharedValue("transparent");

  const handlePlaySong = useCallback(
    (item: any) => {
      handlePlay(item, {
        id,
        items: historyData,
      });
      setPlayFrom({
        id: "history",
        name: "Bài hát gần đây",
      });
    },
    [historyData]
  );

  const fetchMoreData = async () => {
    if (!lastVisible) return;

    setFetchMoreLoading(true);
    const q = query(
      collection(db, `users/${auth.currentUser?.uid}/history`),
      orderBy("timestamp", "desc"),
      startAfter(lastVisible),
      limit(ITEM_PER_PAGE)
    );
    const docs = await getDocs(q);
    const songs = [] as any;
    docs.forEach(doc => {
      songs.push(doc.data());
    });
    setHistoryData([...historyData, ...songs]);
    setLastVisible(docs.docs[docs.docs.length - 1]);
    setFetchMoreLoading(false);
  };

  const changeBgAnimated = () => {
    "worklet";
    $bg.value = withTiming(`${gradientColor}70`, {
      duration: 1550,
      easing: Easing.inOut(Easing.quad),
    });
  };

  useEffect(() => {
    const getHistory = async () => {
      setLoading(true);
      const q = query(
        collection(db, `users/${auth.currentUser?.uid}/history`),
        orderBy("timestamp", "desc"),
        limit(ITEM_PER_PAGE)
      );
      const docs = await getDocs(q);
      const songs = [] as any;
      docs.forEach(doc => {
        songs.push(doc.data());
      });
      setHistoryData(songs);
      setLastVisible(docs.docs[docs.docs.length - 1]);
      setLoading(false);
    };
    saveHistory && getHistory();
  }, [saveHistory]);

  useLayoutEffect(() => {
    runOnUI(changeBgAnimated)();
  }, [changeBgAnimated, gradientColor, historyData]);

  return (
    <View className="flex-1 w-full" style={{backgroundColor: COLOR.BACKGROUND}}>
      {/* Gradient Background */}
      <Animated.View
        className="absolute top-0 left-0 right-0"
        style={{height: hp(25), backgroundColor: $bg}}>
        <LinearGradient
          style={{height: hp(25)}}
          colors={["transparent", `${COLOR.BACKGROUND}`]}
          className="absolute bottom-0 left-0 right-0 h-full"
        />
      </Animated.View>

      {/* Header */}
      <View className="flex flex-row items-center justify-between px-6 pt-12 pb-4">
        <Animated.View
          entering={FadeIn.duration(300).delay(300)}
          exiting={FadeOut}>
          <TouchableOpacity
            className="p-2 rounded-full bg-black/10"
            onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={22} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>
        </Animated.View>

        <View className="flex-1 px-4">
          <Animated.Text
            entering={FadeInDown.duration(300).springify()}
            className="uppercase text-center text-[11px] opacity-80 mb-1"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Lịch sử nghe
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(300).delay(300).springify()}
            className="font-bold text-lg text-center"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Đã phát gần đây
          </Animated.Text>
        </View>

        <View className="w-10" />
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      ) : (
        <View className="flex-1">
          <FlashList
            onMomentumScrollEnd={fetchMoreData}
            ListHeaderComponent={<View className="h-4" />}
            ListFooterComponent={
              <View className="h-64 items-center justify-center">
                {fetchMoreLoading && <Loading />}
              </View>
            }
            ListEmptyComponent={
              <View
                className="flex justify-center items-center"
                style={{height: hp(70)}}>
                {!saveHistory ? (
                  <View className="flex items-center gap-3">
                    <Text
                      style={{color: COLOR.TEXT_PRIMARY}}
                      className="text-base opacity-80">
                      Lịch sử nghe đang tắt
                    </Text>
                    <TouchableOpacity
                      className="px-6 py-2 rounded-full bg-black/10"
                      onPress={() => navigation.navigate("SettingStack")}>
                      <Text
                        style={{
                          color: theme === "amoled" ? GREEN : COLOR.PRIMARY,
                        }}
                        className="font-medium">
                        Bật lịch sử nghe
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text
                    style={{color: COLOR.TEXT_PRIMARY}}
                    className="text-base opacity-80">
                    Bạn chưa nghe bài hát nào gần đây
                  </Text>
                )}
              </View>
            }
            showsVerticalScrollIndicator={false}
            data={saveHistory ? historyData : []}
            extraData={currentSong?.id}
            estimatedItemSize={70}
            nestedScrollEnabled
            keyExtractor={(item: any) => item.encodeId}
            renderItem={({item, index}: any) => (
              <TrackItem
                isActive={currentSong?.id === item.encodeId}
                showBottomSheet={playerContext.showBottomSheet}
                item={item}
                index={index}
                onClick={handlePlaySong}
                timeStamp={item.timestamp}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default HistoryScreens;
