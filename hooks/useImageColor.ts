import { usePlayerStore } from '../store/playerStore'
import useThemeStore from '../store/themeStore'
import useDarkColor from './useDarkColor'
import tinycolor from 'tinycolor2'

const useImageColor = () => {
  const { color } = usePlayerStore()
  const { COLOR } = useThemeStore()

  const dominantColor = COLOR.isDark
    ? useDarkColor(color.dominant!, 30)
    : tinycolor(color.dominant!).isDark()
      ? tinycolor(color.dominant!).lighten(40).toString()
      : tinycolor(color.dominant!).darken(5).toString();

  const vibrantColor = COLOR.isDark
    ? color.vibrant === '#0098DB'
      ? tinycolor(color.average).isDark()
        ? tinycolor(color.average).lighten(30).toString()
        : color.average
      : color.vibrant
    : color.vibrant === '#0098DB'
      ? tinycolor(color.average).isDark()
        ? tinycolor(color.average).lighten(40).toString()
        : color.average
      : tinycolor(color.vibrant).lighten(10).toString();

  return {
    dominantColor,
    vibrantColor
  }
}

export default useImageColor