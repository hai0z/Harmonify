import { DEFAULT_IMG } from "../constants";
import { usePlayerStore } from "../store/playerStore";

const imageQuality = usePlayerStore.getState().imageQuality === 'high' ? 1080 : usePlayerStore.getState().imageQuality === 'high' ? 720 : 360

const getThumbnail = (url: string | null, size: number = imageQuality) => {
  if (!url) return DEFAULT_IMG
  const newUrl = url.replace(/w\d+/, `w${size}`);
  return newUrl;
};

export default getThumbnail