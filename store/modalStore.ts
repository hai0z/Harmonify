import { create } from "zustand";

interface ModalStore {
  timerModalVisible: boolean;
  setTimerModalVisible: (value: boolean) => void;

}
export const useModalStore = create<ModalStore>((set) => ({
  timerModalVisible: false,
  setTimerModalVisible: (value: boolean) => set({ timerModalVisible: value }),

}))