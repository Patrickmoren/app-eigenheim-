# -*- coding: utf-8 -*-
"""Erzeugt das Finanzmodell Hausklar als Excel-Arbeitsmappe.

Alle Eingaben stehen im Blatt «Annahmen» (blaue Schrift), alle Ergebnisse
im Blatt «Modell» sind Formeln darauf. Wer eine Annahme ändert, sieht die
Wirkung sofort. Das Szenario (Basis / Vorsichtig / Stark) wird in
Annahmen!C4 gewählt.
"""
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule

DATEI = os.environ.get("ZIEL", "Finanzmodell-Hausklar.xlsx")
JAHRE = [2027, 2028, 2029, 2030, 2031]
SP = ["C", "D", "E", "F", "G"]          # Jahresspalten

TINTE, PETROL, BLAU = "1A1A1A", "0F5C6E", "1F4FB4"
HELL, GRAU, RAND = "EDF1F2", "F6F8F9", "C6D0D5"
duenn = Side(style="thin", color=RAND)

def f(g=10, b=False, c=TINTE, i=False):
    return Font(name="Arial", size=g, bold=b, color=c, italic=i)

wb = openpyxl.Workbook()

# ================================================================ Annahmen
A = wb.active
A.title = "Annahmen"
A.column_dimensions["A"].width = 52
A.column_dimensions["B"].width = 12
for s in SP:
    A.column_dimensions[s].width = 13
A.column_dimensions["H"].width = 70

A["A1"] = "Hausklar – Finanzmodell · Annahmen"
A["A1"].font = f(14, True, PETROL)
A["A2"] = "Blaue Werte sind Eingaben. Alles andere ist berechnet. Quelle/Begründung in Spalte H. Alle Beträge in CHF ohne MWST."
A["A2"].font = f(9, i=True)
A["A4"] = "Szenario"
A["A4"].font = f(10, True)
A["C4"] = "Basis"
A["C4"].font = f(10, True, BLAU)
A["C4"].fill = PatternFill("solid", fgColor="FFF6D5")
dv = DataValidation(type="list", formula1='"Basis,Vorsichtig,Stark"', allow_blank=False)
A.add_data_validation(dv); dv.add("C4")
A["D4"] = '=IF(C4="Vorsichtig",0.6,IF(C4="Stark",1.3,1))'
A["D4"].number_format = "0%"
A["E4"] = "← Faktor auf Neugeschäft und Übernahmen"
A["E4"].font = f(9, i=True)

R = {}          # Name -> Zeile
zeile = [6]

def titel(text):
    r = zeile[0]
    A[f"A{r}"] = text
    A[f"A{r}"].font = f(11, True, "FFFFFF")
    for c in ["A", "B"] + SP + ["H"]:
        A[f"{c}{r}"].fill = PatternFill("solid", fgColor=PETROL)
    if text:
        for i, j in enumerate(JAHRE):
            A[f"{SP[i]}{r}"] = j
            A[f"{SP[i]}{r}"].font = f(10, True, "FFFFFF")
    zeile[0] += 1

def eingabe(name, text, einheit, werte, fmt="#,##0", quelle=""):
    r = zeile[0]; R[name] = r
    A[f"A{r}"] = text; A[f"A{r}"].font = f()
    A[f"B{r}"] = einheit; A[f"B{r}"].font = f(9, c="555555")
    if not isinstance(werte, list):
        werte = [werte]
    for i, w in enumerate(werte):
        c = A[f"{SP[i]}{r}"]
        c.value = w; c.font = f(10, c=BLAU); c.number_format = fmt
        c.fill = PatternFill("solid", fgColor="FFFBEA")
    A[f"H{r}"] = quelle; A[f"H{r}"].font = f(8, c="555555")
    A[f"H{r}"].alignment = Alignment(wrap_text=True, vertical="top")
    zeile[0] += 1

def leer():
    zeile[0] += 1

titel("Markt und Preise (einmalige Werte in Spalte C)")
eingabe("miete", "Durchschnittliche Nettomiete je Wohnung", "CHF/Mt.", 1485,
        quelle="BFS, Strukturerhebung 2024: Durchschnittsmiete CHF 1485 (alle Grössen).")
eingabe("hon", "Bewirtschaftungshonorar Mietliegenschaften (Mischsatz)", "% Nettomiete", 0.034, "0.0%",
        "Markt 3–6 %, meist 4–5 % (bovita.ch, kama-plus.ch). mory.ai: 2 %. Hausklar Neukunden 2,9 %, übernommene Mandate behalten ihren Satz (~4 %) → Mischsatz 3,4 %.")
eingabe("hon_ueb", "Honorarsatz übernommener Mandate", "% Nettomiete", 0.04, "0.0%",
        "Bestehende Verträge laufen zum Marktsatz weiter (4–5 %). Nur für den Kaufpreis verwendet; der Ertrag wird vorsichtig mit dem Mischsatz gerechnet.")
eingabe("stwe", "Honorar Stockwerkeigentum je Einheit", "CHF/Jahr", 480,
        quelle="Markt CHF 350–500 je Einheit plus Grundhonorar CHF 2000–3000 je Gemeinschaft (hausinfo.ch, bawos.ch). Grundhonorar hier im Einheitenpreis enthalten.")
eingabe("zusatz", "Zusatzerträge (Erstvermietung, Mieterwechsel, Bauherrenvertretung, NK-Abrechnung)", "% Grundhonorar", 0.22, "0%",
        "Beispielfirma CH: CHF 400k Fixhonorar + CHF 200k einmalige Erträge = 50 %. Konservativ 22 %.")
eingabe("churn", "Kündigungsrate Mandate (Einheiten)", "%/Jahr", 0.05, "0%",
        "Annahme. Verwaltungsmandate sind langlebig (Kündigungsfristen, Wechselaufwand).")
leer()

titel("Wachstum (Basis, wird mit Szenariofaktor multipliziert)")
eingabe("org_m", "Neue Mieteinheiten organisch (Neukunden)", "Einheiten", [250, 700, 1200, 1600, 2000],
        quelle="Vertriebstrichter siehe 04-vertrieb.md: Jahr 1 ≈ 12 Mandate à 20 Einheiten.")
eingabe("org_s", "Neue STWE-Einheiten organisch", "Einheiten", [150, 450, 800, 1100, 1400],
        quelle="Kleine STWEG finden kaum Verwalter (NZZ, 13.11.2025). Ø 10 Einheiten je Gemeinschaft.")
eingabe("ueb_m", "Übernommene Mieteinheiten (Nachfolgelösungen)", "Einheiten", [700, 1300, 1800, 2200, 2500],
        quelle="90'667 KMU mit offener Nachfolge (Dun & Bradstreet, März 2025). Kleinverwaltung Ø 700–1500 Einheiten.")
eingabe("ueb_s", "Übernommene STWE-Einheiten", "Einheiten", [300, 600, 900, 1100, 1300], quelle="Mit den Übernahmen mitkommend.")
eingabe("halb", "Anteil Umsatz im Zugangsjahr", "%", 0.5, "0%", "Halbjahreskonvention: Zugang im Mittel zur Jahresmitte.")
leer()

titel("Übernahmen")
eingabe("mult", "Kaufpreis in Jahresumsätzen", "x Umsatz", 1.0, "0.00",
        "Implenia/Wincasa: CHF 171,6 Mio. für CHF 159 Mio. Umsatz = 1,08x (cash.ch). Kleinfirmen tiefer.")
eingabe("bar", "davon bar bei Vollzug", "%", 0.5, "0%", "Übliche Struktur Nachfolge-Deal; Rest Verkäuferdarlehen und Earn-out.")
eingabe("vdar", "davon Verkäuferdarlehen (3 Jahre)", "%", 0.3, "0%", "Rückzahlung in 3 gleichen Raten ab Folgejahr.")
eingabe("earn", "davon Earn-out (im Folgejahr fällig)", "%", 0.2, "0%", "Nur bei Kundenbindung >90 %.")
eingabe("integ", "Integrationskosten", "% Kaufpreis", 0.08, "0%", "Datenmigration, Umschulung, Doppellizenzen.")
eingabe("goodw", "Abschreibungsdauer Goodwill/Kundenstamm", "Jahre", 8, "0", "OR/Swiss GAAP FER: 5–20 Jahre.")
leer()

titel("Produktivität und Personal")
eingabe("prod", "Miet-Einheiten je Bewirtschafter-FTE (inkl. KI)", "Einheiten", [400, 440, 480, 520, 560],
        quelle="Klassisch ca. 400–450 (Annahme aus Praxis, zu verifizieren). KI-Ziel +40 % bis Jahr 5 (bewusst unter dem Anspruch «KI erledigt 80 %»), analog «KI erledigt 80 %» (mory.ai).")
eingabe("stwef", "STWE-Einheit entspricht Miet-Einheiten", "Faktor", 0.6, "0.0", "Weniger Mieterkontakte, dafür Versammlungen.")
eingabe("k_bew", "Kosten je Bewirtschafter-FTE (Vollkosten)", "CHF/Jahr", 118000,
        quelle="Lohn Median CHF 84k–98k (jobs.ch, lohncheck.ch) + ca. 18 % Sozialabgaben/BVG + Weiterbildung.")
eingabe("ass", "Assistenz/Buchhaltung je Bewirtschafter", "FTE", [0.6, 0.55, 0.5, 0.45, 0.4], "0.00",
        "KI übernimmt Belegerfassung und Standardkorrespondenz.")
eingabe("k_ass", "Kosten je Assistenz-FTE (Vollkosten)", "CHF/Jahr", 88000, quelle="Sachbearbeitung Immobilien, lohnanalyse.ch.")
eingabe("gl", "Geschäftsleitung und Zentrale (Gründer, Technik, Vertrieb, Finanzen)", "CHF/Jahr",
        [330000, 650000, 1000000, 1350000, 1650000],
        quelle="J1: Gründer 140k + Technik 150k + Teilzeit 40k. Ab J3 CFO/M&A, ab J2 Vertrieb/Marketing.")
leer()

titel("Sachkosten")
eingabe("sw", "Software (ERP, KI, Hosting) je verwaltete Einheit", "CHF/Jahr", 22,
        quelle="ERP-Lizenz ca. CHF 10–15/Einheit (Annahme, Offerten einholen) + KI/LLM ca. CHF 8.")
eingabe("mk_m", "Akquisekosten je neue organische Miet-Einheit", "CHF", 260, quelle="Marketingplan 03: Budget ÷ Zielvolumen.")
eingabe("mk_s", "Akquisekosten je neue organische STWE-Einheit", "CHF", 160)
eingabe("buero", "Büro/Arbeitsplatz je FTE", "CHF/Jahr", 9000, quelle="Coworking/Büro Agglomeration Zürich, Annahme.")
eingabe("fix", "Versicherung, Treuhand, Revision, Recht, Verbände", "CHF/Jahr", [70000, 95000, 130000, 160000, 190000],
        quelle="Berufshaftpflicht, Vertrauensschaden, Revision, SVIT-Mitgliedschaft.")
eingabe("steuer", "Gewinnsteuersatz effektiv", "%", 0.197, "0.0%", "Kanton Zürich, Stadt Zürich, ca. 19,7 %.")
leer()

titel("Finanzierung")
eingabe("ek", "Eigenkapital-Einlagen", "CHF", [750000, 1800000, 0, 0, 0],
        quelle="J1: Gründer + 2–4 Business Angels. J2: Wachstumsrunde (Family Office / Search-Fund-Investoren).")
eingabe("kredit", "Akquisitionskredit Bank (neu aufgenommen)", "CHF", [200000, 500000, 600000, 1000000, 1200000],
        quelle="Zielgrösse ≤ 2,5x EBITDA. Laufzeit 5 Jahre.")
eingabe("zins", "Zinssatz Bankkredit und Verkäuferdarlehen", "%", 0.055, "0.0%", "Annahme KMU-Akquisitionsfinanzierung.")
eingabe("kl", "Laufzeit Bankkredit", "Jahre", 5, "0")
eingabe("kasse0", "Liquide Mittel zu Beginn", "CHF", 0)

A.freeze_panes = "C6"

def a(name, i=None, abs_=True):
    """Bezug auf Annahme; i = Jahresindex (None = Skalar in Spalte C)."""
    r = R[name]
    return f"Annahmen!$C${r}" if i is None else f"Annahmen!{SP[i]}{r}"

SZ = "Annahmen!$D$4"

# ================================================================ Modell
M = wb.create_sheet("Modell")
M.column_dimensions["A"].width = 50
M.column_dimensions["B"].width = 4
for s in SP:
    M.column_dimensions[s].width = 14
M["A1"] = "Hausklar – Modell (berechnet, nicht bearbeiten)"
M["A1"].font = f(14, True, PETROL)
M["A2"] = '="Szenario: "&Annahmen!C4'
M["A2"].font = f(10, True)

Z = {}
mz = [4]
OFFEN = []   # Formeln erst schreiben, wenn alle Zeilen bekannt sind

def mtitel(text):
    r = mz[0]
    M[f"A{r}"] = text; M[f"A{r}"].font = f(11, True, "FFFFFF")
    for c in ["A", "B"] + SP:
        M[f"{c}{r}"].fill = PatternFill("solid", fgColor=PETROL)
    for i, j in enumerate(JAHRE):
        M[f"{SP[i]}{r}"] = j; M[f"{SP[i]}{r}"].font = f(10, True, "FFFFFF")
    mz[0] += 1

def zeile_m(name, text, formel, fmt="#,##0", fett=False, summe=False):
    """formel(i) liefert die Formel für Jahresindex i."""
    r = mz[0]; Z[name] = r
    M[f"A{r}"] = text; M[f"A{r}"].font = f(10, fett)
    OFFEN.append((r, formel))
    for i in range(5):
        c = M[f"{SP[i]}{r}"]
        c.number_format = fmt; c.font = f(10, fett)
        if summe:
            c.border = Border(top=Side(style="thin", color=TINTE))
            c.fill = PatternFill("solid", fgColor=HELL)
    if summe:
        M[f"A{r}"].fill = PatternFill("solid", fgColor=HELL)
    mz[0] += 1

def m(name, i):
    return f"{SP[i]}{Z[name]}"

def vorjahr(name, i, sonst="0"):
    return sonst if i == 0 else f"{SP[i-1]}{Z[name]}"

mtitel("Einheiten")
zeile_m("zug_m", "Zugang Miet-Einheiten", lambda i: f"ROUND(({a('org_m',i)}+{a('ueb_m',i)})*{SZ},0)")
zeile_m("zug_s", "Zugang STWE-Einheiten", lambda i: f"ROUND(({a('org_s',i)}+{a('ueb_s',i)})*{SZ},0)")
zeile_m("abg_m", "Abgang Miet-Einheiten (Kündigungen)", lambda i: f"-ROUND({vorjahr('end_m',i)}*{a('churn')},0)")
zeile_m("abg_s", "Abgang STWE-Einheiten", lambda i: f"-ROUND({vorjahr('end_s',i)}*{a('churn')},0)")
zeile_m("end_m", "Miet-Einheiten Jahresende", lambda i: f"{vorjahr('end_m',i)}+{m('zug_m',i)}+{m('abg_m',i)}", fett=True)
zeile_m("end_s", "STWE-Einheiten Jahresende", lambda i: f"{vorjahr('end_s',i)}+{m('zug_s',i)}+{m('abg_s',i)}", fett=True)
zeile_m("avg_m", "Miet-Einheiten ertragswirksam (Ø)", lambda i: f"{vorjahr('end_m',i)}+({m('zug_m',i)}+{m('abg_m',i)})*{a('halb')}")
zeile_m("avg_s", "STWE-Einheiten ertragswirksam (Ø)", lambda i: f"{vorjahr('end_s',i)}+({m('zug_s',i)}+{m('abg_s',i)})*{a('halb')}")
mz[0] += 1

mtitel("Erfolgsrechnung (CHF)")
zeile_m("u_m", "Honorar Mietliegenschaften", lambda i: f"{m('avg_m',i)}*{a('miete')}*12*{a('hon')}")
zeile_m("u_s", "Honorar Stockwerkeigentum", lambda i: f"{m('avg_s',i)}*{a('stwe')}")
zeile_m("u_z", "Zusatzerträge", lambda i: f"({m('u_m',i)}+{m('u_s',i)})*{a('zusatz')}")
zeile_m("umsatz", "Umsatz", lambda i: f"{m('u_m',i)}+{m('u_s',i)}+{m('u_z',i)}", fett=True, summe=True)
zeile_m("fte_b", "Bewirtschafter-FTE (Bedarf)", lambda i: f"ROUNDUP(({m('avg_m',i)}+{m('avg_s',i)}*{a('stwef')})/{a('prod',i)},1)", "0.0")
zeile_m("fte_a", "Assistenz-FTE", lambda i: f"ROUND({m('fte_b',i)}*{a('ass',i)},1)", "0.0")
zeile_m("k_pers", "Personal Bewirtschaftung", lambda i: f"-({m('fte_b',i)}*{a('k_bew')}+{m('fte_a',i)}*{a('k_ass')})")
zeile_m("k_gl", "Geschäftsleitung und Zentrale", lambda i: f"-{a('gl',i)}")
zeile_m("k_sw", "Software und KI", lambda i: f"-({m('avg_m',i)}+{m('avg_s',i)})*{a('sw')}")
zeile_m("k_mk", "Marketing und Vertrieb", lambda i: f"-ROUND(({a('org_m',i)}*{a('mk_m')}+{a('org_s',i)}*{a('mk_s')})*{SZ},0)")
zeile_m("k_bu", "Büro", lambda i: f"-({m('fte_b',i)}+{m('fte_a',i)}+ROUND({a('gl',i)}/150000,0))*{a('buero')}")
zeile_m("k_fix", "Versicherung, Treuhand, Recht", lambda i: f"-{a('fix',i)}")
zeile_m("k_int", "Integrationskosten Übernahmen", lambda i: f"-{m('kp',i)}*{a('integ')}")
zeile_m("ebitda", "EBITDA", lambda i: "SUM(" + f"{m('umsatz',i)}" + "," + f"{SP[i]}{Z['k_pers']}:{SP[i]}{Z['k_int']})", fett=True, summe=True)
zeile_m("ebitda_q", "EBITDA-Marge", lambda i: f"IF({m('umsatz',i)}=0,0,{m('ebitda',i)}/{m('umsatz',i)})", "0.0%")
zeile_m("abschr", "Abschreibung Goodwill/Kundenstamm", lambda i: f"-SUM($C${Z['kp']}:{SP[i]}{Z['kp']})/{a('goodw')}")
zeile_m("zinsen", "Zinsaufwand", lambda i: f"-({vorjahr('kredit_s',i)}+{vorjahr('vd_s',i)})*{a('zins')}")
zeile_m("ebt", "Ergebnis vor Steuern", lambda i: f"{m('ebitda',i)}+{m('abschr',i)}+{m('zinsen',i)}", fett=True)
zeile_m("steuern", "Steuern", lambda i: f"-MAX(0,{m('ebt',i)})*{a('steuer')}")
zeile_m("gewinn", "Jahresergebnis", lambda i: f"{m('ebt',i)}+{m('steuern',i)}", fett=True, summe=True)
mz[0] += 1

mtitel("Übernahmen (CHF)")
zeile_m("ueb_u", "Übernommener Jahresumsatz", lambda i: f"ROUND({a('ueb_m',i)}*{SZ},0)*{a('miete')}*12*{a('hon_ueb')}*(1+{a('zusatz')})+ROUND({a('ueb_s',i)}*{SZ},0)*{a('stwe')}*(1+{a('zusatz')})")
zeile_m("kp", "Kaufpreis total", lambda i: f"{m('ueb_u',i)}*{a('mult')}")
zeile_m("kp_bar", "davon bar bei Vollzug", lambda i: f"{m('kp',i)}*{a('bar')}")
zeile_m("kp_earn", "Earn-out fällig (aus Vorjahres-Deals)", lambda i: "0" if i == 0 else f"{SP[i-1]}{Z['kp']}*{a('earn')}")
zeile_m("vd_neu", "Verkäuferdarlehen neu", lambda i: f"{m('kp',i)}*{a('vdar')}")
zeile_m("vd_tilg", "Tilgung Verkäuferdarlehen", lambda i: "0" if i == 0 else
        "(" + "+".join(f"{SP[j]}{Z['vd_neu']}" for j in range(max(0, i-3), i)) + ")/3")
zeile_m("vd_s", "Verkäuferdarlehen Bestand Jahresende", lambda i: f"{vorjahr('vd_s',i)}+{m('vd_neu',i)}-{m('vd_tilg',i)}")
mz[0] += 1

mtitel("Geldfluss und Finanzierung (CHF)")
zeile_m("cf_op", "Geldfluss aus Betrieb (EBITDA − Zinsen − Steuern)", lambda i: f"{m('ebitda',i)}+{m('zinsen',i)}+{m('steuern',i)}")
zeile_m("cf_inv", "Übernahmen bar + Earn-out", lambda i: f"-({m('kp_bar',i)}+{m('kp_earn',i)})")
zeile_m("cf_vd", "Tilgung Verkäuferdarlehen", lambda i: f"-{m('vd_tilg',i)}")
zeile_m("kr_neu", "Bankkredit neu", lambda i: f"{a('kredit',i)}")
zeile_m("kr_tilg", "Tilgung Bankkredit", lambda i: "0" if i == 0 else
        "-(" + "+".join(f"{SP[j]}{Z['kr_neu']}" for j in range(0, i)) + f")/{a('kl')}")
zeile_m("kredit_s", "Bankkredit Bestand Jahresende", lambda i: f"{vorjahr('kredit_s',i)}+{m('kr_neu',i)}+{m('kr_tilg',i)}")
zeile_m("cf_ek", "Eigenkapital-Einlagen", lambda i: f"{a('ek',i)}")
zeile_m("cf", "Veränderung liquide Mittel", lambda i: f"{m('cf_op',i)}+{m('cf_inv',i)}+{m('cf_vd',i)}+{m('kr_neu',i)}+{m('kr_tilg',i)}+{m('cf_ek',i)}", fett=True)
zeile_m("kasse", "Liquide Mittel Jahresende", lambda i: (a('kasse0') if i == 0 else vorjahr('kasse', i)) + f"+{m('cf',i)}", fett=True, summe=True)
zeile_m("lev", "Nettoverschuldung / EBITDA", lambda i: f"IF({m('ebitda',i)}<=0,\"n. a.\",({m('kredit_s',i)}+{m('vd_s',i)}-{m('kasse',i)})/{m('ebitda',i)})", "0.0x")
mz[0] += 1

mtitel("Kennzahlen")
zeile_m("u_je", "Umsatz je Mitarbeitende/r (FTE total)", lambda i: f"{m('umsatz',i)}/({m('fte_b',i)}+{m('fte_a',i)}+ROUND({a('gl',i)}/150000,0))")
zeile_m("fte", "Mitarbeitende FTE total", lambda i: f"{m('fte_b',i)}+{m('fte_a',i)}+ROUND({a('gl',i)}/150000,0)", "0.0")
zeile_m("rr", "Umsatz-Laufrate Jahresende (Run-Rate)", lambda i: f"({m('end_m',i)}*{a('miete')}*12*{a('hon')}+{m('end_s',i)}*{a('stwe')})*(1+{a('zusatz')})")
zeile_m("ziel", "Ziel CHF 10 Mio. Umsatz erreicht?", lambda i: f"IF({m('umsatz',i)}>=10000000,\"JA\",\"nein\")", "@", fett=True)

for r, formel in OFFEN:
    for i in range(5):
        M[f"{SP[i]}{r}"].value = "=" + formel(i)

M.conditional_formatting.add(f"C{Z['kasse']}:G{Z['kasse']}",
                             CellIsRule(operator="lessThan", formula=["0"], fill=PatternFill("solid", fgColor="FBE4E2")))
M.freeze_panes = "C5"

# ================================================================ Übersicht
U = wb.create_sheet("Übersicht", 0)
U.column_dimensions["A"].width = 44
for s in SP:
    U.column_dimensions[s].width = 15
U["A1"] = "Hausklar – Übersicht 5 Jahre"
U["A1"].font = f(16, True, PETROL)
U["A2"] = '="Szenario: "&Annahmen!C4&"  ·  Wechsel in Annahmen!C4"'
U["A2"].font = f(10, i=True)
U["A4"] = "Kennzahl"
for i, j in enumerate(JAHRE):
    U[f"{SP[i]}4"] = j
for c in ["A"] + SP:
    U[f"{c}4"].font = f(10, True, "FFFFFF"); U[f"{c}4"].fill = PatternFill("solid", fgColor=PETROL)
auszug = [("Umsatz", "umsatz", "#,##0"), ("EBITDA", "ebitda", "#,##0"), ("EBITDA-Marge", "ebitda_q", "0.0%"),
          ("Jahresergebnis", "gewinn", "#,##0"), ("Liquide Mittel Jahresende", "kasse", "#,##0"),
          ("Miet-Einheiten Jahresende", "end_m", "#,##0"), ("STWE-Einheiten Jahresende", "end_s", "#,##0"),
          ("Mitarbeitende FTE", "fte", "0.0"), ("Umsatz je FTE", "u_je", "#,##0"),
          ("Run-Rate Jahresende", "rr", "#,##0"), ("Nettoverschuldung / EBITDA", "lev", "0.0x"),
          ("Ziel CHF 10 Mio. erreicht?", "ziel", "@")]
for k, (t, n, fm) in enumerate(auszug):
    r = 5 + k
    U[f"A{r}"] = t; U[f"A{r}"].font = f(10, n in ("umsatz", "ebitda", "ziel"))
    for i in range(5):
        c = U[f"{SP[i]}{r}"]
        c.value = f"=Modell!{SP[i]}{Z[n]}"; c.number_format = fm
        c.font = f(10, n in ("umsatz", "ebitda", "ziel"))
        c.border = Border(bottom=duenn)
U["A19"] = "Lesehilfe"
U["A19"].font = f(10, True)
U["A20"] = "Die Zahlen sind ein Plan, keine Prognose. Jede Zeile lässt sich über «Annahmen» nachvollziehen."
U["A21"] = "Die grösste Stellschraube ist das Übernahmevolumen; die zweitgrösste die Produktivität je Bewirtschafter."
for r in (20, 21):
    U[f"A{r}"].font = f(9, i=True)

wb.save(DATEI)
print("gespeichert:", DATEI, "Zeilen Modell:", Z)
