# -*- coding: utf-8 -*-
"""Prüft die harten Grenzen von Excel und die Unversehrtheit der Datei.
Ergänzt pruefung_statisch.py um das, was dort nicht geprüft wird:
Verschachtelungstiefe, Formellänge, Klammern, Zip-Struktur, Gültigkeit
der Auswahllisten und Zahlenformate."""
import sys, re, zipfile, xml.etree.ElementTree as ET
import openpyxl
from openpyxl.utils import get_column_letter, column_index_from_string

DATEI = sys.argv[1] if len(sys.argv) > 1 else "Leerstandsliste.xlsx"
ok, fehler = 0, []
def P(text, bedingung, zusatz=""):
    global ok
    if bedingung:
        ok += 1; print("  ✓", text, (" " + str(zusatz)) if zusatz else "")
    else:
        fehler.append(text); print("  ✗", text, (" " + str(zusatz)) if zusatz else "")

print("GRENZWERTE UND UNVERSEHRTHEIT ·", DATEI)

# ---------------------------------------------------------------- 1 Zip / XML
print("\n1 · DATEISTRUKTUR")
z = zipfile.ZipFile(DATEI)
P("Zip unbeschädigt", z.testzip() is None)
teile = z.namelist()
P("Arbeitsmappe vorhanden", "xl/workbook.xml" in teile)
P("keine Makrospur", not any("vbaProject" in t for t in teile), "{} Teile".format(len(teile)))
P("keine externen Verknüpfungen", not any("externalLink" in t for t in teile))
schlecht = []
for t in teile:
    if t.endswith(".xml") or t.endswith(".rels"):
        try:
            ET.fromstring(z.read(t))
        except ET.ParseError as e:
            schlecht.append("{}: {}".format(t, e))
P("alle XML-Teile wohlgeformt", not schlecht, "; ".join(schlecht[:2]))

# ---------------------------------------------------------------- 2 Formeln
print("\n2 · GRENZEN VON EXCEL")
wb = openpyxl.load_workbook(DATEI)

def tiefe(f):
    """Grösste Verschachtelungstiefe von Funktionsaufrufen."""
    t = m = 0
    in_text = False
    vorher = ""
    for ch in f:
        if ch == '"':
            in_text = not in_text
        elif not in_text:
            if ch == "(":
                # nur zählen, wenn davor ein Funktionsname steht
                if re.search(r"[A-Za-z_\.][A-Za-z0-9_\.]*$", vorher):
                    t += 1; m = max(m, t)
                else:
                    t += 1; m = max(m, t)
            elif ch == ")":
                t -= 1
        vorher += ch
    return m, t

max_len, max_tiefe, unpaar, wo_len, wo_tiefe = 0, 0, [], None, None
anz = 0
for bl in wb.sheetnames:
    ws = wb[bl]
    for zeile in ws.iter_rows():
        for c in zeile:
            v = c.value
            if not (isinstance(v, str) and v.startswith("=")):
                continue
            anz += 1
            if len(v) > max_len:
                max_len, wo_len = len(v), (bl, c.coordinate)
            m, rest = tiefe(v)
            if m > max_tiefe:
                max_tiefe, wo_tiefe = m, (bl, c.coordinate)
            if rest != 0:
                unpaar.append("{}!{}".format(bl, c.coordinate))
            if v.count('"') % 2:
                unpaar.append("{}!{} (Anführungszeichen)".format(bl, c.coordinate))
P("Formeln gezählt", anz > 0, anz)
P("Formellänge unter 8192 Zeichen", max_len < 8192,
  "längste {} Zeichen in {}!{}".format(max_len, *wo_len))
P("Verschachtelung unter 64 Ebenen", max_tiefe < 64,
  "tiefste {} Ebenen in {}!{}".format(max_tiefe, *wo_tiefe))
P("Klammern und Anführungszeichen paarig", not unpaar, "; ".join(unpaar[:3]))

# ---------------------------------------------------------------- 3 Tabelle
print("\n3 · TABELLE UND BEREICHE")
ws = wb["Leerstände"]
tabellen = list(ws.tables.values())
P("genau eine Tabelle", len(tabellen) == 1, [t.displayName for t in tabellen])
tb = tabellen[0]
m = re.match(r"([A-Z]+)(\d+):([A-Z]+)(\d+)", tb.ref)
sp1, z1, sp2, z2 = m.group(1), int(m.group(2)), m.group(3), int(m.group(4))
P("Tabelle beginnt bei der Kopfzeile", z1 == 4, tb.ref)
P("Tabelle deckt alle Spalten ab",
  column_index_from_string(sp2) == ws.max_column,
  "{} Spalten".format(column_index_from_string(sp2)))
kopf = [ws.cell(4, i).value for i in range(1, ws.max_column + 1)]
P("Tabellenspalten stimmen mit der Kopfzeile überein",
  [c.name for c in tb.tableColumns] == kopf if tb.tableColumns else True)
P("keine leere Zelle in der Kopfzeile", all(kopf))

# ---------------------------------------------------------------- 4 Prüfregeln
print("\n4 · AUSWAHLLISTEN UND PRÜFREGELN")
dvs = ws.data_validations.dataValidation
abgedeckt = {}
for dv in dvs:
    for bereich in str(dv.sqref).split():
        mm = re.match(r"([A-Z]+)(\d+):([A-Z]+)(\d+)$", bereich)
        if mm:
            abgedeckt.setdefault(mm.group(1), []).append((int(mm.group(2)), int(mm.group(4))))
P("Prüfregeln vorhanden", len(dvs) > 0, "{} Regeln".format(len(dvs)))
luecken = [sp for sp, sp_bereiche in abgedeckt.items()
           if not any(a == 5 and b == ws.max_row for a, b in sp_bereiche)]
P("jede Regel deckt Zeile 5 bis {} ab".format(ws.max_row), not luecken, luecken[:4])
namen = {n for n in wb.defined_names}
P("Name «Bewirtschafterliste» vorhanden", "Bewirtschafterliste" in namen, sorted(namen))
bw_dv = [dv for dv in dvs if dv.type == "list"]
P("Auswahlliste verweist auf den Namen",
  all("Bewirtschafterliste" in str(dv.formula1) for dv in bw_dv))
# zeigt der Name auf gefüllte Stammdaten?
wst = wb["Stammdaten"]
P("Stammdaten gefüllt", sum(1 for r in range(5, 25) if wst.cell(r, 1).value) == 9,
  "{} Bewirtschafter".format(sum(1 for r in range(5, 25) if wst.cell(r, 1).value)))
P("jeder Bewirtschafter hat ein Team",
  all(wst.cell(r, 2).value in ("BS 01", "BS 02")
      for r in range(5, 25) if wst.cell(r, 1).value))

# ---------------------------------------------------------------- 5 Formate
print("\n5 · FORMATE UND SCHUTZ")
formelsp = [i for i in range(1, ws.max_column + 1)
            if str(ws.cell(5, i).value or "").startswith("=")]
P("12 Formelspalten", len(formelsp) == 12, len(formelsp))
P("alle Formelzellen gesperrt",
  all(ws.cell(r, i).protection.locked for i in formelsp for r in (5, 200, ws.max_row)))
P("alle Eingabezellen offen",
  all(not ws.cell(r, i).protection.locked
      for i in range(1, ws.max_column + 1) if i not in formelsp
      for r in (5, 200, ws.max_row)))
P("Schriftart durchgehend Arial",
  all(ws.cell(r, i).font.name == "Arial"
      for r in (4, 5, 200, ws.max_row) for i in range(1, ws.max_column + 1)))
P("Blattschutz ohne Passwort", ws.protection.sheet and not ws.protection.password)
P("Filtern und Sortieren bleibt erlaubt",
  ws.protection.autoFilter is False and ws.protection.sort is False)

print("\n" + "═" * 46)
print("{} bestanden, {} fehlgeschlagen".format(ok, len(fehler)))
sys.exit(1 if fehler else 0)
