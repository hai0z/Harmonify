import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LocalSong from './components/LocalSong';
import Playlist from './components/Playlist';
import useThemeStore from '../../store/themeStore';
const LibrarySrceens = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const {COLOR} = useThemeStore(state => state);
  return (
    <View style={{...styles.container, backgroundColor: COLOR.BACKGROUND}}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <Image
            resizeMode="cover"
            style={styles.avatar}
            source={require('../../assets/evil.png')}
          />
          <Text style={{...styles.txt, color: COLOR.TEXT_PRIMARY}}>
            Thư viện
          </Text>
        </View>
        <TouchableOpacity>
          <AntDesign
            name="plus"
            size={24}
            style={{color: COLOR.TEXT_PRIMARY, ...styles.plusIcon}}
          />
        </TouchableOpacity>
      </View>
      <View className="h-10 flex-row items-center mx-4">
        {['Danh sách phát', 'Nghệ sĩ', 'Đã tải xuống'].map((item, index) => (
          <TouchableOpacity
            onPress={() => setSelectedTab(index)}
            key={index}
            style={{
              backgroundColor:
                selectedTab === index ? COLOR.PRIMARY : 'transparent',
            }}
            className="items-center justify-center mr-2 rounded-full px-2 py-1">
            <Text style={{color: COLOR.TEXT_PRIMARY}}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex-1">
        {selectedTab === 0 && <Playlist />}
        {selectedTab === 2 && <LocalSong />}
      </View>
    </View>
  );
};

export default LibrarySrceens;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  top: {
    height: 65,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontWeight: 'bold',
    fontSize: 24,

    marginLeft: 16,
  },
  plusIcon: {},
});
