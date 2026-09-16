# Prozessbeschreibung

`Prozessbeschreibung-Mieterwechsel.docx` beschreibt die fachlichen Abläufe, die der
Leerstandsmanager abbildet – zur Prüfung durch die Fachabteilung, nicht als Bedienungsanleitung.

Jeder Schritt, jede Frist, jede Kontrolle und jede Annahme trägt eine Nummer, damit
Rückmeldungen eindeutig zugeordnet werden können:

| Kennung | Bedeutung |
|---|---|
| `1.1`–`1.6` | Angaben bei der Falleröffnung |
| `2.1`–`2.10` | Prozess 1 · Kündigung & Abnahme |
| `3.1`–`3.4` · `4.1`–`4.5` | Prozess 2 · Wiedervermietung |
| `5.1`–`5.3` | Prozess 3 · Schlussabrechnung |
| `F1`–`F5` | Fristenregeln |
| `K1`–`K9` | Fachliche Kontrollen |
| `A1`–`A10` | Annahmen, die zu bestätigen sind |

Erzeugt mit `node build.js` (benötigt `npm install docx`). Das Dokument wird aus dem Skript
erzeugt und nicht von Hand bearbeitet – Rückmeldungen fliessen ins Skript zurück, damit die
Nummerierung stabil bleibt.
