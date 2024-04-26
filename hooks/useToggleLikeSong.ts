import { useEffect, useState } from 'react'
import { usePlayerStore } from '../store/playerStore';
import { useActiveTrack } from 'react-native-track-player';
import { addToLikedList } from '../service/firebase';
import useToastStore, { ToastTime } from '../store/toastStore';

const useToggleLikeSong = (trackId = null) => {

  const [isLiked, setIsLiked] = useState(false);

  const { likedSongs } = usePlayerStore(state => state);

  const { show } = useToastStore(state => state);

  const track = useActiveTrack();

  if (!trackId) {
    trackId = track?.id
  }

  useEffect(() => {
    if (likedSongs.length > 0) {
      setIsLiked(likedSongs.some((s: any) => s.encodeId === trackId));
    }
  }, [likedSongs.length, trackId]);


  const handleAddToLikedList = async (likedSong: any) => {
    setIsLiked(!isLiked);
    if (isLiked) {
      show('Đã xóa khỏi yêu thích', ToastTime.SHORT);
    } else {
      show('Đã thêm vào yêu thích', ToastTime.SHORT);
    }
    try {
      await addToLikedList(likedSong);
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