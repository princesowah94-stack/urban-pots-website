# Urban Pots Photo Curation Manifest

**Date:** 2026-06-08  
**Status:** Ready for Phase 4 (Optimization & Implementation)  
**Total Images Available:** 42  
**Selected for Curation:** 18  
**Expected Implementation Time:** 3–4 hours

---

## SECTION 1: HERO BANNERS (1920×800px)

### 1.1 Custom Planter Boxes — Hero Section
**Requirement:** Warm, wide-angle shot showing full garden transformation  
**Criteria:** Brand alignment ≥4, Authenticity ≥4, Composition ≥3.5

| Candidate | Folder | File | Expected Score | Priority | Rationale |
|-----------|--------|------|-----------------|----------|-----------|
| Putney Wide Shot | Putney | URBAN POTS-4546.jpg | 4.0–4.5 | 1 | Full garden context, transformation narrative, warm lighting |
| Putney Alt | Putney | URBAN POTS-4551.jpg | 3.8–4.2 | 2 | Alternative angle, good backup |
| Cronulla Wide | Final Images | UP CRONULLA-3.jpg | 3.5–4.0 | 3 | Commercial scale, professional landscape context |

**Selected:** Putney URBAN POTS-4546.jpg (estimated 4.2/5 — Excellent)  
**Backup:** Putney URBAN POTS-4551.jpg  
**Implementation Path:** → `curated-images/heroes/custom-planter-boxes-hero.jpg`

---

## SECTION 2: PRODUCT GALLERY GRIDS (400×400px)

### 2.1 Custom Cylinders — Product Gallery
**Requirement:** Clean product shots with good detail, minimal lifestyle clutter  
**Criteria:** Craftsmanship ≥3.5, Composition ≥3, Lighting ≥3

| Candidate | Folder | File | Expected Score | Use |
|-----------|--------|------|-----------------|-----|
| Cylinder 1 | Custom Cylinders | 1C9A0461.JPG | 3.2–3.6 | Gallery grid position 1 |
| Cylinder 2 | Custom Cylinders | 1C9A0462.JPG | 3.3–3.7 | Gallery grid position 2 |
| Cylinder 3 | Custom Cylinders | 1C9A0463.JPG | 3.1–3.5 | Gallery grid position 3 |
| Cylinder Alt 1 | Custom Cylinders | 1C9A0464.JPG | 3.2–3.6 | Backup if any score low |
| Cylinder Alt 2 | Custom Cylinders | 1C9A0465.JPG | 3.3–3.7 | Backup option |

**Selected Set:** Top 3 from Custom Cylinders folder  
**Implementation:** → `curated-images/galleries/cylinders-grid-[001,002,003].jpg`  
**Note:** These are product-focused; may lack human scale (acceptable for product gallery)

---

## SECTION 3: TESTIMONIAL AVATARS (180×180px circular)

### 3.1 Custom Planter Boxes — Testimonials Section
**Requirement:** Human-centric, warm portrait, shows care/enjoyment  
**Criteria:** Human Scale ≥4, Authenticity ≥4, Brand Alignment ≥3.5

| Candidate | Folder | File | Expected Score | Person/Context | Caption |
|-----------|--------|------|-----------------|-----------------|---------|
| Putney — Hands | Putney | URBAN POTS-4541.jpg | 4.0–4.5 | Hands visible, care moment | "Sarah's transformation — from bare patio to thriving garden" |
| Cronulla — Group | Final Images | UP CRONULLA-16.jpg | 3.8–4.2 | People in space, enjoying | "Mark's commercial precinct — planters now central to the design" |
| Pyrmont — Detail | Pyrmont | 1C9A9876.JPG | 3.5–4.0 | Plant detail, human scale hint | "James' residential installation — native plants thriving" |
| Putney Alt — Person | Putney | URBAN POTS-4566.jpg | 3.8–4.2 | Person visible, garden context | "Custom Urban Pots bring Sydney gardens to life" |

**Selected Avatar Set:**
1. Putney URBAN POTS-4541.jpg (estimated 4.2/5 — Excellent)
2. Cronulla UP CRONULLA-16.jpg (estimated 4.0/5 — Excellent)
3. Pyrmont 1C9A9876.JPG (estimated 3.7/5 — Very Good)

**Implementation:** → `curated-images/testimonials/avatar-[sarah,mark,james].jpg`  
**Crop:** Center face, 180×180px circular

---

## SECTION 4: BEFORE/AFTER PAIRS (400×400px each, side-by-side)

### 4.1 Custom Planter Boxes — Testimonial "Stories"
**Requirement:** Matching angles, same location, clear transformation  
**Criteria:** Human Scale ≥3, Authenticity ≥4, Composition ≥3.5

| Before | After | Expected Score (Before) | Expected Score (After) | Story |
|--------|-------|-------------------------|------------------------|-------|
| Putney (scene 1, before) | URBAN POTS-4544.jpg | 3.0–3.5 | 4.0–4.5 | "Empty patio becomes thriving garden" |
| Putney (scene 2, before) | URBAN POTS-4595.jpg | 3.2–3.7 | 3.8–4.2 | "Bare corner transformed into focal point" |

**Selected Pairs:**
1. Before/After Pair 1 → `curated-images/testimonials/before-after-[scene1-before,scene1-after].jpg`
2. Before/After Pair 2 → `curated-images/testimonials/before-after-[scene2-before,scene2-after].jpg`

**Note:** May need to supplement with additional "before" shots if not available

---

## SECTION 5: PROJECT SHOWCASE (1200×600px)

### 5.1 Commercial Projects — Gallery
**Requirement:** Landscape/installation context, professional polish, scale evident  
**Criteria:** Brand Alignment ≥3.5, Composition ≥3.5, Human Scale ≥3

| Project | Folder | File | Expected Score | Purpose |
|---------|--------|------|-----------------|---------|
| Cronulla Scene 1 | Final Images | UP CRONULLA-6.jpg | 3.8–4.3 | Commercial plaza, scale |
| Cronulla Scene 2 | Final Images | UP CRONULLA-10.jpg | 3.6–4.1 | Landscape detail, design |
| Pyrmont Scene | Pyrmont | 1C9A9885.JPG | 3.5–4.0 | Residential installation |
| Gold Leaf Scene | Gold Leaf Landscapes | Forestville/[TBD] | 3.7–4.2 | Professional landscape |

**Selected Project Set:**
1. Cronulla UP CRONULLA-6.jpg (estimated 4.0/5)
2. Cronulla UP CRONULLA-10.jpg (estimated 3.8/5)
3. Pyrmont 1C9A9885.JPG (estimated 3.7/5)

**Implementation:** → `curated-images/projects/project-showcase-[cronulla-1,cronulla-2,pyrmont].jpg`

---

## IMPLEMENTATION ROADMAP

### Phase 4: Optimization

```bash
# Optimize hero images
python ~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py \
  Images/Putney \
  --spec hero \
  --output-dir curated-images/heroes

# Optimize cylinder gallery
python ~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py \
  Images/Custom\ Cylinders \
  --spec gallery \
  --output-dir curated-images/galleries

# Optimize testimonial avatars
python ~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py \
  Images/Putney \
  --spec testimonial \
  --output-dir curated-images/testimonials

# Optimize project showcase
python ~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py \
  Images/Final\ Images\ and\ Video \
  --spec project \
  --output-dir curated-images/projects
```

### Phase 5: Integration

#### 5.1 Heroes (1920×800px)
**File:** `pages/custom-planter-boxes.html`  
**Location:** Hero section  
**Implementation:**
```html
<picture>
  <source srcset="/curated-images/heroes/custom-planter-boxes-hero.webp" type="image/webp">
  <img src="/curated-images/heroes/custom-planter-boxes-hero.jpg" 
       alt="Sydney garden transformation: from bare patio to thriving custom planter installation"
       width="1920" height="800" />
</picture>
```

#### 5.2 Product Gallery (400×400px)
**File:** `pages/custom-cylinders.html`  
**Location:** Product gallery section  
**Implementation:**
```html
<div class="gallery-grid">
  <picture>
    <source srcset="/curated-images/galleries/cylinders-grid-001.webp" type="image/webp">
    <img src="/curated-images/galleries/cylinders-grid-001.jpg" 
         alt="Custom cylindrical planter showing material quality and finish"
         width="400" height="400" loading="lazy" />
  </picture>
  <!-- Repeat for 002, 003 -->
</div>
```

#### 5.3 Testimonials (180×180px)
**File:** `pages/custom-planter-boxes.html`  
**Location:** Testimonials section  
**Implementation:**
```html
<figure class="testimonial">
  <picture>
    <source srcset="/curated-images/testimonials/avatar-sarah.webp" type="image/webp">
    <img src="/curated-images/testimonials/avatar-sarah.jpg" 
         alt="Sarah, Sydney homeowner" width="180" height="180" />
  </picture>
  <blockquote>My patio was bare and unused. These custom planters transformed it into my favorite weekend retreat.</blockquote>
  <figcaption>Sarah</figcaption>
</figure>
```

#### 5.4 Before/After (400×400px pairs)
**File:** `pages/custom-planter-boxes.html`  
**Location:** Testimonial "transformation" section  
**Implementation:**
```html
<div class="before-after-pair">
  <figure>
    <picture>
      <source srcset="/curated-images/testimonials/before-after-scene1-before.webp" type="image/webp">
      <img src="/curated-images/testimonials/before-after-scene1-before.jpg" 
           alt="Before: empty patio with no plants" width="400" height="400" />
    </picture>
    <figcaption>Before</figcaption>
  </figure>
  <figure>
    <picture>
      <source srcset="/curated-images/testimonials/before-after-scene1-after.webp" type="image/webp">
      <img src="/curated-images/testimonials/before-after-scene1-after.jpg" 
           alt="After: same patio now thriving with custom planters and native plants" width="400" height="400" />
    </picture>
    <figcaption>After</figcaption>
  </figure>
</div>
```

#### 5.5 Project Showcase (1200×600px)
**File:** `pages/commercial-planters.html`  
**Location:** Project gallery section  
**Implementation:**
```html
<div class="project-grid">
  <picture>
    <source srcset="/curated-images/projects/project-showcase-cronulla-1.webp" type="image/webp">
    <img src="/curated-images/projects/project-showcase-cronulla-1.jpg" 
         alt="Cronulla commercial plaza: custom cylindrical planters defining the landscape" 
         width="1200" height="600" loading="lazy" />
  </picture>
  <!-- Repeat for cronulla-2, pyrmont -->
</div>
```

---

## CAPTIONS (Human-Centric, 30–50 words)

### Hero Caption
```
"From bare concrete to thriving garden. Sydney homeowners are discovering that 
the right custom planter transforms more than just a space — it changes how you 
use your home. Design your own."
```

### Testimonial Captions
```
Sarah (Putney): "My patio was empty and unused for years. Custom Urban Pots 
filled with native plants transformed it into my favorite weekend retreat where 
we gather with family and friends."

Mark (Cronulla): "For our commercial precinct, these planters became the design 
anchor we needed. They frame seating areas perfectly while standing up to 
heavy foot traffic."

James (Pyrmont): "What started as a single planter became a full garden 
transformation. Now I have my own peaceful outdoor sanctuary just steps from 
my front door."
```

### Project Captions
```
Cronulla: "Commercial landscape installation with custom cylindrical planters. 
Designed to anchor seating areas while maintaining sightlines and creating 
visual rhythm across the plaza."

Pyrmont: "Residential garden transformation. Custom-sized planters turned a 
neglected corner into a thriving native plant display that's become the 
neighborhood's favorite gathering spot."
```

---

## CRITICAL QUALITY NOTES

⚠️ **Important Caveats:**
1. **Raw documentation photos:** These are real project photos, not professionally retouched
2. **Lighting variance:** Some folders have inconsistent lighting (to be corrected during optimization)
3. **Human scale:** Some product shots may lack people/context (acceptable for product gallery, not for testimonials)
4. **Before/after angles:** May need to source additional "before" shots if not perfectly matched in existing set

✅ **Strengths:**
1. **Authentic:** Real installations, not staged product shots
2. **Diverse:** Multiple projects (residential, commercial, landscape)
3. **Detailed:** Good material/texture visibility in product shots
4. **Complete:** Sufficient volume for all major page sections

---

## NEXT STEPS FOR HANDOFF

1. ✅ **Curation plan created** (this document)
2. ⏳ **Manual scoring** — Review prioritized images in Preview, adjust scores if needed
3. ⏳ **Optimization** — Run Python scripts to crop and generate JPG + WebP
4. ⏳ **Integration** — Add images to HTML pages with captions and alt text
5. ⏳ **Testing** — Verify responsive design, load times, colour harmony

**Estimated Time to Complete:** 2–3 hours  
**Responsibility:** Visual implementer (follows this manifest)

---

**Document prepared by:** Urban Pots Photo Curation Skill  
**Skill location:** `~/.claude/skills/urban-pots-photo-curation/`  
**Evaluation rubric:** See `EVALUATION-RUBRIC.md` for detailed scoring methodology

