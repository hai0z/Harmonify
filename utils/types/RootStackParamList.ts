import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Song } from './type';

export type RootStackParamList = {
  Home: undefined;
  SearchStack: undefined;
  Player: undefined;
  Lyric: undefined;
  PlayListDetail: {
    data: {
      playListId: string;
    },
  };
  Artists: {
    id?: string;
    name: string;
  };
  ArtistsSong: {
    id: string | undefined;
    name: string | undefined;
  };
  Login: undefined;
  Register: undefined;
  Library: undefined;
  MyPlaylist: {
    playlistId: string;
  };
  LikedSong: undefined;
  Chart: undefined;
  Lib: undefined;
  LocalSong: undefined;
  Queue: undefined;
  PlayerStack: undefined;
  History: undefined;
  CreatePlaylist: undefined;
  AddToPlaylist: {
    song: Song;
  };
  PlaylistStack: {
    screen?: "AddToPlaylist" | "EditPlaylist";
    params?: {
      song: Song
    }
  };
  EditPlaylist: {
    song: Song
  };
  SettingStack: undefined;
  Setting: undefined;
  Theme: undefined;
};

export type RootStackProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
};

export type navigation<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type route<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
