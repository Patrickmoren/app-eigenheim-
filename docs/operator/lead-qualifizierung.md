# Lead-Qualifizierung — Regeln, nicht Sympathie

> Grundsatz (Master-Prompt Abschnitt 8 & 10): Ein "klingt gut" ist keine Validierung.
> Nicht aus Sympathie HOT vergeben.

## Verhältnis zur A–E-Signalskala (MVP-Validierungsphase)

Für die reduzierte MVP-Validierung (`mvp-validierung-screening.md`) wird zusätzlich die
feinere A–E-Skala erfasst (Spalte "Signalstufe" in `mietpilot-crm.xlsx`). Zuordnung zu
HOT/WARM/COLD/INVALID:

| Signalstufe | Bedeutung | Entspricht Lead-Status |
|---|---|---|
| E | "Ich würde dafür bezahlen" | HOT |
| D | "Hier ist ein echter Vermietungsfall" | HOT |
| C | "Ich würde einen echten Fall testen" | WARM |
| B | "Würde ich vielleicht nutzen" | WARM (tendenziell schwächer) |
| A | "Interessant" | COLD |

Für die Geschäftsmodellvalidierung dieser Phase zählen **primär D und E** — C ist ein
positives, aber nicht ausreichendes Signal (s. Erfolgskriterien in
`mvp-validierung-screening.md`).

## Signalstärke (Master-Prompt Abschnitt 16)

**Starke Signale** (zählen für HOT):
1. Tatsächliche Zahlung
2. Zusage zu einem echten Pilotfall
3. Konkrete nächste Vermietung wird darüber laufen
4. Einführung in einen bestehenden internen Prozess (B2B)
5. Aktive Weiterempfehlung an eine dritte Person
6. Termin mit einer entscheidungsbefugten Person vereinbart
7. Konkrete Datenfreigabe (z. B. reale Objektdaten für einen Testlauf)

**Schwache Signale** (zählen NICHT für HOT, auch nicht für WARM allein):
- "interessant" · "cool" · "könnte ich mir vorstellen" · "gute Idee"

Diese schwachen Signale werden im CRM festgehalten (Originalaussage-Feld), aber **nie** als
alleinige Grundlage für eine Hochstufung verwendet.

## Kategorien

| Status | Definition | Beispiel |
|---|---|---|
| **HOT** | Konkreter Bedarf **und** konkrete nächste Handlung (mind. 1 starkes Signal) | Pilot zugesagt · nächste Wohnung wird testweise über Mietpilot vermietet · Preis akzeptiert · Einführungsgespräch mit Entscheider:in vereinbart |
| **WARM** | Reales Problem erkennbar, grundsätzliches Interesse, aber (noch) keine konkrete Handlung | "Ja, das Screening kostet uns wirklich Zeit, aber ich müsste das intern erst besprechen." |
| **COLD** | Nur allgemeines Interesse, kein klar artikuliertes Problem, keine Handlungsabsicht | "Klingt spannend, meldet euch mal wieder." |
| **INVALID** | Kein relevanter Bedarf, falsche Zielgruppe, oder explizite Ablehnung des Grundkonzepts | "Wir vermieten praktisch nie" · "Das würde ich nie einer KI überlassen, Punkt." |

## Wichtige Regel zu ablehnenden Aussagen

Eine Aussage wie *"Ich würde das niemals einer KI überlassen"* ist **relevante Evidenz gegen
H3**, nicht ein zu überwindender Einwand. Sie wird im Hypothesenregister (`hypothesen.md`)
als Gegenbeispiel dokumentiert, nicht wegargumentiert oder im Gespräch entkräftet.

## Umgang mit Zustimmung ohne Handlung

Regel aus Master-Prompt Abschnitt 8, wörtlich anzuwenden:

> Wenn 8 Personen sagen "Das klingt super", aber niemand bereit ist, einen Pilot zu machen,
> lautet das Fazit: **"Interesse vorhanden, Zahlungsbereitschaft nicht validiert."**

Das gilt unabhängig davon, wie viele Personen zustimmend reagieren — Häufigkeit von
Zustimmung ersetzt nie ein fehlendes starkes Signal.

## Schwelle für Aussagen über den Gesamtmarkt

Aus **weniger als 10 Gesprächen pro Segment (B2C/B2B)** werden **keine** Marktaussagen
("Eigentümer:innen wollen X") abgeleitet — nur Einzelbeobachtungen, klar als solche markiert.
Erst ab 10+ Gesprächen mit konsistentem Muster wird eine Aussage als GESTÜTZT im
Hypothesenregister markiert (s. `hypothesen.md`, Pflegehinweis: mind. 3 unabhängige
EVIDENCE-Punkte).
