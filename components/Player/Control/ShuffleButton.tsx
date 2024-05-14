import {ToastAndroid, TouchableOpacity} from 'react-native';
import React from 'react';
import {Track} from 'react-native-track-player';
import useThemeStore from '../../../store/themeStore';
import {usePlayerStore} from '../../../store/playerStore';
import Feather from 'react-native-vector-icons/Feather';
import {
  add,
  getActiveTrackIndex,
  getQueue,
  remove,
  setQueue,
} from 'react-native-track-player/lib/trackPlayer';
import {objectToTrack} from '../../../service/trackPlayerService';
import {DEFAULT_IMG} from '../../../constants';
import shuffleArray from '../../../utils/shuffle';

export async function setQueueUninterrupted(tracks: Track[]): Promise<void> {
  const currentTrackIndex = await getActiveTrackIndex();
  if (currentTrackIndex === undefined) return await setQueue(tracks);
  const currentQueue = await getQueue();
  const currentTrack = currentQueue[currentTrackIndex];
  const currentTrackNewIndex = tracks.findIndex(
    track => track.id === currentTrack.id,
  );

  if (currentTrackNewIndex < 0) return await setQueue(tracks);

  let removeTrackIndices = [...Array(currentQueue.length).keys()];
  removeTrackIndices.splice(currentTrackIndex, 1);
  await remove(removeTrackIndices);
  const splicedTracks = tracks
    .slice(currentTrackNewIndex + 1)
    .concat(tracks.slice(0, currentTrackNewIndex));
  await add(splicedTracks);
}

const ShuffleButton = () => {
  const {COLOR} = useThemeStore();
  const playList = usePlayerStore(state => state.playList);
  const setPlayList = usePlayerStore(state => state.setPlayList);
  const {shuffleMode, setShuffleMode, tempPlayList, isPlayFromLocal} =
    usePlayerStore();
  async function shuffleQueueUninterrupted() {
    setShuffleMode(!shuffleMode);
    if (!shuffleMode) {
      ToastAndroid.show('Phát ngẫu nhiên: Bật', ToastAndroid.SHORT);

      const currentQueue = await getQueue();
      const shuffledQueue = shuffleArray(currentQueue);
      const arr = [];
      for (let i = 0; i < shuffledQueue.length; i++) {
        const index = playList.items.findIndex(
          items => items.encodeId == shuffledQueue[i].id,
        );
        arr.push(playList.items[index]);
      }
      setPlayList({
        ...playList,
        items: arr,
      });
      await setQueueUninterrupted(shuffledQueue);
    } else {
      ToastAndroid.show('Phát ngẫu nhiên: Tắt', ToastAndroid.SHORT);
      const currentQueue = await getQueue();
      for (let i = 0; i < currentQueue.length; i++) {
        if (isPlayFromLocal) {
          currentQueue[i] = {
            ...objectToTrack(tempPlayList.items[i]),
            url: tempPlayList.items[i].url,
            artwork: tempPlayList.items[i].thumbnail || DEFAULT_IMG,
          };
        } else {
          currentQueue[i] = objectToTrack(tempPlayList.items[i]);
        }
      }
      setPlayList({
        ...playList,
        items: tempPlayList.items,
      });
      await setQueueUninterrupted(currentQueue);
    }
  }
  return (
    <TouchableOpacity
      onPress={shuffleQueueUninterrupted}
      activeOpacity={0.8}
      className="items-start justify-center flex-1">
      <Feather
        name="shuffle"
        size={20}
        color={shuffleMode ? COLOR.PRIMARY : COLOR.TEXT_PRIMARY}
      />
    </TouchableOpacity>
  );
};

export default ShuffleButton;
