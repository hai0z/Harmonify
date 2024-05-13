import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  TextInput,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useContext, useEffect, useMemo} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {FlashList} from '@shopify/flash-list';
import {handlePlay} from '../../service/trackPlayerService';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '../../store/playerStore';
import Entypo from 'react-native-vector-icons/Entypo';
import TrackItem from '../../components/track-item/TrackItem';
import {PlayerContext} from '../../context/PlayerProvider';
import useThemeStore from '../../store/themeStore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import tinycolor from 'tinycolor2';
import stringToSlug from '../../utils/removeSign';
const SCREEN_WIDTH = Dimensions.get('window').width;
import RAnimated, {
  FadeOutUp,
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';
const caculateTotalTime = (playlistData: any) => {
  let total = 0;
  playlistData?.forEach((item: any) => {
    total += item.duration;
  });
  const hours = Math.floor(total / 3600);
  const remainingSeconds = total % 3600;
  const minutes = Math.floor(remainingSeconds / 60);

  return {hours, minutes};
};
const LikedSong = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const COLOR = useThemeStore(state => state.COLOR);
  const navigation = useNavigation<any>();

  const [searchText, setSearchText] = React.useState<string>('');

  const {likedSongs: likedSong, setPlayFrom} = usePlayerStore(state => state);

  const [searchData, setSearchData] = React.useState<any>(likedSong);

  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  const flashListRef = React.useRef<FlashList<any>>(null);

  const textInputRef = React.useRef<TextInput>(null);

  const currentSong = usePlayerStore(state => state.currentSong);

  useEffect(() => {
    setSearchData(likedSong);
  }, [likedSong]);

  useEffect(() => {
    flashListRef.current?.scrollToOffset({animated: true, offset: 0});
    textInputRef.current?.focus();
  }, [isSearching, searchText]);

  const headerColor = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.8],
        outputRange: ['transparent', COLOR.BACKGROUND],
        extrapolate: 'clamp',
      }),
    [scrollY, COLOR],
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

  const handlePlaySong = useCallback((song: any) => {
    handlePlay(song, {
      id: `${likedSong.length}-likedSong`,
      items: likedSong,
    });
    setPlayFrom({
      id: 'liked',
      name: 'Bài hát đã thích',
    });
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filteredData = likedSong.filter((item: any) => {
        return stringToSlug(item.title)
          .toLowerCase()
          .includes(stringToSlug(text).toLowerCase());
      });

      setSearchData(filteredData);
    } else {
      setSearchData(likedSong);
    }
  };
  return (
    <View
      className="flex-1  w-full"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0  left-0 right-0 z-30 h-20 pt-[35px] justify-between items-center flex-row px-6"
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
        <TouchableOpacity onPress={() => setIsSearching(true)}>
          <AntDesign name="search1" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
      </Animated.View>
      {isSearching && (
        <View
          style={{backgroundColor: COLOR.BACKGROUND}}
          className="absolute top-0 left-0 right-0 z-30 h-20 pt-[35px]  items-center justify-between flex-row px-6">
          <TouchableOpacity
            onPress={() => {
              setIsSearching(false);
              setSearchText('');
              setSearchData(likedSong);
              scrollY.setValue(0);
            }}>
            <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View className="justify-center items-center p-1 flex-1 ml-2">
            <TextInput
              ref={textInputRef}
              value={searchText}
              onChangeText={text => handleSearch(text)}
              placeholder="Nhập tên bài hát..."
              className="w-full rounded-md p-2"
              style={{
                color: COLOR.TEXT_PRIMARY,
                backgroundColor: tinycolor(COLOR.BACKGROUND)
                  .darken(5)
                  .toString(),
              }}
            />
          </View>
          <View className="w-4" />
        </View>
      )}
      <FlashList
        ref={flashListRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        ListHeaderComponent={
          !isSearching ? (
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
                  colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
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
              <View className="z-50 mt-4 px-6 mb-8">
                <Animated.Text
                  style={{opacity: titleOpacity, color: COLOR.TEXT_PRIMARY}}
                  className=" text-center text-3xl font-bold">
                  {'Bài hát đã thích'}
                </Animated.Text>
              </View>
              <View className="flex flex-row items-center py-4 px-4">
                <Text style={{color: COLOR.TEXT_PRIMARY}}>
                  {likedSong.length} bài hát{' • '}
                </Text>
                <Text style={{color: COLOR.TEXT_PRIMARY}}>
                  {caculateTotalTime(likedSong).hours > 0 && (
                    <Text>{caculateTotalTime(likedSong).hours} giờ </Text>
                  )}
                  {caculateTotalTime(likedSong).minutes} phút
                </Text>
              </View>
            </View>
          ) : (
            <View className="h-28" />
          )
        }
        ListFooterComponent={<View style={{height: SCREEN_WIDTH}} />}
        nestedScrollEnabled
        data={searchData}
        extraData={currentSong?.id}
        estimatedItemSize={72}
        keyExtractor={(item: any, index) => `${item.encodeId}_${index}`}
        renderItem={({item}: any) => {
          return (
            <TrackItem
              item={item}
              onClick={handlePlaySong}
              isAlbum={false}
              isActive={currentSong?.id === item.encodeId}
              showBottomSheet={showBottomSheet}
            />
          );
        }}
      />
    </View>
  );
};

export default LikedSong;
