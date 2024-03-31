import { IPlaylist, usePlayerStore } from '../store/playerStore';
import TrackPlayer, { Event } from "react-native-track-player";
import getThumbnail from "./getThumnail";
import nodejs from "nodejs-mobile-react-native";
import { NULL_URL } from '../constants';
import useToastStore, { ToastTime } from '../store/toastStore';

export const objectToTrack = (data: any) => {
  return {
    id: data.encodeId,
    url: NULL_URL,
    title: data.title,
    artist: data.artistsNames,
    artwork: getThumbnail(data.thumbnail || data.thumbnailM),
    duration: data.duration,
  };
}

TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async event => {
  if (!usePlayerStore.getState().isPlayFromLocal) {
    if (!event.track) return;
    if (event.track.url !== NULL_URL) {
      usePlayerStore.getState().setCurrentSong(event.track);
      nodejs.channel.post('getSongInfo', event.track?.id);
    }
    if (
      event.index !== undefined && event.track !== undefined &&
      event.track.url === NULL_URL) {
      console.log(event.track);
      !usePlayerStore.getState().isLoadingTrack &&
        nodejs.channel.post('getSong', event.track);
    }
  } else {
    usePlayerStore.getState().setCurrentSong(event.track!);
  }

});

nodejs.channel.addListener('getSong', async data => {
  if (data.data === NULL_URL) {
    useToastStore.getState().show("Không thể phát bài hát này", ToastTime.SHORT);
    return
  }
  await TrackPlayer.load({
    ...data.track,
    url: data.data['128'],
  })
});

nodejs.channel.addListener('getSongInfo', async data => {
  usePlayerStore.getState().setTempSong(data);
});

const handlePlay = async (song: any, playlist: IPlaylist = {
  id: "",
  items: [],
}) => {
  usePlayerStore.getState().setIsPlayFromLocal(false);
  const currentPlaylistId = usePlayerStore.getState().playList?.id;
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
  usePlayerStore.getState().setCurrentSong(objectToTrack(song));
  await TrackPlayer.play();

}
const handlePlaySongInLocal = async (song: any) => {
  console.log(song);
  usePlayerStore.getState().setIsPlayFromLocal(true);
  usePlayerStore.getState().setPlayList({ id: "", items: [] });
  await TrackPlayer.reset();
  await TrackPlayer.add({
    ...objectToTrack(song),
    url: song.url
  });
  usePlayerStore.getState().setCurrentSong({
    ...objectToTrack(song),
    url: song.url
  });
  await TrackPlayer.play();
}

const NextTrack = async () => {
  await TrackPlayer.skipToNext()
};

const PrevTrack = async () => {
  await TrackPlayer.skipToPrevious()
}

export { NextTrack, PrevTrack, handlePlay, handlePlaySongInLocal }