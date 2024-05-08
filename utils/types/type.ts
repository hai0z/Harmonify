export interface Chart {
  err: number;
  msg: string;
  data: Data;
}

interface Data {
  RTChart: RTChart;
}

interface RTChart {
  promotes: Promote[];
  items: Song[];
}

export interface Song {
  encodeId: string;
  title: string;
  alias: string;
  isOffical: boolean;
  username: string;
  artistsNames: string;
  artists: Artist3[];
  isWorldWide: boolean;
  previewInfo?: PreviewInfo;
  thumbnailM: string;
  link: string;
  thumbnail: string;
  duration: number;
  zingChoice: boolean;
  isPrivate: boolean;
  preRelease: boolean;
  releaseDate: number;
  genreIds: string[];
  album: Album2;
  distributor: string;
  indicators: string[];
  isIndie: boolean;
  streamingStatus: number;
  allowAudioAds: boolean;
  hasLyric?: boolean;
  rakingStatus: number;
  score: number;
  totalTopZing: number;
  artist?: Artist5;
  downloadPrivileges?: number[];
  mvlink?: string;
}

interface Artist5 {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  playlistId: string;
  cover: string;
  thumbnail: string;
}

interface Album2 {
  encodeId: string;
  title: string;
  thumbnail: string;
  isoffical: boolean;
  link: string;
  isIndie: boolean;
  releaseDate: string;
  sortDescription: string;
  releasedAt: number;
  genreIds: string[];
  PR: boolean;
  artists?: Artist4[];
  artistsNames?: string;
}

interface Artist4 {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  isOA: boolean;
  isOABrand: boolean;
  totalFollow: number;
  playlistId?: string;
}

interface Artist3 {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  isOA: boolean;
  isOABrand: boolean;
  playlistId?: string;
}

interface Promote {
  encodeId: string;
  title: string;
  alias: string;
  isOffical: boolean;
  username: string;
  artistsNames: string;
  artists: Artist[];
  isWorldWide: boolean;
  previewInfo: PreviewInfo;
  thumbnailM: string;
  link: string;
  thumbnail: string;
  duration: number;
  zingChoice: boolean;
  isPrivate: boolean;
  preRelease: boolean;
  releaseDate: number;
  genreIds: string[];
  album: Album;
  distributor: string;
  indicators: any[];
  isIndie: boolean;
  mvlink?: string;
  streamingStatus: number;
  allowAudioAds: boolean;
  hasLyric: boolean;
  downloadPrivileges?: number[];
}

interface Album {
  encodeId: string;
  title: string;
  thumbnail: string;
  isoffical: boolean;
  link: string;
  isIndie: boolean;
  releaseDate: string;
  sortDescription: string;
  releasedAt: number;
  genreIds: string[];
  PR: boolean;
  artists: Artist2[];
  artistsNames: string;
}

interface Artist2 {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  isOA: boolean;
  isOABrand: boolean;
  playlistId: string;
  totalFollow: number;
}

interface PreviewInfo {
  startTime: number;
  endTime: number;
}

interface Artist {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  isOA: boolean;
  isOABrand: boolean;
  playlistId: string;
}
export interface Lyric {
  startTime: number;
  endTime: number;
  data: string;
};
export interface typePlaylistCover {
  items: [];
  title: string;
  encodeId: string;
  thumbnail: string;
  sortDescription: string;
  sectionId: string;
}
