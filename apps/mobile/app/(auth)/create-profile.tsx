import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GameButton } from "@/components/ui/game-button";
import { BASE_COLORS } from "@/lib/constants";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { saveProfile } from "@/services/api/character-api";

export default function CreateProfileScreen() {
  const router = useRouter();
  const { walletAddress, setProfileComplete } = useWalletAuth();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!walletAddress) {
      Alert.alert("Missing wallet");
      return;
    }
    setBusy(true);
    try {
      await saveProfile(walletAddress, name.trim());
      setProfileComplete(true);
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert(
        "Profile",
        e instanceof Error ? e.message : "Could not reach server",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Name your legend</Text>
      <TextInput
        placeholder="Display name"
        placeholderTextColor={BASE_COLORS.tertiary}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <GameButton
        label="Save profile"
        loading={busy}
        disabled={name.trim().length < 2}
        onPress={() => void submit()}
      />
      <Text style={styles.hint}>
        Requires running API + DATABASE_URL. Seed schema with{" "}
        <Text style={{ fontFamily: "monospace" }}>bun --filter server db:migrate</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    gap: 16,
    backgroundColor: BASE_COLORS.void,
  },
  title: {
    color: BASE_COLORS.primary,
    fontSize: 26,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffffff33",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: BASE_COLORS.primary,
    backgroundColor: BASE_COLORS.surface,
    fontSize: 16,
  },
  hint: {
    color: BASE_COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
});
