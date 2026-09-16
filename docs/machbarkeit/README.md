# Machbarkeitsprüfung Power Apps

`Machbarkeitspruefung-PowerApps.docx` prüft, ob sich der Prototyp auf Microsoft Power Apps über
SharePoint-Listen abbilden lässt – also innerhalb der bestehenden Microsoft-365-Umgebung und
ohne eigene Serverinfrastruktur.

Hintergrund: Eine SharePoint-Liste allein behebt die technischen Mängel des Excels, nicht den
konzeptionellen – eine Checkliste bleibt als Tabelle geführt. Power Apps ist die einzige Variante,
die die Führung durch den Prozess erhält und trotzdem ohne eigene Infrastruktur auskommt.

Kurzfassung des Ergebnisses:

| | |
|---|---|
| Machbar | ja, rund vier Fünftel des Verhaltens; die fachlichen Regeln vollständig |
| Aufwand | 27–38 Personentage |
| Lizenz | vermutlich in den bestehenden M365-Plänen enthalten, solange nur Standardverbindungen verwendet werden – vor Umsetzung zu bestätigen |
| Hauptpreis | Wartbarkeit: Logik in Formeln, kaum prüf- und versionierbar |

Erzeugt mit `node build.js` (benötigt `npm install docx`).
