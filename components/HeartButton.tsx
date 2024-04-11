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
  const {handleAddToLikedList, isLiked} = useToggleLikeSong();
  const heartScale = useSharedValue(1);
  const {tempSong} = usePlayerStore(state => state);
  const {COLOR} = useThemeStore(state => state);
  useEffect(() => {
    if (isLiked) {
      heartScale.value = withTiming(1.2, {duration: 250}, () => {
        heartScale.value = withTiming(1, {duration: 250});
      });
    } else {
      heartScale.value = withTiming(1.2, {duration: 250}, () => {
        heartScale.value = withTiming(1, {duration: 250});
      });
    }
  }, [isLiked]);
  return (
    <Animated.View style={{transform: [{scale: heartScale}], zIndex: 2}}>
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
