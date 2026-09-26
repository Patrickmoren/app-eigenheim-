# Mietpilot — Kurzzusammenfassung

## Die Idee

Ein KI-Agent, der für private Eigentümer:innen (1–5 Wohnungen) das komplette digitale
Backoffice der Wiedervermietung übernimmt: Exposé erstellen, auf Portalen publizieren,
Bewerbungen prüfen (Einkommen, Betreibungsauszug, Referenzen), Besichtigungstermine
organisieren. **Die physische Besichtigung führt immer die Eigentümerin selbst durch** —
bewusste Scope-Entscheidung, die den einzigen Prozessschritt entfernt, der nie skaliert
hätte (kein Partnernetz, keine physische Präsenz nötig), und die zugleich das Vertrauen
stärkt: Die Eigentümerin trifft die Top-Kandidat:innen persönlich, bevor sie entscheidet.

**Kernversprechen:** *"Ihre Wohnung wird vermietet. Sie treffen nur noch Ihre künftigen
Mieter:innen."*

## Zielkunde

Private Vermieter:in mit 1–5 Einheiten, die selten (alle paar Jahre) neu vermietet, aktuell
entweder alles selbst macht (Homegate/ImmoScout24, Bewerbungen sichten, Termine koordinieren)
oder dafür schon einmal einen Makler/eine Verwaltung bezahlt hat.

## Geschäftsmodell

**Erfolgshonorar, kein Abo** — passt zum seltenen Nutzungsmuster privater Eigentümer:innen:

| | Klassischer Vermietungsservice (Markt) | Mietpilot |
|---|---|---|
| Preis | 1–1.5 Monatsmieten (≈ CHF 2'000–3'000) | CHF 890 pauschal |
| Fällig | bei Erfolg | nur bei Erfolg |
| Ausführung | Mensch (Makler) | KI-Agent, Mensch entscheidet am Ende |

Auf Firmenebene bleibt der Umsatz trotzdem wiederkehrend (laufend neue Fälle), aber strukturell
ist das ein Transaktions-/Erfolgshonorar-Modell, kein SaaS-Abo.

## Woher die Idee kommt

Ursprung war eine breite Marktanalyse (30 Probleme, 10 Geschäftsmodelle) mit der ersten Wahl
**Fristenwächter** (Prüffristen-Management für Immobilienverwaltungen — echte Marktlücke, aber
"nicht sexy"). Pivot 1 → **Vermietungspilot**: derselbe KI-Agenten-Ansatz für professionelle
Verwaltungen, als Copilot auf bestehenden Tools statt neuer All-in-one-Plattform. Pivot 2 →
**Mietpilot**: dieselbe zugrunde liegende Engine, aber auf private Eigentümer:innen
umgemünzt — grösserer, emotional greifbarerer Markt, anderes Preismodell.

## Ehrlicher Stand der Konkurrenz

Kein weisser Fleck: **properti** und **propertyowner.ch** machen digitale Vermietungsservices
für private Eigentümer bereits, **Flatfox** dominiert die professionelle Schiene in der
Schweiz. Die Differenzierung ist der KI-getriebene Kosten-/Geschwindigkeitsvorteil
("gleiches Ergebnis, ein Drittel des Preises"), nicht ein unbesetzter Markt.

## Grösstes offenes Risiko

**Vertrauen**, nicht Technik oder Preis: Überlassen private Eigentümer:innen einer KI wirklich
die Vorauswahl ihrer Mieter:innen, oder wollen sie jede Bewerbung selbst sehen? Das entscheidet,
ob das Kernversprechen trägt.

## Plan — aktueller Stand

1. ✅ Marktanalyse & Geschäftsmodell-Auswahl
2. ✅ Klickdummy gebaut (`prototyp/mietpilot.html`) — Landingpage + interaktive Live-Demo
3. ✅ Validierungspaket erstellt (`docs/validierung-mietpilot.md`) — Zielliste-Kriterien,
   Outreach-Texte, Gesprächsleitfaden mit Vertrauens- und Preistest, Kill Criteria
4. ⏳ **Jetzt:** 15–20 echte Gespräche mit privaten Eigentümer:innen führen
   (Homegate/ImmoScout24-Privatinserenten, HEV-Sektionen, Vermieter-Facebook-Gruppen)
5. ⏭️ Danach: Go/No-Go anhand der Kill Criteria — bei Go: Preismodell verfeinern, echtes
   Anmeldeformular + Zahlungsabwicklung als nächster Entwicklungsschritt

## Kill Criteria (Kurzfassung)

Abbrechen, wenn: Mehrheit will jede Bewerbung selbst sichten · CHF 890 wirkt unseriös billig
oder zu teuer gegen DIY · unter 20 % würden es ausprobieren · wiederholt ernsthafte
Haftungsbedenken bei KI-Fehlentscheidungen.

---

*Alle Details: `docs/geschaeftsmodell-analyse-chf20k.md` (Gesamtanalyse),
`docs/validierung-mietpilot.md` (Validierungsplan), `prototyp/README-mietpilot.md`
(Klickdummy-Dokumentation).*
