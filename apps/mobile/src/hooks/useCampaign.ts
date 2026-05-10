import { useEffect, useState } from "react";
import type { CampaignDto } from "@/services/api/campaign-api";
import { fetchCampaigns } from "@/services/api/campaign-api";

export function useCampaignList() {
  const [data, setData] = useState<CampaignDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchCampaigns();
        if (!cancelled) {
          setData(rows);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { campaigns: data, loading, error };
}
