# BewirtschaftungsKit

Digitales Vorlagenpaket "Leerstandsmanagement & Mieterwechsel" für kleine
Schweizer Immobilienverwaltungen, selbstständige Hausverwalter und
STWEG-Verwalter. Einmalige Zahlung, automatisierte Lieferung, kein laufender
Betreuungsaufwand für Sie als Anbieter.

Entstanden aus der Analyse "zusätzliches Einkommen mit minimalem laufenden
Aufwand" – vollständige Begründung, Alternativen und Wirtschaftlichkeits-
rechnung siehe Chat-Antwort in dieser Session.

**Wichtig:** Dies ist ein bewusst neu und generisch aufgebautes Produkt für
den externen Verkauf – unabhängig von den firmeninternen Dateien in
`excel/`, `docs/` und `prototyp/` dieses Repos. Firmeneigene/proprietäre
Inhalte wurden nicht übernommen.

## Struktur

```
landingpage/index.html          Verkaufsseite (Platzhalter-Checkout-Link ersetzen)
vorlagen/
  build_leerstandsliste.py      Skript zum (Neu-)Erzeugen der Excel-Vorlage
  Leerstandsliste-und-Fristenplan-Vorlage.xlsx   das eigentliche Produkt
  Checkliste-Mieterwechsel.md   Checkliste, vor Verkauf als PDF exportieren
prompts/
  KI-Prompt-Bibliothek.md       Bonus-Material für Kunden
marketing/
  Cold-Outreach-E-Mails.md      Vorlagen + Vorgehen für die ersten Kontakte
  Follow-up-Upsell-E-Mails.md   automatisierte Post-Sale-Mails
automation/
  Automatisierungslogik.md      Bestellung → Zahlung → Lieferung, Schritt für Schritt
PREISSTRUKTUR.md
7-TAGE-PLAN.md                  konkreter Testplan für die erste Verkaufswoche
```

## Nächste Schritte (siehe 7-TAGE-PLAN.md für Details)

1. Excel-Vorlage einmal selbst durchklicken/testen
2. Payhip- oder Lemonsqueezy-Konto einrichten, Produkt hochladen
3. Checkout-Link in `landingpage/index.html` einsetzen
4. Landingpage hosten (GitHub Pages, Carrd, oder Payhip-eigene Produktseite)
5. Zielgruppenliste erstellen und Erstkontakte versenden

## Status

- [x] Excel-Vorlage (Leerstandsliste + Fristenrechner) erstellt und geprüft
- [x] Checkliste Mieterwechsel erstellt
- [x] Landingpage erstellt
- [x] KI-Prompt-Bibliothek erstellt
- [x] Outreach- und Follow-up-Texte erstellt
- [ ] Payhip/Lemonsqueezy-Konto eingerichtet (persönlicher Schritt)
- [ ] Landingpage live gehostet (persönlicher Schritt)
- [ ] erste Kontakte versendet (persönlicher Schritt)
