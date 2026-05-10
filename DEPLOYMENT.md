# LoreKeeper — Deployment Guidelines

## Overview: Where Each Layer Lives

| Layer | Platform | Notes |
|---|---|---|
| Mobile app | EAS (Expo Application Services) | APK → Solana dApp Store + internal distribution |
| Backend server | Railway | Node.js, auto-deploys from `main`, env vars managed in dashboard |
| Solana program | Solana devnet → mainnet | Anchor deploy, program ID permanent after mainnet |
| NeonDB | Neon.tech | Serverless Postgres, one project per environment |

---

## 1. Solana Program Deployment

### Devnet (development + hackathon submission)

```bash
# Ensure you are on devnet
solana config set --url devnet
solana config get   # Verify

# Fund your deploy wallet
solana airdrop 2
solana balance      # Confirm > 2 SOL

# Build
cd programs/lorekeeper
anchor build

# Deploy
anchor deploy

# Output: Program Id: <YOUR_PROGRAM_ID>
# → Copy this into Anchor.toml [programs.devnet]
# → Copy into server/.env and apps/mobile/.env
```

### Mainnet (post-hackathon)

```bash
solana config set --url mainnet-beta

# Ensure wallet has real SOL for deployment (~2-3 SOL)
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show <PROGRAM_ID>
```

### IDL publishing (makes program verifiable)

```bash
anchor idl init --filepath target/idl/lorekeeper.json <PROGRAM_ID>
```

### Upgrading the program

Programs deployed with `anchor deploy` are upgradeable by default. The upgrade authority is your deploy wallet.

```bash
anchor upgrade target/deploy/lorekeeper.so --program-id <PROGRAM_ID>
```

To make the program immutable (permanent — do this carefully):
```bash
solana program set-upgrade-authority <PROGRAM_ID> --final
```

---

## 2. NeonDB Setup

### Create project

1. Go to [neon.tech](https://neon.tech) → New Project
2. Name: `lorekeeper-prod` (and `lorekeeper-dev` for development)
3. Region: `us-east-2` (or closest to your Railway server region)
4. Copy the connection string

### Branching strategy (Neon-specific feature)

```
main branch    → production (used by Railway prod)
dev branch     → development (used locally + Railway preview)
```

Create a dev branch in Neon dashboard → use that connection string in local `.env`.

### Run migrations

```bash
# From server/
psql $DATABASE_URL -f src/db/schema.sql

# Or with the script:
bun db:migrate
```

### Schema overview

```sql
-- Core tables (see server/src/db/schema.sql for full definitions)

-- player_profiles: onchain pubkey + identifier NFT address + join number
-- characters: up to 3 per player, linked to world + campaign
-- sessions: active and completed sessions with state JSON
-- session_events: append-only event log per session
-- sub_strengths: accumulated sub-strength values per character
-- relics: minted relic metadata cache (source of truth is on-chain)
-- campaigns: campaign state per player+campaign combo
-- treasure_pools: LI.FI funded pools per campaign
```

---

## 3. Railway Server Deployment

### First deployment

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Service: select `server/` as the root directory
4. Railway detects Node.js automatically

### Environment variables (Railway dashboard)

Add all variables from `server/.env.example` in Railway's Variables tab:

```
PORT                        → Railway sets this automatically, don't override
NODE_ENV                    → production
DATABASE_URL                → From Neon prod branch connection string
SOLANA_RPC_URL              → https://api.mainnet-beta.solana.com (or devnet for hackathon)
SOLANA_PROGRAM_ID           → Your deployed program ID
DM_AUTHORITY_KEYPAIR        → Base58 encoded keypair (treat like a password)
ELEVENLABS_API_KEY          → From ElevenLabs dashboard
ELEVENLABS_AGENT_ID         → Your deployed agent ID
ELEVENLABS_VOICE_AETHON     → Voice IDs per world
ELEVENLABS_VOICE_MECHARA
ELEVENLABS_VOICE_KHORAS
ELEVENLABS_VOICE_MIRREN
ELEVENLABS_VOICE_VAEL
LIFI_API_URL                → https://li.quest/v1
LIFI_INTEGRATOR             → lorekeeper
JWT_SECRET                  → Long random string (generate: openssl rand -base64 32)
JWT_EXPIRY                  → 7d
ALLOWED_ORIGINS             → https://lorekeeper.xyz (+ any other allowed origins)
METAPLEX_COLLECTION_ADDRESS → Your collection NFT address
IDENTIFIER_COLLECTION_ADDRESS
```

### Railway configuration file

```toml
# server/railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node dist/index.js"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 3
```

### Build script (`server/package.json`)

```json
{
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn src/index.ts",
    "db:migrate": "psql $DATABASE_URL -f src/db/schema.sql"
  }
}
```

### Custom domain

Railway Settings → Domains → Add custom domain → `api.lorekeeper.xyz`

Update `apps/mobile/.env` production:
```
EXPO_PUBLIC_API_BASE_URL=https://api.lorekeeper.xyz
```

---

## 4. Mobile App — EAS Build + Distribution

### First-time EAS setup

```bash
cd apps/mobile
eas init        # Creates EAS project, generates projectId
eas build:configure   # Creates eas.json
```

### Development build (for testing with dev tools)

```bash
eas build --profile development --platform android
```

Install the resulting APK on your device. This build includes the Expo dev client.

### Preview build (for Solana Mobile dApp Store submission + hackathon)

```bash
eas build --profile preview --platform android
```

This produces a signed APK. Use this for:
- Hackathon demo video recording
- Internal team distribution
- Solana dApp Store submission (preview stage)

### Production build (for Solana Mobile dApp Store final)

```bash
eas build --profile production --platform android
```

Produces an `.aab` (App Bundle) for Play Store / dApp Store release submission.

### EAS environment variables

Add mobile environment variables to EAS:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SOLANA_RPC_URL --value "https://api.devnet.solana.com"
eas secret:create --scope project --name EXPO_PUBLIC_SOLANA_PROGRAM_ID --value "your_program_id"
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value "https://api.lorekeeper.xyz"
eas secret:create --scope project --name EXPO_PUBLIC_ELEVENLABS_AGENT_ID --value "your_agent_id"
```

Or manage in EAS dashboard: expo.dev → Your project → Secrets.

### Solana dApp Store submission

```bash
# Install the dApp Store CLI
npm install -g @solana-mobile/dapp-publish

# Submit (requires Solana keypair with sufficient SOL)
dapp-publish publish \
  --apk-path build.apk \
  --keypair ~/.config/solana/id.json \
  --url https://api.devnet.solana.com
```

App store listing config lives in `apps/mobile/app-store.json` (create this following the Solana Mobile dApp Store schema).

---

## 5. CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-server:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: bun/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'bun' }
      - run: bun install
      - run: bun --filter server build
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: server

  build-android-preview:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: bun/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'bun' }
      - run: bun install
      - run: bun add -g eas-cli
      - name: Build Android preview
        run: eas build --profile preview --platform android --non-interactive
        working-directory: apps/mobile
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 6. Environment Summary

| Environment | Program | API | DB | Mobile |
|---|---|---|---|---|
| Local dev | devnet | localhost:3001 | Neon dev branch | Expo dev server |
| Staging | devnet | Railway preview | Neon dev branch | EAS preview APK |
| Production | mainnet | Railway prod | Neon main branch | EAS production AAB |

---

## 7. Hackathon submission checklist

- [ ] Program deployed to devnet — program ID in README
- [ ] Contract deployment address in `apps/mobile/.env` and `server/.env`
- [ ] APK built via `eas build --profile preview`
- [ ] Server running on Railway (or accessible URL)
- [ ] Demo video recorded (under 3 minutes)
- [ ] Public GitHub repo with README covering all four track requirements
- [ ] Submitted to:
  - [ ] Dev3pack hackathon platform
  - [ ] Solana track (via hackathon platform)
  - [ ] ElevenLabs track (+ optional: showcase.elevenlabs.io)
  - [ ] LI.FI track
  - [ ] Solana Mobile track (APK to publish.solanamobile.com)