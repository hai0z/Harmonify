import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import getThumbnail from '../utils/getThumnail';
import useThemeStore from '../store/themeStore';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {usePlayerStore} from '../store/playerStore';
import {objectToTrack} from '../service/trackPlayerService';
interface Props {
  item: any;
  index?: number;
  isAlbum?: boolean;
  onClick: (item: any) => void;
}

const TrackItem = (props: Props) => {
  const {item, index, onClick, isAlbum} = props;
  const COLOR = useThemeStore(state => state.COLOR);
  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);
  const isPlayFromLocal = usePlayerStore(state => state.isPlayFromLocal);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex flex-row  items-center mx-4 mb-3"
      onPress={() => {
        setCurrentSong(objectToTrack(item));
        onClick(item);
      }}>
      {isAlbum ? (
        <View
          className="rounded-md flex justify-center items-center"
          style={{width: wp(15), height: wp(15)}}>
          <Text style={{color: COLOR.TEXT_PRIMARY}} className="font-semibold">
            {index! + 1}
          </Text>
        </View>
      ) : (
        <FastImage
          source={{
            uri: isPlayFromLocal
              ? item?.thumbnail
              : getThumbnail(item?.thumbnail),
          }}
          key={item?.encodeId}
          className="rounded-none"
          style={{width: wp(15), height: wp(15)}}
        />
      )}
      <View className="flex justify-center ml-2 flex-1 ">
        <Text
          className="font-semibold"
          numberOfLines={1}
          style={{
            color: COLOR.TEXT_PRIMARY,
            fontSize: wp(4),
          }}>
          {item?.title}
        </Text>

        <Text
          numberOfLines={1}
          style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(3.5)}}>
          {item?.artistsNames}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TrackItem);
