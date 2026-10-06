"""Bewertet alle Opportunities und schreibt die Rangliste.

Kernkennzahl: erwarteter Nettogewinn pro menschlicher Stunde.
Aufruf: python3 score.py  ->  ranking.md
"""
import csv
import math
import os

HIER = os.path.dirname(os.path.abspath(__file__))
GEBUEHR = 0.10          # pauschal Plattform + Zahlungsgebuehren
MIN_STUNDEN = 0.25      # Untergrenze, damit 0 Minuten nicht unendlich ergibt


def bewerte(z):
    umsatz = float(z["umsatz_monat_chf"])
    kosten = float(z["startkosten_chf"]) / 12          # ueber ein Jahr verteilt
    netto = umsatz * (1 - GEBUEHR) - kosten
    stunden = max(MIN_STUNDEN, float(z["human_min_woche"]) * 52 / 12 / 60)
    pph = netto / stunden
    if z["agent_darf_arbeiten"] == "nein":
        return netto, pph, 0
    s = min(40, 13.3 * math.log10(1 + max(0, pph)))
    s += float(z["automation_pct"]) / 5
    s += min(15, umsatz / 20)
    s += (5 - int(z["risiko_1_5"])) * 2.5
    s += (int(z["auszahlung_1_5"]) - 1) * 2.5
    s += max(0, 5 - float(z["startkosten_chf"]) / 10)
    if z["agent_darf_arbeiten"] == "bedingt":
        s -= 10
    return netto, pph, round(min(100, s))


def main():
    with open(os.path.join(HIER, "opportunities.csv"), encoding="utf-8") as f:
        zeilen = list(csv.DictReader(f))
    for z in zeilen:
        z["netto"], z["pph"], z["score"] = bewerte(z)
    zeilen.sort(key=lambda z: (z["score"], z["pph"]), reverse=True)

    out = ["| Rang | Opportunity | Start CHF | Automation | Umsatz/Mt CHF | Mensch min/Wo | Netto/Mensch-h CHF | Score |",
           "|---:|---|---:|---:|---:|---:|---:|---:|"]
    for i, z in enumerate(zeilen, 1):
        score = z["score"] if z["score"] else "K.O."
        out.append(f"| {i} | {z['name']} | {z['startkosten_chf']} | {z['automation_pct']} % | "
                   f"{z['umsatz_monat_chf']} | {z['human_min_woche']} | {z['pph']:.0f} | {score} |")
    with open(os.path.join(HIER, "ranking.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    print("\n".join(out))


if __name__ == "__main__":
    main()
