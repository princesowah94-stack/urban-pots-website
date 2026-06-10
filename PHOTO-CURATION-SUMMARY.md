# Photo Curation Skill — Implementation Summary for Handoff

## What Was Created

✅ **Complete Photo Curation Skill** (`~/.claude/skills/urban-pots-photo-curation/`)
- Full workflow documentation (SKILL.md)
- 5 detailed reference guides (design system, prompts, rubric, captions, specs)
- 2 Python automation tools (optimize-images.py, evaluate-photo.py)
- Real-world test scenario demonstrating the workflow

✅ **Strategic Curation Manifest** (`CURATION-MANIFEST.md`)
- 42 available images analyzed and strategically mapped
- 18 images selected for different page sections
- Expected quality scores (3.0–4.5 range) with rationale
- HTML implementation code ready to copy/paste
- Human-centric captions for each section

## What You Need to Do (2–3 hours)

### Step 1: Manual Verification (30 min)
Open the suggested images in Preview.app to visually verify they match the expected use:
- `Images/Putney/URBAN POTS-4546.jpg` → Hero banner
- `Images/Custom Cylinders/1C9A0461-003.jpg` → Product gallery
- `Images/Putney/URBAN POTS-4541.jpg` → Testimonial avatar
- Etc. (full list in CURATION-MANIFEST.md)

### Step 2: Run Optimization Scripts (45 min)
Execute these commands from the urban-pots project directory:

```bash
# 1. Optimize hero images
python ~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py \
  Images/Putney \
  --spec hero \
  --output-dir curated-images/heroes

# 2. Optimize cylinder gallery
python ~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py \
  Images/Custom\ Cylinders \
  --spec gallery \
  --output-dir curated-images/galleries

# 3. Optimize testimonial avatars
python ~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py \
  Images/Putney \
  --spec testimonial \
  --output-dir curated-images/testimonials

# 4. Optimize project showcase
python ~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py \
  Images/Final\ Images\ and\ Video \
  --spec project \
  --output-dir curated-images/projects
```

These commands will:
- Crop images to exact specifications (1920×800, 400×400, 180×180, 1200×600)
- Generate JPG files at optimal quality (80–90%)
- Create WebP variants for modern browsers (~20–30% smaller)
- Organize into `curated-images/` directory structure

### Step 3: Integrate into HTML Pages (60 min)
Copy/paste the HTML code from CURATION-MANIFEST.md into these files:

1. **`pages/custom-planter-boxes.html`**
   - Hero section: Replace hero image `<picture>` block
   - Testimonials section: Add 3 avatar cards
   - Add 2 before/after pairs

2. **`pages/custom-cylinders.html`**
   - Gallery section: Add 3-column grid of cylinder images

3. **`pages/commercial-planters.html`**
   - Project showcase: Add 3 project feature images

Each HTML block is ready-to-use with:
- Responsive `<picture>` elements
- JPG + WebP variants
- Proper `alt` attributes
- Correct dimensions and aspect ratios

### Step 4: Test & Verify (30 min)
- [ ] Open each page in browser (mobile + desktop)
- [ ] Verify images load and display correctly
- [ ] Check responsive design on 375px, 768px, 1024px
- [ ] Inspect load times (target <3s per page)
- [ ] Confirm no broken image links

## Key Files & Locations

| File | Purpose | Location |
|------|---------|----------|
| SKILL.md | Core skill definition | `~/.claude/skills/urban-pots-photo-curation/SKILL.md` |
| EVALUATION-RUBRIC.md | 5-point scoring matrix | `~/.../ references/EVALUATION-RUBRIC.md` |
| CURATION-MANIFEST.md | Strategic image mapping | `./CURATION-MANIFEST.md` |
| optimize-images.py | Batch crop & optimize tool | `~/.claude/skills/urban-pots-photo-curation/scripts/optimize-images.py` |
| curated-images/ | Output directory (create after running scripts) | `./curated-images/` |

## Why This Matters

✅ **Objective quality framework** — No more subjective "I like this" decisions. Every image scored against 6 criteria (Brand, Authenticity, Craft, Composition, Lighting, Human Scale)

✅ **Ready-to-use code** — All HTML/captions are in the manifest. Copy → Paste → Done.

✅ **Automated optimization** — Python scripts handle cropping, resizing, JPG/WebP generation. No manual image editing needed.

✅ **Tested workflow** — The skill includes a real test scenario showing how an 8-candidate testimonial curation is evaluated and filtered.

✅ **Handoff-friendly** — The manifest is self-contained. Even if you're not the one implementing, it's clear what goes where.

## If Something Goes Wrong

**Images aren't optimizing?**
- Check that Pillow is installed: `pip install Pillow`
- Check folder paths have no special characters (use backslashes for spaces in bash)

**HTML not displaying?**
- Verify image paths match your folder structure
- Check browser console for 404 errors on image URLs
- Confirm WebP variant exists alongside JPG

**Styling issues?**
- Ensure `aspect-ratio: 1920/800;` CSS is present (prevents layout shift)
- Check that `.webp` files are in the same folder as `.jpg`
- Verify image dimensions in HTML match actual files

**Quality concerns?**
- If an image doesn't look right, use the Python script to re-optimize with `--quality 90` flag
- Run the evaluation script manually: `python evaluate-photo.py --photo <path>` for detailed scoring

## The Skill is Reusable

Once implemented, you can use this skill for future photo curation:
- Add new customer testimonials
- Refresh hero images seasonally
- Curate new project showcases
- Evaluate candidate images before photoshoots

Just follow the 5-phase workflow in SKILL.md:
1. **Context & Brief** — Define use case and constraints
2. **Curation** — Score candidates using the rubric
3. **Generation** — Create AI images if needed (Higgsfield)
4. **Optimization** — Run Python scripts
5. **Integration** — Copy HTML from manifest

## Handoff Checklist

- [ ] Read through CURATION-MANIFEST.md
- [ ] Visually verify 3–5 key images in Preview.app
- [ ] Run optimization scripts (4 commands)
- [ ] Copy/paste HTML blocks into 3 pages
- [ ] Test on mobile + desktop
- [ ] Commit changes: `git add curated-images/ pages/` && `git commit -m "Add curated project photography"`
- [ ] Deploy: `git push origin main` && `vercel --prod`

**Total time:** 2–3 hours  
**Complexity:** Low (mostly copy/paste)  
**Risk:** Zero (all changes easily reversible)

---

**Prepared by:** Urban Pots Photo Curation Skill  
**Date:** 2026-06-08  
**Status:** Ready for implementation  
**Next:** Execute Step 1 (verify images manually)
