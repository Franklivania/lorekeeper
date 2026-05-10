import type { getSql } from "../../services/neonpg.service";

export async function findProfileByWallet(
  db: ReturnType<typeof getSql>,
  wallet: string,
): Promise<{ id: string; wallet_address: string; display_name: string | null } | null> {
  const rows = await db`
    SELECT id, wallet_address, display_name
    FROM player_profiles
    WHERE wallet_address = ${wallet}
    LIMIT 1
  `;
  const row = rows[0] as
    | { id: string; wallet_address: string; display_name: string | null }
    | undefined;
  return row ?? null;
}

export async function upsertProfile(
  db: ReturnType<typeof getSql>,
  wallet: string,
  displayName: string,
): Promise<{ id: string }> {
  const rows = await db`
    INSERT INTO player_profiles (wallet_address, display_name)
    VALUES (${wallet}, ${displayName})
    ON CONFLICT (wallet_address)
    DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = NOW()
    RETURNING id
  `;
  return rows[0] as { id: string };
}
