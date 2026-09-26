# Mietpilot — Wie das Business aktuell aussieht

## 1. Produkt

Eine KI-Engine, die das **digitale Backoffice der Wiedervermietung** übernimmt:

- Objekt aufnehmen, Mietzins vorschlagen (Eigentümer:in bestätigt)
- Exposé automatisch erstellen und auf Portalen publizieren
- Eingehende Bewerbungen strukturieren und prüfen (Einkommen, Betreibungsauszug, Referenzen)
- Bewerber:innen nach festen, diskriminierungsfrei geprüften Kriterien ranken
- Besichtigungstermine mit den 3 besten Kandidat:innen organisieren
- Mietvertrag vorbereiten

**Bewusst ausgeschlossen, dauerhaft:** Die physische Besichtigung und Übergabe führt **immer
die Eigentümerin selbst durch** — kein Partnernetz, kein Feldpersonal. Das hält die Firma
vollständig digital/remote, unabhängig vom Fallvolumen, und stärkt nebenbei das Vertrauen
(Eigentümerin trifft die Top-Kandidat:innen persönlich, bevor sie entscheidet).

**Kernversprechen:** *"Ihre Wohnung wird vermietet. Sie treffen nur noch Ihre künftigen
Mieter:innen."*

## 2. Zwei mögliche Vertriebswege für dieselbe Engine

| | B2C (Mietpilot als eigene Marke) | B2B2C (Engine als Technologie-Zulieferer) |
|---|---|---|
| Kunde | Private Eigentümer:in direkt | properti-Konkurrenten, Regionalmakler, Treuhänder, Verwaltungen |
| Vertrieb | Bezahlte Werbung, SEO, Empfehlungen | Direkter B2B-Vertrieb, wenige Partnerverträge |
| Kundengewinnungskosten | Hoch — seltener Einzelbedarf, kein Wiederkauf pro Person | Niedrig — ein Partner bringt hunderte Fälle mit |
| Wettbewerb | Direkt gegen properti (195 MA, Garantie-Produkt) | Kaum jemand bietet das als reines Backend an |
| Kapitalbedarf | Mittel-hoch (Marketing) | Niedrig |
| **Aktuelle Einschätzung** | Als alleiniges Modell riskant | **Ökonomisch stärker** — sollte Priorität bekommen |

**Empfehlung aus dem Stresstest:** Nicht "entweder/oder", sondern B2C als kleine, kontrollierte
**Referenzspur** (Beweis, dass die Technologie funktioniert, echte Fälle, echte Zahlen), während
parallel 2–3 B2B2C-Partnergespräche geführt werden. Wenn die B2B2C-Seite echtes Interesse zeigt,
verschiebt sich der Schwerpunkt dorthin.

## 3. Zielkunde

- **B2C:** Private Vermieter:in mit 1–5 Einheiten, vermietet selten (alle paar Jahre), macht
  heute entweder alles selbst (Homegate/ImmoScout24) oder zahlt einem Makler/einer Verwaltung.
- **B2B2C:** Kleine Regionalmakler, Treuhänder oder Verwaltungen, die selbst schon Kund:innen
  und Vertrauen haben, aber intern noch manuell screenen.

## 4. Geschäftsmodell & Preis

| | Klassischer Vermietungsservice (Markt, z. B. properti) | Mietpilot B2C |
|---|---|---|
| Preis | 1–1.5 Monatsmieten (≈ CHF 2'000–3'000) | CHF 890 pauschal |
| Fällig | bei Erfolg | nur bei Erfolg |
| Ausführung | Mensch (Makler), inkl. 5-Jahres-Mietergarantie | KI-Engine, Eigentümer:in entscheidet & besichtigt selbst |

Kein Abo — private Eigentümer:innen vermieten zu selten dafür. Auf Firmenebene bleibt der
Umsatz trotzdem wiederkehrend (laufend neue Fälle). Für B2B2C wäre das Modell eine
Lizenz-/Fallgebühr an den Partner statt eines Endkundenpreises.

## 5. Konkurrenz — ehrlicher Stand

- **properti**: kein Startup, sondern ein skalierter Incumbent — 195 Mitarbeitende,
  12 Standorte, 1.5 Monatsmieten **inklusive 5-Jahres-Mietergarantie**. Das eigentliche
  Vergleichsprodukt, nicht "billiger als properti" allein reicht als Positionierung.
- **Flatfox**: dominiert die professionelle Schiene (Verwaltungen) in der Schweiz.
- **propertyowner.ch**: bei genauerer Prüfung primär ein **Verkaufs**-, kein bestätigter
  Vermietungs-Wettbewerber (Korrektur einer früheren, zu unscharfen Aussage).
- Kein weisser Fleck wie bei der ursprünglich geprüften Alternative (Fristenwächter) — die
  Differenzierung ist der KI-getriebene Kosten-/Geschwindigkeitsvorteil bzw. der
  B2B2C-Zugang zu bestehendem Kundenvertrauen, nicht ein unbesetzter Markt.

## 6. Grösste offene Risiken

1. **Vertrauen** — überlassen private Eigentümer:innen einer KI wirklich die Vorauswahl?
2. **CAC** — seltener Einzelbedarf ohne Wiederkauf macht bezahlte Kundengewinnung im B2C-Modell
   potenziell teurer als die Marge verträgt (grösere Unsicherheit als die Technik selbst).
3. **properti-Reaktion** — bei sichtbarem Erfolg kann ein 195-Personen-Unternehmen schneller
   reagieren als ein Solo-Start.

**Bereits geklärt und kein Risiko mehr:** Eine vermutete kantonale Mietmakler-Bewilligungspflicht
(frühere Fassung dieser Analyse) — Kanton Zürich hat sie 2012 aufgehoben, betrifft den
wichtigsten Zielmarkt nicht. Ebenso kein Thema mehr: Besichtigung/Übergabe als
Skalierungsengpass (waren nie Mietpilot's eigene Aufgabe).

## 7. Woher die Idee kommt

Marktanalyse (30 Probleme, 10 Modelle) → **Fristenwächter** (echte Marktlücke, aber
"nicht sexy") → **Vermietungspilot** (KI-Agent für professionelle Verwaltungen) →
**Mietpilot** (dieselbe Engine, private Eigentümer:innen) → Stresstest ergibt **B2B2C als
ökonomisch stärkeren Vertriebsweg für dieselbe Technologie**.

## 8. Plan — aktueller Stand

1. ✅ Marktanalyse & Geschäftsmodell-Auswahl
2. ✅ Klickdummy gebaut (`prototyp/mietpilot.html`)
3. ✅ Validierungspaket erstellt (`docs/validierung-mietpilot.md`)
4. ✅ Strategischer Stresstest (`docs/mietpilot-stresstest.md`) — B2B2C-Option identifiziert,
   zwei Fehleinschätzungen im Verlauf selbst korrigiert (Maklerbewilligung, Besichtigungs-Engpass)
5. ⏳ **Jetzt:** Die ersten 5 von 20 verhaltensbasierten Interviews mit privaten
   Eigentümer:innen führen; parallel 2–3 Erstgespräche mit potenziellen B2B2C-Partnern
6. ⏭️ Danach: Go/No-Go, Schwerpunkt B2C vs. B2B2C anhand der echten Rückmeldungen festlegen

## 9. Kill Criteria (Kurzfassung)

Abbrechen bzw. Modell anpassen, wenn: Mehrheit will jede Bewerbung selbst sichten · CHF 890
wirkt unseriös billig oder zu teuer gegen DIY · unter 20 % würden es ausprobieren ·
CAC übersteigt die Marge deutlich · B2B2C-Erstgespräche zeigen kein Interesse.

---

*Alle Details: `docs/geschaeftsmodell-analyse-chf20k.md` (Ausgangsanalyse),
`docs/mietpilot-stresstest.md` (vollständiger Stresstest), `docs/validierung-mietpilot.md`
(Validierungsplan), `prototyp/README-mietpilot.md` (Klickdummy-Dokumentation).*
