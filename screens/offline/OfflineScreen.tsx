import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import useThemeStore from '../../store/themeStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {StatusBar} from 'expo-status-bar';
import Header from '../../components/Header';
import useGetLocalSong from '../../hooks/useGetLocalSong';
import Loading from '../../components/Loading';
import LocalTrackItem from '../../components/LocalTrackItem';
import MiniPlayer from '../../components/Player/MiniPlayer';
import {handlePlaySongInLocal} from '../../service/trackPlayerService';
import {usePlayerStore} from '../../store/playerStore';
import {GREEN} from '../../constants';
import Animated, {FadeIn} from 'react-native-reanimated';
const OfflineScreen = () => {
  const {theme, COLOR, HEADER_GRADIENT} = useThemeStore();

  const {isLoading, localSong} = useGetLocalSong();

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const playListId = useMemo(() => Math.random().toString(36).substring(7), []);

  const currentSong = usePlayerStore(state => state.currentSong);

  const handlePlaySong = useCallback(
    (song: any) => {
      handlePlaySongInLocal(song, {
        id: playListId,
        items: localSong,
      });
      setPlayFrom({
        id: 'local',
        name: 'Bài hát trên thiết bị',
      });
    },
    [localSong],
  );
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
    <Animated.View
      entering={FadeIn.duration(500)}
      className="flex-1 h-full w-full flex"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Header />
      <StatusBar
        backgroundColor={`transparent`}
        style={COLOR.isDark ? 'light' : 'dark'}
      />
      <View
        className="top-0"
        style={[StyleSheet.absoluteFill, {height: hp(45)}]}>
        <LinearGradient
          colors={[timeColor(), `${timeColor()}50`, COLOR.BACKGROUND]}
          className="h-full"
        />
      </View>
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Loading />
          <Text
            style={{
              color: theme === 'amoled' ? GREEN : COLOR.PRIMARY,
              fontWeight: 'bold',
            }}>
            Offline Mode
          </Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {localSong.map((song: any) => (
              <LocalTrackItem
                isActive={currentSong?.id === song?.encodeId}
                item={song}
                onClick={() => handlePlaySong(song)}
                key={song?.encodeId}
              />
            ))}
            <View className="h-24"></View>
          </ScrollView>
          <View className="h-10 flex justify-center">
            <MiniPlayer />
            <Text
              className="text-center mt-1"
              style={{
                color: theme === 'amoled' ? GREEN : COLOR.PRIMARY,
                fontWeight: 'bold',
              }}>
              Offline Mode
            </Text>
          </View>
        </>
      )}
    </Animated.View>
  );
};

export default OfflineScreen;
