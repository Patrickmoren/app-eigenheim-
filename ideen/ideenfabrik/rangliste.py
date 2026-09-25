# -*- coding: utf-8 -*-
"""Bewertet den Katalog und schreibt katalog.csv und die Rangliste (Top 30) auf die Konsole."""
import csv
from katalog import K_
GEWICHT = dict(M=3, Z=3, S=2, W=2, V=2, K=2, D=2)   # Summe 16, Maximum 80 Punkte
def punkte(z):
    m, zb, s, w, v, k, d = z[3:]
    roh = m*3 + zb*3 + s*2 + w*2 + v*2 + k*2 + d*2
    return round(roh / 80 * 100)
zeilen = sorted(((punkte(z),) + z for z in K_), key=lambda r: -r[0])
with open("katalog.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["Punkte","Segment","Bedürfnis","Idee","M","Z","S","W","V","K","D"])
    w.writerows(zeilen)
if __name__ == "__main__":
    for r in zeilen[:30]:
        print(f"{r[0]:3d}  {r[1]:<22s} {r[3]:<42s} M{r[4]} Z{r[5]} S{r[6]} W{r[7]} V{r[8]} K{r[9]} D{r[10]}")
    print(len(zeilen), "Ideen bewertet")
