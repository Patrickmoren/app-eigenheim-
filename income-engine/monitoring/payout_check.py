# -*- coding: utf-8 -*-
"""Prüft je Einnahmequelle, ob eine Auszahlung möglich ist, und gibt einen PAYOUT-READY-Block aus.
Grundlage: Ledger (Einnahmen − Gebühren − bereits ausbezahlt). Ausgezahlte Beträge als Typ 'auszahlung' im Ledger erfassen."""
import csv, json, os
from collections import defaultdict
BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
streams = {s["id"]: s for s in json.load(open(os.path.join(BASIS, "accounts", "streams.json"), encoding="utf-8"))["streams"]}
saldo = defaultdict(float)
for r in csv.DictReader(open(os.path.join(BASIS, "finance", "ledger.csv"), encoding="utf-8")):
    b = float(r["betrag_chf"] or 0)
    saldo[r["projekt"]] += {"einnahme": b, "gebuehr": -b, "auszahlung": -b}.get(r["typ"], 0)
bereit = False
for sid, betrag in saldo.items():
    s = streams.get(sid)
    if not s or not s.get("auszahlung") or betrag <= 0:
        continue
    minimum = s["auszahlung"].get("minimum_usd") or s["auszahlung"].get("minimum_eur") or 0
    if betrag >= minimum:   # CHF ≈ USD/EUR; Plattform-Minimum grob geprüft
        bereit = True
        print(f"PAYOUT READY\nPlattform: {s['plattform']}\nBetrag: CHF {betrag:.2f}\nGebühr: gemäss Plattform (Bank CH meist 0)\n"
              f"Netto: ca. CHF {betrag:.2f}\nAuszahlungsweg: {s['auszahlung']['weg']}\n"
              f"Aktion erforderlich: keine bei automatischer Auszahlung – sonst in {s['plattform']} › Payouts bestätigen\n")
if not bereit:
    print("Keine Auszahlung bereit.")
