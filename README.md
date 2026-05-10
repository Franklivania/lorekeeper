# LoreKeeper

A voice-driven, on-chain fantasy RPG for mobile. Players connect a Solana wallet,
mint an on-chain identifier, create characters, and play voice-led story sessions
where their actions are recorded as on-chain events and rewarded with relic NFTs.

LoreKeeper is built for the Dev3pack hackathon and targets four tracks at once —
**Solana**, **Solana Mobile**, **ElevenLabs**, and **LI.FI** — as one coherent
system rather than four bolt-ons.

> **Status:** scaffolding phase. The Bun monorepo, Anchor program shell, server
> bridge, and mobile app are wired together; the core gameplay loop is being
> implemented next. See [Roadmap](#roadmap) for the build order.

---

## Table of contents

1. [What it does](#what-it-does)
2. [Architecture](#architecture)
3. [Repository layout](#repository-layout)
4. [Tech stack](#tech-stack)
5. [Prerequisites](#prerequisites)
6. [Quick start](#quick-start)
7. [Environment model](#environment-model)
8. [Common scripts](#common-scripts)
9. [Solana / Anchor workflow](#solana--anchor-workflow)
10. [Mobile app](#mobile-app)
11. [Server](#server)
12. [Database](#database)
13. [Deployment targets](#deployment-targets)
14. [Roadmap](#roadmap)
15. [Documentation index](#documentation-index)
16. [Contributing rules](#contributing-rules)
17. [Security](#security)
18. [License](#license)

---

## What it does

The end-to-end loop the project is built around:

```
wallet connect
  → on-chain player registration (PDA + identifier NFT mint)
  → profile creation
  → character creation (max 3 per player)
  → campaign selection (5 worlds)
  → session start
  → DM narration via ElevenLabs voice agent
  → player response by voice / text / card choice
  → session event appended on-chain and in NeonDB
  → sub-strength updated
  → relic NFT minted when triggered
  → inventory + profile reflect new state
```

Every layer of the stack — mobile app, backend, Solana program, database, IDL
package — must agree on `player`, `wallet`, `character`, `campaign`, `session`,
`relic`, `world`, and `sub_strength` identities. That alignment is enforced by
the shared `packages/solana-idl` types.

---

## Architecture

```
┌──────────────────────┐    HTTP/JSON     ┌──────────────────────┐
│  apps/mobile         │ ───────────────► │  server (Node.js)    │
│  Expo + React Native │                  │  Express + Anchor    │
│  Expo Router         │ ◄─────────────── │  ElevenLabs tools    │
│  Mobile Wallet       │                  │  LI.FI bridge        │
│  Adapter             │                  │  NeonDB connection   │
└──────────┬───────────┘                  └──────────┬───────────┘
           │                                         │
           │ Solana Mobile signing                   │ Anchor RPC
           │                                         │
           ▼                                         ▼
┌──────────────────────────────────────────────────────────────────┐
│        Solana program (programs/lorekeeper, Anchor + Rust)       │
│  register_player · create_character · create_campaign            │
│  create_session · end_session · mint_relic · fund_pool           │
│  update_sub_strength                                             │
└──────────────────────────────────────────────────────────────────┘
                          ▲
                          │ generated IDL types
                          │
              ┌───────────┴────────────┐
              │ packages/solana-idl    │ ◄── consumed by mobile + server
              └────────────────────────┘
```

Source-of-truth boundaries:

- **On-chain**: player profile PDA, character PDA, session PDA, relic mint, treasure pool.
- **Off-chain (NeonDB)**: cached profiles, append-only `session_events`, derived sub-strengths.
- **Server**: signs DM-authority transactions, brokers ElevenLabs tool calls, exposes LI.FI quotes.
- **Mobile**: never holds private keys for the program; player signs through Mobile Wallet Adapter.

---

## Repository layout

```
lorekeeper/
├── apps/
│   └── mobile/              # Expo React Native app (portrait, dark, full-screen)
├── packages/
│   └── solana-idl/          # Generated Anchor IDL → TypeScript types (shared)
├── programs/
│   └── lorekeeper/          # Anchor / Rust on-chain program
├── server/                  # Node.js backend (Express, ElevenLabs, LI.FI, NeonDB)
├── scripts/
│   └── seed-env.ts          # Propagates global.env.local → .env files (Bun)
├── wallets/                 # Local-only Solana keypair files (gitignored)
├── Anchor.toml              # Anchor provider + program IDs
├── Cargo.toml               # Rust workspace root
├── rust-toolchain.toml      # Pins Rust toolchain for BPF builds
├── bun-workspace.yaml       # Bun workspaces (apps/*, packages/*, server)
├── turbo.json               # Turborepo task graph
├── package.json             # Root scripts (Bun + Turbo)
├── bun.lock                 # The only lockfile in this repo
├── global.env.local         # Master env source — never commit (gitignored)
├── .env.example             # Reference env (no secrets)
├── AGENTS.md                # Build rules for AI agents working on this repo
├── PROJECT_SETUP.md         # Detailed setup steps
├── DESIGN.md                # Visual + UX design system
├── SVG_SETUP.md             # SVG / animated world scene rules
├── FOLDER_STRUCTURE.md      # Full intended monorepo tree
└── DEPLOYMENT.md            # EAS / Railway / Neon / Solana deploy guides
```

For the full intended tree (including every component/hook/store the mobile app
will eventually have), see `FOLDER_STRUCTURE.md`.

---

## Tech stack

| Layer | Tools |
|---|---|
| Package manager | **Bun** (only — no npm/pnpm/yarn lockfiles allowed) |
| Monorepo | Bun workspaces + Turborepo |
| Mobile | Expo SDK, React Native, Expo Router, Zustand, `react-native-svg`, `react-native-svg-transformer`, Solana Mobile Wallet Adapter |
| Server | Node.js, TypeScript, Express, Anchor TypeScript client, `@neondatabase/serverless` |
| Smart contract | Rust 1.85, Anchor 0.30.1, Solana 1.18+ |
| Voice | ElevenLabs Voice Agents (one voice per world) |
| Bridging | LI.FI SDK (treasure pool funding) |
| Database | Neon Postgres |
| Mobile distribution | EAS (APK for Solana dApp Store + internal preview) |
| Backend hosting | Railway |

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Bun | 1.2+ | https://bun.sh |
| Node.js | 20 LTS | for tools that still need a Node binary |
| Rust | stable, pinned via `rust-toolchain.toml` (1.85) | `rustup toolchain install stable` |
| Solana CLI | 1.18+ | `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"` |
| Anchor CLI | 0.30.1 | `cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.30.1` |
| EAS CLI | latest | `bun add -g eas-cli` |
| `psql` | any recent | for `db:migrate` against Neon |

Windows users: WSL2 (Ubuntu) is the smoothest path for Anchor + Solana CLI;
PowerShell works for Bun, Expo, and EAS.

---

## Quick start

```bash
# 1. Clone and install
git clone <repo-url> lorekeeper
cd lorekeeper
bun install

# 2. Create the master env file (not committed) and seed per-package envs
cp global.env.local.example global.env.local   # if present, otherwise edit global.env.local directly
bun run env:seed                                # writes .env, apps/mobile/.env, server/.env

# 3. Set up your Solana dev wallet (see wallets/README.md)
solana-keygen new --outfile ~/.config/solana/id.json
mkdir -p wallets
cp ~/.config/solana/id.json ./wallets/lorekeeper-dev.json
solana config set --url devnet
solana airdrop 2 "$(solana-keygen pubkey wallets/lorekeeper-dev.json)"

# 4. Build the Solana program and generate IDL types
anchor build
bun --filter @lorekeeper/solana-idl build

# 5. Run the database migration (after DATABASE_URL is set in server/.env)
bun run db:migrate

# 6. Start the full stack (server + mobile dev server)
bun dev
```

The mobile app will tell you to scan a QR code with Expo Go or run on an Android
emulator. The server listens on `http://localhost:3001`.

---

## Environment model

Three layers, all fed from a single source of truth:

```
global.env.local   ──┐
                     │  bun run env:seed
                     ├──►  .env                  (root: Anchor, deploy, infra)
                     ├──►  apps/mobile/.env      (only EXPO_PUBLIC_* + EAS keys)
                     └──►  server/.env           (DB, JWT, DM keypair, ElevenLabs, LI.FI)
```

Rules enforced by `scripts/seed-env.ts`:

- `global.env.local` is **gitignored**. It holds every key for local dev.
- `apps/mobile/.env` has a hard blocklist — `DATABASE_URL`, `JWT_SECRET`,
  `DM_AUTHORITY_KEYPAIR`, `ELEVENLABS_API_KEY`, `RAILWAY_TOKEN`, `EXPO_TOKEN`,
  and `ANCHOR_WALLET` are refused. Anything starting with `EXPO_PUBLIC_` ends up
  in the shipped app bundle and must be safe to expose.
- `server/.env` carries all server secrets, including `DM_AUTHORITY_KEYPAIR` as a
  base58 string (see `wallets/README.md` for conversion).
- The root `.env` is the place for Anchor / deploy / infra keys
  (`ANCHOR_WALLET`, `ANCHOR_PROVIDER_URL`, `DEPLOYED_PROGRAM_ID`,
  `RAILWAY_TOKEN`, `EAS_PROJECT_ID`, etc.).

Reference files:

- `.env.example` — root keys
- `apps/mobile/.env.example` — mobile public keys only
- `server/.env.example` — server secrets

---

## Common scripts

Run from the repo root unless noted otherwise.

| Command | What it does |
|---|---|
| `bun install` | Install all workspace deps |
| `bun run env:seed` | Generate `.env` files from `global.env.local` |
| `bun dev` | `turbo run dev --filter=server --filter=mobile` |
| `bun run build` | Build server, mobile, and the IDL package |
| `bun run build:android` | EAS Android build for the mobile app |
| `bun run lint` | Lint every workspace |
| `bun run type-check` | Type-check every workspace |
| `bun run format` | Prettier across the repo |
| `bun run deploy:program` | `anchor deploy` |
| `bun run db:migrate` | `bun --filter server db:migrate` (psql against `DATABASE_URL`) |
| `anchor build` | Build the on-chain program |
| `anchor test` | Run program tests |

Workspace-scoped:

```bash
bun --filter mobile <script>      # apps/mobile
bun --filter server <script>      # server
bun --filter @lorekeeper/solana-idl <script>
```

---

## Solana / Anchor workflow

```bash
# Build → deploy to devnet → sync IDs everywhere
anchor build
anchor deploy

# Copy the printed program ID into:
#   - Anchor.toml [programs.devnet]
#   - global.env.local DEPLOYED_PROGRAM_ID + SOLANA_PROGRAM_ID
#   - re-run: bun run env:seed
```

Wallet for deploys lives in `wallets/lorekeeper-dev.json`; full setup, funding,
DM-authority conversion, and rotation steps are in
[`wallets/README.md`](./wallets/README.md).

After every program rebuild, regenerate the shared IDL package so mobile + server
pick up the new types:

```bash
bun --filter @lorekeeper/solana-idl generate
```

---

## Mobile app

```bash
cd apps/mobile
bun start                # Expo dev server
bun android              # Android emulator / device
eas build --profile preview --platform android   # APK for dApp Store / hackathon demo
eas build --profile production --platform android # AAB for store release
```

Design constraints (enforced everywhere — see `DESIGN.md`):

- **Portrait locked, dark only, full screen.** No light mode, no landscape.
- **World-reactive.** Each of the five worlds (`aethon`, `mechara`, `khoras`, `mirren`, `vael`) overrides primary/secondary/glow/accent/background colours and swaps in its own animated SVG scene.
- **Voice-first.** The DM speaks; the UI shows consequences. Body text is rare.
- Animated world scenes are `.tsx` components using `react-native-svg`, **not** static `.svg` imports — see `SVG_SETUP.md`.

---

## Server

```bash
cd server
bun dev          # ts-node-dev, hot reload, http://localhost:3001
bun build        # tsc → dist/
bun start        # node dist/index.js
bun db:migrate   # psql $DATABASE_URL -f src/db/schema.sql
```

Layout (see `FOLDER_STRUCTURE.md` for the full version):

```
server/src/
├── index.ts          # Express entry
├── routes/           # HTTP routing only
├── controllers/      # request/response shaping
├── services/         # business logic (elevenlabs, solana, lifi, neonpg)
├── db/               # schema.sql, migrations, queries
├── middleware/       # wallet-signature auth, errors, rate limits
├── lib/              # keypair loader, anchor client, constants
└── types/            # server-only types
```

Standard API response shape:

```json
{ "status": "success", "data": {}, "message": "Request completed successfully" }
```

Auth is **wallet-signature based** — no email/password.

---

## Database

NeonDB Postgres, accessed by the server only. Mobile never touches the DB.

Core tables (full schema in `server/src/db/schema.sql`):

```
player_profiles    characters       sessions
session_events     sub_strengths    relics
campaigns          treasure_pools
```

`session_events` is **append-only** — gameplay history must be preserved.
`relics` is a cache of on-chain state; the chain is the source of truth.

---

## Deployment targets

| Layer | Platform | Notes |
|---|---|---|
| Mobile | EAS | Preview APK for Solana dApp Store + hackathon demo, Production AAB for store |
| Server | Railway | Auto-deploys from `main`; env vars in Railway dashboard |
| Solana program | Solana devnet → mainnet-beta | Anchor deploy; upgrade authority on the deploy wallet |
| Database | Neon | One project per environment, branch-per-feature where useful |

Hackathon submission build:

```bash
eas build --profile preview --platform android
```

Full deployment runbook: `DEPLOYMENT.md`.

---

## Roadmap

Build order (do not skip ahead — this is the spine of the system):

1. Monorepo + env + shared TS config — **done**
2. Server foundation + DB schema/migration
3. Anchor program scaffold (state + instruction stubs)
4. IDL generation package wired into mobile + server
5. Expo mobile shell + routing + Zustand stores
6. Wallet connect → on-chain player registration → identifier NFT mint
7. Profile creation → character creation
8. Campaign / session lifecycle
9. Story feed + voice input + ElevenLabs tool routing
10. Animated SVG world scenes
11. Relic mint trigger + sub-strength updates
12. LI.FI treasure pool funding flow
13. Production polish + dApp Store submission

Anything beyond the MVP loop (advanced animations, full LI.FI, marketplace,
admin tooling) is explicitly deferred.

---

## Documentation index

| File | When to read it |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | Non-negotiable build rules for AI agents working on this repo |
| [`PROJECT_SETUP.md`](./PROJECT_SETUP.md) | Step-by-step environment, Solana, Neon, EAS setup |
| [`FOLDER_STRUCTURE.md`](./FOLDER_STRUCTURE.md) | Full intended monorepo tree |
| [`DESIGN.md`](./DESIGN.md) | Colours, typography, components, world palettes, motion |
| [`SVG_SETUP.md`](./SVG_SETUP.md) | Static vs. animated SVG rules + Metro config |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | EAS, Railway, Neon, Solana deploy + CI/CD |
| [`wallets/README.md`](./wallets/README.md) | Solana keypair handling, DM authority, rotation |

---

## Contributing rules

The short version (full version in `AGENTS.md`):

- **Bun only.** Don't introduce `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`.
- **One coherent system.** Don't add UI that can't be wired to data, backend
  routes that don't match a mobile flow, or program instructions that aren't
  consumed via the IDL package.
- **Naming**: kebab-case files, PascalCase components, camelCase hooks,
  SCREAMING_SNAKE constants, snake_case Rust + DB.
- **TypeScript strict.** Avoid `any`. Use the shared `Result<T>` shape and the
  standard API response shape.
- **Run checks before stopping**: `bun run type-check`, `bun run lint`,
  and the relevant `bun run build` / `anchor build`.

Before opening a PR:

```bash
bun run type-check
bun run lint
bun run build
anchor build   # if you touched programs/
```

---

## Security

- Never commit real `.env` files, `global.env.local`, or any `wallets/*.json`.
- Never expose `DATABASE_URL`, `JWT_SECRET`, `DM_AUTHORITY_KEYPAIR`,
  `ELEVENLABS_API_KEY`, `RAILWAY_TOKEN`, or `EXPO_TOKEN` to the mobile bundle.
  `EXPO_PUBLIC_*` is the only safe prefix on the client.
- The mainnet program upgrade authority should be on a hardware wallet or
  multisig — not in `wallets/`.
- Rotation procedure for leaked keys: see `wallets/README.md`.
- Report security issues privately, not in public issues.

---

## License

TBD. Until a license is committed, treat this repository as **All Rights
Reserved** — no redistribution or derivative works without explicit permission.
