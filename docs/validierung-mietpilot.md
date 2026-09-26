# Mietpilot — Validierung mit echten privaten Eigentümer:innen

> Bevor mehr Code entsteht: Dieses Paket testet die drei Annahmen, die über Mietpilot
> entscheiden — und die sich mit keinem Klickdummy beantworten lassen, egal wie gut er
> aussieht.

## Die drei Kernannahmen, die brechen können

1. **Vertrauen:** Überlassen private Eigentümer:innen einer KI wirklich die Vorauswahl der
   Mieter:innen, oder wollen sie jede Bewerbung selbst sehen? Das ist der grösste Risikofaktor
   des ganzen Konzepts — grösser als Preis oder Technik.
2. **Preis:** Wirkt CHF 890 pauschal attraktiv gegen den bekannten Marktpreis von
   1–1.5 Monatsmieten (≈ CHF 2'000–3'000), oder ist "KI statt Mensch" für dieses Thema eher ein
   Vertrauens-Malus als ein Preis-Vorteil?
3. **Modell:** Passt "nur bei Erfolg zahlen" zur Erwartungshaltung, oder erwarten Eigentümer:innen
   eher eine kleine Anmeldegebühr (Signal für Ernsthaftigkeit beider Seiten) plus Erfolgshonorar?

Alles andere (Design, Funktionsumfang, Portale-Integration) ist zweitrangig, solange diese drei
Fragen offen sind.

---

## 1. Zielliste: 30–40 private Eigentümer:innen finden

**Kriterium:** Besitzt 1–5 vermietete Wohnungen privat (keine professionelle Verwaltung
dazwischen), hat in den letzten 2 Jahren mindestens einmal selbst neu vermietet oder steht
kurz davor.

**Quellen, nach Trefferqualität:**
1. **Private Inserate auf Homegate/ImmoScout24** — Filter "von Privat" zeigt Eigentümer:innen,
   die *gerade jetzt* im Prozess stecken. Direktnachricht über die Portal-Kontaktfunktion oder
   Impressum-Telefonnummer, wenn angegeben.
2. **HEV-Regionalsektionen** (Hauseigentümerverband) — Mitgliederanlässe, Stammtische,
   Beratungsabende sind gute Anlaufstellen für Direktgespräche.
3. **Lokale Facebook-Gruppen** "Vermieter Schweiz", "Hauseigentümer [Kanton]",
   Immobilien-Investoren-Gruppen — dort wird aktiv über genau diese Probleme diskutiert.
4. **Bekanntenkreis / Referral-Frage** am Ende jedes Gesprächs: "Kennen Sie jemanden, der
   privat vermietet und gerade eine Wohnung frei hat oder hatte?"

**Tracking-Tabelle (Spalten):** Name | Anzahl Einheiten | Quelle | Aktuell am Vermieten? |
Kontaktiert am | Kanal | Call gebucht? | Ergebnis | Preisreaktion | Vertrauensreaktion |
Referral erhalten?

---

## 2. Outreach-Texte (bewusst persönlicher Ton, kein B2B-Jargon)

### Nachricht an private Inserenten auf Homegate/ImmoScout24

> Guten Tag
>
> Ich habe gesehen, dass Sie Ihre Wohnung privat vermieten. Ich arbeite gerade an einem Konzept,
> das genau diesen Prozess — Bewerbungen prüfen, Besichtigungen koordinieren, die richtige
> Person finden — für private Eigentümer:innen einfacher machen soll, und würde gerne verstehen,
> wie Sie das heute erleben.
>
> Hätten Sie 15 Minuten für ein kurzes, unverbindliches Telefonat? Es geht nicht um einen
> Verkauf, sondern um Ihre ehrliche Einschätzung.
>
> Freundliche Grüsse

### Post/Nachricht in Facebook-Gruppen für Vermieter

> Ich beschäftige mich gerade damit, wie private Vermieter:innen heute eine leerstehende Wohnung
> neu vermieten — von der ersten Anzeige bis zur Vertragsunterschrift. Wer hat 15 Minuten Zeit
> für ein kurzes Gespräch dazu? Kein Verkauf, nur ehrliches Feedback zu einem Konzept, das ich
> gerade prüfe. Gerne PN.

---

## 3. Gesprächsleitfaden (15–20 Min.)

### Warm-up (2 Min.)
- "Wie viele Wohnungen vermieten Sie privat, und wie oft kommt es vor, dass eine frei wird?"

### Ist-Prozess (5 Min.)
1. "Wie läuft das heute ab, wenn eine Wohnung frei wird — von der ersten Anzeige bis zur
   Vertragsunterschrift?"
2. "Was ist an diesem Prozess der nervigste oder zeitaufwändigste Teil?"
3. "Haben Sie schon einmal einen Makler oder eine Verwaltung für die Wiedervermietung
   beauftragt? Was hat das gekostet, und wie zufrieden waren Sie?"
4. "Ist es schon einmal vorgekommen, dass Sie im Nachhinein einen Mieter bereut haben? Was war
   die Folge?" *(konkrete Anekdote — zeigt die reale Schmerzintensität)*

### Vertrauenstest — die wichtigste Frage (5 Min.)
5. **"Stellen Sie sich vor, ein Dienst prüft automatisch alle Bewerbungen (Einkommen,
   Betreibungsauszug, Referenzen) und schlägt Ihnen die 3 besten Kandidat:innen mit Begründung
   vor — Sie treffen nur die letzte Entscheidung. Würden Sie dem vertrauen? Was müsste erfüllt
   sein, damit Sie sich damit wohlfühlen?"** *(Genau zuhören: verlangen sie, jede Bewerbung
   selbst zu sehen? Wollen sie die Kandidat:innen vorher persönlich treffen? Das sind die
   Bedingungen, die das Produkt erfüllen müsste.)*
6. "Was, wenn eine Software statt eines Menschen die Vorauswahl trifft — ändert das etwas an
   Ihrem Vertrauen, positiv oder negativ?"

### Preis- und Modelltest (4 Min.)
7. "Ein klassischer Vermietungsservice kostet marktüblich 1 bis 1.5 Monatsmieten. Was würden
   Sie für einen Service erwarten, der das automatisiert und schneller macht?" *(Zahl nicht
   vorschlagen, warten lassen.)*
8. Erst danach den Preis nennen: "Wir denken an eine Pauschale von rund CHF 890, fällig nur bei
   erfolgreicher Vermietung. Wie wirkt das auf Sie?"
9. "Würden Sie eine kleine Anmeldegebühr eher als seriös empfinden, oder stört Sie das?"

### Abschluss (2 Min.)
10. "Wenn es das gäbe — würden Sie es bei Ihrer nächsten Wiedervermietung ausprobieren?"
11. "Kennen Sie jemanden, der auch privat vermietet und mit dem ich sprechen dürfte?"

**Direkt nach dem Call notieren:**
- Vertrauensreaktion: offen / skeptisch mit Bedingungen / ablehnend
- Genannte Bedingungen für Vertrauen (z. B. "will Kandidaten vorher selbst sehen")
- Preis: spontan genannte Erwartung (CHF) / Reaktion auf CHF 890 (zu billig wirkt unseriös? / genau richtig? / zu teuer?)
- Anmeldegebühr gewünscht? Ja/Nein
- Konkrete Anekdote (schlechter Mieter, stressige Vermietung)? Ja/Nein
- Würde ausprobieren? Ja / vielleicht / nein
- Referral erhalten?

---

## 4. Erfolgsmetriken & Auswertung

| Metrik | Zielwert |
|---|---|
| Anteil mit offenem oder bedingt-offenem Vertrauen zur KI-Vorauswahl | ≥ 50 % |
| Anteil, die CHF 890 als attraktiv oder neutral einstufen | ≥ 50 % |
| Anteil mit konkreter negativer Vermietungs-Erfahrung (Anekdote) | — (qualitativ, zeigt Schmerzintensität) |
| Anteil "würde ausprobieren" | ≥ 30 % |
| Präferenz Erfolgshonorar vs. Anmeldegebühr + Erfolgshonorar | erfasst, nicht vorentschieden |

## 5. Kill Criteria (spezifisch für Mietpilot)

- Mehrheit sagt explizit, sie wollen **jede** Bewerbung selbst sichten und keiner
  automatisierten Vorauswahl vertrauen → Kernversprechen ("Sie müssen nichts tun") trägt nicht,
  Produkt müsste zu einem reinen Prüf-/Reporting-Tool ohne Autonomie umgebaut werden.
- Mehrheit hält CHF 890 für unseriös billig ("dann ist es sicher schlecht") **oder** deutlich zu
  teuer im Vergleich zum reinen DIY-Aufwand (viele vermieten heute schon kostenlos selbst über
  Homegate/ImmoScout24 und empfinden das nicht als grosses Problem) → Preis-Value-Fit fehlt.
- Weniger als 20 % würden es bei der nächsten Gelegenheit ausprobieren.
- Mehrfach genannt: rechtliche/Haftungsbedenken, wenn eine KI (statt man selbst) die Auswahl
  trifft und es später Ärger mit dem Mieter gibt → müsste rechtlich sauber gelöst werden, bevor
  überhaupt weitergebaut wird.

---

*Zugehörige Dokumente: `docs/geschaeftsmodell-analyse-chf20k.md` (Ausgangsanalyse),
`prototyp/README-mietpilot.md` (Klickdummy-Dokumentation).*
