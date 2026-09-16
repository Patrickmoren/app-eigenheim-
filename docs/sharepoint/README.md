# Aufbauanleitung SharePoint-Liste

`Aufbauanleitung-SharePoint-Liste.docx` ist die Arbeitsanleitung, um die Leerstandsliste als
SharePoint-Liste aufzusetzen – ohne IT, ohne eigene Infrastruktur, für die Nutzung am PC.

Diese Variante wurde bewusst gewählt: kein mobiler Zugriff, keine eigene Web-Applikation.
Sie behebt die technischen Mängel des Excels (gemeinsamer Zugriff, Zeilengrenze, Historie,
geprüfte Datumsfelder) und verzichtet auf die Führung durch den Prozess. Abschnitt 10 des
Dokuments hält fest, was dadurch fehlt.

| Ordner | Inhalt |
|---|---|
| `formatierung/` | vier JSON-Dateien für Zeilen- und Spaltenformatierung, direkt in SharePoint einfügbar |

Kernentscheide der Umsetzung:

- **Ein Datumsfeld je Schritt statt Ja/Nein** – damit ist festgehalten, *wann* etwas erledigt wurde.
  Wer es erledigt hat, steht im Versionsverlauf.
- **Eine Liste statt zwei** – bei Verzicht auf die Führung ist eine Schrittliste unnötiger Ballast.
- **Technische Spaltennamen zuerst, dann umbenennen** – SharePoint friert den internen Namen beim
  Anlegen ein; Umlaute und Leerzeichen erzeugen sonst unlesbare Bezeichner in Formeln und JSON.
- **Neun Ansichten** – die Liste hat rund vierzig Spalten, aber jede Ansicht zeigt sechs bis zehn.
- **Zwei Abläufe in Power Automate** – berechnete Spalten dürfen in SharePoint kein HEUTE()
  verwenden, deshalb schreiben die Abläufe Leerstandstage und «überfällig».

Erzeugt mit `node build.js` (benötigt `npm install docx`).
