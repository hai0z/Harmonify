import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import getThumbnail from '../utils/getThumnail';
import Feather from 'react-native-vector-icons/Feather';
import useThemeStore from '../store/themeStore';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
interface Props {
  item: any;
  index?: number;
  isAlbum?: boolean;
  onClick: (item: any) => void;
  showBottomSheet: (item: any) => void;
}

const TrackItem = (props: Props) => {
  const {item, index, onClick, isAlbum, showBottomSheet} = props;

  const COLOR = useThemeStore(state => state.COLOR);

  console.log('track renderItem');
  return (
    <TouchableOpacity
      style={{opacity: item?.streamingStatus === 1 ? 1 : 0.5}}
      activeOpacity={0.8}
      disabled={item?.streamingStatus === 2}
      className="flex flex-row  items-center mx-4 mb-3"
      onPress={() => onClick(item)}>
      {isAlbum ? (
        <View
          className="rounded-md flex justify-center items-center"
          style={{width: wp(15), height: wp(25)}}>
          <Text style={{color: COLOR.TEXT_PRIMARY}} className="font-semibold">
            {index! + 1}
          </Text>
        </View>
      ) : (
        <FastImage
          source={{
            uri: getThumbnail(item?.thumbnail),
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
            color: item?.isActive ? COLOR.PRIMARY : COLOR.TEXT_PRIMARY,
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
      <TouchableOpacity
        disabled={item?.streamingStatus === 2}
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
