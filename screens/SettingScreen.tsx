import {View, Text, Switch} from 'react-native';
import React from 'react';
import useThemeStore from '../store/themeStore';

const SettingScreen = () => {
  const {darkMode, setDarkMode, COLOR} = useThemeStore(state => state);

  return (
    <View
      style={{flex: 1, backgroundColor: COLOR.BACKGROUND}}
      className="pt-[35px] px-6">
      <Text>SettingScreen</Text>
      <View>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            setDarkMode();
          }}
          value={darkMode}
        />
      </View>
    </View>
  );
};

export default SettingScreen;
