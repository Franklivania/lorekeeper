import type { getSql } from "../../services/neonpg.service";

export type CharacterRow = {
  id: string;
  name: string;
  world: string;
};

export async function listCharactersForPlayer(
  db: ReturnType<typeof getSql>,
  playerId: string,
): Promise<CharacterRow[]> {
  const rows = await db`
    SELECT id, name, world
    FROM characters
    WHERE player_id = ${playerId}
    ORDER BY created_at ASC
  `;
  return rows as unknown as CharacterRow[];
}
