import type { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BASE_COLORS } from "@/lib/constants";

type GameButtonProps = PropsWithChildren<
  PressableProps & {
    label: string;
    loading?: boolean;
    variant?: "primary" | "ghost";
  }
>;

export function GameButton({
  label,
  loading,
  variant = "primary",
  disabled,
  children,
  ...rest
}: GameButtonProps) {
  const surface =
    variant === "primary" ? BASE_COLORS.surface : "transparent";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled ?? loading}
      style={({ pressed }) => [
        styles.wrap,
        {
          backgroundColor: surface,
          borderColor:
            variant === "primary" ? BASE_COLORS.primary : BASE_COLORS.secondary,
          opacity: pressed ? 0.85 : 1,
          transform: [{ translateY: pressed ? 2 : 0 }],
        },
      ]}
      {...rest}
    >
      <View style={styles.innerShadow} />
      {loading ? (
        <ActivityIndicator color={BASE_COLORS.primary} />
      ) : (
        <>
          <Text style={styles.label}>{label}</Text>
          {children}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    overflow: "hidden",
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderBottomWidth: 4,
    borderBottomColor: "#00000044",
  },
  label: {
    color: BASE_COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
