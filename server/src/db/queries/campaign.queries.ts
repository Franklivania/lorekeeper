import type { getSql } from "../../services/neonpg.service";

export type CampaignRow = {
  id: string;
  slug: string;
  title: string;
  world: string;
};

export async function listCampaigns(db: ReturnType<typeof getSql>): Promise<CampaignRow[]> {
  const rows = await db`
    SELECT id, slug, title, world
    FROM campaigns
    ORDER BY title ASC
  `;
  return rows as unknown as CampaignRow[];
}
