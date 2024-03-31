import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Image,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useContext, useMemo} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {FlashList} from '@shopify/flash-list';
import {handlePlaySongInLocal} from '../../utils/musicControl';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '../../store/playerStore';
import {DEFAULT_IMG} from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const SCREEN_WIDTH = Dimensions.get('window').width;

const LocalSong = ({route}: any) => {
  const {data} = route.params;

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<any>();

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

  const titleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const handlePlaySong = useCallback(
    (song: any) => handlePlaySongInLocal(song),
    [],
  );

  return (
    <View className="flex-1 bg-[#121212] w-full">
      <StatusBar backgroundColor="#00000030" />
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
            Bài hát trên thiết bị
          </Animated.Text>
        </View>
        <View className="w-10"></View>
      </Animated.View>
      <FlashList
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        ListHeaderComponent={React.memo(() => {
          return (
            <View>
              <View
                className="flex justify-end items-center pb-4"
                style={{height: SCREEN_WIDTH * 0.8}}>
                <LinearGradient
                  colors={['transparent', '#121212']}
                  className="absolute bottom-0 h-40 left-0 right-0 z-50"
                />
                <LinearGradient
                  colors={['transparent', 'blue']}
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      width: SCREEN_WIDTH,
                      height: SCREEN_WIDTH * 0.8,
                    },
                  ]}
                />
                <LinearGradient
                  colors={['blue', '#bdbdbd']}
                  style={[
                    {
                      width: SCREEN_WIDTH * 0.6,
                      height: SCREEN_WIDTH * 0.6,
                    },
                  ]}
                  className="justify-center items-center rounded-lg z-[99]">
                  <MaterialCommunityIcons
                    name="cellphone-arrow-down"
                    size={120}
                    color="#fff"
                  />
                </LinearGradient>
              </View>
              <View className="z-50 mt-4 px-6 mb-4">
                <Animated.Text
                  style={{opacity: titleOpacity}}
                  className="text-white text-center text-3xl font-bold">
                  {'Bài hát trên thiết bị'}
                </Animated.Text>
              </View>
            </View>
          );
        })}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        ListFooterComponent={() => <View style={{height: SCREEN_WIDTH}} />}
        nestedScrollEnabled
        data={data}
        estimatedItemSize={72}
        extraData={[data]}
        keyExtractor={(item: any, index) => `${item.encodeId}_${index}`}
        renderItem={({item}: any) => {
          return <Item item={item} onPress={handlePlaySong} />;
        }}
      />
    </View>
  );
};
const Item = React.memo(({item, onPress}: any) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="flex-row items-center pt-2 mx-4 my-2">
      <Image
        source={{uri: item.thumbnail || DEFAULT_IMG}}
        className="w-14 h-14 justify-center items-center rounded-md"
      />
      <View style={{marginLeft: 10}}>
        <Text className="text-white font-bold mb-[5px]">{item.title}</Text>
        <Text className="text-zinc-400  mb-[5px]">{item.artistsNames}</Text>
      </View>
    </TouchableOpacity>
  );
});
export default LocalSong;
