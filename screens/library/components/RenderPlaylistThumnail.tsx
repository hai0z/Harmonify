import {Image, View} from 'react-native';
import getThumbnail from '../../../utils/getThumnail';
import React from 'react';
import useThemeStore from '../../../store/themeStore';
import tinycolor from 'tinycolor2';

interface Props {
  playlistLength: number;
  songs: any[];
  width: number;
  height: number;
}
const RenderPlaylistThumbnail = ({
  playlistLength,
  songs,
  width,
  height,
}: Props) => {
  const {COLOR} = useThemeStore();
  const renderImg: Record<number, React.JSX.Element> = {
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
          source={{uri: getThumbnail(songs[0]?.thumbnail, 360)}}
          style={{width: '100%', height: '100%'}}
        />
      </View>
    ),
    2: (
      <View
        className="z-50 flex-row justify-between flex-wrap"
        style={[
          {
            width,
            height,
            backgroundColor: !COLOR.isDark
              ? tinycolor(COLOR.BACKGROUND).darken(10).toString()
              : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
          },
        ]}>
        <Image
          source={{uri: getThumbnail(songs[0]?.thumbnail, 360)}}
          style={{width: width / 2, height: height / 2}}
        />
        <View style={{width: width / 2, height: height / 2}}></View>
        <View style={{width: width / 2, height: height / 2}}></View>
        <Image
          source={{uri: getThumbnail(songs[1]?.thumbnail, 360)}}
          style={{width: width / 2, height: height / 2}}
        />
      </View>
    ),
    3: (
      <View
        className="z-50 flex-row justify-between flex-wrap"
        style={[
          {
            width,
            height,
            backgroundColor: !COLOR.isDark
              ? tinycolor(COLOR.BACKGROUND).darken(10).toString()
              : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
          },
        ]}>
        <View
          style={{width: width / 2, height: height}}
          className="flex flex-col">
          <Image
            source={{uri: getThumbnail(songs[0]?.thumbnail, 360)}}
            style={{width: width / 2, height: height / 2}}
          />
          <Image
            source={{uri: getThumbnail(songs[1]?.thumbnail, 360)}}
            style={{width: width / 2, height: height / 2}}
          />
        </View>
        <View
          style={{width: width / 2, height: height}}
          className="flex flex-col justify-center">
          <Image
            source={{uri: getThumbnail(songs[2]?.thumbnail, 360)}}
            style={{width: width / 2, height: height / 2}}
          />
        </View>
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
          source={{
            uri: getThumbnail(songs[playlistLength - 1]?.thumbnail, 360),
          }}
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <Image
          source={{
            uri: getThumbnail(songs[playlistLength - 2]?.thumbnail, 360),
          }}
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <Image
          source={{
            uri: getThumbnail(songs[playlistLength - 3]?.thumbnail, 360),
          }}
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <Image
          source={{
            uri: getThumbnail(songs[playlistLength - 4]?.thumbnail, 360),
          }}
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
      </View>
    ),
  };
  return renderImg[playlistLength >= 4 ? 4 : playlistLength];
};

export default RenderPlaylistThumbnail;
