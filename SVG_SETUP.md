# LoreKeeper — SVG Setup for Expo

## Installation

```bash
cd apps/mobile
bun add react-native-svg
bun add -D react-native-svg-transformer
```

Because this is Expo (managed or bare), `react-native-svg` is included in the Expo SDK — no native linking needed. Just install and configure the transformer.

---

## Metro config

```js
// apps/mobile/metro.config.js
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
}

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
}

module.exports = config
```

---

## TypeScript declaration

```ts
// apps/mobile/src/types/svg.d.ts
declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}
```

---

## SVG file patterns

Three types of SVG components in LoreKeeper:

### 1. Static icon SVGs (file-based import)

For icons that don't animate — import directly from `.svg` files.

```
src/svg/icons/
  icon-home.svg
  icon-character.svg
  icon-inventory.svg
  icon-profile.svg
  icon-voice.svg
  icon-solana.svg
```

Usage:
```tsx
import IconHome from '@svg/icons/icon-home.svg'

// In component:
<IconHome width={24} height={24} fill={colors.primary} />
```

---

### 2. Animated world scene SVGs (`.tsx` components)

World scenes are written as `.tsx` files using `react-native-svg` primitives directly — not imported `.svg` files. This gives full control over `Animated.Value` bindings on individual SVG elements.

File pattern: `src/svg/worlds/aethon-scene.tsx`

```tsx
// src/svg/worlds/aethon-scene.tsx
import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import Svg, {
  Circle, Rect, Path, G, Defs, RadialGradient, Stop,
  AnimatedProps,
} from 'react-native-svg'
import { WORLD_COLORS } from '@/lib/constants'

const AnimatedG = Animated.createAnimatedComponent(G)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface AethonSceneProps {
  beatState: 'discovery' | 'complication' | 'near_death' | 'resolution' | 'chronicle'
  width: number
  height: number
}

export default function AethonScene({ beatState, width, height }: AethonSceneProps) {
  const glowOpacity = useRef(new Animated.Value(0.3)).current
  const runeRotation = useRef(new Animated.Value(0)).current
  const threadOpacity = useRef(new Animated.Value(0.5)).current

  const colors = WORLD_COLORS.aethon

  // Ambient glow pulse loop
  useEffect(() => {
    const speed = beatState === 'near_death' ? 400 : beatState === 'complication' ? 800 : 3000

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: beatState === 'near_death' ? 0.9 : 0.6,
          duration: speed,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.2,
          duration: speed,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [beatState])

  // Rune rotation — slow ambient spin
  useEffect(() => {
    Animated.loop(
      Animated.timing(runeRotation, {
        toValue: 1,
        duration: beatState === 'near_death' ? 1200 : 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }, [beatState])

  const rotateInterpolation = runeRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <RadialGradient id="aethon-glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.glow} stopOpacity="1" />
          <Stop offset="100%" stopColor={colors.background} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Background */}
      <Rect width={width} height={height} fill={colors.background} />

      {/* Ambient glow centre */}
      <AnimatedCircle
        cx={width / 2}
        cy={height * 0.4}
        r={width * 0.45}
        fill={`url(#aethon-glow)`}
        opacity={glowOpacity}
      />

      {/* Rotating rune geometry */}
      <AnimatedG
        originX={width / 2}
        originY={height / 2}
        rotation={rotateInterpolation}
      >
        {/* Outer hexagon ring */}
        <Path
          d={hexPath(width / 2, height / 2, width * 0.3)}
          stroke={colors.secondary}
          strokeWidth={0.5}
          fill="none"
          opacity={0.4}
        />
        {/* Inner ring */}
        <Path
          d={hexPath(width / 2, height / 2, width * 0.18)}
          stroke={colors.accent}
          strokeWidth={0.5}
          fill="none"
          opacity={0.6}
        />
      </AnimatedG>

      {/* Weave threads — static, diffuse */}
      {WEAVE_THREADS.map((thread, i) => (
        <Path
          key={i}
          d={thread.path(width, height)}
          stroke={colors.secondary}
          strokeWidth={thread.width}
          fill="none"
          opacity={thread.opacity}
          strokeDasharray={`${thread.dash} ${thread.gap}`}
        />
      ))}
    </Svg>
  )
}

// Helper: regular hexagon path
function hexPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  })
  return `M${pts.join('L')}Z`
}

// Static weave thread definitions
const WEAVE_THREADS = [
  { path: (w: number, h: number) => `M${w*0.1},${h*0.2} Q${w*0.5},${h*0.1} ${w*0.9},${h*0.3}`, width: 0.8, opacity: 0.25, dash: 8, gap: 12 },
  { path: (w: number, h: number) => `M${w*0.0},${h*0.5} Q${w*0.4},${h*0.3} ${w*0.8},${h*0.6}`, width: 0.6, opacity: 0.15, dash: 6, gap: 16 },
  { path: (w: number, h: number) => `M${w*0.2},${h*0.8} Q${w*0.6},${h*0.5} ${w*1.0},${h*0.4}`, width: 0.4, opacity: 0.12, dash: 4, gap: 20 },
]
```

Each world follows the same pattern — different geometry, different animation rhythm, different colour.

---

### 3. UI SVG components (`.tsx`, no animation)

For card frames, tier rings, relic glows — static but complex enough to warrant SVG over a View.

```tsx
// src/svg/ui/tier-ring.tsx
import React from 'react'
import Svg, { Circle, Text as SvgText } from 'react-native-svg'

interface TierRingProps {
  tier: 'common' | 'rare' | 'unique' | 'mythic' | 'god'
  step: number
  maxStep: number
  size: number
  color: string
}

export default function TierRing({ tier, step, maxStep, size, color }: TierRingProps) {
  const strokeWidth = 3
  const r = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * r
  const progress = step / maxStep
  const dashOffset = circumference * (1 - progress)

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background track */}
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={strokeWidth}
        fill="none" opacity={0.2}
      />
      {/* Progress arc */}
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      {/* Step label */}
      <SvgText
        x={size / 2} y={size / 2 + 5}
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.28}
        fontWeight="600"
      >
        {step}
      </SvgText>
    </Svg>
  )
}
```

---

## Asset optimisation

Before committing SVG files, run them through SVGO:

```bash
# Install globally once
npm install -g svgo

# Optimise all SVG assets
svgo --folder apps/mobile/src/svg/icons --recursive
```

SVGO config (`svgo.config.js` at mobile root):

```js
module.exports = {
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    { name: 'removeViewBox', active: false },   // Keep viewBox — required for scaling
    'removeDimensions',
    'convertColors',
    'cleanupNumericValues',
  ],
}
```

---

## Reanimated 2 + SVG (for complex animations)

If animation needs exceed `Animated` (e.g. gesture-driven scene transitions), install Reanimated:

```bash
bun add react-native-reanimated
```

Add to `babel.config.js`:
```js
plugins: ['react-native-reanimated/plugin']
```

Use `useSharedValue` + `useAnimatedProps` with `createAnimatedComponent` from `react-native-svg`:

```tsx
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming } from 'react-native-reanimated'
import { Circle } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const opacity = useSharedValue(0.3)
const animatedProps = useAnimatedProps(() => ({ opacity: opacity.value }))

// In render:
<AnimatedCircle animatedProps={animatedProps} cx={100} cy={100} r={50} fill="violet" />
```

Use Reanimated for the world transition crossfade — it handles the opacity interpolation across two SVG scenes more smoothly than `Animated`.