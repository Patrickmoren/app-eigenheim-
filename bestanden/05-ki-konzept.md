# 05 · KI-Konzept

**Grundsatz: Die KI ist die Tutorin, nicht das Produkt.** Das Produkt sind die geprüften Aufgaben, die
Bewertungsraster und die Übersicht für die Betriebe. Die KI arbeitet nur mit dem, was eine Fachperson
freigegeben hat. Eine Antwort, die nur aus dem Modell kommt, geht nie ungeprüft an Lernende.

## 1. Wofür die KI eingesetzt wird

| Einsatz | Wer sieht das Ergebnis | Grundlage im Prompt | Freigabe |
|---|---|---|---|
| **Entwürfe von Aufgaben** aus einem Lernziel | nur Redaktion | Lernziel-Text, Bildungsplan-Auszug, Stilregeln | **immer** Fachprüfung vor Veröffentlichung |
| **Bewertung von Kurzantworten** | Lernende | Aufgabe, Musterantwort, Bewertungsraster (geprüft) | Raster ist geprüft; Bewertung läuft automatisch, Stichprobe durch Fachperson |
| **Fachgespräch-Simulation**: Nachfragen stellen und bewerten | Lernende | Situation, Leitfragen, Raster, Musterantwort (geprüft) | wie oben |
| **«Warum?»-Nachfrage** zu einer Erklärung | Lernende | nur die freigegebene Erklärung der Aufgabe | wie oben |
| Hinweise auf gemeldete Fehler bündeln | Redaktion | Fehlermeldungen | Mensch entscheidet |

**Nicht vorgesehen:** freier Chat über alles, Themen ausserhalb des Bildungsplans, Hausaufgaben lösen,
persönliche Beratung.

## 2. Leitplanken

1. **Nur geprüftes Wissen:** Der Prompt enthält Musterantwort und Raster. Die Anweisung lautet: nur danach
   bewerten; fehlt etwas im Raster, «Frag deine Berufsbildnerin oder deinen Berufsbildner» antworten.
2. **Feste Ausgabeform:** Die KI liefert JSON (getroffene Kriterien, fehlende Kriterien, Punkte, kurze
   Rückmeldung in einfacher Sprache, Sicherheit hoch/mittel/tief). Der Server prüft das Format; bei Fehler
   wird nicht bewertet, sondern die Musterantwort gezeigt.
3. **Bei tiefer Sicherheit** keine Punkte, nur Musterantwort und die Frage «Hast du das so gemeint?».
4. **Einspruch:** Knopf «Bewertung stimmt nicht». Geht an die Fachperson; bestätigte Fehler verbessern das Raster.
5. **Stichprobe:** Im Pilot prüft die Fachperson wöchentlich 5 % der KI-Bewertungen (mindestens 20).
6. **Vor dem Start:** 200 Antworten, von der Fachperson bewertet, als Testsatz. Freigabe erst, wenn die KI
   in **≥ 85 %** der Fälle gleich bewertet wie die Fachperson (gleiche Punktzahl ± 1 Kriterium).
7. **Ton:** freundlich, kurz, du-Form, keine Ironie, keine Beschämung.
8. **Wohlbefinden:** Schreibt jemand etwas, das auf eine Krise hindeutet, bewertet die KI nicht, sondern
   zeigt Hilfe an: **147** (Pro Juventute, Beratung für Jugendliche, Telefon und Chat).
9. **Kein Profil über die Person:** Die KI bekommt keine Namen, keine Betriebe, keine früheren Antworten
   ausser der aktuellen Übung.

## 3. Datenschutz bei der KI

| Frage | Umsetzung |
|---|---|
| Welche Daten gehen an den KI-Anbieter? | Aufgabe, Raster, Musterantwort, **die eine Antwort** der Lernenden. Keine Namen, keine E-Mail, keine Organisation. Eine zufällige Anfrage-ID statt Benutzer-ID. |
| Wo wird verarbeitet? | Claude API von Anthropic (USA). Bekanntgabe ins Ausland nach Art. 16 revDSG: prüfen, ob der Anbieter unter dem Swiss-US Data Privacy Framework zertifiziert ist (vom Bundesrat seit 15.09.2024 als angemessen anerkannt); sonst Standardvertragsklauseln. **Vor dem Pilot klären.** Alternative prüfen: Claude über einen Cloud-Anbieter mit Rechenzentrum in der Schweiz oder der EU. |
| Werden Antworten zum Training verwendet? | Vertraglich ausschliessen; Aufbewahrung beim Anbieter so kurz wie möglich (Zero-Data-Retention anfragen). |
| Informieren wir? | Ja: in der Datenschutzerklärung und beim ersten Fachgespräch: «Deine Antwort wird ohne deinen Namen von einer KI bewertet.» Eigene Einwilligung `ai_feedback`, ohne sie nur Musterantwort. |
| Wie lange speichern wir Freitext? | 12 Monate, dann löschen; Punkte und Kriterien bleiben ohne Text. |

## 4. Modellwahl und Kosten

- **Pilot: Claude Opus 5** (`claude-opus-5`) für Bewertung und Fachgespräch, weil die Qualität bei
  Minderjährigen und bei fachlichen Details wichtiger ist als der Preis. Die Mengen im Pilot sind klein.
- **Ab ~1'000 aktiven Lernenden:** Mit dem Testsatz aus Abschnitt 2 prüfen, ob ein günstigeres Modell
  (Claude Sonnet 5) die 85 % ebenfalls erreicht. Nur wechseln, wenn ja.
- **Prompt-Caching** für den gleichbleibenden Teil (Anweisungen, Raster) senkt die Eingabekosten zusätzlich.

| Rechnung je Bewertung | Opus 5 ($5 / $25 je Mio. Tokens) | Sonnet 5 ($2 / $10) |
|---|---:|---:|
| 2'000 Eingabe-Tokens | $0.010 | $0.004 |
| 400 Ausgabe-Tokens | $0.010 | $0.004 |
| **je Bewertung** | **$0.020** | **$0.008** |
| × 150 Bewertungen je Lernende/r und Jahr | **$3.00** | $1.20 |
| Pilot: 50 Lernende × 20 Bewertungen/Monat | $20/Monat | $8/Monat |

Im Finanzmodell stehen **CHF 3 je aktive/r Nutzer/in und Jahr**. Das deckt Opus 5 ohne Caching-Rabatt.
Ein Fachgespräch mit zwei Nachfragen zählt als drei Bewertungen.

## 5. Grenzen, offen gesagt

- Die KI kann **fachlich falsch** bewerten. Deshalb Raster, Musterantwort, Stichprobe und Einspruch.
- Die KI kann das **Fachgespräch der Prüfung nicht ersetzen**. Prüfungsexperten achten auf Dinge, die ein
  Text nicht zeigt (Auftreten, Zeigen am Objekt).
- Die KI kann **Dialekt und Rechtschreibung** falsch lesen. Die Bewertung zählt Inhalt, nicht Rechtschreibung;
  das steht im Raster.
- Gesprochene Antworten (später) brauchen Spracherkennung für Schweizerdeutsch. Das ist ein eigener Test.
