import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDebounce} from '../hooks/useDebounce';
import getThumbnail from '../utils/getThumnail';
import {usePlayerStore} from '../store/playerStore';
import {handlePlay} from '../utils/musicControl';
import nodejs from 'nodejs-mobile-react-native';
import {useNavigation} from '@react-navigation/native';
import useThemeStore from '../store/themeStore';
const SearchScreens = () => {
  const [text, setText] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const debouncedValue = useDebounce(text, 250);
  const [filterValue, setFilterValue] = useState<number>(0);
  const [filterData, setFilterData] = useState<any>([]);
  const {COLOR} = useThemeStore(state => state);
  useEffect(() => {
    nodejs.channel.post('search', debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    nodejs.channel.addListener('search', (data: any) => {
      setData(data);
      setFilterData(data);
    });
  }, []);

  const navigation = useNavigation<any>();

  return (
    <View
      className=" h-full w-full pt-[35px]"
      style={{
        paddingHorizontal: 16,
        backgroundColor: COLOR.BACKGROUND,
      }}>
      <View className="flex flex-row items-center gap-2 w-full">
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

      <View className="flex flex-row items-center mt-2">
        {['Tất cả', 'Bài bát', 'PlayList', 'Nghệ sĩ'].map((e, index) => (
          <View className="flex flex-row items-center mr-2" key={index}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  filterValue === index ? COLOR.PRIMARY : 'transparent',
              }}
              className="p-2 items-center justify-center rounded-md "
              onPress={() => {
                setFilterValue(index);
                if (index === 0) {
                  setFilterData(data);
                } else if (index === 1) {
                  const dt = {...data};
                  delete dt.playlists;
                  delete dt.artists;
                  setFilterData(dt);
                } else if (index === 2) {
                  const dt = {...data};
                  delete dt.songs;
                  delete dt.artists;
                  setFilterData(dt);
                } else {
                  const dt = {...data};
                  delete dt.songs;
                  delete dt.playlists;
                  setFilterData(dt);
                }
              }}>
              <Text style={{color: COLOR.TEXT_PRIMARY}}>{e}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <ScrollView
        className="pt-9"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 16, paddingBottom: 200}}>
        {filterData?.songs?.map((e: any, index: number) => (
          <TouchableOpacity
            key={index}
            className="flex flex-row items-center mb-3 gap-2"
            onPress={() => {
              handlePlay(e, {
                id: 'search',
                items: [e],
              });
            }}>
            <Image
              source={{uri: getThumbnail(e.thumbnail) || ''}}
              className="w-14 h-14 rounded-md"
            />
            <View>
              <Text numberOfLines={1} style={{color: COLOR.TEXT_PRIMARY}}>
                {e.title}
              </Text>
              <Text numberOfLines={1} style={{color: COLOR.TEXT_SECONDARY}}>
                {e.artistsNames} •{' '}
                {new Date(e.duration * 1000).toISOString().substring(14, 19)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {filterData?.playlists?.map((e: any, index: number) => (
          <TouchableOpacity
            key={index}
            className="flex flex-row items-center mb-3 gap-2"
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
              className="w-14 h-14 rounded-md"
            />
            <View>
              <Text numberOfLines={1} style={{color: COLOR.TEXT_PRIMARY}}>
                {e.title}
              </Text>
              <Text numberOfLines={1} style={{color: COLOR.TEXT_SECONDARY}}>
                Playlist • {e.artistsNames}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {filterData?.artists?.map((e: any, index: number) => (
          <TouchableOpacity
            key={index}
            className="flex flex-row items-center mb-3 gap-2"
            onPress={() => {
              navigation.navigate('Artists', {name: e.alias});
            }}>
            <Image
              source={{uri: getThumbnail(e.thumbnail) || ''}}
              className="w-14 h-14 rounded-md"
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
    </View>
  );
};

export default SearchScreens;
