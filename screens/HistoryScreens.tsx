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
import useDarkColor from '../hooks/useDarkColor';
import tinycolor from 'tinycolor2';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  collection,
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
dayjs.locale('vi');
dayjs.extend(RelativeTime);

const HistoryScreens = () => {
  const {COLOR} = useThemeStore(state => state);

  const {color, setPlayFrom} = usePlayerStore(state => state);

  const navigation = useNavigation<any>();

  const [historyData, setHistoryData] = useState<Track[]>([]);

  const [loading, setLoading] = useState(true);
  const {startMiniPlayerTransition} = useContext(PlayerContext);
  useEffect(() => {
    const q = query(
      collection(db, `users/${auth.currentUser?.uid}/history`),
      orderBy('timestamp', 'desc'),
      where('timestamp', '>=', dayjs().subtract(30, 'day').millisecond()),
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

  const gradientColor = COLOR.isDark
    ? useDarkColor(color.dominant!, 20)
    : tinycolor(color.dominant!).isDark()
    ? tinycolor(color.dominant!).lighten(45).toString()
    : tinycolor(color.dominant!).darken().toString();

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
    $bg.value = withTiming(`${gradientColor}`, {duration: 1550});
  }, [gradientColor, loading]);

  if (loading) {
    return (
      <View
        style={{backgroundColor: COLOR.BACKGROUND}}
        className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      </View>
    );
  }
  return (
    <View
      className="pt-[35px] flex-1"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 left-0 right-0"
        style={{height: hp(15), backgroundColor: $bg}}
      />
      <LinearGradient
        style={{height: hp(15)}}
        colors={[`transparent`, `${COLOR.BACKGROUND}`]}
        className="absolute top-0 left-0 right-0 h-full"
      />
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
        <TouchableOpacity>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={COLOR.TEXT_PRIMARY}
          />
        </TouchableOpacity>
      </View>
      <View className="mt-4 flex-1 px-4">
        <FlashList
          ListFooterComponent={() => <View className="h-40" />}
          ListEmptyComponent={() => (
            <View className="flex justify-center items-center pt-10">
              <Text style={{color: COLOR.TEXT_PRIMARY}} className="text-center">
                Bạn chưa nghe bài hát nào gần dây
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          data={historyData}
          extraData={historyData}
          estimatedItemSize={70}
          keyExtractor={item => item.encodeId}
          renderItem={({item, index}) => {
            return (
              <TrackItem
                COLOR={COLOR}
                item={item}
                index={index}
                onClick={handlePlaySong}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const TrackItem = React.memo((props: any) => {
  const {item, onClick, COLOR} = props;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex flex-row  items-center my-2"
      onPress={() => onClick(item)}>
      <Image
        source={{
          uri: item?.thumbnail,
        }}
        key={item?.encodeId}
        className="rounded-md"
        style={{width: wp(14), height: wp(14)}}
      />

      <View className="flex justify-center ml-2 flex-1 ">
        <Text
          className="font-semibold"
          numberOfLines={1}
          style={{
            color: COLOR.TEXT_PRIMARY,
            fontSize: wp(4),
          }}>
          {item?.title}
        </Text>

        <View className="flex flex-row justify-between">
          <Text
            numberOfLines={1}
            style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(3.5)}}>
            {item?.artistsNames}
          </Text>
          <Text style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(2.5)}}>
            {dayjs(item?.timestamp).fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
export default HistoryScreens;
