# bestanden

QV-Training für Lernende, bezahlt von Lehrbetrieben. Start mit Sanitärinstallateur/in EFZ.
Stand 25.09.2026. Ersetzt die frühere Planung mit den Top-10-Berufen (`ideen/prototyp-bestanden/berufe-top10.md`).

| Teil | Dokument |
|---|---|
| A Executive Summary | [00-executive-summary.md](00-executive-summary.md) |
| Marktdaten, geprüfte Zahlen, Wahl des ersten Berufs | [01-marktdaten-und-berufswahl.md](01-marktdaten-und-berufswahl.md), Bewertung: [berufswahl/matrix.py](berufswahl/matrix.py) |
| B Businessplan (Preise, Kennzahlen, CHF 7–8 Mio., USP, Team) | [02-businessplan.md](02-businessplan.md) |
| C Produktkonzept mit User Journeys · F UX-Konzept | [03-produktkonzept-und-ux.md](03-produktkonzept-und-ux.md) |
| D MVP-Spezifikation · E Datenmodell · Architektur · Mehrsprachigkeit · QV-READY | [04-mvp-spezifikation.md](04-mvp-spezifikation.md) |
| G KI-Konzept | [05-ki-konzept.md](05-ki-konzept.md) |
| H Content-System und Qualitätssicherung | [06-content-system.md](06-content-system.md) |
| I Finanzmodell (3 Szenarien, 5 Jahre) | [07-finanzmodell.md](07-finanzmodell.md), Excel: [finanzmodell/Finanzmodell-bestanden.xlsx](finanzmodell/Finanzmodell-bestanden.xlsx) |
| J Roadmap 12 Wochen | [08-roadmap-12-wochen.md](08-roadmap-12-wochen.md) |
| K Roadmap 24 Monate | [09-roadmap-24-monate.md](09-roadmap-24-monate.md) |
| L Go-to-Market B2B und B2C | [10-go-to-market.md](10-go-to-market.md) |
| M Validierung und Pilotkonzept | [11-validierung-und-pilot.md](11-validierung-und-pilot.md) |
| N Risikomatrix · O Entscheidungs-Gates | [12-risiken-und-gates.md](12-risiken-und-gates.md) |
| Recht und Datenschutz | [13-recht-und-datenschutz.md](13-recht-und-datenschutz.md) |
| Kosten nach Budgetstufe, Teamplan | [14-kosten-und-team.md](14-kosten-und-team.md) |
| P Die nächsten 10 Schritte | [15-naechste-schritte.md](15-naechste-schritte.md) |

## Finanzmodell nachrechnen

```bash
cd bestanden/finanzmodell
pip install openpyxl formulas
python3 build.py          # Arbeitsmappe aus annahmen.py bauen
python3 auswerten.py      # alle Formeln berechnen, Übersicht ausgeben
python3 rechenprobe.py    # unabhängige Nachrechnung, muss «alle Werte stimmen überein» melden
python3 sensitivitaet.py  # Wirkung einzelner Annahmen
```

## Wichtigste Quellen

- BFS, Statistik der beruflichen Grundbildung (Lernende und Abschlüsse 2025, Juni 2026)
- EHB, [Trendbericht 6: Qualifikationsverfahren auf dem Prüfstand](https://www.ehb.swiss/sites/default/files/2024-09/Trendbericht_2024_DE.pdf) (2024)
- Kanton Luzern, [Erfolgsstatistik QV 2025](https://newsletter.lu.ch/files/SK/Mitteilungen%202025/07_Juli/20250709_Erfolgsstatistik_%20Qualifikationsverfahren.pdf)
- Bildungsverordnungen Sanitär (SR 412.101.220.73), Elektroinstallateur (SR 412.101.220.45), Automobil-Fachmann (SR 412.101.220.50), Fedlex
- Anbieter-Websites (LernStrom, I got this, FaGefit u. a.), gelesen am 25.09.2026
