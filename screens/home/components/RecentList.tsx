import {View, Text, Image} from 'react-native';
import React, {memo, useCallback, useMemo} from 'react';
import useThemeStore from '../../../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {handlePlay, objectToTrack} from '../../../service/trackPlayerService';
import {usePlayerStore} from '../../../store/playerStore';
import RecentTrackItem from '../../../components/track-item/RecentTrackItem';

const RecentList = ({data}: any) => {
  const COLOR = useThemeStore(state => state.COLOR);

  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const id = useMemo(() => Math.random().toString(36).substring(7), []);

  const currentSong = usePlayerStore(state => state.currentSong);

  const handlePlaySong = useCallback(
    (song: any) => {
      setCurrentSong(objectToTrack(song));
      handlePlay(song, {
        id,
        items: data,
      });
      setPlayFrom({
        id: 'history',
        name: 'Bài hát gần đây',
      });
    },
    [data],
  );
  const renderData = useMemo(() => data?.slice(0, 6), [data]);

  if (data.length < 6 || !data) return null;
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
        {renderData?.map((e: any, index: number) => {
          console.log('vai lz');
          return (
            <RecentTrackItem
              key={index}
              e={e}
              onClick={handlePlaySong}
              isActive={currentSong?.id === e?.encodeId}
            />
          );
        })}
      </View>
    </View>
  );
};

export default memo(RecentList);
