import React, {useCallback, useEffect, useRef} from "react";
import {usePlayerStore} from "../store/playerStore";
import {getColors} from "react-native-image-colors";
import TrackPlayer from "react-native-track-player";
import nodejs from "nodejs-mobile-react-native";
import {objectToTrack} from "../service/trackPlayerService";
import getThumbnail from "../utils/getThumnail";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import useBottomSheetStore from "../store/bottomSheetStore";
import {saveToHistory} from "../service/firebase";
import {Appearance} from "react-native";
import useThemeStore from "../store/themeStore";
import {DEFAULT_IMG} from "../constants";
import SplashScreen from "react-native-splash-screen";

interface ContextType {
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  showBottomSheet: (item: any) => void;
}

export const PlayerContext = React.createContext({} as ContextType);

nodejs.start("main.js");

nodejs.channel.addListener("getLyric", data => {
  usePlayerStore.getState().setLyrics(data);
});

const PlayerProvider = ({children}: {children: React.ReactNode}) => {
  const {
    playList,
    currentSong,
    isPlayFromLocal,
    saveHistory,
    tempSong,
    savePlayerState,
    offlineMode,
    setColor,
    setisLoadingTrack,
    setSleepTimer,
    setCurrentSong,
    setIsFistInit,
    setLastPosition,
    setHomeLoading,
    setShuffleMode,
  } = usePlayerStore();

  const COLOR = useThemeStore(state => state.COLOR);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const getSongColors = useCallback(async () => {
    if (!currentSong?.artwork) return;

    const colors = await getColors(getThumbnail(currentSong.artwork, 720), {
      fallback: "#0098DB",
      cache: true,
      key: currentSong.id,
    });
    setColor(colors);
  }, [currentSong?.artwork, currentSong?.id]);

  const showBottomSheet = useCallback((item: any) => {
    bottomSheetModalRef.current?.present();
    useBottomSheetStore.getState().setData(item);
  }, []);

  const initPlayer = useCallback(async () => {
    await TrackPlayer.reset();
    setShuffleMode(false);
    setSleepTimer(null);

    if (offlineMode) {
      setHomeLoading(false);
    } else {
      setHomeLoading(true);
    }

    if (!savePlayerState) {
      setIsFistInit(false);
      setCurrentSong(null);
      setLastPosition(0);
      setisLoadingTrack(false);
      return;
    }

    if (!playList.items.length || !playList.id || !currentSong) {
      setisLoadingTrack(false);
      return;
    }

    setIsFistInit(true);
    setisLoadingTrack(true);

    const index = Math.max(
      0,
      playList.items.findIndex(
        (item: any) => item?.encodeId === currentSong?.id
      )
    );

    const queue = playList.items.map((item: any) => ({
      ...objectToTrack(item),
      ...(isPlayFromLocal && {
        url: item.url,
        artwork: item.thumbnail || DEFAULT_IMG,
      }),
    }));

    await TrackPlayer.setQueue(queue);
    await TrackPlayer.skip(index);
    setisLoadingTrack(false);
  }, [playList, currentSong, isPlayFromLocal, savePlayerState, offlineMode]);

  useEffect(() => {
    initPlayer().then(() => SplashScreen.hide());
  }, []);

  useEffect(() => {
    if (!isPlayFromLocal && currentSong?.id) {
      nodejs.channel.post("getLyric", currentSong.id);
      getSongColors();
    }
  }, [currentSong?.id, isPlayFromLocal, getSongColors]);

  useEffect(() => {
    if (saveHistory && tempSong?.encodeId) {
      saveToHistory(tempSong);
    }
  }, [tempSong?.encodeId, saveHistory]);

  useEffect(() => {
    Appearance.setColorScheme(COLOR.isDark ? "dark" : "light");
  }, [COLOR.isDark]);

  return (
    <PlayerContext.Provider value={{bottomSheetModalRef, showBottomSheet}}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
