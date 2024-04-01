import { AppKilledPlaybackBehavior, Capability, Event, RepeatMode } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';
import { NextTrack, PrevTrack } from './utils/musicControl';
import { setupPlayer } from 'react-native-track-player/lib/trackPlayer';
import Entypo from 'react-native-vector-icons/Entypo';

let isServiceSetup = false;
export const SetupService = async () => {
  if (!isServiceSetup) {
    await setupPlayer({
      autoHandleInterruptions: true,
    });
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      progressUpdateEventInterval: 0.5,
      stopIcon: 1
    });
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);

  }
};
export const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    NextTrack()
  })


  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    PrevTrack()
  }
  );

  TrackPlayer.addEventListener(Event.RemoteSeek, event => {
    const position = event.position;
    TrackPlayer.seekTo(position);
  });
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });
};
