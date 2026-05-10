import { create } from "zustand";

type SoundState = {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
};

export const useSoundStore = create<SoundState>((set) => ({
  soundEnabled: true,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
}));
