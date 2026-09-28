#!/usr/bin/env python3
"""Erzeugt aus treuhaender.csv eine Arbeitsseite mit vorausgefüllten E-Mails.

Jede Zeile hat einen Knopf «E-Mail öffnen»: Dein Mailprogramm öffnet einen fertigen
Entwurf (Empfänger, Betreff, Text). Du liest ihn kurz und klickst Senden.
Firmen ohne E-Mail stehen unten mit Telefonnummer und Gesprächsleitfaden.

Aufruf (einmal nach dem Aufschalten der Landingpage):
  python3 outreach.py --name "Vorname Name" --telefon "079 000 00 00" --website "https://….netlify.app"
Ausgabe: outreach.html (nicht im Repository, enthält deine Kontaktdaten)
"""
import argparse
import csv
import html
import os
import urllib.parse

HIER = os.path.dirname(os.path.abspath(__file__))

BETREFF = "Nebenkostenabrechnungen für Ihre Vermieter-Kunden"

TEXT = """{anrede}

Private Vermieter fragen ihre Treuhänderin oder Verwaltung oft, wer ihnen die jährliche Heiz- und Nebenkostenabrechnung erstellt – für ein Mandat sind die Liegenschaften meist zu klein.

Ich komme aus der Immobilienbewirtschaftung und erstelle diese Abrechnungen zum Fixpreis von CHF 390 pro Liegenschaft: Der Vermieter sendet die Unterlagen, er erhält für jede Mietpartei eine fertige, fachlich geprüfte Abrechnung zurück. Für jeden vermittelten Auftrag erhalten Sie CHF 60, offen gegenüber Ihrer Kundschaft – oder Ihre Kundschaft erhält stattdessen CHF 60 Rabatt.

Angebot und Beispiel: {website}

Freundliche Grüsse
{name}
Nebenkosten fixfertig · {telefon}

Falls kein Interesse besteht, genügt eine kurze Antwort – ich melde mich dann nicht mehr."""

LEITFADEN = """VOR DEM ANRUF: Nummer auf local.ch prüfen – mit Stern (*) nicht anrufen (Art. 3 Abs. 1 lit. u UWG).

Guten Tag, {name} – ich erstelle Heiz- und Nebenkostenabrechnungen für private Vermieter
zum Fixpreis von CHF 390. Haben Sie Kunden mit vermieteten Wohnungen, die das selbst machen?
→ Ja: «Darf ich Ihnen ein Beispiel und das Angebot mailen? Pro Auftrag gibt es CHF 60 Provision, offen gegenüber Ihrer Kundschaft – oder CHF 60 Rabatt für sie.»
  E-Mail-Adresse notieren, danach Vorlage senden.
→ Nein / kein Interesse: bedanken, im Tracker «abgesagt» eintragen."""

SEITE = """<!doctype html><html lang="de-CH"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Treuhänder-Outreach</title>
<style>
:root{{--bg:#fbfaf7;--fl:#fff;--tx:#1c1f1d;--mu:#5b625e;--li:#e3e1da;--ak:#1f5c45;--ak-tx:#fff}}
@media (prefers-color-scheme:dark){{:root{{--bg:#141715;--fl:#1c201e;--tx:#ecefed;--mu:#a4ada8;--li:#2e3431;--ak:#5fb892;--ak-tx:#0f1512}}}}
body{{margin:0;background:var(--bg);color:var(--tx);font:16px/1.5 system-ui,sans-serif}}
.w{{max-width:900px;margin:0 auto;padding:24px 16px}}
.z{{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:space-between;background:var(--fl);
border:1px solid var(--li);border-radius:10px;padding:12px 14px;margin:8px 0}}
.z.erledigt{{opacity:.45}} .mu{{color:var(--mu);font-size:14px}}
a.k{{background:var(--ak);color:var(--ak-tx);padding:8px 14px;border-radius:7px;text-decoration:none;font-weight:600;white-space:nowrap}}
.p{{display:inline-block;min-width:22px;text-align:center;border-radius:5px;font-weight:700;font-size:13px;border:1px solid var(--li);margin-right:6px}}
pre{{white-space:pre-wrap;background:var(--fl);border:1px solid var(--li);border-radius:10px;padding:14px;font:14px/1.5 system-ui,sans-serif}}
</style></head><body><div class="w">
<h1>Treuhänder-Outreach</h1>
<p class="mu">Klick auf «E-Mail öffnen» → Entwurf lesen → senden. Die Zeile wird danach ausgegraut (nur in diesem Browser).
Tagesziel: Di 15 E-Mails (Prio A zuerst), Mi den Rest. Jede gesendete Mail in <code>test-tracker.csv</code> eintragen.</p>
<h2>E-Mail ({n_mail})</h2>{mails}
<h2>Anrufen ({n_tel})</h2>
<pre>{leitfaden}</pre>{anrufe}
</div>
<script>
const k="outreach-erledigt";let s;try{{s=new Set(JSON.parse(localStorage.getItem(k)||"[]"))}}catch(e){{s=new Set()}}
document.querySelectorAll(".z").forEach(z=>{{if(s.has(z.id))z.classList.add("erledigt");
z.querySelector("a.k")?.addEventListener("click",()=>{{s.add(z.id);z.classList.add("erledigt");
try{{localStorage.setItem(k,JSON.stringify([...s]))}}catch(e){{}}}});}});
</script></body></html>"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--telefon", required=True)
    ap.add_argument("--website", required=True, help="URL der aufgeschalteten Landingpage")
    ap.add_argument("--out", default=os.path.join(HIER, "outreach.html"))
    a = ap.parse_args()
    website = a.website.rstrip("/")
    with open(os.path.join(HIER, "treuhaender.csv"), encoding="utf-8") as f:
        firmen = list(csv.DictReader(f))
    mails, anrufe = [], []
    for i, fi in enumerate(firmen):
        kopf = (f"<div><span class='p'>{fi['prio']}</span><b>{html.escape(fi['firma'])}</b> "
                f"<span class='mu'>{html.escape(fi['ort'])} · {html.escape(fi['grund'])}</span></div>")
        if fi["email"]:
            text = TEXT.format(anrede=fi["anrede"], website=website, name=a.name, telefon=a.telefon)
            link = "mailto:{}?subject={}&body={}".format(
                fi["email"], urllib.parse.quote(BETREFF), urllib.parse.quote(text))
            mails.append(f"<div class='z' id='f{i}'>{kopf}<a class='k' href='{html.escape(link)}'>E-Mail öffnen</a></div>")
        else:
            tel = fi["telefon"]
            ziel = (f"<a class='k' href='tel:{tel.replace(' ', '')}'>{tel}</a>" if tel
                    else f"<span class='mu'>{html.escape(fi['website'] or 'Website suchen')}</span>")
            anrufe.append(f"<div class='z' id='f{i}'>{kopf}{ziel}</div>")
    seite = SEITE.format(n_mail=len(mails), n_tel=len(anrufe), mails="".join(mails), anrufe="".join(anrufe),
                         leitfaden=html.escape(LEITFADEN.format(name=a.name)))
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(seite)
    print(f"{len(mails)} E-Mails, {len(anrufe)} Anrufe → {a.out}")


if __name__ == "__main__":
    main()
