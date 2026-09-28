# Automatisierungslogik

Ziel: Bestellung → Zahlung → Lieferung → Follow-up laufen ohne manuellen Eingriff.
Persönlicher Aufwand pro Verkauf im Normalfall: 0 Minuten.

## Empfohlener Stack (kein eigenes Backend nötig)

1. **Landingpage** (`landingpage/index.html`) → Checkout-Button verlinkt auf
2. **Payhip** oder **Lemonsqueezy** (Merchant of Record)
   - übernimmt Zahlungsabwicklung (Kreditkarte, ggf. TWINT via Stripe-Anbindung)
   - übernimmt MWST-Ausweis/Rechnung automatisch
   - liefert die Datei automatisch per Download-Link nach Zahlung
   - hat eine eingebaute Autoresponder-Funktion für Follow-up-Mails (E-Mail A/B/C
     aus marketing/Follow-up-Upsell-E-Mails.md dort hinterlegen)
3. **optional: Zapier/Make**, falls mehr Automatisierung gewünscht ist
   (z. B. neuer Kunde → Zeile in Google Sheet für Tracking, siehe unten)

## Ablauf im Detail

| Schritt | Was passiert | Wer/was übernimmt es |
|---|---|---|
| Bestellung | Kunde klickt Kauf-Button auf Landingpage | 100% automatisch (Payhip-Checkout) |
| Zahlung | Kreditkarte/TWINT wird verarbeitet, Beleg erstellt | 100% automatisch (Payhip/Stripe) |
| Datenerfassung | keine nötig – Produkt ist generisch, keine Personalisierung | entfällt vollständig |
| Erstellung | Produkt existiert bereits als fertige Datei | entfällt vollständig (kein Pro-Bestellung-Aufwand) |
| Qualitätskontrolle | einmalig bei Erstellung geprüft | einmalig durch Sie, nicht pro Verkauf |
| Lieferung | Download-Link per E-Mail | 100% automatisch (Payhip) |
| Follow-up | Feedback-Mail Tag 5, Upsell-Mail Tag 14 | automatisch (Payhip-Autoresponder) |
| Support | Rückfragen per Antwort-Mail | manuell, aber selten (<15 Min/Woche erwartet) |
| Upsell | Update-Abo, Setup-Call, Cross-Sell | E-Mail automatisch, Buchung/Durchführung manuell |

## Tracking ohne Aufwand

Ein einfaches Google Sheet mit den Spalten: Datum, Kunde (falls bekannt), Kanal
(Landingpage/Outreach), Preis, Produkt. Payhip/Lemonsqueezy zeigen Verkäufe im
eigenen Dashboard an – ein zusätzliches Sheet ist nur nötig, wenn Sie auch die
Outreach-Kontakte tracken wollen (siehe marketing/Cold-Outreach-E-Mails.md).

## Was absichtlich NICHT automatisiert wird (Phase 1)

- Individuelle Anpassung pro Kunde (kein Personalisierungs-Angebot in Phase 1 –
  das wäre "Zeit gegen Geld tauschen" und widerspricht dem Ziel)
- Live-Chat/Support-Bot (unnötig bei einem Self-Service-Produkt ohne Einrichtung)
- Kaltakquise-Nachrichten (bewusst nicht automatisiert, da personalisierte
  Erstkontakte deutlich besser konvertieren als Massen-Mails – siehe
  marketing/Cold-Outreach-E-Mails.md)
