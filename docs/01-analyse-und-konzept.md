# Leerstandsliste – Fachliche Analyse & Applikationskonzept

Analysegrundlage: `Leerstandsliste_überarbeitet.xlsx`
Erstellt 2026-08-25, zuletzt geändert 2026-08-26 (Moren Patrick), bearbeitet mit LibreOffice Calc 24.2.
Stand der Analyse: 2026-09-15. Phase 1–4 (Analyse, Fachkonzept, Optimierung, Applikationskonzept). Kein Prototyp.

---

## 1. Was das Excel fachlich macht

Das Workbook ist eine **Leerstands- und Mieterwechsel-Pendenzenliste einer Liegenschaftsverwaltung**.

Jede Zeile ist **ein Mieterwechsel-Fall**: von der eingegangenen Kündigung eines Mieters über
Abnahme und Instandstellung der Wohnung bis zur Übergabe an den Nachmieter und der
Schlussabrechnung mit dem Vormieter. Die Liste beantwortet für 9 Bewirtschafter laufend die Frage:
**„Welche Objekte stehen leer oder werden leer, wie weit ist jeder Fall, und was ist als Nächstes zu tun?“**

Es ist **keine Datenbank, sondern eine Checkliste**: 20 der 35 Felder sind reine `Ja`/`Nein`-Haken
über Arbeitsschritte. Das Excel bildet den Arbeitsprozess ab, nicht das Objekt.

### 1.1 Aufbau: 12 Tabellenblätter in drei Rollen

| Blatt | Rolle | Zustand |
|---|---|---|
| `Moren`, `Ryser`, `Scherb`, `Ademi`, `Fazliu`, `Brandenburger`, `Breitmeier`, `Loa`, `Sivanesan` | **Erfassung** – je Bewirtschafter ein eigenes Blatt, ungeschützt | 9 Blätter, aktuell alle leer (Vorlagenzustand) |
| `Masterfile` | **Konsolidierung** – zieht alle 9 Blätter formelbasiert zusammen, blattgeschützt (Passwort-Hash `c71f`), Autofilter `A4:AJ1318`, Fenster fixiert ab `A5` | 1314 Formelzeilen, keine Eingabe |
| `Kennzahlen` | **Auswertung** – Dashboard je Bewirtschafter + Gesamttotale, blattgeschützt | 9 Zeilen + Total + 4 Globalkennzahlen |
| `Reserve 2` | **Reserveblatt** für einen 10. Bewirtschafter | leer und **nicht angebunden** (siehe 3.2) |

### 1.2 Die 35 Fachfelder in 5 Prozessblöcken

Die Spaltenüberschriften in Zeile 2 gliedern den Prozess:

**A–H · Allgemeine Informationen** (Fall- und Objektidentifikation)
`Monat` (Dropdown Januar–Dezember) · `Bewirtschafter` (Dropdown, 9 Namen) · `Eigentümer` ·
`Liegenschaft` · `Obj. Nr.` · `Anz. Zimmer` · `Stock` · `Sharepoint Link:`

**I–V · Objektabnahme** (Kündigung, Vermarktung, Wohnungsabnahme, Instandstellung)
`ex Mieter` · `gekündigt per` · `Haftungsdatum` · `Kü bestätigt / Mut. G-Rem` · `Meldung Werke / EGT` ·
`Mieter seit` · `Vorbesichtigung nötig?` · `VMZ aktualisiert` · `Inserat online` · `WA-Termin` ·
`aufbieten Handwerker` · `WA durchgeführt` · `Zustimmungserklärung unterzeichnet` ·
`Instandstellungen beauftragt`

**W–AE · Objektübergabe** (Neuvermietung und Übergabe)
`neuer Mieter` · `Vertrag versendet:` · `Vertrag retour` · `Vermietet per:` · `Info Werke / EGT` ·
`Schlüsselübergabe terminiert` · `Reinigung veranlasst` · `Namensschilder` ·
`Kaution einbezahlt / G-Rem mutiert`

**AF–AH · Schlussabrechnung** (Abrechnung mit dem Vormieter)
`Instandstellungs-RG` · `SA erhalten` · `Zahlungseingang erhalten`

**AI · erledigt**
`Fall bgeschlossen` *(sic – Tippfehler im Original)*

**AJ · Kennzahl** – `Tage offen`, berechnet
**AK–AR · Hilfsspalten** – „nicht bearbeiten“, technische Konsolidierungslogik

### 1.3 Feldtypen

| Typ | Anzahl | Felder |
|---|---|---|
| Dropdown `Ja`/`Nein` (Leereingabe erlaubt) | **20** | L, M, O, P, Q, S, T, U, V, X, Y, AA–AI |
| Dropdown Monat / Bewirtschafter | 2 | A, B |
| Freie Eingabe, **keine Validierung** | 13 | C, D, E, F, G, H, I, J, K, N, R, W, Z |
| davon mit Datums-Semantik | 5 | `gekündigt per`, `Haftungsdatum`, `Mieter seit`, `WA-Termin`, `Vermietet per:` |
| berechnet | 1 | AJ `Tage offen` |

### 1.4 Formeln und Berechnungen

**Konsolidierung (Masterfile, Hilfsspalten AK–AR):** ein „virtueller Verdichter“, der aus 9 Blättern
eine lückenlose Liste macht. Pro Zeile:

```
AK = ROW()-4                                    laufender Index 1…1314
AL = INT((AK-1)/146)+1                          Blatt-Nr. 1…9   (146 Zeilen pro Bewirtschafter)
AM = MOD(AK-1,146)+5                            Zeile 5…150 im Quellblatt
AN = 1, wenn Liegenschaft ODER Obj.-Nr. gefüllt belegte Quellzeile?
AO = AO(Vorzeile) + AN                          laufende Summe belegter Zeilen
AP = MATCH(AK, AO-Bereich, 0)                   n-te belegte Zeile finden
AQ/AR = Blatt-Nr. / Zeilen-Nr. dieser Zeile
```

Spalten A–AI holen den Wert dann per `INDEX(CHOOSE($AQ; Moren!A:A; Ryser!A:A; …); $AR)` –
**44 Formeln × 1314 Zeilen ≈ 58 000 Formeln**, jede mit einem 9-fachen `CHOOSE` auf ganze Spalten.
Spalte B wird dabei **nicht** aus dem Quellblatt gelesen, sondern aus der Blattposition abgeleitet:
`CHOOSE($AQ;"Moren";"Ryser";…)`.

**Tage offen (AJ):**
```
=WENN(AI="Ja"; "abgeschlossen"; WENN(J<>""; HEUTE()-J; ""))
```

**Kapazitätsanzeige (Zeile 1 jedes Erfassungsblatts):**
```
="Kapazität: " & SUMMENPRODUKT(--((D5:D150<>"")+(E5:E150<>"")>0)) & " von 146 Zeilen belegt (…%)"
```
mit bedingter Formatierung: rot/fett ab >90 % Auslastung.

**Kennzahlen je Bewirtschafter:**

| Kennzahl | Definition |
|---|---|
| Anzahl gesamt | `ZÄHLENWENN(Masterfile!B; Name)` |
| Anzahl offen | `ZÄHLENWENNS(… ; AI <> "Ja")` |
| Überfällige WA-Termine | `WA-Termin` gesetzt **und** < heute **und** `WA durchgeführt` ≠ `Ja` |
| Ø Leerstandsdauer (Tage) | Mittel aus `Vermietet per − gekündigt per`, nur über abgeschlossene Fälle |

**Globale Kennzahlen:** Anzahl doppelter Obj.-Nr. · Total offene Leerstände · Total überfällige
WA-Termine · Stand `=HEUTE()`.

### 1.5 Kontrollmechanismen (bedingte Formatierung im Masterfile, `A5:AJ1318`)

| Farbe | Regel | Bedeutung |
|---|---|---|
| 🟧 Orange `#FFD9A0` | `Obj.-Nr. gefüllt UND ZÄHLENWENN(Obj.-Nr.) > 1` | Objektnummer doppelt erfasst |
| 🟥 Rot `#FFC7CE` | `WA-Termin < heute UND WA durchgeführt ≠ "Ja"` | Wohnungsabnahme überfällig |
| 🟩 Grün `#C6EFCE` | `Fall abgeschlossen = "Ja"` | erledigt |
| 🟨 Gelb `#FFEB9C` | `gekündigt per gesetzt UND nicht abgeschlossen UND heute − gekündigt per > 60` | Langläufer |

Weitere Kontrollen: 3 Dropdown-Validierungen mit Fehlermeldungen („Bitte einen Monat aus der Liste
wählen.“ / „…Bewirtschafter…“ / „Bitte Ja oder Nein wählen.“), Blattschutz auf `Masterfile` und
`Kennzahlen`, Autofilter und fixierte Kopfzeile im Masterfile.

---

## 2. Der Arbeitsprozess dahinter

```
Kündigung geht ein
   └─ Fall anlegen: Objekt, ex-Mieter, gekündigt per, Haftungsdatum
      ├─ Kündigung bestätigen + G-Rem mutieren
      └─ Werke / EGT melden
          ↓
Vermarktung parallel zur Abnahme
   ├─ Vorbesichtigung nötig?  →  VMZ aktualisieren  →  Inserat online
   ↓
Wohnungsabnahme (WA)
   ├─ WA-Termin ansetzen  →  Handwerker aufbieten
   ├─ WA durchgeführt  →  Zustimmungserklärung unterzeichnet
   └─ Instandstellungen beauftragt
          ↓
Neuvermietung / Übergabe
   ├─ neuer Mieter  →  Vertrag versendet  →  Vertrag retour  →  vermietet per
   ├─ Info Werke / EGT · Schlüsselübergabe terminiert
   ├─ Reinigung veranlasst · Namensschilder
   └─ Kaution einbezahlt / G-Rem mutiert
          ↓
Schlussabrechnung mit Vormieter
   ├─ Instandstellungs-RG  →  SA erhalten  →  Zahlungseingang erhalten
          ↓
Fall abgeschlossen = Ja   → Zeile wird grün
```

**Wiederkehrende Arbeitsschritte:**
- **täglich/wöchentlich je Bewirtschafter:** eigenes Blatt öffnen, offene Zeilen durchgehen,
  erledigte Schritte auf `Ja` setzen, neue Kündigungen erfassen
- **Steuerung/Leitung:** `Kennzahlen` öffnen, überfällige WA-Termine und Langläufer sichten,
  im `Masterfile` nach Farbe filtern, Bewirtschafter ansprechen
- **monatlich:** `Monat` als Gruppierungsmerkmal für Auswertung/Reporting

**Automatisch ist heute nur:** Konsolidierung, `Tage offen`, die 4 Kennzahlen, die 4 Farbregeln,
die Kapazitätsanzeige. **Alles andere ist manuelle Eingabe.**

---

## 3. Probleme der aktuellen Excel-Lösung

### 3.1 Datenverlust ohne Fehlermeldung (kritisch)

Die Konsolidierung liest **fest die Zeilen 5–150** jedes Blatts (`MOD(AK-1;146)+5`).
Die Dropdown-Validierung ist aber bis **Zeile 1004** ausgelegt.
→ Wer in seinem Blatt ab Zeile 151 erfasst, bekommt Dropdowns, Formatierung, keinerlei Warnung –
und der Fall erscheint **nie** im Masterfile und **nie** in den Kennzahlen. Er ist unsichtbar verloren.
Die Kapazitätsanzeige warnt erst bei >90 %, also ab 132 Zeilen, und zählt zudem nur bis Zeile 150.

### 3.2 `Reserve 2` ist eine Attrappe

Das Blatt existiert mit vollständiger Kopfzeile, ist aber in **keiner** Formel referenziert –
weder in `CHOOSE` im Masterfile noch in den Kennzahlen. Es hat auch keine Dropdown-Validierungen.
Eingaben dort verschwinden spurlos. (Ein `Reserve 1` gibt es gar nicht.)

### 3.3 Ein 10. Bewirtschafter ist praktisch nicht anschliessbar

Um jemanden hinzuzufügen, müssten die 9-fachen `CHOOSE`-Listen in **35 Spalten × 1314 Zeilen**
plus 2 Hilfsspalten geändert, der Teiler 146 neu gerechnet, die Bereichsgrenze 1318 angepasst und
4 Kennzahlenformeln × neue Zeile ergänzt werden – auf zwei passwortgeschützten Blättern.
Das Reserveblatt ist der sichtbare Beleg, dass dieser Weg nicht gangbar war.

### 3.4 Die Spalte `Bewirtschafter` ist funktionslos und irreführend

Im Erfassungsblatt gibt es ein Dropdown mit **allen 9 Namen**. Das Masterfile ignoriert die Eingabe
und leitet den Bewirtschafter aus der **Blattposition** ab. Wer im Blatt `Moren` versehentlich
`Ryser` wählt, sieht im eigenen Blatt „Ryser“, in der Auswertung zählt der Fall aber zu Moren.
Zwei Wahrheiten für dasselbe Feld, ohne Prüfung.

### 3.5 `Tage offen` und `Ø Leerstandsdauer` messen nicht den Leerstand

```
Tage offen        = heute − gekündigt per
Ø Leerstandsdauer = vermietet per − gekündigt per
```
`gekündigt per` ist das **Kündigungsdatum**, nicht der Beginn des Leerstands. Zwischen Kündigung und
Auszug liegen typischerweise die Kündigungsfrist (oft 3 Monate). Beide Kennzahlen zählen diese
Vorlaufzeit als Leerstand mit und überzeichnen ihn systematisch – die 60-Tage-Warnung schlägt
deshalb auch bei völlig planmässigen Fällen an und wird zwangsläufig ignoriert.
Das fachlich richtige Bezugsdatum steht ungenutzt in Spalte K: `Haftungsdatum` ist der **letzte Tag,
für den der Vormieter haftet** – der Leerstand beginnt am Folgetag.

### 3.6 Datumsfelder ohne jede Prüfung

`gekündigt per`, `Haftungsdatum`, `Mieter seit`, `WA-Termin`, `Vermietet per:` haben **keine
Datenvalidierung und kein Datumsformat** (`General`). Eine Eingabe wie `1.9.` oder `per Ende Monat`
liefert Text. Folge: `Tage offen` wird `#WERT!`, die Vergleiche `WA-Termin < HEUTE()` in den
Kennzahlen werten stillschweigend als `FALSCH` – **die Überfälligkeitswarnung fällt lautlos aus**.
Ebenso ungeprüft: `Obj. Nr.`, `Anz. Zimmer`, `Stock`. Auch Datums-Logik wird nicht geprüft
(`Vermietet per` vor `Haftungsdatum`, `WA-Termin` vor `gekündigt per` usw.).

### 3.7 `Ja`/`Nein` verliert das Wann – und bedeutet zweierlei

20 Felder halten fest **dass** etwas passiert ist, nie **wann**. „Vertrag versendet: Ja“ – seit gestern
oder seit sechs Wochen? Ohne Datum ist keine Wiedervorlage und keine Durchlaufzeitanalyse möglich.

Gleichzeitig hat `Nein` je nach Spalte zwei unvereinbare Bedeutungen:
- `Vorbesichtigung nötig? = Nein` → **Entscheid**, Schritt entfällt
- `Reinigung veranlasst = Nein` → **Pendenz**, Schritt steht noch aus

Und `Nein` ist nicht von „leer“ unterscheidbar: die Kennzahlen prüfen `<> "Ja"`, beides zählt gleich.
Bewusst „nicht nötig“ und „noch nicht angefasst“ sind im Excel nicht trennbar.

### 3.8 Fälle lassen sich unvollständig abschliessen

`Fall abgeschlossen = Ja` ist ein freier Haken. Nichts prüft, ob `Instandstellungs-RG`, `SA erhalten`
und `Zahlungseingang erhalten` erledigt sind. Der Fall wird grün, die offene Schlussabrechnung
verschwindet aus jeder Kennzahl.

### 3.9 Die Duplikatswarnung erzeugt Fehlalarme

Orange markiert wird jede Obj.-Nr., die mehr als einmal vorkommt – über den **gesamten Bestand,
inklusive abgeschlossener Fälle**. Ein Objekt, das nach zwei Jahren erneut frei wird, ist ein
völlig normaler zweiter Fall und wird trotzdem als Doppelerfassung markiert. Je länger die Liste
geführt wird, desto mehr Fehlalarme – bis die Farbe bedeutungslos ist.

### 3.10 Keine Historie, keine Zuordnung, kein Mehrbenutzerbetrieb

Es gibt kein Feld für „wer hat wann was geändert“. Ein zurückgesetztes `Ja` ist spurlos.
Der Zuschnitt „ein Blatt pro Person“ ist faktisch ein Sperrmechanismus für eine Datei, die immer
nur einer gleichzeitig bearbeiten kann – Teamarbeit erzwingt Kopien und Versionskonflikte.

### 3.11 Unübersichtlichkeit am Arbeitsplatz

- **35 Spalten** pro Zeile: horizontales Scrollen, der Objektbezug verschwindet aus dem Bild
  (nur die Kopf*zeile* ist fixiert, keine Spalten)
- Die Hilfsspalten `AK–AR` sind **nicht ausgeblendet** – der Nutzer sieht im Masterfile
  Zahlenkolonnen neben „nicht bearbeiten“
- Der Autofilter `A4:AJ1318` umfasst **1314 Zeilen, davon fast alle leer** – jeder Filter zeigt
  hunderte Leerzeilen
- Das Masterfile sieht aus wie eine Tabelle zum Arbeiten, ist aber nur lesbar
- `Mieter seit` (Spalte N, Datum des **Vormieters**) steht mitten zwischen zwei Ja/Nein-Feldern
  im Abnahmeblock – logisch gehört es zu `ex Mieter` in Spalte I
- `Sharepoint Link:` ist Text, **kein klickbarer Hyperlink**
- Tippfehler in produktiven Überschriften: „Fall **bg**eschlossen“, „VMZ **a**kualisiert“,
  Leerzeichen-Reste in „ex Mieter “ und „Kaution einbezahlt /  G-Rem mutiert“

### 3.12 Performance

~58 000 `INDEX/CHOOSE`-Formeln auf ganze Spaltenbereiche, 40+ `SUMMENPRODUKT` über je 1314 Zeilen
und mehrere volatile `HEUTE()` in den Farbregeln bedeuten: **das gesamte Workbook rechnet bei jeder
Eingabe neu**, unabhängig davon, dass real vielleicht 30 Fälle erfasst sind.

### 3.13 `Monat` ohne Jahr

`Monat` ist ein reines Text-Dropdown Januar–Dezember. Über Jahresgrenzen hinweg fällt der Bezug
weg, Sortierung ist alphabetisch (April, August, Dezember…), und das Feld ist redundant zu
`gekündigt per`, aus dem der Monat ableitbar wäre.

---

## 4. Die Applikation: „Leerstandsmanager“

**Kein digitales Excel, sondern ein Fall-Assistent.** Leitidee:

> Der Excel-Nutzer fragt: *„In welche Zelle muss ich jetzt was schreiben?“*
> Der App-Nutzer bekommt gesagt: *„Bei diesem Fall ist als Nächstes X fällig – hier erledigen.“*

Drei Verschiebungen gegenüber Excel:

1. **Von der Zeile zum Fall.** Nicht 35 Spalten nebeneinander, sondern eine Fallakte mit
   Zeitstrahl. Sichtbar ist, was jetzt dran ist.
2. **Vom Haken zum Ereignis.** Statt `Ja` wird ein Schritt *erledigt* – mit Datum, Benutzer und
   Zeitstempel, automatisch. Daraus entsteht Historie und Durchlaufzeit-Auswertung gratis.
3. **Von der Farbe zur Aufgabe.** Statt gelb/rot/orange in einer Tabelle, die man erst filtern muss,
   eine Aufgabenliste „Das ist überfällig, das fehlt, das ist zu prüfen“ direkt auf der Startseite.

### 4.1 Prozessmodell: 5 Phasen, 35 Felder bleiben fachlich erhalten

| Phase | aus Excel | Abschlusskriterium (automatisch) |
|---|---|---|
| **1 Erfassung** | A–H + I/J/K/N | Objekt, ex-Mieter, gekündigt per, Haftungsdatum erfasst |
| **2 Abnahme & Vermarktung** (Sollfrist: 30 Tage vor Wohnungsabgabe für Abnahmetermin und Handwerkeraufgebot) | L–V | WA durchgeführt + Zustimmungserklärung + Instandstellung beauftragt |
| **3 Neuvermietung** | W–Z | neuer Mieter + Vertrag retour + Vermietet per |
| **4 Übergabe** | AA–AE | Schlüsselübergabe, Reinigung, Namensschilder, Kaution/G-Rem erledigt |
| **5 Schlussabrechnung** | AF–AH | Instandstellungs-RG + SA erhalten + Zahlungseingang |
| **→ abgeschlossen** | AI | *nur* wenn Phase 5 vollständig – App prüft, nicht der Nutzer |

Die Phase wird **aus den Daten abgeleitet, nicht eingegeben.** Damit fällt `Fall abgeschlossen`
als Fehlerquelle weg (Problem 3.8).

### 4.2 Definition der Leerstandsdauer

```
Leerstandsbeginn  = Haftungsdatum + 1 Tag
letzter leerer Tag = Vermietet per − 1 Tag   (laufender Fall: heute)
Leerstandstage     = Anzahl Kalendertage von Beginn bis letztem leerem Tag, beide eingeschlossen
```

Das `Haftungsdatum` ist der letzte Tag, für den der Vormieter haftet; dieser Tag zählt selbst
noch nicht als Leerstand. Haftung bis 31.08. und Vermietung ab 01.09. ergeben deshalb **0
Leerstandstage**, nicht einen. Liegt der Leerstandsbeginn in der Zukunft, steht der Fall im
Vorlauf und die Zählung beginnt erst.

Der **Berichtsmonat** richtet sich nach dem Leerstandsbeginn, nicht nach dem Haftungsdatum:
endet die Haftung am 31.08., ist es ein September-Fall.

### 4.3 Fachliche Korrekturen, die die App vornimmt

| Excel | App | warum |
|---|---|---|
| `Tage offen` = heute − **gekündigt per** | **Leerstandstage** = leere Kalendertage ab **Haftungsdatum + 1 Tag**, einschliesslich heute; zusätzlich getrennt ausgewiesen: **Vorlauftage** = Haftungsdatum − gekündigt per | misst den echten Leerstand (3.5) |
| `Ø Leerstandsdauer` = vermietet per − gekündigt per | = **vermietet per − Haftungsdatum − 1**, nur abgeschlossene Fälle | dito |
| Duplikat = Obj.-Nr. mehrfach im ganzen Bestand | Warnung nur bei **zwei gleichzeitig offenen** Fällen zum selben Objekt; ein Folgefall nach Abschluss ist normal und wird als **Fallhistorie** verlinkt | beseitigt Fehlalarme (3.9) |
| `Nein` = mehrdeutig | drei klare Zustände: **offen · erledigt · nicht erforderlich** (mit Begründung) | (3.7) |
| `Monat` (Text) | entfällt als Eingabe, wird aus dem **Leerstandsbeginn** abgeleitet (Monat **und Jahr**) | (3.13) |
| `Bewirtschafter` frei wählbar | Zuständigkeit ist eine echte Zuweisung; Umhängen ist eine bewusste Aktion mit Protokolleintrag | (3.4) |
| 146-Zeilen-Grenze | keine Grenze | (3.1) |
| 9 fest verdrahtete Namen, `Reserve 2` | Bewirtschafter sind Stammdaten, jederzeit anlegbar | (3.2 / 3.3) |

---

## 5. Funktionsumfang

### 5.1 Automatisierung – was heute manuell ist

| heute in Excel | die App erledigt automatisch |
|---|---|
| Masterfile konsolidiert 9 Blätter per Formel | keine Konsolidierung nötig – eine Datenbasis, gefiltert nach Sicht |
| `Tage offen` = HEUTE()−J, teilweise `#WERT!` | Leerstandstage, Vorlauftage, Tage in aktueller Phase – laufend, fehlerfrei |
| Kennzahlen als 40 SUMMENPRODUKT-Formeln | Kennzahlen live, zusätzlich Durchlaufzeit je Phase (aus der Ereignishistorie) |
| Phase im Kopf des Bearbeiters | Phase aus Daten abgeleitet, im Fall und in jeder Liste sichtbar |
| `Monat` von Hand wählen | aus dem Leerstandsbeginn abgeleitet (Monat + Jahr) |
| Farbe im Masterfile, muss gefiltert werden | **Aufgabenliste**: überfällig, fällig in 7 Tagen, unvollständig – pro Benutzer priorisiert |
| Überfälligkeit nur für WA-Termin | Fristenmonitor für alle datierten Schritte (WA-Termin, Vertrag retour, Schlüsselübergabe) |
| niemand erinnert an die Vorbereitung der Abnahme | **Sollfristen aus dem Haftungsdatum**: 30 Tage vor der Wohnungsabgabe werden «Abnahmetermin vereinbaren» und «Handwerker aufbieten» fällig, ohne dass jemand daran denken muss |
| Datumsfehler werden nie bemerkt | Plausibilitätsprüfung bei der Eingabe: Format, Reihenfolge der Daten, Pflichtfelder der Phase |
| Doppelerfassung fällt orange auf, wenn jemand hinschaut | Warnung **beim Anlegen**: „Zu Obj. 4711 ist bereits ein offener Fall vorhanden – öffnen oder trotzdem neu anlegen?“ |
| `Fall abgeschlossen` frei setzbar | Abschluss nur bei vollständiger Phase 5, sonst Hinweis, was fehlt |
| kein Protokoll | jede Änderung mit Benutzer + Zeitstempel |
| Auswertung = filtern und zählen | gespeicherte Sichten, Export Excel/PDF, Monatsreport auf Knopfdruck |
| Sharepoint-Link als Text | klickbarer, validierter Link |
| Nachfassen nach Gedächtnis | Wiedervorlage je Fall + Erinnerung |

### 5.2 Kontextbezogene Hilfe

Kein allgemeines Handbuch, sondern Hilfe **am Feld und am Fall**:

- **pro Feld** eine Kurzerklärung („Haftungsdatum: letzter Tag, für den der Vormieter haftet –
  der Leerstand beginnt am Folgetag“) plus Hinweis auf abhängige Felder
- **pro Fall** ein Kasten *„Nächster Schritt“*: der fachlich nächste offene Schritt, warum er
  jetzt dran ist, und die Schaltfläche, ihn zu erledigen
- **pro Phase** eine Checkliste mit dem, was zum Weiterkommen noch fehlt
- **bei Fehleingabe** eine verständliche Meldung statt einer Formelmeldung:
  „Vermietet per liegt vor dem Haftungsdatum – bitte prüfen“ statt `#WERT!`
- **Suche über alles**: Objektnummer, Liegenschaft, Mietername, Eigentümer

### 5.3 Rollen

| Rolle | darf |
|---|---|
| **Bewirtschafter** | eigene Fälle anlegen und bearbeiten, fremde lesen (Vertretung, Auskunft am Telefon) |
| **Teamleitung** | alle Fälle bearbeiten, umhängen, Auswertungen über alle, Fälle wieder öffnen |
| **Leseberechtigt** (z. B. Eigentümerbetreuung, Buchhaltung) | alles lesen und exportieren, nichts ändern |
| **Administrator** | Stammdaten (Bewirtschafter, Eigentümer, Liegenschaften), Benutzer und Rollen, Fristenparameter, Vorlagen |

Begründung: Das Excel trennt heute physisch nach Blättern, erlaubt aber faktisch jedem alles.
Die Trennung „eigene bearbeiten / alle sehen“ bildet die gelebte Praxis (Stellvertretung, Auskunft)
ab, ohne die versehentliche Fremdänderung.

### 5.4 Datenmodell

**Stammdaten** (heute als Freitext in jeder Zeile wiederholt):
- `Bewirtschafter` – Name, aktiv/inaktiv, Benutzerkonto
- `Eigentümer` – Name
- `Liegenschaft` – Bezeichnung, Adresse, Eigentümer *(Referenz)*
- `Objekt` – Liegenschaft *(Referenz)*, Obj.-Nr., Anz. Zimmer, Stock, Sharepoint-Link
  → **Obj.-Nr., Zimmer, Stock und Link werden einmal gepflegt, nicht pro Fall neu getippt**

**Vorgang: `Leerstandsfall`** – das Hauptobjekt, entspricht einer Excel-Zeile
- Objekt *(Referenz, Pflicht)* · zuständiger Bewirtschafter *(Pflicht)*
- ex Mieter · gekündigt per *(Pflicht)* · Haftungsdatum *(Pflicht)* · Mieter seit
- neuer Mieter · Vermietet per
- abgeleitet: Phase · Leerstandsbeginn (Haftungsdatum + 1 Tag) · Leerstandstage · Vorlauftage · Berichtsmonat · Status
- angelegt von / am, geändert von / am, abgeschlossen von / am

**`Prozessschritt`** – ersetzt die 20 Ja/Nein-Spalten, je Fall ein Satz Schritte
- Schlüssel (z. B. `inserat_online`) · Phase · Reihenfolge
- Status: `offen` / `erledigt` / `nicht erforderlich`
- erledigt am *(Datum, statt `Ja`)* · erledigt von · Begründung bei „nicht erforderlich“
- Termin *(für datierte Schritte wie WA-Termin)* · überfällig *(abgeleitet)*

**`Ereignis`** (Historie) – Fall, Zeitpunkt, Benutzer, Feld, alter Wert, neuer Wert
**`Wiedervorlage`** – Fall, Datum, Text, Benutzer, erledigt
**`Benutzer`** – Name, E-Mail, Rolle, Bewirtschafter-Zuordnung, aktiv

Pflichtfelder sind **phasenabhängig**: zum Anlegen genügen Objekt, gekündigt per, Haftungsdatum;
`Vermietet per` wird erst in Phase 3 verlangt. Das Excel verlangt alles nie und nichts immer.

### 5.5 Oberfläche

**Dashboard** (Startseite, erste Sicht: „meine Fälle“)
- 4 Kacheln: **offene Fälle** · **überfällig** · **∅ Leerstandstage** · **diesen Monat abgeschlossen**
- **Meine Aufgaben**, sortiert nach Dringlichkeit: überfällige Termine rot, in 7 Tagen fällig gelb,
  Fälle ohne nächsten Schritt grau — jede Zeile mit Objekt, Fall, Schritt, Frist, Direktlink
- **Warnungen**: unplausible Daten, fehlende Pflichtangaben, doppelte offene Fälle je Objekt
- Schnellzugriffe: **Neuer Fall** · Suche · Meine Fälle · Alle Fälle · Auswertung
- Umschalter „meine / Team“ (Teamleitung und Leseberechtigte)

**Fallliste** – kein Tabellen-Dickicht: pro Fall eine Karte/Zeile mit Objekt, Liegenschaft,
ex-Mieter, **Phasenbalken 1–5**, Leerstandstagen und dem nächsten fälligen Schritt.
Filter: Bewirtschafter · Phase · Status · Zeitraum · überfällig. Volltextsuche. Export.

**Fallakte** (Detail) – ersetzt das horizontale Scrollen über 35 Spalten
- Kopf: Objekt, Liegenschaft, Eigentümer, Zimmer/Stock, Sharepoint-Link, Zuständigkeit,
  Phase, Leerstandstage
- **Kasten „Nächster Schritt“** mit Erledigen-Schaltfläche
- 5 Phasenabschnitte, der aktuelle offen, die übrigen zugeklappt; je Schritt Status, Datum,
  Bearbeiter, Erledigen / Nicht erforderlich
- Seitenspalte: Daten (gekündigt per, Haftungsdatum, vermietet per), Wiedervorlagen, **Historie**

**Eingabemasken** – gruppiert statt 35 Felder am Stück; Objektwahl mit Vorschlag aus den Stammdaten,
Datumsfelder mit Kalender, Pflichtfelder markiert, Prüfung beim Verlassen des Felds,
Feldhilfe direkt daneben.

**Auswertungen** – Kennzahlen je Bewirtschafter (wie heute) **plus** Durchlaufzeit je Phase,
Leerstandstage im Zeitverlauf, Fälle je Liegenschaft/Eigentümer; frei filterbar,
Export nach Excel und PDF, Monatsreport.

---

## 6. Benutzerführung

```
Dashboard
   ├── „Neuer Fall“ ──► Objekt suchen/anlegen ──► Kündigungsdaten ──► Fall angelegt
   │                     (Dublettenprüfung)      (Plausibilität)    └► direkt zum nächsten Schritt
   │
   ├── Aufgabe anklicken ──► Fallakte, richtige Phase offen ──► Schritt erledigen
   │                                                            └► nächster Schritt erscheint
   ├── Suche ──► Fall / Objekt ──► Fallakte
   └── Auswertung ──► Filter ──► Kennzahlen ──► Export
```

Drei Regeln: **maximal zwei Klicks** von der Startseite zu jeder Aufgabe · nach jeder Aktion wird
der **Folgeschritt** angeboten, der Nutzer landet nie in einer Sackgasse · die Navigation hat
**vier Punkte** (Dashboard, Fälle, Auswertung, Stammdaten) – keine verschachtelten Menüs.

---

## 7. Technische Umsetzung

### 7.1 Anforderungen aus dem Fachprozess

Mehrbenutzerbetrieb ohne Sperrkonflikte · Zugriff vom Büro-Desktop **und** unterwegs
(Wohnungsabnahme wird vor Ort erledigt – Tablet/Smartphone ist der eigentliche Gewinn) ·
Rollen und Rechte · vollständige Historie · Export nach Excel/PDF · Import der bestehenden Liste ·
erweiterbar (Serienbriefe, Schnittstelle zur Bewirtschaftungssoftware/G-Rem, SharePoint).

### 7.2 Varianten

| | **A · Web-App, eigenentwickelt** | **B · Microsoft 365 / Power Platform** | **C · Standardsoftware** |
|---|---|---|---|
| Kosten Aufbau | mittel | gering–mittel | gering |
| Laufende Kosten | Hosting, gering | Lizenz je Benutzer | Lizenz je Benutzer, meist höher |
| Aufwand | höchster | mittel | Einführung/Migration |
| Wartbarkeit | volle Kontrolle | an Plattform gebunden | Hersteller |
| Benutzerführung | **frei gestaltbar, genau dieser Prozess** | begrenzt, Formular-Look | generisch, Prozess muss angepasst werden |
| Sicherheit | selbst zu verantworten | Unternehmens-Login vorhanden | Hersteller |
| Erweiterbarkeit | sehr gut | mittel | abhängig vom Hersteller |

**Empfehlung: Variante A** – eine schlanke Web-Applikation.
Der Mehrwert liegt gerade in der prozessgeführten Oberfläche (Phasen, nächster Schritt,
kontextbezogene Hilfe); genau das ist in B nur eingeschränkt und in C gar nicht abbildbar.
Der Umfang ist überschaubar: ein Hauptobjekt, fünf Phasen, vier Rollen.
Da SharePoint bereits im Einsatz ist (Spalte H), bleibt B als Fallback interessant, wenn die
IT-Governance eine Eigenentwicklung ausschliesst.

### 7.3 Vorgeschlagene Umsetzung

- **Web-Applikation, responsiv** – ein Stand für Desktop, Tablet und Smartphone, keine Installation
- **Relationale Datenbank** (PostgreSQL) – das Datenmodell aus 5.4 ist relational
- **Login** über das bestehende Unternehmenskonto (Microsoft Entra ID / SSO), sonst eigenes Login
  mit Zweitfaktor; Rollen wie in 5.3
- **Backup** täglich automatisch, Wiederherstellungspunkte; die Historie macht jede Änderung
  nachvollziehbar
- **Export** Excel (Fallliste, Auswertung – Format wie heute, für Empfänger ohne Zugang)
  und PDF (Monatsreport, Fallakte)
- **Import** der bestehenden 9 Blätter beim Start
- **Schnittstellen später**: SharePoint (Dokumente je Fall), G-Rem/Bewirtschaftungssoftware
  (Objekt- und Mieterstammdaten – beseitigt die Doppelerfassung von `Eigentümer`,
  `Liegenschaft`, `Obj. Nr.`), E-Mail für Erinnerungen
- **Erweiterbarkeit**: die Prozessschritte sind Stammdaten, nicht Programmcode – Schritte lassen
  sich ohne Entwicklung ergänzen, umbenennen oder deaktivieren. Genau daran scheitert das Excel.

### 7.4 Schrittweise Einführung

1. **Kern**: Fälle, Phasen, Schritte, Dashboard, Suche, Rollen, Export → ersetzt das Excel
2. **Ausbau**: Fristenmonitor, Wiedervorlagen, E-Mail-Erinnerungen, Auswertungen
3. **Integration**: SharePoint, Stammdaten-Schnittstelle, Serienbriefe

---

## 8. Excel heute → Applikation zukünftig

| Excel heute | Applikation zukünftig | Vorteil |
|---|---|---|
| 9 Erfassungsblätter + Masterfile mit 58 000 Formeln | eine Datenbasis, gefilterte Sichten | keine Konsolidierung, kein Rechenaufwand, keine Formelfehler |
| max. 146 Zeilen je Bewirtschafter, Überlauf verschwindet lautlos | unbegrenzt | **kein Datenverlust** |
| 10. Bewirtschafter praktisch nicht anschliessbar (`Reserve 2`) | Bewirtschafter als Stammdatum anlegen | Minuten statt Umbau |
| 35 Spalten horizontal scrollen | Fallakte mit 5 Phasen, nur die aktuelle offen | Überblick statt Suchen |
| `Ja`/`Nein` ohne Datum | Schritt erledigt mit Datum, Benutzer, Zeitstempel | Historie und Durchlaufzeiten ohne Mehraufwand |
| `Nein` heisst mal „entfällt“, mal „offen“ | offen / erledigt / nicht erforderlich | eindeutig auswertbar |
| Datumsfelder ungeprüft → `#WERT!`, Warnungen fallen lautlos aus | Kalenderfeld + Plausibilitätsprüfung | Fehler werden bei der Eingabe verhindert |
| `Tage offen` ab Kündigungsdatum | Leerstandstage ab dem Tag nach dem Haftungsdatum, Vorlauf getrennt | **fachlich richtige Kennzahl**, Warnungen werden wieder ernst genommen |
| Überfälligkeit nur für WA-Termin, sichtbar als Farbe | Fristenmonitor über alle Termine, als Aufgabenliste | nichts wird übersehen |
| Vorbereitung der Abnahme nur aus dem Gedächtnis | Sollfrist 30 Tage vor der Wohnungsabgabe, automatisch aus dem Haftungsdatum | Termin und Handwerker sind rechtzeitig gesichert |
| Warnung = Farbe, muss gefiltert werden | Aufgabenliste priorisiert auf der Startseite | der Nutzer sucht nicht, er bekommt |
| Duplikatswarnung über alle Fälle → Fehlalarme | Warnung nur bei zwei offenen Fällen je Objekt, beim Anlegen | Warnung bleibt glaubwürdig |
| `Fall abgeschlossen` frei setzbar | Abschluss nur bei vollständiger Schlussabrechnung | keine verlorenen Pendenzen |
| Objekt-, Eigentümer-, Liegenschaftsdaten je Zeile neu tippen | Stammdaten mit Vorschlag | weniger Tippen, keine Schreibvarianten |
| `Monat` als Text ohne Jahr | aus dem Leerstandsbeginn abgeleitet | korrekte Sortierung über Jahre |
| Sharepoint-Link als Text | klickbarer Link | direkter Dokumentzugriff |
| Suchen = filtern und scrollen | Volltextsuche über alles | Sekunden statt Minuten |
| eine Datei, einer arbeitet | Mehrbenutzerbetrieb | keine Versionskonflikte |
| keine Historie | jede Änderung protokolliert | nachvollziehbar, revisionssicher |
| nur am PC mit Excel | Browser, auch Tablet vor Ort | Abnahme direkt in der Wohnung erfassen |
| Kennzahlen = 40 SUMMENPRODUKT | Auswertung live, filterbar, exportierbar | jederzeit aktuell |
| Hilfsspalten „nicht bearbeiten“ sichtbar | keine technischen Felder in der Oberfläche | nichts kaputt zu machen |

**Zeitersparnis** vor allem durch: Stammdaten statt Wiedereingabe, Aufgabenliste statt Filtern,
Kennzahlen ohne Zusammenstellen, Erfassung vor Ort statt Notizzettel und Nacherfassung.
**Fehlerreduktion** vor allem durch: keine 146-Zeilen-Grenze, geprüfte Datumsfelder,
erzwungene Vollständigkeit beim Abschluss, eindeutige Zuständigkeit, richtige Leerstandsberechnung.

---

## Nächster Schritt

Phase 5–8 umgesetzt: der Prototyp liegt unter `prototyp/leerstandsmanager.html`.
