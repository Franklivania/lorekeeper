import { Stack } from "expo-router";
import { BASE_COLORS } from "@/lib/constants";

export default function SessionStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: BASE_COLORS.void },
      }}
    />
  );
}
