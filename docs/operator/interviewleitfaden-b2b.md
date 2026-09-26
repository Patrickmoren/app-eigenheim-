# B2B-Interviewleitfaden — Verwaltungen, Regionalmakler, Treuhänder

> Ergänzt `docs/validierung-mietpilot.md` (B2C) um die B2B2C-Spur. Ziel: prüfen, ob H6, H7, H8
> tragen — nicht, ob die Idee sympathisch klingt.

## Zielgruppe & Fundstellen

- **Kleinere Immobilienverwaltungen** (5–50 MA, ausserhalb der Grossverwaltungen) — SVIT-Sektionsverzeichnis, LinkedIn.
- **Regionalmakler** ohne eigene grosse Tech-Abteilung — lokale Google-Suche, Handelsregister.
- **Treuhänder mit Immobilienmandaten** — TREUHAND|SUISSE-Mitgliederverzeichnis, lokale Treuhandbüros.

**Wichtig für die Auswahl:** Gezielt Betriebe suchen, die **kein** grosses eigenes IT-Team haben — das sind die wahrscheinlichsten Kandidaten für eine externe Engine statt Eigenentwicklung.

## Gesprächsleitfaden (20–25 Min.)

### Ist-Prozess (10 Min., kein Konzept erwähnen)
1. "Wie viele Mietobjekte betreuen Sie aktuell ungefähr?"
2. "Wie viele Wiedervermietungen haben Sie ungefähr pro Jahr?"
3. "Wie läuft eine Wiedervermietung bei Ihnen heute konkret ab — Schritt für Schritt?"
4. "Welche Schritte davon sind manuell?"
5. "Wer im Team erledigt das genau?"
6. "Wie viel Zeit entsteht dadurch pro Wiedervermietung, grob geschätzt?"
7. "Wie viele Bewerbungen kommen im Schnitt pro Objekt?"
8. "Wie prüfen Sie Bewerber:innen heute?"
9. "Wie priorisieren/vergleichen Sie mehrere Bewerbungen?"
10. "Welche Software setzen Sie dafür ein?"
11. "Wo entstehen dabei Medienbrüche — also Stellen, wo Sie Daten von einem System ins nächste übertragen müssen?"
12. "Wo passieren dabei am ehesten Fehler oder Verzögerungen?"
13. "Was kostet dieser Prozess intern ungefähr — in Arbeitsstunden oder Franken?"

### Automatisierungsbereitschaft (6 Min.)
14. "Welche dieser Schritte würden Sie gerne automatisieren, wenn Sie könnten?"
15. "Welche Entscheidungen müssen dabei zwingend bei einer Person im Team bleiben?"
16. "Würden Sie eine externe KI-Engine für diese Schritte einsetzen, wenn sie sich in Ihren bestehenden Prozess integrieren lässt?"
17. "Müsste das unter Ihrem eigenen Namen laufen (White Label), oder wäre eine sichtbar fremde Marke kein Problem?"
18. "Welche technische Integration wäre für Sie zwingend nötig, damit das überhaupt in Frage kommt?" *(z. B. Anbindung an bestehende Verwaltungssoftware wie Abacus/GARAIO/Rimo)*

### Wirtschaftlicher Wert — Preis erst spät (4 Min.)
19. **"Wenn wir Ihnen pro Wiedervermietung mehrere Arbeitsstunden einsparen könnten — welchen wirtschaftlichen Wert hätte das für Sie?"** *(Zahl nicht vorgeben, warten lassen — das ist die wichtigste Frage im ganzen Leitfaden.)*
20. Erst danach: "Was wäre für Sie ein akzeptabler Preis — pro Fall, oder als monatliche Gebühr?"

### Pilotbereitschaft (3 Min.)
21. "Wären Sie bereit, einen echten, aktuellen Fall testweise über eine solche Lösung laufen zu lassen?"
22. "Was müsste dafür erfüllt sein — welche Bedingung, welche Garantie, welcher Zeitpunkt?"

**Direkt nach dem Call notieren (Felder gemäss CRM-B2B, s. `mietpilot-crm.xlsx`):** Unternehmen, Segment, Einheiten, Wiedervermietungen/Jahr, Zeitaufwand/Fall (geschätzt), Systeme, grösster Pain, Automatisierungspotenzial (welche der 8 Workflow-Schritte konkret genannt wurden), Integrationsbedarf, White-Label-Bedarf, genannter wirtschaftlicher Wert, genannter Preis, Pilotbereitschaft (ja/bedingt/nein), wichtigste Originalaussage, Lead-Status (s. `lead-qualifizierung.md`).

## Unterscheidung, die immer explizit im Protokoll stehen muss

- **Interesse** ("klingt spannend") ≠ **Absicht** ("das würden wir uns überlegen") ≠ **konkrete Handlungsbereitschaft** ("wir könnten das bei der nächsten Wiedervermietung testen") ≠ **tatsächliche Zahlung/Pilot-Zusage** ("wir starten das nächste Woche").
- Nur die letzten beiden Stufen rechtfertigen den Lead-Status HOT (s. `lead-qualifizierung.md`).
