import {View, Text, Image} from 'react-native';
import React, {useContext} from 'react';
import useThemeStore from '../../../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import tinycolor from 'tinycolor2';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {handlePlay} from '../../../service/trackPlayerService';
import {usePlayerStore} from '../../../store/playerStore';
import {PlayerContext} from '../../../context/PlayerProvider';
import {runOnJS} from 'react-native-reanimated';
const RecentList = ({data}: any) => {
  const {COLOR} = useThemeStore();
  const {setPlayFrom} = usePlayerStore();
  const {startMiniPlayerTransition} = useContext(PlayerContext);
  const handlePlaySong = (song: any) => {
    handlePlay(song, {
      id: song.encodeId,
      items: data,
    });
    setPlayFrom({
      id: 'history',
      name: 'Bài hát gần đây',
    });
    startMiniPlayerTransition();
  };
  if (data.length < 6) return null;
  return (
    <View>
      <Text
        className="text-xl flex justify-between items-end mt-4 mb-3 uppercase mx-4 "
        style={{color: COLOR.TEXT_PRIMARY}}>
        Nghe Lại
      </Text>
      <View
        className="flex flex-wrap flex-row justify-between items-center px-4"
        style={{
          width: wp(100),
        }}>
        {data?.map((e: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => handlePlaySong(e)}
              activeOpacity={0.8}
              key={index}
              style={{
                width: wp(50) - 20,
                backgroundColor: COLOR.isDark
                  ? tinycolor(COLOR.BACKGROUND).brighten().toString()
                  : '#ffffff',
                elevation: 0.5,
              }}
              className="flex flex-row items-center my-1 rounded-t-md rounded-b-md">
              <Image
                source={{uri: e?.thumbnailM}}
                className="rounded-tl-md rounded-bl-md"
                style={{width: wp(15), height: wp(15)}}
              />
              <Text
                className="px-1"
                numberOfLines={2}
                style={{
                  color: COLOR.TEXT_PRIMARY,
                  fontWeight: '600',
                  flex: 1,
                  fontSize: wp(3.5),
                }}>
                {e?.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default RecentList;
