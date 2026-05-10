import { apiGet } from "./http";

export type CampaignDto = {
  id: string;
  slug: string;
  title: string;
  world: string;
};

export async function fetchCampaigns(): Promise<CampaignDto[]> {
  const res = await apiGet<CampaignDto[]>("/campaigns");
  if (res.status !== "success" || !res.data) {
    throw new Error(res.message || "Failed to load campaigns");
  }
  return res.data;
}
