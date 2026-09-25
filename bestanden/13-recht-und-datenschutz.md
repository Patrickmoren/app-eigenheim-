# 13 · Recht und Datenschutz

**Keine Rechtsberatung.** Das ist die Liste der Punkte, die vor dem Pilot geklärt und vor dem ersten
Verkauf von einer Fachperson geprüft werden (Budget in 07-finanzmodell.md, Stufe CHF 10'000).

## 1. Du als Gründer

| Punkt | Was gilt | Was du tust |
|---|---|---|
| Arbeitsvertrag | Treuepflicht (OR 321a); viele Verträge regeln Nebenerwerb | Vertrag lesen; wenn eine Klausel besteht, Arbeitgeber informieren |
| **Interessenkonflikt** | Du vergibst beruflich Aufträge an Sanitärfirmen | Firmen aus deinen Mandaten nicht zuerst ansprechen; nie Aufträge und «bestanden» vermischen; keine Kontakte oder Daten aus dem Job nutzen |
| Rechte an der Arbeit | Erfindungen im Arbeitsverhältnis (OR 332) betreffen die dienstliche Tätigkeit | nur in der Freizeit, mit eigenem Gerät, ausserhalb des Tätigkeitsbereichs des Arbeitgebers |
| Rechtsform | Einzelunternehmen; Eintrag im Handelsregister ab CHF 100'000 Umsatz Pflicht | Start ohne Eintrag; GmbH erst bei Finanzierung oder Anstellungen |
| MWST | Pflicht ab CHF 100'000 Umsatz (MWSTG Art. 10). Ob Lernangebote von der Steuer ausgenommen sind (Bildung, MWSTG Art. 21), ist zu klären | mit Treuhand klären, bevor die Grenze erreicht wird |
| AHV | Einkommen aus Nebenerwerb ist beitragspflichtig (kleine Beträge auf Antrag befreit) | bei der Ausgleichskasse anmelden, sobald Gewinn entsteht |

## 2. Datenschutz nach revDSG (seit 01.09.2023)

### Rollen
| Wer | Rolle | Welche Daten |
|---|---|---|
| «bestanden» | **Verantwortliche** für das Lernkonto | Konto, Antworten, Lernstand |
| Lehrbetrieb | eigene/r Verantwortliche/r für das, was Lernende **freigeben** | Trainingszeit, Themenstand, QV-READY |
| Hosting, E-Mail, SMS, KI-Anbieter | Auftragsbearbeiter (Art. 9) | nur was für den Dienst nötig ist; Vertrag nötig |
| Öffentliche Berufsfachschulen | zusätzlich kantonales Datenschutzrecht | vor der ersten Klassenlizenz prüfen |

### Grundsätze und ihre Umsetzung
| Vorgabe | Umsetzung |
|---|---|
| Zweckbindung, Verhältnismässigkeit (Art. 6) | nur Daten fürs Lernen; kein Geburtsdatum, nur Jahr; keine Standortdaten |
| Datenschutz durch Technik und Voreinstellungen (Art. 7) | Standard: Betrieb sieht nur Trainingszeit und Themen; Antworten nie; Ranglisten ohne Namen |
| Informationspflicht (Art. 19) | Datenschutzerklärung in einfacher Sprache, dazu eine Kurzfassung für Jugendliche |
| Ausland (Art. 16) | Hosting in der Schweiz; KI-Anbieter: Angemessenheit (Swiss-US DPF) oder Standardvertragsklauseln, siehe 05-ki-konzept.md |
| Folgenabschätzung (Art. 22) | **durchführen**: viele Minderjährige, Arbeitgeber sieht Lernstand, automatische Bewertung |
| Datensicherheit, Meldung (Art. 24) | Verschlüsselung, Rechte, Protokoll; Verletzung mit hohem Risiko so rasch als möglich dem EDÖB melden |
| Auskunft (Art. 25), Herausgabe (Art. 28) | Export in der App (JSON, CSV); Anfragen innert 30 Tagen |
| Profiling | QV-READY und Lernstand an den Betrieb nur mit **ausdrücklicher Einwilligung** der Lernenden, jederzeit widerrufbar |

### Minderjährige
- Es gibt kein festes Alter. Massgeblich ist die Urteilsfähigkeit (ZGB Art. 16); bei Jugendlichen ab etwa
  13–16 Jahren wird sie für einfache Einwilligungen oft angenommen. Lernende sind meist 15–20.
- Umsetzung: Einwilligung durch die Lernenden selbst; **unter 16 Jahren zusätzlich Information der Eltern**
  mit Möglichkeit zum Widerspruch. Keine Werbung, keine Tracking-Pixel, keine Weitergabe.
- Kauf durch Minderjährige (QV-Pass): Lernende verwalten ihren Lohn grundsätzlich selbst (ZGB Art. 323).
  Trotzdem von einer Fachperson bestätigen lassen; B2C erst nach dem Pilot.

### Arbeitgeber und Lernende
- Der Arbeitgeber darf Daten nur bearbeiten, soweit sie die Eignung für das Arbeitsverhältnis betreffen oder
  für den Vertrag nötig sind (OR 328b). Der Ausbildungsstand gehört zur Ausbildung, aber
  **einzelne Antworten und Lernzeiten in der Freizeit gehen den Betrieb nichts an**.
- Deshalb: nur Wochensummen, Themenstand und QV-READY, nur freigegeben. Lernzeiten nach Uhrzeit sieht der
  Betrieb nie.
- Die Nutzung darf keine Pflicht mit Folgen sein (Pilotvereinbarung).

### Speicherfristen
| Daten | Frist |
|---|---|
| Freitext-Antworten | 12 Monate, dann löschen |
| Punkte, Lernstand | bis 12 Monate nach dem QV-Jahr, dann Konto löschen (nach Vorwarnung) |
| Konto auf Wunsch löschen | sofort; aus Sicherungen nach spätestens 30 Tagen |
| AuditLog | 2 Jahre |
| Rechnungen | 10 Jahre (OR 958f) |

## 3. Urheberrecht

Siehe 06-content-system.md, Abschnitt 4: Bildungsverordnungen sind amtliche Erlasse (URG Art. 5) und frei;
frühere QV-Aufgaben, üK-Unterlagen, Lehrmittel und Normtexte nicht verwenden; eigene Formulierungen und
eigene Bilder; Rechte der Fachperson vertraglich übertragen.

## 4. Werbung und AGB

- Keine unbelegten Aussagen (UWG Art. 3 Abs. 1 lit. b): keine «Bestehensgarantie», keine erfundenen Quoten.
- AGB: Leistungsbeschrieb, keine Garantie für Prüfungserfolg, Haftung begrenzt, Kündigung, Laufzeit bis Ende
  Lehrjahr, Gerichtsstand Schweiz.
- Pilotvereinbarung mit Betrieben: Zweck, Dauer, Daten, Freiwilligkeit, Ende.
