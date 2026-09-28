# Einrichtung: Anbieter und Anmeldung Schritt für Schritt

Ziel: alles, was für den ersten Verkauf nötig ist, für **rund CHF 10–15 im ersten Jahr** plus
Gebühren nur bei Zahlungseingang. Gesamtzeit etwa 75 Minuten. Preise geprüft am 28.09.2026.

## Die Auswahl

| Zweck | Anbieter | Kosten | Warum dieser |
|---|---|---|---|
| Domain + E-Mail | **Infomaniak** (Genf) | .ch-Domain ab ca. CHF 9/Jahr, **1 E-Mail-Adresse gratis** dabei | Schweizer Anbieter, Daten in der Schweiz – gut für die Datenschutzerklärung und das Vertrauen der Kundschaft; günstigster CH-Registrar |
| Website | **Netlify** | gratis, SSL inklusive | Hochladen per Drag-and-drop, eigene Domain kostenlos verknüpfbar |
| Bestellformular | **Formspree** | gratis bis 50 Einsendungen/Monat | kein Code nötig, leitet jede Bestellung an deine E-Mail weiter |
| Zahlung | **Stripe** (Payment Links) | keine Grundgebühr; TWINT 1,9 % + CHF 0.30, Karte 2,9 % + CHF 0.30 | TWINT + Karte ohne Monatsgebühr; bei CHF 290 per TWINT kostet eine Zahlung CHF 5.81 |
| Zahlung ohne Gebühr | **QR-Rechnung** aus deinem E-Banking | gratis | Rückfallebene für Kundschaft, die lieber per Rechnung zahlt |

Bewusst **nicht** gewählt: Payrexx/Wallee (Monatsgebühr lohnt erst bei Volumen), SumUp (kein TWINT
bei Zahlungslinks), Wix/Squarespace (CHF 15–30/Monat für etwas, das gratis geht), Gmail
(Daten in den USA, wirkt weniger professionell als eine eigene Adresse).

**Name:** `nebenkosten-fixfertig.ch` war bei der Prüfung in der .ch-Registry nicht registriert.
Das ist keine Garantie – bei der Bestellung siehst du sofort, ob sie noch frei ist. Ausweichnamen:
`nk-fixfertig.ch`, `nebenkostenfixfertig.ch`.

## Warum ich dich nicht selbst anmelden kann

Jede dieser Anmeldungen verlangt deine Identität: E-Mail- oder SMS-Bestätigung, bei Stripe
zusätzlich Ausweis, AHV-Nummer bzw. Geburtsdatum und dein Bankkonto für die Auszahlung.
Das darf und kann nur die Person tun, der das Konto gehört. Alles andere ist vorbereitet –
nach den Anmeldungen schickst du mir die Angaben unten, und ich baue die fertige Website.

---

## Schritt 1 · Infomaniak: Domain + E-Mail (20 Min., ca. CHF 9)

1. <https://www.infomaniak.com/de/domains> öffnen, `nebenkosten-fixfertig.ch` suchen.
2. In den Warenkorb, **nur die Domain** bestellen. Zusatzangebote (Hosting, kSuite-Abo,
   Datenschutz-Option) ablehnen – die Gratis-Adresse ist bei der Domain dabei.
3. Konto erstellen (Inhaber: dein Name, Privatadresse), mit TWINT oder Karte bezahlen.
4. Im Manager: **Mail → Adresse erstellen** → `abrechnung@nebenkosten-fixfertig.ch`.
5. Mail in der Infomaniak-App (Handy) oder in deinem Mailprogramm einrichten.
   Test: eine Mail von deiner privaten Adresse an die neue senden und antworten.

## Schritt 2 · Formspree: Bestellformular (5 Min., gratis)

1. <https://formspree.io> → **Sign up** mit `abrechnung@nebenkosten-fixfertig.ch`, Adresse bestätigen.
2. **+ New Form** → Name «Bestellung» → Formular-E-Mail = dieselbe Adresse.
3. Die angezeigte Adresse kopieren, sie sieht so aus: `https://formspree.io/f/abcdwxyz`.
4. Konto → **Two-Factor Authentication** einschalten.
5. Monatlich die Einträge unter «Submissions» löschen (die Datenschutzerklärung sagt: spätestens nach 30 Tagen).

## Schritt 3 · Stripe: Zahlungslinks (25 Min., gratis)

1. <https://dashboard.stripe.com/register> → Land **Schweiz**, E-Mail = die neue Adresse.
2. Geschäftsangaben: **Einzelunternehmen**, Branche «Professionelle Dienstleistungen /
   Buchhaltung», Website `https://nebenkosten-fixfertig.ch`, Produktbeschreibung:
   «Erstellung von Heiz- und Nebenkostenabrechnungen für private Vermieter zum Fixpreis.»
3. Identität und Bankkonto (IBAN für Auszahlungen) angeben.
4. **Einstellungen → Zahlungsmethoden:** TWINT aktivieren.
5. **Payment Links → + Neu**, viermal:
   - «Nebenkostenabrechnung 1–4 Wohnungen» – CHF 290
   - «Nebenkostenabrechnung 5–8 Wohnungen» – CHF 390
   - «Nebenkostenabrechnung 9–12 Wohnungen» – CHF 490
   - «Express-Zuschlag» – CHF 90

   Jeweils: «Kunden können Menge anpassen» aus, «Rechnungsadresse erfassen» an,
   **«Promotion-Codes zulassen» an**.
   Nach der Zahlung: Bestätigungsseite mit Text «Danke! Sie erhalten Ihre Abrechnungen innert
   eines Arbeitstags per E-Mail.»
6. **Produkte → Gutscheine:** «PARTNER60» (CHF 60 Rabatt, einmal je Kunde – für Treuhänder, die den
   Rabatt statt der Provision wählen) und «STAMM40» (CHF 40 Rabatt für Stammkunden).
7. **Einstellungen → Kunden-E-Mails:** «Erfolgreiche Zahlungen» einschalten – Stripe schickt dann
   automatisch einen Zahlungsbeleg (gilt zugleich als elektronische Bestätigung, Art. 3 Abs. 1 lit. s UWG).
8. **Einstellungen → Öffentliche Angaben:** Abrechnungsbezeichnung «NEBENKOSTEN FIX», Support-E-Mail
   = neue Adresse, Links auf `…/agb.html` (Bedingungen) und `…/datenschutz.html`.
9. Zwei-Faktor-Anmeldung einschalten (Stripe verlangt es ohnehin).
10. Die Links in `verkauf/zahlungslinks.txt` notieren (nicht ins Repository – ist ignoriert).

Freischaltung dauert bei Stripe manchmal 1–2 Tage. Bis dahin: QR-Rechnung.

## Schritt 4 · Netlify: Website online (15 Min., gratis)

Diesen Schritt mache ich mit dir, sobald ich die Angaben unten habe und das ZIP gebaut ist.

1. <https://app.netlify.com/drop> → ZIP `nebenkosten-website.zip` hineinziehen → Konto erstellen.
2. **Domain management → Add a domain** → `nebenkosten-fixfertig.ch`.
3. Netlify zeigt DNS-Einträge. Bei Infomaniak unter **Domain → DNS-Zone** eintragen:
   - `A`-Eintrag für `nebenkosten-fixfertig.ch` → `75.2.60.5`
   - `CNAME`-Eintrag für `www` → `<dein-name>.netlify.app`

   **Die MX-Einträge für die E-Mail nicht anfassen**, sonst geht die Mail nicht mehr.
4. Nach 15–60 Minuten erstellt Netlify das SSL-Zertifikat automatisch. Fertig.

## Schritt 5 · Claude API für Kundenbelege (10 Min., ca. CHF 5 Guthaben)

Echte Kundenunterlagen laufen **nicht** über ein privates claude.ai-Konto, sondern über die API
(kommerzielle Bedingungen: keine Verwendung zum Training, Auftragsbearbeitung geregelt). So stimmt die
Datenschutzerklärung.

1. <https://console.anthropic.com> → Konto mit der neuen Adresse, Zwei-Faktor-Anmeldung einschalten.
2. **Billing:** USD 10 Guthaben laden, automatisches Nachladen **aus** (Kostendeckel).
   Ein Auftrag kostet erfahrungsgemäss unter CHF 1.
3. **API Keys → Create Key** «nebenkosten». Den Schlüssel nur lokal speichern:
   `export ANTHROPIC_API_KEY=…` in deiner Shell-Konfiguration – nie ins Repository, nie per Mail.
4. `pip install anthropic` · Test: `python3 geldstrom/engine/extrahiere.py kunden/test --trocken`.

## Schritt 6 · Sicherheit (10 Min., einmalig)

- Laptop-Verschlüsselung an (Mac: FileVault, Windows: BitLocker/Geräteverschlüsselung).
- Zwei-Faktor-Anmeldung bei Infomaniak, Netlify, Formspree, Stripe, Anthropic.
- Kundenordner (`kunden/`) nur lokal, nicht in geteilten Cloud-Ordnern; das Repository ignoriert ihn.
- Kein Arbeitgeber-Gerät, keine Arbeitgeber-Vorlagen, keine Arbeit während der Arbeitszeit.

---

## Go-live-Checkliste (nach dem Aufschalten, 20 Min.)

1. `python3 geldstrom/landingpage/golive_check.py https://nebenkosten-fixfertig.ch` → «bereit für Go-live».
2. Testanfrage über das Formular mit deiner privaten Adresse → kommt im Postfach an?
3. Testzahlung: Payment Link im **Testmodus** von Stripe durchspielen → Zahlungsbeleg kommt?
4. Seite auf dem Handy öffnen: Formular, Impressum, Datenschutz, Beispiel-PDF.
5. Link per WhatsApp an dich selbst schicken → Vorschaubild erscheint?
6. Formspree-Testeintrag löschen.
7. Erst dann: Google Ads starten und Treuhänder-E-Mails senden.

## Das brauche ich danach von dir

```
Adresse fürs Impressum:  Strasse Nr, PLZ Ort
Telefon:                 079 …
E-Mail:                  abrechnung@nebenkosten-fixfertig.ch   (falls anders: welche)
Formspree-Adresse:       https://formspree.io/f/…
Domain:                  nebenkosten-fixfertig.ch              (falls anders: welche)
```

Dann baue ich das ZIP, prüfe es und schicke es dir zum Hochladen.

## Laufende Kosten

| | Jahr 1 | danach |
|---|---|---|
| Domain inkl. E-Mail | ca. CHF 9–13 | ca. CHF 13/Jahr |
| Hosting, Formular, Stripe-Konto | 0 | 0 |
| Pro Auftrag (TWINT, CHF 290) | CHF 5.81 | CHF 5.81 |
| Claude API pro Auftrag | unter CHF 1 | unter CHF 1 |
| Google Ads Testwoche | CHF 140 (einmalig, optional) | nach Ergebnis |
