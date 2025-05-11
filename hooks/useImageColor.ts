import {usePlayerStore} from "../store/playerStore";
import useThemeStore from "../store/themeStore";
import useDarkColor from "./useDarkColor";
import tinycolor from "tinycolor2";

const useImageColor = () => {
  const color = usePlayerStore(state => state.color);
  const {COLOR} = useThemeStore();

  const adjustColor = (baseColor: string, isDark: boolean, amount: number) => {
    return isDark
      ? tinycolor(baseColor).lighten(amount).toString()
      : tinycolor(baseColor).darken(amount).toString();
  };

  const dominantColor = COLOR.isDark
    ? useDarkColor(color.dominant!, 35)
    : adjustColor(color.dominant!, tinycolor(color.dominant!).isDark(), 40);

  const getVibrantColor = () => {
    const isDefaultVibrant = color.vibrant === "#0098DB";
    const baseColor = isDefaultVibrant ? color.average : color.vibrant;
    const tColor = tinycolor(baseColor);

    if (COLOR.isDark) {
      if (isDefaultVibrant) {
        return adjustColor(
          baseColor!,
          tColor.isDark(),
          tColor.isDark() ? 20 : 5
        );
      }
      return tColor.isDark() ? tColor.toString() : tColor.darken(10).toString();
    }

    if (isDefaultVibrant) {
      return adjustColor(baseColor!, tColor.isDark(), tColor.isDark() ? 35 : 5);
    }
    return tColor.lighten(15).toString();
  };

  return {
    dominantColor,
    vibrantColor: getVibrantColor(),
  };
};

export default useImageColor;
