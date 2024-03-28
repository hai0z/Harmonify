import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import getThumbnail from '../utils/getThumnail';

interface Props {
  item: any;
  index?: number;
  isAlbum?: boolean;
  onClick: (item: any) => void;
}
const TrackItem = (props: Props) => {
  console.log('df');
  const {item, index, onClick, isAlbum} = props;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex flex-row  items-center mx-4 my-2"
      onPress={() => onClick(item)}>
      {isAlbum ? (
        <View className="w-14 h-14 rounded-md flex justify-center items-center">
          <Text className="text-white font-semibold">{index! + 1}</Text>
        </View>
      ) : (
        <Image
          source={{uri: getThumbnail(item.thumbnail)}}
          key={item.encodeId}
          className="w-14 h-14 rounded-md"
        />
      )}
      <View className="flex justify-center ml-2 flex-1">
        <Text
          numberOfLines={1}
          style={{
            fontWeight: '400',
            color: 'white',
          }}>
          {item?.title}
        </Text>

        <Text numberOfLines={1} className="text-zinc-500">
          {item?.artistsNames}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TrackItem);
