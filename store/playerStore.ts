import { Track } from "react-native-track-player";
import { create } from "zustand";
import useThemeStore from "./themeStore";

const defaultColor = useThemeStore().theme === 'dark' ? '#494949' : '#ffffff';

export const defaultColorObj = {
  average: defaultColor,
  darkMuted: defaultColor,
  darkVibrant: defaultColor,
  dominant: defaultColor,
  lightMuted: defaultColor,
  lightVibrant: defaultColor,
  muted: defaultColor,
  platform: "android",
  vibrant: defaultColor,
}
export interface IPlaylist {
  id: string,
  items: any[]
}
export interface Color {
  average: string;
  darkMuted: string;
  darkVibrant: string;
  dominant: string;
  lightMuted: string;
  lightVibrant: string;
  muted: string;
  platform: string;
  vibrant: string;
}
interface PlayerStore {
  color: Partial<Color>,
  playList: IPlaylist,
  setColor: (color: Partial<Color>) => void,
  setPlayList: (playlist: IPlaylist) => void,
  lyrics: any[],
  setLyrics: (lyrics: any) => void
  isLoadingTrack: boolean,
  setisLoadingTrack: (isLoadingTrack: boolean) => void,
  likedSongs: any,
  setLikedSongs: (likedSongs: any) => void
  currentSong: Track | null
  setCurrentSong: (currentSong: Track | null) => void
  tempSong: any | null
  setTempSong: (tempSong: any | null) => void
  isPlayFromLocal: boolean
  setIsPlayFromLocal: (isPlayFromLocal: boolean) => void
}
export const usePlayerStore = create<PlayerStore>((set) => ({
  playList: {
    id: "",
    items: [],
  },
  color: defaultColorObj as Partial<Color>,
  setColor: (color: Partial<Color>) => set({ color }),
  setPlayList: (playlist: IPlaylist) => set({ playList: playlist }),
  lyrics: [],
  setLyrics: (lyrics: any) => set({ lyrics }),
  isLoadingTrack: false,
  setisLoadingTrack: (isLoadingTrack: boolean) => set({ isLoadingTrack }),
  likedSongs: [],
  setLikedSongs: (likedSongs: any) => set({ likedSongs }),
  currentSong: null,
  setCurrentSong: (currentSong: Track | null) => set({ currentSong }),
  tempSong: null,
  setTempSong: (tempSong: any | null) => set({ tempSong }),
  isPlayFromLocal: false,
  setIsPlayFromLocal: (isPlayFromLocal: boolean) => set({ isPlayFromLocal }),
}))

