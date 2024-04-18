import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import React, {useCallback, useContext, useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import TrackItem from '../../../components/TrackItem';
import {handlePlay} from '../../../service/trackPlayerService';
import {PlayerContext} from '../../../context/PlayerProvider';
import useThemeStore from '../../../store/themeStore';
import {usePlayerStore} from '../../../store/playerStore';

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
      vPop: any[];
      others: any[];
    };
  };
}
const SCREEN_WIDTH = Dimensions.get('window').width;
const NewRelease = ({data}: Props) => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const allPage = paginateArray(data?.items?.all, 4);
  const vPopPage = paginateArray(data?.items?.vPop, 4);
  const othersPage = paginateArray(data?.items?.others, 4);

  const listRef = React.useRef<FlashList<any>>(null);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);
  const COLOR = useThemeStore(state => state.COLOR);

  useEffect(() => {
    listRef.current?.scrollToIndex({index: 0});
  }, [tabIndex]);

  const {startMiniPlayerTransition} = useContext(PlayerContext);
  const dataList = [allPage, vPopPage, othersPage];
  const handlePlaySong = useCallback(
    (song: any) => {
      handlePlay(song, {
        id: 'new-release' + tabIndex,
        items:
          tabIndex === 0
            ? data?.items?.all
            : tabIndex === 1
            ? data?.items?.vPop
            : data?.items?.others,
      });
      setPlayFrom({
        id: 'playlist',
        name: 'Bài hát mới phát hành',
      });

      startMiniPlayerTransition();
    },
    [tabIndex],
  );

  const {showBottomSheet} = useContext(PlayerContext);
  return (
    <View>
      <Text
        className="text-xl flex justify-between items-end mt-4 mb-3 uppercase mx-4 "
        style={{color: COLOR.TEXT_PRIMARY}}>
        Mới phát hành
      </Text>
      <View className="flex-row gap-4 px-4 py-2">
        {['Tất cả', 'VPop', 'Khác'].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setTabIndex(index)}
            className="mx-4 px-3 rounded-full"
            style={{
              backgroundColor:
                tabIndex === index ? COLOR.PRIMARY : 'transparent',
            }}>
            <Text
              key={index}
              className="text-base"
              style={{color: COLOR.TEXT_PRIMARY}}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex-1">
        <FlashList
          ref={listRef}
          horizontal
          pagingEnabled
          estimatedItemSize={SCREEN_WIDTH}
          keyExtractor={(_, index) => index.toString()}
          data={dataList[tabIndex]}
          renderItem={({item}) => (
            <View
              style={{width: SCREEN_WIDTH, minHeight: 3}}
              className="flex-1">
              <FlashList
                data={item}
                estimatedItemSize={70}
                renderItem={({item}) => (
                  <TrackItem
                    item={item}
                    onClick={handlePlaySong}
                    showBottomSheet={showBottomSheet}
                  />
                )}></FlashList>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default NewRelease;
