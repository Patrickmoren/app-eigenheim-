# -*- coding: utf-8 -*-
"""Rechnet alle Formeln der Arbeitsmappe mit der Bibliothek «formulas» durch.
Aufruf: python3 auswerten.py [Datei]"""
import sys, os, warnings
warnings.filterwarnings("ignore")
import openpyxl, formulas

DATEI = sys.argv[1] if len(sys.argv) > 1 else "Finanzmodell-bestanden.xlsx"

def rechnen(datei=DATEI):
    loesung = formulas.ExcelModel().loads(datei).finish().calculate()
    name = os.path.basename(datei).upper()
    out = {}
    for k, v in loesung.items():
        if f"[{name}]" in k.upper() and "!" in k and ":" not in k.split("!")[1]:
            blatt = k.split("]")[1].split("'!")[0].upper()
            zelle = k.split("!")[1].upper()
            x = v.value[0][0] if hasattr(v, "value") else v
            out[(blatt, zelle)] = x
    return out

def uebersicht(datei=DATEI):
    werte = rechnen(datei)
    wb = openpyxl.load_workbook(datei)
    U = wb["Übersicht"]
    zeilen = []
    for r in range(4, U.max_row + 1):
        t = U[f"A{r}"].value
        if t is None: continue
        zeilen.append((t, [werte.get(("ÜBERSICHT", f"{c}{r}"), U[f"{c}{r}"].value) for c in "CDEFG"]))
    return zeilen, werte

def fmt(x):
    if isinstance(x, (int, float)):
        return f"{x:>12,.0f}".replace(",", "'") if abs(x) >= 2 or x == 0 else f"{x:>12.1%}"
    return f"{'' if x is None else str(x):>12s}"

if __name__ == "__main__":
    zeilen, werte = uebersicht()
    for t, v in zeilen:
        print(f"{t:44s}", " ".join(fmt(x) for x in v))
    print()
    for r in range(4, 24):
        b, c = werte.get(("ZIELRECHNUNG CHF 7–10 MIO.", f"B{r}")), werte.get(("ZIELRECHNUNG CHF 7–10 MIO.", f"C{r}"))
        if b is not None: print(f"Ziel B{r}/C{r}", fmt(b), fmt(c))
