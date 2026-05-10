import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BASE_COLORS } from "@/lib/constants";

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: BASE_COLORS.void,
    card: BASE_COLORS.deep,
    text: BASE_COLORS.primary,
    border: "#ffffff22",
    primary: BASE_COLORS.solana,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BASE_COLORS.void },
        }}
      />
    </ThemeProvider>
  );
}
