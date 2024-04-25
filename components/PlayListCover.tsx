import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import getThumbnail from '../utils/getThumnail';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import useThemeStore from '../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
interface coverProps {
  title: string;
  sortDescription?: string;
  thumbnail: string;
  encodeId: string;
  isAlbum?: boolean;
}

const PlayListCover = ({
  title,
  sortDescription,
  thumbnail,
  encodeId,
  isAlbum = false,
}: coverProps) => {
  const navigation = useNavigation<any>();
  const COLOR = useThemeStore(state => state.COLOR);
  return (
    <TouchableOpacity
      style={{width: wp(45)}}
      activeOpacity={0.9}
      onPress={() =>
        navigation.push('PlayListDetail', {
          data: {
            playListId: encodeId,
            thumbnail,
          },
        })
      }>
      <FastImage
        source={{uri: getThumbnail(thumbnail) || ''}}
        className="rounded-md object-cover"
        style={{width: wp(45), height: wp(45)}}
      />
      <Text
        numberOfLines={1}
        className="text-left mt-1"
        style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4)}}>
        {title}
      </Text>
      {!isAlbum && (
        <Text
          numberOfLines={2}
          className="text-left"
          style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(3)}}>
          {sortDescription ? sortDescription : ''}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PlayListCover;
