#!/usr/bin/env python3
"""
fit-image.py — the Urban Pots convention for fixing image "zoom".

THE PROBLEM IT SOLVES
Images look "zoomed" when a source photo's aspect ratio doesn't match the
container it's shown in. With `object-fit: cover` (or `background-size: cover`),
the browser fills the box and crops the overflow — so a tall portrait shown in
a wide 16:9 card becomes a thin, zoomed-in horizontal slice.

THE FIX (always the same)
Re-crop the ORIGINAL high-res photo to the container's exact aspect ratio,
choosing a focal point so the subject stays framed, then export web-sized
JPG + WebP. The HTML/CSS stays as-is (cover handles the rest).

USAGE
  python3 scripts/fit-image.py <src> <out-stem> --aspect 16:9 --width 1280 \
      [--fx 0.5] [--fy 0.5] [--quality 82] [--jpg-only]

  <src>       original photo (e.g. "Images/Putney /URBAN POTS-4546.jpg")
  <out-stem>  output path WITHOUT extension; writes <stem>.jpg and <stem>.webp
              (e.g. "curated-images/heroes/URBAN POTS-4546-hero")
  --aspect    target ratio "W:H" — match the container. Common ones here:
                heroes / showcase cards .. 16:9   (or 2.4:1 for the big hero)
                materials / galleries   .. 1:1
                work project cards       .. 3:2
  --width     output width in px (height derived from aspect). e.g. 1280
  --fx --fy   focal point as 0..1 fractions of the ORIGINAL (0.5,0.5 = centre).
              Lower fy keeps the bottom of a tall shot; raise fx to favour the
              right side, etc. Tune these to keep the planter in frame.
  --quality   JPG/WebP quality (default 82, matches the rest of the site)
  --jpg-only  skip the WebP (use when the container references only a .jpg,
              e.g. a CSS background-image)

EXAMPLES
  # Cylinders showcase card — pull the framing down onto the pot + pool
  python3 scripts/fit-image.py "Images/Putney /URBAN POTS-4546.jpg" \
      "curated-images/heroes/URBAN POTS-4546-hero" --aspect 16:9 --width 1280 --fy 0.58

  # A square gallery tile centred on the subject
  python3 scripts/fit-image.py "Images/.../shot.JPG" \
      "curated-images/galleries/my-tile" --aspect 1:1 --width 620
"""
import argparse
import os
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install Pillow")


def parse_aspect(s: str) -> float:
    if ":" in s:
        w, h = s.split(":")
    elif "x" in s.lower():
        w, h = s.lower().split("x")
    else:
        return float(s)
    return float(w) / float(h)


def fit(src, out_stem, aspect, width, fx, fy, quality, jpg_only):
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    w, h = img.size
    target_ar = aspect

    # cover-crop to the target aspect ratio, centred on the focal point
    if w / h > target_ar:           # source too wide -> crop width
        new_w = int(round(h * target_ar))
        left = int(round(fx * w - new_w / 2))
        left = max(0, min(left, w - new_w))
        box = (left, 0, left + new_w, h)
    else:                            # source too tall -> crop height
        new_h = int(round(w / target_ar))
        top = int(round(fy * h - new_h / 2))
        top = max(0, min(top, h - new_h))
        box = (0, top, w, top + new_h)

    out_w = width
    out_h = int(round(width / target_ar))
    crop = img.crop(box).resize((out_w, out_h), Image.Resampling.LANCZOS)

    os.makedirs(os.path.dirname(out_stem) or ".", exist_ok=True)
    jpg = out_stem + ".jpg"
    crop.save(jpg, "JPEG", quality=quality, optimize=True)
    msg = f"{src}  ({w}x{h}) -> {out_w}x{out_h} @ {aspect:.3f}  [{os.path.getsize(jpg)//1024} KB jpg"
    if not jpg_only:
        webp = out_stem + ".webp"
        crop.save(webp, "WEBP", quality=quality)
        msg += f", {os.path.getsize(webp)//1024} KB webp"
    print(msg + "]")


def main():
    p = argparse.ArgumentParser(description="Crop an image to a container's aspect ratio (the Urban Pots zoom fix).")
    p.add_argument("src")
    p.add_argument("out_stem", help="output path without extension")
    p.add_argument("--aspect", required=True, help='target ratio, e.g. "16:9", "1:1", "3:2", "2.4:1"')
    p.add_argument("--width", type=int, required=True, help="output width in px")
    p.add_argument("--fx", type=float, default=0.5, help="horizontal focal point 0..1 (default 0.5)")
    p.add_argument("--fy", type=float, default=0.5, help="vertical focal point 0..1 (default 0.5)")
    p.add_argument("--quality", type=int, default=82)
    p.add_argument("--jpg-only", action="store_true")
    a = p.parse_args()
    fit(a.src, a.out_stem, parse_aspect(a.aspect), a.width, a.fx, a.fy, a.quality, a.jpg_only)


if __name__ == "__main__":
    main()
