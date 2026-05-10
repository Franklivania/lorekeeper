import type { NextFunction, Request, Response } from "express";

const WINDOW_MS = 60_000;
const MAX = 300;
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (process.env.ENABLE_RATE_LIMIT !== "true") {
    next();
    return;
  }
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const bucket = hits.get(ip);
  if (!bucket || now > bucket.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }
  if (bucket.count >= MAX) {
    res.status(429).json({
      status: "error",
      data: null,
      message: "Too many requests",
    });
    return;
  }
  bucket.count += 1;
  next();
}
