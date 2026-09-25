# 08 · Roadmap: die ersten 12 Wochen

Start Montag, 28.09.2026. Du arbeitest abends, rund **10 Stunden pro Woche**. Claude programmiert und
schreibt Entwürfe; du führst die Gespräche, entscheidest und testest.
Jede Woche endet mit einem **Entscheid**. Ist das Kriterium nicht erfüllt, gilt die Anweisung in der Spalte.

| Woche | Daten | Aufgaben | Ziel | Ergebnis | KPI | Entscheid |
|---|---|---|---|---|---|---|
| **1** Problem | 28.09.–04.10. | Arbeitsvertrag auf Nebenerwerb prüfen. Liste von 20 Sanitärfirmen aus deinem **privaten** Netzwerk. 10 anrufen, 5 Gespräche mit Berufsbildner/innen vereinbaren. 5 Lernende (3./4. Lehrjahr) über Betriebe oder Bekannte finden. Leitfaden aus 11-validierung-und-pilot.md. | Zugang zu Betrieben und Lernenden | 5 + 5 Termine | ≥ 8 Termine vereinbart | < 5 Termine: Liste auf 40 Firmen erweitern, auch Heizung |
| **2** Problem | 05.10.–11.10. | 10 Gespräche führen (je 30 Min.), Notizen nach Vorlage. Offizielle Unterlagen holen: Bildungsplan Sanitär, Ausführungsbestimmungen QV (suissetec). Zahl der Lernenden je Gebäudetechnik-Beruf beim BFS nachschlagen. | Problem bestätigt oder verworfen | Auswertung 1 Seite | siehe Gate 1 | **Gate 1** (12-risiken-und-gates.md). Nicht bestanden: Plan B Automobil-Fachmann/-frau prüfen, 2 Wochen |
| **3** UX | 12.10.–18.10. | Klick-Prototyp der 6 Bildschirme (03-produktkonzept-und-ux.md) aus dem bestehenden Prototyp ableiten. 3 Lernenden und 2 Berufsbildnern zeigen. Fachperson Sanitär suchen (Honorar, Vertrag). | Bildschirme verstanden | Prototyp v3, Fachperson zugesagt | 4 von 5 finden ohne Hilfe «Training starten» und «Freigaben» | Fachperson fehlt: über suissetec-Sektion oder üK-Zentrum anfragen |
| **4** Architektur, Inhalte | 19.10.–25.10. | Datenmodell und Rechte umsetzen (04-mvp-spezifikation.md). Redaktions-Werkzeug. Mit der Fachperson: Lernziele des 3./4. Lehrjahres erfassen, 60 erste Aufgaben entwerfen (KI) und prüfen. Hosting-Offerten (Schweiz) einholen. | Grundgerüst steht | Datenbank, Redaktion, 60 geprüfte Aufgaben | 60 Aufgaben freigegeben, Fehlerquote in der Prüfung < 20 % | > 40 % der KI-Entwürfe abgelehnt: Entwurfs-Prompt überarbeiten, mehr Beispiele |
| **5** MVP-Kern | 26.10.–01.11. | Anmeldung, Betriebscode, Onboarding, Einwilligungen, Aufgabentypen. | Lernende können sich anmelden | Funktionen 1–3, 6, 16 | Anmeldung < 60 s bei 3 Testpersonen | – |
| **6** MVP-Kern | 02.11.–08.11. | Tagestraining, Rückmeldung, Fehler melden, Einstufung. 150 geprüfte Aufgaben. | Erstes echtes Training | Funktionen 4, 5, 8 | 5 Testpersonen schaffen 3 Tage in Folge | Testpersonen brechen ab: Länge und Aufgabentypen anpassen, nicht weiterbauen |
| **7** Adaptiv | 09.11.–15.11. | Wiederholungslogik, Themenübersicht. Tests für die Logik. | Richtige Aufgabe zur richtigen Zeit | Funktionen 7, 9 | Automatische Tests grün; Testpersonen sehen falsch Beantwortetes wieder | – |
| **8** QV-READY | 16.11.–22.11. | QV-READY Berufskenntnisse (Abschnitt 4 der Spezifikation), Hinweistexte. 250 geprüfte Aufgaben, 40 Kurzantworten mit Raster. | Trainingsstand sichtbar | Funktion 10 | Fachperson hält den Wert für plausibel bei 5 Testpersonen | Nicht plausibel: Wert im Pilot ausblenden |
| **9** Simulation | 23.11.–29.11. | Semester-Check und Simulation. 20 Fachgespräch-Situationen mit Raster. Testsatz: 200 von der Fachperson bewertete Antworten. | Prüfungsnahes Üben | Funktion 11, Testsatz | – | – |
| **10** KI, Dashboard | 30.11.–06.12. | Fachgespräch-Training mit KI, Einspruch-Knopf. Berufsbildner-Ansicht, Wochenmail. Spielelemente. KI gegen Testsatz prüfen. | Zwei Unterschiede zur Konkurrenz stehen | Funktionen 12–14 | KI stimmt in ≥ 85 % mit der Fachperson überein | < 85 %: Fachgespräch im Pilot nur mit Musterantwort, ohne Punkte |
| **11** Pilotvorbereitung | 07.12.–13.12. | Datenschutzerklärung, AGB, Pilotvereinbarung mit Betrieben, Einwilligungen (bei unter 16 mit Information der Eltern). Erinnerungen, Export, Löschen. Betriebslizenz und Rechnung. Klärung KI-Datenübermittlung (05-ki-konzept.md). 5–10 Betriebe unterschreiben. | Pilot startklar | Funktionen 15–18, unterschriebene Vereinbarungen | ≥ 20 Lernende zugesagt | < 20: Start um 1 Woche verschieben, weitere Betriebe; nicht mit 5 Personen starten |
| **12** Pilotstart | 14.12.–20.12. | Einführung je Betrieb (15 Min., vor Ort oder Video). Einstufung. Täglich Kennzahlen ansehen, Fehler innert 24 h beheben. | Pilot läuft | 20–50 aktive Lernende | ≥ 80 % machen die Einstufung in 7 Tagen | < 50 %: Einführung wiederholen, Erinnerung prüfen |

**Hinweis Kalender:** Zwischen 24.12. und 04.01. sind viele Lernende in den Ferien. Der Pilot dauert deshalb
bis 07.02.2027 (8 Wochen, davon etwa 6 aktive). Die Auswertung (Gate 3 und Gate 4) ist in der Woche vom
08.02.2027, rechtzeitig vor dem QV im Frühsommer.

**Stundenbudget:** 12 Wochen × 10 h = 120 h. Am meisten Zeit brauchen die Gespräche (W1–2, ~20 h),
die Inhalte mit der Fachperson (W4–9, ~30 h von dir) und die Pilotvorbereitung (W11, ~15 h).
