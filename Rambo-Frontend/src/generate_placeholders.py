# -*- coding: utf-8 -*-
import os
import math
from PIL import Image, ImageDraw, ImageFont

out_dir = r"assets\products"
os.makedirs(out_dir, exist_ok=True)

NAVY = (11, 31, 63)
STEEL = (163, 174, 194)
STEEL_LIGHT = (228, 232, 239)
AMBER = (232, 163, 61)
PAPER = (245, 243, 238)

def try_font(size, bold=False):
    paths = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeui.ttf"
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def make_placeholder(filename, label, size=(900, 900)):
    img = Image.new("RGB", size, PAPER)
    d = ImageDraw.Draw(img)
    
    step = 45
    for x in range(0, size[0], step):
        d.line([(x, 0), (x, size[1])], fill=STEEL_LIGHT, width=1)
    for y in range(0, size[1], step):
        d.line([(0, y), (size[0], y)], fill=STEEL_LIGHT, width=1)

    cx, cy = size[0] // 2, size[1] // 2 - 40
    r_outer = 220
    d.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=NAVY, width=6, fill=(255, 255, 255))
    d.ellipse([cx - r_outer + 30, cy - r_outer + 30, cx + r_outer - 30, cy + r_outer - 30], outline=STEEL, width=3)
    
    for i in range(10):
        ang = math.radians(i * 36)
        x1 = cx + (r_outer - 60) * math.cos(ang)
        y1 = cy + (r_outer - 60) * math.sin(ang)
        x2 = cx + 40 * math.cos(ang)
        y2 = cy + 40 * math.sin(ang)
        d.line([(x1, y1), (x2, y2)], fill=STEEL, width=8)
    d.ellipse([cx - 35, cy - 35, cx + 35, cy + 35], fill=AMBER)

    bl = 40
    for (x, y, dx, dy) in [(20,20,1,1),(size[0]-20,20,-1,1),(20,size[1]-20,1,-1),(size[0]-20,size[1]-20,-1,-1)]:
        d.line([(x, y), (x + dx*bl, y)], fill=AMBER, width=5)
        d.line([(x, y), (x, y + dy*bl)], fill=AMBER, width=5)

    font_small = try_font(26, bold=True)
    text = "PRODUCT PHOTO PLACEHOLDER"
    bbox = d.textbbox((0,0), text, font=font_small)
    tw = bbox[2]-bbox[0]
    d.text(((size[0]-tw)/2, size[1]-140), text, font=font_small, fill=STEEL)

    font_label = try_font(30, bold=True)
    bbox2 = d.textbbox((0,0), label, font=font_label)
    tw2 = bbox2[2]-bbox2[0]
    d.text(((size[0]-tw2)/2, size[1]-95), label, font=font_label, fill=NAVY)

    img.save(os.path.join(out_dir, filename), quality=88)
    print("saved", filename)

products = [
    ("floor-waste-100-ss-1.jpg", "Floor Waste 100mm"),
    ("floor-waste-100-ss-2.jpg", "Floor Waste 100mm - Angle"),
    ("floor-waste-150-ss-1.jpg", "Floor Waste 150mm"),
    ("bathroom-floor-waste-1.jpg", "Bathroom Floor Waste"),
    ("commercial-floor-waste-1.jpg", "Commercial Floor Waste"),
    ("industrial-floor-waste-hd-1.jpg", "Industrial Floor Waste HD"),
    ("square-floor-drain-1.jpg", "Square Floor Drain"),
    ("floor-waste-grate-cover-1.jpg", "Floor Waste Grate Cover"),
]

for fname, label in products:
    make_placeholder(fname, label)

print("done")
