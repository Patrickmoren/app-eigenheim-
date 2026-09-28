#!/usr/bin/env python3
"""Prüft die aufgeschaltete Website vor der ersten Werbung.

  python3 golive_check.py https://nebenkosten-fixfertig.ch

Prüft: alle Seiten erreichbar, HTTPS, keine offenen Platzhalter, Pflichtangaben im Impressum,
Links auf Impressum/Datenschutz/Bedingungen, keine Cookies, keine Inhalte von Drittanbietern,
Zahlungslinks auf Stripe, Sicherheits-Header. Exit-Code 1 bei einem Fehler.
"""
import re
import sys
import urllib.error
import urllib.request

import json
import os

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.json"), encoding="utf-8") as _f:
    EIGENE = json.load(_f)["WEBSITE"].rstrip("/")

SEITEN = ["", "unterlagen.html", "impressum.html", "datenschutz.html", "agb.html", "beispiel-abrechnung.pdf", "robots.txt"]


def hole(url):
    req = urllib.request.Request(url, headers={"User-Agent": "golive-check"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.status, dict(r.headers), r.read()


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    basis = sys.argv[1].rstrip("/") + "/"
    fehler, ok = [], []

    def pruefe(bedingung, text):
        (ok if bedingung else fehler).append(text)

    if basis.startswith("https://"):
        try:
            status, _, _ = hole("http://" + basis[len("https://"):])
            ok.append("http:// ist erreichbar (Netlify leitet auf https um)")
        except urllib.error.URLError:
            ok.append("http:// nicht erreichbar (unkritisch)")
    else:
        fehler.append("Adresse beginnt nicht mit https://")

    inhalte = {}
    for s in SEITEN:
        try:
            status, kopf, daten = hole(basis + s)
            inhalte[s] = (kopf, daten)
            pruefe(status == 200, f"{s or 'Startseite'}: Status {status}")
            pruefe(not any(k.lower() == "set-cookie" for k in kopf), f"{s or 'Startseite'}: keine Cookies")
        except urllib.error.HTTPError as e:
            fehler.append(f"{s or 'Startseite'}: HTTP {e.code}")
        except urllib.error.URLError as e:
            fehler.append(f"{s or 'Startseite'}: nicht erreichbar ({e.reason})")

    for s in ["", "impressum.html", "datenschutz.html", "agb.html"]:
        if s not in inhalte:
            continue
        text = inhalte[s][1].decode("utf-8", "replace")
        name = s or "Startseite"
        pruefe("{{" not in text, f"{name}: keine offenen {{{{Platzhalter}}}}")
        pruefe(not re.search(r"\[(Strasse|Vorname|079 000|abrechnung@…|https://buy\.stripe\.com/…)", text),
               f"{name}: keine [Platzhalter] aus config.json")
        fremd = [u for u in re.findall(r'<(?:script|link|img)[^>]+(?:src|href)="(https?://[^"]+)"', text)
                 if not u.startswith((EIGENE, basis))]
        pruefe(not fremd, f"{name}: keine Skripte/Schriften/Bilder von Drittanbietern {fremd or ''}")
        for ziel in ["impressum.html", "datenschutz.html", "agb.html"]:
            pruefe(ziel in text, f"{name}: Link auf {ziel}")

    if "" in inhalte:
        kopf, daten = inhalte[""]
        text = daten.decode("utf-8", "replace")
        links = set(re.findall(r'href="(https://buy\.stripe\.com/\w+)"', text))
        pruefe(len(links) == 2, f"Startseite: zwei Stripe-Zahlungslinks (390/490) gefunden: {len(links)}")
        pruefe("CHF 390" in text, "Startseite: Preis CHF 390 sichtbar")
        for h in ["X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options"]:
            pruefe(any(k.lower() == h.lower() for k in kopf), f"Header {h}")
    if "impressum.html" in inhalte:
        text = inhalte["impressum.html"][1].decode("utf-8", "replace")
        pruefe(re.search(r"\b\d{4}\s+\w", text) is not None, "Impressum: Postadresse mit PLZ")
        pruefe("mailto:" in text, "Impressum: E-Mail-Adresse")

    for t in ok:
        print("  ok   " + t)
    for t in fehler:
        print("  FEHLT " + t)
    print(f"\n{len(ok)} ok, {len(fehler)} Fehler – " + ("bereit für Go-live." if not fehler else "noch nicht aufschalten."))
    return 1 if fehler else 0


if __name__ == "__main__":
    sys.exit(main())
