import tinycolor from "tinycolor2";
import { create } from "zustand";

type Theme = "light" | "dark" | "lemon" | "pastel" | 'garden'

const headerGradientDark = {
  MORNING: tinycolor('#ff7ac6').darken(50).toString(),
  AFTERNOON: tinycolor('#bf95f9').darken(50).toString(),
  EVENING: tinycolor('#ffb86b').darken(50).toString(),
}
const headerGradientLight = {
  MORNING: '#65c3c8',
  AFTERNOON: '#ef9fbc',
  EVENING: '#eeaf3a',
}
const headerGradientLemon = {
  MORNING: '#529b03',
  AFTERNOON: '#e9e92f',
  EVENING: '#f6f9c8',
}
const headerGradientPastel = {
  MORNING: '#d1c1d7',
  AFTERNOON: '#f6cbd1',
  EVENING: '#b4e9d6',
}
const headerGradientGarden = {
  MORNING: '#f50076',
  AFTERNOON: '#8f4263',
  EVENING: '#5c7f67',
}
export const lemonTheme = {
  PRIMARY: '#529b03',
  SECONDARY: '#e9e92f',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#ffffff',
  GRADIENT: "#dff2a1",
  TEXT_LYRIC: "#f7e488"

}
export const lightTheme = {
  PRIMARY: '#65c3c8',
  SECONDARY: '#ef9fbc',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#faf7f5',
  GRADIENT: "#36d399",
  TEXT_LYRIC: "#eeaf3a"

}
export const gardenTheme = {
  PRIMARY: '#f50076',
  SECONDARY: '#8f4263',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#e9e7e7',
  GRADIENT: "#36d399",
  TEXT_LYRIC: "#fbbd23"

}
export const pastelTheme = {
  PRIMARY: '#d1c1d7',
  SECONDARY: '#f6cbd1',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#ffffff',
  GRADIENT: "#36d399",
  TEXT_LYRIC: "#fbbd23"

}
export const darkTheme = {
  PRIMARY: '#ff7ac6',
  SECONDARY: '#bf95f9',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  BACKGROUND: '#121212',
  GRADIENT: "#52fa7c",
  TEXT_LYRIC: '#ffffff'
}

interface ThemeState {
  theme: Theme,
  setTheme: (theme: Theme) => void,
  COLOR: typeof lightTheme
  HEADER_GRADIENT: typeof headerGradientDark
}

export const themeMap = {
  'light': lightTheme,
  'dark': darkTheme,
  'lemon': lemonTheme,
  'pastel': pastelTheme,
  'garden': gardenTheme
}

const gradientHeaderMap = {
  'light': headerGradientLight,
  'dark': headerGradientDark,
  'lemon': headerGradientLemon,
  'pastel': headerGradientPastel,
  'garden': headerGradientGarden
}

const useThemeStore = create<ThemeState>((set) => ({
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
}));

export default useThemeStore;