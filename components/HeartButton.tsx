import {TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';
import useToggleLikeSong from '../hooks/useToggleLikeSong';
import {usePlayerStore} from '../store/playerStore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useThemeStore from '../store/themeStore';

interface Props {
  heartIconSize: number;
}
const HeartButton = ({heartIconSize}: Props) => {
  const heartScale = useSharedValue(1);
  const {tempSong, currentSong} = usePlayerStore(state => state);
  const {handleAddToLikedList, isLiked} = useToggleLikeSong(currentSong?.id);
  const {COLOR} = useThemeStore(state => state);

  useEffect(() => {
    heartScale.value = withTiming(1.2, {duration: 250}, () => {
      heartScale.value = withTiming(1, {duration: 250});
    });
  }, [isLiked, currentSong?.id]);

  return (
    <Animated.View style={{transform: [{scale: heartScale}]}}>
      <TouchableOpacity
        onPress={() => {
          handleAddToLikedList(tempSong);
        }}>
        <AntDesign
          name={isLiked ? 'heart' : 'hearto'}
          size={heartIconSize}
          color={isLiked ? 'red' : COLOR.TEXT_PRIMARY}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default HeartButton;
