import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from '../utils/types/RootStackParamList';
import OfflineScreen from '../screens/offline/OfflineScreen';
import SettingStack from './SettingStack';
import PlayerStack from './PlayerStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

const OfflineStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Offline" component={OfflineScreen} />
      <Stack.Screen name="SettingStack" component={SettingStack} />
      <Stack.Screen
        name="PlayerStack"
        component={PlayerStack}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default OfflineStack;
