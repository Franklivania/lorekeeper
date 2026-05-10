# LoreKeeper — Design System
## `design.md`

> The game occupies the full screen at all times. Every pixel is intentional. The UI is part of the world, not a layer on top of it.

---

## Visual References

Pulled from the images provided:

- **Boris / creature card screen** → Character presentation style: full-bleed illustrated background, character front-and-centre, name treatment floating above, stats and progress anchored at the bottom. Game buttons are 3D-pressed, pill or rounded-rectangle shaped with depth.
- **Seven Deadly Sins mobile** → Session-state UI language: bottom-anchored navigation, rich illustrated environment filling the screen, character cards at the bottom for decision moments, HUD elements floating at the top corners only.
- **Inca Legends** → World-specific title treatment, character grid presentation, aged-parchment card style for character display.

---

## Core Principles

1. **Full screen always.** No safe-area padding used for visual content. Status bar overlaid. Tab bar is a floating element, not a blocking chrome.
2. **World-reactive.** Every primary colour, font, and atmosphere shifts when the active world changes. The UI is not neutral — it belongs to the world the player is currently in.
3. **Buttons feel like objects.** Interactive elements have mass and depth. Press states compress. Nothing is flat in the interaction layer.
4. **Text is earned.** Body copy is rare. The DM speaks — the UI shows the consequence. Labels are short and specific.
5. **Portrait locked.** Always. No landscape support.

---

## Colour System

### Base palette (world-agnostic)

```ts
// src/lib/constants.ts
export const BASE_COLORS = {
  // Backgrounds
  void:       '#0A0A0F',   // Deepest background — screen base
  deep:       '#12121A',   // Card backgrounds, overlays
  surface:    '#1C1C28',   // Raised surfaces, input areas
  elevated:   '#252535',   // Top-level cards, modals

  // Text
  primary:    '#F2EFEA',   // Main text — warm off-white
  secondary:  '#9A9287',   // Muted text, labels
  tertiary:   '#5A5550',   // Placeholder, disabled

  // Semantic
  success:    '#4ADE80',
  warning:    '#FBBF24',
  danger:     '#F87171',
  info:       '#60A5FA',

  // Solana
  solana:     '#9945FF',
  solanaGlow: '#14F19533',
}
```

### World palettes

Each world overrides `--world-primary`, `--world-secondary`, `--world-glow`, `--world-text-accent` at the theme level. The session screen, character sheet, and campaign hub use these tokens.

```ts
export const WORLD_COLORS = {
  aethon: {
    primary:    '#3C3489',   // Deep violet
    secondary:  '#AFA9EC',   // Soft lavender
    glow:       '#7F77DD44', // Ambient rune glow
    accent:     '#EF9F27',   // Amber eye glow
    background: '#12101E',   // Near-black violet base
    text:       '#CECBF6',   // Light violet text
    font:       'LoreDisplay-Serif',
  },
  mechara: {
    primary:    '#185FA5',
    secondary:  '#85B7EB',
    glow:       '#378ADD33',
    accent:     '#FFFFFF',
    background: '#0D1420',
    text:       '#B5D4F4',
    font:       'LoreDisplay-Mono',
  },
  khoras: {
    primary:    '#993C1D',
    secondary:  '#F0997B',
    glow:       '#D85A3033',
    accent:     '#EF9F27',
    background: '#140C08',
    text:       '#F5C4B3',
    font:       'LoreDisplay-Bold',
  },
  mirren: {
    primary:    '#3B6D11',
    secondary:  '#97C459',
    glow:       '#63992233',
    accent:     '#FAC775',
    background: '#0C1209',
    text:       '#C0DD97',
    font:       'LoreDisplay-Serif',
  },
  vael: {
    primary:    '#993556',
    secondary:  '#ED93B1',
    glow:       '#D4537E33',
    accent:     '#FBEAF0',
    background: '#160C11',
    text:       '#F4C0D1',
    font:       'LoreDisplay-Italic',
  },
}
```

---

## Typography

### Font families

```
LoreDisplay-Serif   → World headings, DM narration (Aethon, Mirren)
LoreDisplay-Mono    → Mechara world UI, system readouts
LoreDisplay-Bold    → Khoras world, tier badges, power indicators
LoreDisplay-Italic  → Vael world, transformation descriptions
LoreBody            → All body text, UI labels — consistent across worlds
```

### Scale

```ts
export const TYPE_SCALE = {
  // Display — world names, campaign titles
  display:  { size: 36, lineHeight: 42, weight: '700', letterSpacing: 0.5 },

  // Title — screen headers, character names
  title:    { size: 24, lineHeight: 30, weight: '600', letterSpacing: 0.3 },

  // Heading — section labels, NPC names
  heading:  { size: 18, lineHeight: 24, weight: '600', letterSpacing: 0.2 },

  // DM narration — the main story text in sessions
  story:    { size: 16, lineHeight: 26, weight: '400', letterSpacing: 0.1 },

  // Body — descriptions, profile text
  body:     { size: 14, lineHeight: 22, weight: '400', letterSpacing: 0 },

  // Caption — labels, callouts, sub-strength toasts
  caption:  { size: 12, lineHeight: 16, weight: '400', letterSpacing: 0.2 },

  // Micro — tier badges, coin counts, step indicators
  micro:    { size: 10, lineHeight: 14, weight: '500', letterSpacing: 0.3 },
}
```

---

## Spacing & Layout

```ts
export const SPACING = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  xxxl: 48,
}

export const RADIUS = {
  sm:   6,
  md:   12,
  lg:   20,
  xl:   28,
  pill: 999,
  card: 16,
}
```

### Screen zones (portrait, full-bleed)

```
┌──────────────────────────────────┐  ← top of screen
│  Status bar overlay (transparent)│  24px
├──────────────────────────────────┤
│                                  │
│  World scene / atmosphere        │  ~40% of screen height
│  (animated SVG — reacts to beat) │
│                                  │
├──────────────────────────────────┤
│                                  │
│  Story feed / DM narration       │  ~40% of screen height
│  (typewriter text stream)        │
│                                  │
│  Player response (appears below) │
│                                  │
├──────────────────────────────────┤
│  Voice input bar                 │  72px
│  (waveform + tap to speak)       │
├──────────────────────────────────┤
│  Tab bar (floating, translucent) │  80px + safe area bottom
└──────────────────────────────────┘
```

---

## Component Design

### Game Button

Inspired by Boris screen / Seven Deadly Sins bottom nav buttons — 3D pressed feel, rounded, world-coloured.

```
Normal state:
  Background: world.primary with inner lighter top edge (gives pressed depth illusion)
  Border: 1.5px world.secondary at 60% opacity
  Shadow: 0px 4px 0px world.primary darkened 40% (the "depth" shadow below)
  Text: white, weight 600

Active/Press state:
  translateY: +3px
  shadow disappears (compressed effect)
  Background darkens slightly
```

Shapes:
- **Primary actions** (confirm, begin session) → large pill, full-width minus 32px margin
- **World select** → square with rounded corners, icon-led, 80×80px
- **Choice cards** → tall card shape (see Card Choice below)
- **Icon actions** → circular, 48px diameter

### Card Choice

Decision cards rising from the bottom during sessions — styled after Seven Deadly Sins card row.

```
Size: 140px wide × 200px tall
Background: world.deep + 80% opacity backdrop blur
Border: 1px world.secondary at 40% opacity
Corner radius: 16px
Top accent: 3px line in world.primary colour
Content: Icon SVG (top, centered), title (bold), 2-line description, cost/consequence note at bottom
```

Cards appear in a horizontal row, maximum 3 at once, with slight rotation (-2°, 0°, +2°) for the organic Seven Deadly Sins feel.

### Event Pop (mid-session)

Bottom-anchored notification that appears during gameplay.

```
Width: screen width - 32px
Max height: 80px (single line), 120px (with detail)
Position: bottom 88px (above tab bar)
Background: world.deep at 90% opacity + blur
Left border: 4px in world.accent colour
Slide in: from bottom, spring animation
Auto-dismiss: 4 seconds unless tapped
```

### Relic Mint Toast

Appears mid-session when the DM mints a relic — more ceremonial than an event pop.

```
Width: screen width - 48px
Position: bottom 100px
Background: world.deep at 95%
Border: 1px world.accent at full opacity
Glow: world.glow spread behind the card
Content: Relic icon SVG (left), relic name (bold, world font), 1-line lore extract, rarity badge
Animation: slide up from bottom + scale from 0.92 to 1.0, spring
Persist until dismissed (tap anywhere to dismiss)
```

### Sub-Strength Toast

Small, fast, non-intrusive — appears in the margin of the story feed.

```
Width: auto (min 80px)
Position: right edge of story zone, staggered vertically
Background: world.primary at 70%
Text: "+ Perception" in micro scale
Animation: fade in 200ms, hold 2s, fade out 300ms
No interaction required
```

### Tab Bar

Floating above the bottom safe area — styled like game bottom nav.

```
Height: 64px + bottom safe area
Background: BASE_COLORS.deep at 92% + blur
Border top: 1px surface colour
Tabs: 5 items (Home, Characters, Inventory, Profile, [world-specific])
Active tab: world.primary background behind icon, world.accent icon colour
Inactive: tertiary icon colour
Tab icons: custom SVG per tab (no text labels in session, labels visible on other screens)
```

---

## Animation System

```ts
// Shared animation config
export const ANIMATION = {
  // Spring for interactive elements
  spring: {
    damping: 20,
    stiffness: 180,
    mass: 0.8,
  },

  // Timing for ambient/atmospheric
  ambient: {
    duration: 3000,
    easing: 'easeInOut',
  },

  // Session text typewriter
  typewriter: {
    charDelay: 28,      // ms per character
    pauseOnPunct: 180,  // ms pause on . , ! ?
  },

  // Card rise
  cardEntry: {
    duration: 320,
    easing: 'easeOutBack',
  },

  // World scene crossfade (when crossing worlds)
  worldTransition: {
    duration: 800,
    easing: 'easeInOut',
  },
}
```

### World Scene Animation

Each world scene SVG component uses React Native `Animated` and `react-native-svg`. The animation responds to session beat state:

| Beat state | Scene behaviour |
|---|---|
| `discovery` | Slow ambient drift, low opacity glows, gentle movement |
| `complication` | Speed increases, colour saturation rises, edges sharpen |
| `near_death` | High contrast, fast movement, scene desaturates toward monochrome |
| `resolution` | Returns to ambient, warm colour cast added |
| `chronicle` | Scene stills completely, particles settle |

---

## Auth + Onboarding Flow

### Screen 1 — Wallet Connect

Full-screen dark background with the animated Aethon scene (default world before player selection) filling the upper 60%. The LoreKeeper logo in the centre. A single large game-button: **"Connect Wallet"**. Below it in caption type: supports all Solana wallets.

On connect: wallet adapter modal slides up from bottom (standard MWA sheet). On success: transition to registration.

### Screen 2 — Registration (first-time only)

Brief onchain registration animation — a pulsing hexagonal frame forms, a number appears (player's global join number), and a unique code beneath it. This is the identifier NFT being minted. Short DM voice line via ElevenLabs: *"The Weave has recorded your arrival. You are the [N]th to cross."*

### Screen 3 — Create Profile

Clean form-style screen with game-button aesthetic. Fields:
- Display name (text input, styled as a game text field — dark background, world-coloured border, no placeholder text — just the cursor)
- Starting world (5 large world-select tiles in a 2+2+1 grid — each showing world name, brief descriptor, colour identity)

**No avatars at this stage.** Character creation is separate, accessed from the Characters tab.

---

## Session Screen — Full Spec

```
┌─────────────────────────────────┐
│  World scene (40vh)             │ ← Animated SVG, reacts to beat
│  [Subtle HUD: session info top  │
│   left, active sub-strengths    │
│   top right — both small,       │
│   translucent]                  │
├─────────────────────────────────┤
│  Story feed (scrollable, 40vh)  │ ← DM text typewriters in
│                                 │   Player response in different colour
│  [Sub-strength toasts appear    │
│   at right margin here]         │
├─────────────────────────────────┤
│  Choice cards (when triggered)  │ ← Cards rise over voice bar
│  OR                             │
│  Voice input bar                │ ← Waveform, tap-to-speak
└─────────────────────────────────┘
```

When choice cards appear, the voice bar slides down 20px and the cards rise over it. The player can either tap a card OR speak/type their answer. Both inputs are accepted simultaneously.

When a relic mints, it appears above the voice bar and does not interrupt the story feed.

---

## Character Screen

Full-screen character presentation — Boris-style layout:

```
┌─────────────────────────────────┐
│  Character art (full bleed bg)  │ ← World-appropriate illustrated bg
│                                 │
│  [Character name floating top]  │
│  [Tier badge]                   │
│                                 │
│  Character illustration centred │ ← Static SVG character visual
│                                 │
├─────────────────────────────────┤
│  Stats strip                    │ ← Tier, step, world, sub-strengths
│  Skill scroll (horizontal)      │ ← Skills as small cards, scroll left
├─────────────────────────────────┤
│  Campaign link   | Switch char  │
└─────────────────────────────────┘
```

---

## Inventory Screen (NFT Gallery)

Inca Legends parchment card style:

```
┌─────────────────────────────────┐
│  Section tabs: Relics | Events  │
├─────────────────────────────────┤
│  Grid: 2 columns                │
│  Each card:                     │
│    - Aged parchment background  │
│    - Relic icon/art (SVG)       │
│    - Name                       │
│    - Rarity badge               │
│    - World tag                  │
│  Tap → full-screen relic detail │
│  with full lore text            │
└─────────────────────────────────┘
```

---

## Profile Screen

Clean settings feel — game-styled but functional:

```
┌─────────────────────────────────┐
│  Player card (identifier NFT    │
│  shown, join number, name)      │
├─────────────────────────────────┤
│  Settings rows:                 │
│  · Sound effects    [toggle]    │
│  · Music            [toggle]    │
│  · Voice (ElevenLabs) [toggle]  │
│  · Haptics          [toggle]    │
├─────────────────────────────────┤
│  Network:                       │
│  · View on Solana Explorer      │ ← Opens browser
│  · View NFTs on-chain           │ ← Opens browser
├─────────────────────────────────┤
│  Wallet: [truncated address]    │
│  [Disconnect]                   │
└─────────────────────────────────┘
```

---

## Dark Mode

The app is dark-only. There is no light mode. `userInterfaceStyle: 'dark'` is set in `app.config.ts`. The background floor is `#0A0A0F` — deep enough to feel immersive, not pure black (which reads as broken on OLED when content is present).