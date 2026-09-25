# -*- coding: utf-8 -*-
"""Wie stark hängt das Basisszenario an einzelnen Annahmen? Ändert je eine Annahme
und zeigt Umsatz 2031, Ergebnis 2031 und Finanzierungsbedarf bis 2031."""
import copy
from annahmen import A
from rechenprobe import rechne

def mit(key, faktor=None, wert=None):
    B = copy.deepcopy(A)
    for n, e in enumerate(B):
        if e[0] == key:
            w = e[3]["Basis"]
            neu = [x * faktor for x in w] if isinstance(w, list) and faktor else \
                  (w * faktor if faktor else wert)
            e[3]["Basis"] = neu
    return B

FAELLE = [("Basis wie im Modell", A),
          ("Preis B2B −30 %", mit("preis_b", 0.7)),
          ("Akquisekosten je Betrieb +50 %", mit("cac_b", 1.5)),
          ("Kündigungsrate 25 % statt 18 %", mit("churn", wert=0.25)),
          ("Anteil lizenzierte Lernende −30 %", mit("pen", 0.7)),
          ("Lernende je Betrieb 2,0 statt 2,5", mit("lpb", wert=2.0)),
          ("KI-Kosten × 3", mit("ki", wert=9)),
          ("Personal −30 %", mit("fte", 0.7))]
print("| Fall | Umsatz 2031 | Ergebnis 2031 | Finanzierungsbedarf bis 2031 |")
print("|---|---:|---:|---:|")
for name, B in FAELLE:
    r = rechne("Basis", B)
    bedarf = max(0, -min(x[2] for x in r))
    f = lambda x: f"{x:,.0f}".replace(",", "'")
    print(f"| {name} | {f(r[4][0])} | {f(r[4][1])} | {f(bedarf)} |")
