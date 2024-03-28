import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import TrackItem from '../../../components/TrackItem';
import {COLOR} from '../../../constants';
import {handlePlay} from '../../../utils/musicControl';

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
  const allPage = paginateArray(data?.items?.all, 3);
  const vPopPage = paginateArray(data?.items?.vPop, 3);
  const othersPage = paginateArray(data?.items?.others, 3);

  const listRef = React.useRef<FlatList>(null);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    listRef.current?.scrollToIndex({index: 0});
  }, [tabIndex]);

  const dataList = [allPage, vPopPage, othersPage];
  const handlePlaySong = (song: any) => {
    handlePlay(song, {
      id: 'new-release' + tabIndex,
      items:
        tabIndex === 0
          ? data?.items?.all
          : tabIndex === 1
          ? data?.items?.vPop
          : data?.items?.others,
    });
  };
  return (
    <View>
      <Text className="text-xl flex justify-between items-end mt-4 mb-3 uppercase mx-4 text-white">
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
            <Text key={index} className="text-white text-base">
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Animated.FlatList
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        ref={listRef}
        horizontal
        pagingEnabled
        initialNumToRender={4}
        keyExtractor={(_, index) => index.toString()}
        data={dataList[tabIndex]}
        renderItem={({item}) => (
          <ScrollView style={{width: SCREEN_WIDTH}}>
            {item.map((e: any, index: number) => (
              <TrackItem
                item={e}
                key={index}
                onClick={() => handlePlaySong(e)}
              />
            ))}
          </ScrollView>
        )}
      />
    </View>
  );
};

export default NewRelease;
