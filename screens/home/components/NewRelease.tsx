import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import React, {useCallback, useContext, useEffect} from 'react';
import TrackItem from '../../../components/TrackItem';
import {handlePlay} from '../../../service/trackPlayerService';
import {PlayerContext} from '../../../context/PlayerProvider';
import useThemeStore from '../../../store/themeStore';
import {usePlayerStore} from '../../../store/playerStore';
import {FlatList} from 'react-native-gesture-handler';

function paginateArray(data: any[], itemsPerPage: number) {
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const paginatedArray = [];
  for (let i = 0; i < totalPages; i++) {
    const startIndex = i * itemsPerPage;
    const page = data?.slice(startIndex, startIndex + itemsPerPage);
    paginatedArray.push(page);
  }
  return paginatedArray;
}

interface Props {
  data: {
    items: {
      all: any[];
    };
  };
}
const SCREEN_WIDTH = Dimensions.get('window').width;
const NewRelease = ({data}: Props) => {
  const allPage = paginateArray(
    data?.items?.all.filter((item: any) => item.streamingStatus === 1),
    3,
  );

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);
  const COLOR = useThemeStore(state => state.COLOR);

  const {startMiniPlayerTransition} = useContext(PlayerContext);

  const handlePlaySong = useCallback((song: any) => {
    handlePlay(song, {
      id: 'new-release',
      items: data?.items?.all.filter((item: any) => item.streamingStatus === 1),
    });
    setPlayFrom({
      id: 'playlist',
      name: 'Bài hát mới phát hành',
    });

    // startMiniPlayerTransition();
  }, []);

  const {showBottomSheet} = useContext(PlayerContext);
  return (
    <View className="mt-4">
      <Text
        className="text-xl flex justify-between items-end uppercase mx-4 mb-4"
        style={{color: COLOR.TEXT_PRIMARY}}>
        Mới phát hành
      </Text>
      <View className="flex-1">
        <FlatList
          horizontal
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          data={allPage}
          renderItem={({item}) => (
            <View style={{width: SCREEN_WIDTH}} className="flex-1">
              <FlatList
                keyExtractor={(_, index) => index.toString()}
                data={item}
                renderItem={({item}) => (
                  <TrackItem
                    item={item}
                    onClick={handlePlaySong}
                    showBottomSheet={showBottomSheet}
                  />
                )}></FlatList>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default NewRelease;
