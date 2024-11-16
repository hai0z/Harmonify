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
export default function App() {
  // const colorScheme = useThemeStore(state =>
  //   state.COLOR.isDark ? 'dark' : 'light',
  // );

  // const {theme, updateTheme} = useMaterial3Theme();

  // const paperTheme = useMemo(
  //   () =>
  //     colorScheme === 'dark'
  //       ? {...MD3DarkTheme, colors: theme.dark}
  //       : {...MD3LightTheme, colors: theme.light},
  //   [colorScheme, theme, color.dominant!],
  // );

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
          maxCacheSize: 1024 * 512,
          autoUpdateMetadata: false,
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

  // useEffect(() => {
  //   updateTheme(color.dominant!);
  // }, [color.dominant!]);
  return (
    <AuthProvider>
      {/* <PaperProvider theme={paperTheme}> */}
      <PlayerProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <Navigation />
          </BottomSheetModalProvider>
          <Toast />
        </GestureHandlerRootView>
      </PlayerProvider>
      {/* </PaperProvider> */}
    </AuthProvider>
  );
}
