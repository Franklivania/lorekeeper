import type { Request, Response } from "express";
import { ok } from "../types/api.types";

/** ElevenLabs tool-call bridge placeholder. */
export function toolsEcho(req: Request, res: Response): void {
  const name = typeof req.body?.tool === "string" ? req.body.tool : "unknown";
  res.json(ok({ received: name }));
}
