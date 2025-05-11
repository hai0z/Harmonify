import {View, Text, Dimensions, ScrollView} from "react-native";
import React, {useCallback, useContext} from "react";
import TrackItem from "../../../components/track-item/TrackItem";
import {handlePlay} from "../../../service/trackPlayerService";
import {PlayerContext} from "../../../context/PlayerProvider";
import useThemeStore from "../../../store/themeStore";
import {usePlayerStore} from "../../../store/playerStore";

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
const SCREEN_WIDTH = Dimensions.get("window").width;
const NewRelease = ({data}: Props) => {
  const filteredSongs =
    data?.items?.all?.filter((item: any) => item.streamingStatus === 1) || [];

  const allPage = paginateArray(filteredSongs, 3);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);
  const COLOR = useThemeStore(state => state.COLOR);

  const handlePlaySong = useCallback(
    (song: any) => {
      handlePlay(song, {
        id: "new-release",
        items: filteredSongs,
      });
      setPlayFrom({
        id: "playlist",
        name: "Bài hát mới phát hành",
      });
    },
    [filteredSongs]
  );

  const {showBottomSheet} = useContext(PlayerContext);

  const currentSong = usePlayerStore(state => state.currentSong);

  if (!data?.items?.all?.length) {
    return null;
  }

  return (
    <View className="mt-4">
      <Text
        className="text-xl flex justify-between items-end uppercase mx-4 mb-4"
        style={{color: COLOR.TEXT_PRIMARY}}>
        Mới phát hành
      </Text>
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}>
          {allPage.map((page, pageIndex) => (
            <View key={pageIndex} style={{width: SCREEN_WIDTH}}>
              {page.map((item, index) => (
                <TrackItem
                  key={item.encodeId}
                  isActive={currentSong?.id === item?.encodeId}
                  item={item}
                  onClick={handlePlaySong}
                  showBottomSheet={showBottomSheet}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default NewRelease;
