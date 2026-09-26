# Prototyp – Fristenwächter

**Zweck:** Konkreter, klickbarer Gegenbeweis zum Einwand «Verwaltungen können Prüf- und
Wartungsfristen doch super einfach im CRM abbilden» (siehe
`docs/geschaeftsmodell-analyse-chf20k.md`, Abschnitt «Moat / Wettbewerbsvorteil»). Der Prototyp
zeigt funktional, was ein generisches Datumsfeld in einem CRM nicht mitbringt:

1. **Normfristen-Regel-Engine statt Datumsfeld pro Zeile** – Prüfintervalle sind zentral im
   Regelwerk hinterlegt. Ein einziger Wert ändern (`Regelwerk & Fristen`) und die Fälligkeit
   *jeder* betroffenen Anlage im ganzen Portfolio wird sofort neu berechnet.
2. **Externer Zugang ohne Seat** – Fachfirmen (Aufzugsprüfer, Kaminfeger, Elektriker) reichen
   Prüfnachweise über einen eigenen, passwortlosen Portal-Bereich ein und sehen dabei
   ausschliesslich ihre eigenen zugewiesenen Aufträge, nichts sonst vom Mandat der Verwaltung.
3. **Audit-taugliches Reporting auf Knopfdruck** – ein formatierter Prüfhistorie-Report pro
   Objekt, geeignet zur Vorlage an der Eigentümerversammlung, statt manuellem Excel-Export.

`fristenwaechter.html` ist der lauffähige Klickdummy mit Beispieldaten (5 Liegenschaften,
23 Anlagen, 4 Fachfirmen).

Veröffentlicht als Artifact: https://claude.ai/artifact/B4qw83GZzgT65TuqrjLfAY

## Was er enthält

| Bereich | Umsetzung |
|---|---|
| Übersicht | Kennzahlen (überfällig / bald fällig / in Ordnung / aktive Fachfirmen), Ampel-Aufgabenliste nach Dringlichkeit über das ganze Portfolio |
| Objekte | Kachelübersicht aller Liegenschaften mit Ampel-Status, Objekt-Detail mit vollständiger Anlagenliste |
| Fachfirmen | Übersicht aller angebundenen Prüf-/Wartungsfirmen, Zuweisung, «Zugangslink kopieren» |
| Regelwerk & Fristen | Editierbare Normfristen-Engine – Änderung wirkt live auf alle betroffenen Anlagen |
| Berichte | Objektbezogener Prüfhistorie-Report, formatiert für Eigentümerversammlungen, als Text kopierbar |
| Fachfirmen-Portal | Zweite Rolle (oben rechts wechselbar) ohne Rail-Navigation: Auftragsliste einer Fachfirma, Formular zur Nachweiseinreichung (Datei, Prüfdatum, Ergebnis, Bemerkung), automatische Fristen-Neuberechnung nach Einreichung |

## Rollen

Oben rechts wird zwischen zwei Ansichten gewechselt – im Prototyp ohne Login, damit sich beide
Seiten des Produkts direkt vergleichen lassen:

| Ansicht | Zeigt |
|---|---|
| **Verwaltung — Muster Verwaltung AG** | Vollständige App: Übersicht, Objekte, Fachfirmen, Regelwerk, Berichte |
| **Fachfirma (Demo-Zugang ohne Login)** | Nur die offenen Prüfaufträge von «Muster Prüftechnik AG», visuell bewusst abgesetzt (eigene Farbwelt), kein Zugriff auf übrige Verwaltungsdaten |

## Normfristen-Engine

Jede Anlage referenziert nur ihren Typ (`typ`); Intervall, Norm-Referenz und kantonale Varianz
stehen ausschliesslich im `REGELWERK`-Array. `faelligkeit(a)` berechnet die nächste Fälligkeit
immer aus `letztePruefung + REGELWERK[typ].intervallMt`, nie aus einem pro Anlage gepflegten
Wert. Wer das im Prototyp unter «Regelwerk & Fristen» ausprobieren möchte: Intervall ändern,
Tab drücken – die Zähler in der Übersicht springen sofort um.

Die hinterlegten Intervalle (Feuerlöscher 24 Mt., Aufzug 24 Mt., Elektroinstallation 120 Mt.,
Heizung/Cheminée 12 Mt., Trinkwasser 12 Mt., Blitzschutz 48 Mt.) sind illustrativ und an
öffentlich bekannten Grössenordnungen orientiert, nicht als Rechtsauskunft zu verstehen – im
echten Produkt müsste das Regelwerk kantonal differenziert und mit einer Fachperson
verifiziert werden.

## Technische Hinweise

- Eine Datei, keine Abhängigkeiten ausser Google Fonts (mit Fallback-Schriften). Design und
  Komponenten (Farbtoken, Karten, Chips, Tabellen) folgen bewusst demselben System wie
  `leerstandsmanager.html`, um einen konsistenten Werkzeugkasten für diese Art Prototyp zu haben.
- Die Datei ist im Artifact-Format geschrieben (ohne `<!doctype>`, `<html>`, `<head>`, `<body>`).
  `./build-standalone.sh fristenwaechter.html Fristenwaechter.html` erzeugt eine lokal per
  Doppelklick öffenbare Version mit der nötigen Hülle. Die erzeugte Datei wird nicht mitversioniert.
- Alle Prüf- und Fälligkeitsdaten sind relativ zum aktuellen Datum erzeugt, damit die
  Ampel-Verteilung (überfällig/bald fällig/in Ordnung) an jedem Tag realistisch bleibt.
- Zustand ist rein clientseitig im Arbeitsspeicher (kein `localStorage`, kein Server) – ein
  Neuladen setzt die Demodaten zurück.

## Bekannte Grenzen des Prototyps

Kein echter Datei-Upload (das Dateifeld liest nur den Dateinamen aus, ohne Speicherung), kein
Login, kein Mandantenmodell, keine kantonale Differenzierung des Regelwerks, kein PDF-Export
(Report ist als formatierter Text kopierbar). Diese Punkte gehören in eine echte technische
Umsetzung, nicht in den Klickdummy – siehe `docs/geschaeftsmodell-analyse-chf20k.md`,
Abschnitt 13 «MVP» und Abschnitt 14 «Technologie».
