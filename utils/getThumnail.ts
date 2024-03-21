const getThumbnail = (url: string) => {
  if (!url) return null
  const newUrl = url.replace(/w\d+/, "w720");
  return newUrl;
};

export default getThumbnail