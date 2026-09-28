# Geldstrom: Nebenkostenabrechnung fixfertig

> **Ich brauche kein Business. Ich brauche ein System, das mir mit möglichst wenig persönlicher Zeit
> zusätzliches Geld einbringt.**

Herleitung (30 Probleme → 20 Modelle → 10 → 5 → 3 → 1, Bewertung, Zerstörung der Top 5, Realitätscheck):
[`01-analyse.md`](01-analyse.md).

---

## JETZT: PHASE 1 – VERKAUF VOR ENTWICKLUNG

**Offene Frage:** Zahlt ein Vermieter tatsächlich CHF 390 dafür, dass seine Nebenkostenabrechnung für
ihn erstellt wird? Bis das mit Geld beantwortet ist, wird **nichts weiter automatisiert**.
Testplan, Akquise, Nachrichten, Messung und Entscheidungsregeln: [`VERKAUFSTEST.md`](VERKAUFSTEST.md).

| | |
|---|---|
| **Produkt** | «Ihre Nebenkostenabrechnung wird für Sie erstellt.» Unterlagen senden, fertige Abrechnung je Mietpartei zurück – fachlich geprüft. |
| **Zielgruppe** | Private Vermieter in der Deutschschweiz mit 1–12 Wohnungen ohne Verwaltung. |
| **Preis** | **CHF 390** pro Liegenschaft und Jahr bis 8 Wohnungen · CHF 490 für 9–12 Wohnungen. Keine weiteren Varianten. |
| **Bestellung** | Website → Stripe (bezahlen, Bedingungen bestätigen) → Unterlagen-Seite → E-Mail mit Unterlagen. Kein Konto. |
| **Risiko für den Kunden** | Volle Rückerstattung, solange keine Unterlagen gesendet sind oder wenn wir nicht liefern können. |
| **Lieferung** | bestehendes System: Auslesen → Rechnen → Prüfbericht → Sichtkontrolle → Lieferpaket (ZIP) |
| **Erfolg** | mindestens 1 bezahlter Auftrag |
| **Entscheid** | 0 → Angebot/Zielgruppe prüfen · 1–2 → weiter testen · 3–5 → Automatisierung analysieren · 5+ → Variante B bauen |

---

## Schritt 0 – erledigt

Arbeitsvertrag geprüft: **kein Konkurrenzverbot.** Es gilt die gesetzliche Treuepflicht
(Art. 321a OR): keine Arbeit in der Arbeitszeit, keine Geräte, Vorlagen, Daten oder Kunden des
Arbeitgebers. Falls der Vertrag eine Meldepflicht für Nebenbeschäftigungen kennt: kurz melden.
Rechtliche Prüfung des ganzen Modells: [`recht/RECHTLICHE-PRUEFUNG.md`](recht/RECHTLICHE-PRUEFUNG.md).

## Einrichtung (einmalig, ~2 h)

Alle Anmeldungen Schritt für Schritt, mit Go-live-Checkliste: [`EINRICHTUNG.md`](EINRICHTUNG.md).

1. **Infomaniak:** Domain `nebenkosten-fixfertig.ch` + E-Mail-Adresse.
2. **Stripe:** zwei Zahlungslinks (CHF 390 / 490) als Bestellseite, mit Zustimmung zu den Bedingungen und
   Weiterleitung auf die Unterlagen-Seite. Rückfall: QR-Rechnung aus dem E-Banking.
3. **Website:** Telefon und Stripe-Links in `landingpage/config.json` eintragen,
   `python3 landingpage/build.py` → `landingpage/nebenkosten-website.zip` auf Netlify, Domain verbinden,
   dann `python3 landingpage/golive_check.py https://nebenkosten-fixfertig.ch`.
   **Keine Cookies, kein Tracking → kein Cookie-Banner nötig.**
4. **Claude API** für Kundenbelege (`engine/extrahiere.py`) – nie ein privates Chat-Konto für echte
   Kundenunterlagen.
5. **Google Ads** (optional) gemäss [`verkauf/nachrichten.md`](verkauf/nachrichten.md).

### Formelles (einmal lesen, nichts davon blockiert den Test)
- **Handelsregister:** nicht nötig unter CHF 100'000 Umsatz/Jahr. Auftritt unter eigenem Namen (Impressum).
- **MWST:** nicht pflichtig unter CHF 100'000 Umsatz – deshalb «keine MWST» in den Bedingungen.
- **AHV:** Nebenerwerb bei der Ausgleichskasse anmelden, sobald Einnahmen fliessen; unterhalb der
  Geringfügigkeitsgrenze (rund CHF 2'300–2'500 Reingewinn/Jahr) sind Beiträge nur auf Verlangen geschuldet. Einnahmen in der Steuererklärung angeben.
- **Anbieter und Anmeldung:** siehe [`EINRICHTUNG.md`](EINRICHTUNG.md).
- **Rechtstexte:** Datenschutzerklärung und Auftragsbedingungen sind sorgfältige Vorlagen für diesen
  Anwendungsfall, aber keine Anwaltsprüfung. Für den Test ausreichend; vor grösserem Volumen einmal
  beim HEV-Rechtsdienst oder einer Anwältin gegenlesen lassen (~CHF 200–400).

## 7-Tage-Test

Siehe [`VERKAUFSTEST.md`](VERKAUFSTEST.md) – Plan, Kanäle, Vorlagen, Tracker, Entscheidungsregel.

## Lieferprozess (pro Auftrag, Ziel ≤ 45 Min. deiner Zeit)

```
Zahlung eingegangen (Stripe-Mail) → Auftrag bestätigen (VERKAUFSTEST.md, Vorlage 5)   (du, 3 Min.)
Unterlagen im Postfach → in kunden/<x>/belege/ ablegen
  → python3 engine/extrahiere.py kunden/<x>          → JSON + Rückfragen      (KI, 5 Min. du)
  → Rückfragen? eine E-Mail an Kunde                                          (du, 5 Min.)
  → python3 engine/nk.py kunden/<x>/eingabe.json --out kunden/<x>/ausgabe --pdf
  → Prompt 2 mit Uebersicht.pdf + pruefbericht.txt    → «LIEFERBAR»            (KI)
  → Sichtkontrolle Übersicht + 1 Abrechnung                                   (du, 10 Min.)
  → python3 engine/nk.py kunden/<x>/eingabe.json --out kunden/<x>/ausgabe --paket
  → Lieferungs-Mail mit dem ZIP (Vorlage 6)                                   (du, 3 Min.)
```

Minuten je Schritt im Tracker notieren – das ist die Grundlage für jede spätere Automatisierung.

`nk.py` rechnet deterministisch (keine KI-Zahlen): Verteilschlüssel, Heizgradtage bei Mieterwechsel
(mietrechtspraxis-Tabelle, per Test gegen die Tabelle geprüft), Heizöl-Lager (FIFO), Leerstand,
nicht vereinbarte Positionen, Verwaltungsaufwand, Akonto-Saldo auf 5 Rappen, Akonto-Empfehlung,
Kontrollsumme und Warnungen (Reparaturen, unplausible Heizkosten/m², hohe Nachzahlungen).

```bash
cd geldstrom/engine
python3 -m unittest test_nk.py                         # 22 Tests
python3 nk.py beispiel/mfh-beispielweg.json --out /tmp/nk --pdf
```

## Automatisierungsarchitektur (erst ab 5 bezahlten Aufträgen)

| Schritt | V1 (Test) | V2 (ab 5 Kunden) | Wer |
|---|---|---|---|
| Kunde findet Angebot | Netzwerk, Treuhänder, Google Ads | + Stammkunden-Erinnerung, Empfehlungsprämie | Automation |
| Landingpage | statisch, Netlify | gleich | Automation |
| Bestellung | Formular → E-Mail | Formular → Tabelle + Auto-Antwort mit Unterlagenliste | Automation |
| Formular / Unterlagen | E-Mail mit Anhängen | Upload-Formular (Tally), automatisch in Kundenordner | Automation |
| KI | `extrahiere.py` (Claude API), von dir gestartet | automatisch bei Eingang der Unterlagen | KI |
| Datenverarbeitung | `nk.py` | gleich, ausgelöst durch neues JSON | Automation |
| Qualitätskontrolle | Prüfbericht + Prompt 2 + **deine Sichtkontrolle** | Sichtkontrolle nur bei WARNUNG | KI + **Mensch** |
| Zahlung | Stripe Payment Link bei Bestellung | gleich | Automation |
| Output | PDFs | gleich | Automation |
| Lieferung | E-Mail von dir | Stripe-Webhook → automatische Lieferung | Automation |
| Follow-up | Vorlage «Wiederholung + Empfehlung» | Kalender-Erinnerung 11 Monate später, automatische Mail | Automation |
| Upsell | Vermietungspaket bei Mieterwechsel | gleich | Mensch (selten) |

Mensch bleibt nur bei: Rückfragen und Sichtkontrolle. Diese Grenze ist bewusst – eine falsche
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

Annahmen: Preis CHF 390 · variable Kosten pro Auftrag ca. CHF 49 (TWINT CHF 7.71, KI unter CHF 1,
Akquise Ø CHF 40) · Aufbau 8 h einmalig · 45 Min. pro Auftrag für die ersten 10, danach 30 Min.

| Kunden | Umsatz | Gewinn | Zeit total | CHF Gewinn / Stunde |
|---|---|---|---|---|
| 1 | 390 | 341 | 8,75 h | **39** (ohne Aufbau: 455) |
| 5 | 1'950 | 1'705 | 11,75 h | **145** |
| 10 | 3'900 | 3'410 | 15,5 h | **220** |
| 20 | 7'800 | 6'820 | 20,5 h | **333** |
| 50 | 19'500 | 17'050 | 35,5 h | **480** |

Das sind Rechenbeispiele, keine Prognose – ob überhaupt jemand kauft, zeigt erst der Test.

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
  engine/test_nk.py      22 Tests
  engine/extrahiere.py   Belege per Claude API auslesen → Eingabe-JSON
  recht/                 Rechtliche Prüfung, Vermittlungsvereinbarung
  engine/beispiel/       Beispielliegenschaft (4 Wohnungen, Mieterwechsel, Leerstand, Heizöl)
  engine/prompts/        Extraktions- und Prüfprompt
  landingpage/src/       Website: Startseite, Impressum, Datenschutz, Auftragsbedingungen, Beispiel-PDFs
  landingpage/build.py   setzt config.json ein → nebenkosten-website.zip für Netlify Drop
  verkauf/               Nachrichten, E-Mails, Google-Ads-Setup, Test-Tracker,
                         treuhaender.csv (32 Büros Kt. ZH) + outreach.py (E-Mails per Klick)
```
