# CBTax showreel

A 20-second, text-free Remotion showreel (1920×1080, 30fps) for the CBTax website, designed and built by Visions.

Rendered video: `renders/cbtax-showreel.mp4`

## Flow

| Time | Scene | What it shows |
|---|---|---|
| 0.0–2.7s | Intro | CBTax logo resolves out of a blur |
| 1.9–6.5s | Hero | Desktop rises out of a 3D tilt and scrolls to the stat cards; mobile hero floats in front |
| 5.7–10.7s | Scroll | Real scroll capture (sector carousel, service cards, stacked testimonials) on an orbiting camera; background fades to the site's dark ink |
| 9.9–14.6s | Mobile | Four phones rise in a wave and drift in 3D |
| 13.8–17.8s | Localisation | Cover-flow of the UK, Ireland, USA and UAE versions |
| 17.0–20.0s | Outro | CBTax logo |

Scenes hand over with a zoom-through blur (`src/transitions/zoomBlur.tsx`). A single shared background (`src/components/Stage.tsx`) runs under the whole reel, so only the devices move between scenes.

All screenshots and the scroll recording are captures of the live cbtax.com site.

## Editing

```bash
npm i
npx remotion studio
```

- Scene lengths: `src/Showreel.tsx` (keep `SCENES` in `src/theme.ts` in sync; the background timing reads from it).
- Brand colours, easing curves and transition length: `src/theme.ts`.
- Captures live in `public/shots` and `public/video`.

## Rendering

```bash
npx remotion render CBTaxShowreel renders/cbtax-showreel.mp4 --crf=18
```
