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

   Jeweils: «Kunden können Menge anpassen» aus, «Rechnungsadresse erfassen» an.
   Nach der Zahlung: Bestätigungsseite mit Text «Danke! Sie erhalten Ihre Abrechnungen innert
   eines Arbeitstags per E-Mail.»
6. Die vier Links in `verkauf/zahlungslinks.txt` notieren (nicht ins Repository – ist ignoriert).

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

## Schritt 5 · Datenschutz bei Claude (2 Min.)

claude.ai → Einstellungen → Datenschutz → Verwendung der Chats zur Modellverbesserung
**ausschalten**. Die Datenschutzerklärung sagt der Kundschaft das zu.

---

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
| Google Ads Testwoche | CHF 140 (einmalig, optional) | nach Ergebnis |
