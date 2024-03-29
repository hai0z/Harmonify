import tinycolor from 'tinycolor2';

export default function useDarkColor(color: string, darken: number) {
  const tinyColor = tinycolor(color);

  if (tinyColor.isValid()) {
    if (tinyColor.isDark()) {
      return tinyColor.toHexString();
    } else {
      return tinyColor.darken(darken).toHexString();
    }
  } else {
    return color;
  }
}
