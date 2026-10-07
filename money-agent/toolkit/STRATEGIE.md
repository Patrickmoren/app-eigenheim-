# Vermieter-Toolkit Schweiz – Produktstrategie (07.10.2026)

**Kurzfassung:** Die sechste Kernfunktion ist **«Wohnungsrückgabe: Schaden & Kaution»**. Sie erreicht 82/100, der nächste Kandidat 70. Zwei bestehende Module sind als eigenständige Module zu schwach: Die **Checkliste** wird Teil des Mieterwechsel-Planers. Das **Abnahmeprotokoll** wird zur Eingabe für das neue Modul. Den frei werdenden Platz füllt die Basis **«Mein Haus»**: Dort werden alle Daten einmal erfasst. Preis: **CHF 49**, als befristeter Einführungspreis CHF 39.

Grundlage: Repository-Stand mit drei gebauten und geprüften Modulen (Nebenkosten, Mieterwechsel, Wohnungsrückgabe). **Mietzinsrechner, Checkliste und Abnahmeprotokoll liegen nicht im Repository.** Sie sind nach der Beschreibung bewertet und nicht getestet.

---

## A — Marktanalyse: die Probleme privater Vermieter

| Problem | Häufigkeit | Was es kostet | Beleg |
|---|---|---|---|
| Streit um Schäden und Kaution bei der Rückgabe | bei jedem Auszug | Hunderte bis Tausende CHF; Verwirkung bei zu später Rüge (Art. 267a OR) | Zweithäufigster Streitpunkt der Vermieterseite: wer Mängel behebt oder bezahlt [^1] |
| Ausstehende Mietzinse | selten, aber teuer | Mietausfall, formfehlerhafte Kündigung nach Art. 257d OR ist nichtig | Häufigster Streitpunkt der Vermieterseite [^1] |
| Nebenkostenabrechnung | jährlich | 2–6 h; Mieter verlangen oft eine Überprüfung | Häufiges Thema der Mieterseite [^1] |
| Mietzins und Referenzzinssatz | bei jeder Änderung des Satzes | Senkungsbegehren; Gegenrechnung von Teuerung und Kosten ist fehleranfällig | Satz seit 2.9.2025 bei 1.25 %, am 1.9.2026 bestätigt [^2][^3] |
| Fristen beim Mieterwechsel | 1–2× pro Jahr bei 6 Wohnungen | Leerstand, verpasste Rüge- und Kautionsfristen | Art. 266c, 267a, 257e OR |
| Steuern: Liegenschaftenverzeichnis, Pauschal- oder effektive Abzüge | jährlich | falsche Wahl kostet Steuern; kantonal unterschiedlich | [^4] |

Kontext: Rund 47 % der Mietwohnungen gehören Privatpersonen (BFS 2022). 2023 gab es 43'063 neue Schlichtungsverfahren in Mietsachen, 80 % mehr als im Vorjahr, getrieben durch die Zinswende [^1].

**Erkenntnis:** Am meisten Geld steht bei **Rückgabe und Kaution** auf dem Spiel. Am häufigsten wiederkehrend ist die **Nebenkostenabrechnung**. Am aktuellsten ist der **Mietzins**.

## B — Bewertung der fünf bestehenden Module (kritisch)

| Modul | Problem | Häufigkeit | Zeit/Geld | Konkurrenz / Gratis-Alternativen | Score | Urteil |
|---|---|---|---|---|---:|---|
| Nebenkostenabrechnung | Kosten korrekt verteilen, Mieterwechsel, Leerstand | jährlich | 2–6 h, Streit vermeiden | Verwaltungssoftware im Abo, deutsche Vorlagen (falsches Recht) | **84** | Stärkstes bestehendes Modul. Die Tests fanden **2 Fehler** (siehe K), beide behoben. Lücken: verbrauchsabhängige Heizkosten (Zähler) und Heizöl-Lagerbestand fehlen; bei älteren Häusern häufig nötig. |
| Mietzinsrechner | Anpassung an Referenzzins, Teuerung, Kosten | bei Zinsänderung | hoch (Senkungsbegehren) | Rechner des MV (Mietersicht), Beratung HEV | **78*** | *Nicht geprüft. Muss korrekt sein: Senkung 2.91 % vs. Erhöhung 3 % pro 0.25 Prozentpunkte (unter 5 %), Teuerung zu 40 %, allgemeine Kostensteigerung kantonal unterschiedlich (heikel), Erhöhung nur mit amtlichem Formular (Art. 269d OR). |
| Mieterwechsel & Leerstand | Mietende, Fristen, Leerstandskosten | 1–2×/Jahr | verpasste Fristen vermeiden | Gratis-Kündigungsrechner | **70** | Gut als Fristenwerkzeug, aber kein Kaufgrund allein. |
| Wohnungsabnahmeprotokoll | Zustand bei der Rückgabe festhalten | bei jedem Wechsel | Beweis für den Streitfall | **MV gratis als interaktives PDF**, HEV-Formular | **45** | Allein kaum Mehrwert. Wert entsteht erst, wenn das Protokoll direkt zur Schadenberechnung führt. |
| Checkliste Mieterwechsel | nichts vergessen | 1–2×/Jahr | gering | überall gratis (HEV, MV, Portale) | **30** | Kein eigenständiges Modul. In den Mieterwechsel-Planer integrieren: Er führt die Schritte bereits mit Datum und Ampel. |

## C — 20 Kandidaten für Funktion Nr. 6

Vollständige Tabelle mit allen Einzelwerten: [`kandidaten.md`](kandidaten.md), Bewertung in [`kandidaten.py`](kandidaten.py). Gewichte: Häufigkeit 20 %, Schmerz 20 %, Zahlungsbereitschaft 15 %, Synergie 15 %, Konkurrenz 10 %, Excel-Umsetzbarkeit 10 %, Verkaufsargument 10 %.

| Rang | Kandidat | Score |
|---:|---|---:|
| 1 | **Schaden & Kautionsabrechnung nach Lebensdauertabelle** | **82** |
| 2 | Mietzinsjournal & Mahnwesen (Art. 257d OR) | 70 |
| 3 | Fristen-Cockpit über alle Module | 70 |
| 4 | Steuer-Jahresübersicht Liegenschaft | 66 |
| 5 | Überwälzung wertvermehrender Investitionen (Art. 14 VMWG) | 62 |
| 6–7 | Korrespondenz-Vorlagen · Unterhaltsplanung | 56 |
| 8 | Kautionsverwaltung allein | 55 |
| 9–11 | Mietzinsreduktion bei Mängeln · Anfangsmietzins · Zählerstände | 54 |
| 12 | Mängel-/Handwerker-Tracker | 53 |
| 13 | Mieterauswahl | 52 |
| 14 | Stockwerkeigentum-Abrechnung | 50 |
| 15 | Mietvertrag-Generator | 49 |
| 16 | Betreibungs-Hilfe | 48 |
| 17–18 | Renditerechner · Inserattext | 39 |
| 19 | Versicherungsübersicht | 35 |
| 20 | Untermiete prüfen | 30 |

## D — Sieger

**Wohnungsrückgabe: Schaden & Kaution.** Gebaut und geprüft: [`products/rueckgabe-ch/`](../products/rueckgabe-ch/)

Mängel aus dem Abnahmeprotokoll → Anteil des Mieters nach Lebensdauer → Kautionsabrechnung → unterschriftsreife Freigabe für die Bank.

## E — Begründung

1. **Warum diese?** Höchster Score. Kein anderer Kandidat verbindet so viel Geld pro Fall mit so hohem Streitpotenzial.
2. **Problem:** Was darf ich von der Kaution abziehen? Wer einen 20-jährigen Parkettboden voll verrechnet, verliert vor der Schlichtungsbehörde. Wer zu wenig verlangt, verschenkt Geld.
3. **Warum braucht der Vermieter das?** Der Mieter zahlt nur den Restwert. Die Rechnung «Kosten × (1 − Alter ÷ Lebensdauer)» macht kaum ein Laie korrekt. Ausserdem muss die Kaution korrekt auf Vermieter und Mieter aufgeteilt werden.
4. **Häufigkeit:** bei jedem Auszug, also bei 6 Wohnungen typisch 1–2× pro Jahr. Jeder Einsatz betrifft Hunderte Franken.
5. **Besser als die anderen:** Das Mietzinsjournal (70) ist häufiger im Einsatz, aber E-Banking deckt das Kontrollieren grösstenteils ab, und es hat keinen Aha-Effekt. Das Fristen-Cockpit (70) ist eine Integrationsschicht und wird Teil von «Mein Haus». Die Steuerübersicht (66) ist kantonal zu unterschiedlich und deshalb rechtlich riskant.
6. **Konkurrenz:** HEV und MV zeigen die Lebensdauer online (Auszug gratis, vollständige Tabelle kostenpflichtig) [^5]. Keiner der beiden rechnet die Abrechnung und die Kautionsaufteilung durch oder erzeugt die Freigabe.
7. **Warum CHF 39+:** Bereits ein einziger korrekt begründeter Abzug ist mehr wert als der Preis.
8. **Passung:** Mietende kommt aus dem Mieterwechsel-Planer, der Nebenkosten-Saldo aus der Nebenkostenabrechnung, die Mängel aus dem Abnahmeprotokoll. Das Modul schliesst den Mieterwechsel ab.

**Rechtlich heikel (gekennzeichnet im Modul):** Die Lebensdauertabelle ist Praxis, kein Gesetz. Das Modul enthält die Tabelle nicht, weil sie urheberrechtlich geschützt und kostenpflichtig ist. Der Nutzer trägt die Lebensdauer selbst ein. Beispielwerte sind als solche markiert.

## F — Produktarchitektur

```
                 ┌──────────────── MEIN HAUS (einmal erfassen) ────────────────┐
                 │ Einheiten: Nr · Zimmer · Fläche · Wertquote                  │
                 │ Mietverhältnisse: Mieter · Beginn · Ende · Nettomiete ·      │
                 │ Akonto · Kaution · Referenzzins/LIK der letzten Anpassung    │
                 └──┬──────────────┬──────────────┬──────────────┬─────────────┘
                    ▼              ▼              ▼              ▼
   Kündigung → MIETERWECHSEL → ABNAHME-      → WOHNUNGS-    ← NEBENKOSTEN
               & FRISTEN       PROTOKOLL       RÜCKGABE       (Saldo je Mieter)
               (Mietende,      (Mängelliste)   Schaden &
               Checkliste)                     Kaution
                    │                                          MIETZINSRECHNER
                    └──── Nachmieter: neuer Mietzins ─────────► (Referenzzins, LIK)
```

| Datenfeld | erfasst in | verwendet von |
|---|---|---|
| Einheit, Fläche, Wertquote | Mein Haus | Nebenkosten |
| Mieter, Beginn, Ende | Mein Haus / Mieterwechsel | Nebenkosten, Rückgabe, Mietzins |
| Nettomiete | Mein Haus | Mietzins, Leerstandskosten |
| Akonto | Mein Haus | Nebenkosten |
| Kaution, Kautionskonto | Mein Haus | Rückgabe, Freigabe |
| Nebenkosten-Saldo | Nebenkosten | Rückgabe |
| Mängel | Abnahmeprotokoll | Rückgabe |
| Referenzzins/LIK der letzten Anpassung | Mein Haus | Mietzins |

**Sechs Teile, keine Füllfunktion:** Die Basis «Mein Haus» plus fünf Werkzeuge. Die Checkliste verschwindet als eigenes Modul. Ihr Inhalt lebt im Mieterwechsel-Planer weiter, mit Datum und Ampel statt Häkchen auf Papier.

## G — UX

- **Startseite:** sechs Kacheln mit internen Links, im Workflow von links nach rechts. Darunter: «Was steht an?» mit den nächsten drei Fristen aus allen Modulen.
- **Jedes Modul** beginnt mit vier Zeilen: **START** (was eingeben) · **BERECHNUNG** (was passiert) · **ERGEBNIS** (was tun) · **AUSGABE** (was drucken oder senden). Im neuen Modul umgesetzt.
- **Farben:** Gelb = Eingabe, Blau = rechnet automatisch und ist geschützt.
- **Jedes Modul hat ein Blatt «Kontrolle»** mit Status OK oder «Bitte prüfen» und dem Grund pro Zeile.
- **Druckblätter** passen auf eine A4-Seite.

## H — Preis

| Preis | Conversion | Wahrgenommener Wert | Einschätzung |
|---|---|---|---|
| CHF 19 | hoch | «billige Vorlage», untergräbt Vertrauen in die rechtliche Korrektheit | zu tief |
| CHF 29 | hoch | Einzelvorlagen-Niveau (DE: EUR 15–39) | verschenkt Marge |
| CHF 39 | gut | fair | gut als Einführungspreis |
| **CHF 49** | gut für Liegenschaftseigentümer | ein vermiedener Fehlabzug deckt den Preis mehrfach | **Empfehlung** |
| CHF 59 | spürbar tiefer ohne Bewertungen | bräuchte Referenzen | nach 30+ Bewertungen testen |
| CHF 79 | tief | Software-Niveau, Vergleich mit Abo-Lösungen | nein |

**Empfehlung:** Regulär CHF 49, Einführungspreis CHF 39 bis 31.12.2026. Der spätere Preis muss genannt und danach tatsächlich verlangt werden (Preisbekanntgabeverordnung). Die 14-Tage-Garantie bleibt. Bei einem Download-Produkt ist ein Teil der Rückerstattungen Missbrauch; budgetiert sind 5 %.

## I — Verkaufspositionierung

**Name:** Vermieter-Ordner Schweiz

**Nutzenversprechen:** «Die fünf Aufgaben, bei denen private Vermieter am meisten Geld und Nerven verlieren – korrekt nach Schweizer Mietrecht, in Excel, ohne Abo.»

**Aufhänger (Headline):** «Wie viel dürfen Sie von der Kaution abziehen? In fünf Minuten belegt nach Lebensdauertabelle.»

Reihenfolge auf der Verkaufsseite (nach Verkaufsargument):
1. **Wohnungsrückgabe: Schaden & Kaution:** vom Protokoll zur unterschriftsreifen Kautionsfreigabe
2. **Nebenkostenabrechnung:** Mieterwechsel taggenau, Leerstand beim Eigentümer, eine A4-Seite pro Mieter
3. **Mietzinsrechner:** Referenzzinssatz 1.25 %, Teuerung, Senkungsbegehren beantworten
4. **Mieterwechsel & Fristen:** Mietende, Abnahme, Rügefrist, Kautionsfrist, Ampel
5. **Abnahmeprotokoll:** vor Ort ausfüllen, Mängel fliessen in die Kautionsabrechnung
6. **Mein Haus:** alles einmal erfassen, alle Fristen auf einen Blick

Hauptargumente: Schweizer Recht statt deutscher Vorlage · jede Berechnung nachvollziehbar und belegt · Kontrollblatt in jedem Modul · kein Abo, keine Cloud, keine Registrierung · 14 Tage Geld-zurück.

## J — Technische Umsetzung

1. **Eine Arbeitsmappe** `Vermieter-Ordner.xlsx` statt fünf Dateien. Externe Bezüge zwischen Dateien sind in Numbers und auf dem Mac unzuverlässig.
2. Blatt **Mein Haus** mit zwei festen Tabellen: Einheiten mit 30 Zeilen, Mietverhältnisse mit 60 Zeilen und laufender Nummer.
3. Die Module verweisen über die Nummer per `INDEX/MATCH` auf Mein Haus. Keine Datenkopien.
4. Das Modul Rückgabe übernimmt: Mietende, Kaution und Mieter aus Mein Haus, den Nebenkosten-Saldo aus der Verteilung der Nebenkosten und die Mängelzeilen 1:1 aus dem Abnahmeprotokoll (gleiche Spalten Raum, Bauteil, Mangel).
5. **Kompatibilität:** keine Makros, kein `FILTER`, keine dynamischen Matrixformeln. Im neuen Modul auch kein `TEXT()`. Die Nebenkostenabrechnung nutzt `TEXT()` für Datumszeilen und muss auf Numbers geprüft werden. Blattschutz und Auswahllisten übernimmt Numbers nur teilweise; die Rechnung funktioniert trotzdem.
6. **Nächster Schritt:** Die bestehende Datei mit Mietzinsrechner, Checkliste und Protokoll hochladen. Dann führe ich alles in eine Mappe zusammen und teste Mietzinsrechner und Protokoll mit derselben Prüfstrecke.

## K — Qualitätsprüfung

| Modul | Prüfstrecke | Fälle | Ergebnis |
|---|---|---:|---|
| Nebenkosten | `pruefe_faelle.py`: einfach · mehrere Wohnungen und Schlüssel · mehrere Wechsel und Leerstand · Periode über Jahreswechsel mit Schaltjahr · Nullwerte und Gutschrift (negativ) | 18 | alle = Python-Rechnung |
| Nebenkosten | Fehlerfälle: unbekannte Einheit · Mietende vor Mietbeginn · Überlappung · Schlüssel-Total 0 · Kosten ohne Schlüssel | 5 | **2 Fehler gefunden und behoben:** Mietende vor Mietbeginn und Schlüssel-Total 0 wurden nicht gemeldet. Im zweiten Fall blieben die Kosten stillschweigend beim Eigentümer. |
| Nebenkosten | `pruefe_alles.sh`: Beispiel | 6 | OK |
| Mieterwechsel | `pruefe.py`: Grenzfälle Eingangsdatum × 3 Termin-Einstellungen, Feiertage, Jahreswechsel, vereinbartes Ende | 24 | OK |
| Rückgabe (neu) | `pruefe.py`: Beispiel · älter als Lebensdauer · neu eingebaut · Forderungen > Kaution · Guthaben > Forderungen · ohne Kaution/Nullwerte | 6 | alle = Python-Rechnung |
| Rückgabe (neu) | Fehlerfälle: Einbaudatum fehlt · Einbau nach Mietende · negative Kosten · Ursache fehlt · Mietende fehlt | 5 | alle erkannt |
| Website-Rechner | gleiche Fristregeln wie Excel | 7 | OK |
| Mietzinsrechner, Checkliste, Protokoll | – | – | **nicht prüfbar, Datei fehlt** |
| Apple Numbers | – | – | **nicht prüfbar in dieser Umgebung**, Test auf einem Mac nötig |

---

[^1]: Südostschweiz/SDA, Schlichtungsstatistik: https://www.suedostschweiz.ch/leben-freizeit/mieterstreit-extremfaelle-sind-eher-selten-1129880 · BFS-Zahlen: https://www.admin.ch/de/newnsb/D1tXh6OL8vtNfniAzttnU
[^2]: plattformj.ch, 1.9.2026: https://www.plattformj.ch/artikel/246336/
[^3]: law.ch, 2.6.2026: https://law.ch/lawnews/2026/06/hypothekarischer-referenzzinssatz-per-02-06-2026-weiterhin-bei-1-komma-25-prozent/ · Senkungsanspruch 2.91 %: https://www.captain.legal/ch-de/blog/mietzinssenkung-referenzzinssatz-schweiz/
[^4]: UBS, Steuern auf Mieteinnahmen: https://www.ubs.com/ch/de/services/guide/mortgages-and-financing/articles/tax-rental-income.html
[^5]: Comparis, Lebensdauertabelle: https://www.comparis.ch/immobilien/umzug/vor-dem-umzug/lebensdauertabelle-mieterschaeden · MV-Auszug 2024: https://mieterverband.ch/dam/jcr:511293fb-f710-4111-8f7f-edd8de79a9f7/mp_Lebensdauertabelle_2024_Einlageseiten_Web.pdf · MV-Abnahmeprotokoll gratis: https://mieterverband.ch/dam/jcr:b5496e2f-0438-4ab3-8903-fd697e714c01/2021_Wohnungsabnahmeprotokoll_mp_interaktiv.pdf
