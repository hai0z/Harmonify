import { Track } from "react-native-track-player";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import zustandStorage from "./zustandStorage";

const defaultColor = "#494949"

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
  items: any[],
  isAlbum?: boolean
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

type PlayFrom = "local" | "search" | "playlist" | "liked" | "album" | "artist" | "chart" | "history"

export const playFromMapping = {
  "local": "Hệ thống",
  "search": "Tìm kiếm",
  "playlist": "Danh sách phát",
  "liked": "Thư viện",
  "album": "Album",
  "artist": "Nghệ sĩ",
  "chart": "Bảng xếp hạng",
  "history": "Lịch sử nghe"
}

export interface IPLayFrom {
  id: PlayFrom
  name: string
}

interface PlayerStore {
  playFrom: IPLayFrom,
  setPlayFrom: (playFrom: IPLayFrom) => void
  color: Partial<Color>,
  playList: IPlaylist,
  setColor: (color: Partial<Color>) => void,
  setPlayList: (playlist: IPlaylist) => void,
  lyrics: any[],
  setLyrics: (lyrics: any) => void
  isLoadingTrack: boolean,
  setisLoadingTrack: (isLoadingTrack: boolean) => void,
  likedSongs: any[],
  setLikedSongs: (likedSongs: any) => void
  currentSong: Track | null
  setCurrentSong: (currentSong: Track | null) => void
  tempSong: any | null
  setTempSong: (tempSong: any | null) => void
  isPlayFromLocal: boolean
  setIsPlayFromLocal: (isPlayFromLocal: boolean) => void
  lastPosition: number
  setLastPosition: (lastPosition: number) => void,
  sleepTimer: number | null
  setSleepTimer: (time: number | null) => void
}
export const usePlayerStore = create<PlayerStore>()(
  persist((set) => ({
    playFrom: {
      id: "local",
      name: "Bài hát trên thiết bị"
    },
    setPlayFrom: async (playFrom: IPLayFrom) => {
      set({ playFrom })
    },
    playList: {
      id: "",
      items: [],
      isAlbum: false
    },
    color: defaultColorObj as Partial<Color>,
    setColor: (color: Partial<Color>) => set({ color }),
    setPlayList: (playlist: IPlaylist) => set({ playList: playlist }),
    lyrics: [],
    setLyrics: (lyrics: any) => set({ lyrics }),
    isLoadingTrack: true,
    setisLoadingTrack: (isLoadingTrack: boolean) => set({ isLoadingTrack }),
    likedSongs: [],
    setLikedSongs: (likedSongs: any) => set({ likedSongs }),
    currentSong: null,
    setCurrentSong: (currentSong: Track | null) => set({ currentSong }),
    tempSong: null,
    setTempSong: (tempSong: any | null) => set({ tempSong }),
    isPlayFromLocal: false,
    setIsPlayFromLocal: (isPlayFromLocal: boolean) => set({ isPlayFromLocal }),
    lastPosition: 0,
    setLastPosition: (lastPosition: number) => set({ lastPosition }),
    sleepTimer: null,
    setSleepTimer: (sleepTimer: number | null) => set({ sleepTimer }),
  }), {
    name: "player-store",
    storage: createJSONStorage(() => zustandStorage),
  }))

