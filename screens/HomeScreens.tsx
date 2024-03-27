import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import PlayListCover from '../components/PlayListCover';
import Header from '../components/Header';
import {usePlayerStore} from '../store/playerStore';
import nodejs from 'nodejs-mobile-react-native';
import {collection, onSnapshot, query} from 'firebase/firestore';
import {auth, db} from '../firebase/config';
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
  const [loading, setLoading] = useState<boolean>(true);
  const setLikedSongs = usePlayerStore(state => state.setLikedSongs);

  useEffect(() => {
    const q = query(collection(db, `users/${auth.currentUser?.uid}/likedSong`));
    const unsub = onSnapshot(q, querySnapshot => {
      const songs = [] as any;
      querySnapshot.forEach(doc => {
        songs.push(doc.data());
      });
      setLikedSongs(songs);
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener('home', data => {
      setdataHome(data);
      setLoading(false);
    });
    nodejs.channel.post('home');
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <ActivityIndicator size="large" color="#DA291C" />
      </View>
    );
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="bg-[#121212] h-full w-full pb-[200px] pt-[35px]">
      <Header />
      {dataHome &&
        dataHome.length > 0 &&
        dataHome?.map((e: any, index: number) => {
          return (
            <View key={index}>
              <View>
                <Text className="text-xl flex justify-between items-end mt-9 mb-3 uppercase mx-4 text-white">
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
