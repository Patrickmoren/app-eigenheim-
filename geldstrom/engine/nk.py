#!/usr/bin/env python3
"""Heiz- und Nebenkostenabrechnung für Privatvermieter – Rechenkern.

Eingabe: eine JSON-Datei je Liegenschaft und Abrechnungsperiode (Aufbau siehe
beispiel/mfh-beispielweg.json und README.md). Die Datei wird aus den Unterlagen
der Kundschaft mit dem Prompt prompts/01-extraktion.md erzeugt.

Ausgabe (in --out):
  Abrechnung_<Einheit>_<Mieter>.html/.pdf   eine Abrechnung je Mietverhältnis
  Uebersicht.html/.pdf                      Kontrollblatt für die Vermieterschaft
  pruefbericht.txt                          Fehler und Warnungen für die Qualitätskontrolle

Gerechnet wird ausschliesslich hier, deterministisch. Die KI liest nur Belege
und schreibt Texte; sie rechnet nie Beträge aus.

Aufruf: python3 nk.py beispiel/mfh-beispielweg.json --out ausgabe [--pdf]
Exit-Code 2, wenn der Prüfbericht Fehler enthält.
"""
import argparse
import calendar
import datetime as dt
import glob
import html
import json
import math
import os
import re
import shutil
import subprocess
import sys

# Monatsanteile der Heizkosten in Prozent (Jan..Dez) für die zeitliche
# Abgrenzung bei Mieterwechsel. Quelle: mietrechtspraxis/mp, «Verteilung der
# Heizkosten bei Mieterwechsel im Laufe der Abrechnungsperiode».
HGT_OHNE_WW = [17.5, 14.5, 13.5, 9.5, 3.5, 0.0, 0.0, 0.0, 1.0, 10.0, 13.5, 17.0]
HGT_MIT_WW = [13.6, 12.1, 11.5, 9.3, 5.6, 3.7, 3.7, 3.6, 3.7, 9.5, 10.7, 13.0]

# Positionen, die in der Regel keine Nebenkosten sind (Art. 257b OR, Art. 5 VMWG):
# Unterhalt, Reparaturen, Erneuerung, Kapitalkosten, Gebäudeversicherung, Steuern.
UNZULAESSIG = re.compile(
    r"reparatur|\bersatz|erneuerung|sanierung|renovation|neuanschaffung|gebäudeversicherung|gebaeudeversicherung|"
    r"liegenschaftssteuer|hypothek|\bzins|abschreibung|amortisation|\bunterhalt|instandstellung",
    re.IGNORECASE)

# Bezeichnungen, unter denen ein Mietvertrag Verwaltungskosten als Nebenkosten vorsieht
VERWALTUNG_VEREINBART = ("Verwaltungsaufwand", "Verwaltungskosten", "Verwaltungshonorar")

MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
          "September", "Oktober", "November", "Dezember"]


class Befund:
    def __init__(self):
        self.eintraege = []

    def fehler(self, text):
        self.eintraege.append(("FEHLER", text))

    def warnung(self, text):
        self.eintraege.append(("WARNUNG", text))

    def info(self, text):
        self.eintraege.append(("INFO", text))

    @property
    def hat_fehler(self):
        return any(stufe == "FEHLER" for stufe, _ in self.eintraege)

    def text(self):
        if not self.eintraege:
            return "Keine Befunde.\n"
        reihenfolge = {"FEHLER": 0, "WARNUNG": 1, "INFO": 2}
        zeilen = sorted(self.eintraege, key=lambda e: reihenfolge[e[0]])
        return "".join(f"[{stufe}] {text}\n" for stufe, text in zeilen)


def datum(s):
    return dt.date.fromisoformat(s)


def chf(x):
    """1234.5 -> 1'234.50"""
    s = f"{abs(x):,.2f}".replace(",", "'")
    return ("-" if x < -0.004 else "") + s


def auf_5_rappen(x):
    return round(round(x * 20) / 20, 2)


def tage(von, bis):
    return (bis - von).days + 1


def tagesgewicht(tag, art):
    if art == "tage":
        return 1.0
    tabelle = HGT_MIT_WW if art == "hgt_ww" else HGT_OHNE_WW
    return tabelle[tag.month - 1] / calendar.monthrange(tag.year, tag.month)[1]


def gewicht(von, bis, art):
    """Summe der Tagesgewichte von..bis (inklusive)."""
    if bis < von:
        return 0.0
    summe, tag = 0.0, von
    while tag <= bis:
        summe += tagesgewicht(tag, art)
        tag += dt.timedelta(days=1)
    return summe


def heizoel_verbrauch(lager, befund, name):
    """Verbrauch in CHF aus Lagerbestand. Endbestand nach FIFO bewertet,
    d.h. der Restbestand stammt aus den jüngsten Einkäufen."""
    anfang_l = float(lager["anfangsbestand_liter"])
    anfang_chf = float(lager["anfangsbestand_chf"])
    einkaeufe = sorted(lager.get("einkaeufe", []), key=lambda e: e.get("datum", ""))
    end_l = float(lager["endbestand_liter"])
    total_l = anfang_l + sum(float(e["liter"]) for e in einkaeufe)
    if end_l > total_l + 0.5:
        befund.fehler(f"{name}: Endbestand {end_l:.0f} l ist grösser als Anfangsbestand plus Einkäufe ({total_l:.0f} l).")
        end_l = total_l
    rest, end_chf = end_l, 0.0
    for e in reversed(einkaeufe):
        if rest <= 0:
            break
        liter = float(e["liter"])
        n = min(rest, liter)
        end_chf += float(e["chf"]) * n / liter
        rest -= n
    if rest > 0 and anfang_l > 0:
        end_chf += anfang_chf * rest / anfang_l
    verbrauch_l = total_l - end_l
    verbrauch_chf = anfang_chf + sum(float(e["chf"]) for e in einkaeufe) - end_chf
    detail = (f"Anfangsbestand {anfang_l:,.0f} l (CHF {chf(anfang_chf)}) + Einkäufe "
              f"{total_l - anfang_l:,.0f} l (CHF {chf(sum(float(e['chf']) for e in einkaeufe))}) "
              f"– Endbestand {end_l:,.0f} l (CHF {chf(end_chf)}) = Verbrauch {verbrauch_l:,.0f} l").replace(",", "'")
    return round(verbrauch_chf, 2), detail


def rechne(daten):
    """Verteilt alle Kosten. Liefert (ergebnis, befund)."""
    befund = Befund()
    p_von, p_bis = datum(daten["periode"]["von"]), datum(daten["periode"]["bis"])
    if p_bis <= p_von:
        befund.fehler("Abrechnungsperiode: «bis» liegt nicht nach «von».")
    periodentage = tage(p_von, p_bis)
    if not 360 <= periodentage <= 366:
        befund.warnung(f"Abrechnungsperiode umfasst {periodentage} Tage statt eines Jahres.")
    heiz_art = "hgt_ww" if daten.get("heizung", {}).get("mit_warmwasser", True) else "hgt"
    honorar_pct = float(daten.get("verwaltungshonorar_prozent", 0) or 0)
    if honorar_pct > 5:
        befund.warnung(f"Verwaltungshonorar {honorar_pct} % liegt über den üblichen 3–5 %.")

    einheiten = {e["id"]: e for e in daten["einheiten"]}
    if len(einheiten) != len(daten["einheiten"]):
        befund.fehler("Einheiten-IDs sind nicht eindeutig.")

    # Mietverhältnisse auf die Periode zuschneiden und prüfen
    mv_liste = []
    for i, mv in enumerate(daten.get("mietverhaeltnisse", [])):
        eid = mv["einheit"]
        if eid not in einheiten:
            befund.fehler(f"Mietverhältnis {mv.get('mieter')}: Einheit «{eid}» existiert nicht.")
            continue
        if mv.get("nebenkosten_art") == "pauschal":
            befund.info(f"{mv.get('mieter')} ({eid}): Nebenkostenpauschale – keine Abrechnung, Anteil trägt die Vermieterschaft.")
            continue
        von = max(datum(mv["von"]), p_von)
        bis = min(datum(mv["bis"]) if mv.get("bis") else p_bis, p_bis)
        if bis < von:
            befund.warnung(f"{mv.get('mieter')} ({eid}): Mietverhältnis liegt ausserhalb der Periode, ignoriert.")
            continue
        mv_liste.append({**mv, "_von": von, "_bis": bis, "_nr": i, "_zeilen": [], "_nicht_vereinbart": []})
    for eid in einheiten:
        eigene = sorted((m for m in mv_liste if m["einheit"] == eid), key=lambda m: m["_von"])
        for a, b in zip(eigene, eigene[1:]):
            if b["_von"] <= a["_bis"]:
                befund.fehler(f"Einheit {eid}: Mietverhältnisse {a['mieter']} und {b['mieter']} überschneiden sich.")
        if not eigene:
            befund.info(f"Einheit {eid}: kein Mietverhältnis in der Periode – ganzer Anteil geht zulasten Vermieterschaft.")

    positionen = []
    vermieter = {"leerstand": 0.0, "nicht_vereinbart": 0.0, "zeilen": []}
    for pos in daten["kosten"]:
        name = pos["position"]
        kategorie = pos.get("kategorie", "nebenkosten")
        detail = pos.get("detail", "")
        if pos.get("typ") == "heizoel_lager":
            betrag, detail = heizoel_verbrauch(pos["lager"], befund, name)
        else:
            betrag = round(float(pos["betrag"]), 2)
        if UNZULAESSIG.search(name) and not pos.get("zulaessig_bestaetigt"):
            befund.warnung(f"Position «{name}»: klingt nach Unterhalt/Kapitalkosten – in der Regel keine Nebenkosten. "
                           "Prüfen oder mit \"zulaessig_bestaetigt\": true freigeben.")
        if betrag < 0:
            befund.warnung(f"Position «{name}» ist negativ (CHF {chf(betrag)}). Gutschrift?")
        zeitart = heiz_art if kategorie == "heizung" else "tage"
        schluessel = pos.get("schluessel", "gleich")
        beteiligt = pos.get("einheiten") or list(einheiten)

        if schluessel == "direkt":
            anteile = {eid: float(v) for eid, v in pos["direkt"].items()}
            for eid in anteile:
                if eid not in einheiten:
                    befund.fehler(f"Position «{name}»: Einheit «{eid}» existiert nicht.")
            summe = sum(anteile.values())
            if abs(summe - betrag) > 0.05:
                befund.fehler(f"Position «{name}»: direkte Beträge ({chf(summe)}) ≠ Gesamtbetrag ({chf(betrag)}).")
            basis = {eid: v for eid, v in anteile.items()}
            basis_total = summe or 1.0
        else:
            basis = {}
            for eid in beteiligt:
                if eid not in einheiten:
                    befund.fehler(f"Position «{name}»: Einheit «{eid}» existiert nicht.")
                    continue
                if schluessel == "gleich":
                    basis[eid] = 1.0
                else:
                    wert = einheiten[eid].get("schluessel", {}).get(schluessel)
                    if wert is None:
                        befund.fehler(f"Position «{name}»: Einheit {eid} hat keinen Wert für Schlüssel «{schluessel}».")
                        wert = 0.0
                    basis[eid] = float(wert)
            basis_total = sum(basis.values())
            if basis_total <= 0:
                befund.fehler(f"Position «{name}»: Summe des Schlüssels «{schluessel}» ist 0.")
                basis_total = 1.0

        positionen.append({"position": name, "kategorie": kategorie, "betrag": betrag,
                           "schluessel": schluessel, "basis_total": basis_total,
                           "beleg": pos.get("beleg", ""), "detail": detail})
        voll = gewicht(p_von, p_bis, zeitart)
        for eid, b in basis.items():
            einheit_betrag = betrag * b / basis_total
            verteilt = 0.0
            for mv in (m for m in mv_liste if m["einheit"] == eid):
                zeitanteil = gewicht(mv["_von"], mv["_bis"], zeitart) / voll if voll else 0.0
                anteil = einheit_betrag * zeitanteil
                verteilt += anteil
                vereinbart = mv.get("vereinbarte_positionen")
                if vereinbart is not None and name not in vereinbart:
                    mv["_nicht_vereinbart"].append((name, anteil))
                    vermieter["nicht_vereinbart"] += anteil
                    continue
                mv["_zeilen"].append({"position": name, "kategorie": kategorie, "gesamt": betrag,
                                      "schluessel": schluessel, "basis": b, "basis_total": basis_total,
                                      "zeitanteil": zeitanteil, "zeitart": zeitart, "betrag": anteil})
            vermieter["leerstand"] += einheit_betrag - verteilt

    # Verwaltungshonorar, Akonto, Saldo je Mietverhältnis
    for mv in mv_liste:
        if mv.get("vereinbarte_positionen") is None:
            befund.info(f"{mv['mieter']} ({mv['einheit']}): keine Liste der vertraglich vereinbarten Positionen – "
                        "alle Positionen verrechnet. Mietvertrag prüfen.")
        for name, anteil in mv["_nicht_vereinbart"]:
            befund.warnung(f"{mv['mieter']} ({mv['einheit']}): «{name}» ist im Mietvertrag nicht vereinbart – "
                           f"CHF {chf(anteil)} gehen zulasten Vermieterschaft.")
        kosten = sum(z["betrag"] for z in mv["_zeilen"])
        vereinbart = mv.get("vereinbarte_positionen")
        voll_honorar = vereinbart is None or any(v in vereinbart for v in VERWALTUNG_VEREINBART)
        basis = kosten if voll_honorar else sum(z["betrag"] for z in mv["_zeilen"] if z["kategorie"] == "heizung")
        honorar = basis * honorar_pct / 100
        mv["_honorar_nur_heizung"] = not voll_honorar
        if honorar_pct and not voll_honorar:
            befund.info(f"{mv['mieter']} ({mv['einheit']}): Mietvertrag nennt keine Verwaltungskosten – "
                        "Verwaltungsaufwand nur auf Heiz- und Warmwasserkosten berechnet.")
        mv["_kosten_roh"] = kosten
        mv["_kosten"] = round(kosten, 2)
        mv["_honorar"] = round(honorar, 2)
        mv["_total"] = round(kosten + honorar, 2)
        if "akonto_bezahlt" in mv:
            akonto = float(mv["akonto_bezahlt"])
        else:
            monatlich = float(mv.get("akonto_monatlich", 0))
            akonto, tag = 0.0, mv["_von"]
            while tag <= mv["_bis"]:
                akonto += monatlich / calendar.monthrange(tag.year, tag.month)[1]
                tag += dt.timedelta(days=1)
        mv["_akonto"] = round(akonto, 2)
        mv["_saldo"] = auf_5_rappen(mv["_total"] - mv["_akonto"])
        jahr = mv["_total"] / (tage(mv["_von"], mv["_bis"]) / periodentage)
        # Empfehlung nur für Mietverhältnisse, die über das Periodenende hinaus laufen
        laeuft_weiter = not mv.get("bis") or datum(mv["bis"]) > p_bis
        mv["_akonto_empfehlung"] = math.ceil(jahr * 1.05 / 12 / 5) * 5 if laeuft_weiter else None
        if mv["_akonto"] > 0 and abs(mv["_saldo"]) > 0.5 * mv["_akonto"]:
            befund.warnung(f"{mv['mieter']} ({mv['einheit']}): Saldo CHF {chf(mv['_saldo'])} ist mehr als die Hälfte "
                           f"der Akontozahlungen (CHF {chf(mv['_akonto'])}). Akonto oder Eingaben prüfen.")

    # Plausibilität Heizkosten pro m²
    heiz_total = sum(p["betrag"] for p in positionen if p["kategorie"] == "heizung")
    flaeche = sum(float(e.get("schluessel", {}).get("m2", 0)) for e in einheiten.values())
    if heiz_total and flaeche:
        pro_m2 = heiz_total / flaeche * 365 / periodentage
        if not 5 <= pro_m2 <= 40:
            befund.warnung(f"Heiz-/Warmwasserkosten CHF {pro_m2:.2f} pro m² und Jahr – üblich sind etwa 10–30. Eingaben prüfen.")

    # Kontrollsumme: alles Verteilte + Vermieteranteil = Gesamtkosten
    total_kosten = sum(p["betrag"] for p in positionen)
    verteilt = sum(mv["_kosten_roh"] for mv in mv_liste)
    differenz = total_kosten - verteilt - vermieter["leerstand"] - vermieter["nicht_vereinbart"]
    if abs(differenz) > 0.01:
        befund.fehler(f"Kontrollsumme: Differenz von CHF {chf(differenz)} zwischen Gesamtkosten und Verteilung.")

    ergebnis = {"daten": daten, "positionen": positionen, "mietverhaeltnisse": mv_liste,
                "vermieter": vermieter, "total_kosten": round(total_kosten, 2),
                "p_von": p_von, "p_bis": p_bis, "honorar_pct": honorar_pct, "heiz_art": heiz_art}
    return ergebnis, befund


# ---------------------------------------------------------------- Ausgabe

CSS = """
@page { size: A4; margin: 18mm 16mm 18mm 20mm; }
* { box-sizing: border-box; }
body { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 10pt; color: #1a1a1a; margin: 0; }
.blatt { max-width: 180mm; margin: 0 auto; }
.kopf { display: flex; justify-content: space-between; margin-bottom: 14mm; font-size: 9pt; }
.empf { margin-top: 10mm; font-size: 10pt; line-height: 1.4; }
h1 { font-size: 14pt; margin: 0 0 2mm; }
.sub { color: #555; margin-bottom: 6mm; }
table { width: 100%; border-collapse: collapse; margin: 3mm 0 5mm; }
th, td { padding: 1.6mm 1.5mm; border-bottom: 0.3pt solid #ccc; vertical-align: top; }
th { text-align: left; font-size: 8.5pt; color: #444; border-bottom: 0.8pt solid #333; }
td.z, th.z { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
tr.summe td { font-weight: bold; border-top: 0.8pt solid #333; border-bottom: none; }
tr.saldo td { font-weight: bold; font-size: 11pt; border-top: 1.2pt solid #111; }
.klein { font-size: 8pt; color: #555; line-height: 1.35; }
.box { border: 0.6pt solid #999; padding: 3mm 4mm; margin: 4mm 0; }
.muster { position: fixed; top: 40%; left: 0; right: 0; text-align: center; font-size: 60pt; font-weight: bold;
  color: rgba(0,0,0,.07); transform: rotate(-30deg); pointer-events: none; }
.fehler { color: #b00020; } .warnung { color: #8a5a00; }
h2 { font-size: 11pt; margin: 7mm 0 1mm; }
"""


def e(s):
    return html.escape(str(s))


def datum_ch(d):
    return d.strftime("%d.%m.%Y")


def schluessel_text(z):
    if z["schluessel"] == "gleich":
        return f"{z['basis']:g} / {z['basis_total']:g} Einh."
    if z["schluessel"] == "direkt":
        return "direkt zugewiesen"
    return f"{z['basis']:g} / {z['basis_total']:g} {z['schluessel']}"


MUSTER = False


def seite(titel, inhalt):
    if MUSTER:
        inhalt = "<div class='muster'>MUSTER – fiktive Daten</div>" + inhalt
    return (f"<!doctype html><html lang='de-CH'><head><meta charset='utf-8'>"
            f"<title>{e(titel)}</title><style>{CSS}</style></head><body><div class='blatt'>{inhalt}</div></body></html>")


def abrechnung_html(erg, mv):
    d = erg["daten"]
    vm, lg = d["vermieter"], d["liegenschaft"]
    heute = datum_ch(dt.date.fromisoformat(d.get("abrechnungsdatum", dt.date.today().isoformat())))
    zeitart_text = {"tage": "Tage", "hgt": "Heizgradtage", "hgt_ww": "Heizgradtage"}
    zeilen = []
    for z in mv["_zeilen"]:
        zeit = f"{z['zeitanteil'] * 100:.2f} % ({zeitart_text[z['zeitart']]})"
        zeilen.append(f"<tr><td>{e(z['position'])}</td><td class='z'>{chf(z['gesamt'])}</td>"
                      f"<td>{e(schluessel_text(z))}</td><td class='z'>{zeit}</td><td class='z'>{chf(z['betrag'])}</td></tr>")
    if erg["honorar_pct"] and mv["_honorar"]:
        basis_text = "der Heiz- und Warmwasserkosten" if mv["_honorar_nur_heizung"] else "der Heiz- und Nebenkosten"
        zeilen.append(f"<tr><td>Verwaltungsaufwand ({erg['honorar_pct']:g} % {basis_text})</td><td></td><td></td><td></td>"
                      f"<td class='z'>{chf(mv['_honorar'])}</td></tr>")
    saldo = mv["_saldo"]
    frist = datum_ch(dt.date.fromisoformat(d.get("abrechnungsdatum", dt.date.today().isoformat())) + dt.timedelta(days=30))
    if saldo > 0:
        saldo_text = "Nachzahlung zu Ihren Lasten"
        zahlung = (f"Bitte überweisen Sie den Betrag von <b>CHF {chf(saldo)}</b> bis {frist} auf das Konto "
                   f"<b>{e(vm.get('iban', ''))}</b> ({e(vm['name'])}), Vermerk «NK {e(mv['einheit'])}».")
    elif saldo < 0:
        saldo_text = "Guthaben zu Ihren Gunsten"
        zahlung = (f"Das Guthaben von <b>CHF {chf(-saldo)}</b> überweisen wir Ihnen bis {frist}. "
                   "Bitte teilen Sie uns Ihre IBAN mit, falls sie sich geändert hat.")
    else:
        saldo_text, zahlung = "Saldo", "Es ergibt sich weder eine Nachzahlung noch ein Guthaben."
    akonto_satz = "" if mv["_akonto_empfehlung"] is None else (
        f"<p>Ab dem nächsten Monat empfehlen wir eine Akontozahlung von <b>CHF {mv['_akonto_empfehlung']}.–</b> pro Monat "
        f"(bisher CHF {chf(float(mv.get('akonto_monatlich', 0)))}).</p>")
    empfaenger = mv.get("adresse") or f"{lg['adresse']}, {mv['einheit']}"
    inhalt = f"""
<div class='kopf'><div><b>{e(vm['name'])}</b><br>{e(vm.get('adresse', '')).replace(', ', '<br>')}</div>
<div style='text-align:right'>{e(vm.get('ort', ''))}{', ' if vm.get('ort') else ''}{heute}</div></div>
<div class='empf'>{e(mv['mieter'])}<br>{e(empfaenger).replace(', ', '<br>')}</div>
<div style='height:10mm'></div>
<h1>Heiz- und Nebenkostenabrechnung</h1>
<div class='sub'>{e(lg['bezeichnung'])}, {e(lg['adresse'])} · Objekt {e(mv['einheit'])}<br>
Abrechnungsperiode {datum_ch(erg['p_von'])} – {datum_ch(erg['p_bis'])} · Ihre Mietdauer in der Periode:
{datum_ch(mv['_von'])} – {datum_ch(mv['_bis'])}</div>
<table><tr><th>Position</th><th class='z'>Kosten Liegenschaft</th><th>Verteilschlüssel</th><th class='z'>Zeitanteil</th><th class='z'>Ihr Anteil CHF</th></tr>
{''.join(zeilen)}
<tr class='summe'><td colspan='4'>Total Ihre Heiz- und Nebenkosten</td><td class='z'>{chf(mv['_total'])}</td></tr>
<tr><td colspan='4'>abzüglich Ihre Akontozahlungen</td><td class='z'>– {chf(mv['_akonto'])}</td></tr>
<tr class='saldo'><td colspan='4'>{saldo_text}</td><td class='z'>{chf(abs(saldo))}</td></tr></table>
<div class='box'>{zahlung}</div>
{akonto_satz}
<p class='klein'>Heizkosten werden bei einem Wechsel während der Periode nach Heizgradtagen (Monatsanteilen gemäss
Heizperiode) abgegrenzt, übrige Nebenkosten nach Tagen. Anteile leerstehender Objekte trägt die Vermieterschaft.
Sie haben das Recht, die Originalbelege einzusehen (Art. 257b Abs. 2 OR, Art. 8 VMWG). Wenden Sie sich dafür an
{e(vm['name'])}{', ' + e(vm['email']) if vm.get('email') else ''}{', ' + e(vm['telefon']) if vm.get('telefon') else ''}.</p>
"""
    return seite(f"Nebenkostenabrechnung {mv['einheit']} {mv['mieter']}", inhalt)


def uebersicht_html(erg, befund):
    d = erg["daten"]
    pos_zeilen = "".join(
        f"<tr><td>{e(p['position'])}{('<br><span class=klein>' + e(p['detail']) + '</span>') if p['detail'] else ''}</td>"
        f"<td>{e(p['kategorie'])}</td><td>{e(p['schluessel'])}</td><td class='klein'>{e(p['beleg'])}</td>"
        f"<td class='z'>{chf(p['betrag'])}</td></tr>" for p in erg["positionen"])
    mv_zeilen = "".join(
        f"<tr><td>{e(mv['einheit'])}</td><td>{e(mv['mieter'])}</td><td>{datum_ch(mv['_von'])}–{datum_ch(mv['_bis'])}</td>"
        f"<td class='z'>{chf(mv['_total'])}</td><td class='z'>{chf(mv['_akonto'])}</td><td class='z'>{chf(mv['_saldo'])}</td>"
        f"<td class='z'>{mv['_akonto_empfehlung'] or '–'}</td></tr>" for mv in erg["mietverhaeltnisse"])
    vm = erg["vermieter"]
    tot = lambda k: sum(mv[k] for mv in erg["mietverhaeltnisse"])
    befunde = "".join(f"<li class='{s.lower()}'><b>{s}</b> {e(t)}</li>" for s, t in befund.eintraege) or "<li>Keine Befunde.</li>"
    inhalt = f"""
<h1>Übersicht Nebenkostenabrechnung</h1>
<div class='sub'>{e(d['liegenschaft']['bezeichnung'])}, {e(d['liegenschaft']['adresse'])} ·
Periode {datum_ch(erg['p_von'])} – {datum_ch(erg['p_bis'])} · für {e(d['vermieter']['name'])}</div>
<h2>Kosten der Liegenschaft</h2>
<table><tr><th>Position</th><th>Art</th><th>Schlüssel</th><th>Beleg</th><th class='z'>CHF</th></tr>{pos_zeilen}
<tr class='summe'><td colspan='4'>Total Heiz- und Nebenkosten</td><td class='z'>{chf(erg['total_kosten'])}</td></tr></table>
<h2>Abrechnung je Mietverhältnis</h2>
<table><tr><th>Objekt</th><th>Mieter</th><th>Zeitraum</th><th class='z'>Kosten inkl. Verw.</th><th class='z'>Akonto</th>
<th class='z'>Saldo (+ Nachz.)</th><th class='z'>Akonto neu</th></tr>{mv_zeilen}
<tr class='summe'><td colspan='3'>Total</td><td class='z'>{chf(tot('_total'))}</td><td class='z'>{chf(tot('_akonto'))}</td>
<td class='z'>{chf(tot('_saldo'))}</td><td></td></tr></table>
<h2>Zulasten Vermieterschaft</h2>
<table><tr><td>Leerstand / eigene Nutzung</td><td class='z'>{chf(vm['leerstand'])}</td></tr>
<tr><td>Im Mietvertrag nicht vereinbarte Positionen</td><td class='z'>{chf(vm['nicht_vereinbart'])}</td></tr>
<tr><td>Verwaltungsaufwand, von der Mieterschaft getragen ({erg['honorar_pct']:g} %, Ertrag)</td><td class='z'>– {chf(tot('_honorar'))}</td></tr></table>
<p class='klein'>Kontrolle: verteilte Kosten {chf(tot('_kosten'))} + Leerstand {chf(vm['leerstand'])} + nicht vereinbart
{chf(vm['nicht_vereinbart'])} = {chf(tot('_kosten') + vm['leerstand'] + vm['nicht_vereinbart'])} (Gesamtkosten {chf(erg['total_kosten'])}).</p>
<h2>Prüfbefunde</h2><ul class='klein'>{befunde}</ul>
"""
    return seite("Übersicht Nebenkostenabrechnung", inhalt)


def dateiname(s):
    return re.sub(r"[^A-Za-z0-9ÄÖÜäöüéè_-]+", "_", s).strip("_")


def chromium():
    for kandidat in [os.environ.get("CHROME"), shutil.which("chromium"), shutil.which("chromium-browser"),
                     shutil.which("google-chrome"), shutil.which("chrome"), shutil.which("msedge"),
                     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                     "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
                     r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                     r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                     r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                     *sorted(glob.glob("/opt/pw-browsers/chromium-*/chrome-linux/chrome"))]:
        if kandidat and os.path.exists(kandidat):
            return kandidat
    return None


def als_pdf(html_pfad):
    exe = chromium()
    if not exe:
        return None
    pdf = html_pfad[:-5] + ".pdf"
    subprocess.run([exe, "--headless", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={pdf}", "file://" + os.path.abspath(html_pfad)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return pdf


def schreibe(erg, befund, out, pdf=False):
    os.makedirs(out, exist_ok=True)
    dateien = []
    for mv in erg["mietverhaeltnisse"]:
        pfad = os.path.join(out, f"Abrechnung_{dateiname(mv['einheit'])}_{dateiname(mv['mieter'])}.html")
        with open(pfad, "w", encoding="utf-8") as f:
            f.write(abrechnung_html(erg, mv))
        dateien.append(pfad)
    pfad = os.path.join(out, "Uebersicht.html")
    with open(pfad, "w", encoding="utf-8") as f:
        f.write(uebersicht_html(erg, befund))
    dateien.append(pfad)
    with open(os.path.join(out, "pruefbericht.txt"), "w", encoding="utf-8") as f:
        f.write(befund.text())
    if pdf:
        if not chromium():
            print("Kein Chromium gefunden – nur HTML erzeugt (im Browser als PDF drucken).", file=sys.stderr)
        else:
            dateien = [als_pdf(p) for p in dateien]
    return dateien


def begleitblatt_html(erg):
    d = erg["daten"]
    mvs = erg["mietverhaeltnisse"]
    zeilen = "".join(
        f"<tr><td>{e(mv['einheit'])}</td><td>{e(mv['mieter'])}</td>"
        f"<td class='z'>{'Nachzahlung' if mv['_saldo'] > 0 else 'Guthaben' if mv['_saldo'] < 0 else 'ausgeglichen'}</td>"
        f"<td class='z'>{chf(abs(mv['_saldo']))}</td>"
        f"<td>{e(mv['adresse']) if mv.get('adresse') else 'in der Liegenschaft'}</td></tr>" for mv in mvs)
    inhalt = f"""
<h1>Ihre Nebenkostenabrechnung – so geht es weiter</h1>
<div class='sub'>{e(d['liegenschaft']['bezeichnung'])} · Periode {datum_ch(erg['p_von'])} – {datum_ch(erg['p_bis'])}</div>
<h2>Inhalt dieses Pakets</h2>
<ul><li><b>{len(mvs)} Abrechnungen</b> – eine je Mietpartei, versandbereit</li>
<li><b>Uebersicht.pdf</b> – alle Kosten, die Verteilung und die Kontrollrechnung, für Ihre Unterlagen und die Steuererklärung</li></ul>
<h2>Versand an die Mietparteien</h2>
<table><tr><th>Objekt</th><th>Mietpartei</th><th class='z'>Ergebnis</th><th class='z'>CHF</th><th>Versandadresse</th></tr>{zeilen}</table>
<ol>
<li>Jede Abrechnung kurz durchsehen und unterschreiben (eine Unterschrift ist nicht vorgeschrieben, wirkt aber verbindlicher).</li>
<li>Per Post oder E-Mail zustellen – ausgezogene Mietparteien an die neue Adresse.</li>
<li>Guthaben innert 30 Tagen überweisen; Nachzahlungen sind ebenfalls innert 30 Tagen fällig.</li>
<li>Die empfohlenen neuen Akontobeträge können Sie den Mietparteien mit der Abrechnung mitteilen. Eine Erhöhung der
Akontozahlungen gegen den Willen der Mieterschaft braucht das amtliche Formular (Art. 269d OR).</li>
<li>Mieter dürfen die Originalbelege einsehen (Art. 257b Abs. 2 OR). Bewahren Sie die Rechnungen deshalb griffbereit auf.</li>
</ol>
<h2>Fragen oder Fehler?</h2>
<p>Antworten Sie einfach auf die Liefer-E-Mail. Fehler, die auf unserer Berechnung beruhen, korrigieren wir kostenlos –
bitte innert 30 Tagen melden.</p>
"""
    return seite("So geht es weiter", inhalt)


def paket(erg, befund, out):
    """Lieferpaket für die Kundschaft: Begleitblatt, alle Abrechnungen, Übersicht (PDF) als ZIP."""
    import zipfile
    if befund.hat_fehler:
        raise SystemExit("Prüfbericht enthält FEHLER – kein Lieferpaket erstellt.")
    if not chromium():
        raise SystemExit("Für das Lieferpaket wird Chromium gebraucht (PDF).")
    dateien = schreibe(erg, befund, out, pdf=True)
    begleit = os.path.join(out, "00_So_geht_es_weiter.html")
    with open(begleit, "w", encoding="utf-8") as f:
        f.write(begleitblatt_html(erg))
    dateien.insert(0, als_pdf(begleit))
    name = "Nebenkostenabrechnung_" + dateiname(erg["daten"]["liegenschaft"]["bezeichnung"]) + \
           f"_{erg['p_bis'].year}.zip"
    ziel = os.path.join(out, name)
    ordner = name[:-4] + "/"
    with zipfile.ZipFile(ziel, "w", zipfile.ZIP_DEFLATED) as z:
        for p in dateien:
            z.write(p, ordner + os.path.basename(p))
    return ziel


def main(argv=None):
    ap = argparse.ArgumentParser(description="Heiz- und Nebenkostenabrechnung berechnen")
    ap.add_argument("eingabe", help="JSON-Datei der Liegenschaft")
    ap.add_argument("--out", default="ausgabe", help="Ausgabeordner")
    ap.add_argument("--pdf", action="store_true", help="zusätzlich PDF erzeugen (braucht Chromium)")
    ap.add_argument("--paket", action="store_true", help="Lieferpaket (ZIP mit PDFs und Begleitblatt) für die Kundschaft")
    args = ap.parse_args(argv)
    with open(args.eingabe, encoding="utf-8") as f:
        daten = json.load(f)
    global MUSTER
    MUSTER = bool(daten.get("muster"))
    erg, befund = rechne(daten)
    if args.paket:
        ziel = paket(erg, befund, args.out)
        print(befund.text(), end="")
        print(f"Lieferpaket: {ziel}")
        return 0
    dateien = schreibe(erg, befund, args.out, args.pdf)
    print(befund.text(), end="")
    print(f"{len(erg['mietverhaeltnisse'])} Abrechnungen, Gesamtkosten CHF {chf(erg['total_kosten'])} → {args.out}/")
    for p in dateien:
        print("  " + os.path.relpath(p))
    return 2 if befund.hat_fehler else 0


if __name__ == "__main__":
    sys.exit(main())
