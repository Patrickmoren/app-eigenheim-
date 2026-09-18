# Makler-Handbuch Hausverkauf Schweiz

Vollständiger Verkaufsprozess für den Verkauf eines Hauses in der Schweiz, aufgebaut als
internes Makler-Handbuch mit den dazugehörigen Checklisten, Formularen und Vorlagen.
Ziel ist, dass eine neue Mitarbeiterin oder ein neuer Mitarbeiter einen Hausverkauf damit
Schritt für Schritt durchführen kann, ohne einen Prozessschritt oder eine Unterlage zu vergessen.

Stand der Fassung: **18. September 2026**, Version 1.

## Dateien

| Datei | Inhalt | Grundlage im Handbuch |
|---|---|---|
| `01_Maklerhandbuch_Hausverkauf.pdf` | Das Handbuch, 264 Seiten | Teile A–W |
| `01_Maklerhandbuch_Hausverkauf.docx` | Dasselbe als Bearbeitungsformat | Teile A–W |
| `02_Makler_Checklisten.xlsx` | Phasen, Abschlusskriterien, Aufgaben, Dokumente A–E, Vermarktung, Rechtsregister | Teile B, C, J, W |
| `03_Makler_Formulare.docx` | Formulare F1–F9 zum Ausfüllen | Teile D, L, M, N, O, P, Q |
| `04_Verkaufsdossier_Vorlage.docx` | Verkaufsdossier, 23 Abschnitte als Platzhaltervorlage | Teil H |
| `05_Kommunikationsvorlagen.docx` | 20 E-Mail- und Gesprächsvorlagen K1–K20 | Teil T |
| `06_Interessentenmanagement.xlsx` | CRM-Liste, Besichtigungsjournal, Angebote, Controlling-Dashboard | Teile K, U |
| `07_Objektaufnahme.xlsx` | Objektaufnahme in 16 Blöcken mit 182 Feldern, Raumliste, Mängelliste | Teil E |
| `08_Bewertung_Vorlage.xlsx` | Vergleichswert, Realwert, Ertragswert, Sanierungsbedarf, Wertspanne, Nettoerlös | Teil F |
| `09_Verkaeufer_Abschlusscheckliste.xlsx` | Abschlusscheckliste mit 65 Positionen, Kennzahlen, Übergabe | Teil R |

## Aufbau des Handbuchs

* **Teil A** Überblick, sieben Rollen mit Zuständigkeiten und Nicht-Zuständigkeiten,
  Kennzeichnungssystem, Gesamtübersicht, kantonale Klärungsliste
* **Teil B** die 20 Phasen – je mit Ziel, Aufgaben des Maklers, Aufgaben des Eigentümers,
  benötigten Unterlagen, Prüfungen, Kommunikation, Meilenstein und verbindlichen
  Abschlusskriterien
* **Teile C–W** die Werkzeuge, auf die die Phasen verweisen: Dokumenten-Checkliste,
  Erstgesprächsleitfaden mit Strategieableitung, Objektaufnahme, Bewertung, Maklermandat,
  Verkaufsdossier, Inserat, Fotografie, CRM, Besichtigung, Kaufangebot, Verhandlung,
  Reservation, Notariat, Übergabeprotokoll, Abschlusscheckliste, Ordnerstruktur,
  Kommunikationsvorlagen, Controlling, Prozessflow, Rechtsgrundlagen-Register

## Kennzeichen

Rückmeldungen bitte unter Angabe der Kennung, damit sie eindeutig zuzuordnen sind:

| Kennung | Bedeutung |
|---|---|
| `Phase 1`–`Phase 20` | Phasen in Teil B |
| `A1`–`E12` | Positionen der Dokumenten-Checkliste in Teil C |
| `R1`–`R41` | Rechtsgrundlagen-Register in Teil W |
| `K1`–`K20` | Kommunikationsvorlagen |
| `F1`–`F9` | Formulare |
| `[RP]` | Rechtliche Prüfung durch Notariat / Rechtsberatung erforderlich |
| `[KA]` | Kantonal unterschiedlich, vor Mandatsbeginn abzuklären |
| `[GW]` | Geldwäschereirechtlich relevant |

28 `[RP]`-, 15 `[KA]`- und 2 `[GW]`-Positionen sind im Register ausgewiesen.

## Vor dem produktiven Einsatz zu klären

Das Handbuch nennt zu jedem rechtlich relevanten Punkt die Rechtsgrundlage, erfindet aber
keine. Drei Punkte sind vor dem Einsatz durch die Rechtsabteilung zu bestätigen:

1. **Vertrags- und Reservationsvorlagen.** Teil G (Maklermandat), Teil O (Reservation),
   Formular F4 (Kaufangebot) und F7 (Reservationsbestätigung) sind Strukturvorgaben, keine
   freigegebenen Vertragstexte. Sie sind vor der ersten Verwendung juristisch zu prüfen.
2. **Geldwäschereirecht.** Die Teilrevision des GwG tritt am 1. Oktober 2026 in Kraft und
   unterstellt die berufsmässige Mitwirkung an Immobilientransaktionen erstmals dem Gesetz
   (Art. 2 Abs. 3bis und 3ter revGwG). Der konkrete Pflichtenumfang, die Frist für den
   Anschluss an eine Selbstregulierungsorganisation, das interne Weisungswesen und die
   Aufbewahrungsvorgaben sind durch die Rechtsabteilung und die SRO zu bestätigen. Die
   Darstellung in Teil W1 beruht auf öffentlich zugänglichen Fachpublikationen, nicht auf
   der Verordnung im Wortlaut.
3. **Kantonale Angaben.** Notariatssystem, Handänderungssteuer, Grundstückgewinnsteuer und
   ihre Sicherstellung, GEAK-Pflicht, Nutzungskennzahlen und Formerfordernisse für
   Vollmachten sind kantonal geregelt. Die Klärungsliste in Abschnitt A6 ist je Kanton
   einmal auszufüllen und jährlich zu überprüfen. Im Handbuch stehen dazu keine Zahlen.

## Erzeugung

```
npm install
node build.js
```

Alle zehn Dateien werden aus den Textquellen in `inhalt/` erzeugt und **nicht von Hand
bearbeitet** – Rückmeldungen fliessen in die Quelle zurück, damit die Nummerierung über
alle Fassungen stabil bleibt. Das gilt auch für das PDF: es wird direkt gesetzt, nicht aus
dem Word-Dokument konvertiert.

### Aufbau des Verzeichnisses

| Datei | Inhalt |
|---|---|
| `build.js` | Orchestrator, erzeugt alle zehn Dateien |
| `lib/blocks.js` | renderer-unabhängige Inhaltsbausteine |
| `lib/render-docx.js` | Bausteine → `.docx` |
| `lib/render-pdf.js` | Bausteine → `.pdf`, eigene Satzlogik mit Tabellenumbruch |
| `lib/stil.js` | Hausstil der Word-Dokumente, Farben aus `docs/prozesse` |
| `lib/tabellen.js` | Hausstil der Arbeitsmappen, Auswahllisten, Zellbezüge |
| `inhalt/phasen.js` | die 20 Phasen |
| `inhalt/dokumente.js` | Dokumenten-Checkliste, 92 Positionen in den Gruppen A–E |
| `inhalt/recht.js` | Rechtsgrundlagen-Register, 41 Positionen |
| `inhalt/objektaufnahme.js` | Objektaufnahme, 16 Blöcke mit 182 Feldern |
| `inhalt/bewertung.js` | Bewertungsverfahren und Rechenschema |
| `inhalt/bausteine.js` | Mandat, Dossier, Inserat, Fotografie, CRM, Controlling, Ordner |
| `inhalt/formulare.js` | Erstgesprächsleitfaden, Strategieableitung, Formulare F1–F9 |
| `inhalt/kommunikation.js` | Vorlagen K1–K20 |
| `inhalt/abschluss.js` | Abschlusscheckliste, 65 Positionen |
| `inhalt/handbuch.js` | setzt Datei 01 zusammen |
| `inhalt/dok-*.js` | setzen die Dateien 03, 04 und 05 zusammen |
| `inhalt/mappen.js` | setzt die Arbeitsmappen 02 und 06–09 zusammen |

Jeder Inhalt steht genau einmal in der Quelle: die Phasen erscheinen im Handbuch und in
der Checklistenmappe, die Dokumentenliste in beiden, die Objektaufnahme im Handbuch und in
Mappe 07 – erzeugt jeweils aus derselben Datei. Die Querverweise zwischen Phasen, Register,
Vorlagen und Formularen werden beim Bauen geprüft.

## Quellen

Die Rechtsgrundlagen sind in Teil W des Handbuchs einzeln mit Fundstelle aufgeführt
(OR, ZGB, StHG, MWSTG, GwG, BewG, ZWG, BGBB, RPG, USG, AltlV, StSV, DSG sowie die
Selbstregulierung der Schweizerischen Bankiervereinigung). Abschnitt W2 nennt die am
18. September 2026 konsultierten Quellen. Gesetzestexte sind über die Systematische
Rechtssammlung des Bundes zu verifizieren; die aufgeführten Fachpublikationen ersetzen die
Konsultation der Primärquellen nicht.
