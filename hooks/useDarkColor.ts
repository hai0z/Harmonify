import tinycolor from 'tinycolor2';

export default function useDarkColor(color: string) {
  const tinyColor = tinycolor(color);

  if (tinyColor.isValid()) {
    if (tinyColor.isDark()) {
      return tinyColor.toHexString();
    } else {
      return tinyColor.darken(20).toHexString();
    }
  } else {
    return '#292929';
  }
}
