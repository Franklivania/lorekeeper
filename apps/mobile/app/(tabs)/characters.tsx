import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { BASE_COLORS } from "@/lib/constants";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { fetchCharacters } from "@/services/api/character-api";
import type { CharacterDto } from "@/services/api/character-api";
import { WorldBadge } from "@/components/ui/world-badge";
import { useCharacterStore } from "@/stores/character-store";

export default function CharactersScreen() {
  const { walletAddress } = useWalletAuth();
  const setCharacters = useCharacterStore((s) => s.setCharacters);
  const [items, setItems] = useState<CharacterDto[]>([]);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchCharacters(walletAddress);
        if (!cancelled) {
          setItems(rows);
          setCharacters(rows);
          setNote(null);
        }
      } catch (e) {
        if (!cancelled) {
          setNote(e instanceof Error ? e.message : "Could not load heroes");
          setItems([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [walletAddress, setCharacters]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Hero roster</Text>
      <Text style={styles.body}>Three souls maximum — mint flow arrives next.</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No characters yet. Finish onboarding on-chain.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <WorldBadge world={item.world} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
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
  title: {
    color: BASE_COLORS.primary,
    fontSize: 26,
    fontWeight: "800",
  },
  body: {
    color: BASE_COLORS.secondary,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  note: {
    color: BASE_COLORS.warning,
    marginTop: 12,
  },
  empty: {
    color: BASE_COLORS.secondary,
    marginTop: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffffff22",
    backgroundColor: BASE_COLORS.deep,
    gap: 10,
  },
  name: {
    color: BASE_COLORS.primary,
    fontSize: 18,
    fontWeight: "700",
  },
});
