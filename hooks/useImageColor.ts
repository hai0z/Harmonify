import { usePlayerStore } from '../store/playerStore'
import useThemeStore from '../store/themeStore'
import useDarkColor from './useDarkColor'
import tinycolor from 'tinycolor2'

const useImageColor = () => {
  const { color } = usePlayerStore()
  const { COLOR } = useThemeStore()

  const dominantColor = COLOR.isDark
    ? useDarkColor(color.dominant!, 35)
    : tinycolor(color.dominant!).isDark()
      ? tinycolor(color.dominant!).lighten(40).toString()
      : tinycolor(color.dominant!).darken(10).toString();

  const vibrantColor = COLOR.isDark
    ? color.vibrant === '#0098DB'
      ? tinycolor(color.average).isDark()
        ? tinycolor(color.average).lighten(20).toString()
        : tinycolor(color.average).darken(5).toString()
      : tinycolor(color.vibrant).isDark() ? tinycolor(color.vibrant).toString() : tinycolor(color.vibrant).darken(10).toString()
    : color.vibrant === '#0098DB'
      ? tinycolor(color.average).isDark()
        ? tinycolor(color.average).lighten(35).toString()
        : tinycolor(color.average).darken(5).toString()
      : tinycolor(color.vibrant).lighten(15).toString();

  return {
    dominantColor,
    vibrantColor
  }
}

export default useImageColor