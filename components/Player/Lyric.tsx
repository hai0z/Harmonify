import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
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

  const lyricsRef = React.useRef<FlashList<any>>(null);

  useEffect(() => {
    lyricsRef.current &&
      lyricsRef.current.scrollToIndex({
        index: currentLine === -1 ? 0 : currentLine - OFFSET,
        animated: true,
      });
  }, [currentLine]);

  const {COLOR} = useThemeStore(state => state);

  const {vibrantColor: bg} = useImageColor();

  if (isPlayFromLocal) {
    return null;
  }
  return (
    lyrics?.length > 0 && (
      <Animated.View className="mb-4">
        <TouchableOpacity
          onPress={() => nativgation.navigate('Lyric')}
          activeOpacity={1}
          className="rounded-2xl"
          style={{
            backgroundColor: bg,
            height: 340,
          }}>
          <View className="px-4 py-4 justify-between flex flex-row items-center ">
            <Text
              className=" font-bold z-[3] "
              style={{color: COLOR.TEXT_PRIMARY}}>
              Lời bài hát
            </Text>
            <TouchableOpacity
              onPress={() => nativgation.navigate('Lyric', {lyrics})}
              className="w-7 h-7 flex justify-center items-center rounded-full z-[3]"
              style={{
                backgroundColor: COLOR.isDark ? '#00000020' : '#ffffff50',
              }}>
              <AntDesign
                name="arrowsalt"
                size={16}
                color={COLOR.TEXT_PRIMARY}
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 pt-2">
            <FlashList
              ref={lyricsRef}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 48,
              }}
              data={lyrics}
              initialScrollIndex={currentLine === -1 ? 0 : currentLine - OFFSET}
              estimatedItemSize={32}
              showsVerticalScrollIndicator={false}
              extraData={currentLine}
              renderItem={({item, index}: any) => {
                return (
                  <Animated.Text
                    key={index}
                    className="mb-1"
                    style={{
                      color: currentLine >= index ? 'white' : 'black',
                      fontSize: wp(6),
                      fontFamily: 'SVN-Gotham Black',
                    }}>
                    {item.data}
                  </Animated.Text>
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
