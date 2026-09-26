# Mietpilot — Strategischer Stresstest

> Legende: **FAKT** (recherchiert, belegt) · **ANNAHME** (plausible Schätzung, nicht belegt) · **HYPOTHESE** (unbewiesene These, die das Geschäftsmodell trägt) · **ZU VALIDIEREN** (offene Frage, die vor Investition geklärt werden muss — teils mit einer Fachperson)

---

## Executive Summary

Mietpilot in der aktuellen Form — ein KI-Agent, der als **Endkundenmarke gegenüber privaten Eigentümer:innen** auftritt und die komplette Wiedervermietung für eine Pauschale von CHF 890 übernimmt — hält dem Stresstest **nicht ohne substanzielle Anpassung** stand. Drei Befunde sind entscheidend:

1. **properti ist kein kleiner Wettbewerber, sondern ein etablierter, kapitalstarker Incumbent** (195 Mitarbeitende, 12 Standorte, 1.5 Monatsmieten inkl. 5-Jahres-Mietergarantie). Eine reine "gleiches Ergebnis, günstiger"-Positionierung ist gegen einen Anbieter mit Garantie-Produkt, Vertrauensmarke und Skalenvorteil strukturell schwach — properti kann bei Bedarf selbst günstiger werden oder eine "AI-Lite"-Version launchen, ohne dass Mietpilot etwas dagegen ausrichten kann.
2. **Korrektur einer ersten Fassung dieser Analyse:** Hier stand zunächst, eine kantonal geregelte Mietmakler-Bewilligungspflicht sei ein zentrales, ungeklärtes Risiko. Das war falsch bzw. veraltet und beruhte auf einer KI-Suchzusammenfassung statt einer Primärquelle. Tatsächlich hat **Kanton Zürich die Bewilligungspflicht für die gewerbsmässige Vermietungsvermittlung per 1. Januar 2012 explizit aufgehoben** (Mitteilung Kanton Zürich, zh.ch) — für den wichtigsten Zielmarkt ist das kein Thema. Genf (LPI) und Tessin haben weiterhin eigene, allgemeine Maklerregulierungen, die aber nicht mietspezifisch sind und nur bei dortiger Niederlassung greifen. Details und Folgen dieser Korrektur unter Phase 10.
3. **Die eigentlich verteidigbare Chance liegt nicht im Endkundengeschäft, sondern im B2B2C-Vertrieb der Screening-/Ranking-Engine an bereits vertrauenswürdige Player** (properti selbst, kleinere Regionalmakler, Verwaltungen, Treuhänder, der Grundeigentümerverband) — das senkt Kundengewinnungskosten drastisch, nutzt bestehende Vertrauensbeziehungen und passt deutlich besser zu den Ausgangskriterien "1 Person, wenig Kapital, hohe Marge, kaum Personal". Dieser Punkt steht **weiterhin**, jetzt aber primär gestützt auf properti's Marktstärke und die CAC-Ökonomie (Phase 8), nicht mehr auf eine rechtliche Hürde.
4. **Zweite Korrektur, diesmal zugunsten des B2C-Modells:** Besichtigung und Übergabe wurden ursprünglich als physischer Skalierungsengpass geführt. Bei genauerem Hinsehen war das eine Vermischung — diese Schritte waren nie etwas, das Mietpilot selbst bestaffen müsste, sondern schon immer Sache der Eigentümer:in. Als bewusste, dauerhafte Scope-Entscheidung (kein Partnernetz, kein Feldpersonal, jemals) bleibt Mietpilot vollständig digital/remote skalierbar — das stärkt das B2C-Modell auf der Skalierbarkeits-Dimension deutlich, ändert aber nichts an properti's Marktstärke oder der CAC-Frage. Details unter Phase 5 und 9.

**Antwort auf die eigentliche Frage (Phase 19):** Mit CHF 0 und ohne bestehende Technologie würde ich **nicht** eine Endkundenmarke "Mietpilot" gegen properti aufbauen. Ich würde die gleiche KI-Engine (Screening, Ranking, Kommunikation) **als White-Label/API an bestehende Vermietungsdienstleister verkaufen** — das ist im Detail unter Phase 17 und 19 begründet.

Das heisst nicht "Stopp". Es heisst: **B2C-Version zuerst so klein wie möglich real testen (Phase 14, Experiment 1–3), parallel die B2B2C-Variante mit 3–5 Gesprächen bei genau den Playern prüfen, die heute schon Vertrauen bei privaten Eigentümer:innen haben.**

---

## Phase 1 — Problem

| Frage | Antwort | Status |
|---|---|---|
| Konkretes Problem | Eine leerstehende Wohnung neu zu vermieten kostet Zeit (Exposé, Inserat, 15–30+ Bewerbungen sichten, Besichtigungen koordinieren) und Risiko (falscher Mieter = Zahlungsausfall, Ärger, Aufwand) | FAKT (strukturell, durch Bewerbungsdossier-Standard und Marktangebot belegt) |
| Häufigkeit pro Eigentümer | Sehr niedrig — ein:e Eigentümer:in mit 1–5 Wohnungen erlebt das vermutlich alle 2–6 Jahre pro Einheit (Schweizer Mietverhältnisse sind tendenziell langlebig) | ANNAHME (keine belastbare Schweizer Fluktuationsstatistik pro Privateigentümer gefunden) |
| Kosten heute | 1–1.5 Bruttomonatsmieten bei professionellem Service (≈ CHF 2'000–3'000), CHF 0 + eigene Zeit bei DIY | FAKT (properti-Preis) |
| Zeitaufwand DIY | Nicht recherchiert, aber aus Bewerbungsdossier-Praxis ableitbar: Sichtung von 15–30+ vollständigen Dossiers (Betreibungsauszug, Lohnausweis, Referenzen) ist mehrere Stunden Arbeit | ANNAHME |
| Leidensdruck | Mittel bis hoch bei der *Auswahl* (Angst vor Fehlentscheidung), niedrig bis mittel beim *Inserieren* (Portale machen das bereits einfach) | HYPOTHESE — genau das testet Interview-Frage "Was war am aufwendigsten?" |
| Ist es "nice to have" oder echtes Problem? | Vermutlich ein **episodisches, aber emotional aufgeladenes** Problem — nicht dauerhaft schmerzhaft wie eine Compliance-Pflicht, aber in dem Moment, in dem es auftritt, mit echtem finanziellem Risiko verbunden | HYPOTHESE |
| Heutige Alternativen | (a) komplett selbst über Homegate/ImmoScout24, (b) properti/lokaler Makler gegen 1–1.5 Monatsmieten, (c) bestehende Verwaltung beauftragen (falls schon eine hat), (d) Familie/Bekannte fragen | FAKT |
| Warum wechseln? | Nur wenn eine Alternative spürbar günstiger UND mindestens gleich vertrauenswürdig ist — bei einem seltenen, hochriskanten Entscheid ist "billiger" allein selten genug Wechselgrund | HYPOTHESE |
| Job-to-be-done | *"Verschaff mir einen zuverlässigen Mieter, ohne dass ich einen teuren Fehler mache oder wochenlang Bewerbungen wälze."* | Formulierung, keine Quelle nötig |

**Problem in einem Satz:** Private Eigentümer:innen wollen bei einer seltenen, aber riskanten Wiedervermietung schnell einen zuverlässigen Mieter finden, ohne dafür wochenlang Bewerbungen zu prüfen oder eine volle Maklerprovision zu zahlen.

---

## Phase 2 — Zielgruppen im Vergleich

| Zielgruppe | Problemintensität | Zahlungsbereitschaft | Marktgrösse (CH) | Akquisitionskosten | Wiederholungshäufigkeit | Vertrauen nötig | Automatisierbarkeit | Haftungsrisiko | Skalierbarkeit |
|---|---|---|---|---|---|---|---|---|---|
| A) 1 Wohnung | niedrig-mittel — trifft selten, oft emotional (eigene alte Wohnung) | niedrig-mittel, preissensibel | sehr gross (Hunderttausende) | hoch (schwer gezielt anzusprechen, kein Wiederkauf) | sehr niedrig (evtl. einmalig im Leben) | hoch | hoch | mittel | niedrig (kein Wiederkauf, CAC dominiert) |
| B) 2–5 Wohnungen | mittel — hat Vergleichserfahrung, kennt den Aufwand | mittel-hoch | gross (Hunderttausende, s. BFS ~45 % Privatbesitz) | mittel (über Portale/Verbände erreichbar) | niedrig (alle paar Jahre pro Einheit) | hoch, aber geringer als bei A (schon Erfahrung mit Prozess) | hoch | mittel | mittel |
| C) 5–20 Wohnungen | hoch — spürt Aufwand real, oft ohne eigene Verwaltung | hoch | klein-mittel (Zehntausende) | niedriger (klar identifizierbar über Grundbuch/Handelsregister, HEV) | mittel (mehrmals im Jahr möglich) | mittel (denkt bereits geschäftlich) | hoch | mittel-hoch (mehr Fälle = mehr Fehlerpotenzial) | hoch — **stärkster Kandidat** |
| D) Kleine Immobilieninvestoren | hoch, sehen es als Betriebskosten-Thema | hoch | klein | niedrig (Netzwerke, Foren, Investorengruppen) | mittel-hoch | mittel | hoch | mittel-hoch | hoch |
| E) Erbengemeinschaften | hoch, oft mehrere Entscheider:innen, oft ortsfern | mittel — Entscheidung dauert wegen Miteigentümer:innen | klein, schwer identifizierbar | hoch (keine zentrale Liste) | sehr niedrig (Einzelereignis) | sehr hoch (Streitpotenzial zwischen Erben) | mittel (Kommunikation mit mehreren Parteien) | hoch (Mitspracherecht, Anfechtungsrisiko) | niedrig |
| F) Ortsferne Eigentümer:innen | hoch — können nicht selbst besichtigen | hoch | Teilmenge von A/B/C, keine eigene Grösse bekannt | mittel | wie A/B/C | sehr hoch (delegieren zwangsläufig mehr) | hoch | mittel | mittel — **überzeugendste Nische, aber klein** |
| G) Nebenbei-Vermieter:innen (Studio, Einliegerwohnung) | niedrig — geringe Miete, geringes Risiko | niedrig | gross, aber viele davon vermieten möbliert/kurzfristig (anderer Markt, eher Airbnb-nah) | hoch | niedrig | niedrig-mittel | hoch | niedrig | niedrig (zu geringer Fallwert für CHF 890) |
| H) Mehrere jährliche Mieterwechsel (z. B. WG-Zimmer, Studenten) | hoch — Wiederholung erzeugt echten Aufwand | mittel | klein-mittel | niedriger (wiederkehrender Kontakt möglich) | **hoch — einziges Segment mit echtem Wiederkaufsverhalten** | mittel (lernt Vertrauen über Zeit) | hoch | mittel | mittel-hoch |
| I) Kleine Verwaltungen (1–3 MA) | mittel-hoch, aber das ist eigentlich der Vermietungspilot-Case (B2B), nicht Mietpilot | hoch (Abo-fähig) | mittel (mehrere tausend Firmen) | mittel | hoch (Kerngeschäft) | mittel | hoch | mittel | hoch — **das ist strukturell ein anderes Produkt (Vermietungspilot), kein Mietpilot-Fall** |
| J) B2B2C-Partner (properti, Regionalmakler, Treuhänder, HEV) als "Kunde" | — (kein Endkunden-Problem, sondern Vertriebskanal) | hoch pro Abschluss, dafür wenige Abschlüsse nötig | sehr klein (Dutzende relevante Partner in CH) | **niedrig** (Direktansprache, B2B-Sales) | hoch (laufende Nutzung durch den Partner) | mittel (Partner prüft Technologie, nicht jeder Endkunde einzeln) | hoch | Partner trägt Endkunden-Vertrauen, Mietpilot liefert nur die Engine | **am höchsten pro investierter Stunde** |

**Einordnung:** C (5–20 Wohnungen) und F (ortsferne Eigentümer:innen) sind die stärksten *Endkunden*-Segmente — kleiner, aber mit höherem Fallwert und höherer Automatisierungs-Akzeptanz als A/B. J (B2B2C-Partner) ist strukturell das effizienteste Segment, weil es das CAC-Problem umgeht, das A/B/C/D/E/F alle teilen: **seltener Bedarf pro Einzelperson macht bezahlte Werbung teuer**, während ein Partner mit bestehendem Kundenstamm dieses Problem nicht hat.

---

## Phase 3 — Wettbewerb (Schweiz)

| Anbieter | Angebot | Preis | Zielgruppe | Automatisierungsgrad | Menschlicher Anteil | Stärken | Schwächen |
|---|---|---|---|---|---|---|---|
| **properti** | Voller Maklerservice: Vermarktung, Mieterselektion, Vertrag, **5-Jahres-Mietergarantie** | 1.5 Bruttomonatsmieten, min. CHF 3'000 | Private & institutionelle Eigentümer:innen | Teilweise (eigene Datenbank, digitalisierter Prozess), aber personalgetrieben | Hoch — 195 MA, 12 Standorte | Skalierte Marke, Garantie-Produkt (starkes Vertrauenssignal), Vollservice | Teuer, kein Selbstbedienungs-/Low-Cost-Segment |
| **propertyowner.ch** (Grundeigentümerverband) | **Primär Verkaufsservice** (provisionsfrei für Verkäufer, Gebühr beim Käufer) — nicht klar als Vermietungsdienstleister positioniert | Nicht recherchierbar für Vermietung; Storno-Gebühr CHF 3'000 im Verkaufsprodukt | Verkäufer:innen | Unklar | Unklar | Marken-Vertrauen über Verband | **Korrektur zur vorherigen Analyse:** Kein bestätigter direkter Wettbewerber im Vermietungsgeschäft — muss vor jeder weiteren Aussage direkt auf der Site geprüft werden |
| **Homegate / ImmoScout24** | Reine Inserate-Plattformen, teils mit Business-Tools (Bewerbermanagement, Kommunikationsfunktionen) für Verwaltungen | Pay-per-Listing bzw. Bündelpreise | Alle | Niedrig — Werkzeug, kein Full-Service | Eigentümer:in macht alles selbst | Reichweite, Standard-Tool jeder DIY-Vermietung | Kein Screening, keine Entscheidungsunterstützung |
| **Comparis** | Vergleichs-/Inseratsportal, Ratgeberinhalte | — | Alle | Niedrig | Eigentümer:in macht alles selbst | Reichweite | Kein Full-Service |
| **Klassische lokale Makler/Verwaltungen** | Individuell, oft ohne digitale Prozesse | markt­üblich 1–1.5 Monatsmieten oder % der Jahresmiete bei laufender Verwaltung | Alle, oft langjährige Kundenbeziehung | Niedrig | Sehr hoch | Persönliche Beziehung, lokale Marktkenntnis | Langsam, teuer, nicht skalierbar, kein digitales Erlebnis |
| **AI-Screening-/PropTech-Tools international** (z. B. US-Anbieter) | Automatisiertes Bewerber-Screening als Baustein, nicht Full-Service | Unterschiedlich, meist SaaS-Gebühr an Verwaltungen | Professionelle Vermieter/Verwaltungen | Hoch, aber nur ein Teilschritt | Niedrig | Bewährte Technologie-Bausteine (Kreditprüfung, Ranking) | Nicht Schweiz-spezifisch, nicht auf private Eigentümer:innen zugeschnitten |

**Was ein Kunde heute tatsächlich tut, wenn eine Wohnung frei wird (rekonstruiert aus Bewerbungsdossier- und Marktrecherche, nicht direkt befragt — ZU VALIDIEREN in Phase 15):** Vermutlich zuerst selbst auf Homegate/ImmoScout24 inserieren (kostengünstig, bekannt), bei Überforderung oder Zeitmangel erst dann an einen Makler wie properti oder die lokale Verwaltung delegieren. Der Entscheidungspunkt "DIY vs. Service" ist der eigentliche Umkämpfte Moment — nicht "properti vs. Mietpilot".

---

## Phase 4 — Fünf alternative Produktmodelle aus demselben Grundproblem

| Modell | Beschreibung | Problemstärke | Zahlungsbereitschaft | Automatisierbarkeit | Skalierbarkeit | Vertrauensbarriere | Rechtliches Risiko | Konkurrenzdruck | Time-to-Market | Kapitalbedarf | Marge |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **1. Mietpilot Full-Service B2C** (aktuelle Idee) | KI übernimmt alles, Endkundenmarke gegen private Eigentümer:innen | mittel | mittel | hoch | mittel (CAC-limitiert) | sehr hoch | niedrig-mittel (v. a. Art. 21 nDSG; Mietmakler-Bewilligung in ZH seit 2012 aufgehoben, nur in GE/TI bei dortiger Niederlassung relevant) | hoch (properti) | mittel | mittel-hoch | mittel (nach CAC) |
| **2. KI-Bewerberfilter als eigenständiges Tool** | Eigentümer:in macht Inserat weiter selbst (Homegate etc.), Mietpilot übernimmt nur Screening + Ranking der eingehenden Bewerbungen | mittel | niedrig-mittel (Teilservice = geringere Zahlungsbereitschaft) | sehr hoch | hoch | mittel (kleinerer Vertrauensschritt als Vollservice) | mittel (immer noch Profiling-Frage, aber kein Makler-Thema) | mittel | kurz | niedrig | hoch (schlanker Scope) |
| **3. Besichtigungs- & Kommunikations-Automatisierung** | Reine Terminkoordination + automatisierte Bewerberkommunikation, Auswahl bleibt beim Menschen | niedrig-mittel | niedrig | hoch | hoch | niedrig | niedrig | mittel-hoch (viele Terminbuchungstools) | kurz | niedrig | mittel |
| **4. "Vermietung as a Service" — White-Label-Engine für Makler/Verwaltungen (B2B2C)** | Dieselbe Technologie, verkauft an properti-Konkurrenten, Regionalmakler, Treuhänder, Verwaltungen als internes Effizienz-Tool | hoch (deren Personalkosten sind das Problem) | hoch (B2B-Preise) | hoch | **sehr hoch** (ein Vertragsabschluss = Hunderte Fälle) | niedrig (Partner vertraut Technologie, nicht Endkunde direkt) | mittel (Verantwortung liegt beim Partner als Auftraggeber) | niedrig (kaum jemand bietet das als reines Backend an) | mittel | niedrig-mittel | **sehr hoch** |
| **5. Digitale Vermietungsagentur mit menschlichem Overlay ("Hybrid")** | Wie properti, aber schlanker: KI macht 80 % der Arbeit, 1–2 Personen prüfen/verantworten die letzten 20 % (Qualitätssicherung, Haftung) | hoch | hoch (kann ähnlich wie properti bepreist werden, aber günstiger durch Effizienz) | mittel-hoch | mittel | mittel (Mensch als Vertrauensanker sichtbar) | mittel (Haftung liegt klar bei der Firma, nicht bei "der KI") | hoch (direkter properti-Wettbewerb) | mittel-lang | mittel | mittel |

**Einordnung:** Modell 4 (B2B2C-Engine) sticht heraus — höchste Skalierbarkeit, niedrigstes Konkurrenzrisiko, niedrigster Kapitalbedarf, höchste Marge, UND es umgeht das Vertrauensproblem, indem es nicht gelöst, sondern **outgesourct** wird (an den Partner, der das Vertrauen längst hat). Modell 2 ist der pragmatischste **Einstiegspunkt**, um Modell 4 mit echten Daten/Referenzen zu unterfüttern.

---

## Phase 5 — Prozesszerlegung & Human-in-the-Loop-Architektur

| Schritt | KI kann es | Software kann es | Mensch nötig? | Fehlerrisiko | Kritikalität eines Fehlers | Automatisierungsweg |
|---|---|---|---|---|---|---|
| Objektaufnahme | teilweise (Text aus Formulareingabe) | ja | nein, wenn Eigentümer:in selbst Angaben macht | niedrig | niedrig | Formular + Plausibilitätsprüfung |
| Mietzinsvorschlag | ja (Vergleichsdaten) | ja | Empfehlung ja, **Freigabe durch Eigentümer:in zwingend** (Mietrecht: Anfangsmietzins hat rechtliche Konsequenzen) | mittel | **hoch** (zu hoher/tiefer Zins hat rechtliche/finanzielle Folgen) | KI schlägt vor, Mensch bestätigt |
| Exposé-Erstellung | ja | ja | nein (Review empfehlenswert) | niedrig | niedrig | vollautomatisch mit Vorschau |
| Inserat auf Portalen | ja (bei API-Zugang) | ja | nein | niedrig | niedrig | vollautomatisch, **Portal-API-Integration nötig (technischer Engpass, s. Phase 9)** |
| Interessent:innen-Aufnahme | ja | ja | nein | niedrig | niedrig | vollautomatisch |
| Kommunikation (Standardfragen, Terminvorschläge) | ja | ja | nur Eskalationen | niedrig-mittel | niedrig-mittel | vollautomatisch mit Eskalationspfad |
| Bewerbungen strukturieren | ja | ja | nein | niedrig | niedrig | vollautomatisch (OCR/Dokumenten-Parsing) |
| Dokumentenprüfung (Echtheit Betreibungsauszug, Lohnausweis) | teilweise (Plausibilität, Formatprüfung) | teilweise | **ja, bei Verdacht auf Fälschung** | mittel | **hoch** (Betrugsrisiko) | KI prüft, markiert Auffälligkeiten, Mensch entscheidet bei Flag |
| Vorqualifizierung / Scoring | ja | ja | **Kriterien müssen von Menschen definiert und regelmässig auf Diskriminierungsrisiko geprüft werden** | mittel | **hoch** (Diskriminierungsrecht, Art. 8 BV) | KI berechnet nach klar definierten, diskriminierungsfreien Kriterien; Kriterien-Set wird von Menschen festgelegt/auditiert, nicht von der KI selbst gelernt |
| Absagen kommunizieren | ja | ja | nein für Standardabsage | niedrig | mittel (Reputationsrisiko bei unhöflichem Ton) | vollautomatisch mit geprüften Textbausteinen |
| Besichtigung organisieren | ja (Terminlogik) | ja | **physische Durchführung braucht einen Menschen — und das ist bewusst und dauerhaft die Eigentümer:in selbst, nicht Mietpilot-Personal** (Scope-Entscheidung, s. Phase 9) | niedrig | niedrig | KI koordiniert Termine vollautomatisch, **Eigentümer:in führt immer selbst durch** — kein Partnernetz, keine Mietpilot-eigene Feldpräsenz |
| Bewerber:innen bewerten | ja | ja | Letzte Instanz: Mensch (s. Art. 21 nDSG) | mittel | hoch | KI erstellt Ranking + Begründung, **Eigentümer:in trifft Enddecision immer** |
| Empfehlung (3 statt 30) | ja | ja | nein | niedrig | mittel | vollautomatisch |
| Finale Entscheidung | nein — bewusst nicht | — | **ja, immer** | — | — | Mensch (Eigentümer:in) |
| Vertrag vorbereiten | ja (Vorlage) | ja | **Prüfung/Freigabe durch Eigentümer:in oder Fachperson bei Abweichungen vom Standard** | mittel | hoch (rechtsverbindliches Dokument) | KI erstellt Entwurf, Mensch unterschreibt |
| Übergabe | nein | teilweise (Protokoll-Tool) | **ja, physisch — ebenfalls immer Eigentümer:in/Mieter:in selbst, nie Mietpilot** | niedrig | mittel | Mietpilot liefert nur die Vorlage/Checkliste, Durchführung liegt vollständig ausserhalb des Mietpilot-Betriebs |

**Kernregel der Human-in-the-Loop-Architektur:** Der Mensch bleibt exakt dort im Prozess, wo (a) das Gesetz eine Möglichkeit zur menschlichen Überprüfung verlangt (Art. 21 nDSG bei Ablehnungen), (b) eine physische Handlung nötig ist (Besichtigung, Übergabe), oder (c) eine folgenreiche, schwer rückgängig zu machende Entscheidung ansteht (Mietzins, Vertragsunterschrift, finale Mieterwahl). Alles andere ist ohne Not automatisierbar. **Wichtige Klarstellung (Scope-Entscheidung):** Bei (b) ist "der Mensch" bewusst immer die Eigentümer:in selbst — Mietpilot baut zu keinem Zeitpunkt ein eigenes Feldpersonal oder Partnernetz für Besichtigung/Übergabe auf. Das hält das gesamte Unternehmen dauerhaft rein digital/remote betreibbar (s. Phase 9).

---

## Phase 6 — Vertrauensmodell

**Warum sollte ein:e Eigentümer:in einer KI vertrauen?** Nicht, weil die KI "smart" ist, sondern weil das System **nachvollziehbar, umkehrbar und im Ernstfall von einem Menschen korrigierbar** ist. Vertrauen entsteht aus Kontrolle, nicht aus Blindvertrauen.

| Vertrauenshebel | Konkrete Umsetzung |
|---|---|
| Transparenz | Jede Empfehlung zeigt die konkreten Kriterien und Werte, nicht nur einen Score |
| Nachvollziehbare Kriterien | Fest definiertes, diskriminierungsfrei geprüftes Kriterien-Set (Einkommen, Betreibungen, Referenzen) — offen einsehbar, nicht "Black Box" |
| Menschliche Kontrolle | Eigentümer:in trifft *immer* die letzte Entscheidung — nie eine automatische Vertragszusage ohne Klick |
| Identitäts-/Dokumentenprüfung | Standardmässige Prüfung auf Vollständigkeit/Plausibilität, Verdachtsfälle werden markiert, nicht automatisch abgelehnt |
| Referenzen | Automatisierte, aber protokollierte Anfrage beim vorherigen Vermieter |
| Haftungsmodell | Klar kommunizieren: Mietpilot bereitet vor, **Eigentümer:in entscheidet und trägt die Verantwortung wie bisher** — keine stille Haftungsverschiebung |
| Geld-zurück-/Garantie-Element | Langfristig denkbar (wie properti), am Anfang **bewusst nicht versprechen**, was finanziell nicht gedeckt ist |
| Persönlicher Ansprechpartner | Bei einem 1-Personen-Start: eine echte Telefonnummer/E-Mail für Rückfragen, kein reiner Chatbot |
| Klare Entscheidungsgrenzen | Explizit kommunizieren, was die KI *nie* automatisch tut (keine automatische Zusage, keine automatische endgültige Absage ohne Übersicht) |

### "3 Bewerber statt 30" — Feature-Spezifikation

Damit ein:e Eigentümer:in sagt *"Genau so möchte ich es"*, muss die Funktion:

1. **Zeigen, wie viele Bewerbungen tatsächlich eingegangen sind** (Transparenz über den vollen Umfang, nicht nur die Auswahl — sonst wirkt es, als würde etwas verheimlicht).
2. **Pro empfohlener Person eine kurze, in Alltagssprache verständliche Begründung** liefern (kein Score ohne Kontext — s. bereits gebautes `mietpilot.html`).
3. **Einen Klick anbieten, um die archivierten 27 weiteren Bewerbungen einzusehen** (nicht standardmässig geöffnet, aber nie versteckt — Kontrolle bleibt beim Menschen).
4. **Die Ablehnungsgründe für nicht empfohlene Bewerbungen auf Anfrage zeigen** (deckt Art. 21 nDSG-Pflicht ab: Möglichkeit, den eigenen Standpunkt darzulegen).
5. **Nie automatisch an den Bewerber kommunizieren, dass er/sie "abgelehnt" ist, ohne dass die Eigentümer:in das initiiert oder zumindest im Vorfeld freigegeben hat** — sonst entsteht eine automatisierte Einzelentscheidung mit Rechtsfolge ohne Vertragsbezug, was Art. 21 nDSG voll auslöst.

---

## Phase 7 — Geschäftsmodelle im Vergleich

| Modell | Umsatz/Kunde | Aufwand | Bruttomarge | Zahlungsbereitschaft | Skalierbarkeit | Psychologische Hürde |
|---|---|---|---|---|---|---|
| **A: CHF 890 Erfolgshonorar** | CHF 890 | hoch pro Fall (Vollservice) | mittel-hoch (s. Phase 8) | ANNAHME: mittel — muss in Interviews getestet werden | mittel (CAC-limitiert) | mittel ("wirkt das seriös?") |
| **B: CHF 490 Basis + Zusatzleistungen** (z. B. Express-Vermarktung, Premium-Platzierung, persönliche Besichtigung) | CHF 490–900+, variabel | mittel (Basis schlank, Zusatz on-demand) | mittel | HYPOTHESE: senkt Einstiegshürde, aber Zusatzverkauf ist zusätzlicher Aufwand | mittel-hoch | niedriger (kleinerer erster Schritt) |
| **C: CHF 990 All-inclusive** | CHF 990 | wie A | ähnlich A, leicht besser | HYPOTHESE: kaum Unterschied zu A, evtl. zu nah an properti | mittel | ähnlich A |
| **D: Erfolgshonorar als Prozentsatz der Jahresmiete** (z. B. 30–40 % einer Monatsmiete statt properti's 150 %) | variiert mit Mietzins (CHF 500–1'500+) | wie A | höher bei teuren Objekten, geringer bei günstigen | HYPOTHESE: fühlt sich "fairer" an als Pauschale, aber schwerer zu kommunizieren ("Was heisst das in Franken?") | mittel | mittel (Rechenaufwand für Kund:in) |
| **E: kleine Grundgebühr (z. B. CHF 90) + reduziertes Erfolgshonorar (z. B. CHF 490)** | CHF 580 total, aber Grundgebühr sofort fällig | wie A | **beste Cashflow-Eigenschaft** (Grundgebühr deckt Portalkosten sofort, unabhängig vom Ausgang) | HYPOTHESE: signalisiert beidseitigen "Skin in the Game" (verhindert unseriöse Anfragen), aber Einstiegshürde steigt | mittel-hoch | mittel (Grundgebühr kann abschrecken, filtert aber auch) |
| **F: Premium mit persönlicher Betreuung** (properti-Preisniveau, aber KI-gestützt schneller) | CHF 2'000–3'000 | hoch, aber gedeckt | hoch in CHF, Marge ähnlich wie properti | HYPOTHESE: nur relevant für Segment C/D/F aus Phase 2, nicht für die breite Masse | niedrig (verliert den Kostenvorteil als USP) | niedrig, aber winzige Zielgruppe |
| **G: B2B2C — Lizenz-/API-Gebühr an Makler/Verwaltungen** (pro Fall oder monatliches SaaS-Kontingent) | CHF 50–150 pro Fall an den Partner, oder CHF 500–3'000/Mt. SaaS je nach Fallvolumen | **niedrig** (kein Endkunden-Support, kein Marketing an Privatpersonen) | **sehr hoch** (keine CAC-Last) | FAKT-nah: B2B-Software wird für nachweisbare Effizienzgewinne bezahlt, wenn ROI klar vorgerechnet wird | **sehr hoch** — ein Partner bringt hunderte Fälle | niedrig (Partner verkauft es intern seinen Kund:innen weiter, nicht Mietpilot direkt) |

**Kritische Prüfung von CHF 890 (wie explizit gefordert):** CHF 890 liegt bei knapp einem Drittel des properti-Preises. Das ist rechnerisch plausibel als Marketing-Anker ("ein Drittel"), aber **ungetestet**, ob dieser Preis (a) hoch genug ist, um die Unit Economics bei realistischem CAC zu tragen (s. Phase 8 — bei hohem CAC frisst Marketing die gesamte Marge auf), und (b) nicht *zu niedrig* wirkt, um bei einer so folgenreichen Entscheidung (wer zieht ein) als seriös wahrgenommen zu werden. Modell E (Grundgebühr + reduziertes Erfolgshonorar) verdient ernsthafte Prüfung, weil es genau dieses Cashflow- und Seriositäts-Problem gleichzeitig adressiert.

---

## Phase 8 — Unit Economics

**Annahmen (alle ANNAHME, nicht FAKT — müssen mit echten Zahlen ersetzt werden):**
- Variable Kosten pro Fall: Portal-Inserate CHF 80, Bewerbungsverarbeitung/KI (Ø 20 Bewerbungen inkl. Dokumenten-Parsing) CHF 40, Zahlungsgebühren (Stripe, ~3 %) CHF 27, manuelle Qualitätssicherung CHF 30 → **≈ CHF 177 pro Fall (≈ 20 % von CHF 890)**
- Deckungsbeitrag I (vor Marketing) pro Fall: **≈ CHF 713 (≈ 80 %)**
- Customer Acquisition Cost (CAC): **die grösste Unsicherheit im ganzen Modell** — seltener, hochwertiger Einzelbedarf, kein Wiederkauf pro Person. Geschätzt CHF 250–400 bei jungem, bezahltem-Ads-dominiertem Kanal-Mix, sinkend auf CHF 100–180 bei etabliertem SEO-/Empfehlungs-Anteil in späteren Skalenstufen.
- Support/Personal: 1 FTE (Qualitätssicherung, Eskalationen, Kundenservice) deckt bei aktuellem Automatisierungsgrad geschätzt **800–1'200 Fälle/Jahr**.

| Vermietungen/Jahr | Umsatz (CHF) | Variable Kosten (CHF) | Marketing/CAC (CHF, Ø sinkend) | Personal nötig (FTE) | Personalkosten (CHF, Ø 110k beladen) | Deckungsbeitrag nach allem (CHF) |
|---|---|---|---|---|---|---|
| 100 | 89'000 | 17'700 | 350 × 100 = 35'000 | 1 (Gründer:in selbst) | 0 (noch kein Angestellter) | **36'300** |
| 500 | 445'000 | 88'500 | 280 × 500 = 140'000 | 1 | 110'000 | **106'500** |
| 1'000 | 890'000 | 177'000 | 220 × 1'000 = 220'000 | 1–2 | 165'000 | **328'000** |
| 5'000 | 4'450'000 | 885'000 | 180 × 5'000 = 900'000 | 5–6 | 605'000 | **2'060'000** |
| 10'000 | 8'900'000 | 1'770'000 | 150 × 10'000 = 1'500'000 | 9–12 | 1'155'000 | **4'475'000** |
| 50'000 | 44'500'000 | 8'850'000 | 120 × 50'000 = 6'000'000 | 40–55 | 5'225'000 | **24'425'000** |

**Explizit beantwortet — wie viele Vermietungen/Monat für CHF 1 Mio. Jahresumsatz?**
CHF 1'000'000 ÷ CHF 890 ≈ **1'124 Vermietungen/Jahr ≈ 94/Monat ≈ ~22/Woche.**

**Wie stark muss automatisiert werden, damit CHF 890 wirtschaftlich funktioniert?**
Bei den obigen Annahmen bleibt bereits bei 100 Fällen/Jahr ein positiver Deckungsbeitrag — **das Modell bricht nicht an der Automatisierung, sondern potenziell am CAC.** Wenn CAC statt CHF 350 bei CHF 890+ läge (durchaus plausibel bei einem seltenen, beratungsintensiven Produkt ohne Wiederkauf), wäre **jeder gewonnene Kunde ein Nullsummenspiel oder Verlust** — das ist der Punkt, an dem das Modell tatsächlich kippen kann, nicht an der KI-Kostenseite. **Genau das ist ZU VALIDIEREN (Phase 14, Experiment 2 und 5), nicht anzunehmen.**

---

## Phase 9 — Skalierbarkeit: Engpässe

| Engpass | Skaliert automatisch? | Warum (nicht) | Lösung |
|---|---|---|---|
| Besichtigungen & Übergabe (physische Durchführung) | **Ja, für Mietpilot selbst — kein Engpass** *(korrigiert nach Rückmeldung: ursprünglich als Engpass geführt)* | Die physische Präsenz ist nötig, aber **das war nie Mietpilot's Aufgabe** — die Eigentümer:in führt Besichtigung und Übergabe immer selbst durch, wie sie es auch ohne Mietpilot täte. Mietpilot liefert nur die Terminlogistik und Checklisten dazu, vollautomatisch | Bewusste Scope-Entscheidung: **kein** Partnernetz, **kein** Schliessfach-Produkt, **kein** eigenes Feldpersonal — dauerhaft ausgeschlossen, nicht nur "am Anfang nicht" |
| Telefonate/Eskalationen | Teilweise | KI-Voice-Agenten sind 2026 leistungsfähig, aber Vertrauen bei einem sensiblen Thema (wer zieht ein) ist bei reiner Voice-KI geringer | Mensch für echte Eskalationen, KI für Standardfragen; Eskalationsquote laufend messen und senken |
| Dokumentenprüfung bei Verdachtsfällen | Teilweise | Gefälschte Lohnausweise/Betreibungsauszüge sind ein reales Betrugsrisiko, KI-Erkennung nie 100 % | Klar definierte Eskalationsschwellen, stichprobenartige menschliche Nachkontrolle statt 100%-Prüfung |
| Support allgemein | Teilweise (s. Phase 8 — sublinear, nicht kostenlos) | Jeder Fall hat Restrisiko für Rückfragen | Mit steigendem Volumen: bessere Self-Service-Dokumentation, FAQ-gestützter Bot, aber realistisch nie 0 FTE |
| Rechtliche Fragen (Mietrecht-Spezialfälle) | Nein | Erfordert Fachwissen, das bei atypischen Fällen (Härtefälle, Sonderkündigungen) nicht automatisierbar ist | Kooperationsvertrag mit einer Anwaltskanzlei/Treuhänder für Eskalationsfälle statt eigenem Justiziariat |
| Inserate/Portalintegration | Ja, **wenn** API-Zugang besteht | Ohne offizielle API-Partnerschaft mit Homegate/ImmoScout24 wäre man auf Screen-Scraping angewiesen — instabil und rechtlich riskant | **Technischer Engpass Nr. 1:** Portalpartnerschaften müssen früh verhandelt werden, nicht nachträglich |
| Bewerberkommunikation | Ja | Text-/E-Mail-Kommunikation ist reif für Vollautomatisierung | — |
| Abschluss (Vertrag/Unterschrift) | Ja (mit E-Signatur-Lösung wie Skribble, das auch Flatfox/VERIT nutzen) | Etablierte Schweizer Lösung existiert bereits | Direkt integrieren, nicht neu bauen |

**Fazit (korrigiert):** Mit der bewussten Scope-Entscheidung, Besichtigung und Übergabe dauerhaft bei der Eigentümer:in zu belassen, ist der Grossteil der ursprünglich vermuteten physischen Skalierungsgrenze **kein Thema mehr für Mietpilot selbst** — die Firma bleibt vollständig digital/remote, ohne eigenes Feldpersonal, unabhängig vom Fallvolumen. Das Restwachstum von Personal in Phase 8 (1 auf 40–55 FTE bei 50'000 Fällen) kommt fast ausschliesslich aus **Support/QS, Eskalationen und Betrugsprüfung bei Verdachtsfällen** — nicht aus physischer Präsenz. Das ist eine echte Software-Skalierung, näher am Ausgangswunsch (1'000× mehr Fälle ohne 1'000× mehr Personal) als ursprünglich dargestellt. **Was bleibt:** Der/die Eigentümer:in selbst muss weiterhin persönlich Zeit für Besichtigungstermine aufwenden — das ist kein Mietpilot-Engpass, sondern eine bewusste Grenze des Leistungsversprechens (s. korrigiertes Kernversprechen: "Sie treffen nur noch Ihre künftigen Mieter:innen" statt "Sie müssen nichts tun"). Modell 4/G (B2B2C-Engine) bleibt trotzdem attraktiv — jetzt primär wegen CAC und properti's Marktstärke (Phase 8/3), nicht mehr wegen eines Skalierungs-Engpasses bei Besichtigungen.

---

## Phase 10 — Rechtliche und Risikoanalyse Schweiz

| Thema | Status | Kernaussage |
|---|---|---|
| Mietrecht (Anfangsmietzins, Formvorschriften) | FAKT | Bestehende Standardprozesse (Formularpflicht bei Mietzinserhöhung/Erstvermietung je nach Kanton) müssen im Vertragsmodul abgebildet werden — lösbar, aber nicht trivial |
| **Maklerbewilligung** | **FAKT — grösstenteils entschärft (Korrektur)** | In einer früheren Fassung dieser Analyse stand hier fälschlich "kritisch, ZU VALIDIEREN" — gestützt nur auf eine KI-Suchzusammenfassung, nicht auf eine Primärquelle. Tatsächlich: **Kanton Zürich hat die Bewilligungspflicht für die gewerbsmässige Vermietungsvermittlung (Vermittlung von Wohn- und Geschäftsräumen) per 1. Januar 2012 aufgehoben** (Mitteilung Kanton Zürich, zh.ch — Gesetz vom 30.11.1980 entsprechend geändert). Für den grössten und naheliegendsten Zielmarkt ist das damit **kein Thema mehr**. Genf (Loi sur la pratique des professions immobilières, LPI) und Tessin kennen weiterhin eigene, aber **allgemeine** Maklerregulierungen (nicht mietspezifisch), die nur greifen, wenn dort physisch/geschäftlich niedergelassen wird. **Verbleibend ZU VALIDIEREN, aber nur noch als Nebenpunkt:** kantonale Detailprüfung nötig, falls Genf/Tessin explizit als Zielmarkt geplant sind — für einen Start in Zürich (oder den meisten anderen Kantonen) nicht blockierend. |
| Datenschutz — automatisierte Einzelentscheidungen (Art. 21 nDSG) | FAKT | Gilt bei Entscheidungen, die ausschliesslich automatisiert erfolgen und Rechtsfolgen haben — **Ausnahme, wenn die betroffene Person ausdrücklich in die automatisierte Entscheidung eingewilligt hat, oder wenn die automatisierte Entscheidung dem Antrag stattgibt** (Zusage statt Absage). Praktikable Lösung: (a) Einwilligung der Bewerber:innen zu automatisiertem Pre-Screening als Teil des Bewerbungsformulars einholen, (b) Ablehnungen formal von der Eigentümer:in bestätigen lassen, nicht rein automatisch versenden |
| Betreibungsauszug — Beschaffung | FAKT | Dritte (Vermieter, Vermittler) dürfen einen Auszug über eine Person nur **mit deren Zustimmung** einholen. **Lösung bereits produktkonform:** Standardpraxis in der Schweiz ist ohnehin, dass Bewerber:innen ihren Auszug **selbst bestellen und einreichen** — das entspricht exakt dem im Prototyp angenommenen Ablauf, ist also kein neues Risiko |
| Diskriminierungsrecht | FAKT | Herkunft, Geschlecht, Religion, soziale Stellung sind **keine zulässigen Ablehnungsgründe** (Art. 8 BV, Persönlichkeitsschutz OR). Finanzielle/bonitätsbezogene Kriterien sind zulässig. **Design-Konsequenz:** Scoring-Algorithmus darf ausschliesslich auf finanziellen/referenzbezogenen Merkmalen basieren, keine Namens-, Herkunfts- oder sonstigen Proxy-Variablen verwenden — inklusive eines regelmässigen Bias-Audits, sobald reale Daten vorliegen |
| Datenspeicherung sensibler Bewerberdaten | ZU VALIDIEREN | Aufbewahrungsfristen, Löschkonzept für abgelehnte Bewerbungen, Auftragsverarbeitungsvertrag mit allen eingesetzten KI-/Cloud-Diensten — Standard-nDSG-Compliance-Arbeit, aber vor Launch nötig |
| Vertragsabschluss/E-Signatur | FAKT | Etablierte Schweizer Lösungen (z. B. Skribble) existieren und werden bereits von Flatfox/VERIT genutzt — kein Neuland |
| Identitätsprüfung | ZU VALIDIEREN | Wie wird sichergestellt, dass die Person, die sich bewirbt, tatsächlich die Person im Lohnausweis/Betreibungsauszug ist? Betrugsrisiko real, Lösung (z. B. Video-Ident) muss noch definiert werden |

**Wichtigste Konsequenz:** Die Maklerbewilligungsfrage blockiert einen Start in Zürich (und den meisten Kantonen) **nicht mehr** — das war ein Fehler in der ersten Fassung dieser Analyse. Die eigentlich entscheidenden offenen Punkte in dieser Tabelle sind jetzt **Art. 21 nDSG (Design-Anforderung, keine Blockade) und die Identitätsprüfung** — beide lösbar, keiner davon verlangt eine Klärung *vor* den ersten Kundengesprächen.

---

## Phase 11 — MVP

**Eigentümer-Seite:** Formular (Adresse, Zimmer, Mietzins-Wunsch, Fotos), Status-Ansicht (wie im gebauten Klickdummy), Freigabe-Klicks an genau zwei Stellen: Mietzins-Vorschlag bestätigen, finale:n Mieter:in wählen.

**KI-Agent (Hintergrund):** Exposé-Text-Generierung, Portal-Publikation (zunächst manuell/CSV-Export, falls keine API-Partnerschaft steht — s. Phase 9), Bewerbungs-Dokumenten-Parsing, Scoring nach festem, diskriminierungsfrei geprüftem Kriterienset, Terminvorschläge per E-Mail.

**Bewerber-Seite:** Einfaches Formular mit Upload (ID, Betreibungsauszug, Lohnausweis, ggf. Referenzschreiben), Einwilligung zu automatisiertem Pre-Screening (Art. 21 nDSG-konform), Terminbuchung per Kalender-Link.

**Admin-System (intern, für den/die Gründer:in als menschliche Kontrollinstanz):** Übersicht aller laufenden Fälle, Flag-System für Verdachtsfälle (Dokumente, Betrugsindikatoren), manuelle Freigabe vor Versand der Top-3-Empfehlung an die Eigentümer:in (**am Anfang bewusst als Kontrollpunkt, bis genug Vertrauen in die Automatisierung besteht**).

**Nicht im MVP:** Mietzins-Verhandlungslogik, Self-Service-Besichtigung, Mieter-Garantie-Produkt, mehrsprachige Version, White-Label-Fähigkeit (kommt erst mit Modell G).

**Datenmodell (Kern):** `Fall` (Objekt, Status, Autonomiegrad) → `Bewerbung` (Person, Dokumente, Score, Begründung, Status) → `Termin` → `Entscheidung` → `Vertrag`.

---

## Phase 12 — UX-Flow (Eigentümer-Seite, radikal reduziert)

Wohnung wird frei → Link öffnen → Adresse + 3 Fotos hochladen (< 3 Min.) → Mietpilot schlägt Mietzins vor → **ein Klick: bestätigen** → Mietpilot übernimmt vollständig, Eigentümer:in erhält max. 2–3 kurze Status-Updates (nicht täglich, das nervt) → nach Abschluss des Screenings: 3 Empfehlungen mit Begründung → **ein Klick: auswählen** → Vertrag wird vorbereitet, Eigentümer:in unterschreibt digital → fertig.

**Zwei Klicks insgesamt** (Mietzins bestätigen, Mieter:in wählen) — alles andere ist entweder vollautomatisch oder eskaliert nur im Ausnahmefall.

---

## Phase 13 — Go-to-Market mit Kostenlogik

| Kundenzahl | Primärer Kanal | Logik (Kunde gewinnen → Kosten → Umsatz → Deckungsbeitrag) |
|---|---|---|
| 10 | Direktansprache + eigenes Netzwerk, HEV-Kontakte, private Inserate auf Homegate/ImmoScout24 direkt anschreiben | Praktisch CHF 0 Marketingkosten, aber hoher Zeitaufwand pro Kontakt → CHF 890 Umsatz, ≈ CHF 713 DB pro Fall |
| 50 | Wie oben + gezielte Facebook-/Google-Ads-Tests (kleines Budget, z. B. CHF 3'000 Testbudget über 50 Leads) | CHF 3'000 ÷ realistisch 10–15 Conversions aus 50 Leads ≈ CHF 200–300 CAC → CHF 890 − 177 − 250 ≈ **CHF 463 DB/Fall** |
| 100 | + SEO-Content ("Wohnung vermieten Checkliste Schweiz", "Was kostet ein Vermietungsservice") beginnt zu greifen, erste Referrals | CAC sinkt Richtung CHF 220–280 durch organischen Anteil |
| 500 | **B2B2C-Partnerschaften** (Treuhänder, kleine Verwaltungen, HEV-Sektionen als Vermittler gegen Provision) werden zum Haupttreiber, nicht mehr bezahlte Ads allein | Ein Partner-Gespräch kostet Vertriebszeit, kein Ad-Budget → CAC-Mix sinkt strukturell |
| 1'000 | Etablierte Marke, SEO-Dominanz für "Wohnung vermieten [Stadt]"-Suchen, Empfehlungsprogramm (Bonus für Weiterempfehlung) aktiv | CAC Richtung CHF 150–180 (s. Phase-8-Tabelle) |

**Kritische Einordnung:** Kanäle wie "Banken, Versicherungen" (aus der Vorgabe) sind **nicht kurzfristig realistisch** — das sind grosse, langsame B2B2B2C-Vertriebszyklen (6–18 Monate pro Partnerschaft), die für ein junges Produkt ohne Referenzen kaum zu gewinnen sind. Treuhänder und kleine Verwaltungen sind der realistischere erste B2B2C-Schritt, weil der Vertriebszyklus kürzer und der Vertrauensaufbau persönlicher ist.

---

## Phase 14 — Fünf Validierungsexperimente

| # | Hypothese | Test | Zielgruppe | Anzahl | Erfolgskriterium | Kill Criterion | Nächste Entscheidung |
|---|---|---|---|---|---|---|---|
| 1 | Problem ist real und schmerzhaft genug | Behavioral Interviews (Phase 15) | 20 private Eigentümer:innen | 20 | ≥ 50 % berichten unaufgefordert von Aufwand/Sorge bei der letzten Vermietung | < 30 % | Bei Erfolg → Experiment 2 |
| 2 | Zahlungsbereitschaft für CHF 890 (oder Alternativmodell) existiert | Preis erst nach offener Erwartungsfrage nennen (s. bestehender Leitfaden), plus Landingpage mit echtem "Jetzt anmelden"-Button (kein Fake-Door ohne Ankündigung — Hinweis "in Aufbau" einblenden) | Besucher:innen der bestehenden Landingpage + Interviewpartner:innen | 20 Interviews + min. 200 Landingpage-Besuche via kleinem Ads-Test | ≥ 5 % Klickrate auf "Anmelden", ≥ 50 % der Interviewten finden CHF 890 fair oder günstig | < 2 % Klickrate, > 50 % empfinden Preis als unseriös | Bei Erfolg → Experiment 3, sonst Preismodell aus Phase 7 wechseln |
| 3 | Vertrauen in KI-Vorauswahl ist ausreichend hoch | Kernfrage aus bestehendem Leitfaden (`docs/validierung-mietpilot.md`) | dieselben 20 Interviews | 20 | ≥ 50 % offen oder bedingt-offen | Mehrheit lehnt kategorisch ab | Bei Ablehnung → Modell 2 (nur Screening-Tool) statt Vollservice prüfen |
| 4 | MVP lässt sich in der geplanten Form technisch und operativ betreiben | Manuell-simulierter Testlauf ("Wizard of Oz": echte Anfrage, Prozess läuft real, aber mit manueller statt vollautomatischer KI im Hintergrund) mit 3 echten Fällen | 3 bereite Eigentümer:innen aus den Interviews | 3 | Alle 3 Fälle kommen zu einer echten Vermietung, Eigentümer:in würde weiterempfehlen | Ein Fall scheitert an Vertrauen/Prozess | Bei Erfolg → echten MVP bauen |
| 5 | Erste echte, bezahlte Vermietung funktioniert wirtschaftlich | Realer Fall mit echter Zahlung (auch wenn Prozess noch teilmanuell) | 1 zahlende:r Kund:in | 1 | Positiver Deckungsbeitrag trotz manuellem Mehraufwand, Kund:in zahlt CHF 890 freiwillig | Kund:in verweigert Zahlung oder verhandelt massiv runter | Bei Erfolg → Skalierung planen; parallel B2B2C-Gespräche (Modell G) mit 3–5 Playern führen |

---

## Phase 15 — Interviewleitfaden (verhaltensbasiert, nicht suggestiv)

**Grundregel:** Keine Frage, die "Mietpilot" oder "KI" vor der Hälfte des Gesprächs erwähnt. Erst Verhalten verstehen, dann — separat — die Reaktion auf das Konzept testen (s. bereits vorhandener Leitfaden `docs/validierung-mietpilot.md`, dieser hier ergänzt ihn um die strikt verhaltensbasierte erste Hälfte).

### Teil 1 — Reines Verhalten (10 Min., KEIN Konzept erwähnen)
1. "Wann hatten Sie zuletzt eine Wohnung neu zu vermieten?"
2. "Wie sind Sie dabei genau vorgegangen — Schritt für Schritt?"
3. "Wie viele Bewerbungen haben Sie ungefähr erhalten?"
4. "Wie haben Sie diese geprüft? Woran haben Sie sich orientiert?"
5. "Wie lange hat der gesamte Prozess gedauert, vom ersten Inserat bis zur Unterschrift?"
6. "Was war daran am aufwendigsten oder am meisten Nerven kostend?"
7. "Haben Sie dafür jemanden bezahlt — einen Makler, eine Verwaltung? Was hat das gekostet?"
8. "Was würden Sie beim nächsten Mal anders machen?"
9. "Gibt es einen Teil davon, den Sie **niemals** aus der Hand geben würden, egal wie gut das Angebot ist?" *(zentrale Frage — zeigt die reale Vertrauensgrenze, ohne "KI" auch nur zu erwähnen)*

### Teil 2 — Konzept-Reaktion (erst jetzt, 8 Min.)
Nutzt den bereits bestehenden Leitfaden (`docs/validierung-mietpilot.md`, Fragen 5–9) unverändert — der ist bereits sauber non-suggestiv formuliert ("Stellen Sie sich vor..." statt "Würden Sie eine KI nutzen, die...").

**Neu ergänzt, nach der Preisfrage:**
10. "Was müsste ein Anbieter tun, damit Sie ihm mehr vertrauen als einer klassischen Verwaltung?"
11. "Was wäre für Sie der Punkt, an dem Sie sagen: 'Das probiere ich beim nächsten Mal aus'?"

---

## Phase 16 — Verbesserte Kill Criteria mit Schwellenwerten

| Dimension | Alter Kill-Criterion | Verbesserter, quantifizierter Schwellenwert |
|---|---|---|
| Problemintensität | (fehlte) | < 30 % berichten unaufgefordert von echtem Aufwand/Sorge bei der letzten Vermietung (Teil 1, Frage 6) |
| Zahlungsbereitschaft | "CHF 890 wirkt unseriös/zu teuer" | < 50 % empfinden CHF 890 als fair/günstig **UND** < 5 % Klickrate auf echtem Landingpage-CTA (Experiment 2) |
| Vertrauen | "Mehrheit will jede Bewerbung selbst prüfen" | > 50 % lehnen jede Form automatisierter Vorauswahl kategorisch ab (nicht: würden gerne mitreden — das ist normal und lösbar, s. Phase 6) |
| Conversion | "< 20 % würden testen" | < 20 % sagen bei Frage 11 (Teil 2) einen konkreten künftigen Anlass, es auszuprobieren |
| Tatsächliche Nutzung | (fehlte) | Von 3 "Wizard of Oz"-Testfällen (Experiment 4) scheitert mehr als 1 an Vertrauen/Prozess statt an Zufall |
| Weiterempfehlung | (fehlte) | Der/die zahlende Testkund:in (Experiment 5) würde bei direkter Nachfrage **nicht** aktiv weiterempfehlen |
| Zeitersparnis | (fehlte) | Der reale Vermietungsprozess dauert im Testfall nicht spürbar kürzer als beim Eigentümer-Vergleichswert aus Teil 1, Frage 5 |
| Rechtlich | "Haftungsbedenken" | Genf/Tessin sollen als Zielmarkt dienen **und** die dortige kantonale Maklerregulierung erweist sich als praktisch nicht erfüllbar, **oder** in Interviews/Praxis zeigt sich ein bisher nicht erkanntes rechtliches Hindernis (z. B. bei Art. 21 nDSG-Umsetzung oder Identitätsprüfung) |

---

## Phase 17 — Fünf alternative Geschäftsmodelle

| # | Modell | Kurzbeschreibung | Warum ernsthaft prüfen |
|---|---|---|---|
| 1 | **B2B2C White-Label-Engine** (bereits als Modell 4/G identifiziert) | Screening/Ranking/Kommunikation als Technologie-Backend an properti-Konkurrenten, Regionalmakler, Treuhänder, HEV verkaufen | Löst CAC-Problem, Skalierbarkeits-Engpass und Bewilligungsfrage gleichzeitig — **stärkster Kandidat** |
| 2 | **Reines SaaS-Tool "KI-Bewerberfilter"** (Modell 2 aus Phase 4) | Eigentümer:in inseriert weiter selbst, Mietpilot übernimmt nur die Bewerbungsprüfung gegen eine kleine Pauschale (z. B. CHF 149) | Kleinerer Vertrauensschritt, schneller zu validieren, guter Einstieg vor Vollservice |
| 3 | **API-Produkt für Portale selbst** (Homegate/ImmoScout24 als Kunde, nicht als Konkurrent gedacht) | Die Portale haben das grösste Interesse an besserem Bewerbermanagement für ihre Nutzer:innen — Mietpilot-Engine als deren Zusatzfunktion | Ein einziger Partnerschaftsvertrag ersetzt tausende Einzelkund:innen-Akquisen; Portale haben bereits Reichweite und Vertrauen |
| 4 | **Success-Fee-Plattform mit mehreren "Erfüllungsgehilfen"** (Marktplatz-Modell) | Mietpilot bleibt Marke/Technologie, lokale Partner (Treuhänder u. a.) übernehmen Eskalations-/Sonderfälle gegen Teilprovision | Nur noch relevant für Eskalationsfälle, nicht mehr für Besichtigung/Übergabe (s. korrigierte Phase 9) — geringerer Nutzen als ursprünglich angenommen, höhere Koordinationskomplexität bleibt |
| 5 | **Reines Datenprodukt/Marktbericht** (radikal anderes Modell) | Aus den bei der Vermietungsprüfung gesammelten (anonymisierten) Marktdaten (Mietzins-Realisierung, Nachfrage pro Lage) ein bezahltes Marktreport-Produkt für Investor:innen/Banken entwickeln | Nur relevant, **nachdem** genug Fallvolumen existiert — kein Startpunkt, aber ein späterer Zusatzumsatz-Hebel |

**Explizit ausgesprochen, wie in der Aufgabenstellung verlangt:** Ja — **Mietpilot sollte nicht primär als Endkundenmarke gegen properti aufgebaut werden.** Die vorliegende Analyse (properti's Kapitalstärke und Garantie-Produkt, der strukturell hohe CAC bei seltenem Einzelbedarf, der Skalierbarkeits-Engpass durch physische Prozessschritte) zeigt in der Summe, dass **Modell 1 (B2B2C-Engine)** ökonomisch überlegen ist — die anfangs vermutete Maklerbewilligungsfrage trägt diese Schlussfolgerung **nicht mehr** (s. Korrektur Phase 10), die übrigen drei Gründe tragen sie weiterhin eigenständig. Das bedeutet nicht, das B2C-Konzept zu verwerfen — es bedeutet, es als **Nachweis-/Referenz-Vehikel** zu behandeln (kleine Fallzahl, um die Technologie zu beweisen), nicht als das grosse, skalierende Endprodukt.

---

## Phase 18 — Die eigentliche Frage: Unter welchen Bedingungen wird das ein grosses, profitables, automatisierbares Unternehmen?

| # | Antwort |
|---|---|
| 1. Wichtigste Zielgruppe | Nicht Segment A (1 Wohnung) — zu teuer in der Akquise, zu selten. **Zielgruppe C/F (5–20 Wohnungen bzw. ortsferne Eigentümer:innen) als Referenz-Endkund:innen, B2B2C-Partner als eigentlicher Hauptkunde** |
| 2. Wichtigstes Problem | Nicht "Inserieren ist mühsam" (das lösen Portale schon gut), sondern "Ich traue meiner eigenen Bewerberauswahl nicht, weiss aber nicht, wem ich stattdessen vertrauen soll, ohne 1.5 Monatsmieten zu zahlen" |
| 3. Wichtigstes Produkt | Die Screening-/Ranking-/Kommunikations-Engine — nicht die Endkundenmarke |
| 4. Bestes Geschäftsmodell | B2B2C-Lizenz-/API-Modell (Phase 7, Modell G), mit einer kleinen, kontrollierten B2C-Linie als Referenz |
| 5. Wichtigste Differenzierung | Nicht "billiger als properti", sondern "Effizienz-Backend, das ein bestehender, vertrauenswürdiger Anbieter nutzen kann, um seine eigene Marge zu verbessern oder seinen Preis zu senken" |
| 6. Grösster Risikofaktor | **Nicht** die KI-Technologie, **nicht** die Maklerbewilligung (weitgehend entschärft, s. Phase 10) — sondern **Vertrauen in die automatisierte Vorauswahl und der CAC bei seltenem Einzelbedarf im B2C-Modell** |
| 7. Grösster technischer Engpass | Fehlende API-Partnerschaften mit Homegate/ImmoScout24/Flatfox für automatisierte Inserate-Publikation |
| 8. Grösster rechtlicher Engpass | Keiner, der einen Start blockiert — Art. 21 nDSG und Identitätsprüfung sind Design-Anforderungen, keine Hürden (Mietmakler-Bewilligung in ZH seit 2012 aufgehoben, s. Korrektur Phase 10) |
| 9. Wichtigste Validierung | Experiment 3 (Vertrauen) und Experiment 2 (CAC/Preis) — beide **vor** nennenswerter weiterer Entwicklung |
| 10. Sinnvollster nächster Schritt | Siehe unten — ein einziger, konkreter Schritt |

---

## Phase 19 — Radikale Neubewertung

**Frage:** Würdest du mit CHF 0, ohne bestehende Technologie, genau Mietpilot bauen?

**Antwort: Nein, nicht in der aktuellen B2C-Form.** Die Kombination aus (a) einem kapitalstarken, bereits vertrauenswürdigen Incumbent mit Garantie-Produkt, (b) einer ungeklärten, potenziell geschäftsmodell-verändernden Bewilligungsfrage, und (c) einem strukturell CAC-intensiven Einzelbedarf ohne Wiederkauf ist eine schwierige Ausgangslage für einen Solo-Start mit wenig Kapital.

**Was ich stattdessen bauen würde:** Dieselbe KI-Engine (Bewerbungs-Screening, Ranking mit Begründung, automatisierte Kommunikation) — aber von Anfang an als **B2B2C-Werkzeug, das ich zuerst 2–3 kleinen Regionalmaklern oder Verwaltungen als kostenlosen Pilotpartner anbiete**, um echte Fälle, echte Referenzen und echte Zahlen zu bekommen, bevor überhaupt eine Endkundenmarke oder eine Preisdiskussion mit privaten Eigentümer:innen zum Thema wird. Das ist **kapitalärmer und CAC-frei** (der Partner bringt die Fälle mit, nicht bezahlte Werbung) — nicht, weil eine Maklerbewilligung im Weg stünde (die ist für den relevanten Markt kein Thema mehr), sondern weil properti's Kapitalstärke und die CAC-Ökonomie eines seltenen Einzelbedarfsprodukts für sich allein schon genug Gegenwind sind.

Das ist innerhalb desselben Themenfelds (Immobilien, KI, Schweizer Markt) abgeleitet — keine komplett fachfremde Idee, sondern eine **Umkehrung der Vertriebsrichtung** desselben Produkts.

---

## Phase 20 — Endresultat

**A. Ausgangsidee:** KI-Agent, der für private Eigentümer:innen die komplette Wiedervermietung übernimmt, CHF 890 Erfolgshonorar, als eigene Endkundenmarke positioniert.

**B. Tatsächliches Problem:** Fehlendes Vertrauen in die eigene Bewerberauswahl bei einer seltenen, folgenreichen Entscheidung — nicht in erster Linie der administrative Aufwand des Inserierens.

**C. Zielkunde:** Primär B2B2C-Partner (Regionalmakler, Treuhänder, kleine Verwaltungen); sekundär Eigentümer:innen mit 5–20 Wohnungen oder ortsferne Eigentümer:innen als Referenzfälle.

**D. Produkt:** Die Screening-/Ranking-/Kommunikations-Engine mit "3 statt 30"-Empfehlungslogik — technologie- statt markenzentriert.

**E. Geschäftsmodell:** B2B2C-Lizenz-/Fallgebühr an Partner, die selbst schon Kundenvertrauen und ggf. die nötige Bewilligung haben; CHF-890-B2C-Modell als kleine, kontrollierte Parallelspur zur Referenzgewinnung.

**F. Automatisierungsgrad:** Vollständig automatisierbar: Exposé, Inserat, Kommunikation, Dokumentenstrukturierung, Scoring, Terminvorschläge. Nicht automatisierbar: Besichtigung/Übergabe (physisch), finale Entscheidung (rechtlich/psychologisch beim Menschen), Eskalationen bei Verdachtsfällen.

**G. Menschliche Rolle:** Qualitätssicherung vor Versand der Empfehlung (am Anfang), Eskalationsinstanz, finale Entscheidung liegt strukturell immer bei der Eigentümer:in bzw. beim Partner.

**H. Wettbewerb:** properti ist der relevante Massstab, kein weisser Fleck. Differenzierung liegt nicht in "billiger", sondern darin, bestehenden Anbietern eine Effizienzsteigerung zu verkaufen, die sie selbst nicht so schnell bauen (Fokus, nicht mangelnde Fähigkeit — properti könnte das mit 195 Mitarbeitenden technisch auch bauen, tut es aber aktuell nicht).

**I. Risiken:** CAC im B2C-Modell potenziell modellsprengend · properti-Reaktion bei sichtbarem Erfolg · Diskriminierungs-/Datenschutzrisiko bei fehlerhaftem Scoring-Design · kantonale Maklerregulierung nur relevant, falls Genf/Tessin als Zielmarkt geplant sind.

**J. Validierung:** 20 verhaltensbasierte Interviews (Phase 15) + Preistest mit echtem CTA (Experiment 2) + Vertrauenstest (Experiment 3) — keine rechtliche Klärung mehr als Vorbedingung nötig.

**K. MVP:** Wie in Phase 11 beschrieben — schlankes Eigentümer-Formular, KI-Engine im Hintergrund, Bewerber-Formular, internes Admin-Kontrollsystem mit manueller Freigabe vor jeder Top-3-Versendung.

**L. 90-Tage-Plan:**

| Zeitraum | Fokus |
|---|---|
| Woche 1–2 | Start der 20 verhaltensbasierten Interviews (Phase 15); parallel ersten kleinen Google/Meta-Ads-Test für Experiment 2 (echter CAC-Datenpunkt) aufsetzen |
| Woche 3–4 | Interviews abschliessen, auswerten; parallel 2–3 Erstgespräche mit potenziellen B2B2C-Partnern (kleine Regionalmakler/Treuhänder) führen, um Modell G realistisch einzuschätzen |
| Monat 2 | Go/No-Go anhand Phase-16-Kriterien; bei Go: "Wizard of Oz"-Test mit 3 echten Fällen (Experiment 4), parallel ersten Piloten mit einem B2B2C-Partner vereinbaren |
| Monat 3 | Erste echte, bezahlte Vermietung (Experiment 5) abschliessen; Entscheidung über Schwerpunkt B2C vs. B2B2C anhand der bis dahin gesammelten echten Zahlen treffen |

**M. Entscheidungsmatrix:**

| Wenn... | ...dann |
|---|---|
| Genf/Tessin werden als Zielmarkt geplant und die dortige Maklerregulierung erweist sich als praktisch nicht erfüllbar | → Diese Kantone vorerst auslassen, mit Zürich/anderen Kantonen starten (dort kein Thema) |
| Start erfolgt in Zürich oder einem anderen Kanton ohne Mietmakler-Bewilligungspflicht (Regelfall) | → Beide Spuren (B2C-Referenz + B2B2C-Gespräche) direkt parallel weiterverfolgen, keine rechtliche Vorprüfung nötig |
| < 30 % berichten von echtem Problem (Phase 16) | → Ganzes Konzept zurückstellen, Alternativkandidaten aus der ursprünglichen Analyse (Fristenwächter) neu prüfen |
| ≥ 50 % Vertrauen, aber < 50 % finden CHF 890 fair | → Preismodell E (Grundgebühr + reduziertes Erfolgshonorar) testen statt Modell A |
| > 50 % lehnen jede automatisierte Vorauswahl kategorisch ab | → Umbau zu Modell 2 (reines Screening-Tool ohne Autonomie-Versprechen) |
| B2B2C-Erstgespräche zeigen echtes Interesse (≥ 2 von 3 angesprochenen Partnern wollen pilotieren) | → Ressourcen auf B2B2C verschieben, B2C nur als Nachweis-Vehikel weiterführen |
| Alle Kriterien positiv | → MVP bauen, ersten Piloten (B2B2C) UND ersten echten B2C-Fall parallel starten |

---

## Die 10 wichtigsten Erkenntnisse

1. **properti ist kein Startup-Wettbewerber, sondern ein skalierter Incumbent** mit Garantie-Produkt (195 MA, 12 Standorte) — "billiger als properti" allein ist keine stabile Positionierung.
2. **Korrektur in dieser Analyse selbst:** Die zunächst behauptete Mietmakler-Bewilligungspflicht beruhte auf einer ungeprüften KI-Suchzusammenfassung. Recherche der Primärquelle zeigt: **Kanton Zürich hat sie 2012 aufgehoben**, sie blockiert einen Start dort nicht. Nur Genf/Tessin haben noch allgemeine (nicht mietspezifische) Maklerregulierung — relevant nur bei dortiger Niederlassung.
3. **Das Hauptrisiko ist tatsächlich Vertrauen — aber nicht das einzige.** CAC bei seltenem Einzelbedarf ist mindestens ebenso kritisch für die Wirtschaftlichkeit.
4. **CHF 890 ist wirtschaftlich plausibel, aber ungetestet** — die Unit Economics stehen und fallen mit dem tatsächlichen CAC, nicht mit den KI-Kosten (die sind klein).
5. **Korrigiert nach Rückmeldung:** Besichtigung und Übergabe sind **kein** Mietpilot-Skalierungsengpass — das waren nie Aufgaben, die Mietpilot selbst bestaffen müsste, sondern schon immer Sache der Eigentümer:in. Mit dieser Klarstellung als bewusster, dauerhafter Scope-Entscheidung bleibt Mietpilot vollständig digital/remote skalierbar; das verbleibende Personalwachstum (Phase 8) kommt aus Support/Eskalation/Betrugsprüfung, nicht aus physischer Präsenz.
6. **Der frühere Wettbewerbs-Hinweis auf propertyowner.ch war zu unscharf** — die Recherche zeigt es primär als Verkaufs-, nicht Vermietungsdienstleister; muss vor jeder Aussage direkt verifiziert werden.
7. **Der Bewerbungsdossier-Standard in der Schweiz (Betreibungsauszug, Lohnausweis, Referenzen) deckt sich bereits mit dem Produktkonzept** — hier wird kein neues Verhalten verlangt, nur automatisiert.
8. **Art. 21 nDSG ist lösbar, aber muss ins Produktdesign von Anfang an eingebaut werden** (Einwilligung zu automatisiertem Screening, keine automatische Absage ohne Bestätigung).
9. **Das ökonomisch überlegene Modell ist B2B2C (Engine an bestehende Anbieter verkaufen), nicht die Endkundenmarke** — das ist die zentrale, konkrete Antwort auf die Ausgangsfrage.
10. **Die bereits gebauten Klickdummy- und Validierungs-Artefakte sind nicht verloren** — sie werden zum Referenz-/Demo-Material für genau die B2B2C-Gespräche, die jetzt Priorität haben.

---

## Der nächste konkrete Schritt

**Die ersten 5 der 20 verhaltensbasierten Interviews (Phase 15, Teil 1) diese Woche führen — beginnend mit Personen, die über private Inserate auf Homegate/ImmoScout24 identifiziert werden, weil die gerade aktiv im Prozess stecken.**

Der ursprünglich hier vorgeschlagene Schritt (rechtliche Klärung der Maklerbewilligung) ist nach der Korrektur in Phase 10 kein Blocker mehr. Die tatsächlich einzigen beiden offenen Fragen, die über das Geschäftsmodell entscheiden — echtes Vertrauen in automatisierte Vorauswahl (Experiment 3) und ob der Leidensdruck stark genug ist, um überhaupt zu wechseln (Experiment 1) — lassen sich nur mit echten Gesprächen beantworten, nicht mit weiterer Schreibtischarbeit. Genau die liegen bereits vorbereitet vor (`docs/validierung-mietpilot.md`, ergänzt um Phase 15 in diesem Dokument).

---

*Zugehörige Dokumente: `docs/geschaeftsmodell-analyse-chf20k.md`, `docs/zusammenfassung-mietpilot.md`, `docs/validierung-mietpilot.md`, `prototyp/mietpilot.html`.*
