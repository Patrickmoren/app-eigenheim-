# Objektordner (vertraulich, nicht im Repository)

Je Objekt ein Ordner, z. B. `objekte/Neumattstrasse-15-Buesserach/`:

```
unterlagen/      erhaltene Originale (Grundbuchauszug, Mieterspiegel, Pläne, Fotos …)
objekt.json      erfasste Fakten (Datenmodell src/model/schema.js)
quellen.json     { "Bezeichnung": "Quelle" } – Herkunft jeder Angabe, erscheint im Finanzierungsdossier
texte.json       Texte aller Dokumente (Regeln: src/content/prompt.js)
titelbild.jpg, objektfoto.jpg, lagefoto.jpg, portrait.jpg, galerie/…
ausgabe/         erzeugte Dokumente und Pruefbericht.txt
```

Erzeugen: `node scripts/erstellen.js objekte/<ordner> --pdf`

Alles ausser dieser Datei ist per `.gitignore` vom Repository ausgeschlossen.
