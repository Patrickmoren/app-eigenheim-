# Ideenfabrik Schweiz: 180 Bedürfnisse, 3 Pitches

Stand 25.09.2026. Rahmen: nur Schweiz, skalierbar, Start mit höchstens CHF 1'000, abends machbar,
kein Konflikt mit dem Job als Bewirtschafter.

## 1. Vorgehen

1. **Katalog:** 180 konkrete Bedürfnisse aus 78 Segmenten (Wohnen, Familie, Berufsbildung, Arbeit,
   Steuern, Gesundheit, Lebensereignisse, KMU, Gastro, Handwerk, Landwirtschaft, Energie, Behörden,
   Vereine u. a.), je mit einer Produktidee. Datei: [katalog.py](katalog.py), Tabelle: `katalog.csv`.
2. **Bewertung** mit sieben Kriterien, je 1–5, gewichtet auf 100 Punkte ([rangliste.py](rangliste.py)):

| Kriterium | Gewicht | Frage |
|---|---:|---|
| M Marktgrösse CH | 3 | Wie viel Umsatz ist in der Schweiz möglich? |
| Z Zahlungsbereitschaft | 3 | Wie gross ist der Schmerz, zahlt jemand? |
| S Selbstbedienung | 2 | Geht es ohne Verkaufsgespräche, also abends? |
| W Wettbewerb | 2 | Wie frei ist der Markt? |
| V Vorsprung | 2 | Schweizer Eigenheit oder Fachwissen, das Globale nicht haben |
| K Kapital/Regulierung | 2 | Ohne Bewilligung und Kapital machbar? |
| D Eingebauter Vertrieb | 2 | Suchvolumen, Weiterempfehlung, Partner |

3. **Marktprüfung:** Die 15 besten wurden gegen den echten Markt geprüft und der Wettbewerbswert
   korrigiert.

**Ehrlicher Vorbehalt:** Die Werte der 180 Ideen sind meine Einschätzung. Nur die Finalisten sind
recherchiert. Ein Katalog mit 10'000 Einträgen wäre möglich, bestünde aber zum grössten Teil aus
sinnlosen Kombinationen; 180 konkret formulierte Bedürfnisse decken die Schweizer Lebens- und
Geschäftswelt breiter ab als jede meiner früheren Runden.

## 2. Marktprüfung der Finalisten

| Idee | Befund | Wettbewerb neu |
|---|---|---:|
| Eignungstest-Trainer (Multicheck, Basic-Check) | MyMulti (Simulation CHF 95), gateway.one, pbl-Beratung, studypeak, sixpack ([berufswahl.zh.ch](https://berufswahl.zh.ch/berufswahlfahrplan/eignungstests/), [mymulti.ch](https://www.mymulti.ch/)) | 1 |
| Einbürgerungs-Trainer | viele Apps, u. a. für alle 26 Kantone und einzelne Kantone ([citizenshiptest.ch](https://citizenshiptest.ch/)) | 1 |
| KI-Tutor Allgemeinbildung (ABU) | Verlage liefern zur ABU-Reform 2026 eigene Plattformen mit KI-Tutor (Westermann «ABU heute», Verlag SKV) ([westermann-schweiz.ch](https://www.westermann-schweiz.ch/landing/abu/abu-heute)) | 2 |
| Prüfungstrainer Fachausweis/Diplom | Fachausweis.AI (seit 2025), fachausweis.app (HR), eFachausweis ([fachausweis.ai](https://fachausweis.ai/), [efachausweis.ch](https://efachausweis.ch/)) | 2 |
| Quellensteuer-Lotse | LedgerPeek, ClaroTax ([ledgerpeek.ch](https://ledgerpeek.ch/de-ch/get-your-tax-back/)) | 2 |
| **QV-Trainer für Lernende je Beruf** | nur vereinzelt: KFMV-Übungsserien (kaufmännisch), Electromind (Elektro). simpleclub deckt deutsche Ausbildungsberufe ab, nicht Schweizer Bildungspläne ([kfmv.ch](https://www.kfmv.ch/angebot/dienstleistungen/qv-uebungsserien), [heise](https://www.heise.de/hintergrund/Simpleclub-Kooperationen-fuer-die-berufliche-Bildung-als-neues-Kerngeschaeft-9304914.html)) | 3 |
| Nachmieter-Lotse | WONOMA; sonst nur Inserate ([wonoma.ch](https://www.wonoma.ch/nachmieterfinden)) | 3 |
| Nachlass-Lotse | LegacyNotes und SecureSafe für die Vorsorge zu Lebzeiten; für die Abwicklung nach dem Todesfall vor allem Checklisten von Banken und Beobachter ([beobachter.ch](https://www.beobachter.ch/beratung/ein-geliebter-mensch-stirbt-was-angehorige-nun-tun-konnen-354987)) | 3 |

## 3. Rangliste nach der Marktprüfung (Top 10)

| Punkte | Idee | M | Z | S | W | V | K | D |
|---:|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 82 | QV-Prüfungstrainer je Beruf (Lehrabschluss) | 4 | 4 | 5 | 3 | 4 | 5 | 4 |
| 81 | Nachmieter-Lotse (OR Art. 264) | 3 | 4 | 5 | 3 | 5 | 5 | 4 |
| 80 | Prüfungstrainer Höhere Berufsbildung | 3 | 5 | 5 | 2 | 4 | 5 | 4 |
| 80 | Prüfungstrainer KV-Weiterbildung | 3 | 5 | 5 | 3 | 3 | 5 | 4 |
| 79 | Nachlass-Lotse | 3 | 4 | 5 | 3 | 4 | 5 | 4 |
| 79 | Prüfungstrainer Technische Kaufleute | 2 | 5 | 5 | 4 | 3 | 5 | 4 |
| 79 | Prüfungstrainer Treuhand | 2 | 5 | 5 | 4 | 3 | 5 | 4 |
| 78 | Steuer-Optimierer (3a, Pensionskasse) | 4 | 4 | 5 | 2 | 3 | 5 | 4 |
| 78 | Prüfungstrainer Immobilien | 1 | 5 | 5 | 3 | 5 | 5 | 4 |
| 76 | Gymi-Prüfungstrainer | 3 | 4 | 5 | 2 | 4 | 5 | 4 |

**Muster:** Sechs der zehn besten Ideen sind Prüfungen der Schweizer Berufsbildung. Das ist kein
Zufall: Das duale System gibt es in dieser Form nur in der Schweiz, die Prüfungen entscheiden über
Beruf und Lohn, und globale Lernplattformen kennen die Schweizer Bildungspläne nicht.

---

## Pitch A · Prüfungstrainer für die Schweizer Berufsbildung (Empfehlung)

> **Bestehen statt zittern.** Ein KI-Lerncoach nach Schweizer Bildungsplan, von der Lehre bis zum
> Fachausweis.

**Problem.**
- Rund 72'000 Lernende stehen jedes Jahr vor dem Qualifikationsverfahren; 8,2 % fielen 2021 durch,
  in einzelnen Berufen 25–30 % ([Arbeitgeberverband](https://www.arbeitgeber.ch/bildung/berufliche-grundbildung/hohe-quote-bei-den-lehrabschluessen/), [SRF](https://www.srf.ch/radio-srf-1/lehrabschlusspruefungen-tiefe-erfolgsquoten-ueberfordern-wir-unsere-lehrlinge)).
  (72'000 ist abgeleitet: 5'889 Durchgefallene entsprechen 8,2 %.)
- Rund 17'500 Personen bestehen jährlich eine eidgenössische Berufsprüfung oder höhere Fachprüfung,
  bei rund 420 verschiedenen Prüfungen ([SBFI](https://www.sbfi.admin.ch/sbfi/de/home/bildung/bwb/hbb/eidgenoessische-pruefungen.html)).
  Die Erfolgsquoten liegen oft bei 60–70 %, beim Fachausweis Immobilienbewirtschaftung 2024 bei 68,2 %
  ([SFPKIW](https://www.sfpkiw.ch/deutsch/erfolgsquoten-pruefungen/)).
- Wer durchfällt, verliert ein Jahr, Lohn und oft mehrere Tausend Franken Kursgeld.

**Produkt.**
1. Lernpfad je Beruf und Prüfung, aufgebaut auf dem öffentlichen Bildungsplan bzw. der Wegleitung.
2. Tägliche 10-Minuten-Übungen, Prüfungssimulation im Format der echten Prüfung, KI-Feedback auf
   eigene Antworten (auch Fallstudien und mündliche Prüfung per Sprache).
3. Deutsch, Französisch, Italienisch.
4. Für Lehrbetriebe: Lizenzen je Lernende/n mit Fortschrittsübersicht für Berufsbildner.
5. Später durchgehend: Lehre → Berufsmatura → Fachausweis → Diplom. Ein Kunde über Jahre.

**Wer zahlt.**
- Lernende oder Eltern: CHF 79 pro QV-Saison.
- Lehrbetriebe: CHF 10 pro Lernende/n und Monat. Dass Betriebe dafür zahlen, belegt simpleclub in
  Deutschland mit rund 250 Firmenkunden, darunter Deutsche Bahn ([heise](https://www.heise.de/hintergrund/Simpleclub-Kooperationen-fuer-die-berufliche-Bildung-als-neues-Kerngeschaeft-9304914.html)).
- Weiterbildung: CHF 190–390 pro Prüfung.

**Grösse, ehrlich gerechnet.**
| Baustein | Rechnung | Umsatz/Jahr |
|---|---|---:|
| Lernende direkt | 72'000 × 25 % × CHF 79 | CHF 1,4 Mio. |
| Lehrbetriebe | 40'000 Lernende × CHF 120 | CHF 4,8 Mio. |
| Höhere Berufsbildung | 25'000 Kandidaten (Annahme) × 20 % × CHF 290 | CHF 1,5 Mio. |
| **Total bei starker Stellung** | | **rund CHF 7,7 Mio.** |

CHF 10 Mio. allein in der Schweiz verlangen, dass auch Berufsmaturität, Sprachprüfungen oder die
Schulen dazukommen. Die Zahl der Lernenden wächst: Eintritte in Lehren mit EFZ sollen bis 2033 um 10 %
steigen ([transfer.vet](https://transfer.vet/so-waechst-die-berufsbildung-in-den-naechsten-jahren/)).

**Warum es zu dir passt.** Kein Konflikt mit dem Arbeitgeber. Du kennst den Weg selbst (Lehre,
Fachausweis). Start mit CHF 1'000: KI erstellt Übungen, Fachleute je Beruf prüfen sie.

**Wettbewerb und Abgrenzung.** Allgemeinbildung (ABU) machen die Verlage selbst, dort nicht
angreifen. Für die Fachausweise gibt es erste KI-Anbieter. Für den **Berufskundeteil des
Lehrabschlusses je Beruf** ist das Feld weitgehend offen.

**Risiken.**
- **Inhalt ist die Hauptarbeit, nicht Software.** Jede Übung muss fachlich stimmen; das braucht
  pro Beruf eine Fachperson (Berufsbildner, Lehrperson) gegen Honorar oder Beteiligung.
- Urheberrecht: keine Lehrmittel oder alten Prüfungen kopieren, ausser mit Lizenz. Bildungspläne
  und Wegleitungen sind öffentlich und dürfen als Grundlage dienen.
- Datenschutz bei Minderjährigen: Einwilligung, sparsame Daten.

**Erster Schritt.** Drei grosse Berufe auswählen, bei denen es wenig Angebot gibt (Kandidaten:
Fachfrau/Fachmann Gesundheit, Detailhandelsfachleute, Logistiker/in; Kaufleute nicht, dort sind
Verband und Verlage stark). Testseite für Lernende, Eltern und Berufsbildner.

---

## Pitch B · Nachmieter-Lotse

> **Früher raus, ohne doppelte Miete.**

Siehe [../15-ideen-3-pitches.md](../15-ideen-3-pitches.md), Pitch A. Kurz: Mieter, die ausserhalb
der Kündigungstermine ausziehen, zahlen weiter, bis die Verwaltung einen Ersatzmieter akzeptiert
(OR Art. 264). Das Tool sammelt und prüft Dossiers und reicht sie vollständig ein. CHF 39–49 pro Fall
plus Partnerprovisionen. **Obergrenze Schweiz CHF 2–5 Mio.** Schnellstes Geld, dein Fachwissen
ist direkt nutzbar, kaum Konflikt mit dem Job.

---

## Pitch C · Nachlass-Lotse

> **Alles erledigt, was nach einem Todesfall zu tun ist, Schritt für Schritt.**

**Problem.** Nach einem Todesfall müssen Angehörige in kurzer Zeit Dutzende Stellen informieren:
Zivilstandsamt, Testament einreichen, Erbschein, Banken, Versicherungen, AHV, Pensionskasse,
Steuererklärung per Todestag, Mietvertrag, Abos, digitale Konten
([Beobachter](https://www.beobachter.ch/beratung/ein-geliebter-mensch-stirbt-was-angehorige-nun-tun-konnen-354987)).
Heute gibt es dafür vor allem Checklisten; persönliche Beratung kostet rasch CHF 900 und mehr.

**Produkt.** Geführte Liste nach Kanton und Situation, Musterbriefe für jede Stelle, Fristen,
Dokumentenablage für alle Erben, Übersicht über Konten und Verträge, Übergabe an Notar oder Anwalt
wo nötig.

**Wer zahlt.** Die Erben, einmalig CHF 49–149. Partner: Bestattungsinstitute, Banken und Notariate
empfehlen es weiter.

**Grösse.** Rund 70'000–75'000 Todesfälle pro Jahr in der Schweiz (Grössenordnung BFS, vor Start
prüfen). Mit 15 % Nutzung zu CHF 99: **rund CHF 1 Mio. pro Jahr.** Mehr nur mit Vorsorge zu
Lebzeiten (Testament, Vorsorgeauftrag), wo es schon Anbieter gibt.

**Risiko.** Heikler Moment für Werbung; Vertrieb läuft über Partner und Google, nicht über Anzeigen,
die Trauernde bedrängen.

---

## 4. Empfehlung

**Pitch A**, weil er als einziger alle Vorgaben erfüllt und in der Schweiz Richtung CHF 8–10 Mio.
reicht. Der Weg dahin ist aber Inhaltsarbeit mit Fachleuten, nicht nur Software. B ist die schnelle,
kleinere Alternative mit deinem Fachwissen, C ein solides Nischengeschäft.

**Vorschlag für den Test (zwei Wochen, unter CHF 200):** Eine Testseite für den QV-Trainer in
drei Berufen mit Preis und Warteliste, zusätzlich zehn Gespräche mit Berufsbildnerinnen und
Berufsbildnern aus deinem Umfeld: Würden sie CHF 10 pro Lernende/n und Monat zahlen?
