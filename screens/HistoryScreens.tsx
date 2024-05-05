import {View, Text, Image, ActivityIndicator} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import useThemeStore from '../store/themeStore';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {usePlayerStore} from '../store/playerStore';
import {useNavigation} from '@react-navigation/native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {FlashList} from '@shopify/flash-list';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  runOnUI,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Track} from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';
import {collection, getDocs, limit, orderBy, query} from 'firebase/firestore';
import {auth, db} from '../firebase/config';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import {handlePlay} from '../service/trackPlayerService';
import {PlayerContext} from '../context/PlayerProvider';
import useImageColor from '../hooks/useImageColor';
import TrackItem from '../components/TrackItem';
import Loading from '../components/Loading';
dayjs.locale('vi');
dayjs.extend(RelativeTime);

const HistoryScreens = () => {
  const COLOR = useThemeStore(state => state.COLOR);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const playerContext = useContext(PlayerContext);

  const currentSong = usePlayerStore(state => state.currentSong);

  const id = useId();

  const navigation = useNavigation<any>();

  const [historyData, setHistoryData] = useState<Track[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      const q = query(
        collection(db, `users/${auth.currentUser?.uid}/history`),
        orderBy('timestamp', 'desc'),
        limit(100),
      );
      const docs = await getDocs(q);
      const songs = [] as any;
      docs.forEach(doc => {
        songs.push(doc.data());
      });
      setHistoryData(songs);
      setLoading(false);
    };
    getHistory();
  }, []);

  const {dominantColor: gradientColor} = useImageColor();

  const handlePlaySong = useCallback(
    (item: any) => {
      handlePlay(item, {
        id,
        items: historyData,
      });
      setPlayFrom({
        id: 'history',
        name: 'Bài hát gần đây',
      });
    },
    [historyData],
  );

  const $bg = useSharedValue(`transparent`);

  const changeBgAnimated = () => {
    'worklet';
    $bg.value = withTiming(`${gradientColor}70`, {
      duration: 1550,
      easing: Easing.inOut(Easing.quad),
    });
  };
  useEffect(() => {
    runOnUI(changeBgAnimated)();
  }, [gradientColor, historyData]);

  return (
    <View
      className="flex-1 w-full pt-[35px]"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 left-0 right-0"
        style={{height: hp(15), backgroundColor: $bg}}>
        <LinearGradient
          style={{height: hp(15)}}
          colors={[`transparent`, `${COLOR.BACKGROUND}`]}
          className="absolute bottom-0 left-0 right-0 h-full"
        />
      </Animated.View>

      <View className="flex flex-row items-center justify-between px-4">
        <Animated.View
          entering={FadeIn.duration(300).delay(300)}
          exiting={FadeOut}>
          <TouchableOpacity
            className="z-50"
            onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={24} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>
        </Animated.View>
        <View className="flex-1">
          <Animated.Text
            entering={FadeInDown.duration(300).springify()}
            className=" uppercase text-center text-[12px]"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Lịch sử nghe
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(300).delay(300).springify()}
            className=" font-semibold text-center"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Đã phát gần đây
          </Animated.Text>
        </View>
        <View className="w-5 h-5" />
      </View>
      {loading ? (
        <View className="flex-1">
          <View className="flex-1 flex justify-center items-center">
            <Loading />
          </View>
        </View>
      ) : (
        <View className="flex-1 pt-2">
          <FlashList
            ListHeaderComponent={<View className="h-8"></View>}
            ListFooterComponent={<View className="h-40" />}
            ListEmptyComponent={
              <View className="flex justify-center items-center pt-10">
                <Text
                  style={{color: COLOR.TEXT_PRIMARY}}
                  className="text-center">
                  Bạn chưa nghe bài hát nào gần dây
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            data={historyData}
            extraData={currentSong?.id}
            estimatedItemSize={70}
            nestedScrollEnabled
            keyExtractor={item => item.encodeId}
            renderItem={({item, index}) => {
              return (
                <TrackItem
                  isActive={currentSong?.id === item.encodeId}
                  showBottomSheet={playerContext.showBottomSheet}
                  item={item}
                  index={index}
                  onClick={handlePlaySong}
                />
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default HistoryScreens;
