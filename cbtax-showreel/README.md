# CBTax showreel

A 20-second Remotion showreel (1920×1080, 30fps) for the CBTax website, designed and built by Visions.

Rendered video: `renders/cbtax-showreel.mp4`

## Scenes

| Time | Scene | What it shows |
|---|---|---|
| 0.0–2.5s | Intro | CBTax logo, "Website design & build", UX/UI · Webflow · Localisation |
| 2.1–6.1s | 01 Light, bold redesign | Desktop hero, scrolling down to the tilted stat cards |
| 5.7–9.7s | 02 User interactions | Real scroll capture: sector carousel, service cards, stacked testimonials |
| 9.3–13.3s | 03 Mobile responsive | Three phones: hero, testimonial card, sectors |
| 12.9–16.4s | 04 Global localisation | UK, Ireland, USA and UAE versions with region pills |
| 16.0–20.0s | Outro | Client quote (Ed Measey), then "Designed & built by Visions" |

Copy comes from the Visions case study. All screenshots and the scroll recording are captures of the live cbtax.com site.

## Editing

```bash
npm i
npx remotion studio
```

- Scene lengths: `src/Showreel.tsx` (keep `SCENES` in `src/theme.ts` in sync).
- Brand colours and font: `src/theme.ts`. CBTax uses Urbane (Adobe Fonts); Urbanist is bundled as the closest free match.
- Captures live in `public/shots` and `public/video`.

## Rendering

```bash
npx remotion render CBTaxShowreel renders/cbtax-showreel.mp4 --crf=18
```
