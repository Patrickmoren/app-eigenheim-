# Autonomous Money Agent – Bericht 1 (06.10.2026)

## Vorweg: was der Agent kann und was nicht

| Kann der Agent selbst | Kann der Agent nicht |
|---|---|
| recherchieren, bewerten, Rangliste führen | Konten eröffnen (E-Mail-Bestätigung, Captcha, KYC, Steuer-/Auszahlungsdaten) |
| digitale Produkte, Code, Websites, APIs bauen und testen | auf «Human-only»-Plattformen arbeiten (Prolific, DataAnnotation, Outlier, Clickworker …): dort ist KI-Einsatz vertraglich verboten und wird aktiv erkannt → Kontosperre, Lohn wird einbehalten |
| Verkaufstexte, Preise, Uploads vorbereiten | im Hintergrund weiterlaufen: diese Umgebung ist ein Container, der nach der Sitzung gelöscht wird. Daily-Routine braucht einen geplanten Lauf (siehe Execution Plan) |
| Einnahmen/Kosten/Zeit im CFO-Ledger rechnen | Geld bewegen |

Konsequenz: Die «Microtask/AI-Evaluation»-Kategorie ist für einen Agenten K.O. Das beste Verhältnis Gewinn pro menschlicher Stunde liegt bei **digitalen Produkten, die der Agent komplett baut**, und die du nur einmal hochlädst.

## TOP 50 mit Score

Vollständige Liste: [`opportunities/ranking.md`](opportunities/ranking.md) (Rohdaten `opportunities.csv`, Formel `score.py`).
Score = Netto pro menschlicher Stunde (40) + Automation (20) + Umsatz (15) + Risiko (10) + Auszahlbarkeit (10) + Startkosten (5). «K.O.» = Agent darf dort nicht arbeiten oder vom Auftrag ausgeschlossen (Wetten, Krypto).

## TOP 10

| # | Opportunity | Plattform | Score |
|---:|---|---|---:|
| 1 | Vermieter-Bundle CH (Mietzinsrechner Referenzzins, Kaution, Übergabe) | Payhip / Digistore24 | 82 |
| 2 | Nebenkostenabrechnung Schweiz (Excel) | Payhip / Digistore24 / Etsy | 78 |
| 3 | Digistore24-Vendor (fremde Affiliates verkaufen #1/#2) | digistore24.com | 71 |
| 4 | Excel-Vorlagen Privatfinanzen CH (3a, Budget, Steuern) | Payhip / Etsy | 71 |
| 5 | Apify-Actor auf offizieller Zefix-API | apify.com/store | 70 |
| 6 | Rechner-Website (Referenzzins / Nebenkosten) als Traffic-Motor | GitHub Pages + Domain | 67 |
| 7 | SaaS-Affiliate wiederkehrend (bexio, Make, Infomaniak) | Partnerprogramme | 66 |
| 8 | Notion-Vorlagen Vermieter/Haushalt | Gumroad / Notion | 65 |
| 9 | Infomaniak Affiliate | infomaniak.com | 62 |
| 10 | RapidAPI-Marketplace | rapidapi.com | 58 |

Warum Vermieter-Vorlagen gewinnen: In Deutschland verkaufen sich vergleichbare Excel-Vorlagen für EUR 15–39 (Digistore24). Für Schweizer Recht (OR/VMWG, Wertquoten, Heizgradtage) gibt es kaum Angebote. Der Agent kann das Produkt vollständig bauen und mit Rechenprobe absichern. Menschlicher Aufwand: einmal hochladen.

## TOP 5 TESTS

| | T1 Nebenkosten CH | T2 Vermieter-Bundle | T3 Digistore24-Vendor | T4 Rechner-Website | T5 Apify Zefix-Actor |
|---|---|---|---|---|---|
| URL | payhip.com | payhip.com | digistore24.com | GitHub Pages | apify.com/store |
| Modell | Vorlage einmalig verkaufen | Bundle-Upsell | Affiliates verkaufen gegen 40 % | SEO-Rechner → Produktlink + Affiliate | Pay-per-result-Datenactor |
| Verdienst | CHF 24–29/Stk | CHF 39–49/Stk | 60 % vom Preis | indirekt + Affiliate | pro Nutzung |
| Account | Payhip (E-Mail + PayPal/Stripe) | gleicher | Digistore24 Vendor (KYC) | GitHub (vorhanden) | Apify (E-Mail + Auszahlung) |
| Startkosten | 0 | 0 | 0 (ggf. einmalige Gebühr prüfen) | 0 / Domain ~CHF 15 | 0 |
| Erwartet (Monat 3) | CHF 50–120 | CHF 50–150 | +30–50 % auf T1/T2 | CHF 0–60 | CHF 0–60 |
| Automation | 90 % | 90 % | 90 % | 85 % | 90 % |
| Regeln | eigene Werke, Steuerpflicht bei Gewinn | dto. | Produktprüfung durch DS24 | keine | nur erlaubte Quellen (Zefix hat offizielle API) |
| Risiko | rechtliche Fehler → Disclaimer + Rechenprobe | dto. | Rückbuchungen | langsamer SEO-Anlauf | wenig Nachfrage |
| Nächster Schritt | **fertig gebaut**, Upload | Agent baut als Nächstes | nach erstem Verkauf | Agent baut | Agent baut nach T2 |

## Status heute

- **T1 gebaut und geprüft**: [`products/nebenkosten-ch/`](products/nebenkosten-ch/)
  - `Nebenkostenabrechnung-CH.xlsx` (leer) und `…-Beispiel.xlsx`
  - Rechenprobe: LibreOffice-Ergebnis = unabhängige Python-Rechnung für alle Beispielmieter, Kontrollblatt «OK», leere Vorlage ohne Fehlerwerte (`./pruefe_alles.sh`)
  - Verkaufstext, Preis, Tags: [`LISTING.md`](products/nebenkosten-ch/LISTING.md)
- **T2, Teil 1 gebaut und geprüft**: [`products/mieterwechsel-ch/`](products/mieterwechsel-ch/), der Mieterwechsel- und Fristenplaner
  - neu geschrieben, ohne Code oder Unterlagen des Leerstandsmanagers (siehe unten)
  - Rechenprobe: 24 Grenzfälle (Eingang am letzten zulässigen Tag oder einen Tag zu spät, Jahreswechsel, Feiertage, vereinbartes Ende) mit drei Termin-Einstellungen; LibreOffice-Ergebnis = Python-Rechnung (`python3 pruefe.py`)
  - Verkaufstext: [`LISTING.md`](products/mieterwechsel-ch/LISTING.md), CHF 19 einzeln oder CHF 39 im Paket mit T1
- **CFO-Ledger** eingerichtet: [`finance/cfo.py`](finance/cfo.py) mit SQLite, Status TEST/PROFITABLE/SCALE/WATCH/STOP und Sperre bei Überschreiten des Testbudgets CHF 50.
- Ausgaben bisher: CHF 0.

## HUMAN ACTION REQUIRED (einmalig, ~10 Minuten)

1. **Website:** https://payhip.com → Sign up mit patrick.moren13@gmail.com
2. **Warum:** Konto mit Auszahlungsweg kann nur der Inhaber eröffnen (E-Mail-Bestätigung, PayPal/Stripe-Verknüpfung).
3. **Was tun:**
   - Konto eröffnen, unter Settings → Payments PayPal oder Stripe verbinden
   - «Add product → Digital product», beide `.xlsx` aus `money-agent/products/nebenkosten-ch/` hochladen; Titel, Beschreibung, Preis 24 und Tags aus dessen `LISTING.md` → Publish
   - zweites Produkt gleich mit `money-agent/products/mieterwechsel-ch/` (Preis 19)
   - optional ein Bundle aus beiden für CHF 39 anlegen
   - mir den Produktlink schicken
4. **Dauer:** ca. 15 Minuten
5. **Danach übernehme ich:** Bundle T2, Rechner-Website mit Verlinkung auf den Shop, Digistore24-Unterlagen, Ledger.

Ehrlicher Hinweis zum Zeitbudget: Ab dann ist der wiederkehrende Aufwand pro Woche nahe null, aber nicht null – neue Produkte muss jemand mit Kontozugang hochladen (ca. 5 Min. pro Produkt), solange Payhip keine Upload-API anbietet.

## PAYOUT READY

Noch keine Einnahmen. Payhip zahlt direkt über PayPal/Stripe bei jedem Verkauf aus – keine Schwelle, kein Auszahlungsschritt nötig.

## EXECUTION PLAN

| Tag | Agent | Du |
|---|---|---|
| 0 (heute) | T1 gebaut, getestet, Verkaufstext | – |
| 1 | – | Payhip-Upload (10 Min.) |
| 1–3 | T2 Bundle bauen (Mietzinsanpassung nach Referenzzins/LIK/Kostensteigerung, Kautionsabrechnung, Übergabeprotokoll) | Upload (5 Min.) |
| 3–7 | T4 Rechner-Website (Referenzzins-Mietzinsrechner, statisch, GitHub Pages) mit Links auf Shop | GitHub Pages aktivieren (2 Min.) |
| 14 | Auswertung im Ledger: Verkäufe = 0 → Preis/Text ändern; nach 60 Tagen 0 → STOP | – |
| ab 1. Verkauf | T3 Digistore24 Vendor, T5 Apify-Actor | KYC Digistore24 (10 Min.) |

Daily Agent: Diese Sitzung läuft nicht dauerhaft. Für die tägliche Routine (Verkäufe prüfen, Ledger, Bericht) kann ein geplanter Claude-Lauf (Routine) eingerichtet werden, sobald ein Shop live ist – vorher gibt es nichts zu messen.

## Was ich bewusst nicht tue

- Den Leerstandsmanager in diesem Repository verkaufen, auch nicht anonymisiert: Software, die im Rahmen des Arbeitsverhältnisses entsteht, gehört grundsätzlich dem Arbeitgeber (Art. 17 URG, Art. 332 OR). Das Entfernen der Namen ändert daran nichts. Verwendet wird nur allgemeines Fachwissen; die Vermieter-Produkte sind neu geschrieben. Mit schriftlicher Freigabe des Arbeitgebers ließe sich Opportunity 27 neu bewerten.
- KI-Arbeit auf Human-only-Plattformen unter deinem Namen.
- Massen-E-Mails oder Kaltakquise (UWG).

## Struktur

```
money-agent/
  opportunities/  opportunities.csv · score.py · ranking.md
  products/       nebenkosten-ch/ · mieterwechsel-ch/ (je build.py · pruefe.py · LISTING.md · .xlsx)
  finance/        cfo.py · ledger.sqlite
```
