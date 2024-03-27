/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import {PlaybackService} from './playerService';
import {enableFreeze, enableScreens} from 'react-native-screens';

AppRegistry.registerComponent(appName, () => App);

enableFreeze(true);
enableScreens(true);

TrackPlayer.registerPlaybackService(() => PlaybackService);
