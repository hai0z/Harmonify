import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useContext, useMemo} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {FlashList} from '@shopify/flash-list';
import {handlePlay} from '../../service/trackPlayerService';
import {useNavigation} from '@react-navigation/native';
import {useActiveTrack} from 'react-native-track-player';
import {usePlayerStore} from '../../store/playerStore';
import Entypo from 'react-native-vector-icons/Entypo';
import TrackItem from '../../components/TrackItem';
import {PlayerContext} from '../../context/PlayerProvider';
import useBottomSheetStore from '../../store/bottomSheetStore';
import useThemeStore from '../../store/themeStore';
const SCREEN_WIDTH = Dimensions.get('window').width;

const PlaylistDetail = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const COLOR = useThemeStore(state => state.COLOR);
  const navigation = useNavigation<any>();

  const {likedSongs: likedSong} = usePlayerStore(state => state);
  const headerColor = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [SCREEN_WIDTH * 0.79, SCREEN_WIDTH * 0.8],
        outputRange: ['transparent', COLOR.BACKGROUND],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const {showBottomSheet} = useContext(PlayerContext);
  const headerTitleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.8],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const titleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const handlePlaySong = useCallback(
    (song: any) =>
      handlePlay(song, {
        id: `${likedSong.length}-likedSong`,
        items: likedSong,
      }),
    [],
  );

  return (
    <View
      className="flex-1  w-full"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-30 h-20  justify-between items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View className="justify-center items-center">
          <Animated.Text
            style={{opacity: headerTitleOpacity, color: COLOR.TEXT_PRIMARY}}
            className="font-bold">
            Bài hát đã thích
          </Animated.Text>
        </View>
        <View className="w-10"></View>
      </Animated.View>
      <FlashList
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        ListHeaderComponent={React.memo(() => {
          return (
            <View>
              <View
                className="flex justify-end items-center pb-4"
                style={{height: SCREEN_WIDTH * 0.8}}>
                <LinearGradient
                  colors={['transparent', COLOR.BACKGROUND]}
                  className="absolute bottom-0 h-40 left-0 right-0 z-50"
                />
                <LinearGradient
                  colors={[COLOR.PRIMARY, 'transparent']}
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      width: SCREEN_WIDTH,
                      height: SCREEN_WIDTH * 0.8,
                    },
                  ]}
                />
                <LinearGradient
                  colors={[COLOR.PRIMARY, COLOR.SECONDARY]}
                  style={[
                    {
                      width: SCREEN_WIDTH * 0.6,
                      height: SCREEN_WIDTH * 0.6,
                    },
                  ]}
                  className="justify-center items-center rounded-lg z-[99]">
                  <Entypo name="heart" size={120} color={COLOR.TEXT_PRIMARY} />
                </LinearGradient>
              </View>
              <View className="z-50 mt-4 px-6 mb-4">
                <Animated.Text
                  style={{opacity: titleOpacity, color: COLOR.TEXT_PRIMARY}}
                  className=" text-center text-3xl font-bold">
                  {'Bài hát đã thích'}
                </Animated.Text>
              </View>
            </View>
          );
        })}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        ListFooterComponent={() => <View style={{height: SCREEN_WIDTH}} />}
        nestedScrollEnabled
        data={likedSong}
        estimatedItemSize={72}
        extraData={[likedSong]}
        keyExtractor={(item: any, index) => `${item.encodeId}_${index}`}
        renderItem={({item}: any) => {
          return (
            <TrackItem
              item={item}
              onClick={handlePlaySong}
              isAlbum={false}
              showBottomSheet={showBottomSheet}
            />
          );
        }}
      />
    </View>
  );
};

export default PlaylistDetail;
