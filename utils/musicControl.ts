import { usePlayerStore } from './../store/playerStore';
import TrackPlayer from "react-native-track-player";
import getThumbnail from "./getThumnail";
import nodejs from "nodejs-mobile-react-native";


const handlePlay = async (song: any, playlist: any = null) => {

  await TrackPlayer.reset();
  try {
    if (playlist) {
      usePlayerStore.getState().setPlayList(playlist);
    }
    const track = {
      id: song?.encodeId,
      url: "",
      title: song.title,
      artist: {
        name: song.artistsNames,
        id: song.artists[0].id,
        alias: song.artists[0].alias,
      },
      artwork: getThumbnail(song.thumbnail) || "",
      duration: song.duration,
    };
    usePlayerStore.getState().setCurrentSong(track);
    nodejs.channel.addListener('getSong', async data => {

      await TrackPlayer.load({
        ...track,
        artist: track?.artist?.name,
        url: data['128'],
      });
      await TrackPlayer.play();
    });
    nodejs.channel.post('getSong', song.encodeId);
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

const NextTrack = () => {
  const playlist: any = usePlayerStore.getState().playList;
  if (playlist.length > 0) {
    const currentSong = usePlayerStore.getState().currentSong;
    let index = playlist.findIndex(
      (item: any) => item?.encodeId === currentSong?.id,
    )
    if (index === playlist.length - 1) {
      handlePlay(playlist[0]);
    } else {
      handlePlay(playlist[index + 1])
    }
  }
};

const PrevTrack = () => {
  const playlist = usePlayerStore.getState().playList as any;
  if (playlist.length > 0) {
    const currentSong = usePlayerStore.getState().currentSong;
    let index = playlist.findIndex(
      (item: any) => item.encodeId === currentSong?.id,
    )
    if (index === 0) {
      handlePlay(playlist[playlist.length - 1]);
    } else {
      handlePlay(playlist[index - 1])
    }
  }
}

export { NextTrack, PrevTrack, handlePlay }