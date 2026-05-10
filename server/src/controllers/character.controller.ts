import type { Request, Response } from "express";
import { listCharactersForPlayer } from "../db/queries/character.queries";
import {
  findProfileByWallet,
  upsertProfile,
} from "../db/queries/player.queries";
import { getSql } from "../services/neonpg.service";
import { err, ok } from "../types/api.types";

export async function listCharactersHandler(req: Request, res: Response): Promise<void> {
  const wallet = (req as Request & { walletAddress?: string }).walletAddress;
  if (!wallet) {
    res.status(401).json(err("Unauthorized"));
    return;
  }
  try {
    const db = getSql();
    const profile = await findProfileByWallet(db, wallet);
    if (!profile) {
      res.json(ok([]));
      return;
    }
    const chars = await listCharactersForPlayer(db, profile.id);
    res.json(ok(chars));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Character query failed";
    res.status(503).json(err(message));
  }
}

export async function createProfileHandler(req: Request, res: Response): Promise<void> {
  const wallet = (req as Request & { walletAddress?: string }).walletAddress;
  if (!wallet) {
    res.status(401).json(err("Unauthorized"));
    return;
  }
  const displayName =
    typeof req.body?.displayName === "string" ? req.body.displayName.trim() : "";
  if (displayName.length < 2) {
    res.status(400).json(err("displayName must be at least 2 characters"));
    return;
  }
  try {
    const db = getSql();
    const row = await upsertProfile(db, wallet, displayName);
    res.json(ok(row));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Profile save failed";
    res.status(503).json(err(message));
  }
}
