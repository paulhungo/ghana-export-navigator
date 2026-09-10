# Ghana Agricultural Export Navigator - icon generator
from PIL import Image, ImageDraw

GREEN = (11, 77, 47, 255)      # deep green
GREEN2 = (16, 104, 64, 255)    # lighter green center wash
GOLD = (201, 162, 39, 255)     # gold
WHITE = (255, 255, 255, 255)

def make_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = size // 5  # corner radius
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=GREEN)
    # subtle inner glow ring
    d.ellipse([size * 0.08, size * 0.08, size * 0.92, size * 0.92], fill=GREEN2)
    # gold compass star (navigator) - 8 points
    cx = cy = size / 2
    R = size * 0.34   # long points
    r2 = size * 0.13  # short points
    w = size * 0.045  # half-width of points
    pts = []
    import math
    for i in range(8):
        ang = math.pi / 2 - i * math.pi / 4  # start north
        rad = R if i % 2 == 0 else r2
        tipx, tipy = cx + rad * math.cos(ang), cy - rad * math.sin(ang)
        base1 = ang - math.pi / 2
        base2 = ang + math.pi / 2
        pw = w if i % 2 == 0 else w * 0.6
        p1 = (cx + pw * math.cos(base1), cy - pw * math.sin(base1))
        p2 = (cx + pw * math.cos(base2), cy - pw * math.sin(base2))
        pts += [p1, (tipx, tipy), p2]
    d.polygon(pts, fill=GOLD)
    # white north arrow accent on top point
    d.polygon([(cx, cy - R * 1.02), (cx - w * 0.8, cy - R * 0.55), (cx + w * 0.8, cy - R * 0.55)], fill=WHITE)
    # center dot
    dr = size * 0.045
    d.ellipse([cx - dr, cy - dr, cx + dr, cy + dr], fill=WHITE)
    img.save(out_path(size))

def out_path(size):
    if size == 512: return r"C:\Users\user\GhanaExportNavigator\assets\img\icon-512.png"
    if size == 192: return r"C:\Users\user\GhanaExportNavigator\assets\img\icon-192.png"
    if size == 180: return r"C:\Users\user\GhanaExportNavigator\assets\img\apple-touch-icon.png"
    if size == 32: return r"C:\Users\user\GhanaExportNavigator\assets\img\favicon-32.png"
    if size == 16: return r"C:\Users\user\GhanaExportNavigator\assets\img\favicon-16.png"

for s in (512, 192, 180, 32, 16):
    make_icon(s)
print("icons done")
