import { defaultColorObj, IPlaylist, usePlayerStore } from '../store/playerStore';
import TrackPlayer, { Event, RepeatMode } from "react-native-track-player";
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
    artwork: getThumbnail(data.thumbnail),
    duration: data.duration,
  };
}

let sleepTimerCounter = 0;

TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async e => {
  const timer = usePlayerStore.getState().sleepTimer
  if (timer !== null) {
    sleepTimerCounter++;
    if (sleepTimerCounter === timer) {
      await TrackPlayer.pause();
      usePlayerStore.getState().setSleepTimer(null)
      sleepTimerCounter = 0
      Alert.alert('Hẹn giờ ngủ', 'Chúc bạn ngủ ngon')
    }
  } else {
    sleepTimerCounter = 0
  }
  usePlayerStore.getState().setLastPosition(e.position);
})

TrackPlayer.addEventListener(Event.PlaybackError, async event => {
  console.log(event.message)
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
  } else {
    !usePlayerStore.getState().isLoadingTrack && usePlayerStore.getState().setCurrentSong(event.track!);
    if (usePlayerStore.getState().savePlayerState && usePlayerStore.getState().isFistInit)
      await TrackPlayer.seekTo(usePlayerStore.getState().lastPosition).then(() => {
        usePlayerStore.getState().setIsFistInit(false)
      });
  }

});

nodejs.channel.addListener('getSong', async data => {
  console.log('service track');
  if (data.data === NULL_URL) {
    useToastStore.getState().show("Không thể phát bài hát này", ToastTime.SHORT);
    return
  }
  await TrackPlayer.load({
    ...data.track,
    url: data.data['128'],
  }).then(async () => {
    if (usePlayerStore.getState().isFistInit === false) {
      console.log(usePlayerStore.getState().isFistInit);
      await TrackPlayer.play()
    }
    if (usePlayerStore.getState().savePlayerState && usePlayerStore.getState().isFistInit)
      await TrackPlayer.seekTo(usePlayerStore.getState().lastPosition).then(() => {
        usePlayerStore.getState().setIsFistInit(false)
      });
  })
});

nodejs.channel.addListener('getSongInfo', async data => {
  usePlayerStore.getState().setTempSong(data);
});

const handlePlay = async (song: any, playlist: IPlaylist = {
  id: "",
  items: [],
  isAlbum: false
}) => {
  usePlayerStore.getState().setLastPosition(0);
  const currentPlaylistId = usePlayerStore.getState().playList?.id;
  usePlayerStore.getState().setIsPlayFromLocal(false);
  if (currentPlaylistId !== playlist.id) {
    await TrackPlayer.reset();
    usePlayerStore.getState().setisLoadingTrack(true);
    usePlayerStore.getState().setPlayList(playlist);
    await TrackPlayer.add(playlist.items.map((item: any) => objectToTrack(item)));
    if (song.encodeId === playlist.items[0].encodeId) {
      nodejs.channel.post('getSong', objectToTrack(song));
    }
  }
  const index = playlist.items.findIndex(
    (item: any) => item?.encodeId === song?.encodeId,
  )
  await TrackPlayer.skip(index).finally(() => {
    usePlayerStore.getState().setisLoadingTrack(false);
  })
  await TrackPlayer.play();

}
const handlePlaySongInLocal = async (song: any, playlist: IPlaylist = {
  id: "",
  items: [],
  isAlbum: false
}) => {
  usePlayerStore.getState().setIsPlayFromLocal(true);
  usePlayerStore.getState().setColor(defaultColorObj);
  const currentPlaylistId = usePlayerStore.getState().playList?.id;
  if (currentPlaylistId !== playlist.id) {
    usePlayerStore.getState().setisLoadingTrack(true);
    await TrackPlayer.reset();
    usePlayerStore.getState().setPlayList(playlist);
    await TrackPlayer.add(playlist.items.map((item: any) => ({ ...objectToTrack(item), url: item.url, artwork: item.thumbnail || DEFAULT_IMG, })));
  }
  const index = playlist.items.findIndex(
    (item: any) => item?.encodeId === song?.encodeId,
  )
  await TrackPlayer.skip(index).finally(() => {
    usePlayerStore.getState().setisLoadingTrack(false);
  })
  await TrackPlayer.play();

}



export { handlePlay, handlePlaySongInLocal }