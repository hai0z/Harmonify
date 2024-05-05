import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import getThumbnail from '../utils/getThumnail';
import Feather from 'react-native-vector-icons/Feather';
import useThemeStore from '../store/themeStore';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {usePlayerStore} from '../store/playerStore';
import {objectToTrack} from '../service/trackPlayerService';
import useInternetState from '../hooks/useInternetState';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
interface Props {
  item: any;
  index?: number;
  isAlbum?: boolean;
  onClick: (item: any) => void;
  showBottomSheet: (item: any) => void;
  isActive?: boolean;
}

const TrackItem = (props: Props) => {
  const isConnected = useInternetState();
  const {item, index, onClick, isAlbum, showBottomSheet, isActive} = props;
  const COLOR = useThemeStore(state => state.COLOR);
  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);
  console.log('track render');
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
        <View>
          <View
            className="rounded-md flex justify-center items-center"
            style={{width: wp(15), height: wp(15)}}>
            {isActive ? (
              <LottieView
                style={{width: wp(10), height: wp(10)}}
                autoPlay
                colorFilters={[{keypath: 'fill', color: COLOR.PRIMARY}]}
                source={require('../assets/animation/musicwave.json')}
              />
            ) : (
              <Text
                style={{color: COLOR.TEXT_PRIMARY}}
                className="font-semibold">
                {index! + 1}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View>
          <FastImage
            source={{
              uri: getThumbnail(item?.thumbnail, 720),
            }}
            key={item?.encodeId}
            className="rounded-none"
            style={{width: wp(15), height: wp(15)}}
          />
          {isActive && (
            <Animated.View
              exiting={FadeOut.duration(300)}
              entering={FadeIn.duration(300)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: '#00000050',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LottieView
                style={{width: wp(10), height: wp(10)}}
                autoPlay
                colorFilters={[{keypath: 'fill', color: COLOR.PRIMARY}]}
                source={require('../assets/animation/musicwave.json')}
              />
            </Animated.View>
          )}
        </View>
      )}
      <View className="flex justify-center ml-2 flex-1 ">
        <Text
          className="font-semibold"
          numberOfLines={1}
          style={{
            color: isActive ? 'hotpink' : COLOR.TEXT_PRIMARY,
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
