import {TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import getThumbnail from '../utils/getThumnail';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import useThemeStore from '../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {navigation} from '../utils/types/RootStackParamList';
import {Text, useTheme} from 'react-native-paper';
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
  const navigation = useNavigation<navigation<'PlayListDetail'>>();
  const COLOR = useThemeStore(state => state.COLOR);
  console.log('sdf');
  return (
    <TouchableOpacity
      style={{width: wp(45)}}
      activeOpacity={0.9}
      onPress={() =>
        navigation.push('PlayListDetail', {
          data: {
            playListId: encodeId,
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
        style={{fontSize: wp(4)}}>
        {title}
      </Text>
      {!isAlbum && (
        <Text numberOfLines={2} className="text-left" style={{fontSize: wp(3)}}>
          {sortDescription ? sortDescription : ''}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default memo(PlayListCover);
