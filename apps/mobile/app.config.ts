import type { ExpoConfig } from "expo/config";

const defineConfig = (): ExpoConfig => ({
  name: process.env.EXPO_PUBLIC_APP_NAME ?? "LoreKeeper",
  slug: "lorekeeper",
  scheme: "lorekeeper",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "dark",
  backgroundColor: "#0A0A0F",
  owner: "franklivania",
  icon: "./assets/images/icon.png",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "cover",
    backgroundColor: "#0A0A0F",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "xyz.lorekeeper.app",
  },
  android: {
    package: process.env.ANDROID_PACKAGE ?? "xyz.lorekeeper.app",
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#0A0A0F",
    },
    permissions: ["RECORD_AUDIO"],
  },
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-av",
      {
        microphonePermission: "LoreKeeper uses the microphone for voice play.",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "80dd5124-c632-426b-8cd6-f6d6dec7e480",
    },
    router: {},
  },
});

export default defineConfig;
