# Joji Arts: logo kit

## The mark

**JA, under one roof.** The J's top bar runs straight on and becomes the apex of the A, so both
letters share one line: the lid of a box, the board of a shop sign, one studio doing it all.
Drawn as round-capped strokes on a 100-unit grid.

## The wordmark

"Joji Arts" is set in **Fraunces** (SIL Open Font License 1.1, see `fonts/Fraunces-OFL.txt`) and
**outlined to vector shapes**, so it looks the same everywhere and needs no font installed.

- "Joji": weight 800, Soft 100, Wonky 1, optical size 144, tracking −3%
- "Arts": italic, weight 380, same settings, tracking −1%, shown at 68% opacity

## Files (`logo/`)

| File | Use |
|---|---|
| `joji-arts-lockup.svg` / `.png` | Primary logo on light backgrounds |
| `joji-arts-lockup-white.svg` / `.png` | On dark backgrounds and photos |
| `ja-mark.svg` / `.png` | The mark alone (stamps, foil, embroidery, watermarks) |
| `ja-app-icon.svg` / `-1024.png` | App icon, social profile picture, WhatsApp Business |

Website copies are generated from the same geometry: `src/components/store/brand-paths.ts`,
`src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png`,
`public/favicon.svg`, `public/icon-192.png`, `public/icon-512.png`,
and the share image `src/app/opengraph-image.png` (also used as `twitter-image.png`).

## Colours

| | Hex |
|---|---|
| Joji red | `#D42F25` (on dark: `#F0453A`) |
| Ink | `#1A1512` |
| Paper | `#FAF7F2` |
| Foil gold | `#D9AE4F` |

## Rules

- Keep clear space around the lockup of at least the height of the "J" in "Joji".
- Smallest sizes: lockup 24px tall on screen and 15mm wide in print; mark 16px.
- Don't redraw, stretch, outline or recolour the wordmark, and don't retype it in another font.
- The mark may be rendered in a single colour (white, ink, gold foil) or in the
  materials from `explorations/ja-material-system.png`: dieline, overprint, neon and foil.
