import { getSql } from "../../services/neonpg.service";

export async function appendSessionEvent(
  sessionId: string,
  kind: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO session_events (session_id, kind, payload)
    VALUES (${sessionId}, ${kind}, ${sql.json(payload as never)})
  `;
}
