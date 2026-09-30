# Schaeppi Factsheet-Generator

KI-gestützter Dokumentengenerator: Aus wenigen erfassten Immobilienfakten entsteht ein
**maximal zweiseitiges Verkaufs-Factsheet im Schaeppi-Design als bearbeitbare Word-Datei (.docx)** –
optional mit einer standardisierten **Geheimhaltungsverpflichtung (.docx)**. Das Tool ist kein
Chatbot: Der Benutzer liefert Daten, das System erstellt die Unterlage.

Beispiel-Ergebnis (Neumattstrasse 15, 4227 Büsserach, nur Angaben aus der Verkaufsdokumentation):
[`examples/neumattstrasse-15/ausgabe/`](examples/neumattstrasse-15/ausgabe/) – Factsheet und NDA je als DOCX und PDF.

## Starten

```bash
cd factsheet
npm install
npm start                      # http://127.0.0.1:3000
```

| Variable | Wirkung |
|---|---|
| `ANTHROPIC_API_KEY` | aktiviert KI-Texte (Claude). Ohne Schlüssel: regelbasierte, sachliche Texte aus den Fakten |
| `AI_MODEL` | Modell, Standard `claude-opus-5-5` |
| `AI_EFFORT` | Denktiefe `low` … `max`, Standard `medium` |
| `AI_PROVIDER` | `anthropic` oder `offline` (erzwingt die regelbasierten Texte) |
| `PORT`, `HOST` | Standard `3000`, `127.0.0.1` (nur lokal erreichbar) |
| `SOFFICE_PATH`, `RENDER_CHECK=off` | Pfad zu LibreOffice bzw. Gegenprüfung abschalten |

Ohne Oberfläche: `npm run beispiel -- examples/neumattstrasse-15 --pdf` erzeugt Factsheet, NDA
und PDF-Kontrollansichten in `ausgabe/`. Tests: `npm test` (42 Tests, inkl. LibreOffice-Seitenprüfung,
falls installiert).

## Ablauf für den Anwender

1. **Neues Objekt** (oder «Beispiel laden» / «Projekt öffnen»)
2. **Basisdaten** – Objekt, Einheiten, Parkierung, Ansprechpartner (Pflichtfelder mit *)
3. **Details** – alles optional: Finanzen, Grundstück/Rechtliches, Investitionen, Vermarktungsargumente, Verkaufsprozess
4. **Bilder** – Titelbild, Objektfoto, Lagefoto, Grundriss (optional, feste Positionen)
5. **Texte** – «KI-Inhalte erstellen»; jeder Text ist bearbeitbar, die Vorschau aktualisiert sich sofort.
   Ein Klick auf einen Text in der Vorschau springt ins zugehörige Feld.
6. **Export** – «Factsheet erstellen (.docx)», optional «NDA erstellen»

Die Vorschau zeigt laufend Seite 1/2 und 2/2 und darunter den Prüfbericht (Fehler, Hinweise,
angewandte Verdichtung). Projekte lassen sich als JSON speichern und wieder öffnen (inkl. Bilder
und bearbeiteter Texte); der Browser sichert den Stand zusätzlich automatisch.

## Phase 1 – Analyse der Referenz und Design-System

Grundlage: «Verkaufsdokumentation Neumattstrasse 15, 4227 Büsserach» (InDesign, 12 Seiten).

| Element | Befund in der Referenz | Umsetzung im Factsheet |
|---|---|---|
| Farben | Navy `#1B3F64` (Flächen, Titel), Crème `#F9F9F1` (helle Flächen), Logo-Blau `#1A9EDA`, Text `#231F20`, Grau `#585857` | identisch, als Tokens in `src/layout/design.js` |
| Schriften | IBM Plex Sans Regular (Titel 32/24/18 pt), Arial (Fliesstext 9–10 pt, Tabellen) | IBM Plex Sans für Titel/Überschriften (in das DOCX eingebettet), Arial für Text und Tabellen |
| Logo | «SCHAEPPI GRUNDSTÜCKE» ein- und zweizeilig, weiss auf Navy bzw. blau auf Crème | aus den Vektoren der Referenz extrahiert (`assets/logo/`), Navy-Variante in der Kopfzeile |
| Titel | «Verkaufsdokumentation» + Adresse auf Navy-Fläche | Navy-Titelband: Kennzeichnung («Akquisitionsgelegenheit»), Objektbezeichnung, Adresse |
| Facts & Figures | zweispaltige Liste Bezeichnung/Wert, Arial 9–10 pt | Tabelle Bezeichnung (grau) / Wert, feine Trennlinien |
| Bilder | grossformatige Objekt-, Lage- und Innenaufnahmen | Titelbild volle Breite; auf Seite 2 bis zu zwei Bilder nebeneinander |
| Kontakt | «Wir sind für Sie da», Name fett, Funktion, Telefon, E-Mail, Firmenadresse | Kasten «Ansprechpartner»; Firmenadresse in der Fusszeile |

Designentscheide über die Referenz hinaus (zurückhaltend, im Stil der Referenz): Kennzahlen-Leiste
auf Crème unter dem Titel (max. 4 Werte, nur vorhandene), Investorenargumente im Crème-Kasten,
Kopfzeile mit Logo und «VERTRAULICH», Fusszeile mit Adresse und «Seite x / y».

**Struktur (fix, für jedes Objekt gleich):**

- *Seite 1:* Titelband · Kennzahlen · Titelbild · Transaktionsübersicht (Ausgangslage, Objekt & Lage,
  Baujahr & Investitionen, Einheiten & Nebenräume) | Investorenargument · Ansprechpartner
- *Seite 2:* Facts & Figures · Einheiten · Grundstücke & Miteigentum / Zonenordnung · Erträge & Kennzahlen ·
  Investitionen · Bilder · Nächste Schritte · Allgemeine Angaben

Rubriken ohne Daten entfallen vollständig – keine leeren Tabellen, keine Platzhalter, kein leerer Bildrahmen.

## Architektur

```
src/                      läuft identisch im Browser und in Node (reine ES-Module)
  model/schema.js         Datenmodell: Abschnitte, Felder, Pflicht/optional, Normalisierung
  model/facts.js          Faktenaufbereitung (FACT), rechnerische Ableitungen (DERIVED), fehlende Angaben (MISSING)
  model/validate.js       Faktenprüfung: Pflicht, Typen, Widersprüche (Flächen, Mieten, Jahre, Anteile, Objektart)
  content/texts.js        Textstruktur, regelbasierte Fassung, Kürzen an Satzgrenzen
  content/guard.js        Faktenwächter für KI-Texte (Zahlen, Behauptungen, Superlative, Faktenbezug)
  layout/design.js        Design-Tokens (Farben, Schriften, Abstände, Bildhöhen, Textbudgets)
  layout/factsheet.js     Template «Factsheet»: Block-Modell + 2-Seiten-Verdichtung
  layout/measure.js       Seitenberechnung mit echten Zeichenbreiten der Schriften
  layout/check.js         Dokumentprüfung (Seiten, leere Tabellen, Platzhalter, undefined …)
  layout/expose.js        vorbereitete Gliederung «Verkaufsexposé»
  render/html.js          Vorschau aus dem Block-Modell
server/
  server.js               HTTP-Server (ohne Framework), API, Sicherheitsheader
  documents.js            Dokumenttypen-Registry (factsheet, nda, expose), Ablauf Prüfung → DOCX
  ai/providers.js         austauschbare KI-Schnittstelle (Claude, regelbasiert)
  ai/prompt.js            Systemprompt, Zeichenbudgets, JSON-Schema der Antwort
  docx/                   DOCX-Renderer Factsheet und NDA, gemeinsame Bausteine
  images.js               Bildprüfung (Signatur, Grösse), Zuschnitt statt Verzerrung
  render-check.js         Gegenprüfung der Seitenzahl mit LibreOffice
templates/nda.js          fester Wortlaut der Geheimhaltungsverpflichtung mit Platzhaltern
web/                      Oberfläche (HTML/CSS/JS ohne Build-Schritt)
```

**Ein Template, viele Objekte:** Layout und Designwerte hängen an keinem Objekt. Dieselben
Daten, dasselbe Block-Modell und dieselben Tokens erzeugen Vorschau und DOCX; getestet für
Mehrfamilienhaus, Zweifamilienhaus, Einfamilienhaus, Eigentumswohnung, Gewerbeobjekt und Grundstück.

## Datenqualität: FACT · AI TEXT · MISSING

- **FACT** – vom Benutzer erfasst. Facts & Figures, Tabellen und Kennzahlen bestehen nur daraus, ohne KI-Prosa.
- **DERIVED** – reine Rechnung aus erfassten Werten (z. B. Bruttorendite) nur auf ausdrücklichen Wunsch
  und im Dokument als «berechnet» bezeichnet.
- **AI TEXT** – Titel, Transaktionsübersicht und Investorenargumente. Die KI erhält nur die
  vorhandenen Fakten und die Liste der fehlenden Angaben. Das Antwortschema lässt als Grundlage eines
  Arguments nur tatsächlich erfasste Faktenfelder zu.
- **MISSING** – erscheint nie im Dokument, nur als Füllstand in der Eingabemaske.

Der **Faktenwächter** prüft jeden KI-Text: Zahlen, die nicht in den Fakten stehen («1955», «240 m²»),
unbelegte Behauptungen («renoviert», «zentral», «Seesicht», «Mietsteigerungspotenzial» ohne Grundlage),
Superlative ohne Faktenbasis («absolute Toplage», «einmalig») und Argumente ohne Faktenbezug.
Treffer erscheinen am Text und im Prüfbericht; auch von Hand bearbeitete Texte werden geprüft.

## Zwei Seiten – harte Grenze

1. Die KI erhält Zeichenbudgets je Textbaustein.
2. Die Seitenhöhe wird mit den echten Zeichenbreiten von Arial und IBM Plex Sans und exakten
   Zeilenabständen berechnet (Abweichung zu LibreOffice im Test: < 10 pt, stets zur sicheren Seite).
3. Passt eine Seite nicht, wird stufenweise verdichtet – je Seite unabhängig:
   Abstände → Bildgrössen → optionale Inhalte (Einheitentabelle, Bilder, ältere Investitionen,
   Nebeneinander-Darstellung, «Nächste Schritte» auf Seite 1) → Texte an ganzen Satzgrenzen kürzen
   (nur weglassen, nie umformulieren). Mit KI-Zugang: «Mit KI verdichten» statt kürzen.
4. **Schriftgrössen werden nie verändert** (Fliesstext 9 pt, Tabellen 8.5 pt).
5. Vor der Auslieferung rendert der Server das DOCX mit LibreOffice (falls installiert) und verdichtet
   weiter, falls wider Erwarten mehr als zwei Seiten entstehen. Passt es gar nicht, wird der Export
   mit einem klaren Hinweis verweigert.

## Geheimhaltungsverpflichtung

Fester Wortlaut in `templates/nda.js` – **nicht KI-generiert**. Eingesetzt werden nur Objekt, Adresse,
Unternehmen, Adresse des Interessenten, Vertreter, Ort, Datum und Laufzeit; leere Felder bleiben als
Ausfülllinie stehen. Geregelt: Gegenstand, Definition, Ausnahmen, Geheimhaltung, Verwendung,
Weitergabe an Mitarbeitende und Berater, Rückgabe/Vernichtung, Beendigung der Gespräche, Laufzeit,
Schweizer Recht, Gerichtsstand Basel.

## Verkaufsexposé (vorbereitet)

`layout/expose.js` enthält die Gliederung (Titelblatt, Objekt, Mikro-/Makrolage, Gebäude, Wohnungen &
Grundrisse, Aussenbereich & Parkierung, Investitionen, Kennzahlen & Mieter, Grundstück, Potenzial,
Verkaufsprozess, Kontakt) mit Zuordnung zu den bestehenden Datenfeldern. Datenmodell, Faktenaufbereitung,
Design-Tokens, Block-Renderer und KI-Schnittstelle werden unverändert weiterverwendet – die Daten werden
nur einmal erfasst. In der Oberfläche ist der Button bereits sichtbar (deaktiviert).

## Sicherheit und Betrieb

- Keine Speicherung von Objektdaten auf dem Server; jede Anfrage enthält alle Daten.
- API-Schlüssel nur serverseitig. Standardmässig nur lokal erreichbar (`HOST=127.0.0.1`).
  Für den Betrieb im Netz hinter einem Reverse-Proxy mit Anmeldung (z. B. Microsoft Entra ID) betreiben.
- Eingaben werden gegen das Schema normalisiert (unbekannte Felder verworfen, Längen begrenzt),
  Bilder per Dateisignatur geprüft (nur JPEG/PNG, max. 8 MB), Anfragen max. 40 MB,
  restriktive Content-Security-Policy, kein Zugriff auf Dateien ausserhalb von `web/`, `src/`, `assets/`.
- DOCX-Struktur geprüft: jede Tabellenzelle endet mit einem Absatz, Tabellen sind nie direkt aneinander
  (Word würde sie verschmelzen), Seite 2 beginnt über «Seitenumbruch oberhalb» (keine Leerseiten).

## Offene Punkte

- **Bestehende Geheimhaltungsverpflichtung und Factsheet Baselstrasse 69, Arlesheim:** Beide lagen bei
  der Entwicklung nicht als Datei vor (hochgeladen war nur die Verkaufsdokumentation Neumattstrasse 15).
  Der Test erfolgte daher mit Neumattstrasse 15 – ausschliesslich mit dort dokumentierten Angaben.
  Sobald die Unterlagen vorliegen: Arlesheim als zweites Beispiel erfassen und den NDA-Wortlaut in
  `templates/nda.js` 1:1 durch die freigegebene Vorlage ersetzen (nur diese Datei). Die NDA-Laufzeit
  ist mit 2 Jahren vorbelegt und pro Objekt änderbar.
- **KI-Texte live:** In der Entwicklungsumgebung stand kein API-Schlüssel zur Verfügung. Die
  Anbindung ist mit einem simulierten Client getestet (Anfrage, Schema, Ablehnung, Fehler);
  `examples/neumattstrasse-15/texte.json` ist eine redaktionelle Fassung nach den Regeln des
  Systemprompts und besteht den Faktenwächter. Vor dem Produktiveinsatz einige Objekte mit echtem
  Schlüssel erzeugen und die Texte fachlich abnehmen.
- **Word-Darstellung:** Die Seitenprüfung erfolgt mit LibreOffice und der internen Berechnung. Arial ist
  metrisch identisch mit der verwendeten Prüfschrift; IBM Plex Sans ist eingebettet. Eine Sichtprüfung in
  Microsoft Word (Windows und Mac) gehört zur Abnahme.
