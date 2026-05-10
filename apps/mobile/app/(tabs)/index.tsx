import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WorldBadge } from "@/components/ui/world-badge";
import { BASE_COLORS } from "@/lib/constants";
import { useCampaignList } from "@/hooks/useCampaign";
import type { CampaignDto } from "@/services/api/campaign-api";

export default function CampaignHubScreen() {
  const router = useRouter();
  const { campaigns, loading, error } = useCampaignList();

  const renderItem = ({ item }: { item: CampaignDto }) => (
    <Pressable
      onPress={() => router.push(`/campaign/${item.id}`)}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.9 : 1, transform: [{ translateY: pressed ? 2 : 0 }] },
      ]}
    >
      <WorldBadge world={item.world} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSlug}>{item.slug}</Text>
    </Pressable>
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Campaigns</Text>
      <Text style={styles.title}>Choose your thread</Text>
      {loading ? (
        <ActivityIndicator color={BASE_COLORS.primary} />
      ) : (
        <FlatList
          data={campaigns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {error
                ? `${error}\n\nStart the API on port 3001 and ensure Neon is migrated.`
                : "No campaigns yet."}
            </Text>
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    backgroundColor: BASE_COLORS.void,
  },
  kicker: {
    color: BASE_COLORS.secondary,
    letterSpacing: 4,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffffff22",
    backgroundColor: BASE_COLORS.deep,
    gap: 8,
  },
  cardTitle: {
    color: BASE_COLORS.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  cardSlug: {
    color: BASE_COLORS.tertiary,
    fontSize: 13,
    letterSpacing: 1,
  },
  empty: {
    color: BASE_COLORS.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
  },
});
