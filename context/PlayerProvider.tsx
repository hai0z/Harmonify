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

nodejs.channel.addListener("getLyric", async data => {
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

  const getSongColors = async () => {
    if (currentSong?.artwork !== null) {
      getColors(getThumbnail(currentSong?.artwork!, 720), {
        fallback: "#0098DB",
        cache: true,
        key: currentSong?.id,
      }).then(setColor);
    }
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const setData = useBottomSheetStore(state => state.setData);

  const showBottomSheet = useCallback((item: any) => {
    bottomSheetModalRef.current?.present();
    setData(item);
  }, []);

  Appearance.setColorScheme(COLOR.isDark ? "dark" : "light");

  const initPlayer = async () => {
    if (offlineMode) {
      setHomeLoading(false);
    }
    if (savePlayerState) {
      await TrackPlayer.reset();
      setShuffleMode(false);
      !offlineMode && setHomeLoading(true);
      setIsFistInit(true);
      setisLoadingTrack(true);
      setSleepTimer(null);
      if (
        playList.items.length > 0 &&
        playList.id !== "" &&
        currentSong !== null
      ) {
        let index = playList.items.findIndex(
          (item: any) => item?.encodeId === currentSong?.id
        );
        if (index < 0) {
          index = 0;
        }
        if (!isPlayFromLocal) {
          await TrackPlayer.setQueue(
            playList.items.map((item: any) => objectToTrack(item))
          );
        } else {
          await TrackPlayer.setQueue(
            playList.items.map((item: any) => ({
              ...objectToTrack(item),
              url: item.url,
              artwork: item.thumbnail || DEFAULT_IMG,
            }))
          );
        }
        await TrackPlayer.skip(index).finally(() => {
          setisLoadingTrack(false);
        });
      }
    } else {
      await TrackPlayer.reset();
      setIsFistInit(false);
      setCurrentSong(null);
      setLastPosition(0);
      setisLoadingTrack(false);
    }
  };

  useEffect(() => {
    initPlayer().then(() => {
      SplashScreen.hide();
    });
  }, []);

  useEffect(() => {
    if (!isPlayFromLocal) {
      Promise.all([
        nodejs.channel.post("getLyric", currentSong?.id),
        getSongColors(),
      ]);
    }
  }, [currentSong?.id]);

  useEffect(() => {
    saveHistory && saveToHistory(tempSong);
  }, [tempSong?.encodeId]);

  return (
    <PlayerContext.Provider
      value={{
        bottomSheetModalRef,
        showBottomSheet,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
