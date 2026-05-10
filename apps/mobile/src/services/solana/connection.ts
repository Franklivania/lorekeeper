import { clusterApiUrl, Connection } from "@solana/web3.js";

export function createSolanaConnection(): Connection {
  const custom = process.env.EXPO_PUBLIC_SOLANA_RPC_URL;
  if (custom && custom.trim().length > 0) {
    return new Connection(custom.trim(), "confirmed");
  }
  const cluster = (process.env.EXPO_PUBLIC_SOLANA_CLUSTER ?? "devnet") as
    | "devnet"
    | "testnet"
    | "mainnet-beta";
  return new Connection(clusterApiUrl(cluster), "confirmed");
}
