# LoreKeeper — Monorepo Folder Structure

```
lorekeeper/
├── apps/
│   └── mobile/                          # Expo React Native app
│       ├── app/                         # Expo Router file-based routing
│       │   ├── (auth)/
│       │   │   ├── _layout.tsx
│       │   │   ├── wallet-connect.tsx   # Wallet auth + onchain registration
│       │   │   └── create-profile.tsx   # Profile creation after mint
│       │   ├── (tabs)/
│       │   │   ├── _layout.tsx          # Bottom nav layout
│       │   │   ├── index.tsx            # Home / campaign hub
│       │   │   ├── characters.tsx       # Character select (max 3)
│       │   │   ├── inventory.tsx        # NFT achievements + events
│       │   │   └── profile.tsx          # Settings, sounds, network links
│       │   ├── campaign/
│       │   │   ├── [id].tsx             # Campaign detail
│       │   │   └── _layout.tsx
│       │   ├── session/
│       │   │   ├── [id].tsx             # Full-screen game session
│       │   │   └── _layout.tsx          # Hides tab bar
│       │   ├── character/
│       │   │   ├── [id].tsx             # Character sheet + skills
│       │   │   └── _layout.tsx
│       │   ├── +not-found.tsx
│       │   └── _layout.tsx              # Root layout
│       │
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/                  # Base design system components
│       │   │   │   ├── game-button.tsx
│       │   │   │   ├── card-choice.tsx
│       │   │   │   ├── relic-card.tsx
│       │   │   │   ├── tier-badge.tsx
│       │   │   │   ├── sub-strength-toast.tsx
│       │   │   │   ├── voice-wave.tsx
│       │   │   │   ├── progress-ring.tsx
│       │   │   │   └── world-badge.tsx
│       │   │   ├── auth/
│       │   │   │   ├── wallet-adapter.tsx
│       │   │   │   └── onchain-register.tsx
│       │   │   ├── session/
│       │   │   │   ├── world-scene.tsx       # Animated SVG world atmosphere
│       │   │   │   ├── story-feed.tsx        # Typewriter DM text stream
│       │   │   │   ├── voice-input-bar.tsx   # Waveform + mic tap
│       │   │   │   ├── event-pop.tsx         # Bottom pop-up event cards
│       │   │   │   ├── skill-overlay.tsx     # Slide-up skills during session
│       │   │   │   └── relic-mint-toast.tsx  # Mid-session relic notification
│       │   │   ├── profile/
│       │   │   │   ├── character-card.tsx
│       │   │   │   ├── nft-grid.tsx
│       │   │   │   ├── sound-toggle.tsx
│       │   │   │   └── network-link.tsx
│       │   │   └── navigation/
│       │   │       └── tab-bar.tsx           # Custom game-styled tab bar
│       │   │
│       │   ├── hooks/
│       │   │   ├── useWalletAuth.ts
│       │   │   ├── useOnchainProfile.ts
│       │   │   ├── useSession.ts
│       │   │   ├── useElevenLabs.ts
│       │   │   ├── useLifiQuote.ts
│       │   │   ├── useRelicMint.ts
│       │   │   ├── useSubStrength.ts
│       │   │   ├── useWorldScene.ts
│       │   │   ├── useVoiceInput.ts
│       │   │   ├── useCharacter.ts
│       │   │   ├── useCampaign.ts
│       │   │   ├── useNfts.ts
│       │   │   ├── useSoundscape.ts
│       │   │   └── useSessionEvents.ts
│       │   │
│       │   ├── stores/                  # Zustand global state
│       │   │   ├── auth-store.ts
│       │   │   ├── session-store.ts
│       │   │   ├── character-store.ts
│       │   │   ├── sound-store.ts
│       │   │   └── ui-store.ts
│       │   │
│       │   ├── services/
│       │   │   ├── api/
│       │   │   │   ├── session-api.ts
│       │   │   │   ├── character-api.ts
│       │   │   │   ├── campaign-api.ts
│       │   │   │   ├── nft-api.ts
│       │   │   │   └── lifi-api.ts
│       │   │   ├── solana/
│       │   │   │   ├── connection.ts
│       │   │   │   ├── program-client.ts  # Anchor IDL client
│       │   │   │   └── mwa-adapter.ts     # Mobile Wallet Adapter
│       │   │   └── elevenlabs/
│       │   │       ├── agent-client.ts
│       │   │       ├── speech-client.ts
│       │   │       └── sound-client.ts
│       │   │
│       │   ├── svg/
│       │   │   ├── worlds/
│       │   │   │   ├── aethon-scene.tsx    # Animated SVG — runes, threads
│       │   │   │   ├── mechara-scene.tsx   # Animated SVG — circuit grid
│       │   │   │   ├── khoras-scene.tsx    # Animated SVG — ember, mountains
│       │   │   │   ├── mirren-scene.tsx    # Animated SVG — echo silhouettes
│       │   │   │   └── vael-scene.tsx      # Animated SVG — morphing forms
│       │   │   ├── icons/
│       │   │   │   ├── icon-home.tsx
│       │   │   │   ├── icon-character.tsx
│       │   │   │   ├── icon-inventory.tsx
│       │   │   │   ├── icon-profile.tsx
│       │   │   │   ├── icon-voice.tsx
│       │   │   │   └── icon-solana.tsx
│       │   │   └── ui/
│       │   │       ├── card-frame.tsx
│       │   │       ├── relic-glow.tsx
│       │   │       └── tier-ring.tsx
│       │   │
│       │   ├── lib/
│       │   │   ├── constants.ts
│       │   │   ├── world-config.ts        # World colours, fonts, scene params
│       │   │   ├── tier-config.ts         # Tier rules, step counts, unlock keys
│       │   │   ├── campaign-seeds.ts      # 5 campaign JSON imports
│       │   │   └── utils.ts
│       │   │
│       │   └── types/
│       │       ├── session.ts
│       │       ├── character.ts
│       │       ├── campaign.ts
│       │       ├── relic.ts
│       │       ├── world.ts
│       │       └── auth.ts
│       │
│       ├── assets/
│       │   ├── fonts/
│       │   │   ├── lore-display.ttf       # World display headings
│       │   │   └── lore-body.ttf          # Body + UI text
│       │   ├── audio/
│       │   │   ├── world-ambient/         # Per-world background loops
│       │   │   └── sfx/                   # UI sounds, mint chime, etc
│       │   └── images/
│       │       ├── splash.png
│       │       └── icon.png
│       │
│       ├── lore/                          # Game canon JSON
│       │   ├── worlds/
│       │   │   ├── aethon.json
│       │   │   ├── mechara.json
│       │   │   ├── khoras.json
│       │   │   ├── mirren.json
│       │   │   └── vael.json
│       │   └── campaigns/
│       │       ├── rust-of-edenmere.json
│       │       ├── unmade-king.json
│       │       ├── borrowed-face.json
│       │       ├── signal-and-noise.json
│       │       └── last-threshold.json
│       │
│       ├── app.json
│       ├── app.config.ts                  # Dynamic Expo config (reads .env)
│       ├── babel.config.js
│       ├── eas.json
│       ├── metro.config.js
│       ├── tsconfig.json
│       └── .env                           # Local only — gitignored
│
├── packages/
│   └── solana-idl/                        # Shared IDL types between mobile + server
│       ├── src/
│       │   ├── lorekeeper.ts              # Generated IDL type
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── programs/                              # Anchor Rust smart contracts
│   └── lorekeeper/
│       ├── src/
│       │   ├── lib.rs                     # Program entry + instruction routing
│       │   ├── instructions/
│       │   │   ├── mod.rs
│       │   │   ├── register_player.rs     # Mint identifier NFT + onchain profile
│       │   │   ├── create_character.rs    # Up to 3 characters per player
│       │   │   ├── create_campaign.rs
│       │   │   ├── create_session.rs
│       │   │   ├── end_session.rs
│       │   │   ├── mint_relic.rs          # DM-authority NFT mint (Metaplex Core)
│       │   │   ├── fund_pool.rs           # LI.FI → USDC treasure pool
│       │   │   └── update_sub_strength.rs
│       │   ├── state/
│       │   │   ├── mod.rs
│       │   │   ├── player_profile.rs
│       │   │   ├── character.rs
│       │   │   ├── session.rs
│       │   │   ├── campaign.rs
│       │   │   ├── relic.rs
│       │   │   └── treasure_pool.rs
│       │   └── errors.rs
│       ├── tests/
│       │   └── lorekeeper.ts
│       ├── Cargo.toml
│       └── Xargo.toml
│
├── server/                                # Node.js backend bridge
│   ├── src/
│   │   ├── index.ts                       # Express app entry
│   │   ├── routes/
│   │   │   ├── session.routes.ts
│   │   │   ├── character.routes.ts
│   │   │   ├── campaign.routes.ts
│   │   │   ├── lifi.routes.ts
│   │   │   └── tools.routes.ts            # ElevenLabs tool call handlers
│   │   ├── controllers/
│   │   │   ├── session.controller.ts
│   │   │   ├── character.controller.ts
│   │   │   ├── campaign.controller.ts
│   │   │   ├── lifi.controller.ts
│   │   │   └── tools.controller.ts
│   │   ├── services/
│   │   │   ├── elevenlabs.service.ts
│   │   │   ├── solana.service.ts          # Mint authority keypair + tx submission
│   │   │   ├── lifi.service.ts
│   │   │   └── neonpg.service.ts          # NeonDB connection pool
│   │   ├── db/
│   │   │   ├── schema.sql                 # NeonDB table definitions
│   │   │   ├── migrations/
│   │   │   │   └── 001_initial.sql
│   │   │   └── queries/
│   │   │       ├── session.queries.ts
│   │   │       ├── character.queries.ts
│   │   │       └── player.queries.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts         # Wallet signature verification
│   │   │   ├── error.middleware.ts
│   │   │   └── rate-limit.middleware.ts
│   │   ├── lib/
│   │   │   ├── keypair.ts                 # DM mint authority keypair loader
│   │   │   ├── anchor-client.ts
│   │   │   └── constants.ts
│   │   └── types/
│   │       ├── session.types.ts
│   │       ├── tool-call.types.ts
│   │       └── lifi.types.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── Anchor.toml
├── Cargo.toml                             # Workspace root
├── package.json                           # pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json                             # Turborepo config
└── .env.example                           # Root env reference
```