import { usePlayerStore } from './../store/playerStore';
import TrackPlayer, { Event } from "react-native-track-player";
import getThumbnail from "./getThumnail";
import nodejs from "nodejs-mobile-react-native";


TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async event => {
  if (!event.track) return;
  if (
    event.index !== undefined && event.track != undefined &&
    event.track.url === "null") {
    nodejs.channel.post('getSong', event.track.id);
    nodejs.channel.addListener('getSong', async data => {
      await TrackPlayer.load({
        ...event.track,
        url: data['128'],
      });
    });
  }
});

const handlePlay = async (song: any, playlist: any = null) => {
  await TrackPlayer.reset();
  try {
    if (playlist) {
      usePlayerStore.getState().setPlayList(playlist);
      await TrackPlayer.setQueue(playlist.map((item: any) => {
        return {
          id: item?.encodeId,
          url: "null",
          title: item.title,
          artist: item.artistsNames,
          artwork: getThumbnail(item.thumbnail) || "",
          duration: item.duration,
        };
      }));
      const index = playlist.findIndex(
        (item: any) => item?.encodeId === song?.encodeId,
      )
      await TrackPlayer.skip(index);
    } else {
      TrackPlayer.reset();
    }

  } catch (error) {
    console.error('Lỗi:', error);
  }
}

const NextTrack = () => {
  // const playlist: any = usePlayerStore.getState().playList;
  // if (playlist.length > 0) {
  //   const currentSong = usePlayerStore.getState().currentSong;
  //   let index = playlist.findIndex(
  //     (item: any) => item?.encodeId === currentSong?.id,
  //   )
  //   if (index === playlist.length - 1) {
  //     handlePlay(playlist[0]);
  //   } else {
  //     handlePlay(playlist[index + 1])
  //   }
  // }
  TrackPlayer.skipToNext();
};

const PrevTrack = () => {
  // const playlist = usePlayerStore.getState().playList as any;
  // if (playlist.length > 0) {
  //   const currentSong = usePlayerStore.getState().currentSong;
  //   let index = playlist.findIndex(
  //     (item: any) => item.encodeId === currentSong?.id,
  //   )
  //   if (index === 0) {
  //     handlePlay(playlist[playlist.length - 1]);
  //   } else {
  //     handlePlay(playlist[index - 1])
  //   }
  // }
  TrackPlayer.skipToPrevious();
}

export { NextTrack, PrevTrack, handlePlay }