# Phase 1: Verkauf vor Entwicklung

**Die eine Frage:** Zahlt ein Schweizer Vermieter tatsächlich CHF 390 dafür, dass seine
Nebenkostenabrechnung für ihn erstellt wird?

**Regel:** Keine weitere Automatisierung, bis diese Frage mit Geld beantwortet ist. Das bestehende System
(Rechenprogramm, Prüfbericht, Lieferpaket) reicht für die ersten Aufträge. Jede Stunde, die nicht hilft,
den ersten Kunden zu gewinnen, wird nicht investiert.

---

## 1. Das Angebot

| | |
|---|---|
| **Was der Kunde kauft** | «Ihre Nebenkostenabrechnung wird für Sie erstellt.» Keine Software, kein Tool, kein Rechner. |
| **Was er bekommt** | je Mietpartei eine versandbereite Abrechnung (PDF), eine Übersicht, eine Versandanleitung – fachlich geprüft |
| **Was es kostet** | **CHF 390** pro Liegenschaft und Jahr, bis 8 Wohnungen. 9–12 Wohnungen: CHF 490. Keine weiteren Kosten. |
| **Was er tun muss** | bezahlen, Unterlagen per E-Mail senden, die fertigen Abrechnungen an die Mieter weitergeben |
| **Risiko für den Kunden** | volle Rückerstattung, solange er keine Unterlagen gesendet hat oder wenn wir die Abrechnung nicht erstellen können |

**Was wir nicht versprechen:** «garantiert korrekt», «rechtlich garantiert», «fehlerfrei», «vollständig
automatisch». Wir sagen: *fachlich geprüft, Fehler auf unserer Seite korrigieren wir kostenlos.*

## 2. Bestellprozess (kein Konto, keine Registrierung)

```
Website: Preis sehen → Button «Nebenkostenabrechnung erstellen lassen»
 → Stripe-Zahlungsseite: Name, E-Mail, Telefon, Adresse der Liegenschaft, Bedingungen bestätigen,
   bezahlen (TWINT/Karte)                                    [automatisch]
 → Stripe schickt Zahlungsbeleg                              [automatisch]
 → Weiterleitung auf /unterlagen.html: Liste + Knopf «Unterlagen per E-Mail senden»   [automatisch]
 → Du: Eingang bestätigen (Vorlage 5), Unterlagen prüfen, Rückfragen      [~10 Min.]
 → Auslesen + Rechnen + Prüfbericht + Lieferpaket (bestehendes System)    [~20–30 Min.]
 → Du: Lieferung per E-Mail (Vorlage 6)                                   [~3 Min.]
```

Wer nicht online zahlen will: QR-Rechnung per E-Mail (FAQ auf der Website).

## 3. Der 7-Tage-Test

**Zählt nur:** bezahlte Aufträge. Nicht: Likes, Feedback, «würdest du zahlen?», Umfragen.

| Tag | Aufgabe | Ziel | Zeit |
|---|---|---|---|
| 0 | Einrichtung (EINRICHTUNG.md): Domain, E-Mail, Stripe, Website online | Website live, Testzahlung klappt | 2 h |
| 1 | 20 persönliche Nachrichten an Vermieter aus dem eigenen Umfeld (Vorlage 1) | 20 Kontakte | 1 h |
| 2 | 20 Empfehlungsfragen (Vorlage 2) · Google Ads starten (CHF 20/Tag) | 20 Kontakte | 1 h |
| 3 | 15 E-Mails an Treuhänder/kleine Verwaltungen (Vorlage 4, `verkauf/outreach.py`) | 15 Kontakte | 1 h |
| 4 | Nachfassen bei allen, die geantwortet haben · 1 Beitrag in einer passenden Gruppe (Vorlage 3) | Gespräche | 1 h |
| 5 | Interessenten anrufen, Einwände notieren, Zahlungslink schicken | Bestellungen | 1 h |
| 6 | Erste Aufträge bearbeiten | Lieferung | nach Bedarf |
| 7 | Auswertung nach Entscheidungsregel (Abschnitt 7) | Entscheid | 30 Min. |

Mindestumfang, bevor ein Urteil zulässig ist: **40 persönliche Kontakte + 15 B2B-Kontakte + 7 Tage Ads.**

## 4. Akquise: wo die ersten Kunden sind

Bewertet nach: Wie schnell erreiche ich eine Person, die *jetzt* eine Abrechnung machen muss?

| # | Kanal | Warum | Aufwand | Einschätzung |
|---|---|---|---|---|
| 1 | **Eigenes Umfeld direkt**: Familie, Bekannte, Nachbarn, Vereinskollegen, frühere Kontakte, die privat vermieten | Vertrauen ist schon da, Antwort in Stunden | 1 h | **Am schnellsten.** Erster Kunde am wahrscheinlichsten hier. |
| 2 | **Empfehlungen aus dem Umfeld**: «Kennst du jemanden mit 2–10 vermieteten Wohnungen?» | Jeder kennt 1–2 Kleinvermieter; die Empfehlung überträgt Vertrauen | 1 h | Sehr gut, CHF 50 Dank pro Auftrag |
| 3 | **Treuhänder und kleine Verwaltungen** als Vermittler | Werden von Kleinvermietern gefragt; kleine Verwaltungen lehnen Kleinstmandate oft ab | 1 h | Gut, aber langsamer (Tage bis Wochen). Keine Kunden des eigenen Arbeitgebers. |
| 4 | **Google Ads** auf «Nebenkostenabrechnung erstellen lassen» u. ä. | Erreicht Leute mit Kaufabsicht, läuft ohne deine Zeit | 30 Min., CHF 140 | Gut als Ergänzung; Volumen in der Schweiz klein |
| 5 | **Eine Gruppe**: lokale Hauseigentümer- oder Vermietergruppe (Facebook, Quartiervereine Pratteln/Muttenz/Liestal) | Kleinvermieter sind dort; ein seriöser Beitrag wird gelesen | 30 Min. | Mittel. Nur wo die Gruppenregeln Angebote erlauben. |
| 6 | Hauseigentümerverband (HEV-Sektion) | Genau die Zielgruppe | Anruf | Später: bietet teils eigene Dienste an; erst mit Referenzen anfragen |
| 7 | Private Inserate auf Wohnungsportalen anschreiben | Vermieter sind identifizierbar | hoch | **Nicht machen:** Kontaktformulare der Portale sind nicht für Werbung gedacht, wirkt wie Spam |

**Region:** Beginne im eigenen Umfeld (Region Basel). Die Treuhänder-Liste (`verkauf/treuhaender.csv`)
deckt den Raum Zürich ab. Wenn du lieber lokal startest, ergänze 10 Büros aus Pratteln, Muttenz, Liestal
und Basel über local.ch (Suche «Treuhand»).

## 5. Verkaufsnachrichten

Regeln: persönlich, einzeln gesendet, kein Serienversand, Abmeldesatz bei E-Mails an Unbekannte
(Art. 3 Abs. 1 lit. o UWG), vor Anrufen Sterneintrag prüfen (lit. u).

### Vorlage 1 – an jemanden aus deinem Umfeld, der vermietet (WhatsApp/SMS)

> Hoi [Name], du vermietest ja [die Wohnungen an der …]. Machst du die Nebenkostenabrechnung selber?
> Ich erstelle das neu für private Vermieter: Du schickst mir die Rechnungen und die Mieterliste, ich
> mache die Abrechnung für jede Mietpartei fertig – fachlich geprüft, versandbereit. Fixpreis CHF 390.
> Falls die Abrechnung per Ende Juni gerade ansteht: Hier ist alles beschrieben: [Link]

### Vorlage 2 – Empfehlungsfrage (WhatsApp/SMS)

> Hoi [Name], kurze Frage: Kennst du jemanden, der 2–10 Wohnungen selber vermietet und die
> Nebenkostenabrechnung jedes Jahr selber macht? Ich erstelle diese Abrechnungen neu zum Fixpreis von
> CHF 390. Wenn du mir einen Kontakt gibst und daraus ein Auftrag wird, bedanke ich mich mit CHF 50.
> Infos: [Link]

### Vorlage 3 – Beitrag in einer Gruppe (nur wo erlaubt)

> **Nebenkostenabrechnung für private Vermieter**
> Ich bin Fachperson aus der Immobilienbewirtschaftung und erstelle Heiz- und Nebenkostenabrechnungen
> für private Vermieter: Sie senden die Rechnungen und die Mieterliste, Sie erhalten für jede Mietpartei
> eine fertige, geprüfte Abrechnung zurück. Fixpreis CHF 390, inkl. Mieterwechsel und Heizöl-Lager.
> Fragen beantworte ich gern hier oder per Nachricht. [Link]

### Vorlage 4 – E-Mail an Treuhänder / kleine Verwaltung

**Betreff:** Nebenkostenabrechnungen für Ihre Vermieter-Kunden

> Guten Tag [Frau/Herr Name]
>
> Private Vermieter fragen ihre Treuhänderin oder Verwaltung oft, wer ihnen die jährliche Heiz- und
> Nebenkostenabrechnung erstellt – für ein Mandat sind die Liegenschaften meist zu klein.
>
> Ich komme aus der Immobilienbewirtschaftung und erstelle diese Abrechnungen zum Fixpreis von CHF 390
> pro Liegenschaft: Der Vermieter sendet die Unterlagen, er erhält für jede Mietpartei eine fertige,
> fachlich geprüfte Abrechnung zurück. Für jeden vermittelten Auftrag erhalten Sie CHF 60, offen gegenüber
> Ihrer Kundschaft – oder Ihre Kundschaft erhält stattdessen CHF 60 Rabatt.
>
> Angebot und Beispiel: [Link]
>
> Freundliche Grüsse
> [Vorname Name] · Nebenkosten fixfertig · [Telefon]
>
> Falls kein Interesse besteht, genügt eine kurze Antwort – ich melde mich dann nicht mehr.

### Vorlage 5 – nach Zahlungseingang (innert 1 Arbeitstag)

**Betreff:** Ihre Nebenkostenabrechnung [Liegenschaft] – Auftrag bestätigt

> Guten Tag [Name]
>
> Vielen Dank für Ihren Auftrag. [Falls Unterlagen schon da: Ihre Unterlagen sind eingegangen, ich melde
> mich, falls etwas fehlt.] [Sonst: Bitte senden Sie mir die Unterlagen an diese Adresse – die Liste
> finden Sie hier: [Link]/unterlagen.html]
>
> Sie erhalten das Lieferpaket innert 5 Arbeitstagen nach Eingang der vollständigen Unterlagen.
>
> Wie sind Sie auf das Angebot aufmerksam geworden? (Eine kurze Antwort hilft mir sehr.)
>
> Freundliche Grüsse
> [Vorname Name]

### Vorlage 6 – Lieferung

**Betreff:** Ihre Nebenkostenabrechnung [Liegenschaft] – fertig

> Guten Tag [Name]
>
> Im Anhang finden Sie das Lieferpaket: die Abrechnungen für alle Mietparteien, die Übersicht und eine
> kurze Anleitung für den Versand. [Ggf.: Bitte beachten Sie den Hinweis zu …]
>
> Bitte schauen Sie die Abrechnungen vor dem Versand kurz durch. Stimmt etwas nicht, antworten Sie
> einfach auf diese E-Mail – Fehler auf meiner Seite korrigiere ich kostenlos.
>
> Soll ich Sie nächstes Jahr an die Abrechnung erinnern? Dann antworten Sie mit «Ja».
>
> Freundliche Grüsse
> [Vorname Name]

## 6. Messung

Eine Zeile pro Kontakt in [`verkauf/test-tracker.csv`](verkauf/test-tracker.csv) (öffnet in Excel).
Spalten mit **J/N**, damit du mit dem Excel-Filter zählen kannst:

```
Kontakte → Antworten → Interessenten → Bestellungen → bezahlt → abgeschlossen
```

Zusätzlich je Auftrag: **Minuten je Schritt** (Rückfragen, Erstellung, Prüfung, Lieferung), **Probleme**
(was hat gehakt?), **Einwand** (wörtlich: warum nicht gekauft?), **wiederkehrend** (Ja zur Erinnerung?).

Die Einwände sind nach dem Geld die wichtigste Information: «zu teuer», «mache ich selbst», «habe eine
Verwaltung», «nicht jetzt» führen zu völlig verschiedenen Entscheiden.

## 7. Entscheidungsregel nach dem Test

| Bezahlte Aufträge | Entscheid |
|---|---|
| **0** | Angebot, Preis oder Zielgruppe überprüfen. Einwände auswerten: Liegt es am Preis, am Vertrauen, am Kanal oder an der Zielgruppe? Eine Sache ändern, nochmals 7 Tage. |
| **1–2** | Weiter testen, Erkenntnisse sammeln. Keine Entwicklung. |
| **3–5** | Automatisierung **analysieren** (Abschnitt 8), noch nicht bauen. |
| **5+** | Variante B bauen – beginnend mit dem Schritt, der am meisten Zeit spart. |

**Variante A (Selbstmacher-Tool):** wird nicht entwickelt. Sie steht nur als Frage auf der Website
(«Selbstmacher-Variante für rund CHF 79 – schreiben Sie uns»). Erst wenn mehrere Leute sagen «CHF 390 ist
mir zu teuer, ich mache es lieber selbst», testen wir sie – und auch dann erst mit einer Vorauszahlung,
nicht mit Code.

## 8. Automatisierung erst nach dem Beweis (ab 3–5 Aufträgen)

Für jeden Arbeitsschritt aus dem Tracker ausfüllen:

| Schritt | Ø Minuten | Häufigkeit | Fehlerquote | automatisierbar? | Zeitgewinn/Monat | Rang |
|---|---|---|---|---|---|---|
| Eingang bestätigen, Unterlagen sichten | | jeder Auftrag | | teilweise | | |
| Rückfragen an Kunden | | | | teilweise | | |
| Auslesen (extrahiere.py) | | | | ja | | |
| Rechnen + Prüfbericht (nk.py) | | | | ja (schon) | | |
| Sichtkontrolle | | | | nein (bewusst) | | |
| Lieferung + Erinnerung | | | | ja | | |

Automatisiert wird zuerst der Schritt mit dem grössten Zeitgewinn pro Monat – nicht der technisch
interessanteste.
