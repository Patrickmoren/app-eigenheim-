# Arbeitsanweisung für Claude

Dieses Repository gehört Patrick Moren (Schaeppi Grundstücke AG, Basel). Er arbeitet allein mit den Werkzeugen.

## Verkaufsunterlagen aus erhaltenen Unterlagen erstellen (`factsheet/`)

Wenn der Benutzer Unterlagen zu einem Verkaufsobjekt schickt (Grundbuchauszug, Mieterspiegel, Pläne,
Fotos, Policen, Abrechnungen, bestehende Dokumentationen …), ist das der Auftrag: daraus einheitliche,
hochprofessionelle Verkaufsunterlagen im Schaeppi-Design erstellen – inklusive aller Angaben, die Banken
für die Finanzierung verlangen. Nicht nachfragen, ob er das will; nur bei echten Lücken nachfragen.

1. **Ablage**: `factsheet/objekte/<Strasse-Nr-Ort>/unterlagen/` – Originale dorthin kopieren. Der Ordner
   `objekte/` ist vertraulich und per `.gitignore` ausgeschlossen: nie committen, nie in Antworten nach aussen.
2. **Lesen**: jede Unterlage vollständig lesen (PDF: `pdftotext -layout`, Seiten als Bild mit `pdftoppm`
   ansehen, wenn Tabellen/Pläne; Bilder mit `pdfimages -j`; Excel mit exceljs/Python).
3. **Fakten erfassen** in `objekt.json` (Felder: `src/model/schema.js`; Beispiel: `examples/neumattstrasse-15/`):
   - nur, was in den Unterlagen steht – nichts schätzen, ableiten oder ergänzen; Widersprüche zwischen
     Unterlagen nicht auflösen, sondern dem Benutzer melden;
   - Herkunft jeder Angabe in `quellen.json` (`{ "Grundstücksfläche": "Grundbuchauszug vom 12.02.2026, S. 1" }`);
   - jede erhaltene Unterlage in `documents` mit Status (vorhanden/angefordert/fehlt), Stand und Bemerkung;
   - Mieterspiegel je Einheit: Zimmer, Fläche, Geschoss, Nettomiete, Nebenkosten, Status, Mietbeginn.
4. **Bilder**: `titelbild.jpg`, `objektfoto.jpg`, `lagefoto.jpg`, `portrait.jpg`; weitere in `galerie/` mit
   sprechendem Dateinamen («Grundriss Obergeschoss.jpg», «Innen Wohnzimmer.jpg», «Umgebung Luftbild.jpg»).
   Beste Aufnahme als Titelbild; Pläne als Grundriss, nicht als Foto.
5. **Texte**: `texte.json` selbst schreiben, streng nach den Regeln in `src/content/prompt.js`
   (SYSTEM_PROMPT, Zeichenbudgets in `src/layout/design.js` → BUDGET). Sachlich, hochwertig, Schweizer
   Rechtschreibung, keine Superlative ohne Beleg, keine Fakten ausserhalb von `objekt.json`.
   `"provider": "claude-sitzung"`. Teaser ohne Strasse, PLZ, Parzellennummer.
6. **Erzeugen**: `cd factsheet && node scripts/erstellen.js objekte/<ordner> --pdf`
   → `ausgabe/` mit Factsheet, Verkaufsdokumentation (PDF + Word), Finanzierungsdossier, Teaser, NDA,
   Inserat und `Pruefbericht.txt`.
7. **Prüfen**: Prüfbericht lesen; jeden Hinweis des Faktenwächters beheben (Text anpassen, nicht die Regel);
   Kontroll-PDFs als Bilder ansehen (`pdftoppm -r 40` + `montage`) – Gestaltung, Bildwahl, Umbrüche.
8. **Liefern**: Dokumente mit SendUserFile schicken (PDF zur Ansicht, Word zum Bearbeiten) und knapp melden:
   was erstellt wurde, was für die Bank noch fehlt (Abschnitt «Für die Bank noch offen»), welche
   Widersprüche oder Lücken er klären muss. Keine erfundenen Werte als Platzhalter.

Technik: `npm test` (alle Tests müssen grün sein, bevor etwas committet wird). LibreOffice und Chromium
werden für Seitenprüfung und PDF genutzt, falls vorhanden (`fc-list | grep -i plex`; sonst
`cp assets/fonts/IBMPlexSans-Regular.ttf ~/.fonts/ && fc-cache -f`).
