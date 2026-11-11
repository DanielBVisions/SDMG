# Norkem – animated case study mockups

Remotion project that turns frames from the *Norkem – Case Study* Figma file into
looping 3D "helix deck" mockups at **2400 × 1200**, 30 fps. Each card is a
**1440 × 850** crop of a desktop frame, with code-drawn brand cards in between.

| Composition | Motion | Length |
|---|---|---|
| `NorkemHelixStepped` | Each card settles face-on, then the deck twists to the next one (storyboard style) | 12 cards × 1.6s = 19.2s |
| `NorkemHelixContinuous` | Straight column moving down, twist only, off-white background | 5 frames × 1.8s = 9s |
| `NorkemOrbit` | Wide ring (4 frames × 3) around the camera; each turn springs slightly past centre, settles and drifts on without stopping | 4 × 2.2s = 8.8s |
| `NorkemShowreel` | Test reel: helix 2.8s → 1.2s push-down transition → orbit 2.8s | 4.4s |

Both loop seamlessly: the scroll position runs from card 0 round to card N, so
the last frame leads straight back into the first.

## Run

```bash
npm i
npm run dev
```

```bash
npx remotion render NorkemHelixStepped out/norkem-helix-stepped.mp4 --crf=16
```

## Edit

- **Which screens / order:** `src/cards.ts` (`DECK_A`, `DECK_B`). Add crops to `public/screens/` at 1440 × 850.
- **Timing, twist, spacing, background:** props in `src/Root.tsx` (also editable in Studio).
- **Brand cards:** `src/BrandCard.tsx` (logo, tagline, hex mark, global network).
