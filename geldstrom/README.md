# Geldstrom: Nebenkostenabrechnung fixfertig

> **Ich brauche kein Business. Ich brauche ein System, das mir mit möglichst wenig persönlicher Zeit
> zusätzliches Geld einbringt.**

Herleitung (30 Probleme → 20 Modelle → 10 → 5 → 3 → 1, Bewertung, Zerstörung der Top 5, Realitätscheck):
[`01-analyse.md`](01-analyse.md).

---

## DAS IST DER ERSTE TEST

| | |
|---|---|
| **Produkt** | Heiz- und Nebenkostenabrechnung als Fixpreis-Dienstleistung: Belege rein, versandbereite Abrechnung je Mietpartei raus. |
| **Ein Satz** | Wir helfen Privatvermietern, ihre jährliche Nebenkostenabrechnung zu erledigen, ohne dass sie Belege ausrechnen, Heizöl bewerten und Briefe schreiben müssen. |
| **Zielgruppe** | Privatpersonen mit 1–12 vermieteten Wohnungen ohne Verwaltung (MFH, Erben, pensionierte Eigentümer). 47 % der CH-Mietwohnungen gehören Privatpersonen. |
| **Problem** | Pflicht (Art. 4 VMWG), jedes Jahr, ½–1 Tag Arbeit; Fehler bei Mieterwechsel, Heizöl-Lager und nicht vereinbarten Positionen kosten Geld und Streit. |
| **Preis** | CHF 290 (1–4 Whg.) · 390 (5–8) · 490 (9–12) · Express +90 · Stammkunde –40. |
| **Warum jemand zahlt** | Frist + Aufwand + Fehlerrisiko, und die Gebühr ist über den Verwaltungsaufwand (3–5 % der NK, Art. 4 Abs. 3 VMWG) grossteils an die Mieter weiterverrechenbar. Eine Verwaltung kostet CHF 350–500 pro Wohnung und Jahr. |
| **Verkaufsweg** | 1. eigenes Netzwerk (20 Nachrichten) · 2. Kleintreuhänder als Vermittler (CHF 60/Auftrag) · 3. Google Ads auf Kaufabsicht (CHF 20/Tag) · 4. tutti/anibis. Kein Posten, keine Videos, keine Community. |
| **MVP** | Landingpage + E-Mail-Eingang + KI-Extraktion + Rechenkern + Zahlungslink. Alles in diesem Ordner, lauffähig und getestet. |
| **Automatisierung** | siehe Architektur unten; du bist nur bei Kontrolle und Freigabe dabei. |
| **7-Tage-Test** | 29.09.–05.10.2026, Plan unten. Saison passt: Perioden per 30.6. werden jetzt abgerechnet. |
| **Erfolgskriterium** | ≥ 1 **bezahlter** Auftrag in 7 Tagen, oder ≥ 2 Vermieter haben Unterlagen geschickt (Zahlung folgt nach Entwurf). |
| **Kill-Kriterium** | Nach **40 qualifizierten Kontakten** (Netzwerk + Treuhänder) und **CHF 140 Ads** mit < 3 Gesprächen und 0 Unterlagen → Modell verwerfen, T2 (Verkaufsdokumentation) starten. Nicht verlängern, nicht «noch eine Woche». |

---

## Schritt 0 – bevor du irgendetwas verschickst (15 Min.)

**Arbeitsvertrag lesen: Nebenbeschäftigung / Konkurrenzverbot.** Du arbeitest bei einer
Liegenschaftsverwaltung; Nebenkostenabrechnungen für Privatvermieter liegen nah an deren Geschäft.
Das ist die einzige Frage, die das Ergebnis grundlegend ändern kann. Wenn eine Bewilligungspflicht
besteht: kurz melden («Kleinstvermieter unter 12 Wohnungen, keine Mandate, keine Kunden der Firma»).
Wenn verboten: sofort auf T2 (Verkaufsdokumentation) oder M3 ausweichen – der Rechenkern bleibt
trotzdem verkaufbar (z. B. als Lizenz). Keine Kunden oder Daten des Arbeitgebers verwenden.

## Einrichtung (einmalig, ~2 h)

1. **E-Mail-Adresse** eigens dafür (z. B. Gmail/Proton) – Eingang aller Belege.
2. **Formspree** (gratis, 50 Bestellungen/Monat): formspree.io → «New Form» mit dieser E-Mail →
   Endpoint-URL kopieren. Ohne Formspree öffnet das Formular ein vorausgefülltes E-Mail (funktioniert auch).
3. **Website:** Werte in `landingpage/config.json` eintragen (Adresse, E-Mail, Telefon, E-Mail-Anbieter,
   Formspree-Endpoint), dann `python3 landingpage/build.py` → `landingpage/nebenkosten-website.zip`.
   Auf [Netlify Drop](https://app.netlify.com/drop) ziehen → Netlify-Konto erstellen →
   *Site configuration → Change site name* auf `nebenkosten-fixfertig` (sonst `WEBSITE` in der
   config anpassen und neu bauen). Enthält: Startseite, Bestellformular mit Unterlagen-Checkliste,
   Impressum, Datenschutzerklärung, Auftragsbedingungen, Vorschaubild für WhatsApp, Sicherheits-Header.
   **Keine Cookies, kein Tracking → kein Cookie-Banner nötig.** Eigene Domain für den Test nicht nötig.
4. **Zahlungslink:** Stripe-Konto (Karte + TWINT) → Payment Links für CHF 290 / 390 / 490 / 90.
   Die Links gehören in die Entwurf-Mail, nicht auf die Website. Alternative: QR-Rechnung aus dem E-Banking.
5. **Claude-Projekt «Nebenkosten»** anlegen, `engine/prompts/01-extraktion.md` und
   `02-pruefung.md` als Projektwissen hinterlegen. **Wichtig:** in den Claude-Einstellungen unter
   Datenschutz die Verwendung von Chats zum Modelltraining ausschalten – die Datenschutzerklärung sagt
   den Kunden zu, dass ihre Unterlagen nicht zum Training verwendet werden.
6. **Google Ads** gemäss [`verkauf/nachrichten.md`](verkauf/nachrichten.md#c--google-ads-suchnetzwerk--ab-tag-2-läuft-ohne-dich).
   Ohne Conversion-Tag auf der Website (sonst wären Cookies und ein Banner nötig); gemessen wird im Tracker.

### Formelles (einmal lesen, nichts davon blockiert den Test)
- **Handelsregister:** nicht nötig unter CHF 100'000 Umsatz/Jahr. Auftritt unter eigenem Namen (Impressum).
- **MWST:** nicht pflichtig unter CHF 100'000 Umsatz – deshalb «keine MWST» in den Bedingungen.
- **AHV:** Nebenerwerb bei der Ausgleichskasse anmelden, sobald Einnahmen fliessen; bis CHF 2'500
  Reingewinn/Jahr sind Beiträge nur auf Verlangen geschuldet. Einnahmen in der Steuererklärung angeben.
- **Anbieter und Anmeldung:** siehe [`EINRICHTUNG.md`](EINRICHTUNG.md).
- **Rechtstexte:** Datenschutzerklärung und Auftragsbedingungen sind sorgfältige Vorlagen für diesen
  Anwendungsfall, aber keine Anwaltsprüfung. Für den Test ausreichend; vor grösserem Volumen einmal
  beim HEV-Rechtsdienst oder einer Anwältin gegenlesen lassen (~CHF 200–400).

## 7-Tage-Test

| Tag | Aufgabe | Zeit |
|---|---|---|
| Mo 29.9. | Schritt 0 · Einrichtung 1–4 · 20 Netzwerk-Nachrichten (Vorlage A) | 2 h |
| Di 30.9. | `python3 verkauf/outreach.py …` → 15 Prio-A/B-E-Mails per Klick (Liste mit 32 Treuhändern liegt bereit) · Google Ads live · tutti-Inserat | 1,5 h |
| Mi 1.10. | restliche Treuhänder-Mails · Antworten bearbeiten | 1 h |
| Do 2.10. | 10 Treuhänder anrufen (5 Min. je) · Netzwerk-Nachfass | 1 h |
| Fr 3.10. | eingehende Unterlagen → Prompt 1 → `nk.py` → Prompt 2 → Entwurf an Kunde | 1 h |
| Sa/So | Puffer, erste Lieferung nach Zahlung | 0–1 h |
| So 5.10. | Messen: Tracker auswerten, Entscheid nach Erfolgs-/Kill-Kriterium | 15 Min |

Messung ausschliesslich in [`verkauf/test-tracker.csv`](verkauf/test-tracker.csv):
angeschrieben → Antwort → interessiert → Unterlagen → Entwurf → **bezahlt**. Klicks und Likes zählen nicht.

## Lieferprozess (pro Auftrag, Ziel ≤ 45 Min. deiner Zeit)

```
Unterlagen im Postfach
  → Claude-Projekt: Belege anhängen + Prompt 1        → JSON + Rückfragen      (KI, 5 Min. du)
  → Rückfragen? eine E-Mail an Kunde                                          (du, 5 Min.)
  → python3 engine/nk.py kunden/<x>.json --out kunden/<x>/ --pdf              (Automation)
  → Prompt 2 mit Uebersicht.pdf + pruefbericht.txt    → «LIEFERBAR»            (KI)
  → Sichtkontrolle Übersicht + 1 Abrechnung                                   (du, 10 Min.)
  → Entwurf-Mail mit Uebersicht.pdf + Zahlungslink                            (du, 3 Min.)
  → Zahlung eingegangen → Lieferungs-Mail mit allen PDFs                       (du, 3 Min.)
```

`nk.py` rechnet deterministisch (keine KI-Zahlen): Verteilschlüssel, Heizgradtage bei Mieterwechsel
(mietrechtspraxis-Tabelle, per Test gegen die Tabelle geprüft), Heizöl-Lager (FIFO), Leerstand,
nicht vereinbarte Positionen, Verwaltungsaufwand, Akonto-Saldo auf 5 Rappen, Akonto-Empfehlung,
Kontrollsumme und Warnungen (Reparaturen, unplausible Heizkosten/m², hohe Nachzahlungen).

```bash
cd geldstrom/engine
python3 -m unittest test_nk.py                         # 15 Tests
python3 nk.py beispiel/mfh-beispielweg.json --out /tmp/nk --pdf
```

## Automatisierungsarchitektur

| Schritt | V1 (Test) | V2 (ab 5 Kunden) | Wer |
|---|---|---|---|
| Kunde findet Angebot | Netzwerk, Treuhänder, Google Ads | + Stammkunden-Erinnerung, Empfehlungsprämie | Automation |
| Landingpage | statisch, Netlify | gleich | Automation |
| Bestellung | Formular → E-Mail | Formular → Tabelle + Auto-Antwort mit Unterlagenliste | Automation |
| Formular / Unterlagen | E-Mail mit Anhängen | Upload-Formular (Tally), automatisch in Kundenordner | Automation |
| KI | Claude-Projekt, Prompt 1 manuell gestartet | Claude API: Anhänge → JSON automatisch | KI |
| Datenverarbeitung | `nk.py` | gleich, ausgelöst durch neues JSON | Automation |
| Qualitätskontrolle | Prüfbericht + Prompt 2 + **deine Sichtkontrolle** | Sichtkontrolle nur bei WARNUNG | KI + **Mensch** |
| Zahlung | Stripe Payment Link nach Entwurf | gleich | Automation |
| Output | PDFs | gleich | Automation |
| Lieferung | E-Mail von dir | Stripe-Webhook → automatische Lieferung | Automation |
| Follow-up | Vorlage «Wiederholung + Empfehlung» | Kalender-Erinnerung 11 Monate später, automatische Mail | Automation |
| Upsell | Vermietungspaket bei Mieterwechsel | gleich | Mensch (selten) |

Mensch bleibt nur bei: Rückfragen, Sichtkontrolle, Freigabe. Diese Grenze ist bewusst – eine falsche
Abrechnung zerstört das Vertrauen, auf dem das Wiederholgeschäft beruht.

## Dein persönlicher Aufwand

| Aufgabe | Meine Zeit | Claude/AI | Automation |
|---|---|---|---|
| Aufbau (Schritt 0 + Einrichtung) | 2,5 h einmalig | ✓ (erledigt: Code, Seite, Texte) | |
| Verkauf Testwoche | 5 h einmalig | ✓ Texte | ✓ Ads |
| Verkauf laufend | 15 Min./Auftrag | ✓ | ✓ Ads, Partner |
| Lieferung | 20 Min./Auftrag (→ 10 in V2) | ✓ Extraktion, Prüfung | ✓ Rechnung, PDF |
| Support / Rückfragen | 10 Min./Auftrag | ✓ Rückfrageliste | |
| Nachbearbeitung / Follow-up | 0 h | | ✓ Vorlage, Erinnerung |

## Finanzielles Szenario

Annahmen: Ø Preis CHF 330 · variable Kosten pro Auftrag CHF 52 (Zahlung ~CHF 10, KI ~CHF 2,
Akquise Ø CHF 40 aus Partnerprämie/Ads) · Aufbau 8 h einmalig · 45 Min. pro Auftrag für die ersten 10,
danach 30 Min.

| Kunden | Umsatz | Gewinn | Zeit total | CHF Gewinn / Stunde |
|---|---|---|---|---|
| 1 | 330 | 278 | 8,75 h | **32** (ohne Aufbau: 371) |
| 5 | 1'650 | 1'390 | 11,75 h | **118** |
| 10 | 3'300 | 2'780 | 15,5 h | **179** |
| 20 | 6'600 | 5'560 | 20,5 h | **271** |
| 50 | 16'500 | 13'900 | 35,5 h | **392** |

Im Folgejahr fallen Aufbau und ein Grossteil der Akquise weg (Stammkunden): 40 Liegenschaften
× CHF 290 ≈ CHF 11'600 bei ~20 h/Jahr → **≈ CHF 950/Monat bei < 30 Min./Woche im Jahresschnitt**.
Ehrliche Einordnung: Umsatz kommt in Saisonwellen, und CHF 4'000+/Monat erreicht dieses Modell nur
mit Hilfskraft oder Lizenzierung (siehe Analyse, Realitätscheck).

## Wenn der Test scheitert

Kill-Kriterium erreicht → am Montag danach T2 starten: «Verkaufsdokumentation für Privatverkäufer,
CHF 690», Google Ads auf «Haus privat verkaufen», gleiche Architektur (Formular → KI-Text →
PDF-Dokumentation → deine Kontrolle). Definition in `01-analyse.md`, Phase 6.

## Ordner

```
geldstrom/
  README.md              dieser Entscheid
  01-analyse.md          Recherche, Long List, Bewertung, Top-5-Kritik
  engine/nk.py           Rechenkern (Python 3, keine Abhängigkeiten; PDF via Chromium)
  engine/test_nk.py      15 Tests
  engine/beispiel/       Beispielliegenschaft (4 Wohnungen, Mieterwechsel, Leerstand, Heizöl)
  engine/prompts/        Extraktions- und Prüfprompt
  landingpage/src/       Website: Startseite, Impressum, Datenschutz, Auftragsbedingungen, Beispiel-PDFs
  landingpage/build.py   setzt config.json ein → nebenkosten-website.zip für Netlify Drop
  verkauf/               Nachrichten, E-Mails, Google-Ads-Setup, Test-Tracker,
                         treuhaender.csv (32 Büros Kt. ZH) + outreach.py (E-Mails per Klick)
```
