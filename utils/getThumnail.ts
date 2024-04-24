import { DEFAULT_IMG } from "../constants";

const getThumbnail = (url: string | null, size: number = 1080) => {
  if (!url) return DEFAULT_IMG
  const newUrl = url.replace(/w\d+/, `w${size}`);
  return newUrl;
};

export default getThumbnail