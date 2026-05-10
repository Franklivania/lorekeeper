import { ScrollView, StyleSheet, Text } from "react-native";
import { BASE_COLORS } from "@/lib/constants";

export function StoryFeed({ lines }: { lines: string[] }) {
  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.inner}>
      {lines.map((line, idx) => (
        <Text key={`${idx}-${line.slice(0, 12)}`} style={styles.line}>
          {line}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    maxHeight: 220,
    marginHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#00000066",
    borderWidth: 1,
    borderColor: "#ffffff22",
  },
  inner: {
    padding: 16,
    gap: 10,
  },
  line: {
    color: BASE_COLORS.primary,
    fontSize: 15,
    lineHeight: 22,
  },
});
