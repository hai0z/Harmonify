import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LocalSong from './components/LocalSong';
import Playlist from './components/Playlist';
import useThemeStore from '../../store/themeStore';
import FollowedArtist from './components/FollowedArtists';
import {ScrollView} from 'react-native-gesture-handler';
import tinycolor from 'tinycolor2';
import {Octicons} from '@expo/vector-icons';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import useLibraryStore from '../../store/useLibraryStore';
import {useNavigation} from '@react-navigation/native';
import {navigation} from '../../utils/types/RootStackParamList';

const LibrarySrceens = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const {COLOR} = useThemeStore();
  const {viewType, setViewType} = useLibraryStore();
  const navigation = useNavigation<navigation<'Library' | 'PlaylistStack'>>();

  return (
    <View style={{...styles.container, backgroundColor: COLOR.BACKGROUND}}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <View className="rounded-full">
            <Image
              resizeMode="cover"
              style={styles.avatar}
              source={require('../../assets/sound.png')}
            />
          </View>
          <Text style={{...styles.txt, color: COLOR.TEXT_PRIMARY}}>
            Thư viện
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('PlaylistStack', {})}>
          <AntDesign
            name="plus"
            size={24}
            style={{color: COLOR.TEXT_PRIMARY}}
          />
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 10,
            minWidth: widthPercentageToDP(100),
          }}>
          {['Danh sách phát', 'Nghệ sĩ', 'Đã tải xuống'].map((item, index) => (
            <TouchableOpacity
              onPress={() => setSelectedTab(index)}
              key={index}
              style={{
                backgroundColor:
                  selectedTab === index
                    ? COLOR.PRIMARY
                    : !COLOR.isDark
                    ? tinycolor(COLOR.BACKGROUND).darken(10).toString()
                    : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
              }}
              className="items-center justify-center rounded-full px-2 py-1">
              <Text style={{color: COLOR.TEXT_PRIMARY}}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View className="flex flex-row justify-end px-4 items-center py-2">
          <TouchableOpacity
            onPress={() => {
              setViewType(viewType === 'grid' ? 'list' : 'grid');
            }}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            {viewType === 'list' ? (
              <Octicons name="apps" size={20} color={COLOR.TEXT_PRIMARY} />
            ) : (
              <Octicons
                name="list-unordered"
                size={20}
                color={COLOR.TEXT_PRIMARY}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className=" flex-1" showsVerticalScrollIndicator={false}>
        {selectedTab === 0 && <Playlist />}
        {selectedTab === 1 && <FollowedArtist />}
        {selectedTab === 2 && <LocalSong />}
      </ScrollView>
    </View>
  );
};

export default LibrarySrceens;
const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    flex: 1,
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
});
