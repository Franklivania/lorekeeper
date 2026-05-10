# LoreKeeper — Project Setup

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20+ | LTS recommended |
| bun | 1+ | Workspace manager |
| Rust | stable + nightly | `rustup toolchain install stable nightly` |
| Anchor CLI | 0.30+ | `cargo install --git https://github.com/coral-xyz/anchor anchor-cli` |
| Solana CLI | 1.18+ | `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"` |
| EAS CLI | latest | `bun add -g eas-cli` |
| Expo CLI | latest | Included via `expo` package |

---

## 1. bootstrap

Bun is the package manager for the app

---

## 2. Environment setup

```bash
# Root
cp .env.example .env

# Mobile app
cp apps/mobile/.env.example apps/mobile/.env

# Server
cp server/.env.example server/.env
```

Fill every variable — see `.env.example` at root for the full reference.

---

## 3. Solana / Anchor setup

**Rust / Cargo:** This repo pins toolchain via `rust-toolchain.toml` (`stable`). Anchor pulls crates whose manifests require a **recent Cargo** (not 1.84.x). Before building:

```bash
rustup update stable
cargo --version   # expect Cargo ≥ 1.85 after update
```

If `cargo --version` is still old, run `rustup self update` then `rustup update stable` again.

```bash
# Generate a local keypair for development (or copy into wallets/ — see wallets/README.md)
solana-keygen new --outfile ~/.config/solana/id.json

# Set cluster to devnet
solana config set --url devnet

# Airdrop SOL for deployment fees
solana airdrop 2

# Build + deploy from monorepo root (Anchor.toml lives here)
anchor build
anchor deploy

# Copy the program ID into Anchor.toml and .env
```

After deploy, copy the program ID output into:
- `Anchor.toml` → `[programs.devnet]`
- `apps/mobile/.env` → `EXPO_PUBLIC_SOLANA_PROGRAM_ID`
- `server/.env` → `SOLANA_PROGRAM_ID`

Generate the IDL type package:
```bash
anchor build
cd packages/solana-idl
bun run generate   # runs anchor idl parse → TypeScript types
```

---

## 4. Database setup (NeonDB)

```bash
# In Neon dashboard: create project "lorekeeper-dev"
# Copy connection string to server/.env as DATABASE_URL

# Run migrations
cd server
bun db:migrate     # runs psql against DATABASE_URL with schema.sql
```

---

## 5. Server

```bash
cd server
bun dev            # ts-node-dev, hot reload
```

Server runs on `http://localhost:3001`

---

## 6. Mobile app

```bash
cd apps/mobile
bun start          # Expo dev server

# On Android device or emulator
bun android

# EAS local build (APK for Solana Mobile dApp Store)
eas build --profile preview --platform android --local
```

---

## 7. Running the full stack locally

```bash
# From root, runs server + mobile Expo dev server in parallel
bun dev
```

Turborepo handles dependency ordering — server starts before mobile.

---

## Package manager: bun workspaces

```yaml
# bun-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'server'
```

Each workspace has its own `package.json`. Shared code lives in `packages/`.

---

## Key scripts (root `package.json`)

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "build:android": "turbo run build:android",
    "deploy:program": "anchor deploy",
    "db:migrate": "bun --filter server db:migrate",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  }
}
```

---

## Naming conventions

| Context | Convention | Example |
|---|---|---|
| Files | kebab-case | `world-scene.tsx`, `session-api.ts` |
| Hooks | camelCase | `useSession.ts`, `useWalletAuth.ts` |
| Components | PascalCase export, kebab file | `export default function WorldScene` in `world-scene.tsx` |
| Stores | kebab-case file, camelCase exports | `session-store.ts` → `useSessionStore` |
| Constants | SCREAMING_SNAKE | `SOLANA_PROGRAM_ID`, `MAX_CHARACTERS` |
| Types | PascalCase | `SessionState`, `RelicMetadata` |
| Rust | snake_case | `register_player.rs`, `fn mint_relic()` |
| DB tables | snake_case | `player_profiles`, `session_events` |

---

## TypeScript config (mobile)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@lore/*": ["lore/*"],
      "@svg/*": ["src/svg/*"]
    }
  }
}
```

---

## Expo config (`app.config.ts`)

```ts
import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'LoreKeeper',
  slug: 'lorekeeper',
  version: '1.0.0',
  orientation: 'portrait',          // portrait-locked, always
  userInterfaceStyle: 'dark',
  backgroundColor: '#0A0A0F',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#0A0A0F',
  },
  android: {
    package: 'xyz.lorekeeper.app',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#0A0A0F',
    },
    permissions: ['RECORD_AUDIO'],   // Voice input
  },
  plugins: [
    'expo-router',
    'expo-font',
    ['expo-av', { microphonePermission: 'LoreKeeper uses the mic for voice play.' }],
  ],
  extra: {
    eas: { projectId: process.env.EAS_PROJECT_ID },
  },
}

export default config
```

---

## EAS config (`eas.json`)

```json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account.json"
      }
    }
  }
}
```

Solana dApp Store submission uses the `preview` APK for hackathon, `production` AAB for store.