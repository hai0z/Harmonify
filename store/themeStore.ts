import tinycolor from "tinycolor2";
import { create } from "zustand";

const headerGradientDark = {
  MORNING: '#285430',
  AFTERNOON: '#142850',
  EVENING: '#240A34',
}
const headerGradientLight = {
  MORNING: '#FDCEDF',
  AFTERNOON: '#EFBC9B',
  EVENING: '#F5FCC1',
}
export const lightTheme = {
  PRIMARY: '#E97777',
  SECONDARY: '#F07B3F',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#FAF2F2',
  GRADIENT: "#F3D7CA",
  TEXT_LYRIC: tinycolor('#E97777').darken(10).toString()

}

export const darkTheme = {
  PRIMARY: '#DA291C',
  SECONDARY: '#FBE122',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  BACKGROUND: '#121212',
  GRADIENT: "#dbdbdb",
  TEXT_LYRIC: '#000000'
}



interface ThemeState {
  darkMode: boolean;
  setDarkMode: () => void;
  COLOR: typeof lightTheme | typeof darkTheme,
  HEADER_GRADIENT: typeof headerGradientDark | typeof headerGradientLight
}
const useThemeStore = create<ThemeState>((set) => ({
  COLOR: lightTheme,
  HEADER_GRADIENT: headerGradientLight,
  darkMode: false,
  setDarkMode() {
    set((state) => ({
      darkMode: !state.darkMode,
      COLOR: state.darkMode ? lightTheme : darkTheme,
      HEADER_GRADIENT: state.darkMode
        ? headerGradientLight
        : headerGradientDark,
    }));
  },
}));

export default useThemeStore;