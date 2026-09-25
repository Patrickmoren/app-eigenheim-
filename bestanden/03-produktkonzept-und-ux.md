# 03 · Produktkonzept und UX

## 1. Für wen wir bauen

In den Berufen mit tiefer Erfolgsquote haben **68 %** der Lernenden die Sekundarstufe I mit
Grundanforderungen besucht, **30 %** haben keinen Schweizer Pass, **87 %** sind Männer
(EHB 2024, Tabelle zu Abb. 10). Daraus folgen die Regeln für das Produkt:

| Regel | Umsetzung |
|---|---|
| Einfache Sprache | Sätze unter 15 Wörtern, Fachwörter nur wenn prüfungsrelevant, dann mit Erklärung |
| Bilder vor Text | Bauteile, Schemas und Situationen als Bild; Text dazu kurz |
| Vorlesen | jede Aufgabe per Knopf vorlesbar (Sprachausgabe des Geräts) |
| Gut lesbare Schrift | Atkinson Hyperlegible (für Menschen mit Sehschwäche entwickelt, Buchstaben gut unterscheidbar), grosse Tippflächen |
| Kurz | 10 Minuten am Tag, jede Aufgabe unter 60 Sekunden, ausser Fachgespräch |
| Kein Beschämen | Fehler sind «noch nicht sicher», keine roten Kreuze über ganzen Seiten, keine Ranglisten mit Namen |
| Handy zuerst | Web-App, die sich wie eine App auf den Startbildschirm legen lässt (PWA), funktioniert auch bei schlechtem Netz auf der Baustelle |

## 2. User Journeys

### Luca, 17, Sanitär EFZ im 3. Lehrjahr
1. **Einladung:** Sein Chef hat eine Lizenz gekauft. Luca bekommt eine SMS mit Link und Betriebscode.
2. **Start (2 Minuten):** Beruf und Lehrjahr sind vorausgefüllt. Er wählt, was sein Chef sehen darf
   (Standard: Trainingszeit und Themenstand, nie einzelne Antworten).
3. **Einstufung (5 Minuten):** 12 Aufgaben quer durch die Handlungskompetenzbereiche.
4. **Alltag:** Jeden Morgen um 06:45 im Zug eine Erinnerung: «Dein heutiges Training · 10 Minuten».
   Aufgaben kommen aus seinen Schwächen und aus dem Stoff, der im Semester fällig ist.
5. **Vor dem Semester-Test:** «In 9 Tagen: Prüfung Entsorgungsleitungen». Ein Knopf startet das Paket dazu.
6. **Fachgespräch:** Einmal pro Woche 5 Minuten: Die KI zeigt ein Foto einer Installation und fragt:
   «Warum hast du hier dieses Gefälle gewählt?» Luca tippt (später: spricht) die Antwort. Die KI fragt nach
   und zeigt am Ende, welche Punkte des Bewertungsrasters er getroffen hat.
7. **Stand:** «QV-READY Berufskenntnisse: 64 von 100» mit dem Hinweis: «Das ist dein Trainingsstand in der App,
   keine Note und keine Prognose. Die praktische Arbeit ist hier nicht enthalten.»

### Frau Brunner, 48, Inhaberin einer Sanitärfirma mit 14 Angestellten und 3 Lernenden
1. **Kontakt:** Ein Anruf oder Besuch; 15 Minuten Demo auf dem Handy.
2. **Test:** 30 Tage gratis für alle 3 Lernenden. Rechnung erst danach.
3. **Montag, 5 Minuten:** Eine E-Mail: «Lara: 48 Min. trainiert, sicher in Trinkwasser. Noah: seit 9 Tagen
   nicht aktiv. Tipp: kurz nachfragen.»
4. **Gespräch mit Noah:** Sie sieht, dass «Entsorgungsleitungen» schwach ist, nicht welche Fragen er falsch hatte.
5. **Verlängerung:** Rechnung per QR-Rechnung im August, zum neuen Lehrjahr.

### suissetec (Verband), später
1. Sieht **anonyme** Auswertungen ab 10 Lernenden je Gruppe: welche Themen schweizweit am schwächsten sind.
2. Nutzt «bestanden» als Verbandsangebot mit eigenem Logo und rabattiert es für Mitglieder.

## 3. Zentrale Bildschirme

### 3.1 Start (Lernende)
```
┌───────────────────────────────────┐
│ Guten Morgen, Luca        🔥 12   │  ← Tage in Folge (freiwillig ausblendbar)
│                                   │
│ DEIN HEUTIGES TRAINING            │
│ 10 Minuten                        │
│ ┌───────────────────────────────┐ │
│ │ 8 Aufgaben · 1 Fachgespräch   │ │
│ │ Schwerpunkt: Entsorgung       │ │
│ │        [ Los geht's ]         │ │
│ └───────────────────────────────┘ │
│                                   │
│ In 9 Tagen: Semester-Test         │
│ Entsorgungsleitungen  [Üben →]    │
│                                   │
│ QV-READY Berufskenntnisse   64    │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░  Trainings-   │
│                       stand       │
├───────────────────────────────────┤
│ Heute   Themen   Fachgespräch  Ich│
└───────────────────────────────────┘
```

### 3.2 Aufgabe und Rückmeldung
```
┌───────────────────────────────────┐
│ 3 / 8                     🔊  ✕   │
│ [Bild: Anschluss WC an Fallstrang]│
│                                   │
│ Welches Mindestgefälle braucht    │
│ diese Anschlussleitung?           │
│  ( ) 0,5 %   ( ) 1 %              │
│  ( ) 2 %     ( ) 5 %              │
│               [ Prüfen ]          │
└───────────────────────────────────┘
Nach dem Prüfen:
  ✓ Richtig  –  oder  –  Noch nicht sicher
  Erklärung in 2–3 Sätzen + Verweis auf das Thema im Bildungsplan
  [Fehler melden]  [Weiter]
```
(Die Fragen im Beispiel sind Platzhalter. Jede echte Aufgabe prüft die Fachperson, siehe 06-content-system.md.)

### 3.3 Fachgespräch
```
┌───────────────────────────────────┐
│ Fachgespräch · Übung 4            │
│ [Foto: Vorwandinstallation]       │
│ Expertin: «Erklär mir, in welcher │
│ Reihenfolge du hier vorgegangen   │
│ bist und warum.»                  │
│ ┌───────────────────────────────┐ │
│ │ Deine Antwort …               │ │
│ └───────────────────────────────┘ │
│ [🎤 später]            [Senden]   │
└───────────────────────────────────┘
Danach: 1–2 Nachfragen, dann Auswertung:
  Getroffen: Reihenfolge ✓  Befestigung ✓
  Fehlt noch: Druckprüfung erwähnen
  Musterantwort (von der Fachperson geprüft) aufklappbar
```

### 3.4 Themen
Liste der Handlungskompetenzbereiche aus dem Bildungsplan, je mit Balken «sicher / im Aufbau / offen»
und dem Datum der letzten Übung. Tippen öffnet ein Übungspaket zu diesem Thema.

### 3.5 Berufsbildner-Ansicht (Web, auch Handy)
```
┌──────────────────────────────────────────────────────┐
│ Sanitär Brunner AG · 3 Lernende · Woche 42           │
│                                                      │
│ Lernende  Lehrjahr  Min./Woche  Stand BK  Hinweis    │
│ Lara      3         48          72        –          │
│ Noah      2          0          41        9 Tage inaktiv │
│ Elif      4         35          58        Entsorgung schwach │
│                                                      │
│ Nur Themen und Trainingszeit. Antworten sehen nur    │
│ die Lernenden selbst.                                │
└──────────────────────────────────────────────────────┘
```

### 3.6 Freigaben (Lernende)
Klare Schalter: «Mein Betrieb sieht: Trainingszeit ✓ · Themenstand ✓ · QV-READY ✓».
Einzelne Antworten sind nie freigebbar. Änderung jederzeit, der Betrieb sieht dann «nicht freigegeben».

## 4. Spielelemente, bewusst sparsam

| Element | Im MVP | Warum |
|---|---|---|
| Tage in Folge | ja, ausblendbar | stärkster Treiber für tägliche Nutzung; ausblendbar, damit es nicht stresst |
| Abzeichen für Themen | ja | macht Fortschritt sichtbar |
| Wochenziel (z. B. 40 Minuten) | ja | realistisch, auch für schwächere Lernende |
| Klassen-Challenge (anonym, Betrieb gegen Betrieb) | nach dem MVP | braucht mehrere Betriebe |
| Duelle, Ranglisten mit Namen | später, freiwillig | Risiko Beschämung |

## 5. Was «bestanden» nicht ist

- **Kein Ersatz für Schule, üK und Betrieb.** Das steht im Onboarding und in den AGB.
- **Keine Garantie** fürs Bestehen. Keine Formulierung wie «Mit uns bestehst du sicher» (UWG).
- **Keine Überwachung** der Lernenden durch den Betrieb.
