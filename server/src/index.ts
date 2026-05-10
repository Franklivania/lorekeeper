import cors from "cors";
import express from "express";
import helmet from "helmet";
import { LOREKEEPER_PROGRAM_ID } from "@lorekeeper/solana-idl";
import { campaignRouter } from "./routes/campaign.routes";
import { characterRouter } from "./routes/character.routes";
import { lifiRouter } from "./routes/lifi.routes";
import { sessionRouter } from "./routes/session.routes";
import { toolsRouter } from "./routes/tools.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { rateLimitMiddleware } from "./middleware/rate-limit.middleware";
import { ok } from "./types/api.types";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(helmet());
app.use(express.json({ limit: "512kb" }));

const origins =
  process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ??
  [];
app.use(
  cors({
    origin: origins.length > 0 ? origins : true,
  }),
);

if (process.env.ENABLE_REQUEST_LOGGING === "true") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.use(rateLimitMiddleware);

app.get("/health", (_req, res) => {
  res.json(
    ok({
      service: "lorekeeper-server",
      programId: process.env.SOLANA_PROGRAM_ID ?? LOREKEEPER_PROGRAM_ID,
    }),
  );
});

app.use("/campaigns", campaignRouter);
app.use("/characters", characterRouter);
app.use("/sessions", sessionRouter);
app.use("/lifi", lifiRouter);
app.use("/tools", toolsRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`LoreKeeper server listening on http://localhost:${port}`);
});
