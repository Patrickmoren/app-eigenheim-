# -*- coding: utf-8 -*-
"""Erzeugt drei Testseiten mit Warteliste (Netlify Forms) aus einer Vorlage.
Aufruf: python3 build.py  → Ordner site/ zum Hochladen bei Netlify."""
import os, html

CSS = r"""
:root{--grund:#FBFCFA;--flaeche:#FFFFFF;--tinte:#17231D;--leise:#55635B;--gruen:#2E7D5B;--gruen-hell:#E6F2EB;
--sonne:#F2B632;--linie:#DCE5DF;--display:"Bricolage Grotesque","Avenir Next","Segoe UI",sans-serif;--text:"Figtree","Segoe UI",Arial,sans-serif}
@media (prefers-color-scheme:dark){:root{color-scheme:dark;--grund:#111814;--flaeche:#18221D;--tinte:#E8F0EB;--leise:#A3B3AA;
--gruen:#6CC79B;--gruen-hell:#1E3329;--sonne:#F2C053;--linie:#2A3A32}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--grund);color:var(--tinte);font-family:var(--text);font-size:17px;line-height:1.55;padding-inline:20px}
.w{max-width:1060px;margin-inline:auto}
h1,h2,h3{font-family:var(--display);line-height:1.08;margin:0;text-wrap:balance}
h1{font-size:clamp(2.1rem,5vw,3.6rem);font-weight:800;letter-spacing:-.025em}
h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:700;letter-spacing:-.015em}
h3{font-size:1.1rem;font-weight:700}
p{margin:0;max-width:60ch}
a{color:var(--gruen)}
:focus-visible{outline:3px solid var(--sonne);outline-offset:2px}
header{display:flex;justify-content:space-between;align-items:center;padding-block:20px;gap:12px}
.logo{display:flex;gap:10px;align-items:center;font-family:var(--display);font-weight:800;font-size:1.3rem;color:var(--tinte);text-decoration:none}
.punkt{width:26px;height:26px;border-radius:50%;background:var(--gruen);box-shadow:10px 0 0 -2px var(--sonne);margin-right:10px}
.hero>*,.raster>*{min-width:0}
.hero{display:grid;grid-template-columns:1.1fr .9fr;gap:44px;padding-block:28px 56px;align-items:start}
.lead{font-size:1.18rem;color:var(--leise);margin-top:18px}
.preis{display:inline-flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-top:22px;background:var(--gruen-hell);padding:10px 14px;border-radius:10px}
.preis b{font-family:var(--display);font-size:1.25rem}
.preis span{color:var(--leise);font-size:.92rem}
form{display:grid;gap:12px;margin-top:24px;max-width:480px}
label{font-size:.85rem;color:var(--leise);display:block;margin-bottom:4px}
input,select{width:100%;font:inherit;padding:11px 12px;border:1.5px solid var(--linie);border-radius:10px;background:var(--flaeche);color:var(--tinte)}
.zwei{display:grid;grid-template-columns:1fr 1fr;gap:12px}
button{font:inherit;font-weight:700;background:var(--tinte);color:var(--grund);border:0;border-radius:10px;padding:13px 18px;cursor:pointer}
button:hover{filter:brightness(1.15)}
.klein{font-size:.8rem;color:var(--leise)}
.hp{position:absolute;left:-5000px}
.karte{background:var(--flaeche);border:1.5px solid var(--linie);border-radius:16px;padding:22px}
.karte .kopf{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:12px}
.bsp{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--leise)}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:.95rem}
td,th{padding:9px 6px;border-bottom:1px solid var(--linie);text-align:left}
th{font-size:.75rem;color:var(--leise);font-weight:600;text-transform:uppercase;letter-spacing:.06em}
td.r,th.r{text-align:right}
tr.summe td{font-weight:700;border-bottom:0}
.balken{height:8px;border-radius:4px;background:var(--gruen);opacity:.85}
section{padding-block:52px;border-top:1.5px solid var(--linie)}
.raster{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:26px}
.raster .karte p{color:var(--leise);margin-top:8px}
.recht{font-size:.8rem;color:var(--gruen);font-weight:600;margin-top:10px;display:block}
.faq{display:grid;gap:14px;margin-top:22px}
.faq div{border-bottom:1px solid var(--linie);padding-bottom:14px}
.faq p{color:var(--leise);margin-top:6px}
footer{padding-block:30px 44px;color:var(--leise);font-size:.85rem;border-top:1.5px solid var(--linie)}
@media (max-width:820px){.hero,.raster{grid-template-columns:1fr}}
@media (max-width:440px){body{padding-inline:16px}.zwei{grid-template-columns:1fr}}
"""

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;600;700&display=swap">'

def tabelle(t):
    zeilen = "".join(
        f'<tr><td>{n}</td><td class="r">{a}</td><td style="width:30%"><div class="balken" style="width:{w}%"></div></td><td class="r">{b}</td></tr>'
        for n, a, w, b in t["zeilen"])
    return f'''<div class="karte" aria-label="{t["titel"]}">
  <div class="kopf"><h3>{t["titel"]}</h3><span class="bsp">{t["bsp"]}</span></div>
  <div style="overflow-x:auto"><table><thead><tr><th>{t["k1"]}</th><th class="r">{t["k2"]}</th><th></th><th class="r">{t["k3"]}</th></tr></thead>
  <tbody>{zeilen}<tr class="summe"><td>{t["summe"][0]}</td><td class="r">{t["summe"][1]}</td><td></td><td class="r">{t["summe"][2]}</td></tr></tbody></table></div>
  <p class="klein" style="margin-top:12px">{t["fuss"]}</p>
</div>'''

def seite(d):
    felder = "".join(f'<div class="karte"><h3>{h}</h3><p>{t}</p>{f"<span class=recht>{r}</span>" if r else ""}</div>' for h, t, r in d["funktionen"])
    faq = "".join(f"<div><h3>{q}</h3><p>{a}</p></div>" for q, a in d["faq"])
    opts = "".join(f"<option>{o}</option>" for o in d["form"]["optionen"])
    return f'''<!doctype html>
<html lang="{d["lang"]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{d["title"]}</title><meta name="description" content="{html.escape(d["desc"])}">
{FONTS}<style>{CSS}</style></head>
<body><div class="w">
<header><a class="logo" href="#"><span class="punkt" aria-hidden="true"></span>{d["marke"]}</a><a href="#warteliste">{d["nav"]}</a></header>
<main>
<div class="hero">
  <div>
    <p class="klein">{d["eyebrow"]}</p>
    <h1 style="margin-top:10px">{d["h1"]}</h1>
    <p class="lead">{d["lead"]}</p>
    <div class="preis"><b>{d["preis"]}</b><span>{d["preis_zusatz"]}</span></div>
    <form id="warteliste" name="{d["form"]["name"]}" method="POST" action="{d["form"]["danke"]}" data-netlify="true" netlify-honeypot="firma">
      <input type="hidden" name="form-name" value="{d["form"]["name"]}">
      <p class="hp"><label>Nicht ausfüllen <input name="firma"></label></p>
      <div><label for="email">{d["form"]["email"]}</label><input id="email" name="email" type="email" autocomplete="email" required></div>
      <div class="zwei">
        <div><label for="anzahl">{d["form"]["anzahl"]}</label><input id="anzahl" name="anzahl" type="number" min="1" inputmode="numeric"></div>
        <div><label for="rolle">{d["form"]["rolle"]}</label><select id="rolle" name="rolle">{opts}</select></div>
      </div>
      <button type="submit">{d["form"]["knopf"]}</button>
      <p class="klein">{d["form"]["hinweis"]}</p>
    </form>
  </div>
  {tabelle(d["tabelle"])}
</div>
<section><h2>{d["f_titel"]}</h2><div class="raster">{felder}</div></section>
<section><h2>{d["faq_titel"]}</h2><div class="faq">{faq}</div></section>
</main>
<footer>{d["footer"]}</footer>
</div></body></html>'''

def danke(d):
    return f'''<!doctype html><html lang="{d["lang"]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{d["marke"]}</title>{FONTS}<style>{CSS}</style></head><body><div class="w">
<header><a class="logo" href="./"><span class="punkt" aria-hidden="true"></span>{d["marke"]}</a></header>
<main style="padding-block:60px"><h1>{d["danke_h"]}</h1><p class="lead">{d["danke_t"]}</p></main></div></body></html>'''

from inhalte import SEITEN
os.makedirs("site", exist_ok=True)
for ordner, d in SEITEN.items():
    os.makedirs(f"site/{ordner}", exist_ok=True)
    open(f"site/{ordner}/index.html", "w").write(seite(d))
    open(f"site/{ordner}/danke.html", "w").write(danke(d))
open("site/index.html", "w").write('<!doctype html><meta charset="utf-8"><title>Tests</title><ul>' +
    "".join(f'<li><a href="{o}/">{d["title"]}</a></li>' for o, d in SEITEN.items()) + "</ul>")
print("geschrieben:", ", ".join(SEITEN))
