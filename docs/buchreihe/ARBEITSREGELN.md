# Arbeitsregeln – Ausgabe und Dateien

Diese Regeln gelten für das gesamte Projekt *Was das Eis zurückgibt*. Sie gehen jeder anderen Notiz vor.

## 1. Eine Wahrheit pro Thema (Single Source of Truth)

| Frage | Massgebliche Datei |
|---|---|
| Wie lautet der Romantext? | `manuskript/` – **nur dort**, nur die neueste Fassung |
| Was ist *wirklich* passiert? Wer weiss was? | `entwicklung/band-1_mystery-matrix.md` |
| Wo steht welcher Hinweis, wann kehrt er zurück? | `entwicklung/band-1_foreshadowing.md` |
| Daten, Alter, Orte, Namen, Gegenstände | `entwicklung/band-1_kontinuitaet.md` + `band-1_zeitlinie.md` |
| Wie denkt und spricht eine Figur? | `entwicklung/band-1_figuren.md` |
| Welche Geräusche tragen Bedeutung? | `entwicklung/band-1_audio-hinweise.md` |
| Was wird als Nächstes geschrieben? | `entwicklung/band-1_produktionsplan.md` |
| Offene Entscheidungen des Autors | `entwicklung/band-1_entscheidungen.md` |
| Verkaufstexte, Metadaten, BoD | `publikation/` |
| Ursprüngliches Reihenkonzept (Stand 28.09.2026) | `reihenkonzept.md` – **historisch**: Bei Widerspruch gelten die Dateien in `entwicklung/`. |

## 2. Dateistruktur

```
docs/buchreihe/
  ARBEITSREGELN.md
  reihenkonzept.md                 (historisch, wird nicht mehr fortgeschrieben)
  manuskript/                      nur Romantext, keine Notizen, keine Kommentare
    band-1_prolog-kapitel-01-03.md
    band-1_kapitel-04-10.md
    band-1_kapitel-11-20.md
    band-1_kapitel-21-30.md
    band-1_kapitel-31-44.md
    band-1_epilog.md
  entwicklung/                     Arbeitsdokumente, nie Teil des Buches
    band-1_gesamtpruefung.md
    band-1_produktionsplan.md
    band-1_entscheidungen.md
    band-1_mystery-matrix.md
    band-1_foreshadowing.md
    band-1_kontinuitaet.md
    band-1_zeitlinie.md
    band-1_figuren.md
    band-1_audio-hinweise.md
  publikation/
    klappentext.md  autorenprofil.md  metadaten.md  bod-checkliste.md
```

## 3. Manuskriptregeln
- Manuskriptdateien enthalten **ausschliesslich** Romantext: Kapitelüberschriften als `## KAPITEL N`, Szenenwechsel als `\*`. Keine Entwicklungsnotizen, keine Kommentare.
- Jedes Kapitel existiert genau einmal. Überarbeitungen ersetzen den Text in derselben Datei. Es gibt keine Dateien wie „v2“ oder „neu“; Versionen liegen in der Git-Historie.
- Schweizer Rechtschreibung (ss), deutsche Anführungszeichen „…“ und ‚…‘, Gedankenstrich –, Auslassung …
- Verbotsliste der Formulierungen gilt immer: „wusste nicht warum“, „Herz raste“, „Luft blieb weg“, „bedeutungsvoll“, „fröstelte“, „plötzlich wurde klar“, „Es war keine Frage“ (höchstens einmal im Buch).
- Frequenzangaben in Zahlen: höchstens eine pro Kapitel. Nora hört präzise, sie spricht nicht ständig in Hertz.

## 4. Arbeitszyklus pro Kapitelblock
1. Matrix, Foreshadowing, Kontinuität und Zeitlinie lesen.
2. Interne Prüfung A–J für jedes Kapitel (was weiss, glaubt, darf die Leserin; was ist wahr).
3. Kapitel schreiben, direkt in die Manuskriptdatei.
4. Entwicklungsdateien nachführen: neue Hinweise, neue Fakten, verschobene Termine.
5. Qualitätsprüfung des Blocks (Plot, Fairness, Figuren, Spannung, Sprache, Atmosphäre, Emotion, Audio, Kontinuität, Serie). Das Ergebnis kommt in `band-1_gesamtpruefung.md` (Abschnitt „Blockprüfungen“).
6. Commit mit klarer Nachricht, dann Push auf den Arbeitsbranch.

## 5. Ausgaberegel im Chat
- Im Chat erscheint **kein** Romantext in voller Länge. Der Text steht in der Datei. Im Chat stehen:
  1. was geschrieben oder geändert wurde (Datei, Kapitel, Wortzahl),
  2. die wichtigsten eigenen Entscheidungen (höchstens fünf Punkte),
  3. **KONTINUITÄTSPROBLEM** oder **KONZEPTVERBESSERUNG**, falls vorhanden, im vereinbarten Format, und
  4. der nächste Schritt.
- Ausnahme: Du bittest ausdrücklich um den Text im Chat.
- Keine langen Analyseberichte nach jedem Kapitel. Die interne Prüfung bleibt intern; gesichert wird nur ihr Ergebnis.

## 6. Entscheidungsgrenze
- **Selbst entscheiden:** Szenenfolge, Platzierung von Hinweisen, Nebenhandlungen, Dialoge, Streichungen, Umbau einzelner Kapitel, kleine Faktenergänzungen, die keine bestehende Wahrheit ändern.
- **Dem Autor vorlegen** (in `band-1_entscheidungen.md` und im Chat): Änderungen an der Grundgeschichte, an der Identität einer Figur, an einer zentralen Wendung, an Band 2/3 oder an einer Wahrheit in der Mystery-Matrix. Bis zur Entscheidung werden betroffene Kapitel nicht geschrieben. Unbetroffene Kapitel laufen weiter.
