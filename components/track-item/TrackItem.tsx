import {View, Text, TouchableOpacity} from "react-native";
import React from "react";
import getThumbnail from "../../utils/getThumnail";
import Feather from "react-native-vector-icons/Feather";
import useThemeStore from "../../store/themeStore";
import FastImage from "react-native-fast-image";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {usePlayerStore} from "../../store/playerStore";
import {objectToTrack} from "../../service/trackPlayerService";
import useInternetState from "../../hooks/useInternetState";
import {GREEN} from "../../constants";
import ActiveTrackAnimation from "./ActiveTrackAnimation";
import {Song} from "../../utils/types/type";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
dayjs.extend(relativeTime);
dayjs.locale("vi");
interface Props {
  item: Song;
  index?: number;
  isAlbum?: boolean;
  onClick: (item: any) => void;
  showBottomSheet: (item: Song) => void;
  isActive?: boolean;
  timeStamp?: number;
}

const TrackItem: React.FC<Props> = props => {
  const isConnected = useInternetState();
  const {item, index, onClick, isAlbum, showBottomSheet, isActive, timeStamp} =
    props;
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);
  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);
  const isTrackThumbnailBorder = useThemeStore(
    state => state.isTrackThumbnailBorder
  );
  return (
    <TouchableOpacity
      style={{opacity: isConnected ? 1 : 0.5}}
      activeOpacity={0.8}
      disabled={isConnected === false}
      className="flex flex-row  items-center mx-4 mb-3"
      onPress={() => {
        setCurrentSong(objectToTrack(item));
        onClick(item);
      }}>
      {isAlbum ? (
        <View
          className="rounded-md flex justify-center items-center"
          style={{width: wp(15), height: wp(15)}}>
          <View>
            <Text style={{color: COLOR.TEXT_PRIMARY}} className="font-semibold">
              {!isActive && index! + 1}
            </Text>

            {isActive && <ActiveTrackAnimation isAlbum={true} />}
          </View>
        </View>
      ) : (
        <View>
          <FastImage
            className={isTrackThumbnailBorder ? "rounded-lg" : ""}
            source={{
              uri: getThumbnail(item?.thumbnail),
            }}
            key={item?.encodeId}
            style={{width: wp(15), height: wp(15)}}
          />
          {isActive && (
            <ActiveTrackAnimation
              isAlbum={false}
              style={{
                borderRadius: isTrackThumbnailBorder ? 6 : 0,
              }}
            />
          )}
        </View>
      )}
      <View className="flex  ml-2 flex-1 justify-center">
        <Text
          className="font-semibold"
          numberOfLines={1}
          style={{
            color: isActive
              ? theme !== "amoled"
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
          {timeStamp && (
            <Text style={{fontSize: wp(2.5), color: COLOR.TEXT_SECONDARY}}>
              {dayjs(timeStamp).fromNow()}
            </Text>
          )}
        </View>
      </View>

      <View>
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
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TrackItem);
