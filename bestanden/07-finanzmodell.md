# 07 · Finanzmodell

Dateien in [`finanzmodell/`](finanzmodell/):

| Datei | Inhalt |
|---|---|
| `Finanzmodell-bestanden.xlsx` | Arbeitsmappe: Übersicht, Annahmen (blau = Eingabe), drei Modellblätter, Zielrechnung CHF 7–10 Mio. |
| `annahmen.py` | alle Eingaben mit Quelle; daraus wird die Arbeitsmappe gebaut |
| `build.py` | baut die Arbeitsmappe (`python3 build.py`) |
| `auswerten.py` | rechnet alle Formeln nach und zeigt die Übersicht |
| `rechenprobe.py` | rechnet die drei Szenarien unabhängig in Python nach und vergleicht: **alle Werte stimmen überein** |
| `sensitivitaet.py` | ändert je eine Annahme im Basisszenario |

Alle Beträge in CHF, ohne MWST, ohne Steuern und ohne Fremdkapital. Jahr 2027 = erstes Verkaufsjahr.

## 1. Die wichtigsten Annahmen

| Annahme | Vorsichtig | Basis | Wachstum | Status |
|---|---|---|---|---|
| Lernende in abgedeckten Berufen 2027 → 2031 | 2'000 → 28'000 | 2'500 → 60'000 | 4'000 → 100'000 | Plan; Obergrenze 215'052 |
| Berufe live 2027 → 2031 | 1 → 8 | 1 → 14 | 2 → 24 | Plan |
| Anteil Lernende mit Betriebslizenz 2027 → 2031 | 3 → 10 % | 4 → 18 % | 5 → 26 % | **Hypothese** |
| Lernende je Lehrbetrieb | 2,0 | 2,5 | 3,0 | Hypothese |
| Kündigungsrate Lehrbetriebe | 25 % | 18 % | 12 % | Hypothese |
| Ø Preis je lizenzierte/r Lernende/r | 90–100 | 100–110 | 100–115 | Liste 120 minus Rabatte |
| Akquisekosten je neuer Betrieb | 80 → 350 | 60 → 200 | 60 → 150 | Hypothese |
| Kaufquote QV-Pass (Kandidaten ohne Lizenz) | 1,5 → 3 % | 2 → 5 % | 3 → 7 % | Hypothese |
| Preis QV-Pass | 59 | 59 | 59 | Vorschlag |
| Verbandslizenzen (à CHF 25'000) 2031 | 1 | 3 | 6 | Hypothese |
| KI-Kosten je aktive/r Nutzer/in | 3 | 3 | 3 | gerechnet (05-ki-konzept.md) |
| Angestellte (FTE) 2031 | 1,5 | 5,5 | 11 | Plan, erst nach Gates |
| Inhalte je neuer Beruf | 4'000 (2027) bis 20'000 | 4'000 bis 18'000 | 4'000 bis 18'000 | Schätzung |

## 2. Ergebnisse

| | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---:|---:|---:|---:|---:|
| **Vorsichtig** | | | | | |
| Lernende mit Betriebslizenz | 60 | 250 | 700 | 1'620 | 2'800 |
| Lehrbetriebe | 30 | 125 | 350 | 810 | 1'400 |
| B2C-Käufer/innen | 9 | 30 | 74 | 157 | 242 |
| Umsatz | 5'949 | 25'544 | 74'390 | 196'278 | 319'273 |
| Variable Kosten | 277 | 1'112 | 3'078 | 7'276 | 12'198 |
| Personal | 0 | 0 | 33'000 | 88'000 | 165'000 |
| Inhalte | 4'000 | 19'000 | 48'000 | 56'000 | 64'000 |
| Technologie | 600 | 2'400 | 6'000 | 10'000 | 15'000 |
| Marketing und Vertrieb | 2'830 | 39'301 | 100'729 | 213'826 | 310'762 |
| Administration | 1'200 | 5'000 | 10'000 | 20'000 | 30'000 |
| **Operatives Ergebnis** | −2'958 | −41'269 | −126'418 | −198'825 | −277'687 |
| Kasse Ende Jahr (Start CHF 1'000) | −1'958 | −43'227 | −169'645 | −368'470 | −646'157 |
| **Basis** | | | | | |
| Lernende mit Betriebslizenz | 100 | 630 | 2'420 | 6'000 | 10'800 |
| Lehrbetriebe | 40 | 252 | 968 | 2'400 | 4'320 |
| B2C-Käufer/innen | 15 | 80 | 251 | 490 | 787 |
| Umsatz | 10'906 | 70'891 | 305'987 | 738'886 | 1'309'445 |
| Variable Kosten | 471 | 2'890 | 11'091 | 26'514 | 46'958 |
| Personal | 0 | 0 | 110'000 | 330'000 | 605'000 |
| Inhalte | 4'000 | 34'000 | 66'000 | 96'000 | 112'000 |
| Technologie | 600 | 3'000 | 8'000 | 15'000 | 25'000 |
| Marketing und Vertrieb | 3'038 | 63'523 | 212'596 | 397'779 | 537'485 |
| Administration | 1'500 | 6'000 | 15'000 | 30'000 | 50'000 |
| **Operatives Ergebnis** | 1'297 | −38'522 | −116'700 | −156'407 | −66'998 |
| Kasse Ende Jahr | 2'297 | −36'225 | −152'925 | −309'332 | −376'330 |
| **Wachstum** | | | | | |
| Lernende mit Betriebslizenz | 200 | 1'500 | 5'250 | 13'650 | 26'000 |
| Lehrbetriebe | 67 | 500 | 1'750 | 4'550 | 8'667 |
| B2C-Käufer/innen | 36 | 173 | 476 | 986 | 1'658 |
| Umsatz | 22'152 | 200'195 | 681'834 | 1'727'919 | 3'237'798 |
| Variable Kosten | 979 | 7'084 | 23'837 | 60'025 | 112'482 |
| Personal | 0 | 55'000 | 330'000 | 770'000 | 1'210'000 |
| Inhalte | 8'000 | 53'000 | 128'000 | 152'000 | 194'000 |
| Technologie | 800 | 5'000 | 15'000 | 30'000 | 50'000 |
| Marketing und Vertrieb | 5'019 | 104'303 | 278'656 | 557'516 | 809'346 |
| Administration | 1'500 | 10'000 | 25'000 | 50'000 | 80'000 |
| **Operatives Ergebnis** | 5'854 | −34'193 | −118'659 | 108'379 | 781'971 |
| Kasse Ende Jahr | 6'854 | −27'339 | −145'998 | −37'619 | 744'351 |

| | Vorsichtig | Basis | Wachstum |
|---|---:|---:|---:|
| Finanzierungsbedarf bis 2031 | 646'157 | 376'330 | 145'998 |
| Dauerhaft positives Ergebnis ab | nach 2031 | nach 2031 | 2030 |
| Marktanteil 2031 (lizenzierte Lernende an allen Lernenden CH) | 1,3 % | 5,0 % | 12,1 % |
| Anteil B2B am Umsatz 2031 | 96 % | 97 % | 97 % |
| LTV : Akquisekosten je Betrieb (2031) | 2,2 | 7,4 | 18,5 |

## 3. Was das Modell sagt

1. **Das Geschäft lebt von den Lehrbetrieben.** B2C bleibt in allen Szenarien unter 5 % des Umsatzes.
2. **Die variablen Kosten sind klein** (rund 4 %). KI ist kein Kostenproblem.
3. **Die Kosten sind Personal und Vertrieb.** Wer kleine Betriebe einzeln gewinnt, zahlt viel pro Kunde.
   Der Hebel ist der Verband.
4. **Mit CHF 1'000 Startkapital geht nur 2027.** Das ist gewollt: Bis Gate 4 (Betriebe zahlen) wird kein
   Geld von aussen gebraucht und keines riskiert.
5. **Im Vorsichtig-Szenario stoppt man.** Die Gates verhindern den Verlust, den das Blatt zeigt.
6. **Im Basisszenario ist das Wachstum der Grund für den Verlust.** Ohne weiteres Wachstum ergibt die
   Kostenstruktur 2031 rund CHF +300'000.

## 4. Was am stärksten wirkt (Basisszenario)

`python3 finanzmodell/sensitivitaet.py`

| Fall | Umsatz 2031 | Ergebnis 2031 | Finanzierungsbedarf bis 2031 |
|---|---:|---:|---:|
| Basis wie im Modell | 1'309'445 | −66'998 | 376'330 |
| Preis B2B −30 % | 953'045 | −419'834 | 1'026'864 |
| Akquisekosten je Betrieb +50 % | 1'309'445 | −302'198 | 911'987 |
| Kündigungsrate 25 % statt 18 % | 1'309'445 | −100'598 | 429'948 |
| Anteil lizenzierte Lernende −30 % | 956'103 | −267'714 | 685'443 |
| Lernende je Betrieb 2,0 statt 2,5 | 1'309'445 | −184'598 | 644'159 |
| KI-Kosten × 3 | 1'309'445 | −110'601 | 457'889 |
| Personal −30 % | 1'309'445 | 114'502 | 177'332 |

**Die zwei Zahlen, die der Pilot messen muss:** der Preis, den Betriebe wirklich zahlen, und die Kosten,
einen Betrieb zu gewinnen. Beide sind heute Hypothesen und entscheiden über den Finanzierungsbedarf.

## 5. Kosten nach Budgetstufe

| Budget | Was es kauft | Wann |
|---|---|---|
| **CHF 300** | Domain (~CHF 15/Jahr), Hosting im Pilot (~CHF 10–20/Monat), KI im Pilot (~USD 20/Monat), Gutscheine für 5 Interviews | Woche 1–12 |
| **CHF 1'000** | dazu: erste Stunden der Fachperson (~8 h), Druck von Flyern für Betriebe, Betriebshaftpflicht prüfen | bis Pilotstart |
| **CHF 10'000** | Fachprüfung für den ersten Beruf (~50 h), einmalige Rechtsprüfung AGB und Datenschutz, Grafiken und Fotos, erster Auftritt an einem Verbandsanlass | 2027, aus Vorauszahlungen der Betriebe |
| **CHF 50'000** | zweiter Beruf (Heizung), Teilzeit-Vertrieb oder -Entwicklung, Datenschutz-Folgenabschätzung durch Fachperson | nach Gate 4 |
| **CHF 100'000+** | Team (1–2 Stellen), weitere Berufe, Französisch | nach Gate 7, mit Finanzierung |

Details und Team in [14-kosten-und-team.md](14-kosten-und-team.md).
