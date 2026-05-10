import { Keypair } from "@solana/web3.js";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GameButton } from "@/components/ui/game-button";
import { BASE_COLORS } from "@/lib/constants";
import { useWalletAuth } from "@/hooks/useWalletAuth";

export default function WalletConnectScreen() {
  const router = useRouter();
  const { setWallet } = useWalletAuth();

  const connectDev = () => {
    const addr = Keypair.generate().publicKey.toBase58();
    setWallet(addr);
    router.replace("/(auth)/create-profile");
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Wallet</Text>
      <Text style={styles.title}>Enter LoreKeeper</Text>
      <Text style={styles.body}>
        Production builds wire Solana Mobile Wallet Adapter here. For local dev,
        mint a throwaway keypair to exercise API flows.
      </Text>
      <GameButton label="Dev connect (random keypair)" onPress={connectDev} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    gap: 16,
    backgroundColor: BASE_COLORS.void,
  },
  kicker: {
    color: BASE_COLORS.secondary,
    letterSpacing: 4,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 32,
    fontWeight: "800",
  },
  body: {
    color: BASE_COLORS.secondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
});
