# Print-Spezifikation – Band 1 „Die Tote, die sonntags anruft“

**Stand:** 22.10.2026 · **Ausgabe: Privatdruck** (BoD Print, nur Eigenbedarf) · Druckdatei: `publikation/satz/band-1_buchblock.pdf`
Technische BoD-Vorgaben mit Quellen: `bod-checkliste.md` (§1).

## Ausstattung (Produktionsvorschlag, umgesetzt)
| Merkmal | Festlegung | Begründung / BoD-Quelle |
|---|---|---|
| Format | **12 × 19 cm** (BoD-Standardformat) | klassisches Taschenbuchmass für Spannungsliteratur; bei 47.800 Wörtern ein Buch von rund 230 Seiten statt eines dünnen Bandes von ~150 Seiten im Format 13,5 × 21,5; geringere Druckkosten pro Exemplar |
| Einband | Paperback, Klebebindung | [Q3] |
| Papier | cremeweiss 90 g | „klassisch für Romane“ [Q3] |
| Laminierung | matt | „für sehr viele belletristische Veröffentlichungen“ [Q3] |
| Druck | Standard, schwarz-weiss, keine Farbseiten | [Q3], [Q4] |
| Seitenzahl | **228** (gerade, wie verlangt) | [Q8] |

Format, Papier und Einband entscheidet der Autor. Der Satz lässt sich mit denselben Skripten auf 13,5 × 21,5 cm umstellen (Seitengrösse und Ränder in `buchblock.css`).

## Satz
- **Satzspiegel:** innen 18 mm, aussen 14 mm, oben 16 mm, unten 19 mm (Seitenzahl darin); kein Beschnitt nötig, keine randabfallenden Elemente, keine Schnittmarken [Q3].
- **Grundschrift:** EB Garamond 10,5 pt auf 13,8 pt Zeilenabstand, Blocksatz, Silbentrennung nach de-CH (pyphen), Mediävalziffern.
- **Transkripte:** IBM Plex Mono 7,4 pt mit hängendem Zeitcode.
- **Kapitelanfänge:** Jedes Kapitel beginnt auf einer neuen Seite; der erste Absatz hat keinen Einzug.
- **Szenenwechsel:** zentrierter Stern mit einer Leerzeile davor und danach.
- **Schusterjungen und Hurenkinder:** mindestens zwei Zeilen am Absatzanfang und -ende (CSS `orphans`/`widows`).
- **Titelei:** S. 1 Schmutztitel · S. 2 Reihe · S. 3 Titelblatt · S. 4 Impressum (oben 26 mm frei für das FSC-Siegel [Q3]). Die Titelei trägt keine Seitenzahlen.
- **Schriften:** im PDF vollständig eingebettet (geprüft mit `pruefen_pdf.py`) [Q9]. Lizenz: SIL Open Font License, Lizenztexte liegen unter `satz/fonts/`.
- **Endformat:** exakt 120,00 × 190,00 mm, geprüft.

## Ausgabe: Privatdruck
Der Autor will das Buch nur für sich. Gedruckt wird deshalb über **BoD Print**: CHF 0 Grundgebühr, Druck ab 1 Exemplar, keine ISBN, kein Handel [Q1]. Im Impressum entfallen bei Titeln ohne ISBN der Verlagsvermerk [Q3] und der DNB-Vermerk. Der Buchblock trägt „Privatdruck 2026“ und „Nicht für den Handel bestimmt“.

Für eine spätere Handelsausgabe trägt man Autor und ISBN in `satz/build_buchblock.py` (`KONFIG`) ein und erzeugt neu:
```
cd publikation/satz
python3 build_buchblock.py
NODE_PATH=$(npm root -g) node render_pdf.js
python3 pruefen_pdf.py
```

## Noch offen
- **Cover:** Die Rückenbreite liefert erst der BoD-Coverrechner mit 228 Seiten und cremeweissem 90-g-Papier.
- **Erstes Exemplar = Probedruck:** Bei BoD Print ist das erste bestellte Exemplar zugleich der Probedruck. Erst dort prüfbar: Papierwirkung, Bindung und Lesbarkeit der 7,4-pt-Transkripte.
