import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GameButton } from "@/components/ui/game-button";
import { BASE_COLORS } from "@/lib/constants";

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Character</Text>
      <Text style={styles.title}>{id}</Text>
      <Text style={styles.body}>
        Stats, relic resonance, and sub-strength overlays arrive with on-chain state sync.
      </Text>
      <GameButton label="Back" variant="ghost" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    gap: 12,
    backgroundColor: BASE_COLORS.void,
  },
  kicker: {
    color: BASE_COLORS.secondary,
    letterSpacing: 4,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 26,
    fontWeight: "800",
    fontFamily: "monospace",
  },
  body: {
    color: BASE_COLORS.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});
