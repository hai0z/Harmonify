import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SearchScreens from '../../screens/SearchScreens';

import PlaylistDetail from '../../screens/PlaylistDetail';
import ArtistScreens from '../../screens/artist/ArtistScreens';
import ArtistSong from '../../screens/artist/ArtistSong';

import {RootStackParamList} from '../../utils/types/RootStackParamList';

const SearchStack = createNativeStackNavigator<RootStackParamList>();

const SearchScreensStack = () => {
  return (
    <SearchStack.Navigator screenOptions={{headerShown: false}}>
      <SearchStack.Screen name="SearchStack" component={SearchScreens} />
      <SearchStack.Screen
        name="PlayListDetail"
        component={PlaylistDetail}
        options={{
          animation: 'ios',
        }}
      />
      <SearchStack.Screen
        name="Artists"
        component={ArtistScreens}
        options={{
          animation: 'ios',
        }}
      />
      <SearchStack.Screen
        name="ArtistsSong"
        component={ArtistSong}
        options={{
          animation: 'ios',
        }}
      />
    </SearchStack.Navigator>
  );
};

export default SearchScreensStack;
