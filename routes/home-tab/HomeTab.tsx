import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreens from '../../screens/home/HomeScreens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'expo-status-bar';
import MiniPlayer from '../../components/Player/MiniPlayer';

import {Text, View} from 'react-native';
import PlaylistDetail from '../../screens/PlaylistDetail';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import ArtistScreens from '../../screens/artist/ArtistScreens';
import ChartScreens from '../../screens/ChartScreens';
import LinearGradient from 'react-native-linear-gradient';
import ArtistSong from '../../screens/artist/ArtistSong';
import LibrarySrceens from '../../screens/library/LibrarySrceens';
import LikedSong from '../../screens/library/LikedSong';
import MyPlaylist from '../../screens/library/MyPlaylist';
import {GREEN, MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from '../../constants';
import TrackItemBottomSheet from '../../components/bottom-sheet/TrackItemBottomSheet';
import LocalSong from '../../screens/library/LocalSong';
import useThemeStore from '../../store/themeStore';
import HistoryScreens from '../../screens/HistoryScreens';
import Animated, {
  FadeInDown,
  FadeOutDown,
  withTiming,
} from 'react-native-reanimated';
import useInternetState from '../../hooks/useInternetState';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {RootStackParamList} from '../../utils/types/RootStackParamList';
import SearchScreensStack from './SearchStack';
import SettingStack from '../SettingStack';
import {Chart2, Home2, MusicLibrary2, SearchNormal} from 'iconsax-react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const LibStack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

const HomeWrapper = () => {
  const {COLOR} = useThemeStore();

  return (
    <View
      className="flex-1 h-full w-full relative "
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <StatusBar backgroundColor={`transparent`} style="auto" />
      <HomeTab />
      <TrackItemBottomSheet />
    </View>
  );
};

const LibraryStack = () => {
  return (
    <LibStack.Navigator screenOptions={{headerShown: false}}>
      <LibStack.Screen name="Library" component={LibrarySrceens} />
      <LibStack.Screen
        name="MyPlaylist"
        component={MyPlaylist}
        options={{animation: 'ios'}}
      />
      <LibStack.Screen
        name="LocalSong"
        component={LocalSong}
        options={{animation: 'ios'}}
      />

      <LibStack.Screen
        name="LikedSong"
        component={LikedSong}
        options={{animation: 'ios'}}
      />
      <LibStack.Screen
        name="PlayListDetail"
        component={PlaylistDetail}
        options={{
          animation: 'ios',
        }}
      />
      <LibStack.Screen
        name="Artists"
        component={ArtistScreens}
        options={{
          animation: 'ios',
        }}
      />
      <LibStack.Screen
        name="ArtistsSong"
        component={ArtistSong}
        options={{
          animation: 'ios',
        }}
      />
    </LibStack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreens} />
      <Stack.Screen
        name="History"
        component={HistoryScreens}
        options={{
          animation: 'ios',
        }}
      />
      <Stack.Screen
        name="SettingStack"
        component={SettingStack}
        options={{animation: 'ios'}}
      />
      <Stack.Screen
        name="PlayListDetail"
        component={PlaylistDetail}
        options={{
          animation: 'ios',
        }}
      />
      <Stack.Screen
        name="Artists"
        component={ArtistScreens}
        options={{
          animation: 'ios',
        }}
      />
      <Stack.Screen
        name="ArtistsSong"
        component={ArtistSong}
        options={{
          animation: 'ios',
        }}
      />
    </Stack.Navigator>
  );
};

const HomeTab = () => {
  const {COLOR, theme} = useThemeStore();
  const isConnected = useInternetState();
  return (
    <Tab.Navigator
      tabBar={props => (
        <View className="relative">
          <MiniPlayer />
          {!isConnected && (
            <Animated.View
              entering={FadeInDown.duration(200).springify().delay(250)}
              exiting={FadeOutDown.duration(200).springify().delay(250)}>
              <View
                className="h-[15px] absolute"
                style={{
                  bottom: TABBAR_HEIGHT + MINI_PLAYER_HEIGHT,
                  width: widthPercentageToDP(96),
                  transform: [{translateX: widthPercentageToDP(2)}],
                  borderRadius: 2,
                  backgroundColor: COLOR.BACKGROUND,
                }}>
                <Text
                  className="text-xs text-center"
                  style={{color: COLOR.TEXT_PRIMARY}}>
                  MU Music đang ở chế độ offline
                </Text>
              </View>
            </Animated.View>
          )}
          <BottomTabBar {...props} />
          <LinearGradient
            locations={[0, 0.6]}
            colors={['transparent', `${COLOR.BACKGROUND}`]}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: TABBAR_HEIGHT,
            }}
          />
        </View>
      )}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarIcon: ({color, focused}) => {
          switch (route.name) {
            case 'HomeTab':
              return (
                <Home2
                  size="24"
                  color={color}
                  variant={focused ? 'Bold' : 'Outline'}
                />
              );
            case 'Chart':
              return (
                <Chart2
                  size={24}
                  color={color}
                  variant={focused ? 'Bold' : 'Outline'}
                />
              );
            case 'Search':
              return (
                <SearchNormal
                  size={24}
                  color={color}
                  variant={focused ? 'Bold' : 'Outline'}
                />
              );
            case 'LibraryTab':
              return (
                <MusicLibrary2
                  size={24}
                  color={color}
                  variant={focused ? 'Bold' : 'Outline'}
                />
              );
          }
        },

        tabBarItemStyle: {
          backgroundColor: `${COLOR.BACKGROUND}90`,
          height: TABBAR_HEIGHT,
          elevation: 0,
        },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          height: TABBAR_HEIGHT,
          zIndex: 1,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: withTiming(`${COLOR.BACKGROUND}95`, {
            duration: 550,
          }),
          elevation: 0,
        },
        tabBarActiveTintColor: theme === 'amoled' ? GREEN : COLOR.PRIMARY,
        tabBarInactiveTintColor: COLOR.TEXT_SECONDARY,
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{title: 'Trang chủ'}}
      />
      <Tab.Screen
        name="Chart"
        component={ChartScreens}
        options={{
          title: 'Bảng xếp hạng',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreensStack}
        options={{
          title: 'Tìm kiếm',
        }}
      />
      <Tab.Screen
        name="LibraryTab"
        component={LibraryStack}
        options={{
          title: 'Thư viện',
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeWrapper;
