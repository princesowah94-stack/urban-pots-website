# Urban Pots — Website Redesign Project Brief

**Client:** Urban Pots Australia
**Website:** https://www.urbanpots.com.au/
**Platform:** Shopify
**Project Lead:** Sowah Studio (Prince Sowah)
**Brief Date:** May 2026

---

## 1. Project Overview

Urban Pots is a Sydney-based, family-owned manufacturer and retailer of premium planter boxes and designer pots. They supply residential, commercial, and large-scale developer markets. The business currently generates significant revenue from their **Custom Planter Box** offering and is looking to align their digital presence with the quality and scale of their physical product.

The goal is a full website refurbishment — elevated to feel **premium, trustworthy, and industry-leading** — targeting high-net-worth individuals, construction companies, property developers, landscapers, and builders across Australia.

---

## 2. Target Market

| Audience | Why They Buy |
|---|---|
| High-net-worth individuals | Premium aesthetics, bespoke finish, statement pieces for homes |
| Property developers | Bulk commercial orders, project spec compliance, reliable delivery |
| Construction companies | Volume purchasing, durable commercial-grade materials |
| Landscapers & builders | Trade relationships, custom sizing, local manufacturing |
| Architects & designers | Material versatility (GRC, fibreglass, fibre cement), design collaboration |

**Tone position:** Less "pot shop", more **"architectural planting solutions partner"** — the way Lipman.com.au owns construction authority and Spaceful.com.au owns workspace transformation.

---

## 3. Design Direction

### 3.1 Inspiration Analysis

**Lipman Construction (lipman.com.au)**
- Dark/light contrast system with heavy white space — authority through restraint
- Modular project card grid — portfolio does the talking
- Credibility anchors: award callouts, staff numbers, 60-year heritage
- Hero message leads with experience, not product: *"Bringing more than sixty years of construction experience to every project"*
- **Takeaway for Urban Pots:** Lead with scale and trust markers (projects delivered, m² of planters installed, years in operation). Let the project photography carry the page.

**Spaceful (spaceful.com.au)**
- Clean vertical sections with distinct cognitive breaks — Discover / Design / Deliver methodology
- Aspirational copy targeting C-suite: *"Your best work starts here"*
- Awards gallery as a credibility section
- Photography focused on transformation — before/after, real projects
- **Takeaway for Urban Pots:** Position the Custom Planter Box service as a *transformation*, not a transaction. Use a methodology: *Consult → Design → Manufacture → Install.*

### 3.2 Colour Palette
Move from generic sage to a **refined, architectural palette:**

| Role | Colour |
|---|---|
| Primary | Deep charcoal / anthracite `#1C1C1C` |
| Secondary | Warm stone / sand `#C9B99A` |
| Accent | Muted olive / sage `#7A8C5E` (retain brand recognition) |
| Background | Off-white / linen `#F7F4F0` |
| Text | Near-black `#1A1A1A` |

### 3.3 Typography
- **Headings:** Serif with character (e.g. Freight Display, Playfair Display, or Cormorant Garamond) — premium, architectural weight
- **Body:** Clean geometric sans-serif (e.g. Inter, DM Sans, or Neue Haas Grotesk)
- **Accent labels:** Uppercase tracking, small caps for category labels

### 3.4 Motion & Animation
Premium feel requires purposeful motion:

- **Hero entrance:** Full-bleed video or high-quality image with slow-reveal headline (word-by-word or character stagger using GSAP or CSS keyframes)
- **Scroll-triggered sections:** Elements fade and translate in as the user scrolls — subtle, not flashy
- **Spline 3D Scene (Hero or Custom Planter Box section):** An interactive 3D rendered planter box or architectural scene using [Spline](https://spline.design) — rotatable on cursor, giving a premium "product configurator" feel without building a full configurator. Embed via `<spline-viewer>` web component — works natively in Shopify Liquid.
- **Number counters:** Stats section animates up on scroll (projects delivered, m² installed, years operating)
- **Hover states:** Product cards lift with subtle shadow + image zoom; CTA buttons have animated underline or fill transitions
- **Page transitions:** Smooth fade between pages using Shopify theme transitions

---

## 4. Key Sections to Build / Rebuild

### 4.1 Hero
- Full-bleed background: high-quality project photography or Spline 3D scene
- Headline: aspirational, not descriptive — e.g. *"Spaces That Demand to Be Noticed"* or *"Commercial-Grade Planters. Architectural Vision."*
- Subheadline: one sentence on who they serve
- Two CTAs: **[Explore Custom Planters]** and **[View Projects]**
- Scroll indicator animation

### 4.2 Trust Bar (below hero)
Animated stat counters on scroll:
- `500+ Projects Delivered`
- `20+ Years Manufacturing`
- `Locally Made in Sydney`
- `Trusted by 50+ Developers`

### 4.3 Custom Planter Boxes ⭐ *Primary Revenue Section*
This is the most important section on the site. Needs to:
- Lead with a strong commercial headline: *"Bespoke Planter Boxes. Built to Spec."*
- Process: **Consult → Design → Manufacture → Deliver & Install**
- Material options cards: Fibre Cement / Fibreglass / GRC (available on request)
- Key selling points: custom sizing, bulk pricing, project deadlines met
- Strong CTA: **[Start Your Custom Quote]**
- Supporting imagery: workshop photography, production shots, finished installations
- Add a **Spline 3D planter box model** the user can rotate — positions Urban Pots as technologically ahead of competitors

### 4.4 Material Showcase
Individual cards / feature strips for each material:
- **Fibre Cement** — durable, lightweight, architectural finish
- **Fibreglass** — premium, bespoke colour matching available
- **GRC (Glass Reinforced Concrete)** — available on special request, heritage/prestige projects

### 4.5 Project Gallery — "Trusted by Sydney Developers"
- Masonry or editorial grid of completed commercial projects
- Filter by: Residential / Commercial / Developer / Landscaping
- Each project: location, product used, scope
- Social proof: developer/builder logos if available

### 4.6 "Locally Made in Our Yard"
- Workshop imagery / production video
- Story: family business, Sydney manufacturing, quality control
- Tone: pride and craftsmanship, not just logistics
- *"Every planter that leaves our yard is built by our team in Western Sydney"*

### 4.7 Products / Shop
- Elevated product cards — full-bleed imagery, clean typography
- Collections: Custom Planter Boxes / GRC / Fibreglass / Terrazzo / Lightweight Designer
- Filter + sort that feels premium (not default Shopify)

### 4.8 Testimonials / Social Proof
- Large-format quote cards from developers / landscapers
- Star ratings + company name / project reference
- Currently missing from site — high priority to add

### 4.9 Footer
- Dark background (charcoal) for contrast
- Clear columns: Products / Custom / Projects / Company / Contact
- Sydney showroom details + hours
- Instagram feed (fix current broken placeholder)
- ABN, trade enquiries CTA

---

## 5. Content Priorities

| Section | Content Needed | Source |
|---|---|---|
| Hero | 1 hero headline + subheadline, 2 CTAs | Write during build |
| Trust bar | 4 stats (confirm numbers with client) | Client to confirm |
| Custom Planters | Process copy, material specs, CTA | Write during build |
| Project Gallery | 6–10 project descriptions | Client to provide images |
| Workshop section | 2–3 paragraphs on manufacturing | Client story + write |
| Testimonials | 3–5 quotes | Client to provide |
| Product descriptions | Updated commercial-grade copy | Rewrite from existing |

---

## 6. Technical Scope (Shopify)

### Workflow
```
1. Pull existing theme locally → shopify theme pull
2. Edit Liquid / CSS / JS files with Claude Code
3. Preview live → shopify theme dev
4. Push to store → shopify theme push
```

### Key Technical Deliverables
- [ ] Custom Liquid sections for all new content blocks
- [ ] Spline 3D embed in hero and/or custom planter section
- [ ] GSAP or CSS scroll-triggered animations
- [ ] Animated stat counters
- [ ] Custom product card template (elevated over default Shopify)
- [ ] Mobile-first responsive layout throughout
- [ ] Shopify metafields for project gallery data
- [ ] Performance: lazy loading, WebP images, minimal JS overhead

### Credentials Needed from Client
- Shopify store URL: `urbanpots.myshopify.com` (confirm)
- Admin API access token (Custom App → `read_products`, `write_products`, `read_themes`, `write_themes`)
- Any existing brand assets (logo files, photography, fonts)

---

## 7. What Urban Pots Currently Does Well (Keep)
- Clear product range with distinct collections
- Local manufacturing story — this is a genuine differentiator
- Showroom presence in Sydney
- Multi-tier market: retail + custom + commercial

## 8. What Needs Fixing (Current Site Issues)
- Broken social media feed placeholders
- Flat visual hierarchy — sections don't feel distinct or premium
- No testimonials or case studies
- Custom Planter Box section undersells the product
- Generic typography and colour palette
- No trust/credibility anchors (stats, project numbers, awards)
- No animations or modern interaction design
- Product copy feels retail-catalogue, not commercial/architectural

---

## 9. Competitive Positioning

> Urban Pots should own the space between *"boutique pot shop"* and *"commercial landscape supplier."*  
> They should feel like the **Aesop of planters** — premium, considered, architecturally aware.

**Against competitors:**
- vs. generic Shopify pot stores: Urban Pots wins on custom manufacturing + local production
- vs. large landscape suppliers: Urban Pots wins on design quality + responsiveness
- vs. importers: Urban Pots wins on Australian-made + GRC/premium materials

---

## 10. Project Phases

### Phase 1 — Foundation (Week 1–2)
- Shopify theme pull + dev environment setup
- Design tokens (colours, typography, spacing) implemented in CSS
- Hero section rebuilt with animation
- Trust bar with animated counters

### Phase 2 — Core Sections (Week 3–4)
- Custom Planter Box section (priority revenue driver)
- Material showcase section
- "Locally Made" workshop section
- Testimonials section

### Phase 3 — Commerce + Polish (Week 5–6)
- Elevated product cards + collections
- Project gallery with filtering
- Spline 3D integration
- Full mobile QA
- Footer rebuild
- Performance audit

### Phase 4 — Launch
- Final content review with client
- Push to live theme
- Analytics setup (GA4 or Shopify analytics)
- Post-launch monitoring

---

## 11. Notes for Claude Code Sessions

- Always pull fresh theme before editing: `shopify theme pull`
- Use `shopify theme dev` to preview before pushing
- Spline scenes: export as web embed from spline.design, embed via `<script type="module" src="https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js"></script>` + `<spline-viewer url="..."></spline-viewer>` in Liquid
- GSAP CDN for scroll animations: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` + ScrollTrigger plugin
- All new sections should use Shopify's section schema for customisability in the theme editor
- Keep Liquid logic minimal — heavy lifting in JS where possible for performance

---

*Brief prepared by Sowah Studio. Last updated May 2026.*
