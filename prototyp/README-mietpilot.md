# Prototyp – Mietpilot

**Zweck:** Zielgruppen-Pivot von Vermietungspilot (professionelle Verwaltungen) auf **private
Eigentümer** (1–5 Wohnungen), nach der Rückmeldung, dass genau diese Zielgruppe „supercool"
wäre. Anderer Kunde, anderes Nutzungsmuster, andere Seite:

- Eine professionelle Verwaltung nutzt so ein Tool täglich über viele Objekte → Dashboard.
- Ein:e private:r Eigentümer:in vermietet vielleicht alle paar Jahre eine Wohnung → braucht
  kein Dashboard, sondern eine vertrauensbildende Landingpage, die in unter einer Minute
  erklärt, was passiert, was es kostet, und dann live zeigt, wie es sich anfühlt.

`mietpilot.html` ist eine kombinierte Landingpage + interaktive Live-Demo (kein Dashboard).

Veröffentlicht als Artifact: https://claude.ai/artifact/LsJ32GX6zVnRGBNEg4nJ8e

## Ehrliche Einordnung: Preis, Markt, Geschäftsmodell-Konsequenz

**Preisanker aus der Recherche:** Ein professioneller Vermietungsservice für private
Eigentümer kostet in der Schweiz marktüblich 1–1.5 Bruttomonatsmieten (Beispiel properti:
1.5 Monatsmieten, mind. CHF 3'000). Der Prototyp positioniert Mietpilot bewusst als
Bruchteil davon (CHF 890 pauschal) – „gleiches Ergebnis, KI-gestützt statt Mensch-getrieben,
ein Drittel des Preises".

**Konkurrenz existiert bereits** (properti, propertyowner.ch/Grundeigentümerverband-Services,
klassische Makler/Verwaltungen mit Vermietungsservice) – das ist kein weisser Fleck wie bei
Fristenwächter. Die Differenzierung ist der AI-getriebene Geschwindigkeits-/Kostenvorteil,
nicht ein unbesetzter Markt.

**Wichtige Konsequenz fürs Geschäftsmodell:** Private Eigentümer vermieten selten – ein
monatliches SaaS-Abo passt nicht zu diesem Nutzungsmuster. Das Modell kippt von
wiederkehrendem Abo-Umsatz (Vermietungspilot-Ansatz) zu **Erfolgshonorar pro Vermietung**.
Auf Firmenebene bleibt der Umsatz trotzdem wiederkehrend, weil laufend neue Fälle in die
Pipeline kommen – aber das ist ein strukturell anderes Geschäftsmodell (transaktional statt
Abo) und müsste als solches separat durchgerechnet werden (CAC pro Fall, Konversionsrate
Anmeldung → erfolgreiche Vermietung, Marketingkosten für ein Produkt mit seltenem
Wiederkauf pro Kund:in).

## Was er enthält

| Bereich | Umsetzung |
|---|---|
| Hero | Kernversprechen + Preisvergleich (durchgestrichener Maklerpreis vs. Mietpilot-Pauschale) |
| So funktioniert's | 4 Schritte, in Alltagssprache statt Fachbegriffen |
| Live-Demo | Ein Beispielfall wird auf Klick schrittweise „live" durchgespielt: Exposé erstellt, Bewerbungen geprüft, automatisch aussortiert, Empfehlungen bereit |
| Kandidat:innen-Auswahl | 3 Karten in Alltagssprache statt kaltem Score – Eigentümer:in trifft die letzte Entscheidung |
| Abschluss | Bestätigung mit Preis, klar erst fällig bei Vertragsunterschrift |
| Vertrauensblock | Drei kurze Einwand-Entkräftungen (nur bei Erfolg, Sie entscheiden, Schweizer Prüfkriterien) |

## Designentscheidung

Dritte, wieder bewusst andere Farbwelt (warmes Waldgrün + Terracotta-Orange als CTA-Akzent)
neben Fristenwächters Petrol und Vermietungspilots Violett – hier passend zu einer
Vertrauens-/Konsumenten-Positionierung statt eines operativen Werkzeugs. Gleiche
Typografie-Familie (Archivo/Source Sans 3/IBM Plex Mono) wie die übrigen Prototypen dieses
Ordners, damit die Produktfamilie trotzdem als zusammengehörig erkennbar bleibt.

## Technische Hinweise

- Eine Datei, keine Abhängigkeiten ausser Google Fonts. Artifact-Format; `./build-standalone.sh
  mietpilot.html Mietpilot.html` erzeugt die lokal öffenbare Version (nicht mitversioniert).
- Die Live-Demo läuft rein clientseitig mit gestaffelten `setTimeout`-Aufrufen, keine echten
  Daten, kein Server, kein Formular-Versand.
- Zahlen (24 Bewerbungen, Score-Begründungen, Preisvergleich) sind feste Demo-Werte.

## Bekannte Grenzen des Prototyps

Kein echtes Anmeldeformular, keine echte Adressprüfung, keine Zahlungsabwicklung, keine
Portal-Integrationen. Vor jeder Weiterentwicklung offen: ob genug private Eigentümer:innen
bereit sind, einer KI (statt einem Menschen) die Bewerberauswahl anzuvertrauen – das ist eine
Vertrauensfrage, die sich nur mit echten Gesprächen klären lässt, nicht mit einem Klickdummy.
