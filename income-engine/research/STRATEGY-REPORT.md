# Autonomous Income Strategy Report

Stand 06.10.2026 · Phase 1–3 abgeschlossen, Phase 4 (Monetize) wartet auf Freigaben in `APPROVALS.md`.

## Kernaussage

Der grösste unfaire Vorteil ist nicht KI, sondern **Ihr Fachwissen aus der Liegenschaftsbewirtschaftung**. In der Schweiz gehören rund
45 % der Mietwohnungen Privatpersonen (BFS 2023). Diese Vermieter zahlen bereits für Hilfsmittel – CHF 5 für ein PDF-Formular (Casafair),
CHF 150 für einen Excel-Rechner (WEKA), oder Software-Abos (Fairwalter u. a.) – und machen dabei typische Fehler (Heizkosten bei
Mieterwechsel, Leerstand, nicht ausgeschiedene Nebenkosten). Dazwischen klafft eine Preislücke. Erstes Projekt: **Vermieter-Toolkit Schweiz, CHF 39**.

Realistische Erwartung: ein digitales Nischenprodukt dieser Art bringt **CHF 50–500/Monat**, nicht CHF 5'000. Es ist ein schneller,
günstiger Proof of Revenue und der Einstieg in ein Portfolio rund um dieselbe Zielgruppe.

## 1–2. Top-Opportunities mit Score (Gewichtung gemäss Masterprompt, Rohdaten `opportunities/opportunities.csv`)

| Rang | ID | Opportunity | Score | Entscheid |
|---|---|---|---|---|
| 1 | O01 | Vermieter-Toolkit Schweiz (Excel: Nebenkosten + Mietzins + Mieterwechsel) | **80** | TOP 5 |
| 2 | O02 | Mietzins-/Referenzzins-Rechner als Lead-Magnet + Upsell | **72** | TOP 5 |
| 3 | O22 | Stockwerkeigentum-Kostenverteiler (Wertquoten-Rechner) für Verwalter | **72** | TOP 5 |
| 4 | O03 | Nebenkosten-Prüfung für Mieter (KI-Check der Abrechnung) | **68** | TOP 5 |
| 5 | O04 | Micro-SaaS Mieterwechsel-Tracker für kleine Verwaltungen | **67** | TOP 5 |
| 6 | O06 | Etsy/Gumroad Excel-Vorlagen generisch (Budget/Haushalt) | **65** | verworfen |
| 7 | O20 | Mietvertrags-Generator CH (Webformular → PDF) | **65** | verworfen |
| 8 | O07 | Swiss-German Bewerbungs-/CV-Vorlagen | **64** | verworfen |
| 9 | O11 | Affiliate Hypotheken-Vergleich | **64** | verworfen |
| 10 | O12 | B2B-Automatisierung Treuhand (Belegerfassung mit KI) | **64** | verworfen |
| 11 | O21 | Wohnungsabnahme-App (Tablet, Fotos, PDF) | **64** | verworfen |
| 12 | O10 | Affiliate-Vergleichsseite Mietkautionsversicherung CH (SwissCaution/FirstCaution/GoCaution) | **63** | verworfen |
| 13 | O08 | Lokale Lead-Generierung Handwerker (Maler/Reinigung) Region | **62** | verworfen |
| 14 | O05 | KI-Inseratstexte für Vermieter (Wohnungsinserate) | **60** | verworfen |
| 15 | O13 | Steuererklärungs-Checklisten je Kanton | **60** | verworfen |
| 16 | O14 | Prompt-Packs / KI-Workflows für KMU | **60** | verworfen |
| 17 | O19 | Übersetzung/Lokalisierung DE-CH Websites mit KI | **60** | verworfen |
| 18 | O18 | Chrome-Extension Produktivität | **59** | verworfen |
| 19 | O09 | Endreinigung-mit-Abnahmegarantie Vermittlung | **56** | verworfen |
| 20 | O17 | Newsletter mit Sponsoring (CH-Immobilien) | **56** | verworfen |
| 21 | O15 | Print-on-Demand Merch | **54** | verworfen |
| 22 | O16 | Dropshipping Nischenprodukt CH | **49** | verworfen |

Nur 3 Opportunities erreichen ≥ 70. Die übrigen 19 sind verworfen – häufigste Gründe: übersättigte Märkte (generische Vorlagen,
Prompt-Packs, POD), Kapitalbedarf (Dropshipping), lange SEO-Vorlaufzeit (Affiliate), hoher Arbeitsaufwand pro Umsatz (Dienstleistungen),
oder Haftung (Vertragsgenerator, Nebenkostenprüfung für Mieter).

## 3. Top 5

1. **O01 Vermieter-Toolkit Schweiz** (80) – bewiesene Zahlungsbereitschaft, Preislücke, 100 % automatisierte Auslieferung, Fachwissen vorhanden.
2. **O02 Mietzinsrechner als Lead-Magnet** (72) – Traffic-Spitzen bei jeder BWO-Bekanntgabe (nächste: Anfang Dezember 2026). Als Gratis-Teil von O01 nutzen.
3. **O22 StWE-Kostenverteiler** (72) – kleinere Zielgruppe, aber höhere Zahlungsbereitschaft; Variante von O01.
4. **O03 Nebenkosten-Check für Mieter** (68) – grosse Nachfrage, aber Rechtsberatungs-/Haftungsrisiko. Später, mit klarer Abgrenzung.
5. **O04 Mieterwechsel-Tracker SaaS** (67) – höchste Skalierung, aber Vertriebszyklus lang und Interessenkonflikt mit Ihrem Arbeitgeber. Zurückgestellt.

## 4. Detailanalyse Top 3

| | O01 Toolkit | O02 Mietzinsrechner | O22 StWE-Verteiler |
|---|---|---|---|
| Problem | NK-Abrechnung zeitraubend, Fehler bei Mieterwechsel/Leerstand | Unsicherheit, ob/wie Miete angepasst werden darf | Wertquoten-Verteilung von Kosten in kleinen StWE |
| Zielgruppe | ~Privatvermieter mit 1–12 Wohnungen | Vermieter (und Mieter) | Selbstverwaltete StWE-Gemeinschaften |
| Bestehende Anbieter | WEKA (CHF 150), Casafair (CHF 5 PDF), captain.legal (ab 4.90), Fairwalter (Abo) | Mieterverband, HEV (gratis) | WEKA, Verwaltungen |
| Zahlungsbereitschaft | belegt (s. Anbieter) | tief (Gratis-Konkurrenz) | belegt |
| Monetarisierung | Einmalverkauf CHF 39 | Lead → Upsell O01 | Einmalverkauf CHF 49 |
| Marge | ~88 % nach Gumroad-Gebühr | – | ~88 % |
| Plattformabhängigkeit | mittel (Gumroad, austauschbar) | tief | mittel |
| Rechtliches Risiko | tief (Hilfsmittel, Disclaimer) | tief | tief |
| Zeit bis Umsatz | 3–14 Tage | 4–8 Wochen | 2–4 Wochen |

Kritischer Test (Devil's Advocate):
- *„Es gibt Gratisvorlagen.“* – Ja, aber die rechnen keine Heizgradtage, keinen Leerstand, keine Mieterwechsel. Wer einmal eine Abrechnung
  wegen eines Fehlers nachbessern musste, zahlt CHF 39 gern. **Risiko bleibt: Traffic.** Deshalb Ads-Test mit hartem Abbruchkriterium.
- *„Der Markt ist klein.“* – Stimmt für Einmalverkäufe. Skalierung kommt über Produktlinie (StWE, Romandie-Übersetzung, Abnahme-App) und
  später ein Abo-Modell, nicht über Volumen.
- *„Interessenkonflikt mit dem Arbeitgeber?“* – Ihr Arbeitgeber verwaltet für Eigentümer; selbst verwaltende Privatvermieter sind keine
  Kunden. Trotzdem: Arbeitsvertrag prüfen (A0), keine Kunden ansprechen, kein Firmenmaterial verwenden. Das Toolkit ist komplett neu gebaut.

## 5. Entscheidung Platz 1

**O01 Vermieter-Toolkit Schweiz.** Gebaut, getestet, verkaufsbereit.

## 6. Tools
Python + openpyxl (Build), LibreOffice (Tests/PDF), Gumroad (Verkauf, MWST als Merchant of Record), statische Landingpage
(Cloudflare Pages/Netlify gratis), Google Ads (Test), `analytics/report.py` (Dashboard).

## 7. Accounts (alle durch Sie, siehe APPROVALS.md)
Gumroad · Hosting (Cloudflare/Netlify) · Google Ads · optional: Domain (~CHF 15/Jahr, erst nach erstem Verkauf).

## 8. Startkapital
**CHF 0** für Launch. **CHF 50** Ads-Test empfohlen. Keine weiteren Ausgaben bis zum ersten Verkauf.

## 9. Zeitraum bis erster Umsatz
3–14 Tage nach Freigabe A1–A4 (Saisonvorteil: Abrechnungen per 30.06. werden jetzt erstellt).

## 10. Monetarisierung
Einmalverkauf CHF 39 → später Bundle (Toolkit + StWE) CHF 59, Jahres-Update (neue Referenzzinssätze, neue Funktionen) CHF 19.

## 11. Automatisierungsgrad
Verkauf, Zahlung, MWST, Auslieferung: 100 % automatisch (Gumroad). Support: ~5 Min./Verkauf geschätzt, Ziel FAQ-Seite. Ihr Aufwand nach Setup: ~30 Min./Woche.

## 12. Risiken
| Risiko | Massnahme |
|---|---|
| Kein Traffic | Ads-Test mit Abbruchkriterium; Content zur Referenzzins-Bekanntgabe Dez. 2026 |
| Fehler in Berechnung | Automatisierter Test gegen unabhängige Rechnung (23 Prüfungen); 14 Tage Geld-zurück |
| Rechtliche Haftung | Klar als Rechenhilfsmittel deklariert, Verweise auf OR/VMWG, amtliches Formular |
| Arbeitgeberkonflikt | A0 Vertrag prüfen; keine Kunden/Materialien des Arbeitgebers |
| Plattformrisiko Gumroad | Dateien lokal, Wechsel zu Payrexx (TWINT) / Lemon Squeezy jederzeit möglich |

## 13. MVP
`products/vermieter-toolkit-ch/` – Excel-Mappe mit 8 Blättern (Start, Liegenschaft, Mieter, Kosten, Verteilung, Abrechnung,
Mietzins, Mieterwechsel, Abnahme), Build-Skript und Prüfskript. Landingpage und Listing in `launch/`.

## 14. 7-Tage-Plan
| Tag | Aktion | Wer |
|---|---|---|
| 0 (heute) | Research, Scoring, Produkt, Tests, Landingpage, Listing | ✅ erledigt |
| 1 | A0–A4: Vertrag prüfen, Gumroad, Upload, Landingpage live | Sie (≈45 Min.) |
| 1 | A5: Google Ads CHF 5/Tag | Sie freigeben, Kampagnentexte liegen bereit |
| 2 | A6: 1 LinkedIn-Post, 1 FB-Werbethread | Sie |
| 2–7 | Täglicher Loop: Zahlen erfassen, Report, Kampagne optimieren | Agent |
| 7 | Entscheid: skalieren / Preis testen / pivotieren | Agent, Bericht an Sie |

## 15. 30-Tage-Plan
- Woche 2: Landingpage-SEO-Artikel „Nebenkostenabrechnung bei Mieterwechsel – Heizgradtage erklärt“ und „Referenzzinssatz 2026: dürfen Vermieter erhöhen?“
- Woche 3: O22 StWE-Variante bauen (Wiederverwendung 80 % Code), Bundle CHF 59.
- Woche 4: Vor BWO-Bekanntgabe (Anfang Dezember): Gratis-Mietzinsrechner (O02) als Webseite → E-Mail → Upsell.

## 16. Skalierungsplan
1. Validierung (≥ 3 Verkäufe) → 2. Ads bis CAC < 50 % Netto-Erlös skalieren → 3. Produktlinie (StWE, Abnahme-App O21, Französisch für die
Romandie) → 4. Jahres-Update-Abo → 5. Erst bei > CHF 500/Monat stabil: nächste unabhängige Einnahmequelle.

## 17. Reinvestition
Gewinn 50 % Reinvestition / 30 % Reserve / 20 % Entnahme (`finance/config.json`). Reinvestiert wird nur in Kanäle mit gemessenem
positivem ROI. Kein neuer Test > 10 % des Kapitals, kein validiertes Modell > 25 %.

## Quellen
- BWO/SRF: Referenzzinssatz 1.25 % – https://www.srf.ch/news/schweiz/mietzinssenkungen-in-sicht-hypo-referenzzinssatz-sinkt-auf-1-25-prozent
- Moneycab: Referenzzins verharrt – https://www.moneycab.com/dossiers/hypo-referenzzinssatz-verharrt-bei-125-prozent/amp/
- BFS via cash.ch/moneycab: Anteil Privatbesitz Mietwohnungen – https://www.moneycab.com/?p=1879793
- WEKA Excel-Rechner CHF 150 – https://www.weka.ch/bau-immobilien/immobilien/immobilienverwaltung/rechner-heiz-und-nebenkostenabrechnung.html
- Casafair Vorlage CHF 5 – https://casafair.ch/produkt/nebenkostenabrechnung-inkl-musterbeispiel-zum-ausfuellen-am-computer/
- captain.legal ab CHF 4.90 – https://www.captain.legal/ch-de/immobilien/nebenkostenabrechnung-vorlage-schweiz-pdf-word-captain-legal/
- Fairwalter – https://blog.fairwalter.com/de-ch/vorlage-fuer-eine-richtige-nebenkostenabrechnung-in-der-schweiz
- Gumroad/Lemon Squeezy Gebühren & MoR – https://ruul.io/blog/lemonsqueezy-vs-gumroad
