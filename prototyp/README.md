# Prototyp – Leerstandsmanager

**Zweck:** sicherstellen, dass keine Kündigung, keine Abnahme und keine Schlussabrechnung
vergessen geht. Das Tool ist eine Pendenzen- und Fristenüberwachung für Mieterwechsel und
**ersetzt keine Datenhaltung** – Mieter-, Objekt- und Eigentümerdaten, Verträge und Buchungen
bleiben in Garaio REM, Dokumente auf SharePoint, Inserate in der VMZ. Jeder Schritt ist deshalb
gekennzeichnet, **wo** er auszuführen ist; ein Haken hier bedeutet nur, dass es dort erledigt wurde.

`leerstandsmanager.html` ist der lauffähige Prototyp aus Phase 6.

Veröffentlicht als Artifact: https://claude.ai/artifact/5wVJyvkUxngzAxzMJD4qUA

## Was er enthält

| Geforderter Bereich | Umsetzung |
|---|---|
| Startseite | Dashboard mit 4 Kennzahlen, Aufgabenliste nach Dringlichkeit, Warnungen, Schnellzugriffe |
| Navigation | Dashboard, drei Arbeitsbereiche (Kündigung & Abnahme · Wiedervermietung · Schlussabrechnung) mit Zähler, dann Alle Fälle, Auswertung, Stammdaten, Hilfe |
| Eingabemasken | Dialog «Neuer Fall» mit Pflichtfeldern, Dublettenprüfung und Klartext-Fehlermeldungen; Felder in der Fallakte |
| Datenübersichten | Fallliste mit Phasenbalken, Fallakte mit fünf Phasen, Stammdaten-Übersichten |
| Suche & Filter | Volltextsuche (Obj.-Nr., Liegenschaft, Mieter, Eigentümer), Filter nach Bewirtschafter, Phase, Status, Überfälligkeit |
| Berechnungen | Leerstandstage, Vorlauftage, Tage in Phase, Berichtsmonat, Kennzahlen, Durchlaufzeiten – alle abgeleitet |
| Statusanzeigen | Phasenbalken, Statuschips, Schrittzustände offen/erledigt/nicht erforderlich |
| Warnungen | verstrichene Termine, **überschrittene Sollfristen (30 Tage vor Wohnungsabgabe)**, doppelte offene Fälle, unplausible Daten, fehlende Pflichtangaben, Langläufer |
| Hilfe | Feldhilfe über das ⓘ-Symbol, Kasten «Nächster Schritt» je Fall, Ansicht «Hilfe & Prinzipien» mit vollständiger Spaltenzuordnung |
| Auswertungen | Kennzahlen je Bewirtschafter inkl. Methodenvergleich, drei Diagramme, Export |

## Rollen

Oben rechts wird der angemeldete Benutzer gewechselt – im Prototyp ohne Passwort, damit sich die
Sichten vergleichen lassen.

| Anmeldung | Startseite | Rechte |
|---|---|---|
| **BS Gesamt** (Teamleitung) | Teamübersicht über alle neun | alle Fälle bearbeiten, Zuständigkeit übergeben |
| **BS 01** (Teamleitung) | Teamübersicht Brandenburger · Breitmeier · Loa · Sivanesan | nur Fälle dieses Teams bearbeiten |
| **BS 02** (Teamleitung) | Teamübersicht Moren · Ryser · Scherb · Ademi · Fazliu | nur Fälle dieses Teams bearbeiten |
| die neun Bewirtschafter | «Mein Arbeitstag» | eigene Fälle bearbeiten, fremde lesen |

Das gewählte Team bestimmt den ganzen Sichtbereich: Kennzahlen, Arbeitsbereiche, Aufgabenstapel
und Auswertung. Die Auswertung ist nach Teams gruppiert und weist je Team ein Subtotal aus.
Die im Konzept beschriebene Rolle «Leseberechtigt» ist im Berechtigungsmodell enthalten, hat im
Prototyp aber keine Anmeldung mehr.

Die Rechte hängen nicht an ausgeblendeten Schaltflächen: jede ändernde Funktion prüft sie selbst
und lehnt ab, auch wenn sie direkt aufgerufen wird.

## Durcharbeiten

«Aufgaben durcharbeiten» führt Fall für Fall durch den Arbeitsvorrat – vom Dashboard über alle
Aufgaben, aus einem Arbeitsbereich nur über dessen Aufgaben, aus einer Mitarbeiteransicht über
deren Aufgaben. Die Leiste zeigt den Fortschritt und bietet Zurück, Später und Beenden.
Nach einer Aktion springt die Anwendung selbst weiter, sobald an diesem Fall nichts Dringendes
mehr offen ist. «Später» stellt den Fall mit Datum zurück, protokolliert das und nimmt ihn am
Stichtag wieder auf.

## Abgeleitete Sollfristen

Jede Frist hängt an dem Datum, das sie auslöst:

| Schritt | Anker | Frist | Konstante |
|---|---|---|---|
| Abnahmetermin vereinbaren | Haftungsdatum | 30 Tage **vorher** | `VORLAUF_ABNAHME` |
| Handwerker aufbieten | Tag der durchgeführten Abnahme | 3 Tage **danach** | `FRIST_HANDWERKER` |

Eine Frist entsteht erst, wenn ihr Ankerdatum feststeht: ohne Haftungsdatum keine
Abnahmefrist, ohne durchgeführte Abnahme keine Handwerkerfrist – und damit kein Fehlalarm.
Wird die Abnahme erledigt, meldet die Anwendung die dadurch gesetzte Folgefrist und schreibt
sie in die Historie.

Solange kein eigener Termin gesetzt ist, heisst der Schritt nach der Handlung, die ansteht
(«Abnahmetermin vereinbaren» statt «Wohnungsabnahme durchgeführt»). Ein manuell gesetzter
Termin überschreibt die Sollfrist immer.

Beide Konstanten stehen im Abschnitt «Prozessmodell» und sind dort änderbar. Weitere Schritte
lassen sich nach demselben Muster mit `soll: {anker, offset, txt}` versehen.

Das Haftungsdatum entspricht immer dem Mietende – bei vorzeitiger Rückgabe wird ausserordentlich
gekündigt und das Mietende angepasst. Ein separates Feld `Mietende` gibt es deshalb bewusst nicht.
Wird das Haftungsdatum nachträglich verschoben, meldet die Anwendung sofort, wohin
Leerstandsbeginn und Sollfristen wandern, und schreibt beides in die Historie. Geändert wird es
über «ändern» in der Datenübersicht der Fallakte, die die zugehörige Phase dafür aufklappt.

## Datenintegrität

Gespeicherte Daten werden beim Laden durch `normalisiereFall()` geprüft und repariert: fehlende
Schritte werden ergänzt, unbekannte verworfen, falsche Typen korrigiert, unlesbare Datensätze
übersprungen und gemeldet. Damit übersteht ein bestehender Bestand auch das Hinzufügen neuer
Prozessschritte. Schlägt das Speichern fehl (privates Fenster, voller Speicher), wird das
gemeldet statt stillschweigend verschluckt. Ein zweites Fenster derselben Anwendung übernimmt
Änderungen, statt sie zu überschreiben.

## Tests

`node test-protokoll.js` fährt 52 Prüfungen gegen die Datei: Navigation, Bearbeiten, Speichern,
Löschen, Suche, Filter, Sortierung, Statuslogik, Formulare, neun Varianten beschädigter
Datenbestände, XSS, leerer Bestand, 500 Datensätze und vier Bildschirmbreiten. Benötigt Playwright
und die Vorschaudatei aus `build-standalone.sh`.

## Technische Hinweise

- Eine Datei, keine Abhängigkeiten ausser Google Fonts (mit Fallback-Schriften).
- Die Datei ist im Artifact-Format geschrieben, also ohne `<!doctype>`, `<html>`, `<head>` und `<body>` –
  diese Hülle ergänzt die Veröffentlichung. Für eine Datei, die sich lokal per Doppelklick öffnen
  lässt, erzeugt `./build-standalone.sh` daraus `Leerstandsmanager.html` mit der nötigen Hülle
  (Zeichensatz und Viewport). Ohne diese Hülle werden Umlaute falsch dargestellt.
  Die erzeugte Datei wird bewusst nicht mitversioniert, damit es nur eine Quelle gibt.
- Demodaten liegen im `localStorage` des jeweiligen Browsers, sind also pro Benutzer getrennt und
  erreichen niemanden sonst. «Demodaten zurücksetzen» stellt den Ausgangszustand her.
- Alle Termine sind relativ zum aktuellen Datum erzeugt, damit Überfälligkeiten und Fristen
  jeden Tag realistisch bleiben.
- Datumsfelder werden vom Browser in dessen Gebietsschema dargestellt; in der Schweizer
  Einstellung erscheint TT.MM.JJJJ.

## Bekannte Grenzen des Prototyps

Kein Server, keine Benutzerverwaltung, kein echter Login und keine Rollentrennung – der Prototyp
läuft immer als Bewirtschafter «Moren». Export erfolgt als kopierbarer Text statt als Datei.
Diese Punkte gehören in die technische Umsetzung (Konzept Abschnitt 7), nicht in den Prototyp.
