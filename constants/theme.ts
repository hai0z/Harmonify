import tinycolor from "tinycolor2"

export type Theme = "light" | "dark" | "lemon" | "pastel" | 'garden' | 'silky' | 'synthWave' | 'coffee' | 'amoled' | 'night';

//dark header
export const headerGradientDark = {
  MORNING: tinycolor('#641ae6').darken(30).toString(),
  AFTERNOON: tinycolor('#d926a9').darken(30).toString(),
  EVENING: tinycolor('#1fb2a6').darken(30).toString(),
}
const headerGradientSynthWave = {
  MORNING: tinycolor('#e779c1').darken(45).toString(),
  AFTERNOON: tinycolor('#58c7f3').darken(40).toString(),
  EVENING: tinycolor('#f3cc30').darken(40).toString(),
}
const headerGradientCoffee = {
  MORNING: tinycolor('#dc944c').darken(35).toString(),
  AFTERNOON: tinycolor('#263f40').darken(0).toString(),
  EVENING: tinycolor('#11596f').darken(10).toString(),
}
const headerGradientAmoled = {
  MORNING: tinycolor('#343232').darken(30).toString(),
  AFTERNOON: tinycolor('#343232').darken(30).toString(),
  EVENING: tinycolor('#343232').darken(30).toString(),
}
const headerGradientNight = {
  MORNING: tinycolor('#3abff8').darken(45).toString(),
  AFTERNOON: tinycolor('#828df8').darken(55).toString(),
  EVENING: tinycolor('#f471b5').darken(50).toString(),
}
//light header
export const headerGradientSilky = {
  MORNING: tinycolor('#f2829a').lighten().toString(),
  AFTERNOON: tinycolor('#0b85a0').lighten().toString(),
  EVENING: tinycolor('#786df2').lighten().toString(),
}
export const headerGradientLight = {
  MORNING: tinycolor('#65c3c8').lighten().toString(),
  AFTERNOON: tinycolor('#ef9fbc').lighten().toString(),
  EVENING: tinycolor('#eeaf3a').lighten().toString(),
}
const headerGradientLemon = {
  MORNING: tinycolor('#529b03').lighten(25).toString(),
  AFTERNOON: tinycolor('#e9e92f').lighten().toString(),
  EVENING: '#f6f9c8',
}
const headerGradientPastel = {
  MORNING: '#d1c1d7',
  AFTERNOON: '#f6cbd1',
  EVENING: '#b4e9d6',
}
const headerGradientGarden = {
  MORNING: tinycolor('#d1ea56').lighten().toString(),
  AFTERNOON: tinycolor('#07b25f').lighten(40).toString(),
  EVENING: tinycolor('#ba86d6').lighten(10).toString(),
}

//light theme
export const lemonTheme = {
  isDark: false,
  PRIMARY: '#529b03',
  SECONDARY: '#e9e92f',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#ffffff',

}
export const lightTheme = {
  isDark: false,
  PRIMARY: '#65c3c8',
  SECONDARY: '#ef9fbc',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#faf7f5',
}
export const gardenTheme = {
  isDark: false,
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
  isDark: false,

}
export const silkyTheme = {
  PRIMARY: '#f2829a',
  SECONDARY: '#0b85a0',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#606060',
  BACKGROUND: '#eeecf3',
  isDark: false,
}

//dark theme

export const darkTheme = {
  PRIMARY: '#641ae6',
  SECONDARY: '#d926a9',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  BACKGROUND: '#1d232a',
  isDark: true,
}
export const synthWaveTheme = {
  PRIMARY: '#e779c1',
  SECONDARY: '#58c7f3',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  BACKGROUND: '#1a103c',
  isDark: true,
}
export const coffeeTheme = {
  PRIMARY: '#dc944c',
  SECONDARY: '#263f40',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  BACKGROUND: '#211720',
  isDark: true,
}
export const amoledTheme = {
  PRIMARY: '#343232',
  SECONDARY: '#343232',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  BACKGROUND: '#000000',
  isDark: true,
}
export const nightTheme = {
  PRIMARY: '#3abff8',
  SECONDARY: '#828df8',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  BACKGROUND: '#0f1729',
  isDark: true,
}


export const themeMap = {
  'light': lightTheme,
  'dark': darkTheme,
  'lemon': lemonTheme,
  'pastel': pastelTheme,
  'garden': gardenTheme,
  'silky': silkyTheme,
  'synthWave': synthWaveTheme,
  'coffee': coffeeTheme,
  'amoled': amoledTheme,
  'night': nightTheme
}

export const gradientHeaderMap = {
  'light': headerGradientLight,
  'dark': headerGradientDark,
  'lemon': headerGradientLemon,
  'pastel': headerGradientPastel,
  'garden': headerGradientGarden,
  'silky': headerGradientSilky,
  'synthWave': headerGradientSynthWave,
  'coffee': headerGradientCoffee,
  'amoled': headerGradientAmoled,
  'night': headerGradientNight

}
