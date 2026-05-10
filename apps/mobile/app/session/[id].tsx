import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GameButton } from "@/components/ui/game-button";
import { StoryFeed } from "@/components/session/story-feed";
import { VoiceInputBar } from "@/components/session/voice-input-bar";
import { WorldScene } from "@/components/session/world-scene";
import { BASE_COLORS } from "@/lib/constants";
import { useSessionStore } from "@/stores/session-store";

export default function SessionScreen() {
  const router = useRouter();
  const { id, world } = useLocalSearchParams<{ id: string; world?: string }>();
  const setActiveSession = useSessionStore((s) => s.setActiveSession);
  const voiceEnabled = process.env.EXPO_PUBLIC_ENABLE_VOICE === "true";
  const [lines, setLines] = useState<string[]>([
    "The DM waits beyond the veil…",
    "Tell them how your pulse answers the storm.",
  ]);

  useEffect(() => {
    setActiveSession(id ?? null, world ?? "aethon");
    return () => setActiveSession(null);
  }, [id, setActiveSession, world]);

  const activeWorld = world ?? "aethon";

  return (
    <View style={styles.shell}>
      <WorldScene world={activeWorld} />
      <View style={styles.foreground}>
        <Text style={styles.tag}>Session</Text>
        <Text style={styles.title}>{id}</Text>
        <StoryFeed lines={lines} />
        <VoiceInputBar
          enabled={voiceEnabled}
          onSimulate={() =>
            setLines((prev) => [...prev, "You murmur into the static—and something listens."])
          }
        />
        <GameButton label="Leave session" variant="ghost" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: BASE_COLORS.void,
  },
  foreground: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
    gap: 12,
    justifyContent: "flex-end",
  },
  tag: {
    color: BASE_COLORS.secondary,
    letterSpacing: 4,
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 18,
    fontFamily: "monospace",
  },
});
