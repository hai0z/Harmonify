import {View} from 'react-native';
import React from 'react';
import {useProgress} from 'react-native-track-player';
import useThemeStore from '../../../store/themeStore';

const MiniPlayerProgress = () => {
  const {COLOR} = useThemeStore(state => state);
  const progress = useProgress(1000 / 120); //120fps
  return (
    <View
      style={{
        height: 2.5,
        maxWidth: '100%',
        position: 'relative',
        marginHorizontal: 8,
        bottom: 1.5,
        borderRadius: 2.5,
        backgroundColor: COLOR.isDark ? '#ffffff50' : '#00000020',
        zIndex: 2,
      }}>
      <View
        style={{
          width: `${(progress.position / progress.duration) * 100}%`,
          height: 2.5,
          backgroundColor: COLOR.TEXT_PRIMARY,
          position: 'absolute',
          borderTopLeftRadius: 2.5,
          borderBottomLeftRadius: 2.5,
        }}
      />
    </View>
  );
};

export default MiniPlayerProgress;
