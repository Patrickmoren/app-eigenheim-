# Prototyp – Leerstandsmanager

`leerstandsmanager.html` ist der lauffähige Prototyp aus Phase 6.

Veröffentlicht als Artifact: https://claude.ai/artifact/5wVJyvkUxngzAxzMJD4qUA

## Was er enthält

| Geforderter Bereich | Umsetzung |
|---|---|
| Startseite | Dashboard mit 4 Kennzahlen, Aufgabenliste nach Dringlichkeit, Warnungen, Schnellzugriffe |
| Navigation | vier Punkte (Dashboard, Fälle, Auswertung, Stammdaten) plus Hilfe, ohne Untermenüs |
| Eingabemasken | Dialog «Neuer Fall» mit Pflichtfeldern, Dublettenprüfung und Klartext-Fehlermeldungen; Felder in der Fallakte |
| Datenübersichten | Fallliste mit Phasenbalken, Fallakte mit fünf Phasen, Stammdaten-Übersichten |
| Suche & Filter | Volltextsuche (Obj.-Nr., Liegenschaft, Mieter, Eigentümer), Filter nach Bewirtschafter, Phase, Status, Überfälligkeit |
| Berechnungen | Leerstandstage, Vorlauftage, Tage in Phase, Berichtsmonat, Kennzahlen, Durchlaufzeiten – alle abgeleitet |
| Statusanzeigen | Phasenbalken, Statuschips, Schrittzustände offen/erledigt/nicht erforderlich |
| Warnungen | verstrichene Termine, **überschrittene Sollfristen (30 Tage vor Wohnungsabgabe)**, doppelte offene Fälle, unplausible Daten, fehlende Pflichtangaben, Langläufer |
| Hilfe | Feldhilfe über das ⓘ-Symbol, Kasten «Nächster Schritt» je Fall, Ansicht «Hilfe & Prinzipien» mit vollständiger Spaltenzuordnung |
| Auswertungen | Kennzahlen je Bewirtschafter inkl. Methodenvergleich, drei Diagramme, Export |

## Abgeleitete Sollfristen

Sobald das Haftungsdatum erfasst ist, rechnet die Anwendung rückwärts: `VORLAUF_ABNAHME`
(Standard 30 Tage) vor der Wohnungsabgabe werden **«Abnahmetermin vereinbaren»** und
**«Handwerker aufbieten»** fällig. Solange kein eigener Termin gesetzt ist, heisst der Schritt
nach der Handlung, die ansteht; ein manuell gesetzter Termin überschreibt die Sollfrist.
Ohne Haftungsdatum entsteht keine Sollfrist und damit auch kein Fehlalarm.

Die Frist steht als einzelne Konstante im Abschnitt «Prozessmodell» und ist dort änderbar.

Das Haftungsdatum entspricht immer dem Mietende – bei vorzeitiger Rückgabe wird ausserordentlich
gekündigt und das Mietende angepasst. Ein separates Feld `Mietende` gibt es deshalb bewusst nicht.
Wird das Haftungsdatum nachträglich verschoben, meldet die Anwendung sofort, wohin
Leerstandsbeginn und Sollfristen wandern, und schreibt beides in die Historie. Geändert wird es
über «ändern» in der Datenübersicht der Fallakte, die die zugehörige Phase dafür aufklappt.

## Technische Hinweise

- Eine Datei, keine Abhängigkeiten ausser Google Fonts (mit Fallback-Schriften).
- Die Datei ist im Artifact-Format geschrieben, also ohne `<!doctype>`, `<html>`, `<head>` und `<body>` –
  diese Hülle ergänzt die Veröffentlichung. Zum lokalen Öffnen im Browser genügt eine Hülle mit
  `<meta charset="utf-8">`, sonst werden Umlaute falsch dargestellt.
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
