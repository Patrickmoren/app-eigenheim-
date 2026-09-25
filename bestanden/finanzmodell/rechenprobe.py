# -*- coding: utf-8 -*-
"""Rechenprobe: rechnet alle drei Szenarien unabhängig in Python nach und
vergleicht Umsatz, operatives Ergebnis und Kasse mit den Formeln der Arbeitsmappe."""
import warnings; warnings.filterwarnings("ignore")
from annahmen import A, SZENARIEN, JAHRE

def wert(key, s, i, A=A):
    for e in A:
        if e[0] == key:
            w = e[3][s]
            return w[i] if isinstance(w, list) else w
    raise KeyError(key)

def rechne(s, A=A):
    g = lambda k, i: wert(k, s, i, A)
    res, kasse, betr_v = [], g("kasse0", 0), 0
    for i in range(5):
        lern = g("lern", i); b2bl = lern * g("pen", i); betr = b2bl / g("lpb", i)
        neub = betr if i == 0 else max(0, betr - betr_v * (1 - g("churn", i)))
        ck = lern * g("qv", i) * (1 - g("pen", i)) * g("conv", i)
        ub, uc, uo = b2bl * g("preis_b", i), ck * g("preis_c", i), g("oda", i) * g("preis_oda", i)
        u = ub + uc + uo
        akt = b2bl * g("aktiv", i) + ck
        var = uc * g("zahl_c", i) + (ub + uo) * g("zahl_b", i) + akt * (g("ki", i) + g("host", i))
        neu_ber = g("berufe", i) if i == 0 else max(0, g("berufe", i) - g("berufe", i - 1))
        content = neu_ber * g("c_neu", i) + (0 if i == 0 else g("berufe", i - 1) * g("c_pfl", i))
        mk = ck * (1 - g("org", i)) * g("cac_c", i) + neub * g("cac_b", i) + g("mk_fix", i)
        fix = g("fte", i) * g("k_fte", i) + content + g("tech", i) + mk + g("admin", i)
        ebit = u - var - fix
        kasse += ebit
        res.append((u, ebit, kasse)); betr_v = betr
    return res

if __name__ == "__main__":
    from auswerten import uebersicht
    zeilen, _ = uebersicht()
    excel, s = {}, None
    for t, v in zeilen:
        if t in SZENARIEN: s = t; continue
        excel[(s, t)] = v
    fehler = 0
    for s in SZENARIEN:
        py = rechne(s)
        for k, name in enumerate(["Umsatz", "Operatives Ergebnis", "Kasse Ende Jahr"]):
            for i in range(5):
                x, y = excel[(s, name)][i], py[i][k]
                if abs(x - y) > 0.5:
                    fehler += 1; print("ABWEICHUNG", s, name, JAHRE[i], x, y)
        print(f"{s:11s} Umsatz 2031 {py[4][0]:>12,.0f}  Ergebnis 2031 {py[4][1]:>12,.0f}  Kasse 2031 {py[4][2]:>12,.0f}")
    print("Rechenprobe:", "alle Werte stimmen überein" if fehler == 0 else f"{fehler} Abweichungen")
