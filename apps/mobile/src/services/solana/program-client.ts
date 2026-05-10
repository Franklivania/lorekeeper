import { LOREKEEPER_PROGRAM_ID } from "@lorekeeper/solana-idl";
import { PublicKey } from "@solana/web3.js";

export function lorekeeperProgramId(): PublicKey {
  const fromEnv = process.env.EXPO_PUBLIC_SOLANA_PROGRAM_ID?.trim();
  const raw =
    fromEnv && fromEnv.length > 0 ? fromEnv : LOREKEEPER_PROGRAM_ID;
  return new PublicKey(raw);
}
