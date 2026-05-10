/** Base palette — DESIGN.md */
export const BASE_COLORS = {
  void: "#0A0A0F",
  deep: "#12121A",
  surface: "#1C1C28",
  elevated: "#252535",
  primary: "#F2EFEA",
  secondary: "#9A9287",
  tertiary: "#5A5550",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#F87171",
  info: "#60A5FA",
  solana: "#9945FF",
  solanaGlow: "#14F19533",
} as const;

export type WorldId = "aethon" | "mechara" | "khoras" | "mirren" | "vael";
