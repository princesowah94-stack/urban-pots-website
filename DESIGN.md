# Urban Pots — Design System

## Color Strategy
Committed — warm architectural palette. Deep charcoal anchors authority; warm stone and sage carry brand identity.

## Color Tokens
| Token | Value | Role |
|---|---|---|
| `--c-bg` | `#F7F7F3` | Page background (off-white, warm toned) |
| `--c-dark` | `#1C1A18` | Near-black, warm toned — hero bg, dark sections |
| `--c-brown` | `#7F593E` | Body text, warm brown |
| `--c-brown-dark` | `#5C3D27` | Headings, strong emphasis |
| `--c-stone` | `#C9B99A` | Warm stone accent — numbers, decorative elements |
| `--c-sage` | `#7A8C5E` | Brand sage — retained for recognition |
| `--c-cream-2` | `#EDE8E1` | Secondary backgrounds |
| `--c-white` | `#FFFFFF` | Pure white (rare) |
| `--c-border` | `rgba(127,89,62,0.14)` | Subtle warm borders |

## Typography
- **Headings:** Cormorant Garamond — serif, architectural weight. Tight line-height (0.95). Italic for expressive moments.
- **Body:** Inter — geometric sans-serif, clean.
- **Accent labels:** Uppercase, heavy letter-spacing (0.2em), small 0.68rem, sage color.

## Elevation / Depth
- Sections alternate between `--c-bg`, `--c-cream-2`, and `--c-dark` for cognitive rhythm
- No drop shadows on cards — separation via background contrast and thin borders
- Hover states: image scale (1.04) over 0.6–0.7s, translateY(-2px) on buttons

## Motion
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` throughout
- GSAP ScrollTrigger for scroll reveals (opacity 0→1, translateY 24px→0)
- Hero entrance: staggered GSAP timeline (label → h1 → sub → actions)
- Stat counters: GSAP count-up on scroll enter
- Hero bg: slow Ken Burns zoom (scale 1.04→1 over 9s)

## Layout
- Max width: 1280px with `clamp(1.5rem, 4vw, 4rem)` horizontal padding
- Section padding: `clamp(4rem, 8vw, 8rem)`
- Grid gaps: razor-thin (1–1.5px) for Spaceful-style section separators

## Component Patterns
- **Eyebrow labels:** 0.68rem, 0.2em tracking, uppercase, sage
- **Arrow links:** uppercase, border-bottom underline, gap animates on hover
- **Buttons:** `btn-pill` — 2px border-radius, all-caps, 0.1em tracking
- **Section heads:** 2-col grid (headline left, body text right) — collapses to 1-col on mobile

## Nav
- Fixed, 68px height
- Transparent over hero (white links), transitions to opaque cream on scroll
- Logo: white/inverted on transparent, original on scrolled
