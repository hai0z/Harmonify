import {Text, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {usePlayerStore} from '../../store/playerStore';
import dayjs from 'dayjs';
import nodejs from 'nodejs-mobile-react-native';
import useThemeStore from '../../store/themeStore';
import Animated from 'react-native-reanimated';
import useImageColor from '../../hooks/useImageColor';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Headphone, Heart} from 'iconsax-react-native';

function formatNumber(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'; // Tỷ
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
}
const SongInfoCard = () => {
  const currentSong = usePlayerStore(state => state.currentSong);

  const {COLOR} = useThemeStore(state => state);

  const {vibrantColor: bg} = useImageColor();

  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    nodejs.channel.addListener('getSongInfo', (data: any) => {
      setData(data);
      setLoading(false);
    });
    nodejs.channel.post('getSongInfo', currentSong?.id);
  }, [currentSong?.id]);

  if (
    loading ||
    currentSong === undefined ||
    usePlayerStore.getState().isPlayFromLocal ||
    data === null
  ) {
    return null;
  }
  return (
    <Animated.View
      style={{backgroundColor: bg}}
      className="w-full rounded-2xl px-4 py-2 flex justify-between">
      <Text
        style={{
          color: COLOR.TEXT_PRIMARY,
          fontFamily: 'SVN-Gotham Black',
          fontSize: widthPercentageToDP(5),
        }}>
        {data?.releaseDate
          ? `Ngày phát hành: ${dayjs
              .unix(data?.releaseDate)
              .format('DD/MM/YYYY')}`
          : 'Ngày phát hành: không rõ'}
      </Text>
      <Text style={{color: COLOR.TEXT_PRIMARY}}>
        Tác giả :{' '}
        {data?.composers?.map((e: any) => e?.name).join(', ') || 'không rõ'}
      </Text>
      <Text style={{color: COLOR.TEXT_PRIMARY}}>
        Thể loại: {data?.genres?.map((e: any) => e?.name).join(', ')}
      </Text>
      <Text style={{color: COLOR.TEXT_PRIMARY}}>
        Nghệ sĩ: {data?.artists?.map((e: any) => e?.name).join(', ')}
      </Text>
      <View className="flex flex-row mt-1">
        <View className="flex flex-row  items-center mr-2 gap-x-1">
          <Heart size="18" color={COLOR.TEXT_PRIMARY} variant="Bold" />
          <Text style={{color: COLOR.TEXT_PRIMARY}}>
            {formatNumber(data?.like)}
          </Text>
        </View>
        <View className="flex flex-row  items-center gap-x-1">
          <Headphone size="18" color={COLOR.TEXT_PRIMARY} variant="Bold" />
          <Text style={{color: COLOR.TEXT_PRIMARY}}>
            {formatNumber(data?.listen)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default SongInfoCard;
