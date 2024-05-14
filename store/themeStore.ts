import { create } from "zustand";
import { lightTheme, headerGradientDark, themeMap, gradientHeaderMap, headerGradientLight, Theme } from "../constants/theme";
import { createJSONStorage, persist } from "zustand/middleware";
import zustandStorage from "./zustandStorage";


interface ThemeState {
  theme: Theme,
  setTheme: (theme: Theme) => void,
  COLOR: typeof lightTheme
  HEADER_GRADIENT: typeof headerGradientDark
}


const useThemeStore = create<ThemeState>()(
  persist((set) => ({
    COLOR: lightTheme,
    HEADER_GRADIENT: headerGradientLight,
    theme: "light",
    setTheme: (theme: Theme) => {
      set(() => ({
        theme,
        COLOR: themeMap[theme] || lightTheme,
        HEADER_GRADIENT: gradientHeaderMap[theme] || headerGradientLight
      }));
    }
  }), {
    name: "player-storage",
    storage: createJSONStorage(() => zustandStorage),
  }));

export default useThemeStore;