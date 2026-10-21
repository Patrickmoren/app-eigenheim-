#!/usr/bin/env python3
"""Setzt das exakte Endformat 120 × 190 mm und prüft den Buchblock (Seiten, Format, Schriften)."""
import pathlib, pymupdf
P = pathlib.Path(__file__).resolve().parent / "band-1_buchblock.pdf"
W, H = 120 / 25.4 * 72, 190 / 25.4 * 72
doc = pymupdf.open(P)
for page in doc:
    page.set_mediabox(pymupdf.Rect(0, 0, W, H))
doc.save(P.with_suffix(".tmp.pdf"), garbage=3, deflate=True)
doc.close()
P.with_suffix(".tmp.pdf").replace(P)
doc = pymupdf.open(P)
r = doc[0].rect
fonts = sorted({(f[3], f[1]) for p in doc for f in p.get_fonts()})
print(f"Seiten: {doc.page_count} (gerade: {doc.page_count % 2 == 0})")
print(f"Format: {r.width/72*25.4:.2f} × {r.height/72*25.4:.2f} mm")
print("Schriften:", fonts)
print("Alle eingebettet:", all(f[1] in ("ttf", "cff", "otf", "type1", "cid") or "+" in f[0] for f in fonts))
