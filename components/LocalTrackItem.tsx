import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import useThemeStore from '../store/themeStore';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {usePlayerStore} from '../store/playerStore';
import {DEFAULT_IMG, GREEN} from '../constants';
import ActiveTrackAnimation from './track-item/ActiveTrackAnimation';
import {objectToTrack} from '../service/trackPlayerService';
interface Props {
  item: any;
  onClick: (item: any) => void;
  isActive?: boolean;
}

const TrackItem = (props: Props) => {
  const {item, onClick, isActive} = props;
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);
  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex flex-row  items-center mx-4 mb-3"
      onPress={() => {
        setCurrentSong({
          ...objectToTrack(item),
          url: item.url,
          artwork: item.thumbnail || DEFAULT_IMG,
        });
        onClick(item);
      }}>
      <View>
        <FastImage
          source={{
            uri: item?.thumbnail,
          }}
          key={item?.encodeId}
          className="rounded-none"
          style={{width: wp(15), height: wp(15)}}
        />
        {isActive && <ActiveTrackAnimation />}
      </View>

      <View className="flex justify-center ml-2 flex-1 ">
        <Text
          className="font-semibold"
          numberOfLines={1}
          style={{
            color: isActive
              ? theme === 'amoled'
                ? GREEN
                : COLOR.PRIMARY
              : COLOR.TEXT_PRIMARY,
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
