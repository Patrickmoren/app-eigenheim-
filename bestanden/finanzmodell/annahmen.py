# -*- coding: utf-8 -*-
"""Alle Eingaben des Finanzmodells «bestanden». build.py schreibt sie in die
Arbeitsmappe, rechenprobe.py rechnet damit unabhängig nach.
Jede Zeile: Schlüssel, Text, Einheit, Werte je Szenario (Liste 2027–2031 oder
Einzelwert), Zahlenformat, Quelle/Begründung."""

JAHRE = [2027, 2028, 2029, 2030, 2031]
SZENARIEN = ["Vorsichtig", "Basis", "Wachstum"]
LERNENDE_CH = 215052        # BFS, Lehrverhältnisse 2025 (EFZ + EBA)
QV_KANDIDATEN_CH = 70000    # EHB Trendbericht 6 (2024): «jährlich etwa 70 000»

A = [
  ("_t", "Markt"),
  ("lern", "Lernende in den abgedeckten Berufen", "Personen",
   {"Vorsichtig": [2000, 5000, 10000, 18000, 28000],
    "Basis":      [2500, 9000, 22000, 40000, 60000],
    "Wachstum":   [4000, 15000, 35000, 65000, 100000]}, "#,##0",
   "Start Sanitär (rund 600 QV-Antritte/Jahr, EHB 2024), danach Heizung (rund 280). Danach weitere Berufe. "
   "Obergrenze Schweiz: 215'052 Lernende (BFS 2025). Wachstum 2031 = 46 % aller Lernenden: nur erreichbar, "
   "wenn auch grosse Berufe mit bestehender Konkurrenz dazukommen."),
  ("berufe", "Berufe live (kumuliert)", "Anzahl",
   {"Vorsichtig": [1, 2, 4, 6, 8], "Basis": [1, 3, 6, 10, 14], "Wachstum": [2, 5, 11, 17, 24]}, "0",
   "Pro Beruf eine Fachperson für die Prüfung der Inhalte."),
  ("qv", "QV-Kandidaten je Lernende", "Anteil", {s: 0.32 for s in SZENARIEN}, "0%",
   "70'000 Antritte (EHB 2024) ÷ 215'052 Lernende (BFS 2025) = 0,33. Gerundet 0,32."),
  ("_t", "Lehrbetriebe (B2B)"),
  ("pen", "Anteil Lernende mit Betriebslizenz", "%",
   {"Vorsichtig": [0.03, 0.05, 0.07, 0.09, 0.10],
    "Basis":      [0.04, 0.07, 0.11, 0.15, 0.18],
    "Wachstum":   [0.05, 0.10, 0.15, 0.21, 0.26]}, "0%",
   "Hypothese, im Pilot zu messen. time2learn nennt >5'000 Betriebe (Selbstangabe) – Betriebe zahlen für Ausbildungssoftware."),
  ("lpb", "Lizenzierte Lernende je Lehrbetrieb", "Personen", {"Vorsichtig": 2.0, "Basis": 2.5, "Wachstum": 3.0}, "0.0",
   "Annahme. Gebäudetechnik-Betriebe sind oft klein (1–3 Lernende)."),
  ("churn", "Kündigungsrate Lehrbetriebe", "%/Jahr", {"Vorsichtig": 0.25, "Basis": 0.18, "Wachstum": 0.12}, "0%",
   "Annahme. Betriebe ohne Lernende im nächsten Jahrgang kündigen."),
  ("preis_b", "Ø erzielter Preis je lizenzierte/r Lernende/r", "CHF/Jahr",
   {"Vorsichtig": [90, 95, 100, 100, 100], "Basis": [100, 105, 110, 110, 110], "Wachstum": [100, 110, 115, 115, 115]}, "#,##0",
   "Liste CHF 120 (= CHF 10/Monat), abzüglich Staffel- und Verbandsrabatte. Preisanker der Konkurrenz: LernStrom "
   "Sanitär CHF 80 einmalig. Der Aufpreis muss durch Berufsbildner-Ansicht und Fachgespräch-Training begründet sein."),
  ("cac_b", "Akquisekosten je neuer Lehrbetrieb", "CHF",
   {"Vorsichtig": [80, 350, 350, 350, 350], "Basis": [60, 250, 250, 220, 200], "Wachstum": [60, 200, 180, 160, 150]}, "#,##0",
   "Annahme. 2027 verkauft der Gründer selbst (nur Spesen). Danach Anrufe, Besuche, Verbandsanlässe; "
   "über Verbandskanal sinkend. Im Pilot messen."),
  ("_t", "Lernende direkt (B2C)"),
  ("conv", "Kaufquote QV-Kandidaten ohne Betriebslizenz", "%",
   {"Vorsichtig": [0.015, 0.02, 0.025, 0.03, 0.03],
    "Basis":      [0.02, 0.03, 0.04, 0.045, 0.05],
    "Wachstum":   [0.03, 0.04, 0.05, 0.06, 0.07]}, "0.0%",
   "Hypothese. Freemium-Apps wandeln typischerweise wenige Prozent um; Gratis-Konkurrenz in grossen Berufen (FaGefit)."),
  ("preis_c", "Preis QV-Pass (Januar bis QV)", "CHF", {s: 59 for s in SZENARIEN}, "#,##0",
   "Vergleich: LernStrom QV Sanitär CHF 80 einmalig (5 Jahre Zugriff), «I got this» (KV) CHF 89/365 Tage. "
   "B2C ist im Modell nur ein Nebenkanal."),
  ("cac_c", "Akquisekosten je bezahlte/r B2C-Käufer/in", "CHF", {"Vorsichtig": 20, "Basis": 15, "Wachstum": 12}, "#,##0",
   "Annahme für Social Ads (TikTok/Instagram) an 17–20-Jährige. Im Pilot messen."),
  ("org", "Anteil B2C-Käufe ohne Werbung (Empfehlung, Schule)", "%", {"Vorsichtig": 0.3, "Basis": 0.4, "Wachstum": 0.5}, "0%",
   "Annahme."),
  ("_t", "Verbände (OdA-Lizenz)"),
  ("oda", "Verbandslizenzen (Branchenlizenz, eigenes Branding)", "Anzahl",
   {"Vorsichtig": [0, 0, 0, 1, 1], "Basis": [0, 0, 1, 2, 3], "Wachstum": [0, 1, 2, 4, 6]}, "0",
   "Hypothese. Verbände investieren bereits in QV-Erfolg (suissetec: Bildungscoachs seit 2024)."),
  ("preis_oda", "Preis Verbandslizenz", "CHF/Jahr", {s: 25000 for s in SZENARIEN}, "#,##0",
   "Annahme: Plattform, Branding, Auswertungen; Inhalte bleiben beim Verband oder werden geteilt."),
  ("_t", "Variable Kosten"),
  ("aktiv", "Anteil aktive Nutzer/innen unter den Lizenzierten", "%", {s: 0.6 for s in SZENARIEN}, "0%", "Annahme."),
  ("ki", "KI-Kosten je aktive/r Nutzer/in", "CHF/Jahr", {s: 3 for s in SZENARIEN}, "0.00",
   "150 Bewertungen offener Antworten/Jahr × ~2'000 Eingabe- und 400 Ausgabe-Tokens. Claude Opus 5 ($5/$25 je Mio. "
   "Tokens): USD 0.02 je Bewertung = USD 3.00/Jahr; Sonnet 5 ($2/$10): USD 1.20. Ohne Rabatt durch Caching. Siehe 05-ki-konzept.md."),
  ("host", "Hosting und Speicher je aktive/r Nutzer/in", "CHF/Jahr", {s: 1.5 for s in SZENARIEN}, "0.00", "Annahme, Schweizer Hosting."),
  ("zahl_c", "Zahlungsgebühren B2C (Karte, TWINT)", "% Umsatz", {s: 0.035 for s in SZENARIEN}, "0.0%", "Annahme rund 3–3,5 %."),
  ("zahl_b", "Zahlungs- und Mahnkosten B2B", "% Umsatz", {s: 0.01 for s in SZENARIEN}, "0.0%", "Rechnung per QR-Rechnung."),
  ("_t", "Fixkosten"),
  ("fte", "Angestellte (Vollzeitstellen, Gründer ab Lohn)", "FTE",
   {"Vorsichtig": [0, 0, 0.3, 0.8, 1.5], "Basis": [0, 0, 1.0, 3.0, 5.5], "Wachstum": [0, 0.5, 3.0, 7.0, 11.0]}, "0.0",
   "2027 arbeitet der Gründer abends ohne Lohn. Stellen erst, wenn Umsatz sie trägt (siehe Gates)."),
  ("k_fte", "Vollkosten je FTE", "CHF/Jahr", {s: 110000 for s in SZENARIEN}, "#,##0",
   "Lohn ~CHF 90k + Sozialabgaben/BVG ~18 %. Mischwert Entwicklung, Vertrieb, Inhalte."),
  ("c_neu", "Inhalte je neuer Beruf (Fachprüfung, Bilder)", "CHF",
   {"Vorsichtig": [4000, 15000, 20000, 20000, 20000], "Basis": [4000, 15000, 18000, 18000, 18000],
    "Wachstum": [4000, 15000, 18000, 18000, 18000]}, "#,##0",
   "2027: KI-Entwurf durch Gründer, Fachperson prüft ~50 h à CHF 80. Später ~180 h plus Grafiken."),
  ("c_pfl", "Inhaltspflege je Beruf live", "CHF/Jahr", {s: 4000 for s in SZENARIEN}, "#,##0",
   "Ab dem Jahr nach dem Start: Durchsicht, Korrekturen, Änderungen im Bildungsplan."),
  ("tech", "Technik fix (Werkzeuge, Monitoring, App-Stores)", "CHF/Jahr",
   {"Vorsichtig": [600, 2400, 6000, 10000, 15000], "Basis": [600, 3000, 8000, 15000, 25000],
    "Wachstum": [800, 5000, 15000, 30000, 50000]}, "#,##0", "Annahme."),
  ("mk_fix", "Marketing fix (Messen, Material, Inhalte Social Media)", "CHF/Jahr",
   {"Vorsichtig": [300, 3000, 10000, 20000, 30000], "Basis": [500, 8000, 20000, 40000, 60000],
    "Wachstum": [800, 15000, 40000, 70000, 100000]}, "#,##0", "Annahme."),
  ("admin", "Administration (Treuhand, Versicherung, Recht, Datenschutzprüfung)", "CHF/Jahr",
   {"Vorsichtig": [1200, 5000, 10000, 20000, 30000], "Basis": [1500, 6000, 15000, 30000, 50000],
    "Wachstum": [1500, 10000, 25000, 50000, 80000]}, "#,##0",
   "2027: Einzelfirma, Versicherung, einmalige Rechtsprüfung AGB/Datenschutz (Offerte einholen)."),
  ("kasse0", "Eigenmittel zu Beginn", "CHF", {s: 1000 for s in SZENARIEN}, "#,##0", "Vorgabe: CHF 100–1'000."),
]
