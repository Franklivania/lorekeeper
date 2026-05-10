import { Redirect } from "expo-router";
import { useWalletAuth } from "@/hooks/useWalletAuth";

export default function Index() {
  const { walletAddress, profileComplete } = useWalletAuth();
  if (!walletAddress) {
    return <Redirect href="/(auth)/wallet-connect" />;
  }
  if (!profileComplete) {
    return <Redirect href="/(auth)/create-profile" />;
  }
  return <Redirect href="/(tabs)" />;
}
