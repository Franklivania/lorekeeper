import { create } from "zustand";

type AuthState = {
  walletAddress: string | null;
  profileComplete: boolean;
  setWallet: (addr: string | null) => void;
  setProfileComplete: (complete: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  walletAddress: null,
  profileComplete: false,
  setWallet: (walletAddress) => set({ walletAddress }),
  setProfileComplete: (profileComplete) => set({ profileComplete }),
  reset: () => set({ walletAddress: null, profileComplete: false }),
}));
