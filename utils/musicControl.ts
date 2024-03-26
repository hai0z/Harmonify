import { IPlaylist, usePlayerStore } from './../store/playerStore';
import TrackPlayer, { Event } from "react-native-track-player";
import getThumbnail from "./getThumnail";
import nodejs from "nodejs-mobile-react-native";
import { NULL_URL } from '../constants';

TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async event => {
  if (!event.track) return;
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
  }).finally(() => {
    usePlayerStore.getState().setisLoadingTrack(false);
  })

});

const handlePlay = async (song: any, playlist: IPlaylist | null) => {
  const currentPlaylistId = usePlayerStore.getState().playList?.id;
  try {
    if (playlist) {
      if (currentPlaylistId !== playlist.id) {
        usePlayerStore.getState().setisLoadingTrack(true);
        await TrackPlayer.reset();
        await TrackPlayer.setQueue(playlist.items.map((item: any) => {
          return {
            id: item?.encodeId,
            url: "null",
            title: item.title,
            artist: item.artistsNames,
            artwork: getThumbnail(item.thumbnail),
            duration: item.duration,
          };
        }));
        usePlayerStore.getState().setPlayList(playlist);
      }
      const index = playlist.items.findIndex(
        (item: any) => item?.encodeId === song?.encodeId,
      )
      await TrackPlayer.skip(index);
    } else {
      await TrackPlayer.load({
        id: song?.encodeId,
        title: song.title,
        artist: song.artistsNames,
        artwork: getThumbnail(song.thumbnail),
        duration: song.duration,
        url: "null",
      })


    }
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