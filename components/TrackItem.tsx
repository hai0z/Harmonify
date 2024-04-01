import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useContext} from 'react';
import getThumbnail from '../utils/getThumnail';
import Feather from 'react-native-vector-icons/Feather';
import useThemeStore from '../store/themeStore';
interface Props {
  item: any;
  index?: number;
  isAlbum?: boolean;
  onClick: (item: any) => void;
  showBottomSheet: (item: any) => void;
  isActive?: boolean;
}
const TrackItem = (props: Props) => {
  console.log('df');
  const {item, index, onClick, isAlbum, showBottomSheet, isActive} = props;
  const COLOR = useThemeStore(state => state.COLOR);
  return (
    <TouchableOpacity
      style={{opacity: item?.streamingStatus === 1 ? 1 : 0.5}}
      activeOpacity={0.8}
      disabled={item?.streamingStatus === 2}
      className="flex flex-row  items-center mx-4 my-2"
      onPress={() => onClick(item)}>
      {isAlbum ? (
        <View className="w-14 h-14 rounded-md flex justify-center items-center">
          <Text style={{color: COLOR.TEXT_PRIMARY}} className="font-semibold">
            {index! + 1}
          </Text>
        </View>
      ) : (
        <Image
          source={{uri: getThumbnail(item.thumbnail)}}
          key={item.encodeId}
          className="w-14 h-14 rounded-md"
        />
      )}
      <View className="flex justify-center ml-2 flex-1 ">
        <Text
          className="font-semibold"
          numberOfLines={1}
          style={{
            color: isActive ? COLOR.PRIMARY : COLOR.TEXT_PRIMARY,
          }}>
          {item?.title}
        </Text>

        <Text numberOfLines={1} style={{color: COLOR.TEXT_SECONDARY}}>
          {item?.artistsNames}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => showBottomSheet(item)}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Feather
          name="more-vertical"
          size={20}
          color={`${COLOR.TEXT_PRIMARY}90`}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(TrackItem);
