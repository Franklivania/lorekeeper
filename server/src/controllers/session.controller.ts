import type { Request, Response } from "express";
import { appendSessionEvent } from "../db/queries/session.queries";
import { err, ok } from "../types/api.types";

export async function postSessionEventHandler(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const sessionId = Array.isArray(rawId) ? rawId[0] : rawId;
  const kind = typeof req.body?.kind === "string" ? req.body.kind : "";
  const payload =
    typeof req.body?.payload === "object" && req.body.payload !== null
      ? (req.body.payload as Record<string, unknown>)
      : {};
  if (!sessionId || kind.trim() === "") {
    res.status(400).json(err("session id and kind are required"));
    return;
  }
  try {
    await appendSessionEvent(sessionId, kind, payload);
    res.json(ok({ sessionId, kind }));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Event append failed";
    res.status(503).json(err(message));
  }
}
