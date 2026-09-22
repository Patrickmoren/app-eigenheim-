# Prüfprotokoll zur Leerstandsliste

Die Datei wurde nicht nur erzeugt, sondern durchgerechnet und mit unabhängig
berechneten Erwartungswerten verglichen. Was geprüft wurde und was nicht,
steht hier vollständig – auch die Grenzen der Prüfung.

## Was geprüft wurde

| Prüfung | Skript | Umfang |
|---|---|---|
| Aufbau, Spaltenschutz, Verweise, Zirkelbezüge, Prüfregeln, Einfärbung | `pruefung_statisch.py` | 32 Einzelprüfungen |
| Grenzen von Excel, Zip- und XML-Struktur, Auswahllisten, Formate | `grenzwerte.py` | 26 Einzelprüfungen |
| Formelergebnisse Arbeitsblatt | `rechenprobe.py` | 4 800 Formelzellen über 400 Zeilen |
| Formelergebnisse Beispielblatt | `rechenprobe.py … Beispiele` | 120 Formelzellen |
| Erzwungene Lastfälle | `lastfaelle.py` + `rechenprobe.py` | 32 Zeilen, 480 Formelzellen |
| Abdeckung der Verzweigungen | `abdeckung.py` | jeder Status, jeder Prüfhinweis |
| Verhalten über die Zeit | `lastfaelle.py` mit `VERSATZ` | 11 Stichtage von −400 bis +400 Tagen |

Alles zusammen mit `./pruefe_alles.sh` wiederholbar.

Die Erwartungswerte sind in `rechenprobe.py` bewusst ein zweites Mal
ausformuliert und nicht aus `build.py` übernommen. Stimmen Aufbau und
Erwartung nicht überein, fällt der Test durch.

## Drei Fehler, die dabei gefunden und behoben wurden

**1 · Zählformeln, die auch leere Zeilen mitzählen.**
`COUNTIF(Bereich;"<>")` und `COUNTIF(Bereich;"?*")` liefern je nach
Excel-Fassung unterschiedliche Ergebnisse. In der Prüfung zählte
«Fälle gesamt» 30 statt 10. Diese Kurzformen kommen in der Datei nicht mehr
vor. «Fälle gesamt» ist jetzt die Summe der vier Status – damit stimmt jede
Zeile in sich selbst. Datumsbedingungen laufen über `">"&DATE(1900;1;1)`.

**2 · «Nächster Schritt» nannte etwas anderes als die überfällige Frist.**
Eine rote Zeile konnte auf einen ganz anderen Arbeitsschritt zeigen als
jenen, dessen Frist verstrichen war. Für ein Werkzeug, das Vergessenes
verhindern soll, ist das der gefährlichste denkbare Fehler. Status und
«Nächster Schritt» greifen jetzt auf dieselbe Fristenliste zu und können
nicht mehr auseinanderlaufen; eine verstrichene Frist steht immer zuoberst.

**3 · Die Beispielzeilen liessen sich nicht löschen.**
Sie standen im Arbeitsblatt, und in diesen Zeilen liegen auch gesperrte
Formelzellen. Wer die Zeilen markiert und löscht, wird vom Blattschutz
abgewiesen – ausgerechnet beim allerersten Handgriff. Die Beispiele stehen
jetzt auf einem eigenen Blatt. «Leerstände» ist leer und sofort einsatzbereit.

## Zwei weitere Fehler aus dem zweiten Durchgang

**4 · Das Beispielblatt versprach etwas, was es nicht hielt.**
Im Kopf stand «Hier darf gefahrlos ausprobiert werden», während der
Blattschutz sämtliche Zellen sperrte – ausprobieren war also unmöglich.
Die Eingabefelder sind jetzt offen, die Formelspalten bleiben geschützt.

**5 · «BS Gesamt» hiess in den Kennzahlen nur «Gesamt».**
Angefordert waren drei Gruppierungen: BS 01, BS 02 und BS Gesamt. Die
Summenzeile heisst jetzt «Total BS Gesamt» und steht damit gleichwertig
neben «Total BS 01» und «Total BS 02».

Ebenfalls im zweiten Durchgang neu geprüft und in Ordnung: die
Verschachtelungstiefe der Formeln (32 von 64 zulässigen Ebenen), die
Formellänge (1 581 von 8 192 Zeichen), die Wohlgeformtheit aller
XML-Teile, die Zuordnung aller 19 Prozessschritte zu ihren Spalten und
die Abdeckung der Auswahllisten über alle 400 Zeilen.

## Grenzen dieser Prüfung

Gerechnet hat nicht Excel selbst, sondern die Python-Bibliothek `formulas`
(LibreOffice war in dieser Umgebung nicht brauchbar). Zwei Abweichungen
dieser Bibliothek gegenüber Excel sind bekannt und wurden gemessen:
`SUMPRODUCT` über Bereiche mit Leerzellen und die oben genannten
Kurzformen `"<>"` und `"?*"`. Beide werden in der Datei nirgends verwendet –
gerade deshalb nicht.

Nicht maschinell geprüft werden konnten: das Schriftbild beim Öffnen, das
Verhalten der Auswahllisten in Excel im Browser und das gleichzeitige
Bearbeiten durch mehrere Personen auf SharePoint. Dazu gehört ein
praktischer Test zu zweit, bevor die Datei in den Betrieb geht.

Ein Punkt verdient dabei besondere Aufmerksamkeit: der Blattschutz. Er
schützt die zwölf Formelspalten vor dem Überschreiben und ist ohne Passwort
gesetzt. Sollte Excel im Browser das Bearbeiten deswegen verweigern, lässt
er sich mit zwei Klicks entfernen – Überprüfen → Blattschutz aufheben.
