import React, {memo, useEffect, useRef} from 'react';
import {FlashList} from '@shopify/flash-list';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  View,
} from 'react-native';
import {usePlayerStore} from '../../store/playerStore';
import getThumbnail from '../../utils/getThumnail';
import TrackPlayer, {useActiveTrack} from 'react-native-track-player';
import Animated, {FadeIn} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen');

const ImageSlider = () => {
  const {playList} = usePlayerStore();

  const currentSong = useActiveTrack();

  const currentSongIndex = playList.items.findIndex(
    (s: any) => s.encodeId == currentSong?.id,
  );

  const flatListRef = React.useRef<FlashList<any>>(null);

  const swpipeToChangeSong = async (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const pageNum = Math.min(
      Math.max(
        Math.floor(e.nativeEvent.contentOffset.x / SCREEN_WIDTH + 0.5) + 1,
        0,
      ),
      playList.items.length,
    );
    if (pageNum - 1 != currentSongIndex) {
      if (pageNum - 1 < currentSongIndex) {
        await TrackPlayer.skipToPrevious();
      } else {
        await TrackPlayer.skipToNext();
      }
    }
  };

  const indexRef = useRef<number>(currentSongIndex);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: currentSongIndex == -1 ? 0 : currentSongIndex,
      animated:
        indexRef.current == 0 || indexRef.current === playList.items.length - 1
          ? false
          : true,
    });
    indexRef.current = currentSongIndex;
  }, [currentSong?.id]);

  return (
    <Animated.View
      style={{
        marginTop: SCREEN_HEIGHT * 0.1,
        zIndex: 100,
        width: SCREEN_WIDTH,
      }}>
      <FlashList
        ref={flatListRef}
        pagingEnabled
        horizontal
        scrollEventThrottle={64}
        initialScrollIndex={currentSongIndex}
        onMomentumScrollEnd={swpipeToChangeSong}
        estimatedItemSize={SCREEN_WIDTH}
        data={playList.items}
        renderItem={({item, index}: any) => (
          <SliderItem item={item} index={index} />
        )}
      />
    </Animated.View>
  );
};

const SliderItem = ({item, index}: any) => {
  return (
    <View
      key={index}
      style={{
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Animated.Image
        entering={FadeIn.duration(400).springify().delay(250)}
        src={getThumbnail(item.thumbnail)}
        className="rounded-md z-20"
        style={{
          height: SCREEN_WIDTH * 0.85,
          width: SCREEN_WIDTH * 0.85,
        }}
      />
    </View>
  );
};

export default memo(ImageSlider);
