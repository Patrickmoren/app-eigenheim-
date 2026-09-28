# Einrichtung: Anbieter und Anmeldung Schritt für Schritt

Ziel: alles, was für den ersten Verkauf nötig ist, für **rund CHF 10–15 im ersten Jahr** plus
Gebühren nur bei Zahlungseingang. Gesamtzeit etwa 75 Minuten. Preise geprüft am 28.09.2026.

## Die Auswahl

| Zweck | Anbieter | Kosten | Warum dieser |
|---|---|---|---|
| Domain + E-Mail | **Infomaniak** (Genf) | .ch-Domain ab ca. CHF 9/Jahr, **1 E-Mail-Adresse gratis** dabei | Schweizer Anbieter, Daten in der Schweiz – gut für die Datenschutzerklärung und das Vertrauen der Kundschaft; günstigster CH-Registrar |
| Website | **Netlify** | gratis, SSL inklusive | Hochladen per Drag-and-drop, eigene Domain kostenlos verknüpfbar |
| Bestellung + Zahlung | **Stripe** (Payment Links) | keine Grundgebühr; TWINT 1,9 % + CHF 0.30, Karte 2,9 % + CHF 0.30 | Bestellseite und Zahlung in einem, TWINT + Karte, kein Kundenkonto; bei CHF 390 per TWINT kostet eine Zahlung CHF 7.71 |
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

## Schritt 2 · Stripe: Bestell- und Zahlungsseite (30 Min., gratis)

Stripe ist gleichzeitig das Bestellformular – kein eigenes Formular, kein Kundenkonto nötig.

1. <https://dashboard.stripe.com/register> → Land **Schweiz**, E-Mail = die neue Adresse.
2. Geschäftsangaben: **Einzelunternehmen**, Branche «Professionelle Dienstleistungen», Website
   `https://nebenkosten-fixfertig.ch`, Beschreibung: «Erstellung von Heiz- und Nebenkostenabrechnungen
   für private Vermieter zum Fixpreis.» Identität und IBAN für Auszahlungen angeben.
3. **Einstellungen → Zahlungsmethoden:** TWINT und Karten aktivieren.
4. **Einstellungen → Öffentliche Angaben:** Abrechnungsbezeichnung «NEBENKOSTEN FIX», Support-E-Mail,
   **Nutzungsbedingungen-URL** `https://nebenkosten-fixfertig.ch/agb.html`,
   **Datenschutz-URL** `https://nebenkosten-fixfertig.ch/datenschutz.html`.
5. **Einstellungen → Kunden-E-Mails:** «Erfolgreiche Zahlungen» einschalten (automatische Bestätigung).
6. **Payment Links → + Neu**, zweimal:
   - Produkt «Nebenkostenabrechnung – bis 8 Wohnungen», **CHF 390**
   - Produkt «Nebenkostenabrechnung – 9 bis 12 Wohnungen», **CHF 490**

   Bei beiden Links:
   - Menge anpassbar: **aus**
   - Kundenangaben erfassen: **Name, E-Mail, Telefonnummer, Rechnungsadresse**
   - **Benutzerdefinierte Felder** (max. 3):
     1. «Adresse der Liegenschaft» – Text, Pflicht
     2. «Abrechnungsperiode endet am» – Auswahl: 30.06.2026 / 31.12.2025 / anderes Datum
     3. «Wie haben Sie von uns erfahren?» – Text, optional (für die Messung)
   - **Zustimmung zu den Nutzungsbedingungen verlangen: an**
   - Promotion-Codes zulassen: an
   - **Nach der Zahlung: Weiterleitung** auf `https://nebenkosten-fixfertig.ch/unterlagen.html`
7. **Produkte → Gutscheine:** «PARTNER60» (CHF 60, für Kunden von Treuhändern, die Rabatt statt Provision
   wählen). Weitere Rabatte gibt es nicht.
8. Die zwei Links (`https://buy.stripe.com/…`) in `landingpage/config.json` bei `STRIPE_390` und
   `STRIPE_490` eintragen.
9. Zwei-Faktor-Anmeldung einschalten.

Freischaltung dauert bei Stripe manchmal 1–2 Tage. Bis dahin: QR-Rechnung.

## Schritt 3 · Netlify: Website online (15 Min., gratis)

Diesen Schritt mache ich mit dir, sobald ich die Angaben unten habe und das ZIP gebaut ist.

1. <https://app.netlify.com/drop> → ZIP `nebenkosten-website.zip` hineinziehen → Konto erstellen.
2. **Domain management → Add a domain** → `nebenkosten-fixfertig.ch`.
3. Netlify zeigt DNS-Einträge. Bei Infomaniak unter **Domain → DNS-Zone** eintragen:
   - `A`-Eintrag für `nebenkosten-fixfertig.ch` → `75.2.60.5`
   - `CNAME`-Eintrag für `www` → `<dein-name>.netlify.app`

   **Die MX-Einträge für die E-Mail nicht anfassen**, sonst geht die Mail nicht mehr.
4. Nach 15–60 Minuten erstellt Netlify das SSL-Zertifikat automatisch. Fertig.

## Schritt 4 · Claude API für Kundenbelege (10 Min., ca. CHF 5 Guthaben)

Echte Kundenunterlagen laufen **nicht** über ein privates claude.ai-Konto, sondern über die API
(kommerzielle Bedingungen: keine Verwendung zum Training, Auftragsbearbeitung geregelt). So stimmt die
Datenschutzerklärung.

1. <https://console.anthropic.com> → Konto mit der neuen Adresse, Zwei-Faktor-Anmeldung einschalten.
2. **Billing:** USD 10 Guthaben laden, automatisches Nachladen **aus** (Kostendeckel).
   Ein Auftrag kostet erfahrungsgemäss unter CHF 1.
3. **API Keys → Create Key** «nebenkosten». Den Schlüssel nur lokal speichern:
   `export ANTHROPIC_API_KEY=…` in deiner Shell-Konfiguration – nie ins Repository, nie per Mail.
4. `pip install anthropic` · Test: `python3 geldstrom/engine/extrahiere.py kunden/test --trocken`.

## Schritt 5 · Sicherheit (10 Min., einmalig)

- Laptop-Verschlüsselung an (Mac: FileVault, Windows: BitLocker/Geräteverschlüsselung).
- Zwei-Faktor-Anmeldung bei Infomaniak, Netlify, Stripe, Anthropic.
- Kundenordner (`kunden/`) nur lokal, nicht in geteilten Cloud-Ordnern; das Repository ignoriert ihn.
- Kein Arbeitgeber-Gerät, keine Arbeitgeber-Vorlagen, keine Arbeit während der Arbeitszeit.

---

## Go-live-Checkliste (nach dem Aufschalten, 20 Min.)

1. `python3 geldstrom/landingpage/golive_check.py https://nebenkosten-fixfertig.ch` → «bereit für Go-live».
2. Testbestellung: Payment Link im **Testmodus** von Stripe durchspielen → Zahlungsbeleg kommt,
   Weiterleitung auf die Unterlagen-Seite funktioniert, Bestellangaben sind im Stripe-Dashboard sichtbar?
3. Auf der Unterlagen-Seite «Unterlagen per E-Mail senden» klicken → E-Mail kommt im Postfach an?
4. Seite auf dem Handy öffnen: Button, Preis, Impressum, Datenschutz, Beispiel-PDF.
5. Link per WhatsApp an dich selbst schicken → Vorschaubild erscheint?
7. Erst dann: Google Ads starten und Treuhänder-E-Mails senden.

## Das brauche ich danach von dir

```
Adresse fürs Impressum:  Strasse Nr, PLZ Ort
Telefon:                 079 …
E-Mail:                  abrechnung@nebenkosten-fixfertig.ch   (falls anders: welche)
Stripe-Link CHF 390:     https://buy.stripe.com/…
Stripe-Link CHF 490:     https://buy.stripe.com/…
Domain:                  nebenkosten-fixfertig.ch              (falls anders: welche)
```

Dann baue ich das ZIP, prüfe es und schicke es dir zum Hochladen.

## Laufende Kosten

| | Jahr 1 | danach |
|---|---|---|
| Domain inkl. E-Mail | ca. CHF 9–13 | ca. CHF 13/Jahr |
| Hosting, Stripe-Konto | 0 | 0 |
| Pro Auftrag (TWINT, CHF 390) | CHF 7.71 | CHF 7.71 |
| Claude API pro Auftrag | unter CHF 1 | unter CHF 1 |
| Google Ads Testwoche | CHF 140 (einmalig, optional) | nach Ergebnis |
