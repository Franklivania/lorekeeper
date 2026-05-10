import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GameButton } from "@/components/ui/game-button";
import { WorldBadge } from "@/components/ui/world-badge";
import { BASE_COLORS } from "@/lib/constants";
import { fetchCampaigns } from "@/services/api/campaign-api";
import type { CampaignDto } from "@/services/api/campaign-api";

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchCampaigns();
        const match = rows.find((row) => row.id === id) ?? null;
        if (!cancelled) setCampaign(match);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const stubSessionId = useMemo(() => (id ? `stub-${id}` : "stub-session"), [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BASE_COLORS.primary} />
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Campaign not found.</Text>
        <GameButton label="Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <WorldBadge world={campaign.world} />
      <Text style={styles.title}>{campaign.title}</Text>
      <Text style={styles.slug}>{campaign.slug}</Text>
      <GameButton
        label="Enter session (stub)"
        onPress={() =>
          router.push(
            `/session/${encodeURIComponent(stubSessionId)}?world=${encodeURIComponent(campaign.world)}`,
          )
        }
      />
      <GameButton label="Back to hub" variant="ghost" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    gap: 14,
    backgroundColor: BASE_COLORS.void,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
    backgroundColor: BASE_COLORS.void,
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  slug: {
    color: BASE_COLORS.secondary,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  muted: {
    color: BASE_COLORS.secondary,
    textAlign: "center",
  },
});
