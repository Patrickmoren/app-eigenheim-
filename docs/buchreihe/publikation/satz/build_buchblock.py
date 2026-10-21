#!/usr/bin/env python3
"""Erzeugt den Buchblock (HTML für den Druck) aus den Manuskriptdateien.

Aufruf:  python3 build_buchblock.py   →  buchblock.html
Danach:  node render_pdf.js           →  band-1_buchblock.pdf

Platzhalter (AUTORNAME, ISBN) stehen oben in KONFIG und werden vor dem
Upload durch die echten Werte ersetzt.
"""
import html
import pathlib
import re

import pyphen

KONFIG = {
    "titel": "Die Tote, die sonntags anruft",
    "reihe": "Was das Eis zurückgibt",
    "band": "Band 1",
    "gattung": "Roman",
    "autor": "AUTORNAME",            # E-P4: bürgerlicher Name oder Pseudonym
    "isbn": "978-3-XXXX-XXXX-X",     # erst nach Projektstart in myBoD
    "jahr": "2026",
}

HIER = pathlib.Path(__file__).resolve().parent
MANUSKRIPT = HIER.parent.parent / "manuskript"
DATEIEN = [
    "band-1_prolog-kapitel-01-03.md",
    "band-1_kapitel-04-10.md",
    "band-1_kapitel-11-19.md",
    "band-1_kapitel-20-27.md",
    "band-1_kapitel-28-35.md",
    "band-1_epilog.md",
]

TRENNER = pyphen.Pyphen(lang="de_CH", left=2, right=3)
WORT = re.compile(r"[A-Za-zÄÖÜäöüÀ-ÿ]{6,}")


def trennen(text: str) -> str:
    """Weiche Trennstriche in längere Wörter setzen (Silbentrennung de_CH)."""
    return WORT.sub(lambda m: TRENNER.inserted(m.group(0), hyphen="\u00ad"), text)


def inline(text: str, trennung: bool = True) -> str:
    text = text.replace("\\*", "\u0000")
    teile = re.split(r"(\*[^*]+\*)", text)
    aus = []
    for t in teile:
        if not t:
            continue
        kursiv = t.startswith("*") and t.endswith("*") and len(t) > 2
        inhalt = t[1:-1] if kursiv else t
        inhalt = html.escape(inhalt.replace("\u0000", "*"), quote=False)
        if trennung:
            inhalt = trennen(inhalt)
        inhalt = inhalt.replace("Dr. ", "Dr.\u00a0")
        aus.append(f"<em>{inhalt}</em>" if kursiv else inhalt)
    return "".join(aus)


def kapitel_html() -> str:
    zeilen = []
    for name in DATEIEN:
        zeilen += (MANUSKRIPT / name).read_text(encoding="utf-8").split("\n")

    aus, band, offen = [], [], False

    def band_schliessen():
        if band:
            aus.append('<div class="band">' + "".join(band) + "</div>")
            band.clear()

    for roh in zeilen:
        z = roh.rstrip()
        if z.startswith(">"):
            t = re.sub(r"^>\s?", "", z)
            if not t:
                continue
            if t.startswith("BAND ·"):
                band.append(f'<p class="band-kopf">{inline(t, False)}</p>')
            else:
                m = re.match(r"^(\d\d:\d\d:\d\d) – (.*)$", t)
                if m:
                    band.append(f'<p><span class="tc">{m.group(1)}</span>{inline(m.group(2), False)}</p>')
                else:
                    band.append(f"<p>{inline(t, False)}</p>")
            continue
        band_schliessen()
        if not z or z == "---" or z.startswith("# ") or z.startswith("### "):
            continue
        if z.startswith("## "):
            t = z[3:].strip()
            if t == "PROLOG":
                kopf, zahl = "Prolog", ""
            elif t == "EPILOG":
                kopf, zahl = "Epilog", ""
            else:
                kopf, zahl = "Kapitel", t.split()[1]
            if offen:
                aus.append("</section>")
            ziffer = f'<span class="nr">{zahl}</span>' if zahl else ""
            aus.append(f'<section class="kapitel"><h2><span class="wort">{kopf}</span>{ziffer}</h2>')
            offen = True
            continue
        if z == "\\*":
            aus.append('<p class="trenner">*</p>')
            continue
        if re.fullmatch(r"\*(Lomm|Bern)[^*]*\*", z):
            aus.append(f'<p class="ortsmarke">{inline(z[1:-1], False)}</p>')
            continue
        aus.append(f"<p>{inline(z)}</p>")
    band_schliessen()
    if offen:
        aus.append("</section>")
    return "\n".join(aus)


def titelei() -> str:
    k = KONFIG
    return f"""
<section class="titelei schmutztitel"><p>{k['titel']}</p></section>
<section class="titelei reihe"><p>{k['reihe']}<br>{k['band']}</p></section>
<section class="titelei titelblatt">
  <p class="autor">{k['autor']}</p>
  <h1>{k['titel']}</h1>
  <p class="gattung">{k['gattung']}</p>
</section>
<section class="titelei impressum">
  <div class="fsc-frei"></div>
  <p>Bibliografische Information der Deutschen Nationalbibliothek: Die Deutsche Nationalbibliothek verzeichnet diese Publikation in der Deutschen Nationalbibliografie; detaillierte bibliografische Daten sind im Internet über dnb.dnb.de abrufbar.</p>
  <p>© {k['jahr']} {k['autor']}</p>
  <p>Die automatisierte Analyse des Werkes, um daraus Informationen insbesondere über Muster, Trends und Korrelationen gemäss §44b UrhG („Text und Data Mining“) zu gewinnen, ist untersagt.</p>
  <p>Die Handlung und alle Figuren dieses Romans sind frei erfunden. Ähnlichkeiten mit lebenden oder verstorbenen Personen wären zufällig. Das Dorf Lomm und der Lommgletscher existieren nicht.</p>
  <p>Verlag: BoD · Books on Demand GmbH, Überseering 33, 22297 Hamburg, bod@bod.ch<br>Druck: Libri Plureos GmbH, Friedensallee 273, 22763 Hamburg</p>
  <p>ISBN {k['isbn']}</p>
</section>
"""


def main():
    css = (HIER / "buchblock.css").read_text(encoding="utf-8")
    seite = f"""<!doctype html>
<html lang="de-CH"><head><meta charset="utf-8"><title>{KONFIG['titel']}</title>
<style>{css}</style></head><body>
{titelei()}
{kapitel_html()}
</body></html>"""
    (HIER / "buchblock.html").write_text(seite, encoding="utf-8")
    print("buchblock.html geschrieben")


if __name__ == "__main__":
    main()
