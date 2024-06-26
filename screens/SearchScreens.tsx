import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDebounce} from '../hooks/useDebounce';
import getThumbnail from '../utils/getThumnail';
import {handlePlay} from '../service/trackPlayerService';
import nodejs from 'nodejs-mobile-react-native';
import {useNavigation} from '@react-navigation/native';
import useThemeStore from '../store/themeStore';
import {usePlayerStore} from '../store/playerStore';
import {PlayerContext} from '../context/PlayerProvider';
import TrackItem from '../components/track-item/TrackItem';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Loading from '../components/Loading';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import tinycolor from 'tinycolor2';
import {useUserStore} from '../store/userStore';
import {GREEN} from '../constants';
import {FlatList} from 'react-native-gesture-handler';

const SearchScreens = () => {
  const [text, setText] = useState<string>('');

  const [data, setData] = useState<any>([]);

  const debouncedValue = useDebounce(text, 250);

  const {COLOR, theme} = useThemeStore();

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const {showBottomSheet} = useContext(PlayerContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [suggestion, setSuggestion] = useState<any>([]);

  const [isSearched, setIsSearched] = useState<boolean>(false);

  const currentSong = usePlayerStore(state => state.currentSong);

  const [recommenData, setRecommenData] = useState<any>([]);

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const searchHistory = useUserStore(state => state.searchHistory);

  const setSearchHistory = useUserStore(state => state.setSearchHistory);

  const [filterData, setFilterData] = useState<any>([]);

  useEffect(() => {
    nodejs.channel.post('getSuggest', debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    nodejs.channel.addListener('getSuggest', (data: any) => {
      setSuggestion(data);
    });
    nodejs.channel.addListener('search', (data: any) => {
      if (data?.songs?.length > 0) {
        nodejs.channel.post('getRecommend', data.songs[0].encodeId);
      }
      setData(data);
      setFilterData(data);
      setLoading(false);
    });
    nodejs.channel.addListener('getRecommend', (data: any) => {
      setRecommenData(data.items || []);
      setLoading(false);
    });
  }, []);
  const navigation = useNavigation<any>();

  const handleFilter = (tab: number) => {
    setSelectedTab(tab);
    switch (tab) {
      case 0:
        setFilterData(data);
        break;
      case 1:
        const songs = {...data};
        delete songs.playlists;
        delete songs.artists;
        setFilterData(songs);
        break;
      case 2:
        const playlists = {...data};
        delete playlists.songs;
        delete playlists.artists;
        setFilterData(playlists);
        break;
      case 3:
        const artists = {...data};
        delete artists.songs;
        delete artists.playlists;
        setFilterData(artists);
        break;
      default:
        break;
    }
  };

  return (
    <View
      className=" h-full w-full pt-[35px]"
      style={{
        backgroundColor: COLOR.BACKGROUND,
      }}>
      <View className="flex flex-row items-center gap-2 w-full px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View className="flex-1 h-12 flex flex-row items-center">
          <TextInput
            keyboardType="web-search"
            value={text}
            style={{
              color: COLOR.TEXT_PRIMARY,
              backgroundColor: COLOR.isDark
                ? tinycolor(COLOR.BACKGROUND).lighten(15).toString()
                : tinycolor(COLOR.BACKGROUND).darken(5).toString(),
            }}
            onChangeText={text => {
              setIsSearched(false);
              setText(text);
            }}
            placeholderTextColor={COLOR.TEXT_SECONDARY}
            placeholder="Nhập tên bài hát, nghệ sĩ..."
            className="flex-1 h-10 rounded-full px-4"
          />
          {text.length > 0 && (
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              className="z-50 absolute right-4"
              onPress={() => {
                setText('');
                setData([]);
                setSuggestion([]);
                setIsSearched(false);
              }}>
              <AntDesign name="close" size={20} color={COLOR.TEXT_PRIMARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isSearched && !loading && (
        <View>
          <ScrollView
            horizontal
            contentContainerStyle={{
              paddingHorizontal: 16,
              alignItems: 'center',
              width: '100%',
            }}
            className="flex flex-row gap-2 mb-4 mt-2">
            {['Tất cả', 'Bài hát', 'Danh sách phát', 'Nghệ sĩ'].map(
              (item, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleFilter(index)}
                  className="px-2 py-2 rounded-md"
                  key={index}
                  style={{
                    backgroundColor:
                      selectedTab === index
                        ? theme === 'amoled'
                          ? GREEN
                          : COLOR.PRIMARY
                        : 'transparent',
                  }}>
                  <Text style={{color: COLOR.TEXT_PRIMARY}}>{item}</Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
        </View>
      )}
      {isSearched ? (
        loading ? (
          <View className="flex-1 items-center justify-center">
            <Loading />
          </View>
        ) : (
          debouncedValue.length > 0 && (
            <ScrollView
              className=""
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 200}}>
              {data?.top &&
                (data?.top?.objectType === 'song' ||
                  data?.top?.objectType === 'artist') &&
                selectedTab === 0 && (
                  <View>
                    <Text
                      className="px-4 font-bold mb-4"
                      style={{
                        color: COLOR.TEXT_PRIMARY,
                        fontSize: widthPercentageToDP(5),
                      }}>
                      Kết quả hàng đầu
                    </Text>
                    {data?.top?.objectType === 'song' ? (
                      <TrackItem
                        isActive={currentSong?.id === data?.top?.encodeId}
                        showBottomSheet={showBottomSheet}
                        item={data?.top}
                        onClick={() => {
                          handlePlay(data?.top, {
                            id: data?.top?.encodeId,
                            items: [data?.top, ...recommenData],
                          });
                          setPlayFrom({
                            id: 'search',
                            name: data?.top?.title,
                          });
                        }}
                      />
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        className="flex flex-row items-center mb-3 gap-2 px-4"
                        onPress={() => {
                          navigation.navigate('Artists', {
                            name: data?.top.alias,
                          });
                        }}>
                        <Image
                          source={{
                            uri: getThumbnail(data?.top.thumbnail) || '',
                          }}
                          style={{
                            width: widthPercentageToDP(15),
                            height: widthPercentageToDP(15),
                          }}
                        />
                        <View>
                          <Text
                            numberOfLines={1}
                            style={{color: COLOR.TEXT_PRIMARY}}>
                            {data?.top.name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={{color: COLOR.TEXT_SECONDARY}}>
                            Nghệ sĩ
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              {(selectedTab == 0 || selectedTab == 1) && data?.songs && (
                <Text
                  className="px-4 font-bold mb-4"
                  style={{
                    color: COLOR.TEXT_PRIMARY,
                    fontSize: widthPercentageToDP(5),
                  }}>
                  Bài hát
                </Text>
              )}
              {
                <FlatList
                  scrollEnabled={false}
                  extraData={currentSong?.id}
                  data={filterData?.songs?.filter(
                    (e: any) => e.streamingStatus !== 2,
                  )}
                  renderItem={({item: e}: any) => {
                    return (
                      <TrackItem
                        isActive={currentSong?.id === e.encodeId}
                        onClick={() => {
                          handlePlay(e, {
                            id: e.encodeId,
                            items: [e, ...recommenData],
                          });
                          setPlayFrom({
                            id: 'search',
                            name: e.title,
                          });
                        }}
                        item={e}
                        showBottomSheet={showBottomSheet}
                      />
                    );
                  }}
                />
              }
              {(selectedTab == 0 || selectedTab == 2) && data?.playlists && (
                <Text
                  className="px-4 font-bold mb-4"
                  style={{
                    color: COLOR.TEXT_PRIMARY,
                    fontSize: widthPercentageToDP(5),
                  }}>
                  Danh sách phát
                </Text>
              )}
              {filterData?.playlists?.map((e: any, index: number) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  className="flex flex-row items-center mb-3 gap-2 px-4"
                  onPress={() => {
                    navigation.navigate('PlayListDetail', {
                      data: {
                        playListId: e.encodeId,
                        thumbnail: e.thumbnail,
                      },
                    });
                  }}>
                  <Image
                    source={{uri: getThumbnail(e.thumbnail) || ''}}
                    style={{
                      width: widthPercentageToDP(15),
                      height: widthPercentageToDP(15),
                    }}
                  />
                  <View className="flex-1">
                    <Text numberOfLines={1} style={{color: COLOR.TEXT_PRIMARY}}>
                      {e.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{color: COLOR.TEXT_SECONDARY}}>
                      {e.artistsNames || 'Danh sách phát'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {(selectedTab == 0 || selectedTab == 3) && data?.artists && (
                <Text
                  className="px-4 font-bold mb-4"
                  style={{
                    color: COLOR.TEXT_PRIMARY,
                    fontSize: widthPercentageToDP(5),
                  }}>
                  Nghệ sĩ
                </Text>
              )}
              {filterData?.artists?.map((e: any, index: number) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  className="flex flex-row items-center mb-3 gap-2 px-4"
                  onPress={() => {
                    navigation.navigate('Artists', {name: e.alias});
                  }}>
                  <Image
                    source={{uri: getThumbnail(e.thumbnail) || ''}}
                    style={{
                      width: widthPercentageToDP(15),
                      height: widthPercentageToDP(15),
                    }}
                  />
                  <View>
                    <Text numberOfLines={1} style={{color: COLOR.TEXT_PRIMARY}}>
                      {e.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{color: COLOR.TEXT_SECONDARY}}>
                      Nghệ sĩ
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )
        )
      ) : (
        <View className="mx-4">
          {searchHistory.length > 0 && text === '' && (
            <View className="py-2">
              {searchHistory.map((item: any, index: number) => (
                <TouchableWithoutFeedback
                  accessible={false}
                  onPress={() => {
                    setLoading(true);
                    Keyboard.dismiss();
                    setText(item);
                    setIsSearched(true);
                    nodejs.channel.post('search', item);
                  }}
                  key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 4,
                      paddingVertical: 8,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: heightPercentageToDP(2),
                        color: COLOR.TEXT_PRIMARY,
                      }}>
                      {item}
                    </Text>
                    <AntDesign
                      onPress={() => {
                        setSearchHistory(
                          searchHistory.filter((e: any) => e !== item),
                        );
                      }}
                      name="close"
                      size={24}
                      color={COLOR.TEXT_PRIMARY}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ))}
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Cảnh báo',
                    'Bạn có muốn xoá toàn bộ lịch sử tìm kiếm?',
                    [
                      {
                        text: 'Huỷ',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'Xóa',
                        onPress: () => {
                          setSearchHistory([]);
                        },
                      },
                    ],
                  );
                }}>
                <Text
                  style={{
                    color: theme === 'amoled' ? GREEN : COLOR.PRIMARY,
                    fontSize: widthPercentageToDP(4.5),
                    fontWeight: '600',
                  }}
                  className=" mt-4">
                  Xoá lịch sử tìm kiếm
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {suggestion?.items?.[0]?.keywords?.map((item: any, index: number) => (
            <TouchableWithoutFeedback
              accessible={false}
              onPress={() => {
                setLoading(true);
                Keyboard.dismiss();
                setText(item.keyword);
                setIsSearched(true);
                setSearchHistory([item.keyword, ...searchHistory]);
                nodejs.channel.post('search', item.keyword);
              }}
              key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                  paddingVertical: 8,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: heightPercentageToDP(2),
                    color: COLOR.TEXT_PRIMARY,
                  }}>
                  {item.keyword}
                </Text>
                <Feather
                  name="arrow-up-right"
                  size={24}
                  color={COLOR.TEXT_PRIMARY}
                />
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchScreens;
