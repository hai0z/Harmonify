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
const SearchScreens = () => {
  const [text, setText] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const debouncedValue = useDebounce(text, 250);
  const {setPlayList} = usePlayerStore(state => state);
  useEffect(() => {
    nodejs.channel.addListener('search', (data: any) => {
      setData(data);
    });
    nodejs.channel.post('search', debouncedValue);
  }, [debouncedValue]);

  return (
    <View
      className="bg-[#121212] h-full w-full pt-[35px]"
      style={{
        paddingHorizontal: 16,
      }}>
      <View className="flex flex-row items-center gap-2 w-full">
        <Ionicons name="arrow-back" size={24} color="white" />
        <TextInput
          value={text}
          onChangeText={text => setText(text)}
          placeholderTextColor={'#b3b3b3'}
          placeholder="Nhập tên bài hát, nghệ sĩ..."
          className="flex-1 h-10 bg-[#282828] rounded-full px-4 text-white"
        />
      </View>
      <ScrollView
        className="mt-9"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 16, paddingBottom: 200}}>
        {data?.songs?.map((e: any, index: number) => (
          <TouchableOpacity
            key={index}
            className="flex flex-row items-center mb-3 gap-2"
            onPress={() => {
              setPlayList([]);
              handlePlay(e);
            }}>
            <Image
              source={{uri: getThumbnail(e.thumbnail)}}
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
      </ScrollView>
    </View>
  );
};

export default SearchScreens;
