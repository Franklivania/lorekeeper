import { useRouter } from "expo-router";
import { StyleSheet, Switch, Text, View } from "react-native";
import { GameButton } from "@/components/ui/game-button";
import { BASE_COLORS } from "@/lib/constants";
import { shortenAddress } from "@/lib/utils";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useSoundStore } from "@/stores/sound-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { walletAddress, reset } = useWalletAuth();
  const { soundEnabled, setSoundEnabled } = useSoundStore();

  const logout = () => {
    reset();
    router.replace("/(auth)/wallet-connect");
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Wallet</Text>
      <Text style={styles.mono}>
        {walletAddress ? shortenAddress(walletAddress, 6) : "—"}
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Soundscape</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          thumbColor={BASE_COLORS.primary}
        />
      </View>
      <GameButton label="Disconnect" variant="ghost" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    backgroundColor: BASE_COLORS.void,
    gap: 14,
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 26,
    fontWeight: "800",
  },
  label: {
    color: BASE_COLORS.secondary,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 8,
  },
  mono: {
    color: BASE_COLORS.primary,
    fontFamily: "monospace",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
