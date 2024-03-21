import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import getThumbnail from '../utils/getThumnail';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';
interface coverProps {
  title: string;
  sortDescription?: string;
  thumbnail: string;
  encodeId: string;
}

const PlayListCover = ({
  title,
  sortDescription,
  thumbnail,
  encodeId,
}: coverProps) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      className="w-40"
      activeOpacity={0.9}
      onPress={() =>
        navigation.push('PlayListDetail', {
          data: {
            playListId: encodeId,
            thumbnail,
          },
        })
      }>
      <Image
        source={{uri: getThumbnail(thumbnail) || ''}}
        className="w-40 h-40 rounded-md object-cover"
      />
      <Text numberOfLines={2} className="text-left text-[16px] mt-1 text-white">
        {title}
      </Text>
      <Text numberOfLines={2} className="text-left text-[12px] text-zinc-500">
        {sortDescription ? sortDescription : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default PlayListCover;
