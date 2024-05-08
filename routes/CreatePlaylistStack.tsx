import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CreatePlaylist from '../screens/createPlaylist/CreatePlaylist';
import AddToPlaylist from '../screens/createPlaylist/AddToPlaylist';
import EditPlaylist from '../screens/createPlaylist/EditPlaylist';
import {RootStackParamList} from '../utils/types/RootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();

const CreatePlaylistStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CreatePlaylist" component={CreatePlaylist} />
      <Stack.Screen
        name="AddToPlaylist"
        component={AddToPlaylist}
        options={{animation: 'fade'}}
      />
      <Stack.Screen name="EditPlaylist" component={EditPlaylist} />
    </Stack.Navigator>
  );
};

export default CreatePlaylistStack;
