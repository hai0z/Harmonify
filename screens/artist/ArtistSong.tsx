import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {FlashList} from '@shopify/flash-list';
import {LinearGradient} from 'react-native-linear-gradient';
import {handlePlay} from '../../service/trackPlayerService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';
import TrackItem from '../../components/track-item/TrackItem';
import {PlayerContext} from '../../context/PlayerProvider';
import useThemeStore from '../../store/themeStore';
import {usePlayerStore} from '../../store/playerStore';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Loading from '../../components/Loading';
import stringToSlug from '../../utils/removeSign';
import tinycolor from 'tinycolor2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useImageColor from '../../hooks/useImageColor';
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
  const {COLOR} = useThemeStore(state => state);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const {dominantColor} = useImageColor();
  const playlistId = useMemo(
    () => Math.random().toString(36).substring(7),
    [data?.length],
  );

  const [searchText, setSearchText] = React.useState<string>('');

  const [searchData, setSearchData] = React.useState<any>([]);

  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  const [isFetchMoreLoading, setIsFetchMoreLoading] =
    React.useState<boolean>(false);

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
      const filteredData = data.filter((item: any) => {
        return stringToSlug(item.title)
          .toLowerCase()
          .includes(stringToSlug(text).toLowerCase());
      });
      setSearchData(filteredData);
    } else {
      setSearchData(data);
    }
  };

  useEffect(() => {
    setLoading(true);
    setData([]);
    setDataDetailArtist({} as artistType);
    nodejs.channel.addListener('getListArtistSong', (data: any) => {
      setIsFetchMoreLoading(false);

      if (data.hasMore === false && page > 1) {
        setIsFetchMoreLoading(false);
        return;
      }
      if (data.items === undefined) return;
      setData((prev: any) => [...prev, ...data.items]);
      setSearchData((prev: any) => [...prev, ...data.items]);
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
      setIsFetchMoreLoading(true);
      setPage(page + 1);
      nodejs.channel.post(
        'getListArtistSong',
        JSON.stringify({id, page, count: 20}),
      );
    } catch (error) {
      setHasLoadMore(false);
      setIsFetchMoreLoading(false);
    }
  };

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerColor = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.6],
    outputRange: ['transparent', COLOR.BACKGROUND],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.6],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const navigation = useNavigation<any>();

  const {showBottomSheet} = useContext(PlayerContext);
  const handlePlaySong = useCallback(
    (song: any) => {
      handlePlay(song, {
        id: playlistId,
        items: data.filter((i: any) => i.streamingStatus === 1),
      });
      setPlayFrom({
        id: 'artist',
        name: dataDetailArtist?.name as string,
      });
    },
    [data],
  );
  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center "
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Loading />
      </View>
    );
  }
  return (
    <View className=" flex-1" style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-30 h-20 justify-between  items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Animated.Text
          className=" font-bold ml-4"
          style={{color: COLOR.TEXT_PRIMARY, opacity: titleOpacity}}>
          {dataDetailArtist?.name}
        </Animated.Text>
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
              setSearchData(data);
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
              placeholderTextColor={COLOR.TEXT_SECONDARY}
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
      <View className="flex-1">
        <FlashList
          bounces={false}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            return (
              <View className="h-80 items-center">
                {isFetchMoreLoading && <Loading />}
              </View>
            );
          }}
          onEndReached={fetchMoreData}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}
          ListHeaderComponent={
            !isSearching ? (
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

                  <View
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        width: SCREEN_WIDTH,
                        height: SCREEN_WIDTH * 0.8,
                        backgroundColor: dominantColor,
                      },
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
                  className=" mt-4 px-4"
                  style={{
                    color: COLOR.TEXT_PRIMARY,
                    fontFamily: 'SVN-Gotham Black',
                    fontSize: widthPercentageToDP(10),
                  }}>
                  {dataDetailArtist?.name}
                </Text>
              </View>
            ) : (
              <View className="h-28" />
            )
          }
          extraData={currentSong?.id}
          estimatedItemSize={70}
          data={searchData.filter((i: any) => i.streamingStatus === 1)}
          renderItem={({item}: any) => (
            <TrackItem
              isActive={currentSong?.id === item.encodeId}
              item={item}
              showBottomSheet={showBottomSheet}
              onClick={handlePlaySong}
            />
          )}
        />
      </View>
    </View>
  );
};

export default ArtistSong;
