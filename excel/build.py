# -*- coding: utf-8 -*-
"""Erzeugt die Leerstandsliste als Excel-Arbeitsmappe.

Fachliche Grundlage: die Analyse der bestehenden Liste und der Prototyp
(siehe docs/01-analyse-und-konzept.md und docs/prozesse/).
Die Datei ist für die gemeinsame Bearbeitung auf SharePoint ausgelegt:
eine einzige Tabelle, keine blattübergreifende Konsolidierung, keine Makros.
"""
import openpyxl
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, Protection
from openpyxl.utils import get_column_letter
from openpyxl.workbook.defined_name import DefinedName
from datetime import date, timedelta

import os
DATEI = os.environ.get("ZIEL","Leerstandsliste.xlsx")
KOPF_ZEILE = 4
ERSTE = 5
ANZ_ZEILEN = int(os.environ.get("ZEILEN","400"))
LETZTE = ERSTE + ANZ_ZEILEN - 1          # 404

# ---------------------------------------------------------------- Farben
TINTE   = "1A1A1A"
PETROL  = "0F5C6E"
HELL    = "EDF1F2"
GRAU    = "F2F5F6"
ROT_F   = "FBE4E2"
GRUEN_F = "E4F0E8"
GELB_F  = "FBF0D9"
GRAU_F  = "EDEFF0"
RAND    = "C6D0D5"

def schrift(groesse=10, fett=False, farbe=TINTE, kursiv=False):
    return Font(name="Arial", size=groesse, bold=fett, color=farbe, italic=kursiv)

duenn = Side(style="thin", color=RAND)
rahmen = Border(left=duenn, right=duenn, top=duenn, bottom=duenn)

# ---------------------------------------------------------------- Spalten
# (Überschrift, Breite, Art, Zahlenformat)
#  Art: "e" = Eingabe, "f" = Formel, "s" = Schritt (Datum oder n.e.)
SPALTEN = [
    ("Fall-Nr.",                     12, "e", "@"),
    ("Obj.-Nr.",                     14, "e", "@"),
    ("Liegenschaft",                 24, "e", "@"),
    ("Stock",                         9, "e", "@"),
    ("ex-Mieter",                    22, "e", "@"),
    ("Bewirtschafter",               16, "e", "@"),
    ("Team",                          9, "f", "@"),
    ("Status",                       14, "f", "@"),
    ("Nächster Schritt",             30, "f", "@"),
    ("Leerstandstage",               10, "f", "0"),
    ("Prüfhinweis",                  34, "f", "@"),
    ("gekündigt per",                13, "e", "DD.MM.YYYY"),
    ("Haftungsdatum",                13, "e", "DD.MM.YYYY"),
    ("Leerstandsbeginn",             14, "f", "DD.MM.YYYY"),
    ("Vorlauftage",                  10, "f", "0"),
    ("Berichtsmonat",                12, "f", "@"),
    ("Mieter seit",                  12, "e", "DD.MM.YYYY"),
    ("neuer Mieter",                 20, "e", "@"),
    ("Vermietet per",                13, "e", "DD.MM.YYYY"),
    ("Arbeitsbereich",               20, "f", "@"),
    ("Phase",                        22, "f", "@"),
    ("Ort",                          16, "e", "@"),
    ("Anz. Zimmer",                  10, "e", "0.0"),
    ("Eigentümer",                   22, "e", "@"),
    ("Dossier",                      26, "e", "@"),
    ("WA-Termin",                    12, "e", "DD.MM.YYYY"),
    ("Sollfrist Abnahmetermin",      14, "f", "DD.MM.YYYY"),
    ("Sollfrist Handwerker",         14, "f", "DD.MM.YYYY"),
    ("Vertrag retour bis",           13, "e", "DD.MM.YYYY"),
    ("Schlüsselübergabe-Termin",     14, "e", "DD.MM.YYYY"),
    ("Kündigung bestätigt / G-Rem",  16, "s", "DD.MM.YYYY"),
    ("Meldung Werke / EGT",          16, "s", "DD.MM.YYYY"),
    ("Vorbesichtigung",              15, "s", "DD.MM.YYYY"),
    ("VMZ aktualisiert",             15, "s", "DD.MM.YYYY"),
    ("Inserat online",               14, "s", "DD.MM.YYYY"),
    ("Wohnungsabnahme durchgeführt", 17, "s", "DD.MM.YYYY"),
    ("Handwerker aufgeboten",        16, "s", "DD.MM.YYYY"),
    ("Zustimmungserklärung",         16, "s", "DD.MM.YYYY"),
    ("Instandstellungen beauftragt", 17, "s", "DD.MM.YYYY"),
    ("Vertrag versendet",            14, "s", "DD.MM.YYYY"),
    ("Vertrag retour",               14, "s", "DD.MM.YYYY"),
    ("Info Werke / EGT",             14, "s", "DD.MM.YYYY"),
    ("Schlüsselübergabe erfolgt",    16, "s", "DD.MM.YYYY"),
    ("Reinigung veranlasst",         15, "s", "DD.MM.YYYY"),
    ("Namensschilder",               14, "s", "DD.MM.YYYY"),
    ("Kaution / G-Rem mutiert",      16, "s", "DD.MM.YYYY"),
    ("Instandstellungs-RG",          15, "s", "DD.MM.YYYY"),
    ("Schlussabrechnung",            15, "s", "DD.MM.YYYY"),
    ("Zahlungseingang",              15, "s", "DD.MM.YYYY"),
    ("zurückgestellt bis",           13, "e", "DD.MM.YYYY"),
    ("Fall abgeschlossen",           14, "e", "DD.MM.YYYY"),
    ("Notiz",                        40, "e", "@"),
]
SP = {name: get_column_letter(i+1) for i, (name, *_ ) in enumerate(SPALTEN)}
LETZTE_SP = get_column_letter(len(SPALTEN))

def s(name):
    """Spaltenbuchstabe zu einer Überschrift – bricht bei Tippfehlern sofort ab."""
    if name not in SP:
        raise KeyError("Unbekannte Spalte: " + name)
    return SP[name]

BEWIRTSCHAFTER = [
    ("Moren", "BS 02"), ("Ryser", "BS 02"), ("Scherb", "BS 02"),
    ("Ademi", "BS 02"), ("Fazliu", "BS 02"),
    ("Brandenburger", "BS 01"), ("Breitmeier", "BS 01"),
    ("Loa", "BS 01"), ("Sivanesan", "BS 01"),
]

# Reihenfolge des Prozesses: (Bedingungsspalte, Text, zusätzliche Bedingung)
NAECHSTER = [
    ("Haftungsdatum",                 "Haftungsdatum erfassen",        None),
    ("ex-Mieter",                     "ex-Mieter erfassen",            None),
    ("Kündigung bestätigt / G-Rem",   "Kündigung bestätigen / G-Rem",  None),
    ("Meldung Werke / EGT",           "Werke / EGT melden",            None),
    ("Vorbesichtigung",               "Vorbesichtigung (oder n.e.)",   None),
    ("VMZ aktualisiert",              "VMZ aktualisieren",             None),
    ("Inserat online",                "Inserat aufschalten",           None),
    ("WA-Termin",                     "Abnahmetermin vereinbaren",     "Wohnungsabnahme durchgeführt"),
    ("Wohnungsabnahme durchgeführt",  "Wohnungsabnahme durchführen",   None),
    ("Handwerker aufgeboten",         "Handwerker aufbieten",          None),
    ("Zustimmungserklärung",          "Zustimmungserklärung einholen", None),
    ("Instandstellungen beauftragt",  "Instandstellungen beauftragen", None),
    ("neuer Mieter",                  "Nachmieter erfassen",           None),
    ("Vertrag versendet",             "Vertrag versenden",             None),
    ("Vertrag retour",                "Vertrag retour erfassen",       None),
    ("Vermietet per",                 "Vermietet per erfassen",        None),
    ("Info Werke / EGT",              "Werke / EGT über Einzug informieren", None),
    ("Schlüsselübergabe-Termin",      "Schlüsselübergabe terminieren", "Schlüsselübergabe erfolgt"),
    ("Schlüsselübergabe erfolgt",     "Schlüsselübergabe durchführen", None),
    ("Reinigung veranlasst",          "Reinigung veranlassen",         None),
    ("Namensschilder",                "Namensschilder bestellen",      None),
    ("Kaution / G-Rem mutiert",       "Kaution prüfen / G-Rem mutieren", None),
    ("Instandstellungs-RG",           "Instandstellungs-Rechnung erfassen", None),
    ("Schlussabrechnung",             "Schlussabrechnung erstellen",   None),
    ("Zahlungseingang",               "Zahlungseingang kontrollieren", None),
]

# Die überwachten Fristen. Status und «Nächster Schritt» greifen beide auf
# diese eine Liste zu – so können die beiden Spalten nicht auseinanderlaufen
# und eine rote Zeile nennt immer genau die Frist, die verstrichen ist.
# Reihenfolge = Reihenfolge im Prozess.
FRISTEN = [
    ('AND(ISNUMBER({sa}{r}),{sa}{r}<TODAY(),{wa}{r}="",{wd}{r}="")',
     "Abnahmetermin vereinbaren – Sollfrist verstrichen"),
    ('AND(ISNUMBER({wa}{r}),{wa}{r}<TODAY(),{wd}{r}="")',
     "Wohnungsabnahme nachtragen – Termin war fällig"),
    ('AND(ISNUMBER({sh}{r}),{sh}{r}<TODAY(),{hw}{r}="")',
     "Handwerker aufbieten – Frist verstrichen"),
    ('AND(ISNUMBER({vb}{r}),{vb}{r}<TODAY(),{vr}{r}="")',
     "Vertrag retour mahnen – Frist verstrichen"),
    ('AND(ISNUMBER({st}{r}),{st}{r}<TODAY(),{se}{r}="")',
     "Schlüsselübergabe nachtragen – Termin war fällig"),
]

def frist_args(r):
    return dict(r=r, wa=s("WA-Termin"), wd=s("Wohnungsabnahme durchgeführt"),
                sa=s("Sollfrist Abnahmetermin"), sh=s("Sollfrist Handwerker"),
                hw=s("Handwerker aufgeboten"), st=s("Schlüsselübergabe-Termin"),
                se=s("Schlüsselübergabe erfolgt"), vb=s("Vertrag retour bis"),
                vr=s("Vertrag retour"))

def formel_naechster(r):
    """Verschachteltes WENN über den Prozess – liefert die nächste offene Handlung.
    Eine verstrichene Frist geht allem voran: sonst stünde in einer roten Zeile
    eine andere Handlung als die, die überfällig ist."""
    kern = '"Fall abschliessen"'
    for spalte, text, zusatz in reversed(NAECHSTER):
        if zusatz:
            bed = 'AND({}{}="",{}{}="")'.format(s(spalte), r, s(zusatz), r)
        else:
            bed = '{}{}=""'.format(s(spalte), r)
        kern = 'IF({},"{}",{})'.format(bed, text, kern)
    a = frist_args(r)
    for bedingung, text in reversed(FRISTEN):
        kern = 'IF({},"{}",{})'.format(bedingung.format(**a), text, kern)
    return '=IF(${}{}="","",IF({}{}<>"","—",{}))'.format(
        s("Obj.-Nr."), r, s("Fall abgeschlossen"), r, kern)

def formel_status(r):
    bed = ",".join(b.format(**frist_args(r)) for b, _ in FRISTEN)
    return ('=IF(${o}{r}="","",IF({ab}{r}<>"","abgeschlossen",'
            'IF(AND(ISNUMBER({zb}{r}),{zb}{r}>=TODAY()),"zurückgestellt",'
            'IF(OR({bed}),"überfällig","offen"))))').format(
        o=s("Obj.-Nr."), ab=s("Fall abgeschlossen"), zb=s("zurückgestellt bis"),
        bed=bed, r=r)

def formel_pruefung(r):
    p = dict(r=r, o=s("Obj.-Nr."), fn=s("Fall-Nr."), ex=s("ex-Mieter"),
             ku=s("gekündigt per"), ha=s("Haftungsdatum"), ve=s("Vermietet per"),
             wa=s("WA-Termin"), ab=s("Fall abgeschlossen"), za=s("Zahlungseingang"),
             lt=s("Leerstandstage"), bw=s("Bewirtschafter"))
    teile = [
        'IF(AND({ku}{r}<>"",{ha}{r}<>"",{ha}{r}<{ku}{r}),"Haftungsdatum vor Kündigung. ","")',
        'IF(AND({ve}{r}<>"",{ha}{r}<>"",{ve}{r}<{ha}{r}),"Vermietung vor Leerstandsbeginn. ","")',
        'IF(AND({wa}{r}<>"",{ku}{r}<>"",{wa}{r}<{ku}{r}),"WA-Termin vor Kündigung. ","")',
        'IF(COUNTIFS(${o}${e}:${o}${l},${o}{r},${ab}${e}:${ab}${l},"")>1,"Zweiter offener Fall zum selben Objekt. ","")',
        'IF(AND(${fn}{r}<>"",COUNTIFS(${fn}${e}:${fn}${l},${fn}{r})>1),"Fall-Nr. doppelt vergeben. ","")',
        'IF({ex}{r}="","ex-Mieter fehlt. ","")',
        'IF({ha}{r}="","Haftungsdatum fehlt. ","")',
        'IF({bw}{r}="","Bewirtschafter fehlt. ","")',
        'IF(AND({ab}{r}<>"",{za}{r}=""),"Abgeschlossen trotz offener Schlussabrechnung. ","")',
        'IF(AND({ab}{r}="",{ve}{r}="",ISNUMBER({lt}{r}),{lt}{r}>60),"Langläufer über 60 Tage. ","")',
    ]
    p["e"], p["l"] = ERSTE, LETZTE
    # Bewusst ohne TEXTJOIN: reine Verkettung funktioniert in jeder Excel-Fassung
    # und kann keine leeren Trennzeichen erzeugen. Jeder Hinweis endet auf ". ",
    # TRIM entfernt das Leerzeichen am Schluss.
    inhalt = "&".join(t.format(**p) for t in teile)
    return '=IF(${o}{r}="","",TRIM({i}))'.format(o=s("Obj.-Nr."), r=r, i=inhalt)

FORMELN = {
    "Team": lambda r: ('=IF({b}{r}="","",IFERROR(INDEX(Stammdaten!$B$5:$B$24,'
                       'MATCH({b}{r},Stammdaten!$A$5:$A$24,0)),"unbekannt"))').format(b=s("Bewirtschafter"), r=r),
    "Status": formel_status,
    "Nächster Schritt": formel_naechster,
    "Leerstandstage": lambda r: ('=IF({h}{r}="","",IF({v}{r}<>"",MAX(0,{v}{r}-{h}{r}-1),'
                                 'MAX(0,TODAY()-{h}{r})))').format(h=s("Haftungsdatum"), v=s("Vermietet per"), r=r),
    "Prüfhinweis": formel_pruefung,
    "Leerstandsbeginn": lambda r: '=IF({h}{r}="","",{h}{r}+1)'.format(h=s("Haftungsdatum"), r=r),
    "Vorlauftage": lambda r: '=IF(OR({k}{r}="",{h}{r}=""),"",{h}{r}-{k}{r})'.format(
        k=s("gekündigt per"), h=s("Haftungsdatum"), r=r),
    "Berichtsmonat": lambda r: ('=IF({h}{r}="","",YEAR({h}{r}+1)&"-"&TEXT(MONTH({h}{r}+1),"00"))'
                                ).format(h=s("Haftungsdatum"), r=r),
    "Arbeitsbereich": lambda r: ('=IF({p}{r}="","",IF(LEFT({p}{r},1)="6","abgeschlossen",'
        'IF(OR(LEFT({p}{r},1)="1",LEFT({p}{r},1)="2"),"Kündigung & Abnahme",'
        'IF(OR(LEFT({p}{r},1)="3",LEFT({p}{r},1)="4"),"Wiedervermietung","Schlussabrechnung"))))'
        ).format(p=s("Phase"), r=r),
    "Phase": lambda r: ('=IF(${o}{r}="","",IF({ab}{r}<>"","6 · abgeschlossen",'
        'IF({za}{r}<>"","5 · bereit zum Abschluss",IF({ka}{r}<>"","5 · Schlussabrechnung",'
        'IF({vr}{r}<>"","4 · Übergabe",IF({ib}{r}<>"","3 · Neuvermietung",'
        'IF({ha}{r}<>"","2 · Abnahme & Vermarktung","1 · Erfassung")))))))').format(
        o=s("Obj.-Nr."), ab=s("Fall abgeschlossen"), za=s("Zahlungseingang"),
        ka=s("Kaution / G-Rem mutiert"), vr=s("Vertrag retour"),
        ib=s("Instandstellungen beauftragt"), ha=s("Haftungsdatum"), r=r),
    "Sollfrist Abnahmetermin": lambda r: '=IF({h}{r}="","",{h}{r}-30)'.format(h=s("Haftungsdatum"), r=r),
    "Sollfrist Handwerker": lambda r: '=IF(ISNUMBER({w}{r}),{w}{r}+3,"")'.format(
        w=s("Wohnungsabnahme durchgeführt"), r=r),
}
print("Spalten:", len(SPALTEN), "· Formelspalten:", len(FORMELN))

# ================================================================ Aufbau
wb = openpyxl.Workbook()
heute = date.today()
def t(n): return heute + timedelta(days=n)

# ---------------------------------------------------------------- Stammdaten
wst = wb.active
wst.title = "Stammdaten"
wst["A1"] = "Stammdaten"; wst["A1"].font = schrift(14, True, PETROL)
wst["A2"] = "Bewirtschafter und Teamzuordnung. Wird von der Spalte «Team» und den Auswahllisten gelesen."
wst["A2"].font = schrift(9, farbe="5A6B76")
wst["A4"], wst["B4"] = "Bewirtschafter", "Team"
for c in ("A4", "B4"):
    wst[c].font = schrift(10, True, "FFFFFF")
    wst[c].fill = PatternFill("solid", fgColor=PETROL)
    wst[c].border = rahmen
for i, (name, team) in enumerate(BEWIRTSCHAFTER):
    r = 5 + i
    wst.cell(r, 1, name).border = rahmen
    wst.cell(r, 2, team).border = rahmen
    wst.cell(r, 1).font = schrift(); wst.cell(r, 2).font = schrift()
for r in range(5 + len(BEWIRTSCHAFTER), 25):          # Reserve bis Zeile 24
    wst.cell(r, 1).border = rahmen; wst.cell(r, 2).border = rahmen
wst["D4"] = "Teams"; wst["D4"].font = schrift(10, True, PETROL)
for i, tm in enumerate(["BS 01", "BS 02"]):
    wst.cell(5 + i, 4, tm).font = schrift()
wst["D8"] = "Weitere Bewirtschafter einfach in Spalte A und B ergänzen (bis Zeile 24)."
wst["D8"].font = schrift(9, farbe="5A6B76")
wst.column_dimensions["A"].width = 22; wst.column_dimensions["B"].width = 12
wst.column_dimensions["D"].width = 60
wb.defined_names.add(DefinedName("Bewirtschafterliste", attr_text="Stammdaten!$A$5:$A$24"))

# ---------------------------------------------------------------- Leerstände
ws = wb.create_sheet("Leerstände")
ws["A1"] = "Leerstandsliste – Pendenzen zu Mieterwechseln"
ws["A1"].font = schrift(15, True, PETROL)
ws["A2"] = ("Datenführung bleibt in Garaio REM. Hier wird nur festgehalten, dass ein Schritt erledigt ist. "
            "Graue Spalten rechnen selbst – bitte nicht überschreiben.")
ws["A2"].font = schrift(9, farbe="5A6B76")
ws["A3"] = ("Schrittspalten: Erledigungsdatum eintragen, oder «n.e.» wenn der Schritt entfällt. "
            "Leer bedeutet offen.   |   Das Blatt ist leer und einsatzbereit – zehn ausgefüllte "
            "Beispielfälle stehen im Blatt «Beispiele».")
ws["A3"].font = schrift(9, True, "8A5A0B")

for i, (name, breite, art, fmt) in enumerate(SPALTEN):
    sp = get_column_letter(i + 1)
    ws.column_dimensions[sp].width = breite
    c = ws.cell(KOPF_ZEILE, i + 1, name)
    c.font = schrift(9, True, "FFFFFF")
    c.fill = PatternFill("solid", fgColor=PETROL if art != "f" else "3D8B9D")
    c.alignment = Alignment(wrap_text=True, vertical="center")
    c.border = rahmen
ws.row_dimensions[KOPF_ZEILE].height = 42

for r in range(ERSTE, LETZTE + 1):
    for i, (name, breite, art, fmt) in enumerate(SPALTEN):
        c = ws.cell(r, i + 1)
        c.font = schrift(10)
        c.number_format = fmt
        c.border = rahmen
        c.alignment = Alignment(vertical="center")
        if art == "f":
            c.value = FORMELN[name](r)
            c.fill = PatternFill("solid", fgColor=GRAU)
            c.protection = Protection(locked=True)
        else:
            c.protection = Protection(locked=False)

tab = Table(displayName="Leerstaende", ref="A{}:{}{}".format(KOPF_ZEILE, LETZTE_SP, LETZTE))
tab.tableStyleInfo = TableStyleInfo(name="TableStyleLight1", showRowStripes=False,
                                    showColumnStripes=False, showFirstColumn=False, showLastColumn=False)
ws.add_table(tab)
ws.freeze_panes = "D5"

# ---------------------------------------------------------------- Prüfregeln
dv_bew = DataValidation(type="list", formula1="=Bewirtschafterliste", allow_blank=True,
                        showErrorMessage=True, errorTitle="Unbekannter Bewirtschafter",
                        error="Bitte einen Namen aus der Liste wählen. Neue Personen zuerst im Blatt «Stammdaten» erfassen.")
ws.add_data_validation(dv_bew)
dv_bew.add("{c}{a}:{c}{b}".format(c=s("Bewirtschafter"), a=ERSTE, b=LETZTE))

dv_datum = DataValidation(type="date", operator="between",
                          formula1="DATE(2015,1,1)", formula2="DATE(2045,12,31)",
                          allow_blank=True, showErrorMessage=True, errorTitle="Ungültiges Datum",
                          error="Bitte ein Datum zwischen 2015 und 2045 eingeben, zum Beispiel 31.08.2026.")
ws.add_data_validation(dv_datum)
for name, breite, art, fmt in SPALTEN:
    if art == "e" and fmt == "DD.MM.YYYY":
        dv_datum.add("{c}{a}:{c}{b}".format(c=s(name), a=ERSTE, b=LETZTE))

dv_zahl = DataValidation(type="decimal", operator="between", formula1=0.5, formula2=20,
                         allow_blank=True, showErrorMessage=True, errorTitle="Ungültige Zimmerzahl",
                         error="Bitte eine Zahl zwischen 0,5 und 20 eingeben.")
ws.add_data_validation(dv_zahl)
dv_zahl.add("{c}{a}:{c}{b}".format(c=s("Anz. Zimmer"), a=ERSTE, b=LETZTE))

for name, breite, art, fmt in SPALTEN:
    if art != "s":
        continue
    sp = s(name)
    dv = DataValidation(type="custom",
        formula1='=OR(ISNUMBER({c}{r}),EXACT(UPPER({c}{r}),"N.E."))'.format(c=sp, r=ERSTE),
        allow_blank=True, showErrorMessage=True, errorTitle="Datum oder n.e.",
        error="In Schrittspalten gehört entweder das Erledigungsdatum oder «n.e.», wenn der Schritt entfällt. Leer bedeutet offen.")
    ws.add_data_validation(dv)
    dv.add("{c}{a}:{c}{b}".format(c=sp, a=ERSTE, b=LETZTE))

# ---------------------------------------------------------------- Einfärbung
bereich = "A{}:{}{}".format(ERSTE, LETZTE_SP, LETZTE)
st = s("Status")
ws.conditional_formatting.add(bereich, FormulaRule(
    formula=['${c}{r}="überfällig"'.format(c=st, r=ERSTE)],
    fill=PatternFill("solid", fgColor=ROT_F), stopIfTrue=False))
ws.conditional_formatting.add(bereich, FormulaRule(
    formula=['${c}{r}="abgeschlossen"'.format(c=st, r=ERSTE)],
    fill=PatternFill("solid", fgColor=GRUEN_F), stopIfTrue=False))
ws.conditional_formatting.add(bereich, FormulaRule(
    formula=['${c}{r}="zurückgestellt"'.format(c=st, r=ERSTE)],
    fill=PatternFill("solid", fgColor=GRAU_F), stopIfTrue=False))
ws.conditional_formatting.add(
    "{c}{a}:{c}{b}".format(c=s("Prüfhinweis"), a=ERSTE, b=LETZTE),
    FormulaRule(formula=['LEN(${c}{r})>0'.format(c=s("Prüfhinweis"), r=ERSTE)],
                fill=PatternFill("solid", fgColor=GELB_F), stopIfTrue=False))

ws.protection.sheet = True
ws.protection.insertRows = False
ws.protection.formatCells = False
ws.protection.formatColumns = False
ws.protection.sort = False
ws.protection.autoFilter = False
print("Blatt «Leerstände» aufgebaut:", LETZTE - ERSTE + 1, "Zeilen")

# ---------------------------------------------------------------- Beispielzeilen
BEISPIELE = [
    # (Fall-Nr., Obj-Nr., Liegenschaft, Stock, ex-Mieter, Bewirtschafter, Ort, Zimmer, Eigentümer,
    #  kue, haft, verm, neuer Mieter, WA-Termin, Schlüsseltermin, erledigt{...}, zurück, abgeschl., Notiz)
    dict(fn="BSP-001", obj="0112.03.004", lie="Seestrasse 118", st="3. OG", ex="Familie Brunner",
         bw="Moren", ort="8002 Zürich", zi=3.5, eig="PK Helvetia Immobilien",
         kue=-58, haft=-24, wa=-6,
         erl={"Kündigung bestätigt / G-Rem":-55,"Meldung Werke / EGT":-54,"VMZ aktualisiert":-50,
              "Inserat online":-47,"Handwerker aufgeboten":-20},
         notiz="Abnahme kurzfristig verschoben, Mieter war krank."),
    dict(fn="BSP-002", obj="0774.06.021", lie="Hardturmstrasse 205", st="6. OG", ex="S. Kaufmann",
         bw="Moren", ort="8005 Zürich", zi=5.5, eig="PK Helvetia Immobilien",
         kue=-86, haft=-34, verm=14, neu="L. Iseli & P. Frei", sch=4,
         erl={"Kündigung bestätigt / G-Rem":-84,"Meldung Werke / EGT":-83,"Vorbesichtigung":"n.e.",
              "VMZ aktualisiert":-79,"Inserat online":-76,"Wohnungsabnahme durchgeführt":-33,
              "Handwerker aufgeboten":-32,"Zustimmungserklärung":-33,"Instandstellungen beauftragt":-31,
              "Vertrag versendet":-19,"Vertrag retour":-12,"Info Werke / EGT":-10,"Reinigung veranlasst":-6}),
    dict(fn="BSP-003", obj="0903.00.002", lie="Rebbergstrasse 4", st="EG", ex="M. Odermatt",
         bw="Moren", ort="8610 Uster", zi=2.5, eig="Erbengemeinschaft Vogt",
         kue=-133, haft=-71, verm=-56, neu="A. Schuler",
         erl={"Kündigung bestätigt / G-Rem":-131,"Meldung Werke / EGT":-130,"Vorbesichtigung":-126,
              "VMZ aktualisiert":-124,"Inserat online":-121,"Wohnungsabnahme durchgeführt":-70,
              "Handwerker aufgeboten":-69,"Zustimmungserklärung":-70,"Instandstellungen beauftragt":-67,
              "Vertrag versendet":-63,"Vertrag retour":-58,"Info Werke / EGT":-57,
              "Schlüsselübergabe erfolgt":-56,"Reinigung veranlasst":-58,"Namensschilder":-57,
              "Kaution / G-Rem mutiert":-59,"Instandstellungs-RG":-40,"Schlussabrechnung":-26}),
    dict(fn="BSP-004", obj="0348.05.011", lie="Birmensdorferstrasse 340", st="5. OG", ex="D. Hofstetter",
         bw="Moren", ort="8055 Zürich", zi=4.5, eig="Erbengemeinschaft Vogt",
         kue=-9, erl={"Kündigung bestätigt / G-Rem":-7},
         notiz="Haftungsdatum noch offen – Beispiel für einen Prüfhinweis."),
    dict(fn="BSP-005", obj="0501.02.007", lie="Zürcherstrasse 27", st="2. OG", ex="R. Baumgartner",
         bw="Moren", ort="8400 Winterthur", zi=3.5, eig="Immo Nordwest AG",
         kue=-198, haft=-140, verm=-98, neu="Familie Zbinden", zu=-63,
         erl={k: -150 + 5*i for i, k in enumerate(
             ["Kündigung bestätigt / G-Rem","Meldung Werke / EGT","Vorbesichtigung","VMZ aktualisiert",
              "Inserat online","Wohnungsabnahme durchgeführt","Handwerker aufgeboten","Zustimmungserklärung",
              "Instandstellungen beauftragt","Vertrag versendet","Vertrag retour","Info Werke / EGT",
              "Schlüsselübergabe erfolgt","Reinigung veranlasst","Namensschilder","Kaution / G-Rem mutiert",
              "Instandstellungs-RG","Schlussabrechnung","Zahlungseingang"])}),
    dict(fn="BSP-006", obj="0620.04.014", lie="Im Sydefädeli 14", st="4. OG", ex="T. Widmer",
         bw="Ryser", ort="8037 Zürich", zi=4.5, eig="Stiftung Wohnwerk",
         kue=-104, haft=-74,
         erl={"Kündigung bestätigt / G-Rem":-102,"Meldung Werke / EGT":-101,"Vorbesichtigung":-98,
              "VMZ aktualisiert":-95,"Inserat online":-90,"Wohnungsabnahme durchgeführt":-73,
              "Handwerker aufgeboten":-72,"Zustimmungserklärung":-73,"Instandstellungen beauftragt":-70},
         notiz="4,5 Zimmer – bisher nur zwei Besichtigungen. Mietzins prüfen."),
    dict(fn="BSP-007", obj="0903.03.009", lie="Rebbergstrasse 4", st="3. OG", ex="K. Bühlmann",
         bw="Fazliu", ort="8610 Uster", zi=3.5, eig="Erbengemeinschaft Vogt",
         kue=-95, haft=-40,
         erl={"Kündigung bestätigt / G-Rem":-93,"Meldung Werke / EGT":-92,"VMZ aktualisiert":-88,
              "Inserat online":-84},
         notiz="Kein Abnahmetermin vereinbart – Sollfrist längst überschritten."),
    dict(fn="BSP-008", obj="0112.03.004", lie="Seestrasse 118", st="3. OG", ex="Familie Brunner",
         bw="Sivanesan", ort="8002 Zürich", zi=3.5, eig="PK Helvetia Immobilien",
         kue=-26, haft=-24, erl={"Kündigung bestätigt / G-Rem":-2},
         notiz="Beispiel für eine Doppelerfassung – gleiche Obj.-Nr. wie BSP-001."),
    dict(fn="BSP-009", obj="0620.01.003", lie="Im Sydefädeli 14", st="1. OG", ex="A. Vetter",
         bw="Loa", ort="8037 Zürich", zi=2.5, eig="Stiftung Wohnwerk",
         kue=-27, haft=-35,
         erl={"Kündigung bestätigt / G-Rem":-25,"Meldung Werke / EGT":-24,"Vorbesichtigung":"n.e.",
              "VMZ aktualisiert":-21},
         notiz="Beispiel für einen Datumsfehler: Haftungsdatum liegt vor der Kündigung."),
    dict(fn="BSP-010", obj="0348.00.001", lie="Birmensdorferstrasse 340", st="EG", ex="N. Aebi",
         bw="Scherb", ort="8055 Zürich", zi=1.5, eig="Erbengemeinschaft Vogt",
         kue=-5, haft=12,
         erl={"Kündigung bestätigt / G-Rem":-4,"Meldung Werke / EGT":-3,"Vorbesichtigung":"n.e."},
         notiz="Objekt noch bewohnt, Haftung läuft noch 12 Tage. Trotzdem rot: der "
               "Abnahmetermin hätte längst vereinbart sein müssen."),
]

# Die Beispiele stehen bewusst auf einem eigenen Blatt.
# Stünden sie im Arbeitsblatt, müsste sie jede Nutzerin zuerst löschen – und
# genau das verhindert der Blattschutz, weil in diesen Zeilen auch gesperrte
# Formelzellen liegen. So ist «Leerstände» vom ersten Moment an einsatzbereit.
wbsp = wb.create_sheet("Beispiele")
wbsp["A1"] = "Beispiele – zehn typische Fälle"
wbsp["A1"].font = schrift(15, True, PETROL)
wbsp["A2"] = ("Nur zum Nachschlagen. Dieses Blatt rechnet gleich wie «Leerstände», wirkt sich aber "
              "auf keine Kennzahl aus. Hier darf gefahrlos ausprobiert werden.")
wbsp["A2"].font = schrift(9, farbe="5A6B76")
wbsp["A3"] = ("Jede Zeile zeigt eine andere Lage – auch fehlerhafte Erfassungen, damit sichtbar wird, "
              "was die Spalte «Prüfhinweis» meldet. Die Notiz rechts aussen erklärt den Fall.")
wbsp["A3"].font = schrift(9, True, "8A5A0B")
for i, (name, breite, art, fmt) in enumerate(SPALTEN):
    sp = get_column_letter(i + 1)
    wbsp.column_dimensions[sp].width = breite
    c = wbsp.cell(KOPF_ZEILE, i + 1, name)
    c.font = schrift(9, True, "FFFFFF")
    c.fill = PatternFill("solid", fgColor=PETROL if art != "f" else "3D8B9D")
    c.alignment = Alignment(wrap_text=True, vertical="center")
    c.border = rahmen
wbsp.row_dimensions[KOPF_ZEILE].height = 42
for r in range(ERSTE, ERSTE + len(BEISPIELE)):
    for i, (name, breite, art, fmt) in enumerate(SPALTEN):
        c = wbsp.cell(r, i + 1)
        c.font = schrift(10, farbe="3F4A52")
        c.number_format = fmt
        c.border = rahmen
        c.alignment = Alignment(vertical="center")
        if art == "f":
            c.value = FORMELN[name](r)
            c.fill = PatternFill("solid", fgColor=GRAU)
wbsp.freeze_panes = "D5"
wbsp.conditional_formatting.add(
    "A{}:{}{}".format(ERSTE, LETZTE_SP, ERSTE + len(BEISPIELE) - 1),
    FormulaRule(formula=['${c}{r}="überfällig"'.format(c=s("Status"), r=ERSTE)],
                fill=PatternFill("solid", fgColor=ROT_F), stopIfTrue=False))
wbsp.conditional_formatting.add(
    "A{}:{}{}".format(ERSTE, LETZTE_SP, ERSTE + len(BEISPIELE) - 1),
    FormulaRule(formula=['${c}{r}="abgeschlossen"'.format(c=s("Status"), r=ERSTE)],
                fill=PatternFill("solid", fgColor=GRUEN_F), stopIfTrue=False))
wbsp.protection.sheet = True

def setz(r, spalte, wert):
    wbsp.cell(r, SP_INDEX[spalte], wert)

SP_INDEX = {name: i + 1 for i, (name, *_) in enumerate(SPALTEN)}

for i, b in enumerate(BEISPIELE):
    r = ERSTE + i
    paare = [("Fall-Nr.", b["fn"]), ("Obj.-Nr.", b["obj"]), ("Liegenschaft", b["lie"]),
             ("Stock", b["st"]), ("ex-Mieter", b["ex"]), ("Bewirtschafter", b["bw"]),
             ("Ort", b["ort"]), ("Anz. Zimmer", b["zi"]), ("Eigentümer", b["eig"]),
             ("gekündigt per", t(b["kue"]) if "kue" in b else None),
             ("Haftungsdatum", t(b["haft"]) if "haft" in b else None),
             ("Vermietet per", t(b["verm"]) if "verm" in b else None),
             ("neuer Mieter", b.get("neu")),
             ("WA-Termin", t(b["wa"]) if "wa" in b else None),
             ("Schlüsselübergabe-Termin", t(b["sch"]) if "sch" in b else None),
             ("Fall abgeschlossen", t(b["zu"]) if "zu" in b else None),
             ("Notiz", b.get("notiz")),
             ("Dossier", "https://schaeppi.sharepoint.com/objekte/" + b["obj"].replace(".", "-"))]
    for spalte, wert in paare:
        if wert is not None:
            setz(r, spalte, wert)
    for spalte, versatz in b.get("erl", {}).items():
        setz(r, spalte, versatz if isinstance(versatz, str) else t(versatz))
print("Blatt «Beispiele» aufgebaut:", len(BEISPIELE), "Zeilen")

# ---------------------------------------------------------------- Kennzahlen
wk = wb.create_sheet("Kennzahlen")
L = "Leerstände!"
def bez(spalte):
    c = s(spalte)
    return "{L}${c}${a}:${c}${b}".format(L=L, c=c, a=ERSTE, b=LETZTE)

wk["A1"] = "Kennzahlen"; wk["A1"].font = schrift(15, True, PETROL)
wk["A2"] = ("Automatisch berechnet aus dem Blatt «Leerstände». Nicht bearbeiten.   |   "
            "«Ø Leerstandstage» zählt nur Fälle mit gesetztem «Vermietet per», "
            "also solche, bei denen der Leerstand tatsächlich zu Ende ist.")
wk["A2"].font = schrift(9, farbe="5A6B76")
wk["A3"] = "Stand"; wk["A3"].font = schrift(9, True)
wk["B3"] = "=TODAY()"; wk["B3"].number_format = "DD.MM.YYYY"; wk["B3"].font = schrift(9)

kopf = ["Bewirtschafter", "Team", "Fälle gesamt", "offen", "überfällig",
        "zurückgestellt", "abgeschlossen", "Ø Leerstandstage (beendete Fälle)"]
for i, h in enumerate(kopf):
    c = wk.cell(5, i + 1, h)
    c.font = schrift(9, True, "FFFFFF"); c.fill = PatternFill("solid", fgColor=PETROL)
    c.alignment = Alignment(wrap_text=True, horizontal="center"); c.border = rahmen
wk.row_dimensions[5].height = 30

# Kriterien bewusst nur als exakter Textvergleich oder als Datumsschwelle
# (">"&DATE(1900,1,1)).  Die Kurzformen "<>" und "?*" zählen je nach
# Excel-Fassung auch leere Zellen mit und sind darum hier nirgends verwendet.
# «Fälle gesamt» wird als Summe der vier Status gebildet: jeder erfasste Fall
# hat genau einen Status, damit stimmt die Zeile immer in sich.
LEER_SCHWELLE = '">"&DATE(1900,1,1)'

def zeile_kennzahl(r, kriterium_spalte, kriterium):
    """kriterium_spalte: Bezug auf Bewirtschafter- oder Team-Spalte der Liste."""
    return [
        '=SUM(D{r}:G{r})'.format(r=r),
        '=COUNTIFS({k},{kr},{st},"offen")'.format(k=kriterium_spalte, kr=kriterium, st=bez("Status")),
        '=COUNTIFS({k},{kr},{st},"überfällig")'.format(k=kriterium_spalte, kr=kriterium, st=bez("Status")),
        '=COUNTIFS({k},{kr},{st},"zurückgestellt")'.format(k=kriterium_spalte, kr=kriterium, st=bez("Status")),
        '=COUNTIFS({k},{kr},{st},"abgeschlossen")'.format(k=kriterium_spalte, kr=kriterium, st=bez("Status")),
        '=IFERROR(ROUND(AVERAGEIFS({lt},{k},{kr},{ve},{sw}),0),"–")'.format(
            lt=bez("Leerstandstage"), k=kriterium_spalte, kr=kriterium,
            ve=bez("Vermietet per"), sw=LEER_SCHWELLE),
    ]

r = 6
for i in range(len(BEWIRTSCHAFTER)):
    wk.cell(r, 1, "=Stammdaten!$A${}".format(5 + i)).font = schrift(10)
    wk.cell(r, 2, "=Stammdaten!$B${}".format(5 + i)).font = schrift(10)
    for j, f in enumerate(zeile_kennzahl(r, bez("Bewirtschafter"), "$A{}".format(r))):
        c = wk.cell(r, 3 + j, f); c.font = schrift(10)
        c.alignment = Alignment(horizontal="center"); c.number_format = "0"
    for j in range(8):
        wk.cell(r, j + 1).border = rahmen
    r += 1

r += 1
for team in ["BS 01", "BS 02"]:
    wk.cell(r, 1, "Total " + team).font = schrift(10, True)
    for j, f in enumerate(zeile_kennzahl(r, bez("Team"), '"{}"'.format(team))):
        c = wk.cell(r, 3 + j, f); c.font = schrift(10, True)
        c.alignment = Alignment(horizontal="center"); c.number_format = "0"
    for j in range(8):
        wk.cell(r, j + 1).border = rahmen
        wk.cell(r, j + 1).fill = PatternFill("solid", fgColor=HELL)
    r += 1

wk.cell(r, 1, "Gesamt").font = schrift(11, True, PETROL)
gesamt = [
    '=SUM(D{r}:G{r})'.format(r=r),
    '=COUNTIF({st},"offen")'.format(st=bez("Status")),
    '=COUNTIF({st},"überfällig")'.format(st=bez("Status")),
    '=COUNTIF({st},"zurückgestellt")'.format(st=bez("Status")),
    '=COUNTIF({st},"abgeschlossen")'.format(st=bez("Status")),
    '=IFERROR(ROUND(AVERAGEIFS({lt},{ve},{sw}),0),"–")'.format(
        lt=bez("Leerstandstage"), ve=bez("Vermietet per"), sw=LEER_SCHWELLE),
]
for j, f in enumerate(gesamt):
    c = wk.cell(r, 3 + j, f); c.font = schrift(11, True, PETROL)
    c.alignment = Alignment(horizontal="center"); c.number_format = "0"
for j in range(8):
    wk.cell(r, j + 1).border = rahmen
ZEILE_GESAMT = r

r += 3
wk.cell(r, 1, "Offene Fälle nach Arbeitsbereich").font = schrift(11, True, PETROL)
r += 1
for bereich_name in ["Kündigung & Abnahme", "Wiedervermietung", "Schlussabrechnung"]:
    wk.cell(r, 1, bereich_name).font = schrift(10)
    # Ein abgeschlossener Fall trägt im Arbeitsbereich stets «abgeschlossen»,
    # darum genügt hier der exakte Vergleich ohne zweites Kriterium.
    c = wk.cell(r, 3, '=COUNTIF({ab},"{n}")'.format(
        ab=bez("Arbeitsbereich"), n=bereich_name))
    c.font = schrift(10); c.alignment = Alignment(horizontal="center")
    for j in (0, 1, 2):
        wk.cell(r, j + 1).border = rahmen
    r += 1

r += 2
wk.cell(r, 1, "Prüfhinweise – wie oft kommt was vor").font = schrift(11, True, PETROL)
r += 1
PRUEFUNGEN = [
    "Haftungsdatum vor Kündigung", "Vermietung vor Leerstandsbeginn", "WA-Termin vor Kündigung",
    "Zweiter offener Fall zum selben Objekt", "Fall-Nr. doppelt vergeben", "ex-Mieter fehlt",
    "Haftungsdatum fehlt", "Bewirtschafter fehlt",
    "Abgeschlossen trotz offener Schlussabrechnung", "Langläufer über 60 Tage",
]
for txt in PRUEFUNGEN:
    wk.cell(r, 1, txt).font = schrift(10)
    c = wk.cell(r, 3, '=COUNTIF({ph},"*{t}*")'.format(ph=bez("Prüfhinweis"), t=txt))
    c.font = schrift(10); c.alignment = Alignment(horizontal="center")
    for j in (0, 1, 2):
        wk.cell(r, j + 1).border = rahmen
    r += 1
wk.cell(r + 1, 1, "Fälle mit mindestens einem Hinweis").font = schrift(10, True)
# Jeder Hinweistext endet auf einen Punkt – «*.*» trifft damit genau die
# Zeilen mit mindestens einem Hinweis und zählt keine leeren Zellen mit.
c = wk.cell(r + 1, 3, '=COUNTIF({ph},"*.*")'.format(ph=bez("Prüfhinweis")))
c.font = schrift(10, True); c.alignment = Alignment(horizontal="center")

wk.column_dimensions["A"].width = 42
wk.column_dimensions["B"].width = 10
for col in "CDEFGH":
    wk.column_dimensions[col].width = 13
wk.protection.sheet = True
print("Blatt «Kennzahlen» aufgebaut")

# ---------------------------------------------------------------- Prozessschritte
wp = wb.create_sheet("Prozessschritte")
wp["A1"] = "Prozessschritte"; wp["A1"].font = schrift(15, True, PETROL)
wp["A2"] = ("Nachschlagewerk: wo jeder Schritt auszuführen ist und welcher Spalte der bisherigen "
            "Liste er entspricht. Ein Haken hier bedeutet nie, dass in dieser Datei etwas gebucht wurde.")
wp["A2"].font = schrift(9, farbe="5A6B76")
kopf_p = ["Nr.", "Schritt", "Spalte in dieser Datei", "Arbeitsbereich", "System", "Frist"]
for i, h in enumerate(kopf_p):
    c = wp.cell(4, i + 1, h); c.font = schrift(9, True, "FFFFFF")
    c.fill = PatternFill("solid", fgColor=PETROL); c.border = rahmen
    c.alignment = Alignment(wrap_text=True)

SCHRITT_INFO = [
    ("Kündigung bestätigt / G-Rem", "Kündigung & Abnahme", "Garaio REM", "nach Eingang der Kündigung"),
    ("Meldung Werke / EGT",         "Kündigung & Abnahme", "extern",     "nach Eingang der Kündigung"),
    ("Vorbesichtigung",             "Kündigung & Abnahme", "vor Ort",    "Entscheid – «n.e.», wenn nicht nötig"),
    ("VMZ aktualisiert",            "Kündigung & Abnahme", "VMZ",        "sobald der Bezugstermin feststeht"),
    ("Inserat online",              "Kündigung & Abnahme", "VMZ",        "so früh wie möglich"),
    ("Wohnungsabnahme durchgeführt","Kündigung & Abnahme", "vor Ort",    "Termin: 30 Tage vor Wohnungsabgabe vereinbaren"),
    ("Handwerker aufgeboten",       "Kündigung & Abnahme", "extern",     "3 Tage nach der Abnahme"),
    ("Zustimmungserklärung",        "Kündigung & Abnahme", "Dossier",    "nach der Abnahme"),
    ("Instandstellungen beauftragt","Kündigung & Abnahme", "extern",     "nach Vorliegen der Offerten"),
    ("Vertrag versendet",           "Wiedervermietung",    "Garaio REM", "nach Erfassung des Nachmieters"),
    ("Vertrag retour",              "Wiedervermietung",    "Dossier",    "Frist im Einzelfall setzen"),
    ("Info Werke / EGT",            "Wiedervermietung",    "extern",     "nach Vertragsabschluss"),
    ("Schlüsselübergabe erfolgt",   "Wiedervermietung",    "vor Ort",    "Termin im Einzelfall setzen"),
    ("Reinigung veranlasst",        "Wiedervermietung",    "extern",     "vor der Übergabe"),
    ("Namensschilder",              "Wiedervermietung",    "extern",     "vor der Übergabe"),
    ("Kaution / G-Rem mutiert",     "Wiedervermietung",    "Garaio REM", "vor der Schlüsselübergabe"),
    ("Instandstellungs-RG",         "Schlussabrechnung",   "Garaio REM", "nach Rechnungseingang"),
    ("Schlussabrechnung",           "Schlussabrechnung",   "Garaio REM", "nach Zuordnung der Rechnungen"),
    ("Zahlungseingang",             "Schlussabrechnung",   "Garaio REM", "nach Versand der Abrechnung"),
]
for i, (name, bereich_n, system, frist) in enumerate(SCHRITT_INFO):
    r = 5 + i
    for j, wert in enumerate([i + 1, name, s(name), bereich_n, system, frist]):
        c = wp.cell(r, j + 1, wert); c.font = schrift(10); c.border = rahmen
        c.alignment = Alignment(wrap_text=(j in (1, 5)), vertical="center")
for br, wd in zip("ABCDEF", [6, 34, 16, 22, 14, 44]):
    wp.column_dimensions[br].width = wd
wp.protection.sheet = True

# ---------------------------------------------------------------- Anleitung
wa = wb.create_sheet("Anleitung", 0)
wa["A1"] = "Leerstandsliste – Kurzanleitung"; wa["A1"].font = schrift(16, True, PETROL)
TEXTE = [
    ("", ""),
    ("Wozu diese Datei da ist", "titel"),
    ("Sie stellt sicher, dass keine Kündigung, keine Abnahme und keine Schlussabrechnung vergessen geht.", ""),
    ("Mieter-, Objekt- und Eigentümerdaten bleiben in Garaio REM, Dokumente im Dossier, Inserate in der VMZ.", ""),
    ("Ein Eintrag hier hält nur fest, dass der Schritt im zuständigen System erledigt wurde.", ""),
    ("", ""),
    ("Die Blätter", "titel"),
    ("Leerstände – hier wird gearbeitet. Eine Zeile je Mieterwechsel. Beim Start leer.", ""),
    ("Beispiele – zehn ausgefüllte Fälle zum Nachschlagen. Ändert keine Kennzahl.", ""),
    ("Kennzahlen – rechnet sich selbst aus den Leerständen. Nur lesen.", ""),
    ("Prozessschritte – Nachschlagewerk: wo ein Schritt auszuführen ist.", ""),
    ("Stammdaten – Bewirtschafter und Teams. Hier neue Personen erfassen.", ""),
    ("", ""),
    ("So wird ein Schritt erfasst", "titel"),
    ("Erledigt  →  Erledigungsdatum in die Spalte des Schritts eintragen.", ""),
    ("Entfällt  →  «n.e.» eintragen. Damit ist festgehalten, dass der Schritt bewusst übersprungen wurde.", ""),
    ("Offen     →  Zelle leer lassen.", ""),
    ("Etwas anderes als ein Datum oder «n.e.» lässt Excel nicht zu.", ""),
    ("", ""),
    ("Was die Datei selbst rechnet", "titel"),
    ("Leerstandsbeginn = Haftungsdatum + 1 Tag. Das Haftungsdatum ist der letzte Tag der Mieterhaftung.", ""),
    ("Leerstandstage = leere Kalendertage bis zum Tag vor der Neuvermietung, bei laufenden Fällen bis heute.", ""),
    ("Haftung bis 31.08. und Vermietung ab 01.09. ergeben 0 Leerstandstage.", ""),
    ("Sollfrist Abnahmetermin = Haftungsdatum − 30 Tage.", ""),
    ("Sollfrist Handwerker = Abnahmedatum + 3 Tage. Entsteht erst mit der durchgeführten Abnahme.", ""),
    ("Status, Phase, Arbeitsbereich, Nächster Schritt und Prüfhinweis ergeben sich aus den Eingaben.", ""),
    ("«Nächster Schritt» nennt zuerst die verstrichene Frist, sonst die nächste offene Handlung.", ""),
    ("«zurückgestellt bis» parkt einen Fall bis zu diesem Tag – er erscheint dann nicht als überfällig.", ""),
    ("", ""),
    ("Farben", "titel"),
    ("Rot = überfällig. Eine Frist ist verstrichen und der Schritt ist noch offen.", ""),
    ("Grün = abgeschlossen.   Grau = zurückgestellt.   Gelb in «Prüfhinweis» = bitte prüfen.", ""),
    ("", ""),
    ("Täglicher Ablauf", "titel"),
    ("1. Auf «Status» filtern: überfällig zuerst.", ""),
    ("2. Spalte «Nächster Schritt» sagt, was ansteht – bei roten Zeilen die überfällige Frist.", ""),
    ("3. Schritt im zuständigen System erledigen, danach hier das Datum eintragen.", ""),
    ("4. Spalte «Prüfhinweis» durchgehen – dort stehen Dateneingabefehler und Doppelerfassungen.", ""),
    ("", ""),
    ("Wichtig", "titel"),
    ("Graue Spalten enthalten Formeln und sind gesperrt. Sie dürfen nicht überschrieben werden.", ""),
    ("Das Blatt «Leerstände» ist leer und kann sofort verwendet werden. Es muss nichts gelöscht werden.", ""),
    ("Wer sehen will, wie ein ausgefüllter Fall aussieht: Blatt «Beispiele».", ""),
    ("Die Tabelle reicht bis Zeile 404. Wird mehr gebraucht: Blattschutz aufheben "
     "(Überprüfen → Blattschutz aufheben, kein Passwort), dann erweitert sich die Tabelle beim Tippen von selbst.", ""),
    ("Die Datei ist für die gemeinsame Bearbeitung auf SharePoint gedacht. Keine Makros, keine Verknüpfungen "
     "zu anderen Dateien – sie funktioniert auch in Excel im Browser.", ""),
    ("", ""),
    ("Erstellt am " + heute.strftime("%d.%m.%Y") + " · Fachliche Grundlage: Prozessbeschreibung Mieterwechsel", "klein"),
]
r = 3
for txt, art in TEXTE:
    c = wa.cell(r, 1, txt)
    if art == "titel":
        c.font = schrift(11, True, PETROL)
    elif art == "klein":
        c.font = schrift(9, farbe="85939C")
    else:
        c.font = schrift(10)
    r += 1
wa.column_dimensions["A"].width = 118
wa.sheet_view.showGridLines = False
wa.protection.sheet = True

# openpyxl legt keine zwischengespeicherten Ergebnisse ab. Ohne diese
# Anweisung zeigt Excel – vor allem im Browser – beim ersten Öffnen leere
# Formelspalten, bis irgendwo etwas eingetippt wird.
wb.calculation.fullCalcOnLoad = True
wb.calculation.calcMode = "auto"

wb.save(DATEI)
print("gespeichert:", DATEI, "· Neuberechnung beim Öffnen aktiviert")
