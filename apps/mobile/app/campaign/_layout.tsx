import { Stack } from "expo-router";
import { BASE_COLORS } from "@/lib/constants";

export default function CampaignStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BASE_COLORS.void },
      }}
    />
  );
}
