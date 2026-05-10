# LoreKeeper — `wallets/`

Local-only Solana keypair files used by Anchor, the deploy/upgrade flow, and any
script that needs to sign transactions during development.

> **Never commit `*.json` keypairs or seed phrases.** This folder is covered by
> `.gitignore` (`wallets/*.json`, `wallets/*.key`). The folder itself is checked in
> via this README so the path exists on every clone.

---

## What lives here

| File | Purpose | Tracked in git? |
|---|---|---|
| `README.md` | This file | yes |
| `lorekeeper-dev.json` | Local dev / devnet deploy keypair (also used as Anchor provider wallet) | **no** |
| `lorekeeper-staging.json` | Optional, devnet "staging" deploy keypair | **no** |
| `lorekeeper-prod.json` | Optional, mainnet deploy / upgrade authority | **no** |
| `dm-authority.json` | Source keypair for `DM_AUTHORITY_KEYPAIR` (server mint authority) | **no** |

What does **not** live here:

- Mainnet upgrade-authority keys for production releases — keep those on a hardware
  wallet or in a vault, not on disk.
- Player wallet keys — players sign in with their own Solana Mobile / phantom wallet
  via Mobile Wallet Adapter; the app never sees their private key.

---

## How the rest of the repo references these files

These wires must agree, otherwise `anchor build`, `anchor deploy`, and dev scripts
will fail with `wallet not found` or `account not funded`:

```
Anchor.toml          [provider] wallet = "wallets/lorekeeper-dev.json"
.env                 ANCHOR_WALLET=wallets/lorekeeper-dev.json
.env                 ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
global.env.local     ANCHOR_WALLET=wallets/lorekeeper-dev.json   (seed source)
.gitignore           wallets/*.json
                     wallets/*.key
```

`bun run env:seed` propagates `ANCHOR_WALLET` and `ANCHOR_PROVIDER_URL` from
`global.env.local` into the root `.env` (see `scripts/seed-env.ts`). It does **not**
copy `ANCHOR_WALLET` into `apps/mobile/.env` — that key is on the mobile blocklist by
design.

---

## One-time setup

### 1. Generate (or reuse) a Solana keypair

```bash
# Linux / macOS / WSL
solana-keygen new --outfile ~/.config/solana/id.json
```

```powershell
# Windows PowerShell
solana-keygen new --outfile "$env:USERPROFILE\.config\solana\id.json"
```

If you already have a keypair you want to reuse, skip the generate step.

### 2. Copy it into `wallets/lorekeeper-dev.json`

```bash
# Linux / macOS / WSL — from repo root
mkdir -p wallets
cp ~/.config/solana/id.json ./wallets/lorekeeper-dev.json
```

```powershell
# Windows PowerShell — from repo root
New-Item -ItemType Directory -Force wallets | Out-Null
Copy-Item "$env:USERPROFILE\.config\solana\id.json" "wallets\lorekeeper-dev.json"
```

### 3. Seed env files

```bash
bun run env:seed
```

This writes `ANCHOR_WALLET=wallets/lorekeeper-dev.json` into the root `.env`.

### 4. Point Solana CLI at devnet and fund the wallet

```bash
solana config set --url devnet
solana airdrop 2 "$(solana-keygen pubkey wallets/lorekeeper-dev.json)"
solana balance "$(solana-keygen pubkey wallets/lorekeeper-dev.json)"
```

You need ~2 SOL on devnet to cover an `anchor deploy`. If the airdrop faucet is
rate-limited, retry or use https://faucet.solana.com.

### 5. Verify

```bash
solana-keygen pubkey wallets/lorekeeper-dev.json     # prints pubkey
solana config get                                    # cluster should be devnet
anchor keys list                                     # should match Anchor.toml
```

---

## DM authority keypair (server-side)

The backend signs mint/event transactions with a **separate** keypair exposed to
`server/.env` as `DM_AUTHORITY_KEYPAIR` in **base58** form (not the JSON byte array
file path — server config is just an env string).

Generate and convert:

```bash
solana-keygen new --outfile wallets/dm-authority.json --no-bip39-passphrase
DM_PUB="$(solana-keygen pubkey wallets/dm-authority.json)"
solana airdrop 2 "$DM_PUB"

# Convert the 64-byte JSON keypair to a base58 string
bunx --bun ts-node -e "
import fs from 'node:fs';
import bs58 from 'bs58';
const arr = JSON.parse(fs.readFileSync('wallets/dm-authority.json','utf8'));
process.stdout.write(bs58.encode(Uint8Array.from(arr)));
"
```

Paste the output into `server/.env`:

```
DM_AUTHORITY_KEYPAIR=<base58-string>
```

Treat that string like a password. It must never leave the server. Do **not** put it
in `apps/mobile/.env`, `global.env.local` committed to git, or any client bundle.
The mobile env blocklist in `scripts/seed-env.ts` already forbids it.

For Railway production, store `DM_AUTHORITY_KEYPAIR` only in the Railway dashboard
(Variables tab) — do not commit it to `global.env.local`.

---

## Wallets per environment

For hackathon work a single `lorekeeper-dev.json` is fine. As soon as you ship,
split them by environment so a leaked dev key can't touch mainnet:

| Env | File | Cluster | Anchor.toml provider | Used by |
|---|---|---|---|---|
| local / hackathon | `wallets/lorekeeper-dev.json` | devnet | `Devnet` | `anchor build`, `anchor deploy`, scripts |
| staging | `wallets/lorekeeper-staging.json` | devnet | `Devnet` | CI preview deploys |
| production | `wallets/lorekeeper-prod.json` (or hardware wallet) | mainnet-beta | `Mainnet` | one-shot mainnet `anchor deploy` + upgrade auth |

Switch with the `ANCHOR_WALLET` env var or `--provider.wallet` flag — do not edit
`Anchor.toml` per build:

```bash
ANCHOR_WALLET=wallets/lorekeeper-prod.json \
ANCHOR_PROVIDER_URL=https://api.mainnet-beta.solana.com \
  anchor deploy --provider.cluster mainnet
```

---

## Security rules

1. Never commit `wallets/*.json` or any file containing a 64-byte keypair array.
2. Never paste a seed phrase into chat, an issue, a PR, a log line, or a screenshot.
   If you ever do — that wallet is **burned**: rotate immediately.
3. Never put `DM_AUTHORITY_KEYPAIR`, the raw keypair JSON, or its base58 form into
   `apps/mobile/` env files or any `EXPO_PUBLIC_*` variable. Anything `EXPO_PUBLIC_`
   ends up in the shipped app bundle.
4. Local dev keypairs are still real keys. Don't reuse a dev keypair for mainnet.
5. The mainnet program upgrade authority should ideally be a multisig or hardware
   wallet, not a file on a laptop.

If a key was leaked:

```bash
# 1. Drain any remaining balance to a fresh wallet you control
solana transfer <new-pubkey> ALL --keypair wallets/<leaked>.json --allow-unfunded-recipient

# 2. Generate a replacement
solana-keygen new --outfile wallets/<role>.json

# 3. Re-fund, re-run env:seed, redeploy where applicable
```

For a leaked **upgrade authority** on a deployed program, transfer it before any
attacker can:

```bash
solana program set-upgrade-authority <PROGRAM_ID> --new-upgrade-authority <new-pubkey>
```

---

## Troubleshooting

**`Error: Wallet "wallets/lorekeeper-dev.json" not found`**
You haven't copied a keypair into the folder. Re-run step 2 of "One-time setup".

**`Error: Account <pubkey> has insufficient funds`**
Devnet balance is below the deploy cost. Run
`solana airdrop 2 "$(solana-keygen pubkey wallets/lorekeeper-dev.json)"`.

**`Error: RPC request error: ... cluster ...`**
`Anchor.toml` `[provider] cluster` and the cluster the wallet is funded on don't
match. Run `solana config get` and `anchor keys list`, then align with
`ANCHOR_PROVIDER_URL` in `.env`.

**`anchor build` works but `anchor deploy` fails on a fresh laptop**
You restored the repo but didn't restore the keypair. The `.json` is gitignored on
purpose — copy it from your password manager / secure backup, then `bun run env:seed`.

**`DM_AUTHORITY_KEYPAIR` rejected by the server**
The env value must be a base58 string of the 64-byte secret key, not the JSON
array, not just the pubkey, and not a file path. Re-run the conversion snippet
above.

**Keypair pubkey doesn't match `Anchor.toml`**
That's fine — `Anchor.toml`'s `[programs.*]` block stores the **program ID**, not
your wallet pubkey. The program ID is set by `target/deploy/lorekeeper-keypair.json`
the first time `anchor build` runs. Your wallet just pays for the deploy.
