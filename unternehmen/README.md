# Hausklar: Aufbau eines Unternehmens mit CHF 10 Mio. Umsatz

**Entscheid:** Eine KI-gestützte Liegenschaftsverwaltung für private Eigentümer und kleine
Stockwerkeigentümergemeinschaften in der Deutschschweiz, die zusätzlich kleine Verwaltungen mit
ungelöster Nachfolge übernimmt. Ziel CHF 10 Mio. Umsatz im Jahr 2031 (Szenario Basis).

| Dokument | Inhalt |
|---|---|
| [01-marktanalyse-und-spartenwahl.md](01-marktanalyse-und-spartenwahl.md) | Trends, fünf geprüfte Sparten, Bewertungsmatrix, Marktgrösse |
| [02-businessplan.md](02-businessplan.md) | Angebot, Preise, Wachstum, Organisation, Finanzierung, Meilensteine |
| [03-marketing.md](03-marketing.md) | Marke, Kanäle, Budget, Anzeigentexte, Briefe, Inhaltsplan 90 Tage |
| [04-vertrieb.md](04-vertrieb.md) | Trichter, Gesprächsleitfaden, Einwände, Übernahme-Akquise |
| [05-umsetzung.md](05-umsetzung.md) | Wochenplan ab heute, Recht, Technik, Einstellungen |
| [06-pruefbericht.md](06-pruefbericht.md) | Nachrechnung, Quellenstatus, Schwachstellen, Risiken |
| [07-entscheidungen.md](07-entscheidungen.md) | **die fünf Entscheide, die nur du treffen kannst** |
| [finanzmodell/](finanzmodell/) | Excel-Modell mit Formeln, Szenarioschalter, Nachrechnung |
| [website/index.html](website/index.html) | Website mit Honorarrechner ([Vorschau](https://claude.ai/artifact/E1gSJ3A7dHN7iBaMCzRD3f)) |

## Finanzmodell neu erzeugen und prüfen

```sh
cd finanzmodell
pip install openpyxl formulas
python3 build.py          # erzeugt Finanzmodell-Hausklar.xlsx
python3 auswerten.py      # rechnet alle Formeln durch, zeigt die Übersicht
python3 auswerten.py Finanzmodell-Hausklar.xlsx Vorsichtig
python3 rechenprobe.py    # unabhängige Nachrechnung in Python
```

Die Website-Datei enthält nur den Seiteninhalt; für eigenes Hosting braucht sie noch das übliche
HTML-Gerüst (`<!doctype html>`, `<head>` mit Zeichensatz und Viewport). Das Kontaktformular sendet
noch nichts und sagt das auch.
