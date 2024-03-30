
import { create } from "zustand";

type State = {
  data: any;
  setData: (data: any) => void;
};

export const useBottomSheetStore = create<State>((set) => ({
  data: null,
  setData: (data: any) => set({ data }),
}))

export default useBottomSheetStore