# Income Engine

Portfolio kleiner, automatisierter Einnahmequellen. Start: **Vermieter-Toolkit Schweiz** (Score 80/100).

| Ordner | Inhalt |
|---|---|
| `research/STRATEGY-REPORT.md` | Strategiebericht (20+ Opportunities, Entscheid, Pläne) |
| `opportunities/` | Bewertungsdaten + `score.py` |
| `products/vermieter-toolkit-ch/` | Produkt: `build.py`, Prüfskript `tests/pruefe.py`, fertige .xlsx |
| `launch/` | Landingpage, Gumroad-Listing, Community-Entwürfe |
| `experiments/` | Experimente mit Hypothese, Budget, Abbruchkriterien |
| `finance/` | `ledger.csv` (jede Einnahme/Ausgabe), `config.json` (Budget, Verteilung) |
| `analytics/report.py` | erzeugt `dashboard/index.html` und `logs/report-<datum>.md` |
| `automation/daily_loop.sh` | täglicher Loop (Tests, Report) |
| `logs/actions.log` | Protokoll aller Aktionen |
| `APPROVALS.md` | **was Sie freigeben bzw. selbst tun müssen** |
| `agents/`, `customers/` | Daily-Loop-Anleitung; Kundenanfragen/Rückerstattungen (noch leer) |

Verkauf erfassen: Zeile in `finance/ledger.csv` (`einnahme` brutto + separate Zeile `gebuehr`), dann `automation/daily_loop.sh`.
