import { StyleSheet, Text, View } from "react-native";
import { getWorldTheme } from "@/lib/world-config";

export function WorldBadge({ world }: { world: string }) {
  const theme = getWorldTheme(world);
  return (
    <View style={[styles.wrap, { borderColor: theme.primary }]}>
      <Text style={[styles.text, { color: theme.text }]}>{theme.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#ffffff11",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
