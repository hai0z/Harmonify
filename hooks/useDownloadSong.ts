import {ToastAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import useToastStore, {ToastTime} from '../store/toastStore';
import nodejs from 'nodejs-mobile-react-native';

nodejs.channel.addListener('downloadSong', async data => {
  if (data.data === 'NULL') {
    ToastAndroid.show('Không tải được bài hát', ToastAndroid.SHORT);
    return;
  }
  const {config, fs} = RNFetchBlob;
  const downloads = fs.dirs.DownloadDir;
  return config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: data.track.title,
      path: downloads + '/' + data.track?.title + '.mp3',
      description: 'Tải xuống bài hát',
    },
  })
    .fetch('GET', data.data['128'])
    .then(_ => {
      ToastAndroid.show('Đã tải xuống', ToastAndroid.SHORT);
    })
    .catch(err => {
      useToastStore.getState().show(err, ToastTime.SHORT);
    });
});

const useDownloadSong = () => {
  async function downloadFile(song: any) {
    ToastAndroid.show('Đang tải xuống', ToastAndroid.LONG);
    nodejs.channel.post('downloadSong', song);
  }
  return {
    downloadFile,
  };
};

export default useDownloadSong;
