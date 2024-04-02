import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {usePlayerStore} from '../../../store/playerStore';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import useThemeStore from '../../../store/themeStore';

const Playlist = () => {
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const {COLOR} = useThemeStore(state => state);
  const navigation = useNavigation<any>();
  return (
    <View style={{flex: 1, marginHorizontal: 16, marginTop: 20}}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('LikedSong', {
            type: 'favourite',
          });
        }}
        activeOpacity={0.8}
        className="flex-row items-center">
        <LinearGradient
          colors={[COLOR.PRIMARY, COLOR.SECONDARY]}
          className="w-16 h-16 justify-center items-center">
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
      {/* {playList.map((pl: IPlayList) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ListFavourite', {
                  type: 'playlist',
                  playlistName: pl.name,
                })
              }
              onLongPress={() => handleShowPlaylistManage(pl.name)}
              key={pl.name}
              className="flex-row items-center pt-2">
              <View
                // colors={["blue", "#bdbdbd"]}
                className="w-20 h-20 justify-center items-center">
                <Entypo name="heart" size={36} color="#fff" />
              </View>
              <View style={{marginLeft: 10}}>
                <Text className="text-white font-bold mb-[5px]">{pl.name}</Text>
                <Text style={{color: '#bdbdbd'}}>Danh sách phát</Text>
              </View>
            </TouchableOpacity>
          );
        })} */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 35,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },
  top: {
    height: 65,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
    marginLeft: 10,
  },
  plusIcon: {
    color: '#bdbdbd',
  },
});
export default Playlist;
