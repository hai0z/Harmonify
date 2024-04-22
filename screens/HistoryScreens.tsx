import {View, Text, Image, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import useThemeStore from '../store/themeStore';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {usePlayerStore} from '../store/playerStore';
import {useNavigation} from '@react-navigation/native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlashList} from '@shopify/flash-list';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Track} from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {auth, db} from '../firebase/config';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import {handlePlay} from '../service/trackPlayerService';
import {PlayerContext} from '../context/PlayerProvider';
import useImageColor from '../hooks/useImageColor';
import getThumbnail from '../utils/getThumnail';
import TrackItem from '../components/TrackItem';
import useBottomSheetStore from '../store/bottomSheetStore';
dayjs.locale('vi');
dayjs.extend(RelativeTime);

const HistoryScreens = () => {
  const {COLOR} = useThemeStore(state => state);

  const {setPlayFrom} = usePlayerStore(state => state);

  const {showBottomSheet} = useContext(PlayerContext);

  const navigation = useNavigation<any>();

  const [historyData, setHistoryData] = useState<Track[]>([]);

  const [loading, setLoading] = useState(true);
  const {startMiniPlayerTransition} = useContext(PlayerContext);
  useEffect(() => {
    const q = query(
      collection(db, `users/${auth.currentUser?.uid}/history`),
      orderBy('timestamp', 'desc'),
      limit(50),
    );
    const unsub = onSnapshot(q, querySnapshot => {
      const songs = [] as any;
      querySnapshot.forEach(doc => {
        songs.push(doc.data());
      });
      setHistoryData(songs);
      setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  const {dominantColor: gradientColor} = useImageColor();

  const handlePlaySong = (item: any) => {
    handlePlay(item, {
      id: Math.random().toString(36).substring(7),
      items: historyData,
    });
    setPlayFrom({
      id: 'history',
      name: 'Bài hát gần đây',
    });
    startMiniPlayerTransition();
  };

  const $bg = useSharedValue(`transparent`);

  useEffect(() => {
    console.log('sdfasdf');
    $bg.value = withTiming(`${gradientColor}90`, {duration: 1550});
  }, [gradientColor, loading]);

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
        <View className="flex-1 pt-4">
          <View className="flex-1 flex justify-center items-center">
            <ActivityIndicator size="large" color={COLOR.PRIMARY} />
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
            extraData={historyData}
            estimatedItemSize={70}
            nestedScrollEnabled
            keyExtractor={item => item.encodeId}
            renderItem={({item, index}) => {
              return (
                <TrackItem
                  showBottomSheet={showBottomSheet}
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
