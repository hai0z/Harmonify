import { defaultColorObj, IPlaylist, usePlayerStore } from '../store/playerStore';
import TrackPlayer, { Event } from "react-native-track-player";
import getThumbnail from "../utils/getThumnail";
import nodejs from "nodejs-mobile-react-native";
import { DEFAULT_IMG, NULL_URL } from '../constants';
import useToastStore, { ToastTime } from '../store/toastStore';
import { Alert } from 'react-native';

export const objectToTrack = (data: any) => {
  return {
    id: data.encodeId,
    url: (data.url && data.url !== "" && data.url !== null && data.url !== undefined) ? data.url : NULL_URL,
    title: data.title,
    artist: data.artistsNames,
    artwork: getThumbnail(data.thumbnail || data.thumbnailM),
    duration: data.duration,
  };
}

let counter = 0;

TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async e => {
  const timer = usePlayerStore.getState().sleepTimer
  if (timer !== null) {
    counter++;
    if (counter === timer) {
      await TrackPlayer.pause();
      usePlayerStore.getState().setSleepTimer(null)
      counter = 0
      Alert.alert('Hẹn giờ ngủ', 'Chúc bạn ngủ ngon')
    }
  } else {
    counter = 0
  }
  console.log(counter);
  // usePlayerStore.getState().setLastPosition(e.position);
})

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
      !usePlayerStore.getState().isLoadingTrack &&
        nodejs.channel.post('getSong', event.track!);
    }
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
  const currentPlaylistId = usePlayerStore.getState().playList?.id;
  usePlayerStore.getState().setIsPlayFromLocal(false);
  if (currentPlaylistId !== playlist.id) {
    usePlayerStore.getState().setisLoadingTrack(true);
    usePlayerStore.getState().setPlayList(playlist);
    await TrackPlayer.reset();
    await TrackPlayer.add(playlist.items.map((item: any) => objectToTrack(item)));
  }
  const index = playlist.items.findIndex(
    (item: any) => item?.encodeId === song?.encodeId,
  )
  await TrackPlayer.skip(index).finally(() => {
    usePlayerStore.getState().setisLoadingTrack(false);
  })
  await TrackPlayer.play();

}
const handlePlaySongInLocal = async (song: any,) => {
  usePlayerStore.getState().setIsPlayFromLocal(true);
  usePlayerStore.getState().setPlayList({
    id: "", items: []
  });
  usePlayerStore.getState().setColor(defaultColorObj);
  await TrackPlayer.reset();
  await TrackPlayer.add({
    ...objectToTrack(song),
    artwork: song.thumbnail || DEFAULT_IMG,
    url: song.url
  });
  usePlayerStore.getState().setCurrentSong({
    ...objectToTrack(song),
    artwork: song.thumbnail || DEFAULT_IMG,
    url: song.url
  });
  await TrackPlayer.play();
}



export { handlePlay, handlePlaySongInLocal }