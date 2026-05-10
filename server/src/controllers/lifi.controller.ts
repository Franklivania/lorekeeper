import type { Request, Response } from "express";
import { ok } from "../types/api.types";

/** Placeholder until LI.FI wiring lands. */
export function lifiQuoteStub(_req: Request, res: Response): void {
  res.json(
    ok({
      status: "not_configured",
      integrator: process.env.LIFI_INTEGRATOR ?? null,
    }),
  );
}
