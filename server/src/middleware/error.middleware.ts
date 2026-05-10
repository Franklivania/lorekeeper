import type { NextFunction, Request, Response } from "express";
import { err } from "../types/api.types";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  res.status(500).json(err(message));
}
