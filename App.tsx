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
import {addEventListener} from '@react-native-community/netinfo';
import useToastStore from './store/toastStore';
import React from 'react';
export default function App() {
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        await TrackPlayer.setVolume(1);
        await TrackPlayer.updateOptions({
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
    const unsubscribe = addEventListener(state => {
      if (!state.isConnected)
        useToastStore.getState().show('Không có kết nối internet');
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthProvider>
      <PlayerProvider>
        <GestureHandlerRootView>
          <Navigation />
          <Toast />
        </GestureHandlerRootView>
      </PlayerProvider>
    </AuthProvider>
  );
}
