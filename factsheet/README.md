# Schaeppi Verkaufsunterlagen

Ein Objekt einmal erfassen – daraus entstehen alle Verkaufsunterlagen im Schaeppi-Design:

| Dokument | Format | Inhalt |
|---|---|---|
| **Verkaufs-Factsheet** | Word | 2 Seiten: Transaktionsübersicht, Investorenargumente, Facts & Figures, Erträge, Grundstück |
| **Verkaufsdokumentation** | PDF + Word | A4 quer im Stil der InDesign-Dokumentation: Deckblatt, Facts & Figures, Objekt, Lage, Region, Einheiten, Galerie, Grundrisse, Zahlen, Nächste Schritte, Kontakt |
| **Anonymer Teaser** | Word | 1 Seite ohne Strasse, PLZ und Parzelle für die Erstansprache |
| **Geheimhaltungsverpflichtung** | Word | feste Vorlage, nur Objekt und Interessent werden eingesetzt |
| **Inserattexte** | Word + Text | Titel, Kurzbeschrieb, Beschrieb und Eckdaten für Homegate, ImmoScout24, Website |

Es werden **nur erfasste Angaben** verwendet. Fehlende Angaben erscheinen nicht – keine leeren
Tabellen, keine Platzhalter, keine leeren Bildrahmen. Das Design ist für jedes Objekt gleich.

Beispiel mit allen Dokumenten (Neumattstrasse 15, Büsserach, nur Angaben aus der Verkaufsdokumentation):
[`examples/neumattstrasse-15/ausgabe/`](examples/neumattstrasse-15/ausgabe/).

## Drei Betriebsarten, ein Programm

| | Browser (z. B. claude.ai) | Arbeitsplatz | Zentral |
|---|---|---|---|
| Start | Link öffnen | Desktop-Verknüpfung «Verkaufsunterlagen» | Server bei Schaeppi/Azure |
| Installation | keine | Node.js (Einrichtung per Doppelklick) | einmalig durch die IT |
| Word-Dateien | im Browser erzeugt | ✓ | ✓ |
| PDF Verkaufsdokumentation | Drucken → Als PDF speichern | direkt (über Edge/Chrome) | direkt |
| 2-Seiten-Prüfung | Berechnung | Berechnung + LibreOffice (falls installiert) | Berechnung + LibreOffice |
| KI-Texte | über die Browser-Anbindung, falls verfügbar | mit API-Schlüssel | mit API-Schlüssel |
| Eingangsordner (Automatik) | – | ✓ Desktop-Ordner | ✓ z. B. Teams-/SharePoint-Ordner |

Der Kern (`src/`) ist in allen drei Fällen derselbe; die Oberfläche erkennt selbst, ob ein Server da ist.

### Arbeitsplatz (Windows)

`desktop/windows/Installieren.cmd` doppelklicken: prüft Node.js (installiert es auf Wunsch über winget),
legt die Desktop-Verknüpfung **«Verkaufsunterlagen»** an, auf Wunsch Autostart mit Windows und den
KI-Schlüssel. macOS: `desktop/mac/Verkaufsunterlagen.command`. Von Hand: `npm install` und `npm run desktop`.

### Browser-Fassung

`npm run paket` legt in `dist/` die reine Browser-Fassung ab (index.html, Programmdateien, Beispiel).
Sie läuft auf jedem Webserver bzw. als Artifact auf claude.ai, ohne Installation. Objekte werden im
jeweiligen Browser gespeichert; zum Weitergeben «Als Datei» speichern und beim Kollegen «Importieren».

### Zentraler Betrieb

`npm start` (Oberfläche + API) bzw. `npm run desktop -- --ordner=PFAD --kein-browser` (zusätzlich
Eingangsordner, z. B. auf einem Teams-Ordner). Hinter einem Reverse-Proxy mit Anmeldung betreiben.

| Variable | Wirkung |
|---|---|
| `ANTHROPIC_API_KEY` | KI-Texte (Claude). Ohne Schlüssel: regelbasierte, sachliche Texte aus den Fakten |
| `AI_MODEL`, `AI_EFFORT` | Modell (Standard `claude-opus-5-5`), Denktiefe (Standard `medium`) |
| `PORT`, `HOST` | Standard `3000`, `127.0.0.1` |
| `FACTSHEET_ORDNER` | Arbeitsordner des Eingangsordners |
| `CHROMIUM_PATH` | Browser für die PDF-Erzeugung (sonst Edge/Chrome/Chromium automatisch) |
| `SOFFICE_PATH`, `RENDER_CHECK=off` | LibreOffice für die Seitenprüfung |

## Bedienung

Links die Objektliste (Suche, neues Objekt, Beispiel, Import von Excel oder Datei). Je Objekt vier Bereiche:

1. **Erfassung** – Basisangaben (Pflicht mit \*) und optionale Details; rechts laufend die Prüfung.
2. **Bilder** – feste Positionen (Titelbild, Objekt, Lage, Grundriss, Porträt) und bis 16 weitere Bilder
   für die Verkaufsdokumentation; Art (Aussen/Innen/Grundriss/Umgebung), Legende, Reihenfolge,
   Innenaufnahmen einer Einheit zuordnen. Bilder werden verkleinert und zugeschnitten, nie verzerrt.
3. **Texte** – «KI-Texte erstellen» erzeugt in einem Durchgang die Texte aller Dokumente. Jeder Text ist
   bearbeitbar, mit Zeichenbudget und Prüfhinweisen; «Ursprüngliche Fassung» stellt die KI-Fassung wieder her.
4. **Dokumente** – Vorschau jedes Dokuments (Klick auf einen Text springt zum Textfeld) und Download.

## Automatik über den Eingangsordner

```
Verkaufsunterlagen/            (auf dem Desktop bzw. frei wählbar)
  1_Eingang/   Excel-Erfassung oder Objektdatei ablegen – allein oder als Ordner mit Bildern
  2_Ausgang/   je Objekt ein Ordner mit den Dokumenten und Pruefbericht.txt
  3_Archiv/    verarbeitete Eingaben
  Vorlage_Objekterfassung.xlsx, LIESMICH.txt, protokoll.txt
```

In der Excel-Erfassung steuert der Abschnitt **«Dokumente erstellen»**, was entsteht (Factsheet immer;
Verkaufsdokumentation standardmässig Ja; Teaser, Inserat, Geheimhaltungsverpflichtung auf Wunsch).
Bilder im Objektordner: `titelbild.jpg`, `objektfoto.jpg`, `lagefoto.jpg`, `grundriss.jpg`, `portrait.jpg`;
weitere im Unterordner `galerie/` – der Dateiname ist die Legende («Grundriss Obergeschoss.jpg»,
«Innen Wohnzimmer.jpg», «Umgebung Luftbild.jpg»). Für JSON-Eingaben: `{ "property": …, "optionen": { "teaser": true } }`.
Bei Fehlern entsteht `FEHLER_….txt` mit den Gründen.

## Faktentreue

- **FACT** – erfasst; Tabellen und Kennzahlen bestehen nur daraus.
- **DERIVED** – reine Rechnung (z. B. Bruttorendite) nur auf Wunsch und als «berechnet» bezeichnet.
- **AI TEXT** – die KI erhält nur vorhandene Fakten und die Liste der fehlenden Angaben; als Grundlage
  eines Arguments sind nur erfasste Faktenfelder zulässig (Antwortschema).
- **MISSING** – erscheint nie im Dokument.

Der **Faktenwächter** prüft jeden Text aller Dokumente: Zahlen, die nicht in den Fakten stehen, unbelegte
Behauptungen («renoviert», «zentral», «Seesicht», «Mietpotenzial»), Superlative ohne Faktenbasis und
Argumente ohne Faktenbezug. Im **Teaser** zusätzlich: Strasse, PLZ oder Parzellennummer sperren den
Export. Hinweise erscheinen am Text und in der Prüfung; bearbeitete Texte werden ebenfalls geprüft.

## Seitenlayout

- **Factsheet** max. 2 Seiten, **Teaser** genau 1 Seite: Höhe wird mit den echten Zeichenbreiten von Arial
  und IBM Plex Sans berechnet (im Test stets 1–8 pt zur sicheren Seite gegenüber LibreOffice); passt es
  nicht, wird stufenweise verdichtet (Abstände, Bilder, optionale Inhalte, Kürzen an Satzgrenzen).
  Schriftgrössen ändern sich nie. Mit LibreOffice wird das fertige Word-Dokument zusätzlich geprüft.
- **Verkaufsdokumentation**: feste Flächen je Seitentyp; Texte werden gegen ihre Fläche vermessen und
  nötigenfalls an Satzgrenzen gekürzt; Seiten ohne Daten entfallen. Der Titel passt seine Grösse an.
- Design-System (`src/layout/design.js`): Navy `#1B3F64`, Logo-Blau `#1A9EDA`, Crème `#F9F9F1`;
  IBM Plex Sans (eingebettet) für Titel, Arial für Text. Logos aus den Vektoren der Referenz.

## Aufbau

```
src/                      Kern – läuft im Browser und in Node
  model/                  Datenmodell, Fakten, Prüfung
  content/                Texte (regelbasiert), KI-Prompt und -Schema, Faktenwächter, NDA-Vorlage
  layout/                 Design-System, Seitenberechnung, Factsheet und Teaser, Dokumentprüfung
  expose/                 Verkaufsdokumentation: Seitenmodell, HTML/PDF-Druckvorlage
  docx/                   Word-Ausgabe aller Dokumente
  render/html.js          Vorschau Factsheet/Teaser
  documents.js            Dokument-Registry: Prüfen → Erzeugen
  excel.js                Excel-Erfassung lesen/schreiben
web/                      Oberfläche (ohne Build-Schritt): Objekte, Erfassung, Bilder, Texte, Dokumente
server/                   Server, KI-Anbindung, LibreOffice-Prüfung, PDF, Eingangsordner
scripts/                  desktop.js (Arbeitsplatz), beispiel.js (alle Dokumente ohne Oberfläche), paket.js (Browser-Fassung)
desktop/                  Windows-Einrichtung und Starter, macOS-Starter
test/                     59 Tests: Modell, Wächter, Layout, Word, PDF, Excel, Eingangsordner, KI-Anbindung
```

## Offene Punkte

- **NDA-Wortlaut**: `src/content/nda-template.js` deckt die Punkte Ihrer Vorlage ab, ist aber nicht der
  freigegebene Schaeppi-Text (lag nicht als Datei vor). Vor dem Einsatz 1:1 ersetzen – nur diese Datei.
- **Factsheet Baselstrasse 69, Arlesheim**: lag nicht vor; getestet wurde mit Neumattstrasse 15.
- **KI-Texte live**: Die Claude-Anbindung ist mit einem simulierten Client getestet (kein Schlüssel in der
  Entwicklungsumgebung). `examples/neumattstrasse-15/texte.json` ist eine redaktionelle Fassung nach den
  Prompt-Regeln. Vor dem Einsatz einige Objekte mit echtem Schlüssel erzeugen und fachlich abnehmen.
- **Microsoft Word**: Geprüft mit LibreOffice. In der Word-Fassung der Verkaufsdokumentation werden Bilder
  per Zuschnitt (OOXML `srcRect`) eingepasst; LibreOffice stellt den seitlichen Zuschnitt nicht dar, Word schon.
  Sichtprüfung in Word (Windows/Mac) gehört zur Abnahme.
- **Windows-Einrichtung** ungetestet (Entwicklung unter Linux); Node.js-Installation braucht ggf. die IT.
