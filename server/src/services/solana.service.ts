import { LOREKEEPER_PROGRAM_ID } from "@lorekeeper/solana-idl";

/** Server-side Solana helpers — extend with Anchor provider + keypair loading. */
export function programId(): string {
  return process.env.SOLANA_PROGRAM_ID?.trim() || LOREKEEPER_PROGRAM_ID;
}
