import {useEffect} from "react";
import {usePlayerStore} from "../store/playerStore";
import useInternetState from "./useInternetState";
import nodejs from "nodejs-mobile-react-native";
import mmkv from "../utils/mmkv";
import {getRecentListening} from "../service/firebase";
import {create} from "zustand";

interface HomeData {
  home: any[];
  newRelease: any;
  hub: any[];
  dataRecent: any[];
  homeLoading: boolean;
  setHomeLoading: (homeLoading: boolean) => void;
  setNewRelease: (data: any) => void;
  setHub: (data: any[]) => void;
  setRecent: (data: any[]) => void;
  setHome: (data: any[]) => void;
}
export const useHomeDataStore = create<HomeData>(set => ({
  home: [],
  newRelease: {},
  hub: [],
  dataRecent: [],
  homeLoading: true,
  setHomeLoading: (homeLoading: boolean) => set({homeLoading}),
  setHome: (data: Record<string, any>[]) => set({home: data}),
  setNewRelease: (data: Record<string, any>) => set({newRelease: data}),
  setHub: (data: Record<string, any>[]) => set({hub: data}),
  setRecent: (data: Record<string, any>[]) => set({dataRecent: data}),
}));
export default function useGetHomeData() {
  const {
    setHomeLoading,
    setHub,
    setNewRelease,
    setRecent,
    setHome,
    homeLoading,
    home,
    newRelease,
    hub,
    dataRecent,
  } = useHomeDataStore();

  const setLikedSongs = usePlayerStore(state => state.setLikedSongs);
  const isConnected = useInternetState();

  useEffect(() => {
    const handleHomeData = (data: any[]) => {
      const playlists = data.filter(e => e.sectionType === "playlist");
      const newReleaseData = data.find(e => e.sectionType === "new-release");

      setHome(playlists);
      setNewRelease(newReleaseData || {});

      mmkv.set("home", JSON.stringify(playlists));
      mmkv.set("new-release", JSON.stringify(newReleaseData));
    };

    const loadOnlineData = async () => {
      try {
        const recentList = await getRecentListening();
        setRecent(recentList || []);
        mmkv.set("recent-listening", JSON.stringify(recentList || []));

        nodejs.channel.addListener("getHub", data => setHub(data?.genre));
        nodejs.channel.addListener("home", handleHomeData);

        await Promise.all([
          nodejs.channel.post("home"),
          nodejs.channel.post("getHub"),
        ]);
      } catch (error) {
        console.error("Failed to load online data:", error);
      } finally {
        setHomeLoading(false);
      }
    };

    const loadOfflineData = () => {
      setHome(JSON.parse(mmkv.getString("home") || "[]"));
      setNewRelease(JSON.parse(mmkv.getString("new-release") || "{}"));
      setRecent(JSON.parse(mmkv.getString("recent-listening") || "[]"));
      setLikedSongs(JSON.parse(mmkv.getString("liked-songs") || "[]"));
      setHomeLoading(false);
    };

    setHomeLoading(true);
    isConnected ? loadOnlineData() : loadOfflineData();
  }, [isConnected]);

  return {homeLoading, home, newRelease, hub, dataRecent};
}
