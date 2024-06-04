import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import useThemeStore from '../../store/themeStore';
import useInternetState from '../../hooks/useInternetState';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActiveTrackAnimation from './ActiveTrackAnimation';
import tinycolor from 'tinycolor2';
import {GREEN} from '../../constants';
interface Props {
  e: any;
  onClick: (item: any) => void;
  isActive: boolean;
}
const RecentTrackItem = (props: Props) => {
  const {e, onClick, isActive} = props;
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);
  const isConnected = useInternetState();
  return (
    <TouchableOpacity
      disabled={!isConnected}
      onPress={() => onClick(e)}
      activeOpacity={0.8}
      style={{
        width: wp(50) - 20,
        backgroundColor: COLOR.isDark
          ? tinycolor(COLOR.BACKGROUND).brighten().toString()
          : '#ffffff',
        elevation: 1,
        opacity: isConnected ? 1 : 0.5,
      }}
      className="flex flex-row items-center my-1 rounded-t-md rounded-b-md">
      <View>
        <Image
          source={{uri: e?.thumbnailM}}
          className="rounded-tl-md rounded-bl-md"
          style={{width: wp(15), height: wp(15)}}
        />
        {isActive && (
          <ActiveTrackAnimation
            isAlbum={false}
            style={{
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
            }}
          />
        )}
      </View>
      <Text
        className="px-1"
        numberOfLines={2}
        style={{
          color: isActive
            ? theme !== 'amoled'
              ? COLOR.PRIMARY
              : GREEN
            : COLOR.TEXT_PRIMARY,
          fontWeight: '600',
          flex: 1,
          fontSize: wp(3.5),
        }}>
        {e?.title}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(RecentTrackItem);
