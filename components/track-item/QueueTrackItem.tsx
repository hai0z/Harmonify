import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import getThumbnail from '../../utils/getThumnail';
import useThemeStore from '../../store/themeStore';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {usePlayerStore} from '../../store/playerStore';
import {objectToTrack} from '../../service/trackPlayerService';
import useInternetState from '../../hooks/useInternetState';
import {GREEN} from '../../constants';
import ActiveTrackAnimation from './ActiveTrackAnimation';
import {Song} from '../../utils/types/type';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
dayjs.extend(relativeTime);
dayjs.locale('vi');
interface Props {
  item: Song;
  index?: number;
  isAlbum?: boolean;
  onClick: (item: any) => void;
}

const TrackItem = ({item, drag, isActive}: RenderItemParams<Song>) => {
  const isConnected = useInternetState();
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);
  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);
  console.log('renderItem');
  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        style={{
          opacity: isConnected ? 1 : 0.5,
          backgroundColor: isActive ? 'red' : 'transparent',
        }}
        activeOpacity={0.8}
        disabled={isConnected === false}
        className="flex flex-row  items-center mx-4 mb-3"
        onPress={() => {
          setCurrentSong(objectToTrack(item));
        }}>
        {/* {item.isAlbum ? (
          <View>
            <View
              className="rounded-md flex justify-center items-center"
              style={{width: wp(15), height: wp(15)}}>
              <View>
                <Text
                  style={{color: COLOR.TEXT_PRIMARY}}
                  className="font-semibold">
                  {item.index! + 1}
                </Text>

                {isActive && <ActiveTrackAnimation isAlbum={true} />}
              </View>
            </View>
          </View>
        ) : ( */}
        <View>
          <FastImage
            source={{
              uri: getThumbnail(item?.thumbnail),
            }}
            key={item.encodeId}
            className="rounded-none"
            style={{width: wp(15), height: wp(15)}}
          />
          {isActive && <ActiveTrackAnimation isAlbum={false} />}
        </View>

        <View className="flex  ml-2 flex-1 justify-center">
          <Text
            className="font-semibold"
            numberOfLines={1}
            style={{
              color: isActive
                ? theme !== 'amoled'
                  ? COLOR.PRIMARY
                  : GREEN
                : COLOR.TEXT_PRIMARY,
              fontSize: wp(4),
            }}>
            {item?.title}
          </Text>

          <View className="flex-row items-end justify-between">
            <Text
              numberOfLines={1}
              style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(3.5)}}>
              {item?.artistsNames}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

export default TrackItem;
