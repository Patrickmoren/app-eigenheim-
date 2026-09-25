# -*- coding: utf-8 -*-
"""Bewertung der Kandidaten für den ersten Beruf. Punkte 1–5, Gewichte in Prozent.
Aufruf: python3 matrix.py  →  gibt die Rangliste als Markdown-Tabelle aus."""
GEWICHT = {"Grösse": 15, "Nichtbestehen": 20, "Lücke": 20, "Aufwand": 15, "Zahlung": 10, "Verband": 10, "Pilot": 10}
#            Beruf                         G  N  L  A  Z  V  P
K = [("Sanitärinstallateur/in EFZ",        2, 5, 3, 2, 4, 4, 4),
     ("Heizungsinstallateur/in EFZ",       1, 5, 3, 2, 4, 4, 3),
     ("Montage-Elektriker/in EFZ",         2, 5, 1, 2, 4, 3, 3),
     ("Elektroinstallateur/in EFZ",        3, 4, 1, 2, 4, 3, 3),
     ("Automobil-Fachmann/-frau EFZ",      2, 4, 2, 3, 3, 2, 2),
     ("Kaufmann/-frau EFZ",                5, 2, 1, 3, 3, 1, 3),
     ("Fachmann/-frau Gesundheit EFZ",     4, 1, 1, 3, 3, 2, 3),
     ("Fachmann/-frau Betreuung EFZ",      4, 2, 1, 3, 2, 2, 2),
     ("Detailhandelsfachmann/-frau EFZ",   4, 1, 1, 4, 2, 1, 3),
     ("Informatiker/in EFZ",               3, 1, 1, 2, 3, 2, 2),
     ("Koch/Köchin EFZ",                   2, 1, 2, 3, 2, 2, 2)]
def punkte(z):
    return sum(w * p for w, p in zip(GEWICHT.values(), z[1:])) / 5
if __name__ == "__main__":
    print("| Rang | Beruf | " + " | ".join(GEWICHT) + " | Total (von 100) |")
    print("|---:|---|" + "---:|" * (len(GEWICHT) + 1))
    for i, z in enumerate(sorted(K, key=punkte, reverse=True), 1):
        print(f"| {i} | {z[0]} | " + " | ".join(str(p) for p in z[1:]) + f" | **{punkte(z):.0f}** |")
