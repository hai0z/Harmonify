import tinycolor from "tinycolor2";

export type Theme =
  | "light"
  | "dark"
  | "lemon"
  | "pastel"
  | "winter"
  | "silky"
  | "halloween"
  | "bussiness"
  | "amoled"
  | "night";

//dark header
export const headerGradientDark = {
  MORNING: tinycolor("#ff7ac6").darken(55).toString(),
  AFTERNOON: tinycolor("#bf95f9").darken(55).toString(),
  EVENING: tinycolor("#ffb86b").darken(55).toString(),
};
const headerGradienthalloween = {
  MORNING: tinycolor("#f28c18").darken(30).toString(),
  AFTERNOON: tinycolor("#6d3a9c").darken(25).toString(),
  EVENING: tinycolor("#51a800").darken(20).toString(),
};
const headerGradientbussiness = {
  MORNING: tinycolor("#1c4f82").darken(15).toString(),
  AFTERNOON: tinycolor("#7d919b").darken(35).toString(),
  EVENING: tinycolor("#eb6b47").darken(45).toString(),
};
const headerGradientAmoled = {
  MORNING: tinycolor("#180161").darken(0).toString(),
  AFTERNOON: tinycolor("#4F1787").darken(10).toString(),
  EVENING: tinycolor("#EB3678").darken(40).toString(),
};
const headerGradientNight = {
  MORNING: tinycolor("#3abff8").darken(45).toString(),
  AFTERNOON: tinycolor("#828df8").darken(55).toString(),
  EVENING: tinycolor("#f471b5").darken(50).toString(),
};
//light header
export const headerGradientSilky = {
  MORNING: tinycolor("#f4c92c").lighten(20).toString(),
  AFTERNOON: tinycolor("#8c42b7").lighten(20).toString(),
  EVENING: tinycolor("#3992ad").lighten(20).toString(),
};
export const headerGradientLight = {
  MORNING: tinycolor("#65c3c8").lighten().toString(),
  AFTERNOON: tinycolor("#ef9fbc").lighten().toString(),
  EVENING: tinycolor("#eeaf3a").lighten().toString(),
};
const headerGradientLemon = {
  MORNING: tinycolor("#529b03").lighten(25).toString(),
  AFTERNOON: tinycolor("#e9e92f").lighten().toString(),
  EVENING: tinycolor("#D5F0C1").darken(15).toString(),
};
const headerGradientPastel = {
  MORNING: "#d1c1d7",
  AFTERNOON: "#f6cbd1",
  EVENING: "#b4e9d6",
};
const headerGradientWinter = {
  MORNING: tinycolor("#057aff").lighten(40).toString(),
  AFTERNOON: tinycolor("#463aa1").lighten(40).toString(),
  EVENING: tinycolor("#c149ad").lighten(30).toString(),
};

//light theme
export const lemonTheme = {
  isDark: false,
  PRIMARY: "#529b03",
  SECONDARY: "#e9e92f",
  TEXT_PRIMARY: "#000000",
  TEXT_SECONDARY: "#606060",
  BACKGROUND: "#ffffff",
};
export const lightTheme = {
  isDark: false,
  PRIMARY: "#65c3c8",
  SECONDARY: "#ef9fbc",
  TEXT_PRIMARY: "#000000",
  TEXT_SECONDARY: "#606060",
  BACKGROUND: "#FFFFFF",
};
export const winterTheme = {
  isDark: false,
  PRIMARY: "#057aff",
  SECONDARY: "#463aa1",
  TEXT_PRIMARY: "#000000",
  TEXT_SECONDARY: "#606060",
  BACKGROUND: "#ffffff",
};
export const pastelTheme = {
  PRIMARY: "#d1c1d7",
  SECONDARY: "#f6cbd1",
  TEXT_PRIMARY: "#000000",
  TEXT_SECONDARY: "#606060",
  BACKGROUND: "#ffffff",
  isDark: false,
};
export const silkyTheme = {
  PRIMARY: "#f4c92c",
  SECONDARY: "#8c42b7",
  TEXT_PRIMARY: "#000000",
  TEXT_SECONDARY: "#606060",
  BACKGROUND: "#f1f3f3",
  isDark: false,
};

//dark theme

export const darkTheme = {
  PRIMARY: "#ff7ac6",
  SECONDARY: "#bf95f9",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#A9A9A9",
  BACKGROUND: "#191414",
  isDark: true,
};
export const halloweenTheme = {
  PRIMARY: "#f28c18",
  SECONDARY: "#6d3a9c",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#A9A9A9",
  BACKGROUND: "#212121",
  isDark: true,
};
export const bussinessTheme = {
  PRIMARY: "#1c4f82",
  SECONDARY: "#7d919b",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#A9A9A9",
  BACKGROUND: "#212121",
  isDark: true,
};
export const amoledTheme = {
  PRIMARY: "#343232",
  SECONDARY: "#343232",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#A9A9A9",
  BACKGROUND: "#000000",
  isDark: true,
};
export const nightTheme = {
  PRIMARY: "#3abff8",
  SECONDARY: "#828df8",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#A9A9A9",
  BACKGROUND: "#0f1729",
  isDark: true,
};

export const themeMap: Readonly<Record<Theme, typeof lightTheme>> = {
  light: lightTheme,
  dark: darkTheme,
  lemon: lemonTheme,
  pastel: pastelTheme,
  winter: winterTheme,
  silky: silkyTheme,
  halloween: halloweenTheme,
  bussiness: bussinessTheme,
  amoled: amoledTheme,
  night: nightTheme,
};

export const gradientHeaderMap: Readonly<
  Record<Theme, typeof headerGradientLight>
> = {
  light: headerGradientLight,
  dark: headerGradientDark,
  lemon: headerGradientLemon,
  pastel: headerGradientPastel,
  winter: headerGradientWinter,
  silky: headerGradientSilky,
  halloween: headerGradienthalloween,
  bussiness: headerGradientbussiness,
  amoled: headerGradientAmoled,
  night: headerGradientNight,
};
