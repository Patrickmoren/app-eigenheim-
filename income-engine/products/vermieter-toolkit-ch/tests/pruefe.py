# -*- coding: utf-8 -*-
"""Rechnet die Beispielmappe mit LibreOffice neu und vergleicht mit einer unabhängigen Python-Rechnung."""
import os, subprocess, sys, tempfile, shutil
from datetime import date, timedelta
import openpyxl

HIER = os.path.dirname(os.path.abspath(__file__))
QUELLE = os.path.join(HIER, "..", "Vermieter-Toolkit-Schweiz-Beispiel.xlsx")
tmp = tempfile.mkdtemp()
subprocess.run(["soffice", "--headless", "--calc", "--convert-to", "xlsx", "--outdir", tmp, QUELLE],
               check=True, capture_output=True)
wb = openpyxl.load_workbook(os.path.join(tmp, os.path.basename(QUELLE)), data_only=True)
fehler = []

def gleich(name, ist, soll, tol=0.01):
    ok = ist is not None and abs(ist - soll) <= tol
    print(f"{'OK ' if ok else 'FEHLER'} {name}: ist={ist} soll={round(soll, 2)}")
    if not ok:
        fehler.append(name)

# --- unabhängige Referenzrechnung
von, bis = date(2025, 7, 1), date(2026, 6, 30)
tage = (bis - von).days + 1
hgt = {1: 18, 2: 15, 3: 13, 4: 9, 5: 4, 6: 0, 7: 0, 8: 0, 9: 3, 10: 8, 11: 13, 12: 17}
def heizanteil(a, b):
    s, d = 0.0, a
    while d <= b:
        nxt = (d.replace(day=28) + timedelta(days=4)).replace(day=1)
        s += hgt[d.month] / (nxt - d.replace(day=1)).days
        d += timedelta(days=1)
    return s / 100
flaeche = {"EG links": 68, "EG rechts": 82, "1. OG links": 68, "1. OG rechts": 82, "DG": 95}
volumen = {"EG links": 170, "EG rechts": 205, "1. OG links": 170, "1. OG rechts": 205, "DG": 260}
mieter = [("EG links", von, bis, 2400), ("EG rechts", von, date(2025, 12, 31), 1350),
          ("EG rechts", date(2026, 2, 1), bis, 1000), ("1. OG links", von, bis, 2400),
          ("1. OG rechts", von, bis, 2700), ("DG", von, bis, 3000)]
heiz = 9800 + 780
wasser, strom, hw = 2600, 420, 3200          # Kehricht (nicht im Vertrag) und Reparatur fallen weg
erwartet = []
for e, a, b, ak in mieter:
    zeit = ((b - a).days + 1) / tage
    nk = (heiz * volumen[e] / 1010 * heizanteil(a, b)
          + (wasser + hw) * flaeche[e] / 395 * zeit + strom / 5 * zeit)
    tot = round(nk + round(nk * 0.03, 2), 2)
    erwartet.append((nk, tot, tot - ak))

V = wb["Verteilung"]
hdr = {V.cell(row=5, column=c).value: c for c in range(1, 40)}
c_nk, c_tot, c_sal = hdr["Nebenkosten"], hdr["Total Anteil"], hdr["Saldo (+ Nachzahlung / − Guthaben)"]
for i, (nk, tot, sal) in enumerate(erwartet):
    gleich(f"Mieter {i+1} Nebenkosten", V.cell(row=6 + i, column=c_nk).value, nk)
    gleich(f"Mieter {i+1} Saldo", V.cell(row=6 + i, column=c_sal).value, sal)
abrechenbar = heiz + wasser + strom + hw
gleich("Abrechenbar (Kosten)", wb["Kosten"]["C27"].value, abrechenbar)
gleich("Mieter + Vermieter = abrechenbar",
       V.cell(row=36, column=c_nk).value + V.cell(row=37, column=c_nk).value, abrechenbar)
leer_heiz = heiz * 205 / 1010 * 0.18                                # Januar leer
leer_rest = (wasser + hw) * 82 / 395 * 31 / tage + strom / 5 * 31 / tage
gleich("Vermieteranteil Leerstand", V.cell(row=37, column=c_nk).value, leer_heiz + leer_rest)
k = str(V["D40"].value)
print("Kontrollsumme:", k); fehler += [] if k.startswith("✓") else ["Kontrollsumme"]

# Prüfungen im Blatt Mieter
for r in range(6, 12):
    s = wb["Mieter"][f"M{r}"].value
    if s != "✓":
        fehler.append(f"Mieter Zeile {r}: {s}")

# Abrechnung Mieter 3
A = wb["Abrechnung"]
gleich("Abrechnung Mieter 1 Total", A["G36"].value, erwartet[0][1])

# Mietzins: 1.75 -> 1.25 = 2 Schritte Senkung: 1/1.06-1
Z = wb["Mietzins"]
gleich("Referenzzins-Effekt", Z["C16"].value * 100, (1 / 1.06 - 1) * 100, 0.001)
gleich("Teuerung", Z["C17"].value * 100, (107.4 / 106.2 - 1) * 40, 0.001)
gleich("Kostensteigerung (42 Mte)", Z["C18"].value * 100, 0.5 * 42 / 12, 0.001)
tot = (1 / 1.06 - 1) + (107.4 / 106.2 - 1) * 0.4 + 0.005 * 42 / 12
gleich("Neuer Mietzins", Z["C21"].value, round(1850 * (1 + tot) * 20) / 20)
print("Zustellung spätestens:", Z["C27"].value)
if Z["C27"].value.date() != date(2026, 12, 21):
    fehler.append("Zustelltermin")

# Mieterwechsel
print("Mieterwechsel:", wb["Mieterwechsel"]["C31"].value)
shutil.rmtree(tmp)
print("\nERGEBNIS:", "alles korrekt" if not fehler else f"{len(fehler)} Fehler: {fehler}")
sys.exit(1 if fehler else 0)
