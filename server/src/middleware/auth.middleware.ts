import type { NextFunction, Request, Response } from "express";
import { err } from "../types/api.types";

/** Header used for wallet-signed auth (placeholder until signature verification ships). */
export const WALLET_HEADER = "x-wallet-address";

export function requireWallet(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const wallet = req.header(WALLET_HEADER);
  if (!wallet || wallet.trim() === "") {
    res.status(401).json(err("Missing wallet address"));
    return;
  }
  (req as Request & { walletAddress?: string }).walletAddress = wallet.trim();
  next();
}
