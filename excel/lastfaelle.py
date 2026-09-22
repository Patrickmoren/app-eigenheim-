# -*- coding: utf-8 -*-
"""Erzeugt eine Prüfdatei, in der jede Verzweigung der Formeln mindestens
einmal wirklich auslöst: jeder Status, jeder Prüfhinweis, jede Randlage.

Die Beispielzeilen der Auslieferungsdatei decken nur den Normalfall ab.
Hier wird bewusst das Gegenteil erzwungen, damit sichtbar wird, ob eine
Prüfung überhaupt anspringt – und nicht nur, ob sie schweigt.
"""
import os, subprocess, sys
from datetime import date, timedelta
import openpyxl

ZIEL = os.environ.get("ZIEL_TEST", "test-lastfaelle.xlsx")
ERSTE, KOPF = 5, 4
# VERSATZ verschiebt alle Eingabedaten gemeinsam. Damit lässt sich prüfen,
# ob die Formeln auch in einigen Monaten noch richtig rechnen – TODAY() bleibt
# gleich, das Verschieben der Daten wirkt genauso.
VERSATZ = int(os.environ.get("VERSATZ", "0"))
heute = date.today()
def t(n): return heute + timedelta(days=n + VERSATZ)

umgebung = dict(os.environ, ZIEL=ZIEL, ZEILEN="40")
subprocess.run([sys.executable, "build.py"], env=umgebung, check=True,
               stdout=subprocess.DEVNULL)

wb = openpyxl.load_workbook(ZIEL)
ws = wb["Leerstände"]
SPALTEN = [ws.cell(KOPF, i).value for i in range(1, ws.max_column + 1)]
IDX = {n: i + 1 for i, n in enumerate(SPALTEN)}
SCHRITTE = [n for n in SPALTEN if n in {
    "Kündigung bestätigt / G-Rem", "Meldung Werke / EGT", "Vorbesichtigung",
    "VMZ aktualisiert", "Inserat online", "Wohnungsabnahme durchgeführt",
    "Handwerker aufgeboten", "Zustimmungserklärung", "Instandstellungen beauftragt",
    "Vertrag versendet", "Vertrag retour", "Info Werke / EGT",
    "Schlüsselübergabe erfolgt", "Reinigung veranlasst", "Namensschilder",
    "Kaution / G-Rem mutiert", "Instandstellungs-RG", "Schlussabrechnung", "Zahlungseingang"}]

# bestehende Beispielzeilen restlos entfernen
for r in range(ERSTE, ws.max_row + 1):
    for n in SPALTEN:
        c = ws.cell(r, IDX[n])
        if not str(c.value or "").startswith("="):
            c.value = None

ALLE_SCHRITTE = {k: -40 for k in SCHRITTE}

LAST = [
    ("zurückgestellt, Frist in der Zukunft",
     dict(obj="T01", ex="A", bw="Moren", kue=-60, haft=-30, zu_bis=5, wa=-10)),
    ("zurückgestellt, Frist genau heute",
     dict(obj="T02", ex="A", bw="Moren", kue=-60, haft=-30, zu_bis=0, wa=-10)),
    ("Frist gestern abgelaufen – wieder überfällig",
     dict(obj="T03", ex="A", bw="Moren", kue=-60, haft=-30, zu_bis=-1, wa=-10)),
    ("abgeschlossen schlägt zurückgestellt",
     dict(obj="T04", ex="A", bw="Moren", kue=-60, haft=-30, zu_bis=5, ab=-2,
          erl={"Zahlungseingang": -3})),
    ("überfällig über Sollfrist Handwerker",
     dict(obj="T05", ex="A", bw="Ryser", kue=-60, haft=-20, wa=-25,
          erl={"Wohnungsabnahme durchgeführt": -25})),
    ("überfällig über Schlüsselübergabe-Termin",
     dict(obj="T06", ex="A", bw="Ryser", kue=-60, haft=-30, wa=-40, sch=-3,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("überfällig über Vertrag retour bis",
     dict(obj="T07", ex="A", bw="Scherb", kue=-60, haft=-30, wa=-40, vbis=-4,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("überfällig über Sollfrist Abnahmetermin, kein WA-Termin",
     dict(obj="T08", ex="A", bw="Scherb", kue=-60, haft=-5)),
    ("Hinweis: Vermietung vor Leerstandsbeginn",
     dict(obj="T09", ex="A", bw="Ademi", kue=-90, haft=-30, verm=-45, neu="N")),
    ("Hinweis: WA-Termin vor Kündigung",
     dict(obj="T10", ex="A", bw="Ademi", kue=-30, haft=-10, wa=-50,
          erl={"Wohnungsabnahme durchgeführt": -50, "Handwerker aufgeboten": -47})),
    ("Hinweis: Fall-Nr. doppelt (1 von 2)",
     dict(fn="DOPPEL", obj="T11", ex="A", bw="Fazliu", kue=-60, haft=-30, wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("Hinweis: Fall-Nr. doppelt (2 von 2)",
     dict(fn="DOPPEL", obj="T12", ex="A", bw="Fazliu", kue=-60, haft=-30, wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("Hinweis: ex-Mieter fehlt",
     dict(obj="T13", bw="Loa", kue=-60, haft=-30, wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("Hinweis: Bewirtschafter fehlt, Team bleibt leer",
     dict(obj="T14", ex="A", kue=-60, haft=-30, wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("Hinweis: abgeschlossen trotz offener Schlussabrechnung",
     dict(obj="T15", ex="A", bw="Loa", kue=-60, haft=-30, ab=-1)),
    ("Hinweis: Langläufer über 60 Tage",
     dict(obj="T16", ex="A", bw="Brandenburger", kue=-120, haft=-80, wa=-90,
          erl={"Wohnungsabnahme durchgeführt": -90, "Handwerker aufgeboten": -88})),
    ("Grenzfall: genau 60 Leerstandstage, kein Hinweis",
     dict(obj="T17", ex="A", bw="Brandenburger", kue=-100, haft=-60, wa=-70,
          erl={"Wohnungsabnahme durchgeführt": -70, "Handwerker aufgeboten": -68})),
    ("vier Hinweise gleichzeitig",
     dict(fn="VIER", obj="T18", kue=-20, haft=-100, verm=-150, neu="N", wa=-30,
          erl={"Wohnungsabnahme durchgeführt": -30, "Handwerker aufgeboten": -28})),
    ("Leerstandstage genau 0: Vermietung am Tag nach Haftungsende",
     dict(obj="T19", ex="A", bw="Breitmeier", kue=-60, haft=-10, verm=-9, neu="N", wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("Vermietung noch vor Haftungsende – MAX fängt den negativen Wert ab",
     dict(obj="T20", ex="A", bw="Breitmeier", kue=-60, haft=-10, verm=-20, neu="N", wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("Haftungsdatum heute: 0 Leerstandstage",
     dict(obj="T21", ex="A", bw="Sivanesan", kue=-30, haft=0, wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("alle 19 Schritte «n.e.» – Prozess läuft trotzdem durch",
     dict(obj="T22", ex="A", bw="Sivanesan", kue=-60, haft=-30, verm=-10, neu="N",
          wa=-40, sch=-12, erl={k: "n.e." for k in SCHRITTE})),
    ("vollständig erledigt, aber nicht abgeschlossen",
     dict(obj="T23", ex="A", bw="Moren", kue=-60, haft=-30, verm=-10, neu="N",
          wa=-40, sch=-12, erl=ALLE_SCHRITTE)),
    ("abgeschlossen – nächster Schritt entfällt",
     dict(obj="T24", ex="A", bw="Moren", kue=-60, haft=-30, verm=-10, neu="N",
          wa=-40, sch=-12, ab=-1, erl=ALLE_SCHRITTE)),
    ("nur Obj.-Nr. erfasst",
     dict(obj="T25")),
    ("Bewirtschafter nicht in den Stammdaten",
     dict(obj="T26", ex="A", bw="Unbekannt AG", kue=-60, haft=-30, wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
    ("Jahreswechsel im Berichtsmonat",
     dict(obj="T27", ex="A", bw="Moren", kue=-30, haft=(date(heute.year, 12, 31) - heute).days - VERSATZ,
          wa=-5)),
    ("Vorlauftage negativ: Haftungsdatum vor Kündigung",
     dict(obj="T28", ex="A", bw="Moren", kue=-10, haft=-40, wa=-20,
          erl={"Wohnungsabnahme durchgeführt": -20, "Handwerker aufgeboten": -18})),
    ("Vermietung in der Zukunft, Fall läuft",
     dict(obj="T29", ex="A", bw="Ryser", kue=-60, haft=-20, verm=25, neu="N", wa=-30,
          erl={"Wohnungsabnahme durchgeführt": -30, "Handwerker aufgeboten": -28})),
    ("zweiter offener Fall zum selben Objekt (Paar zu T29)",
     dict(obj="T29", ex="B", bw="Ryser", kue=-10, haft=-2, wa=-20,
          erl={"Wohnungsabnahme durchgeführt": -20, "Handwerker aufgeboten": -18})),
    ("gleiche Obj.-Nr., aber abgeschlossen – löst keinen Hinweis aus",
     dict(obj="T30", ex="A", bw="Ryser", kue=-200, haft=-150, verm=-120, neu="N",
          ab=-100, erl=ALLE_SCHRITTE)),
    ("Vorgänger zu T30, jetzt allein offen",
     dict(obj="T30", ex="B", bw="Ryser", kue=-60, haft=-30, wa=-40,
          erl={"Wohnungsabnahme durchgeführt": -40, "Handwerker aufgeboten": -38})),
]

def setz(r, name, wert):
    ws.cell(r, IDX[name], wert)

for i, (titel, b) in enumerate(LAST):
    r = ERSTE + i
    setz(r, "Fall-Nr.", b.get("fn", "L{:02d}".format(i + 1)))
    setz(r, "Obj.-Nr.", b["obj"])
    setz(r, "Notiz", titel)
    for schluessel, spalte in [("ex", "ex-Mieter"), ("bw", "Bewirtschafter"),
                               ("neu", "neuer Mieter")]:
        if schluessel in b:
            setz(r, spalte, b[schluessel])
    for schluessel, spalte in [("kue", "gekündigt per"), ("haft", "Haftungsdatum"),
                               ("verm", "Vermietet per"), ("wa", "WA-Termin"),
                               ("sch", "Schlüsselübergabe-Termin"),
                               ("vbis", "Vertrag retour bis"),
                               ("zu_bis", "zurückgestellt bis"),
                               ("ab", "Fall abgeschlossen")]:
        if schluessel in b:
            setz(r, spalte, t(b[schluessel]))
    for spalte, versatz in b.get("erl", {}).items():
        setz(r, spalte, versatz if isinstance(versatz, str) else t(versatz))

wb.save(ZIEL)
print("Lastfälle geschrieben:", len(LAST), "Zeilen ·", ZIEL)
