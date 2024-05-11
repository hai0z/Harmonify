import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from '../utils/types/RootStackParamList';
import SettingScreen from '../screens/setting/SettingScreen';
import ThemeScreens from '../screens/setting/ThemeScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SettingStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen
        name="Theme"
        component={ThemeScreens}
        options={{animation: 'default'}}
      />
    </Stack.Navigator>
  );
};

export default SettingStack;
