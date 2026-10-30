"""Footer landscape: resize to WebP + AVIF and measure the sky colour.

    python3 scripts/footer-images.py [footer-landscape.png]

Writes assets/img/footer-landscape-<w>.{webp,avif} for each width in WIDTHS
that does not exceed the source (the source width is used instead, never
upscaled) and prints the average colour of the top 5% for --footer-sky.
"""
import sys
from pathlib import Path

from PIL import Image

WIDTHS = (1200, 2000, 2800)
OUT = Path(__file__).resolve().parent.parent / "assets" / "img"


def sky(im):
    top = im.crop((0, 0, im.width, max(1, round(im.height * 0.05))))
    px = top.get_flattened_data() if hasattr(top, "get_flattened_data") else top.getdata()
    n = top.width * top.height
    return "#" + "".join(f"{round(sum(p[i] for p in px) / n):02x}" for i in range(3))


def main(src):
    im = Image.open(src).convert("RGB")
    OUT.mkdir(parents=True, exist_ok=True)
    widths = sorted({min(w, im.width) for w in WIDTHS})
    for w in widths:
        h = round(im.height * w / im.width)
        r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
        r.save(OUT / f"footer-landscape-{w}.webp", quality=80, method=6)
        r.save(OUT / f"footer-landscape-{w}.avif", quality=55, speed=4)
        print(f"{w}x{h}")
    print("--footer-sky:", sky(im))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "footer-landscape.png")
