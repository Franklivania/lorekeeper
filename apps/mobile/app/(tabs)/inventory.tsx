import { StyleSheet, Text, View } from "react-native";
import { BASE_COLORS } from "@/lib/constants";

export default function InventoryScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Relic vault</Text>
      <Text style={styles.body}>
        Cached relic metadata will render here once mint listeners ship.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    backgroundColor: BASE_COLORS.void,
    gap: 12,
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 26,
    fontWeight: "800",
  },
  body: {
    color: BASE_COLORS.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
