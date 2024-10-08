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
import React, {useContext, useEffect, useMemo, useState} from 'react';

import {handlePlay, objectToTrack} from '../../service/trackPlayerService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';
import useThemeStore from '../../store/themeStore';
import {usePlayerStore} from '../../store/playerStore';
import LinearGradient from 'react-native-linear-gradient';
import getThumbnail from '../../utils/getThumnail';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {followArtist} from '../../service/firebase';
import {useUserStore} from '../../store/userStore';
import Loading from '../../components/Loading';
import TrackItem from '../../components/track-item/TrackItem';
import {PlayerContext} from '../../context/PlayerProvider';
import {FlashList} from '@shopify/flash-list';
import {navigation} from '../../utils/types/RootStackParamList';
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

function isKeyExistsInArrayObjects(arr: any, key: any, value: any) {
  for (let obj of arr) {
    if (obj.hasOwnProperty(key) && obj[key] === value) {
      return true;
    }
  }
  return false;
}

const ArtistScreens = ({route}: any) => {
  const {name} = route.params;

  const [loading, setLoading] = React.useState(true);

  const [dataDetailArtist, setDataDetailArtist] = useState<artistType>();

  const COLOR = useThemeStore(state => state.COLOR);

  const {listFollowArtists} = useUserStore();

  const {showBottomSheet} = useContext(PlayerContext);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const currentSong = usePlayerStore(state => state.currentSong);

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener('getArtist', (data: any) => {
      setDataDetailArtist(data);
      setLoading(false);
    });
    scrollY.setValue(0);
    nodejs.channel.post('getArtist', name);
  }, [name]);

  const topSong = useMemo(
    () =>
      dataDetailArtist?.sections
        ?.filter((type: any) => type.sectionId === 'aSongs')[0]
        ?.items.filter((i: any) => i.streamingStatus === 1)
        .slice(0, 5),
    [dataDetailArtist],
  );

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

  const navigation = useNavigation<navigation<'Artists' | 'ArtistsSong'>>();

  if (loading) {
    return (
      <View
        style={{backgroundColor: COLOR.BACKGROUND}}
        className="flex-1 items-center justify-center">
        <Loading />
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
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 200}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        <View className="relative" style={{height: SCREEN_WIDTH}}>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
                zIndex: 3,
              },
              {
                backgroundColor: COLOR.BACKGROUND + '35',
              },
            ]}
          />
          <LinearGradient
            colors={['transparent', COLOR.BACKGROUND]}
            className="absolute left-0 right-0 bottom-0 z-10"
            style={{
              height: 200,
              width: SCREEN_WIDTH,
            }}
          />
          <Animated.Image
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
                fontFamily: 'SVN-Gotham Black',
                fontSize: wp(10),
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
                  : 'transparent',
              }}
              className="w-32 p-2 rounded-full items-center  border mx-4"
              onPress={() =>
                followArtist({
                  thumbnailM: dataDetailArtist?.thumbnailM,
                  name: dataDetailArtist?.name,
                  id: dataDetailArtist?.id,
                  alias: dataDetailArtist?.alias,
                  totalFollow: dataDetailArtist?.totalFollow,
                })
              }>
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
            <View style={{minHeight: 3}}>
              <FlashList
                estimatedItemSize={70}
                extraData={currentSong?.id}
                data={topSong}
                renderItem={({item}: any) => {
                  return (
                    <TrackItem
                      isActive={currentSong?.id === item.encodeId}
                      showBottomSheet={showBottomSheet}
                      item={item}
                      key={item.encodeId}
                      onClick={() => {
                        handlePlay(item, {
                          id: name,
                          items: dataDetailArtist?.sections
                            .filter(
                              (type: any) => type.sectionId === 'aSongs',
                            )[0]
                            .items.filter((i: any) => i.streamingStatus === 1),
                        });
                        setPlayFrom({
                          id: 'artist',
                          name: dataDetailArtist?.name!,
                        });
                      }}
                    />
                  );
                }}
              />
            </View>
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
