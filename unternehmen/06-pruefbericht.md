# 06 · Prüfbericht

Zweiter Durchgang über alle Dokumente, das Finanzmodell und die Website. Geprüft wurde: stimmen
die Zahlen untereinander, sind die Quellen richtig wiedergegeben, welche Aussagen sind Annahmen,
und wo liegen die Schwachstellen des Plans.

---

## 1. Rechnerische Prüfung

| Prüfung | Ergebnis |
|---|---|
| Finanzmodell: alle Formeln mit der Bibliothek `formulas` durchgerechnet (`auswerten.py`) | ohne Fehler |
| Finanzmodell unabhängig in Python nachgerechnet (`rechenprobe.py`): Umsatz, EBITDA, liquide Mittel, 5 Jahre | **15 von 15 Werten stimmen überein** |
| Szenarien Basis / Vorsichtig / Stark durchgerechnet | Werte in 02-businessplan übernommen |
| Marketingbudget 2027 (03) = Modellzeile «Marketing und Vertrieb» (250 × 260 + 150 × 160) | CHF 89'000 = CHF 89'000 |
| Trichter (04): 335 → 170 → 100 → 55 → 28 Abschlüsse; Kosten je Abschluss 89'000 ÷ 28 | CHF 3'179, Ziel ≤ 3'300 erfüllt |
| Rechenbeispiel 12 Wohnungen (02) = Honorarrechner der Website | CHF 14'508 vs. 7'726, Ersparnis CHF 6'782 (47 %), identisch |
| Marktgrösse (01): 2,4 Mio. × 1'485 × 12 × 50 % × 4 % + 970'000 × 480 | CHF 856 Mio. + 466 Mio. = CHF 1,32 Mrd. |
| Bewertungsmatrix (01): gewichtete Summen neu gerechnet | 85 / 69 / 52 / 43 / 62 bestätigt |

**Im Prüfdurchgang korrigiert:**
- Marktanteil bei 30 % Drittverwaltung: von «1,1 %» auf **1,0 %** (Rechnung ergab CHF 979 Mio.).
- Meilenstein Dez 2030: «Laufrate CHF 10 Mio.» auf **knapp CHF 10 Mio. (9,87 Mio.)**.
- Bestand Verkäuferdarlehen Ende 2031: CHF 1,33 Mio. war der Wert 2030; richtig **CHF 1,60 Mio.**
- Kosten je Lead: Ziel von CHF 250 auf **CHF 270**, weil das Budget sonst nicht zur Leadzahl passt.
- **MWST ergänzt:** Liegenschaftsverwaltung ist mehrwertsteuerpflichtig (8,1 %); alle Preise jetzt
  ausdrücklich «zzgl. MWST», Modell rechnet ohne MWST.
- Kündigung von Verwaltungsverträgen: Hinweis auf OR Art. 404 (jederzeitige Kündbarkeit des Auftrags,
  Schadenersatz bei Unzeit) ergänzt.
- Erste Fassung des Modells ergab 51 % EBITDA-Marge 2031. Das ist für eine Verwaltung unrealistisch;
  Produktivität, Assistenzquote und Zentrale wurden vorsichtiger angesetzt (jetzt 36 %, vorsichtig 25 %).

## 2. Quellen: was belegt ist und was Annahme

| Aussage | Status | Quelle |
|---|---|---|
| 2,4 Mio. Mieterhaushalte, Ø Miete CHF 1'485 | belegt | BFS 2024 |
| Leerwohnungsziffer 0,93 % (1.6.2026) | belegt | BFS, 10.09.2026 |
| Honorar marktüblich 4–5 %, keine verbindlichen Tarife | belegt | bovita.ch, kama-plus.ch |
| STWE-Honorar CHF 350–500 je Einheit + Grundhonorar | belegt | hausinfo.ch, bawos.ch |
| 970'000 STWE-Einheiten, Ø 10 je Gemeinschaft | belegt, Sekundärquelle | Suchergebnis Mobiliar/hausinfo; Primärquelle BFS vor Investorengesprächen nachschlagen |
| 62,1 % der deutschen Verwaltungen überlastet | belegt | VDIV, 19.08.2026 |
| Kleine STWEG finden kaum Verwalter (CH) | belegt, nur Zusammenfassung gelesen | NZZ, 13.11.2025 |
| 90'667 KMU mit offener Nachfolge | belegt | Dun & Bradstreet, März 2025 |
| Wincasa: 1,08 × Umsatz | belegt | cash.ch |
| Buena: USD 25 Mio. Umsatz, 20+ Übernahmen | belegt (Firmenangabe) | Trending Topics, 23.07.2025 |
| EliseAI: USD 200 Mio. wiederkehrender Umsatz | belegt (Firmenangabe) | EliseAI, 10.06.2026 |
| mory.ai: 2 %, «KI erledigt 80 %» | Eigenwerbung des Mitbewerbers | mory.ai |
| Lohn Bewirtschafter Median CHF 84k–98k | belegt, Spannbreite | jobs.ch, lohncheck.ch |
| **Klassisch 400–450 Einheiten je Bewirtschafter** | **Annahme** | vor Investorengesprächen mit 3–5 Branchenkennern plausibilisieren |
| **Produktivität +40 % durch KI** | **Annahme, grösster Hebel auf die Marge** | nach 6 Monaten eigenen Betriebs messen |
| **Zusatzerträge 22 % des Grundhonorars** | **Annahme, konservativ** | eine Beispielfirma zeigt 50 % |
| **50 % der Mietwohnungen durch Dritte verwaltet** | **Annahme** | im Text mit 30 % gegengerechnet |
| **Kaufpreis ≈ 1,0 × Umsatz für Kleinverwaltungen** | **Annahme**, Anker Wincasa 1,08 | an echten Angeboten prüfen |
| Rechtshinweise (OR, UWG, MWSTG, GwG, revDSG) | nach bestem Wissen | **vor dem Start anwaltlich bestätigen**, Budget eingeplant |
| Marke, Domain, Firmenname «Hausklar» frei | **nicht geprüft** | Registerabfragen waren aus der Arbeitsumgebung gesperrt; Woche 41 |

Nicht erreichbar waren aus der Arbeitsumgebung: svit.ch, nzz.ch (nur Zusammenfassung), rdap.nic.ch.

## 3. Schwachstellen im Plan

1. **Die Kasse 2027 ist knapp.** Mit CHF 750'000 Eigenkapital bleiben Ende 2027 CHF 155'000. Regel:
   Die erste Übernahme wird erst unterschrieben, wenn nach Barzahlung noch mindestens drei
   Monatskosten (≈ CHF 220'000) in der Kasse bleiben; sonst höherer Verkäuferdarlehensanteil.
2. **2029 ist das engste Jahr.** Nettoverschuldung 3,3 × EBITDA; viele Banken gehen nur bis 2,5–3 ×.
   Ausweichen: Übernahme 2029 um sechs Monate schieben, Verkäuferdarlehen 40 % statt 30 %, oder
   kleine Zusatzrunde.
3. **Ohne erste Übernahme 2027 fällt der Umsatz 2027 auf rund CHF 0,14 Mio.** (Modell ohne
   Übernahmen). Übernahmen brauchen oft 6–12 Monate. Deshalb startet die Suche schon im Oktober 2026
   (Phase 0), und ab März 2027 laufen mindestens fünf Gespräche gleichzeitig.
4. **Die Marge 2031 (36 %) setzt die KI-Produktivität voraus.** Wirkt sie nur halb (Produktivität 480 statt 560
   Einheiten, Assistenzquote 0,5 statt 0,4), liegt die Marge 2031 bei **27 %** (nachgerechnet). Der Plan bleibt dann tragfähig, die Schulden werden langsamer abgebaut.
5. **Kundenbindung nach Übernahmen.** Wenn Eigentümer nach dem Verkauf in Scharen gehen, ist der
   Kaufpreis verloren. Absicherung: Earn-out 20 %, Verkäufer bleibt an Bord, Konditionen unverändert.
6. **Mitbewerber mit tieferem Preis** (mory.ai 2 %). Ein Preiskampf würde die Marge drücken. Hausklar
   verkauft deshalb über Betreuung und Region, nicht über den tiefsten Preis.
7. **Konservativ gerechnet:** Honorar auf Basis der landesweiten Durchschnittsmiete (in ZH/ZG höher);
   übernommene Mandate mit 3,4 % statt ihrer tatsächlichen ~4 % verbucht.

## 4. Risiken und Gegenmassnahmen

| Risiko | Wahrscheinlichkeit | Wirkung | Gegenmassnahme |
|---|---|---|---|
| Konflikt mit bisherigem Arbeitgeber | mittel | hoch | Entscheid 1 in 07; Anwalt; keine Kunden, Daten, Code übernehmen |
| Keine Übernahme 2027 | mittel | hoch | frühe Suche, 300 Adressen, Vermittler; organisches Wachstum trägt Betrieb |
| Finanzierungsrunde 2028 kommt nicht | mittel | hoch | Übernahmen stärker über Verkäuferdarlehen; Tempo auf «Vorsichtig» |
| Fehler der KI gegenüber Mietern | mittel | mittel | CHF-500-Grenze, Protokoll, Freigabe, Abschaltbarkeit je Haus |
| Haftungsfall (Frist verpasst, Zahlung falsch) | tief | hoch | Fristenwächter, Vier-Augen-Prinzip, Berufshaftpflicht |
| Datenschutzvorfall | tief | hoch | Hosting CH, Rechte je Rolle, Cyberversicherung |
| Fachkräfte finden | hoch | mittel | Beteiligung, weniger Routine, übernommene Teams |

## 5. Gesamturteil

Der Plan ist **rechnerisch konsistent** und die Marktannahmen sind überwiegend belegt. Die Sparte
hat einen grossen, fragmentierten Markt, dokumentierten Nachfragedruck und ein in Deutschland
bereits bewiesenes Modell. **Der Weg zu CHF 10 Mio. hängt zu knapp 60 % an Übernahmen** (Umsatz 2031 mit Übernahmen CHF 12,1 Mio., ohne CHF 5,1 Mio.). Ob er in
fünf oder sieben Jahren gelingt, entscheiden vor allem zwei Dinge, die heute niemand sicher weiss:
wie schnell sich verkaufswillige Verwaltungen finden lassen und wie viel Produktivität die KI im
Alltag wirklich bringt. Beides wird in den ersten 12 Monaten gemessen; danach wird der Plan mit
echten Zahlen nachgeführt.
