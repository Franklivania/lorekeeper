Create `AGENT.md` at the project root:

````md id="agent-md"
# AGENT.md — LoreKeeper Build Instructions

## Role

You are the primary engineering agent for **LoreKeeper**.

LoreKeeper is a full-screen, portrait-locked, dark-only Expo React Native game/dApp. It combines interactive fantasy RPG sessions, Solana wallet identity, Anchor smart contracts, NeonDB persistence, ElevenLabs voice interaction, LI.FI funding flows, and animated SVG world scenes.

Your job is to implement the project according to the documentation in this repository.

Read these files before making architectural decisions:

```txt
PROJECT_SETUP.md
FOLDER_STRUCTURE.md
DESIGN.md
SVG_SETUP.md
DEPLOYMENT.md
global.local
````

The docs are the source of truth unless this file overrides them.

---

## Non-Negotiable Rule: Bun First

This project uses **Bun**.

Do not use npm, pnpm, or yarn unless a tool explicitly cannot run with Bun.

### Required package manager behavior

Use:

```bash
bun install
bun add <package>
bun add -d <package>
bun remove <package>
bun run <script>
bun --filter <workspace> <script>
```

Do not generate:

```txt
package-lock.json
pnpm-lock.yaml
yarn.lock
```

The only package lockfile should be:

```txt
bun.lock
```

If documentation still mentions `pnpm-workspace.yaml`, treat that as stale. Use:

```txt
bun-workspace.yaml
```

Correct root workspace file:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "server"
```

---

## Project Type

LoreKeeper is a monorepo.

Expected root shape:

```txt
lorekeeper/
├── apps/
│   └── mobile/
├── packages/
│   └── solana-idl/
├── programs/
│   └── lorekeeper/
├── server/
├── Anchor.toml
├── Cargo.toml
├── package.json
├── bun-workspace.yaml
├── turbo.json
├── .env.example
├── global.local
└── AGENT.md
```

The project has four major layers:

```txt
Mobile app          Expo React Native
Backend server      Node.js/TypeScript
Blockchain program  Solana Anchor/Rust
Shared package      Generated Anchor IDL TypeScript types
```

---

## Architectural Marriage

The project must be built as one coherent system, not separate disconnected parts.

The mobile app, backend server, Solana program, database, and shared IDL package must agree on:

```txt
player identity
wallet address
character identity
campaign identity
session identity
relic identity
world identity
sub-strength progression
```

The expected flow is:

```txt
wallet connect
→ on-chain player registration
→ identifier NFT mint
→ profile creation
→ character creation
→ campaign selection
→ session start
→ DM narration
→ player response by voice/text/card
→ session event stored
→ sub-strength updated
→ relic minted when triggered
→ inventory/profile updated
```

Do not build UI that cannot be wired to data.

Do not build backend routes that do not match the mobile app flow.

Do not build Solana instructions that cannot be consumed through the generated IDL package.

Do not duplicate types manually across mobile and server when they should come from `packages/solana-idl`.

---

## Implementation Priority

Build in this order:

```txt
1. Monorepo foundation
2. Environment files
3. Shared TypeScript config
4. Server foundation
5. Database schema/migration
6. Anchor program scaffold
7. IDL generation package
8. Expo mobile shell
9. Wallet connect flow
10. Player registration flow
11. Profile creation
12. Character creation
13. Campaign/session flow
14. Story feed and input
15. SVG world scene system
16. Relic/sub-strength system
17. Deployment wiring
```

Do not start with advanced animation, LI.FI, NFT polish, or full visual effects before the core loop works.

The MVP loop is:

```txt
wallet → player → character → session → choice → event → progression → relic
```

---

## Root Scripts

The root `package.json` should use Bun and Turborepo.

Expected scripts:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "build:android": "turbo run build:android",
    "deploy:program": "anchor deploy",
    "db:migrate": "bun --filter server db:migrate",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "format": "prettier --write ."
  }
}
```

Prefer workspace-level scripts over long root scripts.

---

## Naming Conventions

Use these conventions everywhere.

| Context    | Convention                         | Example                                      |
| ---------- | ---------------------------------- | -------------------------------------------- |
| Files      | kebab-case                         | `world-scene.tsx`                            |
| Components | PascalCase export, kebab-case file | `game-button.tsx` exports `GameButton`       |
| Hooks      | camelCase file                     | `useSession.ts`                              |
| Stores     | kebab-case file, camelCase export  | `session-store.ts` exports `useSessionStore` |
| Constants  | SCREAMING_SNAKE_CASE               | `SOLANA_PROGRAM_ID`                          |
| Types      | PascalCase                         | `SessionState`                               |
| Rust files | snake_case                         | `register_player.rs`                         |
| DB tables  | snake_case                         | `player_profiles`                            |

Do not create random naming styles.

Do not use mixed casing for similar files.

---

## TypeScript Rules

Use strict TypeScript.

All packages should avoid `any` unless unavoidable. If `any` is used, leave a short reason.

Prefer:

```ts
type Result<T> = {
  status: 'success' | 'error'
  data: T
  message: string
}
```

Do not create loose response shapes.

Standard API response shape:

```ts
{
  status: string
  data: unknown
  message: string
}
```

Use domain-specific types for:

```txt
PlayerProfile
Character
Campaign
Session
SessionEvent
Relic
World
SubStrength
TreasurePool
```

---

## Environment Rules

Never hardcode secrets.

Use `.env.example` as documentation only.

Root `.env.example` is the master reference.

Layer-specific examples should exist:

```txt
apps/mobile/.env.example
server/.env.example
```

Only expose public values to Expo with:

```txt
EXPO_PUBLIC_*
```

Never expose these to mobile:

```txt
DATABASE_URL
JWT_SECRET
DM_AUTHORITY_KEYPAIR
ELEVENLABS_API_KEY
RAILWAY_TOKEN
EXPO_TOKEN
```

These belong server-side only.

---

## Mobile App Rules

Mobile app lives in:

```txt
apps/mobile
```

Use:

```txt
Expo React Native
Expo Router
TypeScript
Zustand
react-native-svg
react-native-svg-transformer
Solana Mobile Wallet Adapter
```

The app is:

```txt
portrait only
dark only
full-screen
world-reactive
game-styled
```

Do not add light mode.

Do not design normal SaaS screens.

This is a game UI, not an admin dashboard.

### Required routing structure

```txt
app/
├── (auth)/
│   ├── wallet-connect.tsx
│   └── create-profile.tsx
├── (tabs)/
│   ├── index.tsx
│   ├── characters.tsx
│   ├── inventory.tsx
│   └── profile.tsx
├── campaign/
│   └── [id].tsx
├── session/
│   └── [id].tsx
├── character/
│   └── [id].tsx
└── _layout.tsx
```

### State management

Use Zustand for global client state:

```txt
auth-store.ts
session-store.ts
character-store.ts
sound-store.ts
ui-store.ts
```

Do not use Redux.

Do not over-store server state in Zustand. Persist only what the app needs immediately.

---

## Design System Rules

Follow `DESIGN.md`.

Core principles:

```txt
Full screen always
World-reactive UI
Buttons feel physical
Text is rare
DM narration carries the story
Portrait locked
Dark-only
```

Primary screens:

```txt
Wallet Connect
Create Profile
Home / Campaign Hub
Character Screen
Session Screen
Inventory Screen
Profile Screen
```

Use world palettes from the design system.

Worlds:

```txt
aethon
mechara
khoras
mirren
vael
```

Every world should eventually control:

```txt
primary color
secondary color
glow color
accent color
background color
text color
font identity
SVG scene
ambient sound
voice identity
```

---

## SVG Rules

Follow `SVG_SETUP.md`.

There are three SVG categories:

```txt
1. Static icon SVG files
2. Animated world scene TSX components
3. UI SVG TSX components
```

Static icons may use `.svg` imports.

Animated world scenes must be `.tsx` components using `react-native-svg`.

Example location:

```txt
apps/mobile/src/svg/worlds/aethon-scene.tsx
```

Do not import animated world scenes as static `.svg` files.

Use `react-native-svg-transformer` for imported static SVG assets.

Required Metro behavior:

```txt
svg removed from assetExts
svg added to sourceExts
babelTransformerPath points to react-native-svg-transformer
```

Use Reanimated only when normal React Native Animated is insufficient.

---

## Backend Rules

Server lives in:

```txt
server
```

Use TypeScript.

Expected structure:

```txt
server/src/
├── index.ts
├── routes/
├── controllers/
├── services/
├── db/
├── middleware/
├── lib/
└── types/
```

Use clear separation:

```txt
routes       HTTP route registration
controllers request/response logic
services    business logic
db           schema, queries, migrations
middleware  auth, errors, rate limits
lib          reusable infrastructure
types        server-specific types
```

Do not put database queries inside controllers.

Do not put Solana transaction logic inside route files.

Do not put ElevenLabs tool logic inside mobile code.

---

## API Rules

Use predictable REST paths.

Standard response shape:

```json
{
  "status": "success",
  "data": {},
  "message": "Request completed successfully"
}
```

Error shape:

```json
{
  "status": "error",
  "data": null,
  "message": "Readable error message"
}
```

Routes should be grouped by domain:

```txt
/session
/characters
/campaigns
/lifi
/tools
```

Authentication should be wallet-signature based.

Do not invent email/password auth unless explicitly required later.

---

## Database Rules

Use Neon Postgres.

Database source files:

```txt
server/src/db/schema.sql
server/src/db/migrations/
server/src/db/queries/
```

Core tables:

```txt
player_profiles
characters
sessions
session_events
sub_strengths
relics
campaigns
treasure_pools
```

Use append-only event logs for session events.

Do not overwrite important gameplay history.

Relics are cached in the database, but the source of truth is on-chain.

---

## Solana / Anchor Rules

Solana program lives in:

```txt
programs/lorekeeper
```

Use Anchor.

Expected instructions:

```txt
register_player
create_character
create_campaign
create_session
end_session
mint_relic
fund_pool
update_sub_strength
```

Expected state modules:

```txt
player_profile
character
session
campaign
relic
treasure_pool
```

After Anchor build, generate the IDL TypeScript package in:

```txt
packages/solana-idl
```

Both mobile and server should consume program types from this package.

Do not manually duplicate the IDL.

---

## Deployment Rules

Deployment targets:

```txt
Mobile app      EAS
Backend server  Railway
Database        NeonDB
Solana program  Solana devnet, then mainnet
```

Environment split:

```txt
Local dev   devnet + localhost + Neon dev + Expo dev
Staging     devnet + Railway preview + Neon dev + EAS preview
Production  mainnet + Railway prod + Neon main + EAS production
```

For hackathon/demo builds, use:

```bash
eas build --profile preview --platform android
```

For production Android builds, use:

```bash
eas build --profile production --platform android
```

---

## CI/CD Rules

Use GitHub Actions.

CI must use Bun.

Expected setup steps:

```yaml
- uses: actions/checkout@v4
- uses: oven-sh/setup-bun@v2
- run: bun install
- run: bun run lint
- run: bun run type-check
- run: bun run build
```

Do not use npm install in CI.

Do not use pnpm/action-setup.

---

## Code Quality Rules

Before completing a task, run the relevant checks:

```bash
bun run type-check
bun run lint
bun run build
```

For server-only work:

```bash
bun --filter server type-check
bun --filter server build
```

For mobile-only work:

```bash
bun --filter mobile type-check
```

For database changes:

```bash
bun --filter server db:migrate
```

For Anchor changes:

```bash
anchor build
anchor test
```

If a command fails, fix the cause. Do not bypass checks.

---

## UI Implementation Rules

Use reusable components.

Base UI components belong in:

```txt
apps/mobile/src/components/ui
```

Required base components:

```txt
game-button.tsx
card-choice.tsx
relic-card.tsx
tier-badge.tsx
sub-strength-toast.tsx
voice-wave.tsx
progress-ring.tsx
world-badge.tsx
```

Session components belong in:

```txt
apps/mobile/src/components/session
```

Required session components:

```txt
world-scene.tsx
story-feed.tsx
voice-input-bar.tsx
event-pop.tsx
skill-overlay.tsx
relic-mint-toast.tsx
```

Avoid one-off UI unless the component will never repeat.

---

## Lore/Data Rules

Game canon lives in:

```txt
apps/mobile/lore
```

Worlds:

```txt
apps/mobile/lore/worlds
```

Campaigns:

```txt
apps/mobile/lore/campaigns
```

Do not hardcode lore directly inside screen components.

Import structured JSON or typed config.

---

## Security Rules

Never expose private keys to the client.

Never place mint authority keys in Expo env.

Never log secrets.

Never commit real `.env` files.

Never store raw private keys in source code.

Server owns:

```txt
DM_AUTHORITY_KEYPAIR
ELEVENLABS_API_KEY
DATABASE_URL
JWT_SECRET
```

Mobile owns only public runtime config.

---

## Practical Build Discipline

When implementing:

1. Read the related documentation first.
2. Check the expected folder structure.
3. Create only the files needed for the current task.
4. Use Bun commands.
5. Keep types shared where appropriate.
6. Keep mobile, server, and Solana flows aligned.
7. Run checks before stopping.
8. Do not introduce unrelated dependencies.
9. Do not rewrite architecture casually.
10. Do not mix package managers.

---

## Current Priority

Until the core loop works, prioritize:

```txt
wallet connect
player registration
profile creation
character creation
session creation
story event persistence
basic progression
basic relic mint trigger
```

Everything else is secondary.

Do not spend early build time on:

```txt
all five full world animations
production NFT polish
full LI.FI treasure pool flow
advanced soundscape
complex marketplace behavior
unneeded admin tooling
```

Build the spine first.

---

## Final Instruction

Treat LoreKeeper as a single married system:

```txt
Bun monorepo
Expo mobile app
TypeScript backend
Anchor Solana program
NeonDB persistence
shared IDL types
game-first UI
voice-first session loop
on-chain identity and relics
```

Every file added should serve that system.

````

Main fixes this enforces:

```txt
pnpm → removed
npm → avoided except unavoidable external CLI cases
bun-workspace.yaml → canonical
bun.lock → only lockfile
mobile/server/programs/packages → treated as one system
````
