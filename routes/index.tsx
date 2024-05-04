import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreens from '../screens/home/HomeScreens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'expo-status-bar';
import MiniPlayer from '../components/Player/MiniPlayer';
import SearchScreens from '../screens/SearchScreens';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PlayerScreens from '../screens/PlayerScreens';
import LyricScreen from '../screens/LyricScreen';
import {Text, View} from 'react-native';
import PlaylistDetail from '../screens/PlaylistDetail';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import ArtistScreens from '../screens/artist/ArtistScreens';
import ChartScreens from '../screens/ChartScreens';
import LinearGradient from 'react-native-linear-gradient';
import ArtistSong from '../screens/artist/ArtistSong';
import {useAuth} from '../context/AuthProvider';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import LibrarySrceens from '../screens/library/LibrarySrceens';
import LikedSong from '../screens/library/LikedSong';
import MyPlaylist from '../screens/library/MyPlaylist';
import {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from '../constants';
import TrackItemBottomSheet from '../components/bottom-sheet/TrackItemBottomSheet';
import LocalSong from '../screens/library/LocalSong';
import useThemeStore from '../store/themeStore';
import SettingScreen from '../screens/SettingScreen';
import Queue from '../screens/queue/Queue';
import Entypo from 'react-native-vector-icons/Entypo';
import HistoryScreens from '../screens/HistoryScreens';
import Animated, {
  FadeInDown,
  FadeOutDown,
  withTiming,
} from 'react-native-reanimated';
import useInternetState from '../hooks/useInternetState';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import CreatePlaylist from '../screens/createPlaylist/CreatePlaylist';
import AddToPlaylist from '../screens/createPlaylist/AddToPlaylist';
import EditPlaylist from '../screens/createPlaylist/EditPlaylist';
export type HomeStackParamsList = {
  Home: undefined;
  Search: undefined;
  Player: undefined;
  Lyric: undefined;
  PlayListDetail: undefined;
  Artists: undefined;
  ArtistsSong: undefined;
  Login: undefined;
  Register: undefined;
  Library: undefined;
  MyPlaylist: undefined;
  LikedSong: undefined;
  Chart: undefined;
  Lib: undefined;
  LocalSong: undefined;
  Setting: undefined;
  Queue: undefined;
  PlayerStack: undefined;
  History: undefined;
  CreatePlaylist: undefined;
  AddToPlaylist: undefined;
  PlaylistStack: undefined;
  EditPlaylist: undefined;
};
const Stack = createNativeStackNavigator<HomeStackParamsList>();
const LibStack = createNativeStackNavigator();
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
      <Stack.Screen name="Search" component={SearchScreens} />
      <Stack.Screen
        name="History"
        component={HistoryScreens}
        options={{
          animation: 'ios',
        }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
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
  const {COLOR} = useThemeStore();
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
        tabBarIcon: ({color}) => {
          switch (route.name) {
            case 'HomeTab':
              return <Entypo name="home" size={28} color={color} />;
            case 'Chart':
              return <AntDesign name="barschart" size={28} color={color} />;
            case 'Search':
              return <AntDesign name="search1" size={28} color={color} />;
            case 'LibraryTab':
              return (
                <MaterialIcons name="library-music" size={28} color={color} />
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
            duration: 750,
          }),
          elevation: 0,
        },
        tabBarActiveTintColor: COLOR.PRIMARY,
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
        component={SearchScreens}
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

const PlayerStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: true}}>
      <Stack.Screen name="Player" component={PlayerScreens} />
      <Stack.Screen
        name="Queue"
        component={Queue}
        options={{animation: 'slide_from_bottom'}}
      />
    </Stack.Navigator>
  );
};

const CreatePlaylistStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CreatePlaylist" component={CreatePlaylist} />
      <Stack.Screen
        name="AddToPlaylist"
        component={AddToPlaylist}
        options={{animation: 'slide_from_bottom'}}
      />
      <Stack.Screen name="EditPlaylist" component={EditPlaylist} />
    </Stack.Navigator>
  );
};
function App() {
  const {isLogin} = useAuth();
  const {COLOR} = useThemeStore();
  const defaultTheme = {
    dark: COLOR.isDark,
    colors: {
      ...DefaultTheme.colors,
      background: COLOR.BACKGROUND,
    },
  };
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer theme={defaultTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLogin ? (
          <>
            <Stack.Screen name="Home" component={HomeWrapper} />
            <Stack.Screen
              name="PlayerStack"
              component={PlayerStack}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="Lyric"
              component={LyricScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="PlaylistStack"
              component={CreatePlaylistStack}
              options={{animation: 'fade'}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{animation: 'fade'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
