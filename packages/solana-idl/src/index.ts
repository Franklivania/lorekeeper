/**
 * Shared LoreKeeper program constants and IDL metadata.
 * Run `anchor build` then `bun --filter @lorekeeper/solana-idl generate` to refresh JSON.
 */

/** Placeholder devnet program id — replace after `anchor deploy` + keys sync. */
export const LOREKEEPER_PROGRAM_ID =
  "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFLSn" as const;

export type LorekeeperProgramId = typeof LOREKEEPER_PROGRAM_ID;
