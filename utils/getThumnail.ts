import { DEFAULT_IMG } from "../constants";

const getThumbnail = (url: string | null) => {
  if (!url) return DEFAULT_IMG
  const newUrl = url.replace(/w\d+/, "w720");
  return newUrl;
};

export default getThumbnail