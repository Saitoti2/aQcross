"""
Generate public/og-image.png — aQross social preview card.
1200 × 630 px, neumorphic design, logo + basket, brand orange.
Run: python3 scripts/gen-og.py
Requires: pillow (pip install pillow)
"""

import math
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
except ImportError:
    print("ERROR: pillow not installed. Run: pip install pillow")
    sys.exit(1)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "public", "og-image.png")

W, H = 1200, 630
BRAND   = (244, 81,  11)
WHITE   = (255, 255, 255)
SURFACE = (255, 255, 255)   # pure white — no tint
DARK    = ( 30,  30,  30)
MUTED   = (136, 136, 136)
LIGHT   = (245, 245, 245)

# ── Font helpers ─────────────────────────────────────────────────────────────
FONT_DIRS = [
    "/System/Library/Fonts/Supplemental",
    "/System/Library/Fonts",
    "/Library/Fonts",
    "/usr/share/fonts/truetype",
    "/usr/share/fonts",
]

def find_font(names):
    for d in FONT_DIRS:
        if not os.path.isdir(d): continue
        for name in names:
            p = os.path.join(d, name)
            if os.path.isfile(p): return p
    return None

FONT_BOLD   = find_font(["Arial Bold.ttf", "DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf"])
FONT_SEMI   = find_font(["Arial.ttf",      "DejaVuSans.ttf",      "LiberationSans-Regular.ttf"])
FONT_REG    = FONT_SEMI

def fnt(path, size):
    try:
        return ImageFont.truetype(path, size) if path else ImageFont.load_default(size=size)
    except Exception:
        return ImageFont.load_default(size=size)

# ── Rounded-rectangle mask helper ────────────────────────────────────────────
def rounded_rect_mask(size, radius, aa=4):
    w, h = size[0]*aa, size[1]*aa
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, w-1, h-1], radius=radius*aa, fill=255)
    return mask.resize(size, Image.LANCZOS)

# ── Radial gradient helper ────────────────────────────────────────────────────
def radial_gradient(size, centre, radius, color, max_alpha):
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    cx, cy = centre
    arr = img.load()
    for y in range(size[1]):
        for x in range(size[0]):
            d = math.sqrt((x-cx)**2 + (y-cy)**2)
            if d < radius:
                a = int(max_alpha * (1 - d/radius)**1.5)
                arr[x, y] = (*color, a)
    return img

# ── Neumorphic shadow helper ─────────────────────────────────────────────────
def neu_shadow(size, radius, blur=24):
    """Returns (dark_layer, light_layer) as RGBA images."""
    pad = blur * 2
    big = (size[0] + pad*2, size[1] + pad*2)
    mask = rounded_rect_mask(big, radius + 4)

    dark = Image.new("RGBA", big, (0, 0, 0, 0))
    dark.paste((0, 0, 0, 60), mask=mask)
    dark = dark.filter(ImageFilter.GaussianBlur(blur))

    light = Image.new("RGBA", big, (0, 0, 0, 0))
    light.paste((255, 255, 255, 200), mask=mask)
    light = light.filter(ImageFilter.GaussianBlur(blur))

    return dark, light, pad

# ── Draw pill button ──────────────────────────────────────────────────────────
def draw_pill(draw, xy, text, font, bg, fg):
    x1, y1, x2, y2 = xy
    r = (y2 - y1) // 2
    draw.rounded_rectangle(xy, radius=r, fill=bg)
    tw, th = draw.textbbox((0,0), text, font=font)[2:4]
    tx = x1 + (x2 - x1 - tw) // 2
    ty = y1 + (y2 - y1 - th) // 2
    draw.text((tx, ty), text, font=font, fill=fg)

# ── Draw small neu stat card ──────────────────────────────────────────────────
def draw_stat(canvas, x, y, line1, line2, f_bold, f_reg):
    cw, ch = 105, 50
    # shadow
    shadow = Image.new("RGBA", (cw+20, ch+20), (0,0,0,0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([4,4,cw+16,ch+16], radius=12, fill=(0,0,0,30))
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    canvas.paste(Image.new("RGBA", (cw+20, ch+20), (255,255,255,0)), (x-10, y-10), shadow)
    # card
    card = Image.new("RGBA", (cw, ch), (*WHITE, 255))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0,0,cw-1,ch-1], radius=14, fill=(*LIGHT, 255))
    # text
    tw1 = cd.textbbox((0,0), line1, font=f_bold)[2]
    cd.text(((cw-tw1)//2, 8), line1, font=f_bold, fill=(*BRAND, 255))
    tw2 = cd.textbbox((0,0), line2, font=f_reg)[2]
    cd.text(((cw-tw2)//2, 30), line2, font=f_reg, fill=(*MUTED, 255))
    canvas.paste(card, (x, y), card)

# ─────────────────────────────────────────────────────────────────────────────
# BUILD
# ─────────────────────────────────────────────────────────────────────────────

canvas = Image.new("RGBA", (W, H), (*WHITE, 255))

# ── Neumorphic card ───────────────────────────────────────────────────────────
CX, CY, CW, CH, CR = 40, 40, 1120, 550, 44

dark_sh, light_sh, pad = neu_shadow((CW, CH), CR, blur=28)

# dark shadow (bottom-right offset)
canvas.paste((0,0,0,0), (CX + 10 - pad, CY + 10 - pad), dark_sh)
# light shadow (top-left offset)
canvas.paste((0,0,0,0), (CX - 10 - pad, CY - 10 - pad), light_sh)

# card body
card_mask = rounded_rect_mask((CW, CH), CR)
card_body = Image.new("RGBA", (CW, CH), (*SURFACE, 255))
canvas.paste(card_body, (CX, CY), card_mask)

draw = ImageDraw.Draw(canvas)

# ── Brand accent bar (left edge) ─────────────────────────────────────────────
draw.rounded_rectangle([40, 55, 47, 575], radius=4, fill=(*BRAND, 180))

# ── Dashed divider ───────────────────────────────────────────────────────────
for y in range(100, 540, 10):
    alpha = 180 if (y // 10) % 2 == 0 else 0
    draw.line([(580, y), (580, y+5)], fill=(*MUTED, alpha), width=1)

# ── LEFT COLUMN ──────────────────────────────────────────────────────────────
LEFT_X = 90

# Logo — large: up to 420 × 130
logo_path = os.path.join(ROOT, "public", "aQross logo-no bg.png")
if os.path.isfile(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    logo.thumbnail((420, 130), Image.LANCZOS)
    lw, lh = logo.size
    logo_y = 118
    canvas.paste(logo, (LEFT_X, logo_y), logo)
    logo_bottom = logo_y + lh
else:
    f_logo_fb = fnt(FONT_BOLD, 60)
    draw.text((LEFT_X, 118), "aQross", font=f_logo_fb, fill=(*BRAND, 255))
    logo_bottom = 192

# Divider line
draw.line([(LEFT_X, logo_bottom + 20), (LEFT_X + 380, logo_bottom + 20)],
          fill=(*BRAND, 50), width=2)

# Headline
f_h = fnt(FONT_BOLD, 30)
draw.text((LEFT_X, logo_bottom + 36), "Shop & Delivery for Students",
          font=f_h, fill=(*DARK, 255))

# Sub-text
f_s = fnt(FONT_REG, 18)
draw.text((LEFT_X, logo_bottom + 80), "Groceries · Stationery · Pharma — Campus Fast",
          font=f_s, fill=(*MUTED, 255))

# CTA pill
f_pill = fnt(FONT_BOLD, 17)
draw_pill(draw, (LEFT_X, logo_bottom + 122, LEFT_X + 200, logo_bottom + 158),
          "aqross.co.ke", f_pill, BRAND, WHITE)

# Stat cards
f_stat_b = fnt(FONT_BOLD, 12)
f_stat_r = fnt(FONT_REG,  10)
stat_y = logo_bottom + 174
for i, (l1, l2) in enumerate([("15–45 min", "Delivery"), ("Student", "Deals"), ("Verified", "Shops")]):
    draw_stat(canvas, LEFT_X + i * 118, stat_y, l1, l2, f_stat_b, f_stat_r)

# ── RIGHT COLUMN: basket, clean white bg, no gradients ───────────────────────
RCX, RCY = 880, 315

# Basket image — large, centred in right half
basket_path = os.path.join(ROOT, "public", "3ce0b937-e727-4591-b5fa-8a8eac6f3d1b.png")
if os.path.isfile(basket_path):
    basket = Image.open(basket_path).convert("RGBA")
    # Fill most of the right column height
    basket.thumbnail((460, 440), Image.LANCZOS)
    bw, bh = basket.size
    bx = RCX - bw // 2
    by = RCY - bh // 2
    canvas.paste(basket, (bx, by), basket)
draw = ImageDraw.Draw(canvas)

# ── Bottom domain strip ───────────────────────────────────────────────────────
f_dom = fnt(FONT_REG, 14)
domain_text = "aqross.co.ke  ·  Shop & Delivery for Campus Students"
tw = draw.textbbox((0,0), domain_text, font=f_dom)[2]
draw.text(((W - tw) // 2, 600), domain_text, font=f_dom, fill=(*MUTED, 160))

# ── Clip final image to rounded card boundary ─────────────────────────────────
final_mask = Image.new("L", (W, H), 255)   # full white = show everything
canvas = canvas.convert("RGBA")

# Save
os.makedirs(os.path.dirname(OUT), exist_ok=True)
canvas.convert("RGB").save(OUT, "PNG", optimize=True)
print(f"✓ OG image saved → {OUT}  ({os.path.getsize(OUT)//1024} KB)")
