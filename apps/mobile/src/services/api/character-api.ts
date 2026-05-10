import { apiGet, apiPost } from "./http";

export type CharacterDto = {
  id: string;
  name: string;
  world: string;
};

export async function fetchCharacters(wallet: string): Promise<CharacterDto[]> {
  const res = await apiGet<CharacterDto[]>("/characters", {
    "x-wallet-address": wallet,
  });
  if (res.status !== "success" || !res.data) {
    throw new Error(res.message || "Failed to load characters");
  }
  return res.data;
}

export async function saveProfile(
  wallet: string,
  displayName: string,
): Promise<{ id: string }> {
  const res = await apiPost<{ id: string }>(
    "/characters/profile",
    { displayName },
    { "x-wallet-address": wallet },
  );
  if (res.status !== "success" || !res.data) {
    throw new Error(res.message || "Failed to save profile");
  }
  return res.data;
}
