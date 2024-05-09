import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import zustandStorage from "./zustandStorage";

type UserState = {
  myPlaylists: any[],
  setMyPlaylists: (data: any[]) => void
  likedSongs: any[],
  setLikedSongs: (data: any[]) => void
  listFollowArtists: any[],
  setListFollowArtists: (data: any[]) => void,
  likedPlaylists: any[],
  setLikedPlaylists: (data: any[]) => void,
  searchHistory: any[],
  setSearchHistory: (data: any[]) => void
}

export const useUserStore = create<UserState>()(persist((set) => ({
  myPlaylists: [],
  setMyPlaylists: (data: any[]) => set({ myPlaylists: data }),
  likedSongs: [],
  setLikedSongs: (data: any[]) => set({ likedSongs: data }),
  listFollowArtists: [],
  setListFollowArtists: (data: any[]) => set({ listFollowArtists: data }),
  likedPlaylists: [],
  setLikedPlaylists: (data: any[]) => set({ likedPlaylists: data }),
  searchHistory: [],
  setSearchHistory: (data: any[]) => set({ searchHistory: data }),
}), {
  name: 'player-store',
  storage: createJSONStorage(() => zustandStorage),
}))