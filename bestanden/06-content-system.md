# 06 · Content-System und Qualitätssicherung

**Regel 1:** Keine Aufgabe erscheint bei Lernenden, ohne dass eine Fachperson des Berufs sie geprüft hat.
**Regel 2:** Jede Aufgabe hängt an einem Leistungsziel aus dem gültigen Bildungsplan.
**Regel 3:** Nichts wird aus fremden Prüfungen, Lehrmitteln oder Normen abgeschrieben.

## 1. Felder jeder Aufgabe

| Feld | Pflicht | Beispiel |
|---|---|---|
| ID, Version | ja | `SAN-b3-0042`, v3 |
| Beruf, BiVo-Fassung, Bildungsplan-Version | ja | Sanitär EFZ, SR 412.101.220.73 (Stand prüfen), Bildungsplan Fassung gemäss suissetec |
| Handlungskompetenzbereich, Handlungskompetenz, Leistungsziel | ja | b / b.3 / Leistungsziel-Code aus dem Bildungsplan |
| Lernort | ja | Betrieb / Berufsfachschule / üK |
| Lehrjahr, Semester | ja | 3 / 5 |
| Taxonomie | ja | K1–K6 |
| Aufgabentyp, Schwierigkeit 1–5 | ja | Zahl mit Einheit, 3 |
| Aufgabentext, Antworten, Lösung, Erklärung | ja | in `QuestionTranslation` |
| Bewertungsraster und Musterantwort | bei Kurzantwort und Fachgespräch | 3–5 Kriterien mit Punkten |
| Medien mit Quelle und Lizenz | wenn vorhanden | eigenes Foto, Einwilligung der abgebildeten Firma |
| Quellenhinweis | ja | «sinngemäss nach Bildungsplan, Leistungsziel …»; bei Normen nur Verweis auf Kapitel |
| Entwurf durch | ja | KI / Redaktion / Fachperson |
| **Fachlich geprüft durch, am** | ja | Name der Fachperson, Datum |
| Didaktisch geprüft durch, am | ja | Redaktion (einfache Sprache, eindeutig) |
| **Review-Datum** (nächste Überprüfung) | ja | spätestens 12 Monate nach Freigabe oder bei neuer Bildungsplan-Version |
| Status | ja | siehe Abschnitt 2 |
| Kennzahlen | automatisch | Anteil richtig, Zeit, Fehlermeldungen, Trennschärfe |

## 2. Ablauf

```
Entwurf (KI oder Mensch)
   │
   ▼
Redaktion: Sprache, Eindeutigkeit, Bild, Leistungsziel zugeordnet
   │
   ▼
Fachprüfung durch Fachperson ── abgelehnt ──► zurück an Redaktion mit Begründung
   │ freigegeben
   ▼
Pilot-Einsatz (max. 50 Lernende) ── Kennzahlen auffällig ──► Überprüfung
   │ unauffällig nach 100 Antworten
   ▼
Im Einsatz ── Fehlermeldung bestätigt ──► sofort ausblenden, korrigieren, neue Version
   │
   ▼
Review fällig (Datum oder neue Bildungsplan-Version) ──► Fachprüfung ──► Im Einsatz / Archiviert
```

**Auffällig** heisst: weniger als 20 % oder mehr als 95 % richtig, oder zwei Fehlermeldungen, oder
Trennschärfe negativ (gute Lernende lösen sie seltener als schwache).

**Versionen:** Eine Änderung erzeugt eine neue Version. Alte Antworten bleiben der alten Version zugeordnet.

## 3. Fachperson je Beruf

| Anforderung | Warum |
|---|---|
| EFZ im Beruf, mind. 3 Jahre Praxis, Berufsbildner/in oder üK-Instruktor/in | gleiche Anforderung wie die BiVo an Berufsbildner (Sanitär: EFZ mit mind. 3 Jahren Praxis im Lehrgebiet) |
| **Nicht** gleichzeitig Prüfungsexpert/in im laufenden QV | kein Anschein, dass Prüfungsaufgaben verwendet werden |
| Vertrag: Honorar, Übertragung der Rechte an den Aufgaben, Vertraulichkeit | Rechte liegen bei «bestanden» |
| Aufwand erster Beruf | ~50 h im ersten Jahr: 300 Aufgaben à ~8 Min. Prüfung + Raster für 30 Fachgespräche |

**Wichtig:** Die Fachperson darf dafür keine Unterlagen ihres Arbeitgebers oder aus dem üK verwenden, die
nicht öffentlich sind. Das steht im Vertrag.

## 4. Urheberrecht und Quellen

| Quelle | Darf man sie verwenden? | Wie |
|---|---|---|
| Bildungsverordnung (Fedlex) | ja, amtlicher Erlass (URG Art. 5) | zitieren, Codes übernehmen |
| Bildungsplan des Verbands | Inhalt nutzen ja, Text nicht kopieren (Status als amtliches Werk unklar, prüfen) | Leistungsziele sinngemäss, Codes als Verweis |
| Frühere QV-Aufgaben, üK-Unterlagen, Lehrmittel von Verlagen | **nein** | nicht verwenden, auch nicht als KI-Vorlage |
| Normen und Richtlinien (z. B. SVGW, SIA) | Inhalte sind Fachwissen, Texte und Tabellen geschützt | eigene Formulierung, Verweis auf Kapitel, keine Tabellen abbilden; Lizenz beim Herausgeber anfragen, wenn nötig |
| Fotos von Baustellen | nur eigene oder lizenzierte | Einwilligung der Firma, keine Personen erkennbar |

## 5. Umfang im MVP (Sanitär, Deutsch)

| Paket | Menge | Wann |
|---|---:|---|
| Einstufung | 12 Aufgaben | Woche 4 |
| Tagestraining 3. und 4. Lehrjahr | 250 Aufgaben | Woche 4–8 |
| Kurzantworten mit Raster | 40 | Woche 8 |
| Fachgespräch-Situationen mit Leitfragen und Raster | 20 | Woche 9–10 |
| Semester-Checks (2 HKB) | 2 × 20 Aufgaben aus dem Bestand | Woche 9 |

Zuerst die Lehrjahre, die im Pilot sind (3. und 4.), dann das 1. und 2. Lehrjahr bis August 2027.

## 6. Kennzahlen der Qualität

| Kennzahl | Ziel im Pilot |
|---|---|
| Bestätigte Fehler je 100 freigegebene Aufgaben | < 1 |
| Zeit von Fehlermeldung bis Ausblenden | < 24 h |
| Übereinstimmung KI-Bewertung mit Fachperson | ≥ 85 % |
| Aufgaben mit abgelaufenem Review-Datum im Einsatz | 0 |
