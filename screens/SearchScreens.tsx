import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
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
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Loading from '../components/Loading';

const SearchScreens = () => {
  const [text, setText] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const debouncedValue = useDebounce(text, 250);

  const {COLOR} = useThemeStore(state => state);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const {showBottomSheet} = useContext(PlayerContext);

  const [loading, setLoading] = useState<boolean>(false);

  const currentSong = usePlayerStore(state => state.currentSong);
  const id = useMemo(() => Math.random().toString(36).substring(7), [data]);
  useEffect(() => {
    setLoading(true);
    nodejs.channel.post('search', debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    nodejs.channel.addListener('search', (data: any) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  const navigation = useNavigation<any>();

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
        <TextInput
          value={text}
          style={{color: COLOR.TEXT_PRIMARY}}
          onChangeText={text => setText(text)}
          placeholderTextColor={COLOR.TEXT_SECONDARY}
          placeholder="Nhập tên bài hát, nghệ sĩ..."
          className="flex-1 h-10 rounded-full px-4"
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Loading />
        </View>
      ) : (
        debouncedValue.length > 0 && (
          <ScrollView
            className="pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 200}}>
            {data?.top && debouncedValue.length > 0 && (
              <View>
                <Text
                  className="px-4 font-bold mb-4"
                  style={{
                    color: COLOR.TEXT_PRIMARY,
                    fontSize: widthPercentageToDP(5),
                  }}>
                  Kết quả hàng đầu
                </Text>
                <TrackItem
                  isActive={currentSong?.id === data?.top?.encodeId}
                  showBottomSheet={showBottomSheet}
                  item={data?.top}
                  onClick={() => {
                    handlePlay(data?.top, {
                      id: data?.top?.encodeId,
                      items: [data?.top, ...data?.songs],
                    });
                    setPlayFrom({
                      id: 'search',
                      name: data?.top?.title,
                    });
                  }}
                />
              </View>
            )}
            <Text
              className="px-4 font-bold mb-4"
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontSize: widthPercentageToDP(5),
              }}>
              Bài hát
            </Text>
            {data?.songs?.map((e: any, index: number) => (
              <TrackItem
                isActive={currentSong?.id === e.encodeId}
                key={index}
                onClick={() => {
                  handlePlay(e, {
                    id,
                    items: data?.songs,
                  });
                  setPlayFrom({
                    id: 'search',
                    name: e.title,
                  });
                }}
                item={e}
                showBottomSheet={showBottomSheet}
              />
            ))}
            <Text
              className="px-4 font-bold mb-4"
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontSize: widthPercentageToDP(5),
              }}>
              Danh sách phát
            </Text>
            {data?.playlists?.map((e: any, index: number) => (
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
                  <Text numberOfLines={1} style={{color: COLOR.TEXT_SECONDARY}}>
                    {e.artistsNames}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <Text
              className="px-4 font-bold mb-4"
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontSize: widthPercentageToDP(5),
              }}>
              Nghệ sĩ
            </Text>
            {data?.artists?.map((e: any, index: number) => (
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
                  <Text numberOfLines={1} style={{color: COLOR.TEXT_SECONDARY}}>
                    Nghệ sĩ
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )
      )}
    </View>
  );
};

export default SearchScreens;
