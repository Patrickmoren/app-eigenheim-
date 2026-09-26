# Mietpilot — Validierung des reduzierten MVP (nur Bewerbungsprüfung)

> Setzt direkt auf `docs/mietpilot-neubewertung.md` auf. Ziel dieser Phase ist ausschliesslich:
> **beweisen oder widerlegen, dass ein zahlungsbereiter Mittelmarkt zwischen Gratis-DIY und
> Vollservice-Makler existiert — für ein radikal verkleinertes Produkt.** Keine Plattform,
> keine perfektionierte Landingpage, keine Integrationen, kein Branding, kein Marketing in
> dieser Phase.

---

## 0. Das reduzierte Produkt (Referenzrahmen für alles Folgende)

**Ist Teil des MVP:**
- Automatisierte Prüfung eingereichter Bewerbungsunterlagen
- Strukturierte Extraktion relevanter Informationen (Einkommen, Betreibungen, Referenzen)
- Vergleich der Bewerber:innen
- Nachvollziehbare Kandidatenübersicht (alle Bewerbungen sichtbar, nichts wird versteckt —
  s. Vertrauensproblem in `mietpilot-neubewertung.md`, Abschnitt 14)
- Optionale Empfehlung von 3 geeigneten Kandidat:innen mit Begründung
- Menschliche Letztentscheidung bleibt vollständig bei der Eigentümer:in/dem Kunden

**Ausdrücklich NICHT Teil des MVP:** Mietzinsberechnung, Exposé, Inserateerstellung,
Portalpublikation, automatische Besichtigungsorganisation, Vertragsabschluss, physische
Besichtigung, Übergabe, vollständige Vermietungsplattform.

---

## 1. Interviewleitfaden — getrennt nach Zielgruppe

Beide Leitfäden folgen derselben Struktur (Ist-Prozess → Konzept erst danach → Signalstufe
erfassen), aber mit unterschiedlicher Auswertungslinse: bei A steht Urteilssicherheit/Angst im
Fokus, bei B Zeitersparnis/bereits vorhandene Kompetenz (s. H17). **Die beiden Gruppen werden
in Auswertung und CRM getrennt geführt, nie zusammengefasst.**

### Teil 1 — Ist-Prozess (beide Zielgruppen, identisch, KEIN Konzept erwähnen)

1. Erzählen Sie mir von der letzten Wohnung, die Sie vermietet haben.
2. Wie viele Bewerbungen kamen ungefähr?
3. Wie haben Sie diese geprüft?
4. Was war dabei konkret mühsam?
5. Wie lange hat die Prüfung gedauert?
6. Was haben Sie selbst geprüft?
7. Was haben Sie ausgelagert?
8. Welche Tools haben Sie verwendet?
9. Was war die schwierigste Entscheidung?
10. Hatten Sie schon einmal einen schlechten Mieterentscheid?
11. Was wäre für Sie der finanzielle Schaden einer falschen Auswahl?
12. Was würden Sie heute anders machen?
13. Welche Teile würden Sie niemals einer Software überlassen?

**Zusatzfragen nur für Zielgruppe A (5–20 Wohnungen, privat):**
1a. Wie viele Wohnungen besitzen Sie insgesamt, und wie oft vermieten Sie im Schnitt neu?
1b. Verwalten Sie das komplett selbst, oder haben Sie dafür schon einmal jemanden bezahlt?

**Zusatzfragen nur für Zielgruppe B (kleine Verwaltungen):**
1a. Wie viele Objekte/Einheiten betreuen Sie, wie viele Wiedervermietungen pro Jahr?
1b. Wer im Team macht die Bewerbungsprüfung heute, und wie viel ihrer/seiner Zeit geht dafür
    drauf?
1c. Ist das ein Kernprozess, den Sie behalten wollen, oder eine Last, die Sie loswerden wollen?
    *(zentral für H17 — Zeitersparnis vs. Verantwortungsabgabe)*

### Die zentrale Frage (nach Teil 1, vor jeder Konzeptbeschreibung)

Wörtlich, nicht umformulieren:

> "Wenn Sie zwischen einer kostenlosen Eigenlösung und einem klassischen Vermietungsservice
> wählen können: Gibt es einen konkreten Grund, für eine Lösung zu bezahlen, die nur die
> Bewerbungen prüft und Ihnen die Entscheidung vorbereitet?"

Antwort wortwörtlich protokollieren, bevor irgendetwas erklärt wird.

### Verbotene Fragen (explizit, nicht stellen)

- "Wäre es für Sie interessant, wenn KI 30 Bewerbungen auf 3 reduziert?" (suggestiv)
- "Würden Sie CHF 500 dafür bezahlen?" (verankert einen Preis, bevor Bedarf belegt ist)
- Keine Erklärung, warum Mietpilot gut ist, vor Abschluss von Teil 1 und der zentralen Frage.

### Teil 2 — Produkt zeigen (erst jetzt)

Wörtlich vorlesen:

> "Wir testen gerade einen Dienst, der Bewerbungsunterlagen automatisch strukturiert,
> relevante Kriterien prüft und die Bewerbungen vergleichbar macht. Die Entscheidung bleibt
> vollständig beim Eigentümer."

Danach NICHT nach einer allgemeinen Meinung fragen. Stattdessen:

14. Würden Sie einen echten, aktuellen Vermietungsfall damit durchführen?
15. Würden Sie uns echte Bewerbungsunterlagen für einen Pilotfall geben?
16. Was müsste erfüllt sein, damit Sie das tun?
17. Welche Informationen darf das System auf keinen Fall verwenden?
18. Welche Information müsste die Entscheidung für Sie nachvollziehbar machen?

---

## 2. CRM-Felder (Ergänzung zu `mietpilot-crm.xlsx`)

Neue Felder, angehängt an bestehende CRM-B2C- und CRM-B2B-Blätter (bestehende Spalten bleiben
unverändert, damit die Dashboard-Formeln nicht brechen):

| Feld | Werte | Zweck |
|---|---|---|
| Zielsegment passend (nur B2C) | ja (5–20 Wohnungen) / nein / unbekannt | Filtert auf die priorisierte Zielgruppe A |
| Antwort auf zentrale Frage (Wortlaut) | Freitext | Rohdaten für die Mittelmarkt-Bewertung (H14) |
| Signalstufe | A / B / C / D / E | s. Abschnitt 3 unten — ersetzt die grobe "Pilotinteresse ja/vielleicht/nein" für diese Validierungsphase |
| Echte Unterlagen erhalten (Datum) | Datum oder leer | Konkreter Nachweis von Signal D |
| Tabu-Kriterien genannt (Frage 17) | Freitext | Für Datenschutz-/Diskriminierungs-Design relevant |
| Nachvollziehbarkeits-Anforderung (Frage 18) | Freitext | Für UI-Design der Kandidatenübersicht relevant |
| Pilotfall-ID | Verweis auf Piloten-Blatt | Verknüpfung zum tatsächlichen Testfall |

---

## 3. Hypothesen H14–H18 (Referenz)

Bereits im Hypothesenregister (`docs/operator/hypothesen.md`) geführt, hier zur Übersicht:

| ID | Kurzform | Bezug zu dieser Validierungsphase |
|---|---|---|
| H14 | Zahlungsbereiter Mittelmarkt existiert zwischen Gratis-DIY und Vollservice | **Zentrale Frage dieser gesamten Phase** |
| H15 | Screening/Ranking allein ist eigenständig verkaufbar | Wird durch Signal C/D/E in Teil 2 geprüft |
| H16 | Unsichtbare KI-Vorfilterung wird bei Fehlentscheidung als Vertrauensbruch empfunden | Frage 17/18 prüfen die Bedingungen dafür |
| H17 | B2C = Urteilssicherheit, B2B2C = Zeitersparnis (unterschiedliche Jobs) | Getrennte Auswertung A vs. B prüft das direkt |
| H18 | Ortsferne Eigentümer:innen sind trotz Besichtigungs-Scope ein tragfähiges Segment | **Bewusst nicht Teil dieser Phase** — Zielgruppe A ist auf 5–20 Wohnungen fokussiert, nicht auf Ortsferne. H18 wird erst nach dieser Phase separat getestet. |

---

## 4. Experimentdesign

**Experiment: Mittelmarkt-Existenz + Produktverkleinerung (kombiniert H14 + H15)**

- **Hypothese:** Es gibt eine Zielgruppe, die für eine reine Bewerbungsprüfungs-Lösung zahlen
  würde, obwohl kostenlose Eigenlösungen existieren.
- **Methode:** 10 Interviews Zielgruppe A + 10 Interviews Zielgruppe B, strikt nach obigem
  Leitfaden, getrennt ausgewertet.
- **Grösse:** 20 Gespräche total (10+10) — bewusst klein gehalten, um schnell zu einer
  Kill/Pivot/Proceed-Entscheidung zu kommen, nicht um eine repräsentative Marktstudie zu
  erhalten (s. Signifikanzschwelle in `lead-qualifizierung.md`: unter 10 Gesprächen pro
  Segment keine Marktaussage — 10 ist damit das Minimum, nicht der Zielwert).
- **Auswertung:** Nach jeweils 5 Gesprächen pro Segment Muster prüfen (wie im
  Master-Prompt-Arbeitsmodus vorgesehen).

---

## 5. Erfolgskriterien

| Kriterium | Schwelle |
|---|---|
| Antworten auf die zentrale Frage mit konkretem, nachvollziehbarem Grund (nicht nur "wäre praktisch") | ≥ 30 % pro Segment |
| Signalstufe C oder höher erreicht | ≥ 30 % pro Segment |
| Signalstufe D erreicht (echter Fall angeboten) | ≥ 3 Personen total über beide Segmente |
| Signalstufe E erreicht (Zahlungsbereitschaft geäussert) | ≥ 1 Person — auch nur eine zählt als starkes Signal, s. Master-Prompt-Regel "8× Interesse ohne Pilot = keine Validierung" |

---

## 6. Kill-/Pivot-/Proceed-Kriterien

**KILL**, wenn eines zutrifft:
- Die Zielgruppe (A oder B, jeweils separat geprüft) empfindet keinen relevanten Schmerz
  (Antworten auf Fragen 3–11 zeigen durchgängig "kein grosses Thema").
- Die kostenlose Eigenlösung wird als ausreichend betrachtet (zentrale Frage überwiegend mit
  "nein, sehe ich nicht" beantwortet).
- Niemand möchte einen echten Fall testen (0 Signal D über beide Segmente).
- **Nur für Segment B:** Verwaltungen haben bereits eine ausreichend gute Lösung und sehen
  keinen Wechselgrund (Frage 1c zeigt "das machen wir gerne selbst, kein Problem").

**PIVOT**, wenn:
- Screening ist zwar als wichtig bestätigt, aber Gespräche zeigen wiederholt, dass ein anderer
  Prozessschritt (z. B. Terminkoordination, Referenzen-Einholung) als deutlich wertvoller
  empfunden wird → zurück zu `mietpilot-neubewertung.md`, Produktkern neu bestimmen.

**PROCEED**, wenn:
- Wiederholt echte Fälle angeboten werden (Signal D) UND erste Zahlungsbereitschaft entsteht
  (Signal E) — dann erst Pilotprozess (Abschnitt 7) tatsächlich durchführen und danach über
  MVP-Bau (Abschnitt 8–10) entscheiden.

**Segmente werden unabhängig bewertet:** Es ist ein zulässiges, informatives Ergebnis, wenn
z. B. Segment A KILL und Segment B PROCEED zeigt (oder umgekehrt) — das wäre selbst ein
wichtiger Befund zu H17.

---

## 7. Pilotprozess (nur bei Signal D/E)

Bewusst manuell/"Wizard of Oz" — **kein Software-Bau in dieser Phase**:

1. Person mit Signal D erhält einen geteilten Upload-Ordner oder eine dedizierte E-Mail-Adresse
   für die Bewerbungsunterlagen eines echten, aktuellen Falls.
2. Unterlagen werden manuell (mit KI-Unterstützung durch bestehende Tools, kein eigenes
   Produkt) strukturiert: Einkommen, Betreibungsauszug-Status, Referenzen tabellarisch erfasst.
3. Eine einfache Vergleichstabelle plus Top-3-Empfehlung mit Begründung wird der Person
   innerhalb von 48h zurückgegeben (Format: einfaches Dokument, keine UI).
4. Nach der tatsächlichen Vermietungsentscheidung: kurzes Feedback-Gespräch — war die
   Empfehlung hilfreich, hätte die Person ohne die Übersicht anders entschieden, würde sie
   dafür zahlen.
5. Ergebnis wird im Piloten-Blatt (`mietpilot-crm.xlsx`) dokumentiert.

**Bewusst kein automatisiertes Tool in diesem Schritt** — der Pilotprozess selbst ist der Test,
nicht die Software.

---

## 8. MVP-Spezifikation (Zielbild NACH erfolgreicher Validierung, nicht jetzt bauen)

**Funktionsumfang:**
- Upload/Weiterleitung von Bewerbungsunterlagen (PDF/Foto/E-Mail-Anhang)
- Automatische Extraktion: Name, Einkommen, Arbeitgeber/Anstellungsart, Betreibungsauszug-
  Status, Referenz vorhanden ja/nein
- Strukturierte Vergleichstabelle aller Bewerbungen (nichts wird verborgen)
- Optionales Ranking mit Begründungstext (Top 3), nachvollziehbar nach den in Frage 18
  gesammelten Kriterien
- Kein Exposé, kein Inserat, keine Terminlogistik, kein Vertrag

**Explizit ausserhalb des MVP:** alles, was in Abschnitt 0 als "nicht Teil des MVP" markiert ist.

---

## 9. Minimal notwendige UI

Drei Bildschirme, nicht mehr:

1. **Fall anlegen:** Objektadresse (optional, nur zur eigenen Übersicht), Upload-Bereich für
   Bewerbungsdossiers.
2. **Vergleichsübersicht:** Tabelle aller Bewerbungen mit extrahierten Kernkriterien,
   sortierbar, nichts vorab ausgeblendet (Vertrauensanforderung aus H16).
3. **Empfehlung (optional einblendbar):** Top-3 mit Begründungstext, Klick öffnet die
   vollständigen Unterlagen dieser Person.

Kein Dashboard, keine Portfolio-Ansicht, kein Login-System über eine einfache Zugangslink-
Lösung hinaus (Muster: `fristenwaechter.html`-Fachfirmen-Portal, kein Aufwand für ein neues
Muster nötig, falls es überhaupt so weit kommt).

---

## 10. Datenmodell

```
Fall
 ├─ id, Eigentümer:in/Kontakt, Objekt (optional), erstellt_am, Segment (A/B)
 └─ Bewerbung[]
     ├─ id, Name, Kontaktdaten
     ├─ Dokument[] (Typ: ID/Lohnausweis/Betreibungsauszug/Referenz, Datei-Referenz)
     ├─ Extrahierte Kriterien (Einkommen, Anstellungsart, Betreibungsauszug-Status,
     │   Referenz vorhanden)
     ├─ Score (nur falls Empfehlung aktiviert) + Begründungstext
     └─ Status (eingegangen/geprüft/empfohlen/nicht empfohlen — NICHT "abgelehnt", s.
         Diskriminierungs-/Vertrauensrisiko, Formulierung bewusst neutral)
```

Kein separates Vertrags-, Exposé- oder Portal-Datenmodell in dieser Phase.

---

## 11. Sicherheits- und Datenschutzanforderungen

- **Besonders schützenswerte Personendaten** (Betreibungsauszug, Einkommen, ID-Kopien) — auch
  im manuellen Pilotprozess (Abschnitt 7): Verschlüsselte Ablage, Zugriff ausschliesslich durch
  die/den Verantwortliche:n, keine Weitergabe an Dritte ausserhalb des Falls.
- **Einwilligung der Bewerber:innen** zur automatisierten Vorprüfung einholen (deckt Art. 21
  nDSG ab, s. `mietpilot-stresstest.md` Phase 10) — auch im manuellen Pilotprozess durch einen
  einfachen Einwilligungstext vor Einreichung.
- **Löschkonzept:** Unterlagen abgelehnter/nicht empfohlener Bewerbungen nach Abschluss des
  Falls löschen, nicht dauerhaft aufbewahren, solange kein Lösch-/Aufbewahrungskonzept
  ausgearbeitet ist.
- **Keine Verwendung von Merkmalen, die mit Herkunft, Geschlecht, Religion, sozialer Stellung
  korrelieren könnten** — weder direkt noch als Proxy (z. B. Name, Nationalität, Wohnadresse
  als Indikator) — auch bei der manuellen Auswertung im Pilotprozess, damit die Methode von
  Anfang an sauber ist, wenn sie später automatisiert wird.
- **Auftragsverarbeitung:** Falls ein KI-/Cloud-Tool zur Extraktion verwendet wird (auch im
  manuellen Pilotprozess), dessen Datenverarbeitungsbedingungen prüfen, bevor echte
  Bewerberdaten hindurch geschickt werden.

---

## 12. 14-Tage-Umsetzungsplan

| Tag | Aufgabe |
|---|---|
| 1–2 | Zielliste: 10 Personen Segment A (Homegate/ImmoScout24-Privatinserate, HEV) + 10 Segment B (SVIT/TREUHAND|SUISSE) identifizieren, ins CRM eintragen |
| 3–4 | Kontaktaufnahme beider Segmente (bestehende Outreach-Vorlagen, Betreff/Ton unverändert) |
| 5–8 | Erste 10 Interviews führen (Mischung A/B), Rohnotizen laufend an mich zur CRM-Erfassung |
| 9 | Zwischenauswertung nach ~10 Gesprächen: Signalverteilung prüfen, Kill-Kriterien gegenprüfen — bei klarem KILL in einem Segment: dieses Segment für den Rest der 14 Tage aussetzen |
| 10–12 | Verbleibende 10 Interviews führen |
| 13 | Vollständige Auswertung: Hypothesenregister aktualisieren (H14–H17), Dashboard-Signalverteilung prüfen |
| 14 | Kill/Pivot/Proceed-Entscheidung anhand Abschnitt 6 treffen; bei PROCEED: Pilotprozess (Abschnitt 7) für die ersten Signal-D-Kontakte anstossen — **kein Software-Bau, keine Landingpage, kein Marketing in diesen 14 Tagen.** |

---

*Zugehörige Dokumente: `docs/mietpilot-neubewertung.md`, `docs/operator/hypothesen.md`,
`docs/operator/lead-qualifizierung.md`, `docs/operator/mietpilot-crm.xlsx`.*
