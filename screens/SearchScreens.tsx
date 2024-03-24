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
import {getSearch} from '../apis/search';
import getThumbnail from '../utils/getThumnail';
import {usePlayerStore} from '../store/playerStore';
import {handlePlay} from '../utils/musicControl';
import nodejs from 'nodejs-mobile-react-native';
import {useNavigation} from '@react-navigation/native';
const SearchScreens = () => {
  const [text, setText] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const debouncedValue = useDebounce(text, 250);
  const [filterValue, setFilterValue] = useState<number>(0);
  const [filterData, setFilterData] = useState<any>([]);
  const {setPlayList} = usePlayerStore(state => state);
  useEffect(() => {
    nodejs.channel.addListener('search', (data: any) => {
      setData(data);
      setFilterData(data);
    });
    nodejs.channel.post('search', debouncedValue);
  }, [debouncedValue]);

  const navigation = useNavigation<any>();

  return (
    <View
      className="bg-[#121212] h-full w-full pt-[35px]"
      style={{
        paddingHorizontal: 16,
      }}>
      <View className="flex flex-row items-center gap-2 w-full">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          value={text}
          onChangeText={text => setText(text)}
          placeholderTextColor={'#b3b3b3'}
          placeholder="Nhập tên bài hát, nghệ sĩ..."
          className="flex-1 h-10 bg-[#282828] rounded-full px-4 text-white"
        />
      </View>
      <View className="flex flex-row items-center mt-2">
        {['Tất cả', 'Bài bát', 'PlayList', 'Nghệ sĩ'].map((e, index) => (
          <View className="flex flex-row items-center mr-2" key={index}>
            <TouchableOpacity
              style={{
                backgroundColor: filterValue === index ? '#DA291C' : '#282828',
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
              <Text className="text-white">{e}</Text>
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
              setPlayList([]);
              handlePlay(e);
            }}>
            <Image
              source={{uri: getThumbnail(e.thumbnail) || ''}}
              className="w-14 h-14 rounded-md"
            />
            <View>
              <Text numberOfLines={1} className="text-white">
                {e.title}
              </Text>
              <Text numberOfLines={1} className="text-zinc-500">
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
              <Text numberOfLines={1} className="text-white">
                {e.title}
              </Text>
              <Text numberOfLines={1} className="text-zinc-500">
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
              <Text numberOfLines={1} className="text-white">
                {e.name}
              </Text>
              <Text numberOfLines={1} className="text-zinc-500">
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
