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
import React, {useCallback, useContext, useEffect, useState} from 'react';

import {handlePlay} from '../../service/trackPlayerService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';
import PlayListCover from '../../components/PlayListCover';
import useThemeStore from '../../store/themeStore';
import {usePlayerStore} from '../../store/playerStore';
import LinearGradient from 'react-native-linear-gradient';
import {PlayerContext} from '../../context/PlayerProvider';
import getThumbnail from '../../utils/getThumnail';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {followArtist} from '../../service/firebase';
import {useUserStore} from '../../store/userStore';

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

function isKeyExistsInArrayObjects(arr: any, key: any, value: any) {
  for (let obj of arr) {
    if (obj.hasOwnProperty(key) && obj[key] === value) {
      return true; // Key tồn tại trong ít nhất một object
    }
  }
  return false; // Key không tồn tại trong bất kỳ object nào
}

const ArtistScreens = ({route}: any) => {
  const {name} = route.params;

  const [loading, setLoading] = React.useState(true);

  const [dataDetailArtist, setDataDetailArtist] = useState<artistType>();

  const COLOR = useThemeStore(state => state.COLOR);

  const {listFollowArtists} = useUserStore();
  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

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
    inputRange: [SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.6],
    outputRange: ['transparent', COLOR.BACKGROUND],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.6, SCREEN_WIDTH],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  console.log(listFollowArtists);
  const navigation = useNavigation<any>();

  const {startMiniPlayerTransition} = useContext(PlayerContext);
  if (loading) {
    return (
      <View
        style={{backgroundColor: COLOR.BACKGROUND}}
        className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      </View>
    );
  }
  return (
    <View className=" flex-1" style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-[999] h-20  items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Animated.Text
          className=" font-bold ml-4"
          style={{color: COLOR.TEXT_PRIMARY, opacity: headerOpacity}}>
          {dataDetailArtist?.name}
        </Animated.Text>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 200}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}>
        <View className="relative" style={{height: SCREEN_WIDTH}}>
          <LinearGradient
            colors={['transparent', COLOR.BACKGROUND]}
            className="absolute left-0 right-0 bottom-0 z-10"
            style={{
              height: SCREEN_WIDTH * 0.8,
              width: SCREEN_WIDTH,
            }}
          />
          <Image
            source={{uri: dataDetailArtist?.thumbnailM}}
            style={[
              StyleSheet.absoluteFillObject,
              {
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
                zIndex: 2,
              },
            ]}
          />

          <View className="absolute bottom-0 z-20">
            <Text
              className="p-4 "
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontFamily: 'GothamBold',
                fontSize: wp(6.5),
              }}>
              {dataDetailArtist?.name}
            </Text>
            <TouchableOpacity
              style={{
                borderColor: COLOR.PRIMARY,
                backgroundColor: listFollowArtists.some(
                  (item: any) => item.id === dataDetailArtist?.id,
                )
                  ? COLOR.PRIMARY
                  : COLOR.BACKGROUND,
              }}
              className="w-32 p-2 rounded-full items-center  border mx-4"
              onPress={() => followArtist(dataDetailArtist)}>
              <Text style={{color: COLOR.TEXT_PRIMARY}} className=" text-sm">
                {listFollowArtists.some(
                  (item: any) => item.id === dataDetailArtist?.id,
                )
                  ? 'Đã theo dõi'
                  : 'Theo dõi'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* top */}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          'sectionId',
          'aSongs',
        ) && (
          <View>
            <View className=" text-lg font-semibold px-4 mt-8 justify-between items-center flex-row">
              <Text
                className=" font-bold text-lg mb-4"
                style={{color: COLOR.TEXT_PRIMARY}}>
                Bài hát nổi bật
              </Text>
            </View>
            {dataDetailArtist?.sections
              ?.filter((type: any) => type.sectionId === 'aSongs')[0]
              ?.items.filter((i: any) => i.streamingStatus === 1)
              .slice(0, 5)

              .map((item: any) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={item.encodeId}
                  className="flex-row items-center px-4 mb-2"
                  onPress={() => {
                    handlePlay(item, {
                      id: name,
                      items: dataDetailArtist?.sections
                        .filter((type: any) => type.sectionId === 'aSongs')[0]
                        .items.filter((i: any) => i.streamingStatus === 1),
                    });
                    setPlayFrom({
                      id: 'artist',
                      name: dataDetailArtist.name,
                    });
                    startMiniPlayerTransition();
                  }}>
                  <Image
                    source={{uri: getThumbnail(item.thumbnail)}}
                    key={item.encodeId}
                    style={{
                      width: wp(15),
                      height: wp(15),
                    }}
                  />
                  <View className="flex-1">
                    <Text
                      numberOfLines={1}
                      style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4)}}
                      className="ml-2 font-semibold">
                      {item.title}
                    </Text>
                    <Text
                      className=" ml-2"
                      style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(3.5)}}>
                      {item.artistsNames}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            <View className="w-full justify-center items-center my-2">
              <TouchableOpacity
                style={{borderColor: COLOR.PRIMARY}}
                className="w-32 p-2 rounded-full items-center  border"
                onPress={() => {
                  navigation.push('ArtistsSong', {
                    id: dataDetailArtist?.id,
                    name: dataDetailArtist?.alias,
                  });
                }}>
                <Text style={{color: COLOR.TEXT_PRIMARY}} className=" text-sm">
                  Xem thêm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          'sectionId',
          'aAlbum',
        ) && (
          <View>
            <Text
              style={{color: COLOR.TEXT_PRIMARY}}
              className="text-lg font-semibold px-4 mb-4">
              Albums
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 10,
                minWidth: SCREEN_WIDTH,
              }}>
              {dataDetailArtist?.sections
                ?.filter((type: any) => type.sectionId === 'aAlbum')[0]
                ?.items.map((item: any, index: number) => (
                  <PlayListCover
                    isAlbum={true}
                    key={index}
                    encodeId={item.encodeId}
                    sortDescription={item.sortDescription}
                    title={item.title}
                    thumbnail={item.thumbnail}
                  />
                ))}
            </ScrollView>
          </View>
        )}

        {/* playlist */}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          'sectionId',
          'aPlaylist',
        ) && (
          <View>
            {dataDetailArtist?.sections
              ?.filter((type: any) => type.sectionId === 'aPlaylist')
              ?.map((item: any, index: number) => (
                <View key={index}>
                  <Text
                    style={{color: COLOR.TEXT_PRIMARY}}
                    className="text-lg font-semibold px-4 py-4">
                    {item.title}
                  </Text>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{
                      paddingHorizontal: 16,
                      gap: 10,
                      minWidth: SCREEN_WIDTH,
                    }}>
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
        )}

        {/* Single */}
        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          'sectionId',
          'aSingle',
        ) && (
          <View>
            <Text
              style={{color: COLOR.TEXT_PRIMARY}}
              className="text-lg font-semibold px-4 py-4">
              Đĩa đơn
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 10,
                minWidth: SCREEN_WIDTH,
              }}>
              {dataDetailArtist?.sections
                ?.filter((type: any) => type.sectionId === 'aSingle')[0]
                ?.items.map((item: any, index: number) => (
                  <PlayListCover
                    isAlbum
                    key={index}
                    encodeId={item.encodeId}
                    sortDescription={item.sortDescription}
                    title={item.title}
                    thumbnail={item.thumbnail}
                  />
                ))}
            </ScrollView>
          </View>
        )}

        {/* Relate artis */}

        {isKeyExistsInArrayObjects(
          dataDetailArtist?.sections,
          'sectionId',
          'aReArtist',
        ) && (
          <View>
            {dataDetailArtist?.sections?.filter(
              (type: any) => type.sectionId === 'aReArtist',
            )[0].items.length > 0 && (
              <Text
                className="text-lg font-semibold px-4 py-4"
                style={{color: COLOR.TEXT_PRIMARY}}>
                Có thể bạn thích
              </Text>
            )}
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
                      <Text
                        className=" text-center mt-2"
                        style={{color: COLOR.TEXT_PRIMARY}}>
                        {item.name}
                      </Text>
                      <Text
                        className=" text-center"
                        style={{color: COLOR.TEXT_SECONDARY}}>
                        {item.totalFollow} quan tâm
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        {/* info */}
        <View className="px-4 flex flex-col gap-2 py-4">
          <Text
            className=" text-lg font-semibold py-2"
            style={{color: COLOR.TEXT_PRIMARY}}>
            Thông tin
          </Text>
          <Text style={{color: COLOR.TEXT_SECONDARY}}>
            Tên thật: {dataDetailArtist?.realname}
          </Text>
          <Text style={{color: COLOR.TEXT_SECONDARY}}>
            Ngày sinh: {dataDetailArtist?.birthday || 'Không rõ'}
          </Text>

          <Text style={{color: COLOR.TEXT_SECONDARY}}>
            {dataDetailArtist?.sortBiography.replaceAll('<br>', '')}
          </Text>
          <Text style={{color: COLOR.TEXT_SECONDARY}}>
            {dataDetailArtist?.biography.replaceAll('<br>', '')}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ArtistScreens;
