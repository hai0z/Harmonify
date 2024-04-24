import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PlayListCover from '../../components/PlayListCover';
import Header from '../../components/Header';
import nodejs from 'nodejs-mobile-react-native';
import NewRelease from './components/NewRelease';
import LinearGradient from 'react-native-linear-gradient';
import useThemeStore from '../../store/themeStore';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RecentList from './components/RecentList';
import {getRecentListening} from '../../service/firebase';
import {collection, onSnapshot, query} from 'firebase/firestore';
import {auth, db} from '../../firebase/config';
import {usePlayerStore} from '../../store/playerStore';
import {useUserStore} from '../../store/userStore';
interface typePlaylistCover {
  items: [];
  title: string;
  encodeId: string;
  thumbnail: string;
  sortDescription: string;
  sectionId: string;
}

function HomeScreens() {
  const [dataHome, setdataHome] = useState<any>([]);
  const [dataNewRelease, setDataNewRelease] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {COLOR, HEADER_GRADIENT} = useThemeStore(state => state);
  const [dataRecent, setDataRecent] = useState<any>([]);
  const {setLikedSongs} = usePlayerStore();
  const {setListFollowArtists} = useUserStore();
  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener('home', data => {
      setdataHome(data.filter((e: any) => e.sectionType === 'playlist'));
      setDataNewRelease(
        data.filter((e: any) => e.sectionType === 'new-release')[0],
      );
    });
    const getRecentList = async () => {
      const res = await getRecentListening();
      setDataRecent(res);
      setLoading(false);
    };
    Promise.all([getRecentList(), nodejs.channel.post('home')]);
  }, []);

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

    return () => {
      unsub();
      unsub1();
    };
  }, []);

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center "
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      </View>
    );
  }
  const timeColor = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return HEADER_GRADIENT.MORNING;
    } else if (hour < 18) {
      return HEADER_GRADIENT.AFTERNOON;
    } else {
      return HEADER_GRADIENT.EVENING;
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className=" h-full w-full pb-[200px]"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Header />
      <View
        className="top-0"
        style={[StyleSheet.absoluteFill, {height: hp(45)}]}>
        <LinearGradient
          colors={[timeColor(), `${timeColor()}50`, COLOR.BACKGROUND]}
          className="h-full"
        />
      </View>
      <View>
        <RecentList data={dataRecent} />
      </View>
      <View className="mt-4">
        {dataNewRelease && <NewRelease data={dataNewRelease} />}
      </View>

      <View className="-mt-6">
        {dataHome?.map((e: any, index: number) => {
          return (
            <View key={index}>
              <View>
                <Text
                  className="text-xl flex justify-between items-end mt-8 mb-3 uppercase mx-4 "
                  style={{color: COLOR.TEXT_PRIMARY}}>
                  {e.title === '' ? e.sectionId.slice(1) : e.title}
                </Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{gap: 10, paddingHorizontal: 16}}>
                {e.items.map((element: typePlaylistCover, index: number) => (
                  <PlayListCover
                    key={index}
                    title={element.title}
                    encodeId={`${element.encodeId}`}
                    thumbnail={element.thumbnail}
                    sortDescription={element.sortDescription}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}
      </View>
      <View className="h-48"></View>
    </ScrollView>
  );
}

export default HomeScreens;
