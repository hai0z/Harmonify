import axios from "axios";

const baseUrl = 'https://yt-music-hai0z.vercel.app/api/'


const api = axios.create({
  baseURL: baseUrl,
})

api.interceptors.response.use(
  (response) => {
    return response.data.data
  }, function (error) {
    return Promise.reject(error);
  });
export default api