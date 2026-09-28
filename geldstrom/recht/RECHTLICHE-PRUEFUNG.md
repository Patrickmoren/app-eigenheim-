# Rechtliche Prüfung «Nebenkosten fixfertig»

Stand 28.09.2026, Nachtrag zum Bestellablauf unten · Schweizer Recht · geprüft: Geschäftsmodell, Website, Auftragsbedingungen,
Datenschutzerklärung, Impressum, Verkaufstexte, Rechenprogramm, Datenfluss.

> **Einordnung:** Diese Prüfung ist sorgfältig und nennt zu jedem Punkt die Rechtsgrundlage, sie ist
> aber **keine anwaltliche Beratung** und begründet kein Mandat. Für den 7-Tage-Test und die ersten
> Aufträge reicht sie nach meiner Einschätzung aus. Vor grösserem Volumen (ab etwa 20 Aufträgen)
> sollten die drei Punkte in Abschnitt 4 einmal von einer Anwältin oder vom Rechtsdienst des HEV
> gegengelesen werden (Aufwand ca. 1–2 Stunden, CHF 200–600).

## 1. Ergebnis auf einen Blick

| Bereich | Ergebnis | Status |
|---|---|---|
| Zulässigkeit der Tätigkeit | keine Bewilligung nötig in der Deutschschweiz; Tessin ausgenommen | ✅ umgesetzt (Angebot auf Deutschschweiz beschränkt) |
| Arbeitsrecht | kein Konkurrenzverbot (bestätigt); Treuepflicht beachten | ✅ Regeln unten |
| Vertragsrecht / AGB | neu als Werkvertrag, Vertragsschluss bei Freigabe, konsumentenfeste Klauseln | ✅ neu gefasst |
| Mietrechtliche Richtigkeit der Abrechnungen | zwei Fehler im Rechenprogramm gefunden und behoben | ✅ behoben, getestet |
| UWG: Impressum, E-Commerce, Preise | Pflichtangaben vollständig, Schritte des Vertragsschlusses erklärt | ✅ |
| UWG: E-Mail-Werbung, Telefon | Einzelversand mit Abmeldemöglichkeit; Sterneintrag prüfen | ✅ Texte angepasst |
| Provision an Treuhänder | Offenlegungspflicht der Treuhänder (Art. 400 OR) | ✅ Vereinbarung mit Wahlrecht |
| Datenschutz | Rollen, Information, Auftragsbearbeitung, Auslandbekanntgabe geregelt | ✅ neu gefasst |
| KI-Verarbeitung von Kundendaten | **nicht über privates claude.ai-Konto**, sondern API | ✅ Skript `extrahiere.py` |
| Cookies / Tracking | keine → kein Banner nötig | ✅ |
| Steuern, AHV, Handelsregister | MWST und HR unter CHF 100'000 nicht nötig; AHV-Anmeldung als Selbständiger | ⚠️ deine Aufgabe (Abschnitt 3.9) |
| Haftung | auf Auftragspreis begrenzt (leichte Fahrlässigkeit) | ✅; Versicherung optional |

## 2. Gefundene und behobene Fehler

| # | Wo | Fehler | Folge | Behebung |
|---|---|---|---|---|
| 1 | Rechenprogramm | Verwaltungsaufwand wurde auf **alle** Nebenkosten berechnet, auch wenn der Mietvertrag keine Verwaltungskosten vorsieht | Mieter hätte den Anteil auf den übrigen Nebenkosten zu Recht bestreiten können (Art. 257a Abs. 2 OR: nur besonders vereinbarte Nebenkosten) | Verwaltungsaufwand auf Heiz-/Warmwasserkosten immer (Art. 5 Abs. 2 lit. i VMWG), auf übrige Nebenkosten nur mit vertraglicher Grundlage; Hinweis im Prüfbericht; 2 Tests |
| 2 | Rechenprogramm | Mietverhältnisse mit **Nebenkostenpauschale** wären abgerechnet worden | Abgerechnet wird nur bei Akontozahlungen (Art. 4 Abs. 1 VMWG); bei einer Pauschale ist eine Nachforderung unzulässig | Feld `nebenkosten_art: pauschal` → keine Abrechnung, Anteil beim Vermieter; Test |
| 3 | Rechenprogramm | Warnliste traf auch «Wasser**zins**» (zulässige Gebühr) | falsche Warnung, Verwirrung | Wortanfang-Prüfung; «Hypothekarzins» wird weiter erkannt; 2 Tests |
| 4 | Rechenprogramm | Kontrollsumme mit gerundeten Werten → bei ≥ 12 Mietparteien falscher FEHLER | Lieferung blockiert | Kontrolle mit ungerundeten Werten, Toleranz 1 Rappen; Test mit 24 Mietverhältnissen |
| 5 | Rechenprogramm | Akonto-Empfehlung auch an Mieter, die am Periodenende ausziehen | irreführender Satz | nur bei laufenden Mietverhältnissen; Test |
| 6 | Rechenprogramm | Direktzuweisung an unbekannte Wohnung wurde nicht gemeldet | Betrag verschwindet still | FEHLER im Prüfbericht |
| 7 | Website | «Unverbindlich **bestellen**» vs. AGB «Mit dem Formular erteilen Sie den Auftrag» | widersprüchlich → Unklarheit geht zulasten des Verfassers (Unklarheitenregel) | Formular = unverbindliche Anfrage, Vertrag erst bei Freigabe; alle Texte vereinheitlicht |
| 8 | Website | Hinweis «Verwaltungsaufwand weiterbelasten» zu pauschal | potenziell irreführend (Art. 3 Abs. 1 lit. b UWG) | präzisiert nach Heizkosten / übrige Nebenkosten |
| 9 | Website | Gerichtsstand ohne Konsumentenvorbehalt | unwirksam gegenüber Konsumenten (Art. 32, 35 ZPO) | Konsumentengerichtsstand ausdrücklich vorbehalten |
| 10 | Website | Formular ohne JavaScript ohne Ziel | Anfrage ginge verloren | Formular-Ziel direkt Formspree bzw. E-Mail |
| 11 | Datenfluss | Kundenunterlagen wären über ein privates claude.ai-Konto gelaufen | keine Auftragsbearbeitungsvereinbarung mit dem Unterauftragsbearbeiter (Art. 9 Abs. 3 DSG) | API-Skript `extrahiere.py` (kommerzielle Bedingungen, kein Training) |
| 12 | Verkauf | Provision an Treuhänder ohne Hinweis auf deren Herausgabepflicht | Treuhänder in Konflikt mit Art. 400 OR, Reputationsrisiko | offene Provision oder Kundenrabatt nach Wahl; Vermittlungsvereinbarung |
| 13 | Verkauf | E-Mail ohne Abmeldemöglichkeit | bei Massenversand unlauter (Art. 3 Abs. 1 lit. o UWG) | Abmeldesatz, Einzelversand, Regeln im Kopf der Verkaufstexte |
| 14 | Verkauf | Google-Ads-Messung per Danke-Seite geplant | Conversion-Tag setzt Cookies → Einwilligung nötig | Messung ohne Tag, im Tracker |
| 15 | Beispiel-PDFs | fiktive Daten nicht als solche erkennbar | könnte für echt gehalten werden | Wasserzeichen «MUSTER – fiktive Daten» |

## 3. Prüfung im Einzelnen

### 3.1 Zulässigkeit der Tätigkeit
- Die Erstellung von Nebenkostenabrechnungen ist eine freie Dienstleistung. Ein Anwaltsmonopol besteht
  nur für die berufsmässige Vertretung vor Gerichten (BGFA und kantonale Anwaltsgesetze); die
  Abrechnung ist keine Rechtsvertretung. Die AGB schliessen Rechtsberatung und Vertretung aus (Ziff. 2.3).
- **Tessin:** Treuhandtätigkeiten (auch Immobilientreuhand) sind bewilligungspflichtig
  (Legge sull'esercizio delle professioni di fiduciario, Albo dei fiduciari). → Angebot auf die
  Deutschschweiz beschränkt (AGB Ziff. 1.3, Website). Vor einer Ausweitung in die Westschweiz die
  jeweiligen kantonalen Regeln prüfen.
- Keine FINMA-Bewilligung nötig: keine Vermögensverwaltung, keine Entgegennahme von Kundengeldern
  (Nachzahlungen gehen direkt an den Vermieter).

### 3.2 Arbeitsrecht
- Kein Konkurrenzverbot (von dir bestätigt). Die gesetzliche Treuepflicht (Art. 321a OR) gilt trotzdem:
  **keine Arbeit während der Arbeitszeit, keine Geräte, Vorlagen, Daten oder Kunden des Arbeitgebers,
  keine Abwerbung von Mandaten.** Die Zielgruppe (Kleinstvermieter ohne Verwaltung) ist nicht die
  Kundschaft einer Bewirtschaftungsfirma.
- Falls dein Arbeitsvertrag eine **Meldepflicht für Nebenbeschäftigungen** kennt: kurz schriftlich melden.

### 3.3 Vertragsrecht und AGB
- **Qualifikation:** Geschuldet ist ein Ergebnis (fertige Abrechnung) → Werkvertrag, Art. 363 ff. OR.
  Die AGB sind darauf ausgerichtet (Mängelrechte Ziff. 7, Rücktritt Ziff. 9 nach Art. 377 OR).
- **Vertragsschluss:** Anfrage (unverbindlich) → Entwurf mit Preis = Angebot → Freigabe/Zahlung =
  Annahme. Vorteil: Der Kunde sieht vor der Bindung das Ergebnis; Eingabefehler können vorher korrigiert
  werden (Art. 3 Abs. 1 lit. s Ziff. 3 UWG).
- **Einbezug der AGB:** Zustimmung per Häkchen im Formular (Pflichtfeld) und erneuter Hinweis mit Link in
  der Entwurf-E-Mail vor der Freigabe → gültige Globalübernahme.
- **Inhaltskontrolle (Art. 8 UWG, Ungewöhnlichkeitsregel):** Private Vermieter können Konsumenten sein
  (Verwaltung eigenen Vermögens). Die Klauseln sind darauf ausgelegt: Haftungsbeschränkung nur für leichte
  Fahrlässigkeit (Art. 100 Abs. 1 OR), unbeschränkte Haftung bei Absicht/Grobfahrlässigkeit,
  kostenlose Nachbesserung, Minderung/Rücktritt als Rückfall, Konsumentengerichtsstand vorbehalten,
  keine Preisänderung nach Angebot, Kostenfreiheit bis zur Freigabe.

### 3.4 Haftungsrisiko und Versicherung
- Realistisches Risiko: fehlerhafte Verteilung → Vermieter kann einen Teil nicht einfordern oder muss
  nachbessern. Begrenzung auf den Auftragspreis bei leichter Fahrlässigkeit; Hauptschutz ist die
  Kontrollkette (Prüfbericht → Zweitprüfung → Sichtkontrolle → Freigabe durch den Kunden).
- **Berufshaftpflichtversicherung:** für den Test nicht nötig. Ab regelmässigem Betrieb prüfen
  (Richtwert CHF 300–600/Jahr für Vermögensschäden bis CHF 100'000–250'000).

### 3.5 Mietrechtliche Richtigkeit der Abrechnungen
- Nur ausdrücklich vereinbarte Nebenkosten (Art. 257a Abs. 2 OR) → `vereinbarte_positionen` je Mieter.
- Tatsächliche Aufwendungen (Art. 257b Abs. 1 OR); Unterhalt, Reparaturen, Kapitalkosten,
  Gebäudeversicherung, Liegenschaftssteuer nicht (Art. 257a f. OR; für Heizkosten ausdrücklich Art. 6 VMWG) → Warnliste.
- Heizkosten-Positionen Art. 5 VMWG; Abgrenzung bei Mieterwechsel nach Monatsanteilen
  (mietrechtspraxis-Tabelle, per Test nachgerechnet).
- Verwaltungsaufwand: siehe Fehler 1.
- Belegeinsicht: Hinweis auf Art. 257b Abs. 2 OR und Art. 8 VMWG in jeder Abrechnung.
- Heizöl-Lager nach FIFO bewertet (Restbestand zum Preis der jüngsten Einkäufe) – gängige, vertretbare
  Methode; bei Streit ist auch Durchschnittspreis vertretbar.
- Hinweis zur Verjährung für Vermieter: Nebenkostenforderungen verjähren nach 5 Jahren (Art. 128 Ziff. 1 OR).

### 3.6 Lauterkeitsrecht (UWG) und Preise
- **Impressum (Art. 3 Abs. 1 lit. s Ziff. 1 UWG):** Name, Postadresse, E-Mail → vorhanden; Build bricht
  ohne Adresse ab.
- **Elektronischer Vertragsschluss (lit. s Ziff. 2–4):** Schritte in AGB Ziff. 3 und auf der Website
  erklärt; Korrektur vor Freigabe möglich; Bestätigung per E-Mail (Eingangsbestätigung und
  Stripe-Zahlungsbeleg) → in der Einrichtung aktivieren.
- **Preisbekanntgabe (PBV):** Endpreise in CHF, Zuschläge (Express) angegeben, keine MWST.
- **Werbeaussagen (lit. b):** alle Aussagen der Website geprüft – wahr und belegbar; keine Garantien,
  keine Vergleiche mit genannten Mitbewerbern.
- **E-Mail-Werbung (lit. o) und Telefon (lit. u):** siehe Regeln in `verkauf/nachrichten.md`.

### 3.7 Datenschutz (DSG)
- **Rollen:** Für Kundendaten bist du Verantwortlicher; für Mieterdaten **Auftragsbearbeiter** des
  Vermieters (Art. 9 DSG) → vertraglich im AGB-Anhang geregelt (Zweck, Daten, Weisungen, Sicherheit,
  Unterauftragsbearbeiter, Meldung von Verletzungen, Löschung).
- **Informationspflicht (Art. 19 DSG):** Datenschutzerklärung nennt Identität, Zwecke, Empfänger,
  Staaten und Garantien.
- **Auslandbekanntgabe (Art. 16 DSG):** Irland angemessen (Anhang 1 DSV); USA über Swiss-U.S. DPF bzw.
  Standardvertragsklauseln der Anbieter.
- **KI:** nur über die Claude API (kommerzielle Bedingungen, kein Training). **Echte Kundenunterlagen
  nie in ein privates Chat-Konto laden.** Keine automatisierten Einzelentscheidungen (Art. 21 DSG).
- **Datensicherheit (Art. 8 DSG):** Zwei-Faktor-Anmeldung bei allen Konten, verschlüsselter Laptop
  (FileVault/BitLocker), Kundenordner nicht in privaten Cloud-Ordnern teilen, Formspree-Einträge
  monatlich löschen.
- **Kein Verzeichnis der Bearbeitungstätigkeiten** nötig (Art. 12 Abs. 5 DSG, Art. 24 DSV: weniger als
  250 Mitarbeitende, geringes Risiko). **Keine Datenschutz-Folgenabschätzung** nötig (kein hohes Risiko).
- **Datenschutzverletzung:** bei hohem Risiko Meldung an den EDÖB (Art. 24 DSG) und an den Vermieter.

### 3.8 Cookies und Tracking
Keine Cookies, keine externen Inhalte → keine Einwilligung, kein Banner. Das Prüfskript
`golive_check.py` kontrolliert das nach dem Aufschalten.

### 3.9 Steuern, Sozialversicherung, Register (deine Aufgabe)
- **AHV:** Selbständige Nebenerwerbstätigkeit bei der Ausgleichskasse (Kanton Basel-Landschaft: SVA Basel-Landschaft)
  anmelden, sobald Einnahmen fliessen. Liegt das Reineinkommen daraus unter der Geringfügigkeitsgrenze (rund CHF 2'300–2'500 im
  Jahr; aktuellen Betrag bei der Ausgleichskasse bestätigen), werden Beiträge nur auf dein Verlangen
  erhoben (Art. 19 AHVV) – die Anmeldung schadet trotzdem nicht.
- **Steuern:** Gewinn in der Steuererklärung als selbständiger Nebenerwerb angeben; Ausgaben
  (Domain, Ads, Gebühren) abziehbar. Einnahmen/Ausgaben geordnet aufzeichnen (Art. 957 Abs. 2 OR),
  Belege 10 Jahre aufbewahren.
- **MWST und Handelsregister:** erst ab CHF 100'000 Jahresumsatz.
- **Name:** Nicht eingetragene Einzelunternehmen treten mit ihrem Namen auf; «Nebenkosten fixfertig» ist
  zulässig als Geschäftsbezeichnung neben dem Namen (so im Impressum). Vor Investitionen in die Marke
  auf swissreg.ch prüfen, ob «fixfertig» für Dienstleistungen geschützt ist.

## 4. Empfohlene Anwaltsprüfung (vor grösserem Volumen)
1. AGB-Haftungsklausel Ziff. 8 und Mängelfrist Ziff. 7 gegenüber Konsumenten.
2. Auftragsbearbeitungs-Anhang: genügt er den Erwartungen grösserer Vermieter?
3. Kantone ausserhalb der Deutschschweiz (Bewilligungspflichten), falls das Angebot ausgeweitet wird.

## 5. Geänderte Dokumente
`landingpage/src/agb.html` (neu gefasst) · `landingpage/src/datenschutz.html` (neu gefasst) ·
`landingpage/src/impressum.html` · `landingpage/src/index.html` · `landingpage/build.py` ·
`landingpage/golive_check.py` (neu) · `engine/nk.py` · `engine/test_nk.py` (22 Tests) ·
`engine/extrahiere.py` (neu) · `engine/prompts/01-extraktion.md` · `verkauf/nachrichten.md` ·
`verkauf/outreach.py` · `recht/vermittlungsvereinbarung.md` (neu)

## 6. Nachtrag: Bezahlung bei Bestellung (Phase 1)

Der Ablauf wurde geändert: Der Kunde bezahlt **bei der Bestellung** über Stripe und sendet danach die
Unterlagen. Rechtliche Anpassungen, umgesetzt in AGB Version 1.1:

- **Vertragsschluss** mit erfolgreicher Zahlung (AGB 3.2). Zustimmung zu den Bedingungen direkt auf der
  Stripe-Zahlungsseite (Pflicht-Häkchen mit Link) → gültiger Einbezug.
- **E-Commerce-Pflichten** (Art. 3 Abs. 1 lit. s UWG): Eingaben auf der Stripe-Seite vor Abschluss prüf- und
  korrigierbar; automatische Zahlungsbestätigung von Stripe; Auftragsbestätigung per E-Mail.
- **Rückerstattung** klar geregelt (AGB 5.5): voll, solange keine Unterlagen gesendet sind oder wenn nicht
  geliefert werden kann. Das senkt die Hürde für den Kauf und vermeidet Streit über Vorauszahlungen.
- **Rücktritt nach Einsenden der Unterlagen:** Vergütung nur für geleistete Arbeit, Rest zurück (Art. 377 OR).
- **Falsche Grösse bestellt:** Differenz bezahlen oder Auflösung mit voller Rückerstattung (AGB 5.4).
- **Formspree entfällt**; Bestellangaben erfasst Stripe (Datenschutzerklärung angepasst). Die Datenschutz-
  hinweise zu Formspree in Abschnitt 3.7 und Fehler 10 sind damit gegenstandslos.
- **Werbeaussagen** geprüft: keine Garantie für Fehlerfreiheit, keine Aussage «vollständig automatisch»;
  die FAQ sagt ausdrücklich, dass keine Garantie gegeben wird.
