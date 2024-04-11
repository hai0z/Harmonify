import React, {useEffect, useMemo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  FlatList,
  Image,
  View,
  Text,
} from 'react-native';
import {usePlayerStore} from '../../store/playerStore';
import getThumbnail from '../../utils/getThumnail';
import TrackPlayer, {useActiveTrack} from 'react-native-track-player';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen');

const ImageSlider = () => {
  const playList = usePlayerStore(state => state.playList);

  console.log('img slider');

  const currentSong = useActiveTrack();

  const currentSongIndex = useMemo(
    () => playList.items.findIndex((s: any) => s.encodeId == currentSong?.id),
    [currentSong?.id],
  );

  const flatListRef = React.useRef<FlashList<any>>(null);

  const swpipeToChangeSong = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    const pageNum = Math.min(
      Math.max(
        Math.floor(e.nativeEvent.contentOffset.x / SCREEN_WIDTH + 0.5) + 1,
        0,
      ),
      playList.items.length,
    );
    if (pageNum - 1 != currentSongIndex) {
      if (pageNum - 1 < currentSongIndex) {
        TrackPlayer.skipToPrevious();
      } else {
        TrackPlayer.skipToNext();
      }
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: currentSongIndex == -1 ? 0 : currentSongIndex,
      animated: true,
    });
  }, [currentSong?.id]);

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
        horizontal
        initialScrollIndex={currentSongIndex}
        onMomentumScrollEnd={swpipeToChangeSong}
        estimatedItemSize={SCREEN_WIDTH}
        data={playList.items}
        renderItem={({item, index}: any) => (
          <SliderItem item={item} index={index} />
        )}
      />
    </View>
  );
};

const SliderItem = React.memo(({item, index}: any) => {
  return (
    <View
      key={index}
      style={{
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Animated.Image
        entering={FadeIn.duration(300).springify()}
        exiting={FadeOut.duration(300).springify()}
        src={getThumbnail(item.thumbnail)}
        className="rounded-md z-20"
        style={{
          height: SCREEN_WIDTH * 0.85,
          width: SCREEN_WIDTH * 0.85,
        }}
      />
    </View>
  );
});

export default React.memo(ImageSlider);
