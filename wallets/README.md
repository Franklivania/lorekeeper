# LoreKeeper dev wallets

**Never commit** `*.json` keypair files or seed phrases. This folder is listed in `.gitignore`.

## One-time setup (after `solana-keygen`)

Copy the keypair you generated into this repo so Anchor and scripts resolve a stable path:

**WSL / Linux** (from repo root):

```bash
mkdir -p wallets
cp ~/.config/solana/id.json ./wallets/lorekeeper-dev.json
```

**Windows** (PowerShell, adjust source if your keypair lives elsewhere):

```powershell
New-Item -ItemType Directory -Force wallets | Out-Null
Copy-Item "$env:USERPROFILE\.config\solana\id.json" "wallets\lorekeeper-dev.json"
```

Then:

1. `Anchor.toml` → `wallet = "wallets/lorekeeper-dev.json"` (already set in repo).
2. Run `bun run env:seed` so root `.env` gets `ANCHOR_WALLET=wallets/lorekeeper-dev.json` from `global.env.local`.

Fund the pubkey on devnet: `solana airdrop 2 $(solana-keygen pubkey wallets/lorekeeper-dev.json)` (from repo root, or pass the pubkey printed by `solana-keygen pubkey`).

## Security

- If a **seed phrase** was ever pasted into chat, logs, or a ticket, treat that wallet as **burned** for mainnet and generate a new keypair for production.
- `DM_AUTHORITY_KEYPAIR` in `server/.env` should be a **separate** funded key for production mint authority; for local hackathon you may point it at the same file once the server loads keypaths.
