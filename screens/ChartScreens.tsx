import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {getChart} from '../apis/chart';
import {FlashList} from '@shopify/flash-list';
import {handlePlay} from '../utils/musicControl';
import {LinearGradient} from 'react-native-linear-gradient';
import getThumbnail from '../utils/getThumnail';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ChartScreens = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerColor = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.8],
        outputRange: ['transparent', 'transparent', '#121212'],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const headerTitleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.8],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );
  useEffect(() => {
    nodejs.channel.addListener('charthome', (data: any) => {
      setData(data.RTChart.items);
      setLoading(false);
    });
    nodejs.channel.post('charthome');
  }, []);

  const handlePlaySong = (song: any) => {
    handlePlay(song, data);
  };

  const navigation = useNavigation<any>();
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <ActivityIndicator size="large" color="#DA291C" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212]">
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-30 h-20  justify-between items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View className="justify-center items-center">
          <Animated.Text
            style={{opacity: headerTitleOpacity}}
            className="text-white font-bold">
            Bảng xếp hạng
          </Animated.Text>
        </View>
        <View className="w-10"></View>
      </Animated.View>
      <FlashList
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        ListHeaderComponent={() => (
          <ChartHeader
            data={[...data].splice(0, 3)}
            handlePlaySong={handlePlaySong}
          />
        )}
        estimatedItemSize={70}
        data={[...data].splice(3, data.length)}
        renderItem={({item, index}) => (
          <ChartItem
            item={item}
            index={index}
            onPlay={handlePlaySong}
            total={[...data].splice(3, data.length).length}
          />
        )}
      />
    </View>
  );
};

const Dot = ({scrollX}: any) => {
  return (
    <View className="flex flex-row gap-2">
      {Array(3)
        .fill(0)
        .map((_, i) => {
          const inputRange = [
            (i - 1) * SCREEN_WIDTH,
            i * SCREEN_WIDTH,
            (i + 1) * SCREEN_WIDTH,
          ];
          return (
            <Animated.View
              key={i}
              className={'w-2 h-2 rounded-full mx-1 bg-[#ffffff]'}
              style={{
                opacity: scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                }),
              }}></Animated.View>
          );
        })}
    </View>
  );
};
const ChartHeader = ({data, handlePlaySong}: any) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View
      style={{width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.2}}
      className="justify-center items-center mb-8">
      {data.map((item: any, index: number) => {
        const opacity = scrollX.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          outputRange: [0.2, 1, 0.2],
          extrapolate: 'clamp',
        });
        return (
          <Animated.Image
            key={index}
            blurRadius={1000}
            src={item?.thumbnailM}
            className="w-full h-full"
            style={[StyleSheet.absoluteFillObject, {opacity}]}
          />
        );
      })}
      <LinearGradient
        colors={['transparent', '#121212']}
        className="bottom-0 w-full h-full absolute"
      />
      <View className="absolute bottom-0 z-50">
        <Dot scrollX={scrollX} />
      </View>
      <ScrollView
        ref={scrollViewRef}
        className="flex flex-col"
        horizontal
        pagingEnabled
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {data.map((item: any, index: number) => {
          const titleOpacity = scrollX.interpolate({
            inputRange: [
              SCREEN_WIDTH * (index - 1),
              SCREEN_WIDTH * index,
              SCREEN_WIDTH * (index + 1),
            ],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });
          const imgScale = scrollX.interpolate({
            inputRange: [
              SCREEN_WIDTH * (index - 1),
              SCREEN_WIDTH * index,
              SCREEN_WIDTH * (index + 1),
            ],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });
          return (
            <View
              key={item.encodeId}
              className="flex flex-col items-center justify-center"
              style={{width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.2}}>
              <Animated.Image
                className="rounded-xl"
                src={getThumbnail(item.thumbnailM) || ''}
                style={{
                  width: SCREEN_WIDTH * 0.6,
                  height: SCREEN_WIDTH * 0.6,
                  transform: [{scale: imgScale}],
                }}
              />
              <View className="mt-4">
                <Animated.Text
                  className="text-white font-xl font-bold uppercase text-center"
                  style={{
                    maxWidth: SCREEN_WIDTH * 0.6,
                    opacity: titleOpacity,
                  }}>
                  {item.title}
                </Animated.Text>
                <Animated.Text
                  className="text-zinc-500 font-bold text-center"
                  style={{
                    maxWidth: SCREEN_WIDTH * 0.6,
                    opacity: titleOpacity,
                  }}>
                  {item.artistsNames}
                </Animated.Text>
              </View>
              <TouchableOpacity
                onPress={() => handlePlaySong(item)}
                className="bg-[#DA291C] px-4 py-2 rounded-full mt-4 flex flex-row">
                <Entypo name="controller-play" size={20} color="#ffffff" />
                <Text className="text-white">Play now</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
const ChartItem = React.memo(({item, index, total, onPlay}: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        paddingBottom: index === total - 1 ? 200 : 0,
      }}
      className="flex flex-row  items-center mx-4 my-2"
      onPress={() => onPlay(item)}>
      <Text className="text-[#FBE122] font-bold mr-4 text-2xl">
        {index + 3 < 10 ? `0${index + 3}` : index + 3}
      </Text>
      <Image
        source={{uri: item?.thumbnail}}
        key={item.encodeId}
        className="w-12 h-12 rounded-md"
      />

      <View className="flex justify-center ml-2 flex-1">
        <Text
          numberOfLines={1}
          style={{
            fontWeight: 'bold',
            color: 'white',
          }}>
          {item?.title}
        </Text>

        <Text numberOfLines={1} className="text-zinc-500 font-semibold">
          {item?.artistsNames}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
export default ChartScreens;
