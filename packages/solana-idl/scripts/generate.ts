#!/usr/bin/env bun
/**
 * After `anchor build`, copies `target/idl/lorekeeper.json` next to this package
 * for bundlers that import JSON. Types remain hand-maintained until codgen is added.
 */

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const PKG_ROOT = join(import.meta.dir, "..");
const REPO_ROOT = join(PKG_ROOT, "..", "..");
const idlSource = join(REPO_ROOT, "target", "idl", "lorekeeper.json");
const idlDestDir = join(PKG_ROOT, "idl");
const idlDest = join(idlDestDir, "lorekeeper.json");

if (!existsSync(idlSource)) {
  console.error(
    `[solana-idl] Missing ${idlSource}. Run \`anchor build\` from the repo root first.`,
  );
  process.exit(1);
}

mkdirSync(idlDestDir, { recursive: true });
copyFileSync(idlSource, idlDest);
console.log(`[solana-idl] Wrote ${idlDest}`);
