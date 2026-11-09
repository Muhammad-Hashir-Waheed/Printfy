# Hero video: clip credits

The home page hero plays six short clips from `public/videos/hero/`. All are real filmed footage
from Pexels, under the [Pexels License](https://www.pexels.com/license/): free for commercial
use, no attribution required (credited here anyway).

| # | File | Shot | Source | Author | Trim used |
|---|---|---|---|---|---|
| 01 | `hero-01-press` | High-speed sheet-fed printing press running | [pexels.com/video/29975902](https://www.pexels.com/video/high-speed-industrial-printing-press-in-action-29975902/) | Everett Bumstead | 10–16 s |
| 02 | `hero-02-stamp` | Hands stamping a logo onto a flat box blank | [pexels.com/video/6424125](https://www.pexels.com/video/a-person-stamping-a-logo-on-a-packaging-6424125/) | Anna Tarazevich | 0.5–6.5 s |
| 03 | `hero-03-cut` | Cutting machine trimming a printed sheet | [pexels.com/video/31075660](https://www.pexels.com/video/precision-paper-cutting-with-cnc-machine-31075660/) | Jakub Zerdzicki | 3.5–9.5 s |
| 04 | `hero-04-assemble` | Hands folding a printed custom box closed over its insert | [pexels.com/video/7308090](https://www.pexels.com/video/a-business-person-preparing-a-package-7308090/) | RDNE Stock project | 0.4–6.4 s |
| 05 | `hero-05-pack` | Hands finishing branded mailer boxes, flat lay | [pexels.com/video/9594581](https://www.pexels.com/video/a-person-s-hands-are-holding-up-a-box-with-labels-9594581/) | Ron Lach | 6–12 s |
| 06 | `hero-06-neon` | Neon sign switching on in the dark | [pexels.com/video/5820390](https://www.pexels.com/video/a-neon-sign-turning-on-and-off-5820390/) | Maksim Goncharenok | 5.5–11.5 s |

Note on clip 05: the boxes and tags carry a made-up mockup brand ("CLOTH — for real life"),
not a real company.

## Not used

- No free hot-foil-stamping footage exists on Pexels, Mixkit or Coverr, so clip 02 (logo
  stamping onto packaging) stands in for the finishing shot.
- Mixkit "Hands of two people sealing a package with tape" was rejected: its HD file is vertical.
- No free clip shows a flat blank being folded into a box from scratch; clip 04 (folding a printed box's
  flaps closed) is the closest real footage. "Thank You Box" (Monstera Production) was skipped: it is an unboxing.

## Processing (ffmpeg)

Every clip: 6 s, no audio, 25 fps, one shared grade
`eq=saturation=0.85:contrast=1.05,colorbalance=rm=0.04:gm=0.01:bm=-0.04:rh=0.02:bh=-0.02`.

- `hero-NN-*.mp4`: 1920×1080 H.264, CRF 26, max 2.2 Mb/s, faststart
- `hero-NN-*.webm`: 1920×1080 VP9, ~1.8 Mb/s
- `hero-NN-*-sm.mp4`: 960×540 H.264, max 0.9 Mb/s (phones)
- `poster.{avif,webp,jpg}` (1920 px) and `poster-sm.*` (960 px): first frame of clip 01, the LCP image

Sizes: clip 01 is 1.55 MB (MP4) / 1.02 MB (WebM) / 0.45 MB (phone); the other clips are smaller.
