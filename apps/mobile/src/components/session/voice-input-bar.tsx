import { StyleSheet, Text, View } from "react-native";
import { BASE_COLORS } from "@/lib/constants";
import { GameButton } from "@/components/ui/game-button";

export function VoiceInputBar({
  enabled,
  onSimulate,
}: {
  enabled: boolean;
  onSimulate: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>
        {enabled ? "Voice lane armed (stub)" : "Voice disabled in env"}
      </Text>
      <GameButton label="Simulate reply" onPress={onSimulate} variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  caption: {
    color: BASE_COLORS.secondary,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
});
