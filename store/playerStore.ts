import { create } from "zustand";

export interface IPlaylist {
  id: string,
  items: any[]
}
interface PlayerStore {
  color: any,
  playList: IPlaylist,
  setColor: (color: any) => void,
  setPlayList: (playlist: IPlaylist) => void,
  lyrics: any
  setLyrics: (lyrics: any) => void
  currentPlaylistId: string,
  setCurrentPlaylistId: (id: string) => void,
  isLoadingTrack: boolean,
  setisLoadingTrack: (isLoadingTrack: boolean) => void
}
export const usePlayerStore = create<PlayerStore>((set) => ({
  playList: {} as IPlaylist,
  color: { "average": "#282828", "darkMuted": "#282828", "darkVibrant": "#282828", "dominant": "#282828", "lightMuted": "#282828", "lightVibrant": "#282828", "muted": "#282828", "platform": "android", "vibrant": "#282828" },
  setColor: (color: any) => set({ color }),
  setPlayList: (playlist: IPlaylist) => set({ playList: playlist }),
  lyrics: [],
  setLyrics: (lyrics: any) => set({ lyrics }),
  currentPlaylistId: "",
  setCurrentPlaylistId: (id: string) => set({ currentPlaylistId: id }),
  isLoadingTrack: false,
  setisLoadingTrack: (isLoadingTrack: boolean) => set({ isLoadingTrack }),
}))

