import { useEffect, useMemo, useState } from "react";
import { useProgress } from "react-native-track-player";


export default function useSyncLyric(lyrics: any[]) {
  const [currentLine, setCurrentLine] = useState<number | undefined>(-1);
  const progress = useProgress(100);
  useEffect(() => {
    if (lyrics) {
      let low = 0;
      let high = lyrics.length - 1;
      let result = -1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midTime = +lyrics[mid].startTime;
        if (midTime <= Number(progress.position * 1000)) {
          result = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      if (currentLine !== result) {
        setCurrentLine(result);
      }
    }
  }, [progress.position]);

  return {
    currentLine,
  };
}