import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {usePlayerStore} from '../../store/playerStore';
import {FlashList} from '@shopify/flash-list';
import {LinearGradient} from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import useSyncLyric from '../../hooks/useSyncLyric';
import tinycolor from 'tinycolor2';
import useThemeStore from '../../store/themeStore';
import Animated from 'react-native-reanimated';

const OFFSET = 1;

const Lyric = () => {
  const lyrics = usePlayerStore(state => state.lyrics);
  const isPlayFromLocal = usePlayerStore(state => state.isPlayFromLocal);
  let bgColor = usePlayerStore(state => state.color);

  const currentLine = useSyncLyric();

  const nativgation = useNavigation<any>();

  useEffect(() => {
    console.log(currentLine);
    lyricsRef.current &&
      lyricsRef.current.scrollToIndex({
        index: currentLine! === -1 ? 0 : currentLine - OFFSET,
        animated: true,
      });
  }, [currentLine]);

  const lyricsRef = React.useRef<FlashList<any>>(null);
  const {COLOR} = useThemeStore(state => state);
  const bg = useMemo(() => {
    return COLOR.isDark
      ? bgColor.vibrant === '#0098DB'
        ? tinycolor(bgColor.average).isDark()
          ? tinycolor(bgColor.average).lighten(20).toString()
          : bgColor.average
        : bgColor.vibrant
      : bgColor.vibrant === '#0098DB'
      ? tinycolor(bgColor.average).isDark()
        ? tinycolor(bgColor.average).lighten(50).toString()
        : bgColor.average
      : tinycolor(bgColor.vibrant).lighten(20).toString();
  }, [bgColor.dominant, COLOR]);

  if (isPlayFromLocal) {
    return null;
  }
  return (
    lyrics?.length > 0 && (
      <Animated.View>
        <TouchableOpacity
          onPress={() => nativgation.navigate('Lyric', {lyrics})}
          activeOpacity={1}
          className="rounded-2xl mt-10"
          style={{
            backgroundColor: bg,
            height: 320,
            elevation: 10,
          }}>
          <View className="px-4 py-4">
            <Text
              className=" font-bold z-[3] "
              style={{color: COLOR.TEXT_PRIMARY}}>
              Lời bài hát
            </Text>
          </View>
          <View className="flex-1">
            <FlashList
              ref={lyricsRef}
              contentContainerStyle={{padding: 16}}
              data={lyrics}
              initialScrollIndex={
                currentLine! === -1 ? 0 : currentLine - OFFSET
              }
              estimatedItemSize={32}
              showsVerticalScrollIndicator={false}
              extraData={currentLine}
              renderItem={({item, index}: any) => {
                return (
                  <Text
                    key={index}
                    className=" font-bold text-[20px] mb-3"
                    style={{
                      color: currentLine >= index ? 'white' : 'black',
                    }}>
                    {item.data}
                  </Text>
                );
              }}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>
          <LinearGradient
            colors={['transparent', bg!, bg!]}
            className="absolute  left-0 right-0 bottom-0 h-16 z-[2] rounded-b-xl"
          />
        </TouchableOpacity>
      </Animated.View>
    )
  );
};

export default React.memo(Lyric);
