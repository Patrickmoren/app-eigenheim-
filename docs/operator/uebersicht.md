# Mietpilot — Operator-Übersicht

> Dieses Dokument ist der Einstiegspunkt in die Validierungs-Infrastruktur. Es beantwortet die
> im Auftrag geforderten Punkte A–E und wird nach jeder Interview-Batch aktualisiert.

## A. Was bereits vorhanden ist

**Strategie & Analyse:**
- `docs/geschaeftsmodell-analyse-chf20k.md` — Ausgangsanalyse (30 Probleme, 10 Modelle), die zu Fristenwächter → Vermietungspilot → Mietpilot führte.
- `docs/mietpilot-stresstest.md` — 20-Phasen-Stresstest: Zielgruppen-Scoring, Wettbewerbsanalyse (properti als Incumbent, FAKT), Unit Economics, rechtliche Prüfung (inkl. zweier im Verlauf selbst korrigierter Fehleinschätzungen), B2C-vs-B2B2C-Empfehlung.
- `docs/mietpilot-neubewertung.md` — radikale Nullpunkt-Prüfung: identifiziert H14 (Mittelmarkt-Existenz zwischen Gratis-DIY und Vollservice) als potenziell modellzerstörend, empfiehlt Produktverkleinerung auf reines Bewerber-Screening/-Ranking.
- **`docs/operator/mvp-validierung-screening.md` — AKTUELL GÜLTIGER Arbeitsplan:** Interviewleitfaden (getrennt A: 5-20 Wohnungen / B: kleine Verwaltungen), Signalskala A-E, Kill/Pivot/Proceed-Logik, Pilotprozess, MVP-Spezifikation, 14-Tage-Plan. Ersetzt für diese Phase den breiteren Ansatz der vorherigen Dokumente.
- `docs/zusammenfassung-mietpilot.md` — aktueller Kurzstand.

**Validierungsmaterial B2C:**
- `docs/validierung-mietpilot.md` — Zielliste-Kriterien, Outreach-Texte, Interviewleitfaden (verhaltensbasiert + Konzept-Test), Kill Criteria.
- `docs/validierung-woche1-leitfaden.md` — (aus der Fristenwächter-Spur, methodisch wiederverwendbar, nicht Mietpilot-spezifisch).

**Validierungsmaterial B2B (neu in diesem Auftrag erstellt):**
- `docs/operator/interviewleitfaden-b2b.md`
- `docs/operator/outreach-b2b.md`

**Infrastruktur (neu):**
- `docs/operator/hypothesen.md` — 13 Hypothesen (H1–H10 vorgegeben, H11–H13 aus dem Stresstest/Verlauf ergänzt), alle Status **OFFEN** oder nur durch Marktrecherche (nicht Feldgespräche) gestützt.
- `docs/operator/lead-qualifizierung.md` — HOT/WARM/COLD/INVALID-Regeln, Signalstärke-Gewichtung.
- `docs/operator/mietpilot-crm.xlsx` — CRM B2C, CRM B2B, Piloten-Tracking, Dashboard B2C, Dashboard B2B (formelbasiert, aktualisiert sich automatisch beim Befüllen der CRM-Zeilen).

**Produkt:**
- `prototyp/mietpilot.html` (+ README) — Klickdummy/Landingpage.
- `prototyp/vermietungspilot.html`, `prototyp/fristenwaechter.html` — Vorläufer-Prototypen (andere Zielgruppen/Modelle, nicht Teil der aktuellen Mietpilot-Spur).

## B. Was fehlt

1. **Jede reale EVIDENCE.** Alle 13 Hypothesen sind Status OFFEN oder nur durch Marktrecherche (nicht durch Gespräche mit echten Personen) gestützt — das ist der zentrale fehlende Baustein, nicht mehr Konzeptarbeit.
2. **Eine konkrete Kontaktliste** — weder B2C- noch B2B-Zielpersonen sind bisher identifiziert und im CRM erfasst (0 Zeilen ausser dem Beispiel).
3. **Ausführende Person(en) für Outreach** — ich kann Material vorbereiten und Ergebnisse strukturieren, aber niemanden anrufen oder anschreiben (kein Telefon-/E-Mail-/LinkedIn-Tool in dieser Umgebung).
4. **Ein realer CAC-Datenpunkt** (H12/H5) — bisher nur ANNAHME aus dem Stresstest, kein echter Ads-Test durchgeführt.
5. **Ein technisches Gespräch mit mindestens einer Verwaltungssoftware-Seite** (Abacus/GARAIO/Rimo) zur Machbarkeit einer Anbindung — für H7 relevant, noch nicht angegangen.

## C. Aktuell riskanteste Annahmen

**Aktualisiert nach der radikalen Neubewertung (`docs/mietpilot-neubewertung.md`) — H14 steht
jetzt vor allen anderen, weil sie alle übrigen Fragen entwertet, falls sie nicht zutrifft:**

0. **H14** (Existenz eines zahlungsbereiten Mittelmarkts zwischen Gratis-DIY und
   properti-Vollservice) — **potenziell modellzerstörend**, bisher nie explizit geprüft,
   stand nur implizit hinter dem gesamten Projekt.
1. **H15** (Screening/Ranking allein ist als eigenständiges Produkt verkaufbar) — bestimmt,
   ob die aktuelle "Alles automatisieren"-Plattform überhaupt der richtige Produktumfang ist.
2. **H3** (Vertrauen in KI-Vorauswahl bei behaltener Enddecision) — trägt das gesamte Produktversprechen. Ohne Bestätigung fällt auch H4, H9, H10, H16.
3. **H12/H5** (CAC im B2C-Modell) — kann das gesamte B2C-Modell wirtschaftlich unmöglich machen, unabhängig davon, ob H3 bestätigt wird.
4. **H7/H17** (Verwaltungen/Makler setzen externe Engine ein — aus Zeitersparnis- statt Vertrauensmotiv) — trägt die gesamte B2B2C-Alternative.
5. **H11** (properti kann schneller reagieren, als Mietpilot Marktanteil gewinnt) — bereits gut durch Marktrecherche gestützt (FAKT: 195 MA, Garantie-Produkt), aber die Konsequenz daraus (Rückzug ins B2B2C) ist selbst noch nicht getestet.
6. **H18** (ortsferne Eigentümer:innen als Zielsegment) — steht im erkannten Widerspruch zu H13 (Besichtigung bleibt immer beim Menschen); muss aufgelöst werden, nicht nur getestet.

**Praktische Konsequenz:** Die ursprünglich geplanten 20 B2C-/B2B-Interviews (Leitfäden in
`validierung-mietpilot.md` und `interviewleitfaden-b2b.md`) sollten um die 5 Experimente aus
`mietpilot-neubewertung.md` ergänzt werden, bevor sie als abgeschlossen gelten — insbesondere
die Mittelmarkt-Frage (H14) gehört an den Anfang jedes Gesprächs, nicht ans Ende.

## D. Die 10 konkreten nächsten Aktionen

1. **B2C:** 10 private Inserent:innen auf Homegate/ImmoScout24 identifizieren und ins CRM B2C eintragen (Status "geplant").
2. **B2C:** Diese 10 per Nachricht kontaktieren (Vorlage: `docs/validierung-mietpilot.md`).
3. **B2C:** Die ersten 5 Interviews führen (Leitfaden: `docs/validierung-mietpilot.md`, Fragen 1–11 verhaltensbasiert vor Konzeptvorstellung).
4. **B2B:** 8–10 kleinere Verwaltungen/Regionalmakler/Treuhänder identifizieren (SVIT-Verzeichnis, TREUHAND|SUISSE) und ins CRM B2B eintragen.
5. **B2B:** Diese kontaktieren (Vorlage: `docs/operator/outreach-b2b.md`).
6. **B2B:** Die ersten 3 Gespräche führen (Leitfaden: `docs/operator/interviewleitfaden-b2b.md`).
7. **Nach jedem Gespräch:** Mir die Notizen/das Transkript geben — ich trage es strukturiert ins jeweilige CRM ein, aktualisiere `hypothesen.md` und vergebe den Lead-Status.
8. **CAC-Signal:** Einen kleinen Test-Ads-Betrag (z. B. CHF 300–500, Google/Meta) auf die bestehende `mietpilot.html`-Landingpage schalten, um einen ersten echten Klick-/Interesse-Datenpunkt für H12 zu bekommen.
9. **Nach 5 B2C- und 3 B2B-Gesprächen:** Musteranalyse (Schritt 9 im Arbeitsmodus) — Hypothesenregister aktualisieren, erste Lead-Status-Verteilung im Dashboard ansehen.
10. **Parallel:** Ein kurzes Gespräch mit einer Kontaktperson bei einer Verwaltungssoftware (Abacus/GARAIO/Rimo) anfragen, um die technische Machbarkeit einer Anbindung grob einzuschätzen (für H7/Integrationsbedarf).

## E. Was ich von dir tatsächlich noch brauche

1. **Ausführung der Kontaktaufnahme** — ich kann Nachrichten/E-Mails formulieren, aber nicht selbst verschicken. Entweder du übernimmst das, oder du sagst mir, wenn ein Kanal (z. B. ein E-Mail-Tool) angebunden werden soll.
2. **Nach jedem geführten Gespräch: rohe Notizen oder Transkript** — je roher, desto besser (ich strukturiere, kategorisiere, tagge Hypothesen — ich erfinde nichts).
3. **Entscheidung, ob ich mit der Kontaktrecherche (Schritt 1/4 oben) selbst beginnen soll** — das kann ich per Websuche vorbereiten (Namen/Firmen/öffentliche Kontaktdaten sammeln), aber sag mir, ob das gewünscht ist, bevor ich das tue.
4. **Budget-Freigabe für den CAC-Test** (Punkt 8 oben) — ich kann die Landingpage/das Tracking vorbereiten, aber die Kampagne selbst muss über deinen Google-/Meta-Account laufen.
5. **Zugang/Kontakt bei einer Verwaltungssoftware-Anbieterin**, falls du dort bereits jemanden kennst — sonst recherchiere ich einen neutralen Erstkontakt.

---

*Nächste Aktualisierung: nach den ersten 5 B2C- und 3 B2B-Gesprächen (s. Arbeitsmodus Schritt 9).*
