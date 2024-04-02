import tinycolor from "tinycolor2";
import { create } from "zustand";

type Theme = "light" | "dark" | "lemon" | "pastel" | 'garden'

const headerGradientDark = {
  MORNING: tinycolor('#641ae6').darken(30).toString(),
  AFTERNOON: tinycolor('#d926a9').darken(30).toString(),
  EVENING: tinycolor('#1fb2a6').darken(30).toString(),
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
  MORNING: '#d1ea56',
  AFTERNOON: '#07b25f',
  EVENING: '#ba86d6',
}
export const lemonTheme = {
  PRIMARY: '#529b03',
  SECONDARY: '#e9e92f',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#ffffff',

}
export const lightTheme = {
  PRIMARY: '#65c3c8',
  SECONDARY: '#ef9fbc',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#faf7f5',
}
export const gardenTheme = {
  PRIMARY: '#d1ea56',
  SECONDARY: '#07b25f',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#fcfcfd',

}
export const pastelTheme = {
  PRIMARY: '#d1c1d7',
  SECONDARY: '#f6cbd1',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#ffffff',

}
export const darkTheme = {
  PRIMARY: '#641ae6',
  SECONDARY: '#d926a9',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  BACKGROUND: '#121212',
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