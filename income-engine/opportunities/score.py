"""Gewichteter Opportunity-Score 0–100 nach Masterprompt Abschnitt 5.
Teilscores 0–10; bei Wettbewerb/Kapital/Risiko gilt: 10 = günstig (wenig Wettbewerb, wenig Kapital, wenig Risiko)."""
import csv, os, sys
W = {"nachfrage": 20, "monetarisierung": 20, "automatisierung": 20, "wettbewerb": 10,
     "skalierbarkeit": 15, "kapital": 10, "risiko": 5}
rows = list(csv.DictReader(open(os.path.join(os.path.dirname(__file__), "opportunities.csv"), encoding="utf-8")))
for r in rows:
    r["score"] = round(sum(float(r[k]) * w for k, w in W.items()) / 10)
rows.sort(key=lambda r: -r["score"])
md = "--md" in sys.argv
if md:
    print("| Rang | ID | Opportunity | Score | Entscheid |\n|---|---|---|---|---|")
for i, r in enumerate(rows, 1):
    ent = "TOP 5" if i <= 5 else ("≥70, zurückgestellt" if r["score"] >= 70 else "verworfen")
    print(f"| {i} | {r['id']} | {r['name']} | **{r['score']}** | {ent} |" if md
          else f"{i:2} {r['id']} {r['score']:3}  {r['name']}")
