import {useEffect} from 'react';
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
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
          maxCacheSize: 1024 * 10,
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
              AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            alwaysPauseOnInterruption: true,
          },
        });
      } catch (e) {}
    };
    setupPlayer();
  }, []);

  return (
    <AuthProvider>
      <PlayerProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <Navigation />
          </BottomSheetModalProvider>
          <Toast />
        </GestureHandlerRootView>
      </PlayerProvider>
    </AuthProvider>
  );
}
