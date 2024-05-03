import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '../../../store/playerStore';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import useThemeStore from '../../../store/themeStore';
import {useUserStore} from '../../../store/userStore';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import useLibraryStore from '../../../store/useLibraryStore';
import getThumbnail from '../../../utils/getThumnail';
import Animated, {FadeIn} from 'react-native-reanimated';
import RenderPlaylistThumbnail from './RenderPlaylistThumnail';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import PlaylistManagerBottomSheet from '../../../components/bottom-sheet/PlaylistManagerBottomSheet';

const Playlist = () => {
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const {COLOR} = useThemeStore(state => state);
  const navigation = useNavigation<any>();
  const {viewType} = useLibraryStore();
  const {likedPlaylists, myPlaylists} = useUserStore();

  const playlistManagerRef = React.useRef<BottomSheetModal>(null);

  const [selectedPlaylistId, setSelectedPlaylistId] = React.useState<
    any | null
  >(null);

  const onLongPressPlaylist = (playList: any) => {
    setSelectedPlaylistId(playList);
    if (playlistManagerRef.current) {
      playlistManagerRef.current?.present();
    }
  };
  return (
    <ScrollView
      style={{flex: 1, marginHorizontal: 16, marginTop: 8}}
      className="pb-[200px]"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      {viewType === 'list' ? (
        <Animated.View entering={FadeIn.duration(1000)}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LikedSong', {
                type: 'favourite',
              });
            }}
            activeOpacity={0.8}
            className="flex-row items-center">
            <LinearGradient
              style={{
                width: widthPercentageToDP(18),
                height: widthPercentageToDP(18),
              }}
              colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
              className="justify-center items-center">
              <Entypo name="heart" size={36} color={COLOR.TEXT_PRIMARY} />
            </LinearGradient>
            <View style={{marginLeft: 10}}>
              <Text
                className="font-bold mb-[5px]"
                style={{color: COLOR.TEXT_PRIMARY}}>
                Bài hát đã thích
              </Text>
              <Text style={{color: COLOR.TEXT_SECONDARY}}>
                Danh sách phát • {likedSongs.length} bài hát
              </Text>
            </View>
          </TouchableOpacity>
          {myPlaylists.map(pl => {
            return (
              <TouchableOpacity
                delayLongPress={200}
                onLongPress={() => onLongPressPlaylist(pl)}
                key={pl.encodeId}
                onPress={() =>
                  navigation.push('MyPlaylist', {
                    playlistId: pl.encodeId,
                  })
                }
                activeOpacity={0.8}
                className="flex-row items-center mt-4">
                {pl.songs.length > 0 ? (
                  <RenderPlaylistThumbnail
                    songs={pl.songs}
                    playlistLength={pl.songs.length}
                    height={widthPercentageToDP(18)}
                    width={widthPercentageToDP(18)}
                  />
                ) : (
                  <Image
                    source={{uri: getThumbnail(pl?.thumbnail)}}
                    style={{
                      width: widthPercentageToDP(18),
                      height: widthPercentageToDP(18),
                    }}
                  />
                )}
                <View style={{marginLeft: 10}}>
                  <Text
                    className="font-bold mb-[5px]"
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {pl?.title}
                  </Text>
                  <Text style={{color: COLOR.TEXT_SECONDARY}}>
                    {`Danh sách phát • ${pl.songs.length} bài hát`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          {likedPlaylists.map(pl => {
            return (
              <TouchableOpacity
                key={pl.encodeId}
                onPress={() =>
                  navigation.push('PlayListDetail', {
                    data: {
                      playListId: pl.encodeId,
                      thumbnail: pl.thumbnail,
                    },
                  })
                }
                activeOpacity={0.8}
                className="flex-row items-center mt-4">
                <Image
                  source={{uri: getThumbnail(pl?.thumbnail)}}
                  style={{
                    width: widthPercentageToDP(18),
                    height: widthPercentageToDP(18),
                  }}
                />
                <View style={{marginLeft: 10}}>
                  <Text
                    className="font-bold mb-[5px]"
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {pl?.title}
                  </Text>
                  <Text style={{color: COLOR.TEXT_SECONDARY}}>
                    {pl.type === 'album'
                      ? 'Album'
                      : `Danh sách phát • ${pl.totalSong} bài hát`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeIn.duration(1000)}
          className="flex flex-row justify-between flex-wrap">
          <TouchableOpacity
            style={{width: widthPercentageToDP(33) - 16}}
            onPress={() => {
              navigation.navigate('LikedSong', {
                type: 'favourite',
              });
            }}
            activeOpacity={0.8}
            className="flex-col items-center flex mb-4">
            <LinearGradient
              style={{
                width: widthPercentageToDP(33) - 16,
                height: widthPercentageToDP(33) - 16,
              }}
              colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
              className="justify-center items-center">
              <Entypo name="heart" size={48} color={COLOR.TEXT_PRIMARY} />
            </LinearGradient>
            <View>
              <Text
                className="font-bold"
                style={{color: COLOR.TEXT_PRIMARY}}
                numberOfLines={2}>
                Bài hát đã thích
              </Text>
              <Text style={{color: COLOR.TEXT_SECONDARY}} numberOfLines={1}>
                Danh sách phát • {likedSongs.length} bài hát
              </Text>
            </View>
          </TouchableOpacity>
          {myPlaylists.map(pl => {
            return (
              <TouchableOpacity
                delayLongPress={200}
                onLongPress={() => onLongPressPlaylist(pl)}
                style={{width: widthPercentageToDP(33) - 16}}
                key={pl.encodeId}
                onPress={() =>
                  navigation.push('MyPlaylist', {
                    playlistId: pl.encodeId,
                  })
                }
                activeOpacity={0.8}
                className="flex-col flex mb-4 items-center">
                {pl.songs.length > 0 ? (
                  <RenderPlaylistThumbnail
                    songs={pl.songs}
                    playlistLength={pl.songs.length}
                    height={widthPercentageToDP(33) - 16}
                    width={widthPercentageToDP(33) - 16}
                  />
                ) : (
                  <Image
                    source={{uri: getThumbnail(pl?.thumbnail)}}
                    style={{
                      width: widthPercentageToDP(33) - 16,
                      height: widthPercentageToDP(33) - 16,
                    }}
                  />
                )}
                <View>
                  <Text
                    numberOfLines={2}
                    className="font-semibold"
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {pl?.title}
                  </Text>
                  <Text style={{color: COLOR.TEXT_SECONDARY}} numberOfLines={1}>
                    Danh sách phát • {pl.songs.length} bài hát
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          {likedPlaylists.map(pl => {
            return (
              <TouchableOpacity
                style={{width: widthPercentageToDP(33) - 16}}
                key={pl.encodeId}
                onPress={() =>
                  navigation.push('PlayListDetail', {
                    data: {
                      playListId: pl.encodeId,
                      thumbnail: pl.thumbnail,
                    },
                  })
                }
                activeOpacity={0.8}
                className="flex-col flex mb-4 items-center">
                <Image
                  source={{uri: getThumbnail(pl?.thumbnail)}}
                  style={{
                    width: widthPercentageToDP(33) - 16,
                    height: widthPercentageToDP(33) - 16,
                  }}
                />
                <View>
                  <Text
                    numberOfLines={2}
                    className="font-semibold"
                    style={{color: COLOR.TEXT_PRIMARY}}>
                    {pl?.title}
                  </Text>
                  <Text style={{color: COLOR.TEXT_SECONDARY}} numberOfLines={1}>
                    {pl.type === 'album' ? 'Album' : `Danh sách phát`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          {likedPlaylists.length % 3 !== 0 && (
            <TouchableOpacity
              style={{width: widthPercentageToDP(33) - 16}}
              activeOpacity={0.8}
              className="flex-col items-center flex my-1"
            />
          )}
        </Animated.View>
      )}
      <PlaylistManagerBottomSheet
        playlist={selectedPlaylistId}
        ref={playlistManagerRef}
      />
    </ScrollView>
  );
};

export default Playlist;
