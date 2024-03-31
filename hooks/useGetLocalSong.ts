import { View, Text, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { SortSongFields, SortSongOrder, getAll } from 'react-native-get-music-files';
import { PERMISSIONS, RESULTS, check, request, requestMultiple } from 'react-native-permissions';
import useToastStore, { ToastTime } from '../store/toastStore';

const hasPermissions = async () => {
  if (Platform.OS === 'android') {
    let hasPermission: any =
      (await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)) ===
      RESULTS.GRANTED ||
      (await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO)) === RESULTS.GRANTED;
    if (!hasPermission) {
      hasPermission = await requestMultiple([
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      ]);
    }

    return hasPermission;
  }

  if (Platform.OS === 'ios') {
    let hasPermission =
      (await check(PERMISSIONS.IOS.MEDIA_LIBRARY)) === RESULTS.GRANTED;
    if (!hasPermission) {
      hasPermission =
        (await request(PERMISSIONS.IOS.MEDIA_LIBRARY)) === RESULTS.GRANTED;
    }
    return hasPermission;
  }

  return false;
};
const useGetLocalSong = () => {
  const [localSong, setLocalSong] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  useEffect(() => {
    const getLocalSong = async () => {
      const permissions = await hasPermissions();
      if (permissions) {
        const songsOrError = await getAll({
          limit: 20,
          offset: 0,
          coverQuality: 50,
          minSongDuration: 1000,
          sortBy: SortSongFields.TITLE,
          sortOrder: SortSongOrder.DESC,
        });

        if (typeof songsOrError === 'string') {
          setIsLoading(false)
          useToastStore.getState().show(songsOrError, ToastTime.SHORT);
          return;
        } else {
          setLocalSong(
            songsOrError.map((song: any, index) => ({
              title: song.title,
              artistsNames: song.artist,
              duration: song.duration / 1000,
              thumbnail: song.cover,
              url: `file://${song.url}`,
              encodeId: index,
            })),
          );
          setIsLoading(false)
        }
      }
    };
    getLocalSong();
  }, []);
  return (
    { isLoading, localSong }
  )
}

export default useGetLocalSong