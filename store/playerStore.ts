import { RepeatMode, Track } from "react-native-track-player";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import zustandStorage from "./zustandStorage";
import { Lyric, Song } from "../utils/types/index.type";

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
  setColor: (color: Partial<Color>) => void,
  playList: IPlaylist,
  setPlayList: (playlist: IPlaylist) => void,
  tempPlayList: IPlaylist,
  setTempPlayList: (playlist: IPlaylist) => void,
  lyrics: Lyric[],
  setLyrics: (lyrics: any) => void
  isLoadingTrack: boolean,
  setisLoadingTrack: (isLoadingTrack: boolean) => void,
  likedSongs: Song[],
  setLikedSongs: (likedSongs: any) => void
  currentSong: Track | null
  setCurrentSong: (currentSong: Track | null) => void
  tempSong: Song | null
  setTempSong: (tempSong: Song | null) => void
  isPlayFromLocal: boolean
  setIsPlayFromLocal: (isPlayFromLocal: boolean) => void
  lastPosition: number
  setLastPosition: (lastPosition: number) => void,
  sleepTimer: number | null
  setSleepTimer: (time: number | null) => void,
  savePlayerState: boolean,
  setSavePlayerState: (savePlayerState: boolean) => void,
  isFistInit: boolean,
  setIsFistInit: (isFistInit: boolean) => void,
  imageQuality: "low" | "medium" | "high",
  setImageQuality: (imageQuality: "low" | "medium" | "high") => void,
  saveHistory: boolean,
  setSaveHistory: (saveHistory: boolean) => void
  homeLoading: boolean
  setHomeLoading: (homeLoading: boolean) => void
  offlineMode: boolean
  setOfflineMode: (offlineMode: boolean) => void
  repeatMode: RepeatMode
  setRepeatMode: (repeatMode: RepeatMode) => void
  shuffleMode: boolean
  setShuffleMode: (shuffleMode: boolean) => void
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
    setLikedSongs: (likedSongs: Song[]) => set({ likedSongs }),
    currentSong: null,
    setCurrentSong: (currentSong: Track | null) => set({ currentSong }),
    tempSong: null,
    setTempSong: (tempSong: Song | null) => set({ tempSong }),
    isPlayFromLocal: false,
    setIsPlayFromLocal: (isPlayFromLocal: boolean) => set({ isPlayFromLocal }),
    lastPosition: 0,
    setLastPosition: (lastPosition: number) => set({ lastPosition }),
    sleepTimer: null,
    setSleepTimer: (sleepTimer: number | null) => set({ sleepTimer }),
    savePlayerState: true,
    setSavePlayerState: (savePlayerState: boolean) => set({ savePlayerState }),
    isFistInit: true,
    setIsFistInit: (isFistInit: boolean) => set({ isFistInit }),
    imageQuality: "medium",
    setImageQuality: (imageQuality: "low" | "medium" | "high") => set({ imageQuality }),
    saveHistory: true,
    setSaveHistory: (saveHistory: boolean) => set({ saveHistory }),
    homeLoading: true,
    setHomeLoading: (homeLoading: boolean) => set({ homeLoading }),
    offlineMode: false,
    setOfflineMode: (offlineMode: boolean) => set({ offlineMode }),
    repeatMode: RepeatMode.Queue,
    setRepeatMode: (repeatMode) => set({ repeatMode }),
    shuffleMode: false,
    setShuffleMode: (shuffleMode: boolean) => set({ shuffleMode }),
    tempPlayList: {
      id: "",
      items: [],
      isAlbum: false
    },
    setTempPlayList: (playlist: IPlaylist) => set({ tempPlayList: playlist }),

  }), {
    name: "player-store",
    storage: createJSONStorage(() => zustandStorage),
  }))

