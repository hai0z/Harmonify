import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreens from "../../screens/home/HomeScreens";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {StatusBar} from "expo-status-bar";
import MiniPlayer from "../../components/Player/MiniPlayer";

import {Text, View} from "react-native";
import PlaylistDetail from "../../screens/PlaylistDetail";
import {BottomTabBar} from "@react-navigation/bottom-tabs";
import ArtistScreens from "../../screens/artist/ArtistScreens";
import ChartScreens from "../../screens/ChartScreens";
import LinearGradient from "react-native-linear-gradient";
import ArtistSong from "../../screens/artist/ArtistSong";
import LibrarySrceens from "../../screens/library/LibrarySrceens";
import LikedSong from "../../screens/library/LikedSong";
import MyPlaylist from "../../screens/library/MyPlaylist";
import {GREEN, MINI_PLAYER_HEIGHT, TABBAR_HEIGHT} from "../../constants";
import TrackItemBottomSheet from "../../components/bottom-sheet/TrackItemBottomSheet";
import LocalSong from "../../screens/library/LocalSong";
import useThemeStore from "../../store/themeStore";
import HistoryScreens from "../../screens/HistoryScreens";
import Animated, {
  FadeInDown,
  FadeOutDown,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import useInternetState from "../../hooks/useInternetState";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {RootStackParamList} from "../../utils/types/RootStackParamList";
import SearchScreensStack from "./SearchStack";
import SettingStack from "../SettingStack";
import {Chart2, Home2, MusicLibrary2, SearchNormal} from "iconsax-react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();

const LibStack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

const HomeWrapper = () => {
  const {COLOR} = useThemeStore();

  return (
    <View
      className="flex-1 h-full w-full relative"
      style={{
        backgroundColor: COLOR.BACKGROUND,
      }}>
      <StatusBar
        backgroundColor="transparent"
        style={COLOR.isDark ? "light" : "dark"}
      />
      <HomeTab />
      <TrackItemBottomSheet />
    </View>
  );
};

const LibraryStack = () => {
  return (
    <LibStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "ios",
      }}>
      <LibStack.Screen name="Library" component={LibrarySrceens} />
      <LibStack.Screen name="MyPlaylist" component={MyPlaylist} />
      <LibStack.Screen name="LocalSong" component={LocalSong} />
      <LibStack.Screen name="LikedSong" component={LikedSong} />
      <LibStack.Screen name="PlayListDetail" component={PlaylistDetail} />
      <LibStack.Screen name="Artists" component={ArtistScreens} />
      <LibStack.Screen name="ArtistsSong" component={ArtistSong} />
    </LibStack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "ios",
      }}>
      <Stack.Screen name="Home" component={HomeScreens} />
      <Stack.Screen name="History" component={HistoryScreens} />
      <Stack.Screen name="SettingStack" component={SettingStack} />
      <Stack.Screen name="PlayListDetail" component={PlaylistDetail} />
      <Stack.Screen name="Artists" component={ArtistScreens} />
      <Stack.Screen name="ArtistsSong" component={ArtistSong} />
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
              entering={FadeInDown.duration(300).springify()}
              exiting={FadeOutDown.duration(300).springify()}>
              <View
                className="h-[20px] absolute flex items-center justify-center"
                style={{
                  bottom: TABBAR_HEIGHT + MINI_PLAYER_HEIGHT,
                  width: widthPercentageToDP(96),
                  transform: [{translateX: widthPercentageToDP(2)}],
                  borderRadius: 4,
                  backgroundColor: COLOR.BACKGROUND,
                  shadowColor: COLOR.TEXT_PRIMARY,
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                }}>
                <Text
                  className="text-xs font-medium"
                  style={{color: COLOR.TEXT_PRIMARY}}>
                  MU Music đang ở chế độ offline
                </Text>
              </View>
            </Animated.View>
          )}
          <BottomTabBar {...props} />
          <LinearGradient
            locations={[0, 0.7]}
            colors={["transparent", `${COLOR.BACKGROUND}`]}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: TABBAR_HEIGHT + 10,
            }}
          />
        </View>
      )}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarIcon: ({color, focused}) => {
          switch (route.name) {
            case "HomeTab":
              return (
                <Animated.View>
                  <Home2
                    size="24"
                    color={color}
                    variant={focused ? "Bold" : "Outline"}
                  />
                </Animated.View>
              );
            case "Chart":
              return (
                <Animated.View>
                  <Chart2
                    size={24}
                    color={color}
                    variant={focused ? "Bold" : "Outline"}
                  />
                </Animated.View>
              );
            case "Search":
              return (
                <Animated.View>
                  <SearchNormal
                    size={24}
                    color={color}
                    variant={focused ? "Bold" : "Outline"}
                  />
                </Animated.View>
              );
            case "LibraryTab":
              return (
                <Animated.View>
                  <MusicLibrary2
                    size={24}
                    color={color}
                    variant={focused ? "Bold" : "Outline"}
                  />
                </Animated.View>
              );
          }
        },

        tabBarItemStyle: {
          backgroundColor: "transparent",
          height: TABBAR_HEIGHT,
          paddingVertical: 6,
        },
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          height: TABBAR_HEIGHT,
          zIndex: 1,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: withTiming(`${COLOR.BACKGROUND}98`, {
            duration: 550,
          }),
          elevation: 0,
        },
        tabBarActiveTintColor: theme === "amoled" ? GREEN : COLOR.PRIMARY,
        tabBarInactiveTintColor: COLOR.TEXT_SECONDARY,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: -4,
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{title: "Trang chủ"}}
      />
      <Tab.Screen
        name="Chart"
        component={ChartScreens}
        options={{
          title: "Bảng xếp hạng",
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreensStack}
        options={{
          title: "Tìm kiếm",
        }}
      />
      <Tab.Screen
        name="LibraryTab"
        component={LibraryStack}
        options={{
          title: "Thư viện",
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeWrapper;
