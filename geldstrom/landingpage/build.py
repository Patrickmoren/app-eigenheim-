#!/usr/bin/env python3
"""Baut die Website aus src/ und config.json nach dist/ und packt sie als ZIP.

  python3 build.py            Endfassung – bricht ab, solange Platzhalter [ … ] offen sind
  python3 build.py --entwurf  Vorschau mit offenen Platzhaltern

Ergebnis: dist/ und nebenkosten-website.zip → auf https://app.netlify.com/drop ziehen.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile

HIER = os.path.dirname(os.path.abspath(__file__))
SRC, DIST = os.path.join(HIER, "src"), os.path.join(HIER, "dist")
ZIP = os.path.join(HIER, "nebenkosten-website.zip")
sys.path.insert(0, os.path.join(HIER, "..", "engine"))
from nk import chromium  # noqa: E402

HEADERS = """/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
"""

OG_HTML = """<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1200px;height:630px;background:#1f5c45;color:#fff;font-family:system-ui,Arial,sans-serif;
display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box}
.m{font-size:34px;opacity:.85;margin-bottom:34px}.m b{font-weight:700}
h1{font-size:74px;line-height:1.05;margin:0 0 30px;letter-spacing:-1px}
p{font-size:34px;margin:0;opacity:.9}</style></head><body>
<div class="m"><b>Nebenkosten</b> fixfertig</div>
<h1>Ihre Nebenkosten&shy;abrechnung – fertig, ohne dass Sie rechnen.</h1>
<p>Für Privatvermieter · Fixpreis ab CHF 290 · Zahlung erst nach Entwurf</p>
</body></html>"""


def pruefe(cfg):
    fehler = []
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[a-z]{2,}", cfg["EMAIL"]):
        fehler.append("EMAIL ist keine gültige Adresse")
    if not cfg["WEBSITE"].startswith("https://"):
        fehler.append("WEBSITE muss mit https:// beginnen")
    if cfg["FORM_ENDPOINT"] and not re.fullmatch(r"https://formspree\.io/f/\w+", cfg["FORM_ENDPOINT"]):
        fehler.append("FORM_ENDPOINT muss wie https://formspree.io/f/abcd1234 aussehen oder leer sein")
    if not re.search(r"\d{4}\s+\S", cfg["ADRESSE"]):
        fehler.append("ADRESSE braucht Strasse, PLZ und Ort (Impressumspflicht, Art. 3 Abs. 1 lit. s UWG)")
    if not re.search(r"\d{3}", cfg["TELEFON"]):
        fehler.append("TELEFON fehlt")
    return fehler


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--entwurf", action="store_true", help="offene Platzhalter erlauben")
    a = ap.parse_args()
    with open(os.path.join(HIER, "config.json"), encoding="utf-8") as f:
        cfg = json.load(f)
    cfg["WEBSITE"] = cfg["WEBSITE"].rstrip("/")

    offen = [k for k, v in cfg.items() if isinstance(v, str) and v.startswith("[")]
    if offen and not a.entwurf:
        sys.exit("Noch offen in config.json: " + ", ".join(offen) + "  (oder --entwurf für eine Vorschau)")
    if not a.entwurf:
        fehler = pruefe(cfg)
        if fehler:
            sys.exit("config.json:\n  " + "\n  ".join(fehler))
    # Formular ohne JavaScript: direkt an Formspree, sonst als E-Mail
    ep = cfg.get("FORM_ENDPOINT", "")
    cfg["FORM_ACTION"] = ep if ep.startswith("https://") else "mailto:" + cfg["EMAIL"]

    shutil.rmtree(DIST, ignore_errors=True)
    shutil.copytree(SRC, DIST)
    for name in os.listdir(DIST):
        if not name.endswith((".html", ".css")):
            continue
        pfad = os.path.join(DIST, name)
        with open(pfad, encoding="utf-8") as f:
            text = f.read()
        for k, v in cfg.items():
            text = text.replace("{{" + k + "}}", v)
        rest = re.findall(r"\{\{\w+\}\}", text)
        if rest:
            sys.exit(f"{name}: unbekannte Platzhalter {sorted(set(rest))}")
        with open(pfad, "w", encoding="utf-8") as f:
            f.write(text)
    with open(os.path.join(DIST, "_headers"), "w") as f:
        f.write(HEADERS)
    with open(os.path.join(DIST, "robots.txt"), "w") as f:
        f.write(f"User-agent: *\nAllow: /\nSitemap: {cfg['WEBSITE']}/sitemap.xml\n")
    with open(os.path.join(DIST, "sitemap.xml"), "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n'
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                f"  <url><loc>{cfg['WEBSITE']}/</loc></url>\n</urlset>\n")

    exe = chromium()
    if exe:
        og_src = os.path.join(HIER, ".og.html")
        with open(og_src, "w", encoding="utf-8") as f:
            f.write(OG_HTML)
        subprocess.run([exe, "--headless", "--no-sandbox", "--hide-scrollbars", "--window-size=1200,630",
                        f"--screenshot={os.path.join(DIST, 'og-bild.png')}", "file://" + og_src],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        os.remove(og_src)
    else:
        print("Kein Chromium – og-bild.png fehlt (Vorschaubild bei WhatsApp).", file=sys.stderr)

    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        for name in sorted(os.listdir(DIST)):
            z.write(os.path.join(DIST, name), name)
    print(("ENTWURF – " if offen else "") + f"{len(os.listdir(DIST))} Dateien → {os.path.relpath(DIST)}/ und {os.path.relpath(ZIP)}")


if __name__ == "__main__":
    main()
