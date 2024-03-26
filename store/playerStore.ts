import { Track } from "react-native-track-player";
import { create } from "zustand";

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
  lyrics: any
  setLyrics: (lyrics: any) => void
  currentPlaylistId: string,
  setCurrentPlaylistId: (id: string) => void,
  isLoadingTrack: boolean,
  setisLoadingTrack: (isLoadingTrack: boolean) => void,
  currentSong: Track,
  setCurrentSong: (song: Track) => void
}
export const usePlayerStore = create<PlayerStore>((set) => ({
  playList: {} as IPlaylist,
  color: {} as Partial<Color>,
  setColor: (color: Partial<Color>) => set({ color }),
  setPlayList: (playlist: IPlaylist) => set({ playList: playlist }),
  lyrics: [],
  setLyrics: (lyrics: any) => set({ lyrics }),
  currentPlaylistId: "",
  setCurrentPlaylistId: (id: string) => set({ currentPlaylistId: id }),
  isLoadingTrack: false,
  setisLoadingTrack: (isLoadingTrack: boolean) => set({ isLoadingTrack }),
  currentSong: {} as Track,
  setCurrentSong: (song: Track) => set({ currentSong: song }),
}))

