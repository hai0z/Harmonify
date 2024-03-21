interface Song {
  err: number;
  msg: string;
  data: Data;
  timestamp: number;
}

interface Data {
  '128': string;
  '320': string;
}