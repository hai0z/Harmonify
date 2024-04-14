import { StateStorage } from "zustand/middleware"
import mmkv from '../utils/mmkv';
const zustandStorage: StateStorage = {
  getItem(name) {
    const value = mmkv.getString(name);
    return value ?? null;
  },
  setItem(name, value) {
    mmkv.set(name, value);
  },
  removeItem(name) {
    mmkv.delete(name);
  },
}

export default zustandStorage