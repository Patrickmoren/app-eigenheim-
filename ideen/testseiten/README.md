# Nachfragetest: drei Seiten, zwei Wochen, unter CHF 200

| Seite | Markt | Modell | Preis auf der Seite |
|---|---|---|---|
| `site/weg/` | Deutschland | Selbstverwaltung Wohnungseigentümergemeinschaft (Vorbild PayHOA) | 1,50 € pro Einheit/Monat, mind. 12 € |
| `site/stwe/` | Schweiz | dasselbe für Stockwerkeigentum | CHF 2 pro Einheit/Monat, mind. CHF 15 |
| `site/uk/` | England/Wales | KI-Inventarbericht für Vermieter | £15 pro Bericht |

Begründung der Auswahl: [../us-marktscan.md](../us-marktscan.md).

## Vor dem Veröffentlichen (15 Minuten, nur du)

1. **Impressum ausfüllen:** In `inhalte.py` die Platzhalter `[Vorname Name]`, `[Strasse Nr.]`,
   `[PLZ Ort]`, `[adresse]` und `[email]` ersetzen, dann `python3 build.py`. Für Seiten, die sich an
   Deutschland richten, ist ein Impressum Pflicht.
2. **Schweizer Seite:** erst veröffentlichen, wenn geklärt ist, dass dein Arbeitgeber nichts dagegen
   hat. Die deutsche und die englische Seite berühren seinen Markt nicht.
3. **Namen prüfen:** «Hausrunde» und «Walkround» auf freie Domains prüfen. Für den Test reicht die
   kostenlose Netlify-Adresse.

## Veröffentlichen (kostenlos)

1. Konto bei [Netlify](https://app.netlify.com/signup) eröffnen.
2. Den Ordner `site/` auf [app.netlify.com/drop](https://app.netlify.com/drop) ziehen.
3. Die Formulare werden von Netlify automatisch erkannt (`data-netlify="true"`); Einträge erscheinen
   unter «Forms». Die Gratisstufe reicht für den Test (Kontingent bei Netlify prüfen).

## Besucher holen

**Budget:** CHF 50 Google-Anzeigen je Seite, zwei Wochen (total CHF 150), dazu Beiträge in Foren.

| Seite | Suchbegriffe (Wortgruppe) | Anzeigentitel | Foren |
|---|---|---|---|
| WEG | «weg selbst verwalten», «weg ohne verwalter», «hausgeldabrechnung selbst erstellen», «wirtschaftsplan weg vorlage» | «WEG selbst verwalten – einfach» · «Hausgeld & Abrechnung per App» | Facebook-Gruppen WEG/Eigentümer, wohnen-im-eigentum.de Forum |
| STWE | «stockwerkeigentum selbst verwalten», «stwe ohne verwaltung», «erneuerungsfonds berechnen» | «Stockwerkeigentum selbst verwalten» · «Budget & Wertquoten per App» | Facebook-Gruppen Stockwerkeigentum, HEV-Foren |
| UK | «landlord inventory», «check in inventory template», «inventory report cost» | «Inventory Report for £15» · «AI Inventory in 15 Minutes» | r/LandlordUK, Property Tribes |

Keine Kalt-E-Mails (UWG, DSGVO). Beiträge in Foren nur, wo Eigenwerbung erlaubt ist, und offen als
Gründer/in auftreten.

## Auswerten nach 14 Tagen

| Kennzahl | Quelle | Schwelle zum Weitermachen |
|---|---|---|
| Besucher | Netlify Analytics oder Google Ads | mindestens 150 pro Seite, sonst Ergebnis nicht aussagekräftig |
| Eintragungen ÷ Besucher | Netlify Forms | **≥ 5 %** |
| Kosten je Eintragung | Google Ads ÷ Eintragungen | ≤ CHF 10 |
| Angegebene Einheiten | Formularfeld | Mittelwert zeigt, ob der Preis trägt |

Gebaut wird die Seite mit der besten Quote über der Schwelle. Liegt keine darüber, war die Idee
nicht gut genug, und das hat CHF 150 statt Monate gekostet.

## Beispielzahlen auf den Seiten (nachgerechnet)

- **WEG:** 24'000 € + 6'000 € = 30'000 € pro Jahr, ÷ 12 = 2'500 € pro Monat; 180/1000 → 450 €,
  140 → 350 €, 220 → 550 €, 160 → 400 €. Summe 450 + 350 + 350 + 550 + 400 + 400 = 2'500 €.
- **STWE:** CHF 27'000 + 9'000 = 36'000 pro Jahr, ÷ 4 = 9'000 pro Quartal; 250 ‰ → 2'250,
  200 ‰ → 1'800, 180 ‰ → 1'620, 170 ‰ → 1'530. Summe 9'000.
- **UK:** 34 + 21 + 18 + 16 = 89 Positionen, 1 + 0 + 2 + 1 = 4 Änderungen.
