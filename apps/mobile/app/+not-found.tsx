import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GameButton } from "@/components/ui/game-button";
import { BASE_COLORS } from "@/lib/constants";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <Stack.Screen options={{ title: "Lost" }} />
      <Text style={styles.title}>This path is unknown.</Text>
      <GameButton label="Return home" onPress={() => router.replace("/(tabs)")} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 16,
    backgroundColor: BASE_COLORS.void,
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 22,
    fontWeight: "700",
  },
});
