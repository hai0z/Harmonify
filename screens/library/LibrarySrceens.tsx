import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import {usePlayerStore} from '../../store/playerStore';

const LibrarySrceens = () => {
  const navigation = useNavigation<any>();

  const likedSongs = usePlayerStore(state => state.likedSongs);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <Image
            resizeMode="cover"
            style={styles.avatar}
            source={{
              uri: 'https://timanhdep.com/wp-content/uploads/2022/06/hinh-avatar-anime-nu-de-thuong-cuc-cute-06.jpg',
            }}
          />
          <Text style={styles.txt}>Thư viện</Text>
        </View>
        <TouchableOpacity>
          <AntDesign name="plus" size={24} style={styles.plusIcon} />
        </TouchableOpacity>
      </View>
      <View className="h-10 flex-row items-center">
        {['Danh sách phát', 'Nghệ sĩ'].map((item, index) => (
          <View
            key={index}
            style={{borderColor: '#dbdbdb'}}
            className="h-[30px] items-center justify-center mx-[7px] px-[15px] rounded-[12px] border">
            <Text style={{color: '#fff'}}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={{flex: 1, marginHorizontal: 10, marginTop: 20}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LikedSong', {
              type: 'favourite',
            });
          }}
          activeOpacity={0.8}
          className="flex-row items-center">
          <LinearGradient
            colors={['blue', '#bdbdbd']}
            className="w-20 h-20 justify-center items-center">
            <Entypo name="heart" size={36} color="#fff" />
          </LinearGradient>
          <View style={{marginLeft: 10}}>
            <Text className="text-white font-bold mb-[5px]">
              Bài hát đã thích
            </Text>
            <Text style={{color: '#bdbdbd'}}>
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
      {/* <AddPlayListModal visible={modalVisible} onClose={handleCloseModal} /> */}
      {/* <PlayListManage
        visible={PlayListManageVisible}
        playListName={selectedPlaylist}
        onClose={() => setPlayListManageVisible(false)}
      /> */}
    </View>
  );
};

export default LibrarySrceens;
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
