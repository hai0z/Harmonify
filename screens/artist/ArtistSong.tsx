import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {LinearGradient} from 'react-native-linear-gradient';
import {handlePlay} from '../../service/trackPlayerService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';
import getThumbnail from '../../utils/getThumnail';
import TrackItem from '../../components/TrackItem';
import {PlayerContext} from '../../context/PlayerProvider';
import useThemeStore from '../../store/themeStore';
import {usePlayerStore} from '../../store/playerStore';
interface artistType {
  id: string;
  name: string;
  thumbnailM: string;
  sortBiography: string;
  realname: string;
  birthday: string;
  totalFollow: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const ArtistSong = ({route}: any) => {
  const {id, name} = route.params;
  const [data, setData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
  const [dataDetailArtist, setDataDetailArtist] = useState<artistType>();
  const [hasLoadMore, setHasLoadMore] = useState(true);
  const [page, setPage] = useState(1);
  const {darkMode, COLOR} = useThemeStore(state => state);

  useEffect(() => {
    setLoading(true);
    setData([]);
    setDataDetailArtist({} as artistType);
    nodejs.channel.addListener('getListArtistSong', (data: any) => {
      if (data.hasMore === false && page > 1) {
        setHasLoadMore(false);
        return;
      }
      if (data.items === undefined) return;
      setData((prev: any) => [...prev, ...data.items]);
      setLoading(false);
    });
    nodejs.channel.addListener('getArtist', (data: any) => {
      setDataDetailArtist(data);
      setLoading(false);
    });

    nodejs.channel.post(
      'getListArtistSong',
      JSON.stringify({id, page, count: 20}),
    );

    nodejs.channel.post('getArtist', name);
  }, [id, name]);

  const fetchMoreData = async () => {
    try {
      if (!hasLoadMore) return;
      setPage(page + 1);
      nodejs.channel.post(
        'getListArtistSong',
        JSON.stringify({id, page, count: 20}),
      );
    } catch (error) {
      setHasLoadMore(false);
    }
  };

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerColor = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.59, SCREEN_WIDTH * 0.6],
    outputRange: ['transparent', COLOR.BACKGROUND],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.59, SCREEN_WIDTH * 0.6],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const navigation = useNavigation<any>();

  const {showBottomSheet} = useContext(PlayerContext);
  const handlePlaySong = useCallback(
    (song: any) => {
      return handlePlay(song, {
        id: 'artist' + id,
        items: data,
      });
    },
    [data],
  );
  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center "
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      </View>
    );
  }
  return (
    <View className=" flex-1" style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-[999] h-20  items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Animated.Text
          className=" font-bold ml-4"
          style={{color: COLOR.TEXT_PRIMARY, opacity: titleOpacity}}>
          {dataDetailArtist?.name}
        </Animated.Text>
      </Animated.View>
      <View className="flex-1">
        <FlashList
          ListFooterComponent={() => {
            return <View className="h-80"></View>;
          }}
          onEndReached={() => {
            fetchMoreData();
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}
          ListHeaderComponent={() => {
            return (
              <View className="mb-8">
                <View
                  className="flex justify-end items-center pb-4"
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_WIDTH * 0.8,
                  }}>
                  <LinearGradient
                    colors={['transparent', COLOR.BACKGROUND]}
                    className="absolute bottom-0 h-40 left-0 right-0 z-10"
                  />

                  <Image
                    src={dataDetailArtist?.thumbnailM}
                    blurRadius={100}
                    style={[
                      StyleSheet.absoluteFillObject,
                      {width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.8},
                    ]}
                  />
                  <Image
                    src={dataDetailArtist?.thumbnailM}
                    className="rounded-lg z-50"
                    style={[
                      {
                        width: SCREEN_WIDTH * 0.6,
                        height: SCREEN_WIDTH * 0.6,
                      },
                    ]}
                  />
                </View>
                <Text
                  className=" font-bold text-3xl text-left mt-4 px-4"
                  style={{color: COLOR.TEXT_PRIMARY}}>
                  {dataDetailArtist?.name}
                </Text>
              </View>
            );
          }}
          estimatedItemSize={70}
          data={data}
          renderItem={({item, index}: any) => (
            <TrackItem
              item={item}
              showBottomSheet={showBottomSheet}
              onClick={handlePlaySong}></TrackItem>
          )}
        />
      </View>
    </View>
  );
};

export default ArtistSong;
