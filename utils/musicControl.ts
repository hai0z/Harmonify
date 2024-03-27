import { IPlaylist, usePlayerStore } from '../store/playerStore';
import TrackPlayer, { Event } from "react-native-track-player";
import getThumbnail from "./getThumnail";
import nodejs from "nodejs-mobile-react-native";
import { NULL_URL } from '../constants';

TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async event => {
  if (!event.track) return;
  if (usePlayerStore.getState().isLoadingTrack) return;
  if (event.track.url !== NULL_URL) {
    usePlayerStore.getState().setCurrentSong(event.track);
  }
  if (
    event.index !== undefined && event.track != undefined &&
    event.track.url === NULL_URL) {
    nodejs.channel.post('getSong', event.track);
  }
});

nodejs.channel.addListener('getSong', async data => {
  await TrackPlayer.load({
    ...data.track,
    url: data.data['128'],
  })
});

const handlePlay = async (song: any, playlist: IPlaylist | null) => {
  const currentPlaylistId = usePlayerStore.getState().playList?.id;
  try {
    if (playlist) {
      if (currentPlaylistId !== playlist.id) {
        usePlayerStore.getState().setisLoadingTrack(true);
        usePlayerStore.getState().setPlayList(playlist);
        await TrackPlayer.reset();
        await TrackPlayer.add(playlist.items.map((item: any) => {
          return {
            id: item?.encodeId,
            url: NULL_URL,
            title: item.title,
            artist: item.artistsNames,
            artwork: getThumbnail(item.thumbnail),
            duration: item.duration,
          };
        }));
      }
      const index = playlist.items.findIndex(
        (item: any) => item?.encodeId === song?.encodeId,
      )
      await TrackPlayer.skip(index).then(() => {
        usePlayerStore.getState().setisLoadingTrack(false);
      })
    } else {
      TrackPlayer.load({
        id: song?.encodeId,
        title: song.title,
        artist: song.artistsNames,
        artwork: getThumbnail(song.thumbnail),
        duration: song.duration,
        url: NULL_URL
      })
    }
    usePlayerStore.getState().setCurrentSong({
      id: song?.encodeId,
      title: song.title,
      artist: song.artistsNames,
      artwork: getThumbnail(song.thumbnail),
      duration: song.duration,
      url: NULL_URL
    })
    await TrackPlayer.play();
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

const NextTrack = async () => {
  await TrackPlayer.skipToNext()
};

const PrevTrack = async () => {
  await TrackPlayer.skipToPrevious()
}

export { NextTrack, PrevTrack, handlePlay }