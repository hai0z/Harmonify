import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreens from '../screens/home/HomeScreens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'expo-status-bar';
import MiniPlayer from '../components/MiniPlayer';
import SearchScreens from '../screens/SearchScreens';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PlayerScreens from '../screens/PlayerScreens';
import LyricScreen from '../screens/LyricScreen';
import {View, Text} from 'react-native';
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
import Toast from '../components/toast/Toast';
import useToastStore from '../store/toastStore';
import {COLOR, TABBAR_HEIGHT} from '../constants';
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
};
const Stack = createNativeStackNavigator<HomeStackParamsList>();

const Tab = createBottomTabNavigator();

const HomeWrapper = () => {
  return (
    <View className="flex-1 h-full w-full relative bg-[#121212]">
      <StatusBar backgroundColor="#00000050" style="light" />
      <HomeTab />
    </View>
  );
};

const LibraryStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Library" component={LibrarySrceens} />
      <Stack.Screen name="MyPlaylist" component={MyPlaylist} />
      <Stack.Screen
        name="LikedSong"
        component={LikedSong}
        options={{animation: 'ios'}}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreens} />
      <Stack.Screen name="Search" component={SearchScreens} />
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
  return (
    <Tab.Navigator
      tabBar={props => (
        <>
          <Toast />
          <MiniPlayer />
          <BottomTabBar {...props} />
        </>
      )}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          switch (route.name) {
            case 'HomeTab':
              return <AntDesign name="home" size={size} color={color} />;
            case 'Chart':
              return <AntDesign name="barschart" size={size} color={color} />;
            case 'Search':
              return <AntDesign name="search1" size={size} color={color} />;
            case 'LibraryTab':
              return (
                <MaterialIcons name="library-music" size={size} color={color} />
              );
          }
        },

        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          height: TABBAR_HEIGHT,
          zIndex: 2,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#000000',
        },
        tabBarActiveTintColor: COLOR.PRIMARY,
        tabBarInactiveTintColor: '#ababab',
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Trang Chủ',
        }}
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

function App() {
  const {isLogin} = useAuth();
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLogin ? (
          <>
            <Stack.Screen name="Home" component={HomeWrapper} />
            <Stack.Screen
              name="Player"
              component={PlayerScreens}
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
