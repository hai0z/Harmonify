import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PlayListCover from '../../components/PlayListCover';
import Header from '../../components/Header';
import {usePlayerStore} from '../../store/playerStore';
import nodejs from 'nodejs-mobile-react-native';
import {collection, onSnapshot, query} from 'firebase/firestore';
import {auth, db} from '../../firebase/config';
import NewRelease from './components/NewRelease';
import LinearGradient from 'react-native-linear-gradient';
import useThemeStore from '../../store/themeStore';
import {getData, storeData} from '../../utils/localStorage';
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
  const {setLikedSongs, setPlayFrom} = usePlayerStore(state => state);
  const {COLOR, HEADER_GRADIENT} = useThemeStore(state => state);

  const getPlayFrom = async () => {
    const playFrom = await getData('playFrom');
    setPlayFrom(playFrom);
  };
  useEffect(() => {
    const q = query(collection(db, `users/${auth.currentUser?.uid}/likedSong`));
    const unsub = onSnapshot(q, querySnapshot => {
      const songs = [] as any;
      querySnapshot.forEach(doc => {
        songs.push(doc.data());
      });
      setLikedSongs(songs);
    });
    getPlayFrom();

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener('home', data => {
      setdataHome(data.filter((e: any) => e.sectionType === 'playlist'));
      setDataNewRelease(
        data.filter((e: any) => e.sectionType === 'new-release')[0],
      );
      setLoading(false);
    });
    nodejs.channel.post('home');
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
      <View className="h-56 top-0" style={[StyleSheet.absoluteFill]}>
        <LinearGradient
          colors={[timeColor(), `${timeColor()}50`, COLOR.BACKGROUND]}
          className="h-full"
        />
      </View>

      <View style={{minHeight: 3}}>
        {dataNewRelease && <NewRelease data={dataNewRelease} />}
      </View>

      {dataHome?.map((e: any, index: number) => {
        return (
          <View key={index}>
            <View>
              <Text
                className="text-xl flex justify-between items-end mt-9 mb-3 uppercase mx-4 "
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
      <View className="h-48"></View>
    </ScrollView>
  );
}

export default HomeScreens;
