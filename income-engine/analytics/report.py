# -*- coding: utf-8 -*-
"""Liest finance/ledger.csv und erzeugt dashboard/index.html sowie logs/report-<datum>.md.

Ledger-Typen: einnahme (Umsatz brutto), gebuehr (Plattform-/Zahlungsgebühren), ausgabe (Tools, Ads, Domains),
              zeit (nur Stunden). Kanal = Herkunft des Verkaufs (z. B. gumroad, google-ads, seo, direkt).
"""
import csv, json, os, html
from collections import defaultdict
from datetime import date

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(os.path.join(BASIS, "finance", "config.json"), encoding="utf-8"))
rows = list(csv.DictReader(open(os.path.join(BASIS, "finance", "ledger.csv"), encoding="utf-8")))

p = defaultdict(lambda: defaultdict(float))
for r in rows:
    b = float(r["betrag_chf"] or 0)
    p[r["projekt"]][r["typ"]] += b
    p[r["projekt"]]["stunden"] += float(r["stunden"] or 0)
    if r["typ"] == "einnahme":
        p[r["projekt"]]["verkaeufe"] += 1
        p[r["projekt"]]["kanal_" + r["kanal"]] += 1

umsatz = sum(v["einnahme"] for v in p.values())
kosten = sum(v["ausgabe"] + v["gebuehr"] for v in p.values())
gewinn = umsatz - kosten
stunden = sum(v["stunden"] for v in p.values())
vt = cfg["verteilung_gewinn"]
pos = max(gewinn, 0)
reinvest, reserve, entnahme = pos * vt["reinvestition"], pos * vt["reserve"], pos * vt["entnahme"]
cash = cfg["startkapital_freigegeben_chf"] + gewinn
aktiv = [k for k, v in p.items() if v["einnahme"] > 0]

def roi(v):
    k = v["ausgabe"] + v["gebuehr"]
    return "n/a" if k == 0 else f"{(v['einnahme'] - k) / k:.0%}"

kpis = [("CASH", cash), ("REVENUE", umsatz), ("PROFIT", gewinn), ("REINVESTMENT", reinvest),
        ("WITHDRAWABLE", entnahme), ("ACTIVE PROJECTS", len(aktiv)), ("HOURS INVESTED", stunden)]
heute = date.today().isoformat()

zeilen = "".join(
    f"<tr><td>{html.escape(k)}</td><td>{v['einnahme']:.2f}</td><td>{v['ausgabe'] + v['gebuehr']:.2f}</td>"
    f"<td>{v['einnahme'] - v['ausgabe'] - v['gebuehr']:.2f}</td><td>{int(v['verkaeufe'])}</td><td>{roi(v)}</td></tr>"
    for k, v in sorted(p.items()))
karten = "".join(
    f'<div class="k"><div class="l">{n}</div><div class="v">{(f"CHF {w:,.2f}" if isinstance(w, float) and n != "HOURS INVESTED" else (f"{w:g}" if isinstance(w, float) else w))}</div></div>'
    for n, w in kpis)
seite = f"""<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Money Dashboard</title><style>
:root{{--bg:#f6f8f9;--fg:#1f2a30;--card:#fff;--muted:#5a6b72;--accent:#1e5f74;--line:#dfe6e9}}
@media (prefers-color-scheme:dark){{:root{{--bg:#12181b;--fg:#e6edf0;--card:#1b2428;--muted:#9fb0b6;--accent:#6fb6cc;--line:#2c383d}}}}
body{{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif;padding:24px 16px}}
main{{max-width:960px;margin:auto}}h1{{font-size:22px;margin:0 0 4px}}.s{{color:var(--muted);font-size:13px;margin-bottom:20px}}
.g{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}}
.k{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px}}
.l{{font-size:11px;letter-spacing:.06em;color:var(--muted)}}.v{{font-size:20px;font-weight:600;margin-top:4px;font-variant-numeric:tabular-nums}}
table{{width:100%;border-collapse:collapse;margin-top:24px;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}}
td,th{{padding:8px 10px;border-bottom:1px solid var(--line);text-align:right;font-variant-numeric:tabular-nums}}td:first-child,th:first-child{{text-align:left}}
th{{font-size:12px;color:var(--muted);font-weight:600}}</style></head><body><main>
<h1>Money Dashboard</h1><div class="s">Stand {heute} · Quelle finance/ledger.csv · Verteilung Gewinn {vt['reinvestition']:.0%} / {vt['reserve']:.0%} / {vt['entnahme']:.0%}</div>
<div class="g">{karten}</div>
<table><tr><th>Projekt</th><th>Umsatz CHF</th><th>Kosten CHF</th><th>Gewinn CHF</th><th>Verkäufe</th><th>ROI</th></tr>{zeilen}</table>
</main></body></html>"""
os.makedirs(os.path.join(BASIS, "dashboard"), exist_ok=True)
open(os.path.join(BASIS, "dashboard", "index.html"), "w", encoding="utf-8").write(seite)

bericht = f"""# Tagesbericht {heute}

| Kennzahl | Wert |
|---|---|
| Umsatz | CHF {umsatz:.2f} |
| Kosten | CHF {kosten:.2f} |
| Gewinn | CHF {gewinn:.2f} |
| Cash | CHF {cash:.2f} |
| Reinvestition (Soll) | CHF {reinvest:.2f} |
| Reserve (Soll) | CHF {reserve:.2f} |
| Entnehmbar | CHF {entnahme:.2f} |
| Aktive Einnahmequellen | {len(aktiv)} |
"""
open(os.path.join(BASIS, "logs", f"report-{heute}.md"), "w", encoding="utf-8").write(bericht)
print(bericht)
