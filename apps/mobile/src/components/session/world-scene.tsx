import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { getWorldTheme } from "@/lib/world-config";

export function WorldScene({ world }: { world: string }) {
  const theme = getWorldTheme(world);
  return (
    <View style={[styles.wrap, { backgroundColor: theme.background }]}>
      <Svg height="100%" width="100%" viewBox="0 0 360 640">
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="35%" rx="60%" ry="45%">
            <Stop offset="0%" stopColor={theme.primary} stopOpacity="0.75" />
            <Stop offset="100%" stopColor={theme.background} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="180" cy="220" r="160" fill="url(#glow)" />
        <Circle cx="260" cy="420" r="90" fill={theme.secondary} opacity={0.08} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
  },
});
