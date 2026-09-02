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
SURFACE = (248, 248, 248)
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

# ── Translucent orange veil — sweeping diagonal wash across entire left half ─
# Build at small size, blur heavily, scale up for a smooth cinematic look
VEIL_W, VEIL_H = 80, 60
veil_tile = Image.new("RGBA", (VEIL_W, VEIL_H), (0, 0, 0, 0))
vt = veil_tile.load()
for row in range(VEIL_H):
    for col in range(VEIL_W):
        # radial from top-left corner, smooth falloff
        nx = col / VEIL_W   # 0→1 left to right
        ny = row / VEIL_H   # 0→1 top to bottom
        # elliptical distance from top-left origin
        dist = (nx ** 1.8 + ny ** 1.8) ** (1 / 1.8)
        a = int(90 * max(0.0, 1.0 - dist) ** 1.6)
        vt[col, row] = (*BRAND, max(0, a))

# Scale to cover the whole left column of the card
veil_scaled = veil_tile.resize((560, 560), Image.LANCZOS)
# Blur for silky smooth transition
veil_scaled = veil_scaled.filter(ImageFilter.GaussianBlur(14))
logo_veil   = Image.new("RGBA", (W, H), (0, 0, 0, 0))
logo_veil.paste(veil_scaled, (CX + 4, CY + 4))
canvas = Image.alpha_composite(canvas, logo_veil)
draw = ImageDraw.Draw(canvas)

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
    draw.text((LEFT_X, 118), "aQross", font=fnt(FONT_BOLD, 60), fill=(*BRAND, 255))
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

# ── RIGHT COLUMN: basket with orange veil ────────────────────────────────────
RCX, RCY = 870, 310   # right column centre

# ── Translucent orange veil — large soft ellipse bleeding from top-right ──────
# Mimics the hero banner reference: warm orange wash behind the basket,
# fading smoothly into white toward the left and bottom edges.
VEIL2_W, VEIL2_H = 80, 80
veil2_tile = Image.new("RGBA", (VEIL2_W, VEIL2_H), (0, 0, 0, 0))
v2 = veil2_tile.load()
for row in range(VEIL2_H):
    for col in range(VEIL2_W):
        # origin at top-right; fade toward bottom-left
        nx = 1.0 - col / VEIL2_W   # 1 at right, 0 at left
        ny = 1.0 - row / VEIL2_H   # 1 at top,   0 at bottom
        # elliptical: wider horizontally
        dist = ((1 - nx) ** 2.2 + (1 - ny) ** 2.2) ** 0.5
        a = int(100 * max(0.0, 1.0 - dist) ** 1.4)
        v2[col, row] = (*BRAND, max(0, a))

veil2_scaled = veil2_tile.resize((560, 500), Image.LANCZOS)
veil2_scaled = veil2_scaled.filter(ImageFilter.GaussianBlur(18))
basket_veil  = Image.new("RGBA", (W, H), (0, 0, 0, 0))
# Position: top-right of the card
basket_veil.paste(veil2_scaled, (W - 560, CY))
canvas = Image.alpha_composite(canvas, basket_veil)
draw = ImageDraw.Draw(canvas)

# Basket image — larger, sits on top of the veil
basket_path = os.path.join(ROOT, "public", "3ce0b937-e727-4591-b5fa-8a8eac6f3d1b.png")
if os.path.isfile(basket_path):
    basket = Image.open(basket_path).convert("RGBA")
    basket.thumbnail((340, 310), Image.LANCZOS)
    bw, bh = basket.size
    bx = RCX - bw // 2 + 20
    by = RCY - bh // 2 - 20
    canvas.paste(basket, (bx, by), basket)

# Soft bottom-white veil so basket dissolves into card background
bottom_veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bvd = ImageDraw.Draw(bottom_veil)
fade_top = by + bh - 60
for row in range(90):
    a = int(220 * (row / 90) ** 1.8)
    y_pos = fade_top + row
    if 0 <= y_pos < H:
        bvd.line([(600, y_pos), (W - 40, y_pos)], fill=(*SURFACE, a))
canvas = Image.alpha_composite(canvas, bottom_veil)
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
