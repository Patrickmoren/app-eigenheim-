# Daily Autonomous Loop (Anleitung für den Agenten)

1. **CHECK** – Gumroad-Verkäufe/Kundennachrichten (Export vom Inhaber oder Gumroad-API sobald Token freigegeben), Ads-Kosten.
2. **MEASURE** – jede Transaktion in `finance/ledger.csv`, dann `automation/daily_loop.sh`.
3. **FIND** – eine neue Opportunity prüfen und in `opportunities/opportunities.csv` bewerten.
4. **OPTIMIZE** – Keyword/Anzeigentext/Preis/Listing auf Basis der Zahlen anpassen (innerhalb Budget).
5. **KILL** – Abbruchkriterien aus `experiments/` anwenden.
6. **SCALE** – nur bei gemessenem positivem ROI; Grenzen aus `finance/config.json`.
7. **REINVEST** – 50/30/20 gemäss Report.
8. **REPORT** – Umsatz, Gewinn, Cash, Reinvestition, beste Opportunity, grösstes Problem, nächste Aktion.
