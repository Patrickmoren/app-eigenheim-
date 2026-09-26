# Prototyp – Vermietungspilot

**Zweck:** Klickbarer Gegenentwurf zu Fristenwächter, nachdem der ursprüngliche Vorschlag als
„nicht sexy" verworfen wurde, mit der Vorgabe, in der Immobilienbranche zu bleiben. Statt eines
passiven Fristen-Erinnerungs-Tools zeigt dieser Prototyp einen **KI-Agenten, der den
Wiedervermietungsprozess aktiv ausführt** statt nur daran zu erinnern.

## Ehrliche Einordnung der Konkurrenz

Dieser Markt ist deutlich enger besetzt als der von Fristenwächter:

- **Flatfox** (Schweiz) automatisiert bereits Bewerber-Kommunikation, Referenzprüfung und die
  Anbindung an Rimo R5.
- International sind **EliseAI, Leasey.AI, AppFolio AI Assistant, Vendoroo** etablierte
  KI-Leasing-Anbieter mit belegten Zeitersparnissen (10h → 1h pro Objekt laut Anbieterangaben).

Die verbleibende Lücke, auf der dieser Prototyp aufbaut: Diese Anbieter sind **All-in-one-
Plattformen**, die eine Migration verlangen. Die hier gezeigte Positionierung ist ein
**Copilot, der auf bestehenden Werkzeugen einer Verwaltung sitzt** (Flatfox, Rimo, GARAIO,
normales E-Mail) statt sie zu ersetzen, mit einstellbarem Autonomiegrad und für Schweizer
Spezifika (Betreibungsauszug, mehrsprachig). Ob das als eigenständiges Geschäftsmodell trägt,
ist damit noch nicht validiert – siehe Abschnitt „Nächste Schritte" unten.

`vermietungspilot.html` ist der lauffähige Klickdummy mit vier Beispiel-Fällen in
unterschiedlichen Prozessphasen.

Veröffentlicht als Artifact: https://claude.ai/artifact/Y5jCdoLMMeU6atfE7uhEXr

## Was er enthält

| Bereich | Umsetzung |
|---|---|
| Kennzahlenkopf | Automatisch erledigte Aktionen (mit grober Zeitersparnis-Schätzung), aktive Fälle, wartende Freigaben, Ø Tage bis Vermietung vs. Portfolio-Durchschnitt ohne Agent |
| Fallliste | Alle laufenden Wiedervermietungen mit Ampel-Status (sammelt Bewerbungen / screent & koordiniert / wartet auf Freigabe / vermietet) |
| Aktivitätsprotokoll | Chronologischer, per Akteur (Agent/System/Sie) unterschiedener Handlungsverlauf – zeigt was der Agent autonom erledigt hat, nicht nur was ansteht |
| Freigabe-Gate | Aktionen, die laut Autonomiestufe eine Freigabe brauchen, sind visuell hervorgehoben und mit „Freigeben & senden" direkt ausführbar |
| Kandidat:innen-Ranking | Erklärbarer KI-Score je Bewerber:in mit nachvollziehbarer Begründung (Einkommen, Betreibungen, Referenzen), automatisch archivierte Bewerbungen unterhalb der Schwelle werden gezählt statt versteckt |
| Autonomiegrad | Pro Fall einstellbar zwischen „volle Autonomie", „Terminkoordination automatisch" und „nur Vorschläge" – zentrales Vertrauens-/Kontroll-Feature bei autonomen Agenten |

## Interaktion zum Ausprobieren

- Fall „Marktgasse 5" öffnen (Status „wartet auf Freigabe") → **Freigeben & senden** klicken:
  Protokoll, Status und Kennzahlenkopf aktualisieren sich sofort.
- Fall „Seefeldstrasse 88" öffnen → bei S. Keller & J. Widmer **Termin bestätigen** klicken:
  neuer Protokolleintrag erscheint oben, Terminstatus wechselt auf bestätigt.
- Autonomiegrad eines Falls ändern: Erklärtext darunter passt sich sofort an.

## Designentscheidung

Bewusst andere Farbwelt (Violett/Indigo statt Fristenwächters Petrol) und ein Aktivitäts-Feed
statt Tabellen, um spürbar zu machen: Dies ist ein Agent, der handelt, kein Formular, das
verwaltet wird. Typografie und Grundkomponenten (Chips, Buttons, Panels) folgen weiterhin
demselben System wie `leerstandsmanager.html` und `fristenwaechter.html`.

## Technische Hinweise

- Eine Datei, keine Abhängigkeiten ausser Google Fonts. Artifact-Format (ohne `<!doctype>`,
  `<html>`, `<head>`, `<body>`). `./build-standalone.sh vermietungspilot.html
  Vermietungspilot.html` erzeugt die lokal öffenbare Version; sie wird nicht mitversioniert.
- Alle Protokoll-Zeitstempel sind relativ zum Ladezeitpunkt erzeugt, damit „vor 2 Std." /
  „vor 9 Tagen" an jedem Tag realistisch bleiben.
- Zustand ist rein clientseitig im Arbeitsspeicher – ein Neuladen setzt die Demodaten zurück.
- Score-Berechnung, Einkommens-/Betreibungsprüfung und Vertragserstellung sind in diesem
  Klickdummy **simuliert** (feste Beispielwerte), nicht real berechnet – das gehört in eine
  echte technische Umsetzung, nicht in den Prototyp.

## Bekannte Grenzen des Prototyps

Kein echter Datei-/E-Mail-Versand, keine echte Bonitätsprüfung, keine Portal-Anbindung
(Flatfox/Homegate), kein Login, kein Mandantenmodell. Diese Punkte – ebenso wie die noch
fehlende Validierung, ob Verwaltungen einem „Copilot auf bestehenden Tools" gegenüber einer
All-in-one-Plattform wie Flatfox tatsächlich den Vorzug geben – gehören in eine ernsthafte
Prüfung vor jeder Weiterentwicklung, nicht in den Klickdummy.
