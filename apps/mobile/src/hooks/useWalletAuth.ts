import { useAuthStore } from "@/stores/auth-store";

export function useWalletAuth() {
  const walletAddress = useAuthStore((s) => s.walletAddress);
  const profileComplete = useAuthStore((s) => s.profileComplete);
  const setWallet = useAuthStore((s) => s.setWallet);
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete);
  const reset = useAuthStore((s) => s.reset);

  return {
    walletAddress,
    profileComplete,
    setWallet,
    setProfileComplete,
    reset,
    isConnected: walletAddress !== null,
  };
}
