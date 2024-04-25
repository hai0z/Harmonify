import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from './zustandStorage';

interface LibraryStore {
  viewType: "list" | "grid";
  setViewType: (type: "list" | "grid") => void;
}
export const useLibraryStore = create<LibraryStore>()(persist((set) => ({
  viewType: "list",
  setViewType: (type: "list" | "grid") => set({ viewType: type }),
}), {
  name: 'player-store',
  storage: createJSONStorage(() => zustandStorage),
}))
export default useLibraryStore