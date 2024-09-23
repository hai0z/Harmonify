import React, {memo, useEffect, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  View,
  Animated as Anim,
} from 'react-native';
import {usePlayerStore} from '../../store/playerStore';
import getThumbnail from '../../utils/getThumnail';
import TrackPlayer, {useActiveTrack} from 'react-native-track-player';
import Animated, {FadeIn} from 'react-native-reanimated';
import useDebounce from '../../hooks/use_debounce';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen');

const ImageSlider = () => {
  const playList = usePlayerStore(state => state.playList);

  const shuffleMode = usePlayerStore(state => state.shuffleMode);
  const currentSong = usePlayerStore(state => state.currentSong);

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

  const [hasScroll, setHasScroll] = useState(false);

  const hasScrollAnimation = useDebounce(() => setHasScroll(true), 1000);

  useEffect(() => {
    setHasScroll(false);
    hasScrollAnimation();
  }, [shuffleMode]);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: currentSongIndex == -1 ? 0 : currentSongIndex,
      animated:
        currentSongIndex === 0 || currentSongIndex === playList.items.length - 1
          ? false
          : hasScroll,
      viewPosition: 1,
    });
    hasScrollAnimation();
  }, [currentSong?.id, playList.items]);

  return (
    <View
      style={{
        marginTop: SCREEN_HEIGHT * 0.1,
        zIndex: 100,
        width: SCREEN_WIDTH,
      }}>
      <FlashList
        ref={flatListRef}
        pagingEnabled
        extraData={currentSongIndex}
        horizontal
        scrollEventThrottle={64}
        initialScrollIndex={currentSongIndex}
        onMomentumScrollEnd={swpipeToChangeSong}
        estimatedItemSize={SCREEN_WIDTH}
        data={playList.items}
        renderItem={({item}: any) => <SliderItem item={item} />}
      />
    </View>
  );
};

const SliderItem = memo(({item}: {item: any}) => {
  console.log('hehehe');
  const isPlayFromLocal = usePlayerStore(state => state.isPlayFromLocal);
  return (
    <View
      key={item.encodeId}
      style={{
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Animated.Image
        entering={FadeIn.duration(200).springify().delay(250)}
        source={{
          uri: isPlayFromLocal
            ? item?.thumbnail
            : getThumbnail(item?.thumbnail),
        }}
        className="rounded-md z-20"
        style={{
          height: SCREEN_WIDTH * 0.85,
          width: SCREEN_WIDTH * 0.85,
        }}
      />
    </View>
  );
});

export default memo(ImageSlider);
