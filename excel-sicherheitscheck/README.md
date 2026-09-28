# Excel-Sicherheits-Check — MVP

Produktisierte Dienstleistung: Kunde bezahlt CHF 149 → lädt seine Excel-Datei hoch →
automatisierte Analyse findet bekannte Risikomuster (Datenverlust durch feste
Bereichsgrenzen, Zirkelbezüge, uneinheitliche Formeln, Datum als Text, fehlende
Eingabeprüfung, externe Verknüpfungen, ungeschützte Formelzellen u.a.) →
verständlicher PDF-Bericht wird geliefert.

Der analytische Kern (`backend/analyzer.py`, `backend/report.py`) ist fertig,
getestet und läuft lokal. Zwei Dinge kann diese Session nicht für Sie erledigen,
weil sie ein eigenes Konto mit Zahlungsdaten brauchen: das Zahlungsmittel
(Stripe) und das Upload-Formular (Google Form). Beides ist in 15–20 Minuten
eingerichtet, Anleitung unten.

## Was fertig ist

| Datei | Zweck |
|---|---|
| `backend/analyzer.py` | Der eigentliche Prüfmotor. Läuft auf **jeder** `.xlsx`-Datei, nicht nur auf bestimmte Strukturen zugeschnitten. 13 Prüfungen, siehe Docstrings. |
| `backend/report.py` | Baut aus den Befunden ein PDF (verständliche Sprache, Geschäftsrisiko statt Formel-Jargon). |
| `backend/run_check.py` | **Das Werkzeug für die Auftragsabwicklung.** Ein Aufruf pro Bestellung, siehe unten. |
| `backend/erzeuge_testdatei.py` | Erzeugt eine Testdatei mit eingebauten Fehlern, um alles zu verifizieren. |
| `beispiel/Testdatei_kaputt.xlsx` + `beispiel/Beispielbericht.pdf` | Getestetes Beispielpaar – so sieht Eingabe und Ausgabe aus. |
| `landing/index.html` | Fertige Verkaufsseite, eine Datei, kein Build-Schritt. |

Der Analyzer wurde gegen die eigene, bereits fachlich geprüfte
`excel/Leerstandsliste.xlsx` in diesem Repo laufen gelassen: 3 plausible,
keine falschen Befunde. Gegen die absichtlich kaputte Testdatei: alle 10
eingebauten Fehler korrekt gefunden.

## Auftragsabwicklung (aktueller Stand: teilautomatisiert, ~3 Min. pro Auftrag)

```bash
cd backend
pip install -r requirements.txt
python3 run_check.py Kundendatei.xlsx "Firma des Kunden" kunde@firma.ch
```

Das erzeugt `Bericht_<Firma>.pdf` und `Bericht_<Firma>_email.txt`
(fertiger, copy-paste-fertiger Mailtext). PDF anhängen, Text einfügen,
senden. Kein manuelles Formulieren, keine manuelle Analyse.

## Was Sie selbst einrichten müssen

### 1. Stripe-Zahlungslink (für die Bezahlung, ~10 Min.)

1. Kostenloses Konto auf stripe.com erstellen (Schweizer Geschäftskonto möglich).
2. Produkt anlegen: „Excel-Sicherheits-Check", Preis CHF 149, einmalig.
3. Unter „Zahlungslinks" (Payment Links) einen Link zu diesem Produkt erstellen.
   Wichtig: „E-Mail-Adresse erfassen" aktivieren, „Nach Zahlung anzeigen" auf
   eine eigene Erfolgsseite mit Text „Danke — Sie erhalten in Kürze eine
   E-Mail mit dem Upload-Link" stellen (oder direkt den Google-Form-Link,
   siehe unten).
4. Den generierten Link in `landing/index.html` an der Stelle
   `STRIPE_PAYMENT_LINK_HIER_EINSETZEN` eintragen.

Kein API-Key, kein Code nötig — ein Payment Link ist eine fertige, von
Stripe gehostete Bezahlseite.

### 2. Upload-Formular (für die Dateiübermittlung, ~5 Min.)

Einfachste, kostenlose Lösung ohne eigenen Server: Google Forms.

1. Neues Google Form erstellen mit den Feldern: Name/Firma (Text, Pflicht),
   E-Mail (Text, Pflicht), Excel-Datei (Dateiupload, Pflicht, Dateityp .xlsx).
2. Unter „Antworten" die Benachrichtigung per E-Mail bei neuer Antwort aktivieren.
3. Den Freigabe-Link des Formulars in `landing/index.html` an der Stelle
   `GOOGLE_FORM_LINK_HIER_EINSETZEN` eintragen.

Damit landet jede Bestellung als E-Mail-Benachrichtigung mit Link zur
hochgeladenen Datei in Ihrem Postfach — Sie laden sie herunter und rufen
`run_check.py` auf.

### 3. Landingpage veröffentlichen (~5 Min.)

`landing/index.html` ist eine einzelne, abhängigkeitsfreie Datei. Kostenlos
deploybar z.B. über Netlify Drop (netlify.com/drop, Ordner `landing/`
hineinziehen) oder GitHub Pages. Vorher `IHRE_EMAIL_HIER` im Footer ersetzen.

## Automatisierungsgrad (Stand MVP)

| Schritt | Automatisiert? |
|---|---|
| Zahlung | ✅ vollständig (Stripe) |
| Datei-Entgegennahme | ✅ vollständig (Google Form) |
| Analyse | ✅ vollständig (`analyzer.py`) |
| Berichtserstellung | ✅ vollständig (`report.py`) |
| Versand an Kunden | ❌ manuell — E-Mail-Text ist fertig, Versand per Klick |

~90 % automatisiert. Der einzige manuelle Schritt (E-Mail mit Anhang senden,
Text ist bereits fertig formuliert) dauert unter 2 Minuten pro Auftrag und
lässt sich später automatisieren (eigener Mailserver + Stripe-Webhook +
kleines Backend), sobald sich das Modell durch zahlende Kunden bestätigt hat
— bewusst nicht vorab gebaut, um nicht in etwas zu investieren, das noch
niemand bezahlt hat.

## Nächster echter Schritt

Kein Code mehr nötig. Stripe-Link + Google Form einrichten (siehe oben),
Landingpage deployen, dann an 10–15 bekannte Kontakte aus der eigenen
Immobilien-/Verwaltungsbranche schicken (siehe Abschlussbericht im Chat für
den genauen 7-Tage-Plan).
