const caculateTime = (duration: number, position: number) => {
  const currentSecond: string | number = `0${Math.floor(position % 60)}`.slice(
    -2,
  );
  const currentMin = Math.floor((position / 60) % 60);

  const totalSecond: string | number = `0${Math.floor(duration) % 60}`.slice(
    -2,
  );

  const totalMin = `${Math.floor((duration / 60) % 60)}`;

  const totalTime = `${totalMin}:${totalSecond}`;

  return {
    currentMin,
    currentSecond,
    totalTime,
  };
};

export const seconds2MMSS = (sec_num: number) => {
  sec_num = Math.floor(sec_num);
  const padding = (num: number) => String(num).padStart(2, '0');
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  return hours > 0
    ? `${String(hours)}:${padding(minutes)}:${padding(seconds)}`
    : `${padding(minutes)}:${padding(seconds)}`;
};

export default caculateTime;