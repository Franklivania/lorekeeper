import { create } from "zustand";

type UiState = {
  activeWorld: string | null;
  setActiveWorld: (world: string | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeWorld: null,
  setActiveWorld: (activeWorld) => set({ activeWorld }),
}));
