import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  Animated,
  TextInput,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import getThumbnail from '../utils/getThumnail';
import {FlashList} from '@shopify/flash-list';
import {handlePlay} from '../service/trackPlayerService';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';
import TrackItem from '../components/track-item/TrackItem';
import {PlayerContext} from '../context/PlayerProvider';
import useThemeStore from '../store/themeStore';
import {Color, usePlayerStore} from '../store/playerStore';
import {addToLikedPlaylist} from '../service/firebase';
import useToastStore, {ToastTime} from '../store/toastStore';
import {useUserStore} from '../store/userStore';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {getColors} from 'react-native-image-colors';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import RAnimated from 'react-native-reanimated';
import tinycolor from 'tinycolor2';
import useDarkColor from '../hooks/useDarkColor';
import Loading from '../components/Loading';
import stringToSlug from '../utils/removeSign';
import {navigation, route} from '../utils/types/RootStackParamList';
import {Song} from '../utils/types/type';
const SCREEN_WIDTH = Dimensions.get('window').width;

const PlaylistDetail = ({route}: {route: route<'PlayListDetail'>}) => {
  const [playlistData, setPlaylistData] = React.useState<any>({});

  const {data} = route.params;

  const [loading, setLoading] = React.useState(true);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<navigation<'Artists'>>();

  const playerContext = useContext(PlayerContext);

  const {show} = useToastStore();

  const COLOR = useThemeStore(state => state.COLOR);

  const {setPlayFrom} = usePlayerStore();

  const {likedPlaylists} = useUserStore();

  const [color, setColor] = React.useState<Color>({} as Color);

  const bgAnimated = useSharedValue('transparent');

  const [searchText, setSearchText] = React.useState<string>('');

  const [searchData, setSearchData] = React.useState<any>([]);

  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  const flashListRef = React.useRef<FlashList<any>>(null);

  const textInputRef = React.useRef<TextInput>(null);

  const currentSong = usePlayerStore(state => state.currentSong);

  useEffect(() => {
    flashListRef.current?.scrollToOffset({animated: true, offset: 0});
    textInputRef.current?.focus();
  }, [isSearching, searchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filteredData = playlistData.song.items.filter((item: Song) => {
        return stringToSlug(item.title)
          .toLowerCase()
          .includes(stringToSlug(text).toLowerCase());
      });
      setSearchData(filteredData);
    } else {
      setSearchData(playlistData?.song.items);
    }
  };

  useEffect(() => {
    setLoading(true);
    scrollY.setValue(0);
    nodejs.channel.addListener('getDetailPlaylist', (data: any) => {
      setPlaylistData({
        ...data,
        song: {
          items: data.song.items.filter(
            (item: Song) => item.streamingStatus === 1,
          ),
        },
      });
      setSearchData(
        data.song.items.filter((item: Song) => item.streamingStatus === 1),
      );
      getColors(data.thumbnail).then(res => {
        setColor(res as Color);
      });
      setLoading(false);
    });
    nodejs.channel.post('getDetailPlaylist', data.playListId);
  }, [data.playListId]);

  useLayoutEffect(() => {
    if (color) {
      bgAnimated.value = withTiming(
        `${
          COLOR.isDark
            ? useDarkColor(color.dominant, 35)
            : tinycolor(color.dominant).isDark()
            ? tinycolor(color.dominant).lighten(30)
            : tinycolor(color.dominant).darken()
        }95`,
        {
          duration: 750,
        },
      );
    }
  }, [color, isSearching, playerContext]);

  const headerColor = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.8],
    outputRange: ['transparent', COLOR.BACKGROUND],
    extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.8],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  const imgScale = scrollY.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
    outputRange: [1, 0.6, 0.4],
    extrapolate: 'clamp',
  });
  const handlePlaySong = useCallback(
    (song: Song) => {
      handlePlay(song, {
        id: data.playListId,
        items: playlistData?.song?.items,
        isAlbum: playlistData?.isAlbum,
      });
      setPlayFrom({
        id: playlistData?.isAlbum ? 'album' : 'playlist',
        name: playlistData?.title,
      });
    },
    [playlistData?.song?.items],
  );

  const caculateTotalTime = () => {
    let total = 0;
    playlistData?.song.items.forEach((item: any) => {
      total += item.duration;
    });
    const hours = Math.floor(total / 3600);
    const remainingSeconds = total % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    return {hours, minutes};
  };

  if (loading)
    return (
      <View
        className="flex-1 justify-center items-center "
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Loading />
      </View>
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
        <View className="justify-center items-center flex-1">
          <Animated.Text
            style={{
              opacity: headerTitleOpacity,
              color: COLOR.TEXT_PRIMARY,
            }}
            className=" font-bold text-center">
            {playlistData?.title}
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
              setSearchData(playlistData?.song.items);
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
              placeholderTextColor={COLOR.TEXT_SECONDARY}
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
                <RAnimated.View
                  className={'absolute'}
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_WIDTH * 0.8,
                    backgroundColor: bgAnimated,
                  }}></RAnimated.View>
                <Animated.Image
                  src={getThumbnail(playlistData?.thumbnailM)}
                  className="rounded-lg"
                  style={[
                    {
                      width: SCREEN_WIDTH * 0.6,
                      height: SCREEN_WIDTH * 0.6,
                      zIndex: 9999,
                      opacity: titleOpacity,
                      transform: [{scale: imgScale}],
                    },
                  ]}
                />
              </View>
              <View className="z-50 mt-4 px-4 mb-4">
                <Animated.Text
                  style={{
                    opacity: titleOpacity,
                    color: COLOR.TEXT_PRIMARY,
                    fontFamily: 'SVN-Gotham Black',
                    fontSize: widthPercentageToDP(8),
                  }}
                  className=" text-center">
                  {playlistData?.title}
                </Animated.Text>
                <View className="flex flex-col gap-4 mt-8">
                  <Text style={{color: COLOR.TEXT_PRIMARY}}>
                    {playlistData?.artistsNames}
                  </Text>
                  <View className="flex flex-row">
                    {playlistData?.artists?.map((item: any) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Artists', {
                            id: item.id,
                            name: item.alias,
                          })
                        }
                        key={item.id}
                        className="mr-2">
                        <Image
                          src={item.thumbnailM}
                          className="w-10 h-10 rounded-full"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  {playlistData?.description && (
                    <Text style={{color: COLOR.TEXT_PRIMARY}}>
                      {playlistData?.description}
                    </Text>
                  )}
                  <View className="flex flex-row justify-between">
                    <View className="flex flex-row items-center">
                      <Text style={{color: COLOR.TEXT_PRIMARY}}>
                        {playlistData?.song.items.length} bài hát{' • '}
                      </Text>
                      <Text style={{color: COLOR.TEXT_PRIMARY}}>
                        {caculateTotalTime().hours > 0 && (
                          <Text>{caculateTotalTime().hours} giờ </Text>
                        )}
                        {caculateTotalTime().minutes} phút
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={async () => {
                        const rs = await addToLikedPlaylist({
                          encodeId: playlistData?.encodeId,
                          thumbnail: playlistData?.thumbnailM,
                          title: playlistData?.title,
                          type: playlistData?.isAlbum ? 'album' : 'playlist',
                          totalSong: playlistData?.song.items.length,
                        });
                        if (rs) {
                          show('Đã thêm vào thư viện', ToastTime.SHORT);
                        } else {
                          show('Đã xóa khỏi thư viện', ToastTime.SHORT);
                        }
                      }}>
                      <AntDesign
                        name={
                          likedPlaylists.some(
                            item => item.encodeId === playlistData?.encodeId,
                          )
                            ? 'heart'
                            : 'hearto'
                        }
                        size={24}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="h-28" />
          )
        }
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        nestedScrollEnabled
        ref={flashListRef}
        data={searchData}
        extraData={currentSong?.id}
        estimatedItemSize={72}
        keyExtractor={(item: any, index) => `${item.encodeId}_${index}`}
        renderItem={({item, index}: any) => {
          return (
            <TrackItem
              showBottomSheet={playerContext.showBottomSheet}
              item={item}
              isActive={currentSong?.id === item.encodeId}
              index={index}
              isAlbum={playlistData.isAlbum}
              onClick={handlePlaySong}
            />
          );
        }}
      />
    </View>
  );
};

export default PlaylistDetail;
