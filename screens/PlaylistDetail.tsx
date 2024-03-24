import {
  View,
  Image as RNImage,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
  Text,
  Image,
  StatusBar,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useEffect, useMemo} from 'react';
import {getDetailPlaylist} from '../apis/detailPlaylist';
import {LinearGradient} from 'react-native-linear-gradient';
import getThumbnail from '../utils/getThumnail';
import {FlashList} from '@shopify/flash-list';
import {usePlayerStore} from '../store/playerStore';
import {handlePlay} from '../utils/musicControl';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import nodejs from 'nodejs-mobile-react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;

const PlaylistDetail = ({route}: {route: any}) => {
  const [playlistData, setPlaylistData] = React.useState<any>([]);

  const {data} = route.params;

  const {currentSong} = usePlayerStore(state => state);

  const [loading, setLoading] = React.useState(true);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<any>();

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener('getDetailPlaylist', (data: any) => {
      setPlaylistData(data);
      setLoading(false);
    });
    nodejs.channel.post('getDetailPlaylist', data.playListId);
  }, [data.playListId]);

  const headerColor = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.8],
        outputRange: ['transparent', 'transparent', '#121212'],
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

  const handlePlaySong = async (song: any) => {
    handlePlay(song, playlistData?.song?.items || []);
  };
  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-[#121212] ">
        <ActivityIndicator size={'large'} color={'#DA291C'} />
      </View>
    );

  return (
    <View className="flex-1 bg-[#121212] w-full">
      <StatusBar backgroundColor="#00000030" />
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-30 h-20  justify-between items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View className="justify-center items-center">
          <Animated.Text
            style={{opacity: headerTitleOpacity}}
            className="text-white font-bold">
            {playlistData?.title}
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
                  colors={['transparent', '#121212']}
                  className="absolute bottom-0 h-40 left-0 right-0 z-50"
                />
                <RNImage
                  blurRadius={100}
                  src={data?.thumbnail}
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      width: SCREEN_WIDTH,
                      height: SCREEN_WIDTH * 0.8,
                    },
                  ]}
                />
                <Animated.Image
                  src={getThumbnail(playlistData?.thumbnailM) || ''}
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
              <View className="z-50 mt-4 px-6 mb-4">
                <Animated.Text
                  style={{opacity: titleOpacity}}
                  className="text-white text-center text-3xl font-bold">
                  {playlistData?.title}
                </Animated.Text>
                <View className="flex flex-col gap-4 mt-8">
                  <Text className="text-white">
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
                        <RNImage
                          src={item.thumbnailM}
                          className="w-10 h-10 rounded-full"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  {playlistData?.description && (
                    <Text className="text-white">
                      {playlistData?.description}
                    </Text>
                  )}
                  <View className="flex flex-row justify-between">
                    <View className="flex flex-row items-center">
                      <Text className="text-white">
                        {playlistData?.song.total} bài hát{' '}
                      </Text>
                      <Text className="text-white ml-4">
                        <AntDesign name="heart" size={20} color="#DA291C" />{' '}
                        {playlistData?.like}
                      </Text>
                    </View>
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
        extraData={currentSong?.id}
        keyExtractor={(item: any, index) => `${item.encodeId}_${index}`}
        renderItem={({item, index}: any) => {
          return (
            <TrackDetail
              item={item}
              index={index}
              isAlbum={playlistData.isAlbum}
              currentTrack={currentSong}
              onPlay={handlePlaySong}
            />
          );
        }}
      />
    </View>
  );
};

const TrackDetail = React.memo(
  ({item, isAlbum, index, currentTrack, onPlay}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex flex-row  items-center mx-4 my-2"
        onPress={() => onPlay(item)}>
        {isAlbum ? (
          <View className="w-14 h-14 rounded-md flex justify-center items-center">
            <Text className="text-white font-semibold">{index + 1}</Text>
          </View>
        ) : (
          <Image
            source={{uri: item?.thumbnail}}
            key={item.encodeId}
            className="w-14 h-14 rounded-md"
          />
        )}
        <View className="flex justify-center ml-2 flex-1">
          <Text
            numberOfLines={1}
            style={{
              fontWeight: item.encodeId === currentTrack?.id ? 'bold' : '400',
              color: item.encodeId === currentTrack?.id ? '#DA291C' : 'white',
            }}>
            {item?.title}
          </Text>

          <Text numberOfLines={1} className="text-zinc-500 font-semibold">
            {item?.artistsNames}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
export default PlaylistDetail;
