import type { Request, Response } from "express";
import { listCampaigns } from "../db/queries/campaign.queries";
import { getSql } from "../services/neonpg.service";
import { err, ok } from "../types/api.types";

export async function listCampaignsHandler(_req: Request, res: Response): Promise<void> {
  try {
    const rows = await listCampaigns(getSql());
    res.json(ok(rows));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Campaign query failed";
    res.status(503).json(err(message));
  }
}
