import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LocalSong from './components/LocalSong';
import Playlist from './components/Playlist';
import useThemeStore from '../../store/themeStore';
import FollowedArtist from './components/FollowedArtists';
import {ScrollView} from 'react-native-gesture-handler';
import tinycolor from 'tinycolor2';
import {Octicons} from '@expo/vector-icons';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import useLibraryStore from '../../store/useLibraryStore';
import {collection, onSnapshot, query} from 'firebase/firestore';
import {auth, db} from '../../firebase/config';
import {usePlayerStore} from '../../store/playerStore';
import {useUserStore} from '../../store/userStore';
const LibrarySrceens = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const {COLOR} = useThemeStore();
  const {viewType, setViewType} = useLibraryStore();
  const {setLikedSongs} = usePlayerStore();
  const {setListFollowArtists, setLikedPlaylists} = useUserStore();

  useEffect(() => {
    const q = query(collection(db, `users/${auth.currentUser?.uid}/likedSong`));
    const unsub = onSnapshot(q, querySnapshot => {
      const songs = [] as any;
      querySnapshot.forEach(doc => {
        songs.push(doc.data());
      });
      setLikedSongs(songs);
    });
    const q1 = query(
      collection(db, `users/${auth.currentUser?.uid}/followedArtist`),
    );
    const unsub1 = onSnapshot(q1, querySnapshot => {
      const followedArtists = [] as any;
      querySnapshot.forEach(doc => {
        followedArtists.push(doc.data());
      });
      setListFollowArtists(followedArtists);
    });
    const q2 = query(
      collection(db, `users/${auth.currentUser?.uid}/likedPlaylists`),
    );
    const unsub2 = onSnapshot(q2, querySnapshot => {
      const likedPlaylists = [] as any;
      querySnapshot.forEach(doc => {
        likedPlaylists.push(doc.data());
      });
      setLikedPlaylists(likedPlaylists);
    });
    return () => {
      unsub();
      unsub1();
      unsub2();
    };
  }, []);
  return (
    <View style={{...styles.container, backgroundColor: COLOR.BACKGROUND}}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <Image
            resizeMode="cover"
            style={styles.avatar}
            source={require('../../assets/evil.png')}
          />
          <Text style={{...styles.txt, color: COLOR.TEXT_PRIMARY}}>
            Thư viện
          </Text>
        </View>
        <TouchableOpacity>
          <AntDesign
            name="plus"
            size={24}
            style={{color: COLOR.TEXT_PRIMARY, ...styles.plusIcon}}
          />
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 10,
            minWidth: widthPercentageToDP(100),
          }}>
          {['Danh sách phát', 'Nghệ sĩ', 'Đã tải xuống'].map((item, index) => (
            <TouchableOpacity
              onPress={() => setSelectedTab(index)}
              key={index}
              style={{
                backgroundColor:
                  selectedTab === index
                    ? COLOR.PRIMARY
                    : !COLOR.isDark
                    ? tinycolor(COLOR.BACKGROUND).darken(10).toString()
                    : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
              }}
              className="items-center justify-center rounded-full px-2 py-1">
              <Text style={{color: COLOR.TEXT_PRIMARY}}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View className="flex flex-row justify-end px-4 items-center py-2">
          <TouchableOpacity
            onPress={() => {
              setViewType(viewType === 'grid' ? 'list' : 'grid');
            }}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            {viewType === 'list' ? (
              <Octicons name="apps" size={18} color={COLOR.TEXT_PRIMARY} />
            ) : (
              <Octicons
                name="list-unordered"
                size={18}
                color={COLOR.TEXT_PRIMARY}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className=" flex-1" showsVerticalScrollIndicator={false}>
        {selectedTab === 0 && <Playlist />}
        {selectedTab === 1 && <FollowedArtist />}
        {selectedTab === 2 && <LocalSong />}
      </ScrollView>
    </View>
  );
};

export default LibrarySrceens;
const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    flex: 1,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  top: {
    height: 65,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontWeight: 'bold',
    fontSize: 24,

    marginLeft: 16,
  },
  plusIcon: {},
});
