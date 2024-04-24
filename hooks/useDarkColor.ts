import tinycolor from 'tinycolor2';

export default function useDarkColor(color: string, amount: number) {
  const tinyColor = tinycolor(color);
  if (tinyColor.isValid()) {
    if (tinyColor.isDark()) {
      return tinyColor.lighten(10).toHexString();
    } else {
      return tinyColor.darken(amount).toHexString();
    }
  } else {
    return color;
  }
}
