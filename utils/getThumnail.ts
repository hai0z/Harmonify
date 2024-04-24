import { DEFAULT_IMG } from "../constants";


const getThumbnail = (url: string | null, size: number = 1080) => {
  if (!url) return DEFAULT_IMG
  const newUrl = url.replace(/w\d+/, `w${size}`);
  return newUrl;
};
export const getThumbnailWithRatio = (url: string | null) => {
  if (!url) return DEFAULT_IMG
  let modifiedImageUrl = url.replace('r1x1', `r9x16`);
  modifiedImageUrl = modifiedImageUrl.replace(/w\d+/, `w720`);
  return modifiedImageUrl;
}

export default getThumbnail