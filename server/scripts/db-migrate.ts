#!/usr/bin/env bun
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url || url.trim() === "") {
  console.error("[db:migrate] DATABASE_URL is not set.");
  process.exit(1);
}

const schemaPath = join(import.meta.dir, "..", "src", "db", "schema.sql");
const sql = postgres(url, { max: 1 });
try {
  const ddl = readFileSync(schemaPath, "utf8");
  await sql.unsafe(ddl);
  console.log("[db:migrate] Applied schema.sql");
} finally {
  await sql.end({ timeout: 5 });
}
