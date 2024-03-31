import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LocalSong from './components/LocalSong';
import Playlist from './components/Playlist';
import {COLOR} from '../../constants';
const LibrarySrceens = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <Image
            resizeMode="cover"
            style={styles.avatar}
            source={require('../../assets/evil.png')}
          />
          <Text style={styles.txt}>Thư viện</Text>
        </View>
        <TouchableOpacity>
          <AntDesign name="plus" size={24} style={styles.plusIcon} />
        </TouchableOpacity>
      </View>
      <View className="h-10 flex-row items-center">
        {['Danh sách phát', 'Nghệ sĩ', 'Đã tải xuống'].map((item, index) => (
          <TouchableOpacity
            onPress={() => setSelectedTab(index)}
            key={index}
            style={{
              borderColor: !selectedTab ? '#dbdbdb' : 'none',
              backgroundColor:
                selectedTab === index ? COLOR.PRIMARY : 'transparent',
            }}
            className="items-center justify-center mx-2 rounded-full px-2 py-1">
            <Text style={{color: '#fff'}}>{item}</Text>
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
    backgroundColor: '#121212',
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
    paddingHorizontal: 10,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
    marginLeft: 10,
  },
  plusIcon: {
    color: '#bdbdbd',
  },
});
