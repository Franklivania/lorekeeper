import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

export function getSql(): ReturnType<typeof postgres> {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim() === "") {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!sql) {
    sql = postgres(url, { max: 10 });
  }
  return sql;
}
