import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LyricScreen from '../screens/LyricScreen';

import {useAuth} from '../context/AuthProvider';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import useThemeStore from '../store/themeStore';

import {RootStackParamList} from '../utils/types/RootStackParamList';
import HomeWrapper from './home-tab/HomeTab';
import CreatePlaylistStack from './CreatePlaylistStack';
import PlayerStack from './PlayerStack';
import {usePlayerStore} from '../store/playerStore';
import OfflineStack from './OfflineStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigatior() {
  const {isLogin} = useAuth();
  const {COLOR} = useThemeStore();
  const {offlineMode} = usePlayerStore();
  const defaultTheme = {
    dark: COLOR.isDark,
    colors: {
      ...DefaultTheme.colors,
      background: COLOR.BACKGROUND,
    },
  };

  return (
    <NavigationContainer theme={defaultTheme}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={
          isLogin ? (offlineMode ? 'OfflineStack' : 'Home') : 'Login'
        }>
        {isLogin ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeWrapper}
              options={{animation: 'fade'}}
            />
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
            <Stack.Screen
              name="OfflineStack"
              component={OfflineStack}
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

export default Navigatior;
