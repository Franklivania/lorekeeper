#!/usr/bin/env bun
/**
 * Seeds `.env`, `apps/mobile/.env`, and `server/.env` from `global.env.local`.
 * Does not print secret values — only destination paths and key names.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const GLOBAL_PATH = join(REPO_ROOT, "global.env.local");

const HEADER_LINES = [
  "# Generated from global.env.local for local development",
  "# Do not commit real secrets",
  "",
];

/** Keys allowed in repo root `.env` (from project conventions). */
const ROOT_KEYS_ORDERED = [
  "APP_NAME",
  "APP_ENV",
  "APP_STAGE",
  "APP_DOMAIN",
  "API_DOMAIN",
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "SOLANA_CLUSTER",
  "SOLANA_RPC_URL",
  "SOLANA_PROGRAM_ID",
  "ANCHOR_PROVIDER_URL",
  "ANCHOR_WALLET",
  "DEPLOYED_PROGRAM_ID",
  "NEON_PROJECT_ID",
  "NEON_BRANCH",
  "EXPO_TOKEN",
  "EAS_PROJECT_ID",
  "RAILWAY_TOKEN",
  "RAILWAY_SERVICE_NAME",
  "LOG_LEVEL",
] as const;

/** Keys allowed in `apps/mobile/.env` — never server-only secrets. */
const MOBILE_KEYS_ORDERED = [
  "EXPO_PUBLIC_APP_NAME",
  "EXPO_PUBLIC_APP_ENV",
  "EXPO_PUBLIC_API_BASE_URL",
  "EXPO_PUBLIC_SOLANA_CLUSTER",
  "EXPO_PUBLIC_SOLANA_RPC_URL",
  "EXPO_PUBLIC_SOLANA_PROGRAM_ID",
  "EXPO_PUBLIC_ELEVENLABS_AGENT_ID",
  "EXPO_PUBLIC_ENABLE_VOICE",
  "EXPO_PUBLIC_ENABLE_HAPTICS",
  "EXPO_PUBLIC_ENABLE_SOUND",
  "EXPO_PUBLIC_ENABLE_DEV_TOOLS",
  "EAS_PROJECT_ID",
  "ANDROID_PACKAGE",
] as const;

/** Keys allowed in `server/.env`. */
const SERVER_KEYS_ORDERED = [
  "NODE_ENV",
  "PORT",
  "ALLOWED_ORIGINS",
  "JWT_SECRET",
  "JWT_EXPIRY",
  "DATABASE_URL",
  "SOLANA_CLUSTER",
  "SOLANA_RPC_URL",
  "SOLANA_PROGRAM_ID",
  "DM_AUTHORITY_KEYPAIR",
  "METAPLEX_COLLECTION_ADDRESS",
  "IDENTIFIER_COLLECTION_ADDRESS",
  "ELEVENLABS_API_KEY",
  "ELEVENLABS_AGENT_ID",
  "ELEVENLABS_VOICE_AETHON",
  "ELEVENLABS_VOICE_MECHARA",
  "ELEVENLABS_VOICE_KHORAS",
  "ELEVENLABS_VOICE_MIRREN",
  "ELEVENLABS_VOICE_VAEL",
  "LIFI_API_URL",
  "LIFI_INTEGRATOR",
  "LOG_LEVEL",
  "ENABLE_REQUEST_LOGGING",
  "ENABLE_RATE_LIMIT",
] as const;

const ROOT_ALLOW = new Set<string>(ROOT_KEYS_ORDERED);
const MOBILE_ALLOW = new Set<string>(MOBILE_KEYS_ORDERED);
const SERVER_ALLOW = new Set<string>(SERVER_KEYS_ORDERED);

/** Blocklist: never copy these into mobile under any circumstance. */
const MOBILE_BLOCKLIST = new Set([
  "DATABASE_URL",
  "JWT_SECRET",
  "DM_AUTHORITY_KEYPAIR",
  "ELEVENLABS_API_KEY",
  "RAILWAY_TOKEN",
  "EXPO_TOKEN",
  "ANCHOR_WALLET",
]);

function parseEnvFile(content: string): Map<string, string> {
  const map = new Map<string, string>();
  const lines = content.split(/\r?\n/);
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    map.set(key, value);
  }
  return map;
}

function escapeEnvDoubleQuoted(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatEnvLine(key: string, value: string): string {
  if (
    value === "" ||
    /[\s#"'\\]/.test(value) ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `${key}="${escapeEnvDoubleQuoted(value)}"`;
  }
  return `${key}=${value}`;
}

function mergeIntoDestination(
  globalMap: Map<string, string>,
  existingMap: Map<string, string>,
  allowlist: Set<string>,
  /** Keys that must never be preserved from an existing file (e.g. mobile safety). */
  denyPreserve?: Set<string>,
): { merged: Map<string, string>; droppedPreserve: string[] } {
  const result = new Map<string, string>();
  const droppedPreserve: string[] = [];

  for (const [key, value] of existingMap) {
    if (allowlist.has(key)) continue;
    if (denyPreserve?.has(key)) {
      droppedPreserve.push(key);
      continue;
    }
    result.set(key, value);
  }

  for (const key of allowlist) {
    if (globalMap.has(key)) {
      result.set(key, globalMap.get(key)!);
    } else if (existingMap.has(key)) {
      result.set(key, existingMap.get(key)!);
    }
  }

  return { merged: result, droppedPreserve };
}

function serializeOrdered(
  merged: Map<string, string>,
  orderedAllowlist: readonly string[],
  allowSet: Set<string>,
): string {
  const lines: string[] = [...HEADER_LINES];

  for (const key of orderedAllowlist) {
    if (merged.has(key)) {
      lines.push(formatEnvLine(key, merged.get(key)!));
    }
  }

  const extras = [...merged.keys()]
    .filter((k) => !allowSet.has(k))
    .sort((a, b) => a.localeCompare(b));

  if (extras.length > 0) {
    lines.push("");
    lines.push("# Preserved keys not managed by seed-env (local overrides)");
    for (const key of extras) {
      lines.push(formatEnvLine(key, merged.get(key)!));
    }
  }

  return lines.join("\n").replace(/\n*$/, "\n");
}

function ensureParentDir(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
}

function loadExisting(path: string): Map<string, string> {
  if (!existsSync(path)) return new Map();
  return parseEnvFile(readFileSync(path, "utf8"));
}

function assertMobileSafety(
  merged: Map<string, string>,
  destinationLabel: string,
): void {
  for (const blocked of MOBILE_BLOCKLIST) {
    if (merged.has(blocked)) {
      throw new Error(
        `[seed-env] Refusing to write ${destinationLabel}: disallowed key "${blocked}" would be present. Check merge logic.`,
      );
    }
  }
}

function main(): void {
  if (!existsSync(GLOBAL_PATH)) {
    console.error(
      `[seed-env] Missing ${GLOBAL_PATH}. Create global.env.local first.`,
    );
    process.exit(1);
  }

  const globalMap = parseEnvFile(readFileSync(GLOBAL_PATH, "utf8"));

  const rootPath = join(REPO_ROOT, ".env");
  const mobilePath = join(REPO_ROOT, "apps", "mobile", ".env");
  const serverPath = join(REPO_ROOT, "server", ".env");

  const existingRoot = loadExisting(rootPath);
  const existingMobile = loadExisting(mobilePath);
  const existingServer = loadExisting(serverPath);

  const { merged: mergedRoot } = mergeIntoDestination(
    globalMap,
    existingRoot,
    ROOT_ALLOW,
  );
  const { merged: mergedMobile, droppedPreserve: droppedMobile } =
    mergeIntoDestination(globalMap, existingMobile, MOBILE_ALLOW, MOBILE_BLOCKLIST);
  if (droppedMobile.length > 0) {
    console.log(
      `[seed-env] Removed disallowed keys from mobile env (not naming values): ${droppedMobile.sort().join(", ")}`,
    );
  }
  assertMobileSafety(mergedMobile, mobilePath);

  const { merged: mergedServer } = mergeIntoDestination(
    globalMap,
    existingServer,
    SERVER_ALLOW,
  );

  ensureParentDir(rootPath);
  ensureParentDir(mobilePath);
  ensureParentDir(serverPath);

  writeFileSync(
    rootPath,
    serializeOrdered(mergedRoot, ROOT_KEYS_ORDERED, ROOT_ALLOW),
    "utf8",
  );
  writeFileSync(
    mobilePath,
    serializeOrdered(mergedMobile, MOBILE_KEYS_ORDERED, MOBILE_ALLOW),
    "utf8",
  );
  writeFileSync(
    serverPath,
    serializeOrdered(mergedServer, SERVER_KEYS_ORDERED, SERVER_ALLOW),
    "utf8",
  );

  const rootKeys = [...mergedRoot.keys()].sort((a, b) => a.localeCompare(b));
  const mobileKeys = [...mergedMobile.keys()].sort((a, b) =>
    a.localeCompare(b),
  );
  const serverKeys = [...mergedServer.keys()].sort((a, b) =>
    a.localeCompare(b),
  );

  console.log(`Seeded root .env with ${rootKeys.length} keys`);
  console.log(`Keys: ${rootKeys.join(", ")}`);
  console.log(`Seeded apps/mobile/.env with ${mobileKeys.length} keys`);
  console.log(`Keys: ${mobileKeys.join(", ")}`);
  console.log(`Seeded server/.env with ${serverKeys.length} keys`);
  console.log(`Keys: ${serverKeys.join(", ")}`);
  console.log("Done.");
}

main();
