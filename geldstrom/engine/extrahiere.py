#!/usr/bin/env python3
"""Belege eines Kunden per Claude API auslesen → Eingabe-JSON für nk.py.

Warum API statt claude.ai: Kundendaten (auch Mieterdaten) laufen so unter den
kommerziellen Bedingungen von Anthropic (keine Verwendung zum Modelltraining,
Auftragsbearbeitungsvereinbarung/DPA Bestandteil der Bedingungen). Das ist die
Grundlage für die Zusagen in der Datenschutzerklärung.

Ablauf:
  kunden/<kunde>/belege/   alle Unterlagen (PDF, JPG, PNG, TXT, EML)
  python3 extrahiere.py kunden/<kunde>
  → kunden/<kunde>/eingabe.json  und  kunden/<kunde>/rueckfragen.txt
  → danach: python3 nk.py kunden/<kunde>/eingabe.json --out kunden/<kunde>/ausgabe --pdf

Voraussetzung: pip install anthropic, API-Schlüssel in ANTHROPIC_API_KEY.
--trocken zeigt nur, welche Dateien gesendet würden (kein API-Aufruf).
"""
import argparse
import base64
import json
import mimetypes
import os
import re
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
MODELL = "claude-opus-5"
BILD = {"image/jpeg", "image/png", "image/gif", "image/webp"}
TEXT = {".txt", ".eml", ".csv", ".md"}


def prompt_text():
    with open(os.path.join(HIER, "prompts", "01-extraktion.md"), encoding="utf-8") as f:
        inhalt = f.read()
    treffer = re.search(r"```\n(.*?)```", inhalt, re.S)
    if not treffer:
        sys.exit("Prompt-Block in prompts/01-extraktion.md nicht gefunden.")
    return treffer.group(1)


def bloecke(ordner):
    inhalt, liste = [], []
    for name in sorted(os.listdir(ordner)):
        pfad = os.path.join(ordner, name)
        if not os.path.isfile(pfad) or name.startswith("."):
            continue
        endung = os.path.splitext(name)[1].lower()
        typ = mimetypes.guess_type(name)[0] or ""
        if endung in TEXT:
            with open(pfad, encoding="utf-8", errors="replace") as f:
                inhalt.append({"type": "text", "text": f"--- Datei {name} ---\n{f.read()}"})
        elif typ == "application/pdf" or typ in BILD:
            with open(pfad, "rb") as f:
                daten = base64.standard_b64encode(f.read()).decode("ascii")
            art = "document" if typ == "application/pdf" else "image"
            inhalt.append({"type": "text", "text": f"--- Datei {name} ---"})
            inhalt.append({"type": art, "source": {"type": "base64", "media_type": typ, "data": daten}})
        else:
            print(f"übersprungen (Format nicht unterstützt): {name}", file=sys.stderr)
            continue
        liste.append(name)
    return inhalt, liste


def zerlege(antwort):
    """Antwort = JSON-Objekt, danach Block RÜCKFRAGEN."""
    teile = re.split(r"\n\s*RÜCKFRAGEN\s*\n", antwort, maxsplit=1)
    roh = teile[0].strip()
    roh = re.sub(r"^```(?:json)?\s*|\s*```$", "", roh)
    start, ende = roh.find("{"), roh.rfind("}")
    if start < 0 or ende < 0:
        raise ValueError("Keine JSON-Struktur in der Antwort.")
    daten = json.loads(roh[start:ende + 1])
    rueckfragen = teile[1].strip() if len(teile) > 1 else "(keine Rückfragen ausgegeben)"
    return daten, rueckfragen


def main():
    ap = argparse.ArgumentParser(description="Belege per Claude API auslesen")
    ap.add_argument("kundenordner", help="Ordner mit Unterordner belege/")
    ap.add_argument("--trocken", action="store_true", help="nur anzeigen, nichts senden")
    a = ap.parse_args()
    belege = os.path.join(a.kundenordner, "belege")
    if not os.path.isdir(belege):
        sys.exit(f"Ordner fehlt: {belege}")
    inhalt, liste = bloecke(belege)
    if not liste:
        sys.exit("Keine verwertbaren Belege gefunden.")
    print(f"{len(liste)} Dateien: " + ", ".join(liste))
    if a.trocken:
        return 0

    import anthropic  # erst hier, damit --trocken ohne Paket läuft
    client = anthropic.Anthropic()
    inhalt.append({"type": "text", "text": "Erstelle jetzt die JSON-Datei und die RÜCKFRAGEN gemäss Anweisung."})
    try:
        with client.messages.stream(
            model=MODELL,
            max_tokens=64000,
            thinking={"type": "adaptive"},
            output_config={"effort": "high"},
            system=prompt_text(),
            messages=[{"role": "user", "content": inhalt}],
        ) as stream:
            antwort = stream.get_final_message()
    except anthropic.APIConnectionError:
        sys.exit("Keine Verbindung zur API.")
    except anthropic.AuthenticationError:
        sys.exit("API-Schlüssel ungültig oder nicht gesetzt (ANTHROPIC_API_KEY).")
    except anthropic.RateLimitError:
        sys.exit("Rate-Limit erreicht – in einer Minute erneut versuchen.")
    except anthropic.APIStatusError as e:
        sys.exit(f"API-Fehler {e.status_code}: {e.message}")

    if antwort.stop_reason == "refusal":
        sys.exit("Die Anfrage wurde abgelehnt – Belege manuell mit Prompt 1 verarbeiten.")
    if antwort.stop_reason == "max_tokens":
        sys.exit("Antwort abgeschnitten – Belege auf zwei Durchgänge aufteilen.")
    text = "".join(b.text for b in antwort.content if b.type == "text")
    try:
        daten, rueckfragen = zerlege(text)
    except (ValueError, json.JSONDecodeError) as e:
        roh = os.path.join(a.kundenordner, "antwort-roh.txt")
        with open(roh, "w", encoding="utf-8") as f:
            f.write(text)
        sys.exit(f"Antwort nicht lesbar ({e}). Rohtext: {roh}")

    ziel = os.path.join(a.kundenordner, "eingabe.json")
    with open(ziel, "w", encoding="utf-8") as f:
        json.dump(daten, f, ensure_ascii=False, indent=2)
    with open(os.path.join(a.kundenordner, "rueckfragen.txt"), "w", encoding="utf-8") as f:
        f.write(rueckfragen + "\n")
    print(f"→ {ziel}\nRückfragen:\n{rueckfragen}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
