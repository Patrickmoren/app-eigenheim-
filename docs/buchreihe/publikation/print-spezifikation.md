# Print-Spezifikation – Band 1 „Die Tote, die sonntags anruft“

**Stand:** 21.10.2026 · Druckdatei: `publikation/satz/band-1_buchblock.pdf`
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

## Platzhalter vor dem Upload (nicht vergessen)
| Platzhalter | Wo | Ersetzen durch |
|---|---|---|
| `AUTORNAME` | Titelblatt, ©-Vermerk | Name oder Pseudonym (E-P4) |
| `978-3-XXXX-XXXX-X` | Impressum | ISBN aus myBoD nach Projektstart (90-Tage-Frist [Q18]) |

Die Werte stehen in `satz/build_buchblock.py` unter `KONFIG`. Danach neu erzeugen:
```
cd publikation/satz
python3 build_buchblock.py
NODE_PATH=$(npm root -g) node render_pdf.js
python3 pruefen_pdf.py
```

## Noch offen
- **Cover:** Die Rückenbreite liefert erst der BoD-Coverrechner mit 228 Seiten und cremeweissem 90-g-Papier.
- **E-Book:** BoD konvertiert kostenlos aus der Druckdatei [Q1]. Eine eigene EPUB-Prüfung bleibt offen.
- **Probedruck:** Pflicht vor der Freigabe (CHF 69 bei Publish [Q1]). Erst dort prüfbar: Papierwirkung, Bindung und Lesbarkeit der 7,4-pt-Transkripte.
