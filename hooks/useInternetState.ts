import { addEventListener } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export default function useInternetState() {
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      if (!state.isConnected) {
        setIsConnected(false);
      } else {
        setIsConnected(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return isConnected;
}