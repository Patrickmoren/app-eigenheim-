# -*- coding: utf-8 -*-
"""Rechnet alle Formeln der Arbeitsmappe mit der Bibliothek «formulas» durch
und gibt die Übersicht aus. Aufruf: python3 auswerten.py [Datei] [Szenario]"""
import sys, warnings, tempfile, os
warnings.filterwarnings("ignore")
import openpyxl, formulas

datei = sys.argv[1] if len(sys.argv) > 1 else "Finanzmodell-Hausklar.xlsx"
if len(sys.argv) > 2:
    wb = openpyxl.load_workbook(datei)
    wb["Annahmen"]["C4"] = sys.argv[2]
    datei = os.path.join(tempfile.mkdtemp(), "szenario.xlsx"); wb.save(datei)

xl = formulas.ExcelModel().loads(datei).finish()
loesung = xl.calculate()
name = os.path.basename(datei).upper()

def wert(blatt, zelle):
    for k, v in loesung.items():
        if k.upper().endswith(f"[{name}]{blatt.upper()}'!{zelle}"):
            x = v.value[0][0] if hasattr(v, "value") else v
            return x
    return None

def werte():
    wb = openpyxl.load_workbook(datei)
    U = wb["Übersicht"]
    zeilen = {}
    for r in range(5, 17):
        t = U[f"A{r}"].value
        zeilen[t] = [wert("ÜBERSICHT", f"{c}{r}") for c in "CDEFG"]
    return zeilen

if __name__ == "__main__":
    for t, v in werte().items():
        print(f"{t:32s}", "  ".join(f"{x:>12,.0f}" if isinstance(x, (int, float)) and abs(x) > 5 else f"{str(x):>12s}" if not isinstance(x,(int,float)) else f"{x:>12.2f}" for x in v))
