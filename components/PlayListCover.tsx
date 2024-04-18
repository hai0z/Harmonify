import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import getThumbnail from '../utils/getThumnail';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import useThemeStore from '../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import TextTicker from 'react-native-text-ticker';
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
  const COLOR = useThemeStore(state => state.COLOR);
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
      <FastImage
        source={{uri: getThumbnail(thumbnail) || ''}}
        className="w-40 h-40 rounded-md object-cover"
        style={{width: wp(45), height: wp(45)}}
      />
      <Text
        numberOfLines={1}
        className="text-left mt-1"
        style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4)}}>
        {title}
      </Text>
      <Text
        numberOfLines={2}
        className="text-left"
        style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(3)}}>
        {sortDescription ? sortDescription : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default PlayListCover;
