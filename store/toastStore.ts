import { create } from "zustand";
export enum ToastTime {
  SHORT = 2000,
  LONG = 4000,
}
interface ToastStore {
  visible: boolean;
  message: string;
  duration: number;
  show: (message: string, duration?: number) => void;
}
const useToastStore = create<ToastStore>((set) => ({
  visible: false,
  message: "",
  duration: ToastTime.SHORT,
  show: (message: string, duration = ToastTime.SHORT) => {
    set({ visible: true, message, duration });
  },
}));

export default useToastStore