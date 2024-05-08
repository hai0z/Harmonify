import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PlayerScreens from '../screens/PlayerScreens';

import Queue from '../screens/queue/Queue';

import {RootStackParamList} from '../utils/types/RootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();

const PlayerStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Player" component={PlayerScreens} />
      <Stack.Screen
        name="Queue"
        component={Queue}
        options={{animation: 'slide_from_bottom'}}
      />
    </Stack.Navigator>
  );
};

export default PlayerStack;
