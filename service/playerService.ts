import { Event } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';

export const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    TrackPlayer.skipToNext();
  })


  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
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
