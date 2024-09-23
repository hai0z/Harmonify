import {useEffect, useMemo} from 'react';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player';
import Navigation from './routes/';
import PlayerProvider from './context/PlayerProvider';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AuthProvider from './context/AuthProvider';
import Toast from './components/toast/Toast';
import React from 'react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {useColorScheme} from 'react-native';
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import useImageColor from './hooks/useImageColor';
import useThemeStore from './store/themeStore';
export default function App() {
  const {averageColor, dominantColor} = useImageColor();

  const colorScheme = useThemeStore(state =>
    state.COLOR.isDark ? 'dark' : 'light',
  );

  const {theme, updateTheme} = useMaterial3Theme();

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark'
        ? {...MD3DarkTheme, colors: theme.dark}
        : {...MD3LightTheme, colors: theme.light},
    [colorScheme, theme, dominantColor],
  );

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
          maxCacheSize: 1024 * 512,
        });

        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        await TrackPlayer.setVolume(1);
        await TrackPlayer.updateOptions({
          progressUpdateEventInterval: 1,

          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
          ],
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.ContinuePlayback,
            alwaysPauseOnInterruption: true,
          },
          color: 0x0098db,
        });
      } catch (e) {
        console.log(e);
      }
    };
    setupPlayer();
  }, []);

  useEffect(() => {
    updateTheme(dominantColor);
  }, [dominantColor]);
  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <PlayerProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <Navigation />
            </BottomSheetModalProvider>
            <Toast />
          </GestureHandlerRootView>
        </PlayerProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
