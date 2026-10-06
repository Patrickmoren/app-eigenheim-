"""Score 0–100 mit Schwerpunkt Gewinn pro menschliche Stunde (Ihre Zeit). Ausschlussgrund → STOP."""
import csv, math, os, sys
rows = list(csv.DictReader(open(os.path.join(os.path.dirname(__file__), "top50.csv"), encoding="utf-8")))
def kap(c): c = float(c); return 10 if c == 0 else 8 if c <= 20 else 5 if c <= 50 else 2
for r in rows:
    u, h = float(r["umsatz_mt"]), max(float(r["user_h_mt"]), 0.1)
    r["pphh"] = u / h
    s = (30 * min(10, r["pphh"] / 20) + 20 * float(r["automation"]) / 10 + 15 * min(10, u / 30)
         + 10 * kap(r["start_chf"]) + 10 * float(r["skalierung"]) + 10 * float(r["risiko"]) + 5 * float(r["zuverl"])) / 10
    r["score"] = round(s)
rows.sort(key=lambda r: (bool(r["ausschluss"]), -r["score"]))
print("| # | Möglichkeit | Start CHF | realist. CHF/Mt | Ihre h/Mt | CHF/Ihre h | Autom. | Score | Status |\n|---|---|---|---|---|---|---|---|---|")
rang = 0
for r in rows:
    rang += 1
    st = ("STOP – " + r["ausschluss"]) if r["ausschluss"] else ("TEST" if rang <= 5 else "TOP 10" if rang <= 10 else "WATCH")
    print(f"| {rang} | {r['name']} | {r['start_chf']} | {r['umsatz_mt']} | {r['user_h_mt']} | {r['pphh']:.0f} | {r['automation']} % | {r['score']} | {st} |")
