import {Image, View} from 'react-native';
import getThumbnail from '../../../utils/getThumnail';

const RenderPlaylistThumbnail = ({
  playlistLength,
  songs,
  width,
  height,
}: {
  playlistLength: number;
  songs: any;
  width: number;
  height: number;
}) => {
  const renderImg: Record<number, any> = {
    1: (
      <View
        className="z-50"
        style={[
          {
            width,
            height,
          },
        ]}>
        <Image
          source={{uri: getThumbnail(songs[0]?.thumbnail)}}
          style={{width: '100%', height: '100%'}}
        />
      </View>
    ),
    4: (
      <View
        className="flex flex-row flex-wrap z-50"
        style={[
          {
            width,
            height,
          },
        ]}>
        <Image
          source={{uri: getThumbnail(songs[0]?.thumbnail)}}
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <Image
          source={{uri: getThumbnail(songs[1]?.thumbnail)}}
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <Image
          source={{uri: getThumbnail(songs[2]?.thumbnail)}}
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <Image
          source={{uri: getThumbnail(songs[3]?.thumbnail)}}
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
      </View>
    ),
  };
  return renderImg[playlistLength >= 4 ? 4 : 1];
};

export default RenderPlaylistThumbnail;
