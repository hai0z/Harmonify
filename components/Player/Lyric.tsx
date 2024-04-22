import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {usePlayerStore} from '../../store/playerStore';
import {FlashList} from '@shopify/flash-list';
import {LinearGradient} from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import useSyncLyric from '../../hooks/useSyncLyric';
import useThemeStore from '../../store/themeStore';
import Animated from 'react-native-reanimated';
import useImageColor from '../../hooks/useImageColor';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
const OFFSET = 1;

const Lyric = () => {
  const lyrics = usePlayerStore(state => state.lyrics);
  const isPlayFromLocal = usePlayerStore(state => state.isPlayFromLocal);

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
  const {vibrantColor: bg} = useImageColor();

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
          }}>
          <View className="px-4 py-4 justify-between flex flex-row items-center">
            <Text
              className=" font-bold z-[3] "
              style={{color: COLOR.TEXT_PRIMARY}}>
              Lời bài hát
            </Text>
            <View className="w-7 h-7 bg-[#ffffff80] flex justify-center items-center rounded-full">
              <AntDesign
                name="arrowsalt"
                size={16}
                color={COLOR.TEXT_PRIMARY}
              />
            </View>
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
                    className="mb-4"
                    style={{
                      color: currentLine >= index ? 'white' : 'black',
                      fontSize: wp(6),
                      fontFamily: 'GothamBold',
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
