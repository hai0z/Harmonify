import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useContext, useMemo} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {FlashList} from '@shopify/flash-list';
import {handlePlay} from '../../service/trackPlayerService';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '../../store/playerStore';
import TrackItem from '../../components/TrackItem';
import {PlayerContext} from '../../context/PlayerProvider';
import useThemeStore from '../../store/themeStore';
import {useUserStore} from '../../store/userStore';
import getThumbnail from '../../utils/getThumnail';
import RenderPlaylistThumbnail from './components/RenderPlaylistThumnail';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MyPlaylist = ({route}: {route: any}) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const {playlistId} = route.params;

  const COLOR = useThemeStore(state => state.COLOR);

  const navigation = useNavigation<any>();

  const {setPlayFrom} = usePlayerStore(state => state);

  const {myPlaylists} = useUserStore();

  const data = myPlaylists.find((pl: any) => pl.encodeId == playlistId);
  console.log({data});

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
      id: `${data?.songs?.length}-${data?.encodeId}`,
      items: data?.songs,
    });
    setPlayFrom({
      id: 'playlist',
      name: data?.title,
    });
  }, []);

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
            {data?.title}
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
                {data?.songs.length > 0 ? (
                  <RenderPlaylistThumbnail
                    playlistLength={data?.songs?.length}
                    songs={data?.songs}
                    width={SCREEN_WIDTH * 0.6}
                    height={SCREEN_WIDTH * 0.6}
                  />
                ) : (
                  <Image
                    source={{uri: getThumbnail(data?.thumbnailM)}}
                    style={{
                      width: SCREEN_WIDTH * 0.6,
                      height: SCREEN_WIDTH * 0.6,
                      zIndex: 50,
                    }}
                  />
                )}
              </View>
              <View className="z-50 mt-4 px-6 mb-8">
                <Animated.Text
                  style={{opacity: titleOpacity, color: COLOR.TEXT_PRIMARY}}
                  className=" text-center text-3xl font-bold">
                  {data?.title}
                </Animated.Text>
              </View>
            </View>
          );
        })}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text>Playlist trống...</Text>
          </View>
        }
        ListFooterComponent={() => <View style={{height: SCREEN_WIDTH}} />}
        nestedScrollEnabled
        data={data?.songs}
        estimatedItemSize={72}
        keyExtractor={(item: any, index) => `${item.encodeId}_${index}`}
        renderItem={({item}: any) => {
          return (
            <TrackItem
              item={item}
              onClick={handlePlaySong}
              isAlbum={false}
              showBottomSheet={() =>
                showBottomSheet({...item, playlistId: data?.encodeId})
              }
            />
          );
        }}
      />
    </View>
  );
};

export default MyPlaylist;
