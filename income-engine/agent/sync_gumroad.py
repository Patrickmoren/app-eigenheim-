# -*- coding: utf-8 -*-
"""Holt Verkäufe über die Gumroad-API und trägt neue in finance/ledger.csv ein (Umsatz + Gebühr, ohne Duplikate).
Benötigt Umgebungsvariable GUMROAD_ACCESS_TOKEN (Gumroad › Settings › Advanced › Applications › Access Token).
Ohne Token: meldet es und endet ohne Fehler, damit der Tagesloop weiterläuft."""
import csv, json, os, sys, urllib.parse, urllib.request
BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER = os.path.join(BASIS, "finance", "ledger.csv")
token = os.environ.get("GUMROAD_ACCESS_TOKEN")
if not token:
    print("gumroad: kein Token gesetzt – übersprungen"); sys.exit(0)
bekannt = {r["ref"] for r in csv.DictReader(open(LEDGER, encoding="utf-8")) if r.get("ref")}
neu, url = [], "https://api.gumroad.com/v2/sales?" + urllib.parse.urlencode({"access_token": token})
while url:
    d = json.load(urllib.request.urlopen(url, timeout=30))
    if not d.get("success"):
        print("gumroad: Fehler", d.get("message")); sys.exit(1)
    for s in d.get("sales", []):
        ref = "gumroad:" + s["id"]
        if ref in bekannt or s.get("refunded") or s.get("chargedback"):
            continue
        # Beträge in Cent der Verkaufswährung; Toolkit ist in CHF ausgepreist.
        brutto = s.get("price", 0) / 100
        gebuehr = (s.get("gumroad_fee") or 0) / 100
        datum = s.get("created_at", "")[:10]
        neu.append([datum, "M01", "einnahme", f"{brutto:.2f}", 0, "gumroad", s.get("product_name", ""), ref])
        neu.append([datum, "M01", "gebuehr", f"{gebuehr:.2f}", 0, "gumroad", "Gumroad-Gebühr", ref + ":fee"])
    nxt = d.get("next_page_url")
    url = ("https://api.gumroad.com" + nxt + "&access_token=" + token) if nxt else None
if neu:
    with open(LEDGER, "a", newline="", encoding="utf-8") as fh:
        csv.writer(fh).writerows(neu)
print(f"gumroad: {len(neu) // 2} neue Verkäufe übernommen")
