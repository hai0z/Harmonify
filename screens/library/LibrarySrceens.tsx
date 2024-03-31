import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import {usePlayerStore} from '../../store/playerStore';
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
            source={{
              uri: 'https://timanhdep.com/wp-content/uploads/2022/06/hinh-avatar-anime-nu-de-thuong-cuc-cute-06.jpg',
            }}
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
            className="h-[30px] items-center justify-center mx-[7px] px-[15px] rounded-[12px] border">
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
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
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
