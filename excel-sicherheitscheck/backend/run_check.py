# -*- coding: utf-8 -*-
"""Werkzeug für die Auftragsabwicklung: eine Bestellung = ein Aufruf.

    python3 run_check.py Kundendatei.xlsx "Muster Verwaltung AG" kunde@firma.ch

Erzeugt:
  - Bericht_<Firma>.pdf         (an den Kunden anzuhängen)
  - Bericht_<Firma>_email.txt   (fertiger Text für die Antwortmail)

Damit dauert die Auftragsabwicklung pro Bestellung: Datei speichern,
dieses Skript aufrufen, PDF anhängen, E-Mail-Text hineinkopieren, senden.
Keine manuelle Analyse, kein manuelles Formulieren.
"""
import re
import sys
from datetime import datetime

from analyzer import analysiere_datei
from report import erstelle_pdf


def _dateisicher(name):
    return re.sub(r"[^A-Za-z0-9_-]+", "_", name).strip("_") or "Kunde"


def haupt():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    datei, kunde, email = sys.argv[1], sys.argv[2], sys.argv[3]

    bericht = analysiere_datei(datei)
    basis = _dateisicher(kunde)
    pdf_pfad = f"Bericht_{basis}.pdf"
    erstelle_pdf(bericht, pdf_pfad, kunde_name=kunde, kunde_dateiname=datei)

    anzahl = {g: len(bericht.nach_schweregrad(g)) for g in ("kritisch", "hoch", "mittel", "hinweis")}
    kritisch_hoch = anzahl["kritisch"] + anzahl["hoch"]

    if not bericht.findings:
        kern = ("die gute Nachricht zuerst: Ihre Datei zeigt keines der bekannten "
                "Risikomuster, die wir prüfen.")
    elif kritisch_hoch:
        kern = (f"wir haben {len(bericht.findings)} Punkte gefunden, davon {kritisch_hoch} mit "
                "hoher Priorität – das sind Stellen, an denen heute bereits Daten verloren gehen "
                "oder falsche Werte entstehen können, ohne dass Excel das meldet.")
    else:
        kern = (f"wir haben {len(bericht.findings)} Punkte gefunden. Keiner davon ist akut, "
                "es lohnt sich aber, sie mittelfristig anzugehen.")

    email_text = f"""Betreff: Ihr Excel-Sicherheits-Check – Bericht anbei

Guten Tag

Vielen Dank für Ihren Auftrag. Im Anhang finden Sie den vollständigen Bericht zu
„{datei.rsplit('/', 1)[-1]}" als PDF.

Kurz zusammengefasst: {kern}

Der Bericht (Seite 2) erklärt zu jedem Punkt in Klartext, was gefunden wurde, welches
Risiko das für Ihren Betrieb bedeutet, und was wir empfehlen.

Bei Fragen zu einzelnen Punkten oder wenn Sie Unterstützung bei der Behebung möchten,
antworten Sie einfach auf diese E-Mail.

Freundliche Grüsse

--
Excel-Sicherheits-Check
"""
    email_pfad = f"Bericht_{basis}_email.txt"
    with open(email_pfad, "w", encoding="utf-8") as f:
        f.write(email_text)

    print(f"[{datetime.now():%H:%M:%S}] Auftrag für {kunde} <{email}> verarbeitet.")
    print(f"  PDF:   {pdf_pfad}")
    print(f"  Mail:  {email_pfad}")
    print(f"  Befunde: {len(bericht.findings)} "
          f"(kritisch {anzahl['kritisch']}, hoch {anzahl['hoch']}, "
          f"mittel {anzahl['mittel']}, hinweis {anzahl['hinweis']})")
    print(f"\n  Nächster Schritt: E-Mail an {email} mit '{pdf_pfad}' als Anhang senden, "
          f"Text aus '{email_pfad}' verwenden.")


if __name__ == "__main__":
    haupt()
