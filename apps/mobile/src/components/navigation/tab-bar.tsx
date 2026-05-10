import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BASE_COLORS } from "@/lib/constants";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.title ??
          route.name.replace(/^\((tabs)\)\//, "").replace(/-/g, " ");
        const focused = state.index === index;
        const color = focused ? BASE_COLORS.primary : BASE_COLORS.tertiary;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={({ pressed }) => [
              styles.item,
              focused && styles.itemFocused,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.itemLabel, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 22,
    backgroundColor: BASE_COLORS.deep,
    borderWidth: 1,
    borderColor: "#ffffff22",
    gap: 6,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 16,
  },
  itemFocused: {
    backgroundColor: "#ffffff12",
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
