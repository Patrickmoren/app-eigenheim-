# B2B-Outreach — Verwaltungen, Regionalmakler, Treuhänder

> Grundsatz (Master-Prompt Abschnitt 18): kurz, seriös, kein Hype. Nicht "Revolutionieren Sie
> die Immobilienbranche", sondern die konkrete, ehrliche Frage.

## E-Mail (Erstkontakt)

> Betreff: Kurze Frage zu Ihrem Wiedervermietungsprozess
>
> Guten Tag [Name]
>
> Wir untersuchen aktuell, wie viel manueller Aufwand bei der Wiedervermietung von
> Mietobjekten tatsächlich entsteht — von der Bewerbungsprüfung bis zur Terminkoordination.
>
> Da Sie [X Objekte / Mandate] betreuen, würde uns Ihre Einschätzung sehr interessieren.
> Hätten Sie 20 Minuten für ein kurzes, unverbindliches Gespräch? Es geht nicht um einen
> Verkauf, sondern um Ihre reale Erfahrung mit dem heutigen Prozess.
>
> Freundliche Grüsse

## LinkedIn-Nachricht

> Guten Tag [Name]
>
> Ich beschäftige mich gerade damit, wie viel Aufwand die Wiedervermietung von
> Mietobjekten bei kleineren Verwaltungen/Maklerbüros heute tatsächlich verursacht —
> Bewerbungsprüfung, Terminkoordination, Dokumentenabgleich.
>
> Hätten Sie 20 Minuten für ein kurzes Gespräch dazu? Kein Verkaufsgespräch, nur ehrliches
> Feedback zu einem Konzept, das wir gerade prüfen.

## Telefonleitfaden (Kaltanruf)

> "Guten Tag, mein Name ist [Name]. Ich rufe an, weil wir gerade untersuchen, wie viel
> manueller Aufwand bei der Wiedervermietung von Mietobjekten entsteht — bei Verwaltungen
> und Maklerbüros wie Ihrem. Ich verkaufe nichts, ich sammle Praxis-Einschätzungen. Hätten
> Sie jetzt kurz 2 Minuten, oder wäre ein 20-Minuten-Termin diese Woche besser?"

## Follow-up-Texte (nach automatischer Bestimmung der nächsten Aktion, s. Master-Prompt Abschnitt 15)

**Nach Interview ohne konkrete Zusage:**
> "Danke für das Gespräch von letzter Woche. Falls sich bei Ihnen in den nächsten Monaten
> eine Wiedervermietung ergibt, bei der Sie unverbindlich testen möchten, wie viel sich
> davon automatisieren lässt — melden Sie sich gerne, oder ich frage in [Zeitraum] nochmal
> nach."

**Nach Pilot-Interesse, aber noch kein konkreter Fall:**
> "Wie besprochen: Sobald bei Ihnen die nächste Wiedervermietung ansteht, würden wir das
> gerne gemeinsam als Testfall durchlaufen. Lassen Sie uns kurz Bescheid wissen, sobald es
> so weit ist — dann vereinbaren wir das technische Detailgespräch."

**Preisangebot senden:**
> "Wie besprochen hier die grobe Preisindikation: [Modell je nach Gespräch — pro Fall oder
> monatlich]. Passt das für einen ersten Testlauf, oder sehen Sie das anders?"

**Technisches Gespräch vereinbaren (Integrationsbedarf genannt):**
> "Sie hatten [System X] als zentrales Werkzeug erwähnt. Wir würden gerne in einem kurzen
> technischen Gespräch klären, was für eine Anbindung nötig wäre — hätten Sie dafür
> nächste Woche Zeit?"

## Automatische Follow-up-Zuordnung (Regel, nicht Einzelfall)

| Gesprächsausgang | Nächste Aktion | Frist |
|---|---|---|
| Konkreter Fall in Aussicht, kein Datum | "Nach realem Vermietungsfall fragen" (Follow-up-Text 2) | in 4–6 Wochen |
| Pilot mündlich zugesagt | Pilot-Datensatz anlegen (s. `mietpilot-crm.xlsx`, Sheet Piloten), Startgespräch vereinbaren | in 1 Woche |
| Preis genannt, keine Zusage | Preisangebot senden (Follow-up-Text 3) | in 1–2 Wochen |
| Integrationsbedarf genannt, technisch offen | Technisches Gespräch vereinbaren (Follow-up-Text 4) | in 1–2 Wochen |
| Nur allgemeines Interesse, keine Handlung | Follow-up-Text 1, danach in COLD einstufen falls keine Reaktion | in 6–8 Wochen |
| Kein Bedarf erkennbar | Kein Follow-up, Status INVALID | — |
