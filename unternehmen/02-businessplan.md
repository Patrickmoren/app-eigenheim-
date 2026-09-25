# 02 · Businessplan Hausklar

> **Hausklar – Ihre Liegenschaft, klar verwaltet.**
> Persönliche Bewirtschaftung mit Namen und Gesicht, KI-Tempo rund um die Uhr, ein fairer
> Pauschalpreis ohne Stundenzettel.

Alle Zahlen in diesem Dokument stammen aus [finanzmodell/Finanzmodell-Hausklar.xlsx](finanzmodell/Finanzmodell-Hausklar.xlsx)
(Szenario «Basis») und sind dort über das Blatt «Annahmen» nachvollziehbar. Die Rechnung ist mit
[finanzmodell/rechenprobe.py](finanzmodell/rechenprobe.py) unabhängig nachgerechnet.

---

## 1. Zusammenfassung auf einer Seite

| | |
|---|---|
| **Was** | Liegenschaftsverwaltung (Miete und Stockwerkeigentum), in der eine eigene KI-Schicht Routinearbeit erledigt und diplomierte Bewirtschafter entscheiden |
| **Für wen** | Private Eigentümer von Mehrfamilienhäusern (6–60 Wohnungen), kleine Stockwerkeigentümergemeinschaften (4–25 Einheiten), Erbengemeinschaften |
| **Wo** | Start Kantone Zürich, Aargau, Zug, Schwyz; ab Jahr 3 Bern, Luzern, beide Basel |
| **Wie wachsen** | Zwei Motoren: (1) Neukunden über Marketing und Partner, (2) Übernahme kleiner Verwaltungen mit ungelöster Nachfolge |
| **Preis** | 2,9 % des Nettomietertrags zzgl. MWST, alles inklusive (Markt: 4–5 % plus Stundensätze). STWE: CHF 1'800 Grundpauschale + CHF 380 je Einheit |
| **Ziel** | CHF 10 Mio. Umsatz im 5. Geschäftsjahr (2031); im vorsichtigen Szenario im 6.–7. Jahr |
| **Kapital** | CHF 2,55 Mio. Eigenkapital in zwei Runden + Bank- und Verkäuferdarlehen für Übernahmen |
| **Warum wir** | Gründerperson ist aktive Bewirtschafterin/aktiver Bewirtschafter mit Prozesswissen im Mieterwechsel; Technik von Tag 1 im Haus |

### Plan in Zahlen (Szenario Basis, CHF)

| | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---:|---:|---:|---:|---:|
| Umsatz | 482'867 | 1'987'874 | 4'541'276 | 7'969'304 | **12'073'401** |
| EBITDA | −402'485 | −253'844 | 501'959 | 2'030'672 | 4'290'522 |
| EBITDA-Marge | −83 % | −13 % | 11 % | 25 % | 36 % |
| Jahresergebnis | −500'537 | −561'071 | −112'248 | 842'701 | 2'315'413 |
| Liquide Mittel 31.12. | 155'309 | 1'161'269 | 484'675 | 798'879 | 2'493'423 |
| Miet-Einheiten | 950 | 2'902 | 5'757 | 9'269 | 13'306 |
| STWE-Einheiten | 450 | 1'477 | 3'103 | 5'148 | 7'591 |
| Mitarbeitende (FTE) | 4,6 | 13 | 25 | 37 | 49 |

Szenarien für 2031: **Vorsichtig** (60 % des Wachstums) CHF 7,2 Mio. Umsatz, EBITDA CHF 1,8 Mio.;
**Stark** (130 %) CHF 15,7 Mio. Umsatz, die CHF 10 Mio. schon 2030. Umschalten in `Annahmen!C4`.

## 2. Problem

**Für Eigentümer**
- Klassische Verwaltungen sind schwer erreichbar: Antworten in 1–3 Werktagen sind normal.
- Abrechnung undurchsichtig: Grundhonorar plus Stundensätze für Mieterwechsel, Sanierungen, Sonderaufwand.
- Kleine Liegenschaften und kleine Stockwerkeigentümergemeinschaften werden abgelehnt oder mit
  «Abwehrangeboten» bedient (VDIV 2026: 45,9 % der Verwaltungen lehnen mehr als die Hälfte der
  Anfragen ab; NZZ, 13.11.2025, für die Schweiz).

**Für Verwaltungen**
- Überlastung und unbesetzte Stellen (VDIV 2026: 62,1 % überlastet).
- Inhaber ohne Nachfolge: 90'667 KMU betroffen (Dun & Bradstreet 2025).

## 3. Lösung

### 3.1 Leistung

Alles, was eine Vollverwaltung umfasst:

| Bereich | Wer macht es |
|---|---|
| Mieteranfragen per Telefon, E-Mail, WhatsApp, Portal (24/7, DE/FR/IT/EN) | KI beantwortet Standardfälle; Rest mit Zusammenfassung an den Bewirtschafter |
| Schadenmeldungen, Handwerker aufbieten bis CHF 500 | KI mit Freigaberegeln, Protokoll |
| Mietzinsinkasso, Mahnwesen, Kreditorenbuchhaltung | KI bereitet vor, Buchhaltung gibt frei (Vier-Augen-Prinzip bei Zahlungen) |
| Nebenkosten- und Heizkostenabrechnung | KI erstellt, Mensch prüft |
| Mieterwechsel: Kündigung, Inserat, Besichtigungen, Abnahme, Übergabe, Schlussabrechnung | Ablaufsteuerung mit Fristenüberwachung; Abnahme und Übergabe durch Menschen vor Ort |
| Mietverträge, Kündigungen, Mietzinsanpassungen, Schlichtungsverfahren | Bewirtschafter entscheidet und unterschreibt |
| Unterhalt, Sanierungen, Bauherrenvertretung | Bewirtschafter, gegen Zusatzhonorar ab CHF 50'000 Bausumme |
| Eigentümerportal: Mieten, Belege, offene Fälle, Leerstand live | Software |
| STWE: Versammlung, Protokoll, Budget, Erneuerungsfonds | Bewirtschafter, KI für Protokoll und Einladung |

### 3.2 Die KI-Schicht «Hausklar Cockpit»

Eigene Software, die **neben** dem Buchhaltungs-/ERP-System läuft (Auswahl siehe 05-umsetzung):

1. **Posteingang:** alle Kanäle in einer Liste, KI klassifiziert (Schaden, Frage, Kündigung, Zahlung,
   Beschwerde), zieht Objekt und Mieter aus dem ERP, schlägt Antwort und nächsten Schritt vor.
2. **Regelwerk:** was die KI selbst erledigen darf (z. B. Handwerker bis CHF 500 bei Vertragspartnern,
   Terminbestätigungen, Auskünfte zu Waschplan und Kehricht), was sie nur vorbereitet.
3. **Fristenwächter:** Kündigungstermine, Abnahmen, Schlussabrechnungen, Garantiefristen,
   Mietzinsanpassungen. Wird neu programmiert; Hausklar übernimmt dafür **keinen Code**, der im
   Rahmen eines bisherigen Arbeitsverhältnisses entstanden ist (siehe 07-entscheidungen).
4. **Eigentümerportal:** Echtzeit-Übersicht, Dokumente, Fragen in normaler Sprache mit Quellenangabe.
5. **Protokoll:** jede KI-Aktion mit Zeitstempel, Grundlage und freigebender Person.

Leitplanke: **Die KI entscheidet nie über Geld über CHF 500, Verträge, Kündigungen oder Mietrecht.**

### 3.3 Warum Kunden wechseln

| | Klassische Verwaltung | mory.ai | **Hausklar** |
|---|---|---|---|
| Honorar | 3,5–5 % + Stundensätze | 2 % alles inbegriffen | **2,9 % alles inbegriffen**, Mieterwechsel inklusive |
| Reaktionszeit Mieter | 1–3 Werktage | Minuten | Minuten |
| Persönlicher Bewirtschafter | ja | ja (dipl.) | ja, **mit fixem Stellvertreter** und Handynummer |
| Kleine STWEG (4–10 Einheiten) | oft abgelehnt | offen | **ausdrücklich Zielgruppe** |
| Regional vor Ort | ja | unklar | ja, max. 45 Min. Fahrzeit je Bewirtschafter |

Positionierung: nicht der Billigste, sondern **der beste Service unter dem Marktpreis**.

## 4. Markt und Zielkunden

Marktgrösse siehe [01-marktanalyse](01-marktanalyse-und-spartenwahl.md#5-marktgrösse-schweiz-eigene-rechnung):
rund CHF 1,3 Mrd. Grundhonorare, CHF 10 Mio. entsprechen rund 0,75 %.

| Segment | Beschreibung | Einstieg | Anteil am Umsatz 2031 |
|---|---|---|---:|
| **S1 Private MFH-Eigentümer** | 1–5 Mehrfamilienhäuser, oft 55+, oft Erben | Honorarvergleich, Empfehlung Treuhänder/Bank | ≈ 45 % |
| **S2 Kleine STWEG** | 4–25 Einheiten, bisherige Verwaltung kündigt oder ist unzufrieden | Versammlungsvorstellung, Google-Suche | ≈ 20 % |
| **S3 Übernommene Kunden** | Bestand gekaufter Verwaltungen | Vertragsübergang | ≈ 35 % (fliesst in S1/S2 ein) |

Nicht Zielgruppe: Pensionskassen, Immobilienfonds, Gewerbe-Grossobjekte (anderes Einkaufsverhalten,
Ausschreibungen, lange Verkaufszyklen).

## 5. Geschäftsmodell und Preise

### Mietliegenschaften
- **2,9 % des jährlichen Nettomietertrags**, mindestens CHF 3'600 pro Liegenschaft und Jahr.
- Alle Preise verstehen sich **zuzüglich 8,1 % MWST** (wie bei den Mitbewerbern üblich; Vergleiche immer ohne MWST).
- Inbegriffen: alles aus 3.1 ausser Bauherrenvertretung und Erstvermietung Neubau.
- Zusatz: Bauherrenvertretung 3–5 % der Bausumme (ab CHF 50'000), Erstvermietung Neubau pauschal
  nach Offerte, Sonderaufträge CHF 140/Std.
- Übernommene Mandate laufen zu ihren bisherigen Konditionen weiter (typisch 4 %); nach 12 Monaten
  wird ein Wechsel ins Hausklar-Modell angeboten.

### Stockwerkeigentum
- **CHF 1'800 Grundpauschale pro Gemeinschaft + CHF 380 pro Einheit und Jahr**
  (Beispiel 10 Einheiten: CHF 5'600, also CHF 560 je Einheit).
- Inbegriffen: eine ordentliche Versammlung, Budget, Jahresrechnung, Erneuerungsfonds, Unterhalt
  bis CHF 5'000 pro Fall.

### Rechenbeispiel Eigentümer
MFH mit 12 Wohnungen à CHF 1'850 netto → Mietertrag CHF 266'400/Jahr.
- Klassisch 4,5 % = CHF 11'988 + ca. 6 Mieterwechsel × 3 Std. × CHF 140 = CHF 2'520 → **CHF 14'508**
- Hausklar 2,9 % = **CHF 7'726** → Ersparnis **CHF 6'782 pro Jahr (47 %)**
- *Die Annahmen zu Mieterwechseln und Stundensatz sind Beispielwerte; der Honorarrechner auf der
  Website rechnet mit den Zahlen des Eigentümers.*

### Wirtschaftlichkeit je Einheit (2031, Basis)
- Umsatz je Miet-Einheit: CHF 606 Grundhonorar × 1,22 Zusatz ≈ **CHF 739**.
- Ein Bewirtschafter betreut 560 Miet-Einheiten (klassisch rund 400, Annahme) → Umsatz je
  Bewirtschafter ≈ CHF 414'000; Vollkosten inkl. 0,4 Assistenz ≈ CHF 153'000.

## 6. Wachstum: die zwei Motoren

### Motor 1 · Neukunden (organisch)

| Jahr | Neue Miet-Einheiten | Neue STWE-Einheiten | Marketingbudget |
|---|---:|---:|---:|
| 2027 | 250 | 150 | CHF 89'000 |
| 2028 | 700 | 450 | CHF 254'000 |
| 2029 | 1'200 | 800 | CHF 440'000 |
| 2030 | 1'600 | 1'100 | CHF 592'000 |
| 2031 | 2'000 | 1'400 | CHF 744'000 |

Kanäle und Trichter siehe [03-marketing](03-marketing.md) und [04-vertrieb](04-vertrieb.md).

### Motor 2 · Nachfolge-Übernahmen

| Jahr | Übernommene Miet-Einheiten | STWE-Einheiten | Kaufpreis total (≈ 1,0 × Umsatz) |
|---|---:|---:|---:|
| 2027 | 700 | 300 | CHF 0,78 Mio. |
| 2028 | 1'300 | 600 | CHF 1,48 Mio. |
| 2029 | 1'800 | 900 | CHF 2,09 Mio. |
| 2030 | 2'200 | 1'100 | CHF 2,56 Mio. |
| 2031 | 2'500 | 1'300 | CHF 2,94 Mio. |

Das sind etwa 1 Übernahme 2027, 1–2 im Jahr 2028 und danach 2 pro Jahr (Zielgrösse 700–1'500
Einheiten, 3–10 Mitarbeitende, Inhaber 60+).

**Deal-Struktur (Standard):** 50 % bar bei Vollzug, 30 % Verkäuferdarlehen über 3 Jahre zu 5,5 %,
20 % Earn-out nach 12 Monaten bei mindestens 90 % Kundenbindung. Verkäufer bleibt 6–12 Monate
als Berater. Integrationskosten 8 % des Kaufpreises.

**Was nach der Übernahme passiert (100-Tage-Plan):** Tag 1 persönlicher Brief an jeden Eigentümer
(gemeinsam mit dem Verkäufer); Monat 1 Cockpit parallel zum bestehenden ERP; Monat 2–3 Datenübernahme;
Monat 4 Wechsel des Mieterkanals; Stellen bleiben erhalten, Wachstum wird ohne Neueinstellungen
aufgefangen.

## 7. Organisation

| Rolle | Ab | Kommentar |
|---|---|---|
| Gründer/in, Geschäftsführung, Bewirtschaftung der ersten Mandate | Jan 2027 | eidg. Fachausweis oder Diplom vorteilhaft |
| Technik-Mitgründer/in (Software, KI) | Jan 2027 | idealerweise mit Beteiligung 10–20 % |
| Buchhaltung / Assistenz (Teilzeit) | Jan 2027 | kommt meist mit der ersten Übernahme |
| Leitung Vertrieb & Marketing | 2028 | |
| CFO / Leitung Übernahmen | 2029 | Bankenbeziehung, Due Diligence, Integration |
| Bewirtschafter-Teams je Region | laufend | 1 Teamleitung je 6–8 Bewirtschafter |

Verwaltungsrat (ab AG): Gründer/in + ein erfahrener Branchenkopf (z. B. pensionierte Leitung
einer Verwaltung) + Vertretung der Investoren.

## 8. Finanzierung

| Jahr | Quelle | Betrag | Zweck |
|---|---|---:|---|
| 2026/27 | Gründer/in + 2–4 Business Angels (Immobilienbranche, Treuhand) | CHF 750'000 | Aufbau, erste Übernahme, Cockpit |
| 2027/28 | Wachstumsrunde (Family Office, Search-Fund-Investoren, Immobilienunternehmer) | CHF 1'800'000 | Übernahmen 2028/29, Team |
| laufend | Akquisitionskredit Bank (5 J.) | CHF 3,5 Mio. aufgenommen bis 2031, Bestand Ende 2031 CHF 2,6 Mio. | Barteil der Übernahmen |
| laufend | Verkäuferdarlehen | Bestand Ende 2031 CHF 1,60 Mio. | 30 % der Kaufpreise |

Die engste Stelle ist **2029**: Kasse CHF 0,48 Mio. bei Nettoverschuldung 3,3 × EBITDA. Wenn die
Bank dort nicht mitgeht, wird die Übernahme 2029 um sechs Monate verschoben oder statt Bankkredit
ein höherer Verkäuferdarlehensanteil vereinbart. Details im [Prüfbericht](06-pruefbericht.md).

**Vorschlag zur Beteiligung (zu verhandeln):** Runde 1 bei CHF 2,5 Mio. Vor-Geld-Bewertung
(Investoren ≈ 23 %), Runde 2 bei CHF 8 Mio. (≈ 18 %). Die Gründerpersonen behalten zusammen knapp
60 %, ein Mitarbeiterbeteiligungspool von 5–8 % ist eingerechnet.

## 9. Meilensteine

| Termin | Meilenstein | Messgrösse |
|---|---|---|
| Dez 2026 | GmbH eingetragen, Versicherung, Bankkonto, Website live | Handelsregistereintrag |
| März 2027 | Erste 5 Mandate, Cockpit v1 im Einsatz | 100 Einheiten |
| Juni 2027 | Erste Übernahme unterschrieben | LOI → Vertrag |
| Dez 2027 | 1'400 Einheiten, Umsatz-Laufrate CHF 1 Mio. | Laufrate |
| Mitte 2028 | Umwandlung in AG, Wachstumsrunde | CHF 1,8 Mio. |
| Dez 2029 | EBITDA positiv über das ganze Jahr, 8'800 Einheiten | EBITDA |
| Dez 2030 | Laufrate knapp CHF 10 Mio. (Modell: 9,87 Mio.) | Laufrate |
| 2031 | **CHF 10 Mio. Jahresumsatz** | Jahresrechnung |

## 10. Die wichtigsten Risiken

Ausführlich im [Prüfbericht](06-pruefbericht.md#4-risiken-und-gegenmassnahmen). Kurz: Übernahmen
finden und finanzieren, Kundenbindung nach Übernahmen, Haftung, Produktivitätsversprechen der KI,
Arbeitsvertrag der Gründerperson.
