import { create } from "zustand";

interface CurrentSong {
  id: string,
  url: string,
  title: string,
  artist: string;
  artwork: string,
  duration: number,
}
interface PlayerStore {
  color: any,
  songId: string,
  setSongId: (id: string) => void,
  playList: Array<Object>,
  setColor: (color: any) => void,
  setPlayList: (list: Array<Object>) => void,
  currentSong: CurrentSong | null,
  setCurrentSong: (song: CurrentSong) => void
  lyrics: any
  setLyrics: (lyrics: any) => void
  currentPlaylistId: string,
  setCurrentPlaylistId: (id: string) => void,
  isFirstInit: boolean,
  setIsFirstInit: (isFirstInit: boolean) => void
}
export const usePlayerStore = create<PlayerStore>((set) => ({
  playList: [],
  currentSong: null,
  songId: "",
  color: "#121212",
  setSongId: (id: string) => set({ songId: id }),
  setColor: (color: any) => set({ color }),
  setPlayList: (list: Array<Object>) => set({ playList: list }),
  setCurrentSong: (song: CurrentSong) => set({ currentSong: song }),
  lyrics: [],
  setLyrics: (lyrics: any) => set({ lyrics }),
  currentPlaylistId: "",
  setCurrentPlaylistId: (id: string) => set({ currentPlaylistId: id }),
  isFirstInit: true,
  setIsFirstInit: (isFirstInit: boolean) => set({ isFirstInit }),
}))