# -*- coding: utf-8 -*-
"""Erzeugt die generische Verkaufs-Vorlage 'Leerstandsliste & Fristenplan'.

Eigenständiges Produkt fuer den Verkauf an kleine Verwaltungen (nicht die
interne, firmenspezifische Leerstandsliste aus excel/build.py). Bewusst
schlank gehalten: eine Tabelle, ein Fristenrechner, eine Kurzanleitung -
alles ohne Makros, ohne externe Abhaengigkeiten, in Excel und Google
Sheets funktionsfaehig.
"""
import openpyxl
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule, CellIsRule
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

DATEI = "Leerstandsliste-und-Fristenplan-Vorlage.xlsx"

TINTE = "1A1A1A"
PETROL = "0F5C6E"
HELL = "EDF1F2"
GRAU = "F2F5F6"
ROT_F = "FBE4E2"
GRUEN_F = "E4F0E8"
GELB_F = "FBF0D9"
RAND = "C6D0D5"

def schrift(groesse=10, fett=False, farbe=TINTE):
    return Font(name="Arial", size=groesse, bold=fett, color=farbe)

duenn = Side(style="thin", color=RAND)
rahmen = Border(left=duenn, right=duenn, top=duenn, bottom=duenn)

wb = openpyxl.Workbook()

# ------------------------------------------------------------- Kurzanleitung
ws0 = wb.active
ws0.title = "Kurzanleitung"
ws0.sheet_view.showGridLines = False
ws0.column_dimensions["A"].width = 100
zeilen = [
    ("Leerstandsliste & Fristenplan - Kurzanleitung", 16, True),
    ("", 10, False),
    ("1. Tabellenblatt 'Leerstandsliste'", 12, True),
    ("Eine Zeile pro Wohnung/Objekt im Kuendigungs- oder Leerstandsprozess.", 10, False),
    ("Weisse Spalten von Hand eintragen, graue Spalten rechnen automatisch.", 10, False),
    ("Die Ampel-Spalte 'Status' zeigt rot/gelb/gruen je nach Leerstandsdauer.", 10, False),
    ("", 10, False),
    ("2. Tabellenblatt 'Fristenrechner'", 12, True),
    ("Kuendigungseingang und Kuendigungsfrist eintragen -> die Vorlage", 10, False),
    ("berechnet Kuendigungstermin, letzten Rueckgabetermin und den", 10, False),
    ("empfohlenen Start der Vermarktung (Standard: 8 Wochen vorher).", 10, False),
    ("Die 8 Wochen in Zelle B9 sind ein Erfahrungswert - anpassbar.", 10, False),
    ("", 10, False),
    ("3. Wichtig", 12, True),
    ("Diese Vorlage ersetzt keine Rechtsberatung. Fristen und Kuendigungs-", 10, False),
    ("termine gemaess Mietvertrag und OR pruefen, insbesondere bei", 10, False),
    ("ausserordentlichen Kuendigungen, Befristungen oder Staffelmieten.", 10, False),
    ("", 10, False),
    ("Fragen? kontakt@bewirtschaftungskit.ch", 10, False),
]
r = 1
for text, groesse, fett in zeilen:
    c = ws0.cell(row=r, column=1, value=text)
    c.font = schrift(groesse, fett, PETROL if fett else TINTE)
    r += 1

# ------------------------------------------------------------- Leerstandsliste
ws = wb.create_sheet("Leerstandsliste")
ws.sheet_view.showGridLines = False

SPALTEN = [
    ("Fall-Nr.", 10, "e", "@"),
    ("Liegenschaft", 22, "e", "@"),
    ("Wohnung/Objekt", 16, "e", "@"),
    ("bisheriger Mieter", 20, "e", "@"),
    ("gekuendigt per", 14, "e", "DD.MM.YYYY"),
    ("Rueckgabetermin", 14, "e", "DD.MM.YYYY"),
    ("Vermarktung gestartet am", 16, "e", "DD.MM.YYYY"),
    ("Neuvermietung ab", 14, "e", "DD.MM.YYYY"),
    ("Nettomiete/Monat", 14, "e", "#,##0"),
    ("Leerstandstage", 12, "f", "0"),
    ("Leerstandskosten", 14, "f", "#,##0"),
    ("Status", 12, "f", "@"),
    ("Verantwortlich", 16, "e", "@"),
    ("Bemerkung", 30, "e", "@"),
]
KOPF = 1
ERSTE = 2
ANZ = 60
LETZTE = ERSTE + ANZ - 1

for i, (titel, breite, art, fmt) in enumerate(SPALTEN, start=1):
    col = get_column_letter(i)
    ws.column_dimensions[col].width = breite
    c = ws.cell(row=KOPF, column=i, value=titel)
    c.font = schrift(10, True, "FFFFFF")
    c.fill = PatternFill("solid", fgColor=PETROL)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = rahmen

def sp(name):
    for i, (titel, *_r) in enumerate(SPALTEN, start=1):
        if titel == name:
            return get_column_letter(i)
    raise KeyError(name)

for row in range(ERSTE, LETZTE + 1):
    for i, (titel, breite, art, fmt) in enumerate(SPALTEN, start=1):
        col = get_column_letter(i)
        cell = ws.cell(row=row, column=i)
        cell.number_format = fmt
        cell.border = rahmen
        cell.font = schrift(10, False, TINTE if art == "e" else "3A3A3A")
        if art == "f":
            cell.fill = PatternFill("solid", fgColor=GRAU)

    r = row
    rueckgabe = f"{sp('Rueckgabetermin')}{r}"
    neuvermietung = f"{sp('Neuvermietung ab')}{r}"
    miete = f"{sp('Nettomiete/Monat')}{r}"
    tage_col = sp("Leerstandstage")
    kosten_col = sp("Leerstandskosten")
    status_col = sp("Status")

    ws[f"{tage_col}{r}"] = (
        f'=IF({rueckgabe}="","",IF({neuvermietung}="",TODAY()-{rueckgabe},{neuvermietung}-{rueckgabe}))'
    )
    ws[f"{kosten_col}{r}"] = (
        f'=IF(OR({tage_col}{r}="",{miete}=""),"",{tage_col}{r}/30*{miete})'
    )
    ws[f"{status_col}{r}"] = (
        f'=IF({rueckgabe}="","",IF({neuvermietung}<>"","vermietet",'
        f'IF({tage_col}{r}<=30,"in Frist","ueberfaellig")))'
    )

# Bedingte Formatierung Status
ws.conditional_formatting.add(
    f"{status_col}{ERSTE}:{status_col}{LETZTE}",
    FormulaRule(formula=[f'{status_col}{ERSTE}="ueberfaellig"'], fill=PatternFill("solid", fgColor=ROT_F)),
)
ws.conditional_formatting.add(
    f"{status_col}{ERSTE}:{status_col}{LETZTE}",
    FormulaRule(formula=[f'{status_col}{ERSTE}="in Frist"'], fill=PatternFill("solid", fgColor=GELB_F)),
)
ws.conditional_formatting.add(
    f"{status_col}{ERSTE}:{status_col}{LETZTE}",
    FormulaRule(formula=[f'{status_col}{ERSTE}="vermietet"'], fill=PatternFill("solid", fgColor=GRUEN_F)),
)

tabelle = Table(displayName="Leerstandsliste", ref=f"A{KOPF}:{get_column_letter(len(SPALTEN))}{LETZTE}")
tabelle.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
ws.add_table(tabelle)
ws.freeze_panes = "A2"

# ------------------------------------------------------------- Fristenrechner
ws2 = wb.create_sheet("Fristenrechner")
ws2.sheet_view.showGridLines = False
ws2.column_dimensions["A"].width = 34
ws2.column_dimensions["B"].width = 18
ws2.column_dimensions["C"].width = 46

titel = ws2.cell(row=1, column=1, value="Fristenrechner Mieterwechsel")
titel.font = schrift(14, True, PETROL)

felder = [
    ("Kuendigungseingang", "2026-01-15", "Datum, an dem die Kuendigung eingetroffen ist"),
    ("Kuendigungsfrist (Monate)", 3, "gemaess Mietvertrag, Standard oft 3 Monate"),
    ("naechster Kuendigungstermin (Tag im Monat)", 1, "1 = Monatsende, sonst gem. Vertrag"),
    ("Vorlaufzeit Vermarktung (Wochen)", 8, "Erfahrungswert, anpassbar"),
]
row = 3
for label, wert, hinweis in felder:
    ws2.cell(row=row, column=1, value=label).font = schrift(10, True)
    c = ws2.cell(row=row, column=2, value=wert)
    c.font = schrift(10, False, PETROL)
    c.fill = PatternFill("solid", fgColor=HELL)
    c.border = rahmen
    if row == 3:
        c.number_format = "DD.MM.YYYY"
    ws2.cell(row=row, column=3, value=hinweis).font = schrift(9, False, "6B6B6B")
    row += 1

ws2.cell(row=8, column=1, value="Berechnung").font = schrift(12, True, PETROL)
row = 9
for label, formel in [
    ("fruehestmoeglicher Kuendigungstermin", '=EDATE(B3,B4)'),
    ("Rueckgabetermin (=Kuendigungstermin)", '=B9'),
    ("empfohlener Start Vermarktung", '=B10-(B6*7)'),
]:
    ws2.cell(row=row, column=1, value=label).font = schrift(10, True)
    c = ws2.cell(row=row, column=2, value=formel)
    c.number_format = "DD.MM.YYYY"
    c.font = schrift(10, False, TINTE)
    c.fill = PatternFill("solid", fgColor=GRUEN_F)
    c.border = rahmen
    row += 1

hinweis = ws2.cell(
    row=14, column=1,
    value=("Achtung: nur eine Orientierungshilfe. Gesetzliche und vertragliche "
           "Kuendigungstermine (z.B. quartalsweise, ortsueblich) im Einzelfall pruefen."),
)
hinweis.font = schrift(9, False, "8A1F11")
ws2.merge_cells("A14:C14")

wb.save(DATEI)
print("gespeichert:", DATEI)
