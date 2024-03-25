import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {usePlayerStore} from '../../store/playerStore';
import {getInfoSong} from '../../apis/song';
import dayjs from 'dayjs';
import nodejs from 'nodejs-mobile-react-native';
import {useActiveTrack} from 'react-native-track-player';
const SongInfoCard = () => {
  const {color} = usePlayerStore(state => state);
  const currentSong = useActiveTrack();

  const bgColor = color.vibrant === '#0098DB' ? color.average : color.vibrant;

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

  if (loading || currentSong === undefined) {
    return null;
  }
  return (
    <View
      style={{backgroundColor: bgColor}}
      className="w-full mt-8 rounded-2xl px-4 py-2 flex justify-between">
      <Text className="text-white font-bold text-[18px]">
        Phát hành lúc {dayjs.unix(data?.releaseDate).format('DD/MM/YYYY')}
      </Text>
      <Text className="text-white">
        Tác giả :{' '}
        {data?.composers?.map((e: any) => e?.name).join(', ') || 'không rõ'}
      </Text>
      <Text className="text-white">
        Thể loại: {data?.genres?.map((e: any) => e?.name).join(', ')}
      </Text>
      <Text className="text-white">
        Nghệ sĩ: {data?.artists?.map((e: any) => e?.name).join(', ')}
      </Text>
      <Text className="text-white">{data?.like} lượt thích</Text>
    </View>
  );
};

export default SongInfoCard;
