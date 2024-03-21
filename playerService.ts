import { Event } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';
import { NextTrack, PrevTrack } from './utils/musicControl';

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
};
