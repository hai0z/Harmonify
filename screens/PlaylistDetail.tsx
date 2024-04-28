import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  Image,
  Animated,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useContext, useEffect, useMemo} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import getThumbnail from '../utils/getThumnail';
import {FlashList} from '@shopify/flash-list';
import {handlePlay} from '../service/trackPlayerService';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';
import TrackItem from '../components/TrackItem';
import {PlayerContext} from '../context/PlayerProvider';
import useThemeStore from '../store/themeStore';
import {usePlayerStore} from '../store/playerStore';
import {addToLikedPlaylist} from '../service/firebase';
import useToastStore, {ToastTime} from '../store/toastStore';
import {useUserStore} from '../store/userStore';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {getColors} from 'react-native-image-colors';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import RAnimated from 'react-native-reanimated';
import tinycolor from 'tinycolor2';
import useDarkColor from '../hooks/useDarkColor';
const SCREEN_WIDTH = Dimensions.get('window').width;

const PlaylistDetail = ({route}: {route: any}) => {
  const [playlistData, setPlaylistData] = React.useState<any>({});

  const {data} = route.params;

  const [loading, setLoading] = React.useState(true);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<any>();

  const {showBottomSheet} = useContext(PlayerContext);

  const {show} = useToastStore();
  const COLOR = useThemeStore(state => state.COLOR);

  const {setPlayFrom} = usePlayerStore();
  const {likedPlaylists} = useUserStore();

  const [color, setColor] = React.useState<any>(null);
  const bgAnimated = useSharedValue('transparent');

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener('getDetailPlaylist', (data: any) => {
      setPlaylistData({
        ...data,
        song: {
          items: data.song.items.filter(
            (item: any) => item.streamingStatus === 1,
          ),
        },
      });
      getColors(data.thumbnail).then((res: any) => {
        console.log(res);
        setColor(res);
      });
      setLoading(false);
    });
    nodejs.channel.post('getDetailPlaylist', data.playListId);
  }, [data.playListId]);

  useEffect(() => {
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
  }, [color]);

  const headerColor = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.8],
        outputRange: ['transparent', COLOR.BACKGROUND],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

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
  const imgScale = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
        outputRange: [1, 0.6, 0.4],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );
  const handlePlaySong = (song: any) => {
    handlePlay(song, {
      id: data.playListId,
      items: playlistData?.song.items,
    });
    setPlayFrom({
      id: playlistData?.isAlbum ? 'album' : 'playlist',
      name: playlistData?.title,
    });
  };

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
        <ActivityIndicator size={'large'} color={COLOR.PRIMARY} />
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
        <View className="w-10" />
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
                    fontFamily: 'GothamBold',
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
          );
        })}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        nestedScrollEnabled
        data={playlistData?.song?.items}
        estimatedItemSize={72}
        keyExtractor={(item: any, index) => `${item.encodeId}_${index}`}
        renderItem={({item, index}: any) => {
          return (
            <TrackItem
              showBottomSheet={showBottomSheet}
              item={item}
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
