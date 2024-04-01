import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {usePlayerStore} from '../../store/playerStore';
import {FlashList} from '@shopify/flash-list';
import {LinearGradient} from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import useSyncLyric from '../../hooks/useSyncLyric';
import tinycolor from 'tinycolor2';
import useThemeStore from '../../store/themeStore';

const OFFSET = 2;

const Lyric = () => {
  const lyrics = usePlayerStore(state => state.lyrics);
  const isPlayFromLocal = usePlayerStore(state => state.isPlayFromLocal);
  let bgColor = usePlayerStore(state => state.color);

  const {currentLine} = useSyncLyric(lyrics);

  const nativgation = useNavigation<any>();

  useEffect(() => {
    lyricsRef.current &&
      lyricsRef.current.scrollToIndex({
        index:
          (currentLine as number) === -1 ? 0 : (currentLine as number) - OFFSET,
        animated: true,
      });
  }, [currentLine]);

  const lyricsRef = React.useRef<FlashList<any>>(null);
  const {darkMode, COLOR} = useThemeStore(state => state);
  const bg = darkMode
    ? bgColor.vibrant === '#0098DB'
      ? tinycolor(bgColor.average).isDark()
        ? tinycolor(bgColor.average).lighten(20).toString()
        : bgColor.average
      : bgColor.vibrant
    : tinycolor(bgColor.dominant).brighten(75).toString();

  return (
    lyrics?.length > 0 &&
    !isPlayFromLocal && (
      <TouchableOpacity
        onPress={() => nativgation.navigate('Lyric', {lyrics})}
        activeOpacity={1}
        className="rounded-2xl mt-10"
        style={{
          backgroundColor: bg,
          height: 320,
        }}>
        <LinearGradient
          colors={[bg!, bg!, 'transparent']}
          className="absolute top-0 left-0 right-0 bottom-0 h-10 z-[2] rounded-t-2xl"
        />
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
            initialScrollIndex={currentLine! - OFFSET}
            estimatedItemSize={16}
            showsVerticalScrollIndicator={false}
            extraData={currentLine}
            renderItem={({item, index}: any) => {
              return (
                <Text
                  key={index}
                  className=" font-bold text-[20px] mb-4"
                  style={{
                    color:
                      (currentLine as number) >= index
                        ? darkMode
                          ? 'white'
                          : COLOR.TEXT_LYRIC
                        : 'black',
                  }}>
                  {item.data}
                </Text>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
        <LinearGradient
          colors={['transparent', bg!]}
          className="absolute  left-0 right-0 bottom-0 h-20 z-[2] rounded-b-xl"
        />
      </TouchableOpacity>
    )
  );
};

export default React.memo(Lyric);
