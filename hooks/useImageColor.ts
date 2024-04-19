import { View, Text } from 'react-native'
import React from 'react'
import { usePlayerStore } from '../store/playerStore'
import useThemeStore from '../store/themeStore'
import useDarkColor from './useDarkColor'
import tinycolor from 'tinycolor2'

const useImageColor = () => {
  const { color } = usePlayerStore()
  const { COLOR } = useThemeStore()

  const dominantColor = COLOR.isDark
    ? useDarkColor(color.dominant!, 20)
    : tinycolor(color.dominant!).isDark()
      ? tinycolor(color.dominant!).lighten(45).toString()
      : tinycolor(color.dominant!).darken(10).toString();

  const vibrantColor = COLOR.isDark
    ? color.vibrant === '#0098DB'
      ? tinycolor(color.average).isDark()
        ? tinycolor(color.average).lighten(20).toString()
        : color.average
      : color.vibrant
    : color.vibrant === '#0098DB'
      ? tinycolor(color.average).isDark()
        ? tinycolor(color.average).lighten(50).toString()
        : color.average
      : tinycolor(color.vibrant).lighten(20).toString();

  return {
    dominantColor,
    vibrantColor
  }
}

export default useImageColor