import {useEffect} from 'react';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
} from 'react-native-track-player';
import Navigation from './routes/';
import PlayerProvider from './context/PlayerProvider';
import {NextTrack} from './utils/musicControl';
import SplashScreen from 'react-native-splash-screen';
export default function App() {
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    NextTrack();
  });
  useEffect(() => {
    SplashScreen.hide();
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.setRepeatMode(RepeatMode.Off);
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
            stopForegroundGracePeriod: 3000,
          },
        });
      } catch (e) {}
    };
    setupPlayer();
  }, []);

  return (
    <PlayerProvider>
      <Navigation />
    </PlayerProvider>
  );
}
