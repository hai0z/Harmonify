import { IPlaylist, usePlayerStore } from '../store/playerStore';
import TrackPlayer, { Event } from "react-native-track-player";
import getThumbnail from "./getThumnail";
import nodejs from "nodejs-mobile-react-native";
import { NULL_URL } from '../constants';
import useToastStore, { ToastTime } from '../store/toastStore';

export const objectToTrack = (data: any) => {
  return {
    id: data?.encodeId,
    url: NULL_URL,
    title: data.title,
    artist: data.artistsNames,
    artwork: getThumbnail(data.thumbnail || data.thumbnailM),
    duration: data.duration,
  };
}
TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async event => {
  if (!event.track) return;
  if (event.track.url !== NULL_URL) {
    usePlayerStore.getState().setCurrentSong(event.track);
  }
  if (
    event.index !== undefined && event.track != undefined &&
    event.track.url === NULL_URL) {
    !usePlayerStore.getState().isLoadingTrack &&
      nodejs.channel.post('getSong', event.track);
  }
});

nodejs.channel.addListener('getSong', async data => {
  console.log('vao load song', data);
  if (data.data === NULL_URL) {
    useToastStore.getState().show("Không thể phát bài hát này", ToastTime.SHORT);
    return
  }
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
        await TrackPlayer.add(playlist.items.map((item: any) => objectToTrack(item)));
      }
      const index = playlist.items.findIndex(
        (item: any) => item?.encodeId === song?.encodeId,
      )
      if (index === -1) {
        usePlayerStore.getState().setisLoadingTrack(false);
        await TrackPlayer.reset();
      } else {
        await TrackPlayer.skip(index).finally(() => {
          usePlayerStore.getState().setisLoadingTrack(false);
        })
      }
    } else {
      TrackPlayer.load(objectToTrack(song))
    }
    usePlayerStore.getState().setCurrentSong(objectToTrack(song));
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