import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import useThemeStore from '../../store/themeStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useUserStore} from '../../store/userStore';
import {addSongToPlaylist} from '../../service/firebase';
import RenderPlaylistThumbnail from '../library/components/RenderPlaylistThumnail';
import getThumbnail from '../../utils/getThumnail';
import CheckBox from './components/CheckBox';
import {usePlayerStore} from '../../store/playerStore';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import useToggleLikeSong from '../../hooks/useToggleLikeSong';
import {GREEN} from '../../constants';

const AddToPlaylist = ({route}: {route: any}) => {
  const {song} = route.params;
  const {COLOR, theme} = useThemeStore();
  const navigation = useNavigation<any>();
  const {myPlaylists} = useUserStore();
  const {likedSongs} = usePlayerStore();

  const [likedSongSelected, setLikedSongSelected] = React.useState(false);

  const {handleAddToLikedList} = useToggleLikeSong();

  const playlistIncluded = myPlaylists.filter((pl: any) =>
    pl.songs.find((s: any) => s.encodeId == song.encodeId),
  );

  const likedSongIncluded = likedSongs.some(
    (s: any) => s.encodeId == song.encodeId,
  );

  console.log({likedSongIncluded});
  const playListNotIncluded = myPlaylists.filter(
    (pl: any) => !pl.songs.find((s: any) => s.encodeId == song.encodeId),
  );

  const [selectedPlaylistId, setSelectedPlaylistId] = React.useState<string[]>(
    [],
  );

  const handleAddToPlaylist = async () => {
    try {
      if (selectedPlaylistId.length == 0 && !likedSongSelected) {
        navigation.goBack();
        return;
      }
      if (likedSongSelected) {
        handleAddToLikedList(song);
        navigation.goBack();
      }
      if (selectedPlaylistId.length > 0) {
        const promise = [];
        for (const id of selectedPlaylistId) {
          promise.push(addSongToPlaylist(id, song));
        }
        await Promise.all(promise).then(() => {
          setSelectedPlaylistId([]);
        });
        ToastAndroid.show('Đã thêm vào danh sách phát', ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Thất bại', 'Có lỗi xảy ra');
    }
  };
  const handleSelectPlaylist = (id: string) => {
    if (selectedPlaylistId.includes(id)) {
      setSelectedPlaylistId(selectedPlaylistId.filter(item => item !== id));
    } else {
      setSelectedPlaylistId([...selectedPlaylistId, id]);
    }
  };
  return (
    <View
      className="flex-1 pt-[55px] px-4"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <View className="flex flex-row justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          style={{
            color: COLOR.TEXT_PRIMARY,
            fontWeight: 'bold',
            fontSize: widthPercentageToDP(5),
          }}>
          Thêm vào danh sách phát
        </Text>
        <View className="w-4"></View>
      </View>
      <View className="justify-center items-center mt-6 flex mb-6">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreatePlaylist')}
          className="py-3 rounded-full px-6"
          style={{backgroundColor: theme === 'amoled' ? GREEN : COLOR.PRIMARY}}>
          <Text
            style={{
              color: COLOR.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(4),
              fontWeight: 'bold',
            }}>
            Danh sách phát mới
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {(playlistIncluded.length > 0 || likedSongIncluded) && (
          <View className="mb-4">
            <Text
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontSize: widthPercentageToDP(4),
              }}
              className="font-bold">
              Đã lưu vào
            </Text>
            {likedSongIncluded && (
              <TouchableOpacity
                disabled
                activeOpacity={0.8}
                className="flex-row items-center mt-4">
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
                <View className="ml-auto">
                  <CheckBox isChecked={true} />
                </View>
              </TouchableOpacity>
            )}
            {playlistIncluded.map(pl => (
              <TouchableOpacity
                key={pl.encodeId}
                disabled
                activeOpacity={1}
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
                <View className="ml-auto">
                  <CheckBox isChecked={true} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {playListNotIncluded.length > 0 && (
          <View>
            <Text
              style={{
                color: COLOR.TEXT_PRIMARY,
                fontSize: widthPercentageToDP(4),
              }}
              className="font-bold">
              Danh sách phát của bạn
            </Text>
            {!likedSongIncluded && (
              <TouchableOpacity
                onPress={() => {
                  setLikedSongSelected(!likedSongSelected);
                }}
                activeOpacity={0.8}
                className="flex-row items-center mt-4">
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
                <View className="ml-auto">
                  <CheckBox isChecked={likedSongSelected} />
                </View>
              </TouchableOpacity>
            )}
            {playListNotIncluded.map(pl => (
              <TouchableOpacity
                key={pl.encodeId}
                onPress={() => handleSelectPlaylist(pl.encodeId)}
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
                <View className="ml-auto">
                  <CheckBox
                    isChecked={selectedPlaylistId.includes(pl.encodeId)}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <View className="items-center justify-end py-4">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddToPlaylist}
          className="py-4 rounded-full px-8"
          style={{backgroundColor: theme === 'amoled' ? GREEN : COLOR.PRIMARY}}>
          <Text
            style={{
              color: COLOR.TEXT_PRIMARY,
              fontSize: widthPercentageToDP(4.5),
              fontWeight: 'bold',
            }}>
            {' '}
            Xong
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddToPlaylist;
