import { Tabs } from "expo-router";
import { TabBar } from "@/components/navigation/tab-bar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Hub" }} />
      <Tabs.Screen name="characters" options={{ title: "Heroes" }} />
      <Tabs.Screen name="inventory" options={{ title: "Vault" }} />
      <Tabs.Screen name="profile" options={{ title: "You" }} />
    </Tabs>
  );
}
