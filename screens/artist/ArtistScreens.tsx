import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {getArtist, getArtistSong} from '../../apis/artists';
import {LinearGradient} from 'react-native-linear-gradient';
import {usePlayerStore} from '../../store/playerStore';
import {handlePlay} from '../../utils/musicControl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'expo-status-bar';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';
import PlayListCover from '../../components/PlayListCover';
interface artistType {
  id: string;
  name: string;
  thumbnailM: string;
  sortBiography: string;
  realname: string;
  birthday: string;
  totalFollow: number;
  sections: any[];
  alias: string;
  biography: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const ArtistScreens = ({route}: any) => {
  const {name} = route.params;
  const [loading, setLoading] = React.useState(true);
  const [dataDetailArtist, setDataDetailArtist] = useState<artistType>();

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener('getArtist', (data: any) => {
      setDataDetailArtist(data);
      setLoading(false);
    });

    nodejs.channel.post('getArtist', name);
  }, [name]);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerColor = scrollY.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
    outputRange: ['transparent', 'transparent', '#121212'],
    extrapolate: 'clamp',
  });

  const navigation = useNavigation<any>();
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <ActivityIndicator size="large" color="#DA291C" />
      </View>
    );
  }
  return (
    <View className="bg-[#121212]  flex-1">
      <StatusBar backgroundColor={`#00000030`} style="light" />
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-[999] h-20  items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Animated.Text className="text-white font-bold ml-4">
          {dataDetailArtist?.name}
        </Animated.Text>
      </Animated.View>
      <ScrollView
        contentContainerStyle={{paddingBottom: 200}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        <View className="relative" style={{height: SCREEN_WIDTH * 1.2}}>
          <View
            className="absolute top-0 left-0 right-0 bottom-0 z-10"
            style={{
              height: SCREEN_WIDTH * 1.2,
              width: SCREEN_WIDTH,
              backgroundColor: '#00000050',
            }}
          />
          <Image
            source={{uri: dataDetailArtist?.thumbnailM}}
            style={[
              StyleSheet.absoluteFillObject,
              {
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH * 1.2,
              },
            ]}
          />
          <View className="absolute bottom-0 z-20">
            <Text className="text-white font-bold text-xl p-4 ">
              {dataDetailArtist?.name}
            </Text>
          </View>
        </View>

        {/* top */}
        <View>
          <View className="text-white text-lg font-semibold px-4 py-4 justify-between items-center flex-row">
            <Text className="text-white font-bold text-lg">
              Bài hát nổi bật
            </Text>
          </View>
          {dataDetailArtist?.sections
            .filter((type: any) => type.sectionId === 'aSongs')[0]
            ?.items.slice(0, 5)
            .map((item: any) => (
              <TouchableOpacity
                key={item.encodeId}
                className="flex-row items-center px-4 mb-2"
                onPress={() => {
                  handlePlay(
                    item,
                    dataDetailArtist?.sections.filter(
                      (type: any) => type.sectionId === 'aSongs',
                    )[0].items,
                  );
                }}>
                <Image
                  source={{uri: item.thumbnail}}
                  key={item.encodeId}
                  className="rounded-md h-14 w-14"
                />
                <View>
                  <Text className="text-white ml-4">{item.title}</Text>
                  <Text className="text-zinc-500 ml-4">
                    {item.artistsNames}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          <View className="w-full justify-center items-center my-2">
            <TouchableOpacity
              className="w-32 p-2 rounded-full items-center border-[#DA291C] border"
              onPress={() => {
                navigation.push('ArtistsSong', {
                  id: dataDetailArtist?.id,
                  name: dataDetailArtist?.alias,
                });
              }}>
              <Text className="text-white text-sm">Xem thêm</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* playlist */}
        <View>
          {dataDetailArtist?.sections
            .filter((type: any) => type.sectionId === 'aPlaylist')
            .map((item: any, index: number) => (
              <View key={index} className="mb-4">
                <Text className="text-white text-lg font-semibold px-4 py-4">
                  {item.title}
                </Text>
                <ScrollView
                  horizontal
                  contentContainerStyle={{paddingHorizontal: 16, gap: 10}}>
                  {item.items.map((item: any, index: number) => (
                    <PlayListCover
                      key={index}
                      encodeId={item.encodeId}
                      sortDescription={item.sortDescription}
                      title={item.title}
                      thumbnail={item.thumbnail}
                    />
                  ))}
                </ScrollView>
              </View>
            ))}
        </View>

        {/* Single */}
        <View>
          <Text className="text-white text-lg font-semibold px-4 py-4">
            Đĩa đơn
          </Text>
          <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal: 16, gap: 10}}>
            {dataDetailArtist?.sections
              .filter((type: any) => type.sectionId === 'aSingle')[0]
              ?.items.map((item: any, index: number) => (
                <PlayListCover
                  key={index}
                  encodeId={item.encodeId}
                  sortDescription={item.sortDescription}
                  title={item.title}
                  thumbnail={item.thumbnail}
                />
              ))}
          </ScrollView>
        </View>
        {/* Relate artis */}

        <View>
          <Text className="text-white text-lg font-semibold px-4 py-4">
            Có thể bạn thích
          </Text>
          <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal: 16, gap: 10}}>
            {dataDetailArtist?.sections
              .filter((type: any) => type.sectionId === 'aReArtist')[0]
              ?.items.map((item: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  onPress={() => {
                    navigation.navigate('Artists', {
                      name: item.alias,
                    });
                  }}>
                  <Image
                    source={{uri: item.thumbnailM}}
                    className="w-40 h-40 rounded-full"
                  />
                  <View>
                    <Text className="text-white text-center mt-2">
                      {item.name}
                    </Text>
                    <Text className="text-zinc-400 text-center">
                      {item.totalFollow} quan tâm
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>

        {/* info */}
        <View className="px-4 flex flex-col gap-2 py-4">
          <Text className="text-white text-lg font-semibold py-2">
            Thông tin
          </Text>
          <Text className="text-zinc-400">
            Tên thật: {dataDetailArtist?.realname}
          </Text>
          <Text className="text-zinc-400">
            Ngày sinh: {dataDetailArtist?.birthday || 'Không rõ'}
          </Text>

          <Text className="text-zinc-400">
            {dataDetailArtist?.sortBiography}
          </Text>
          <Text className="text-zinc-400">{dataDetailArtist?.biography}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ArtistScreens;
