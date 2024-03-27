import { useEffect, useState } from 'react'
import { usePlayerStore } from '../store/playerStore';
import { Track, useActiveTrack } from 'react-native-track-player';
import { addToLikedList } from '../utils/firebase';
import useToastStore, { ToastTime } from '../store/toastStore';

const useToggleLikeSong = () => {
  const [isLiked, setIsLiked] = useState(false);

  const { likedSongs } = usePlayerStore(state => state);

  const { show } = useToastStore(state => state);
  const track = useActiveTrack();
  useEffect(() => {
    if (likedSongs.length > 0) {
      setIsLiked(likedSongs.some((s: any) => s.encodeId == track?.id));
    }
  }, [likedSongs.length, track?.id]);

  const handleAddToLikedList = async (likedSong: Track) => {
    setIsLiked(!isLiked);
    if (isLiked) {
      show('Đã xóa khỏi yêu thích', ToastTime.SHORT);
    } else {
      show('Đã thêm vào yêu thích', ToastTime.SHORT);
    }
    try {
      await addToLikedList({
        encodeId: likedSong.id,
        title: likedSong.title,
        thumbnail: likedSong.artwork,
        artistsNames: likedSong.artist,
        duration: likedSong.duration,
      });
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    {
      isLiked,
      handleAddToLikedList
    }
  )
}

export default useToggleLikeSong