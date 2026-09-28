# -*- coding: utf-8 -*-
"""
Excel-Sicherheits-Check: generischer Analyse-Motor.

Prüft eine BELIEBIGE .xlsx-Datei auf bekannte, wiederkehrende Risikomuster
(nicht auf eine bestimmte Struktur zugeschnitten). Jeder Fund ist eine
Finding mit Schweregrad, Fundort, Erklärung in Klartext und Empfehlung –
so wie ein Mensch es einem Geschäftsführer erklären würde, nicht wie ein
Debugger es einem Entwickler meldet.

Aufruf:
    python3 analyzer.py Kundendatei.xlsx
gibt eine Liste von Finding-Objekten zurück (siehe analysiere_datei()).
"""
from __future__ import annotations

import re
import sys
import zipfile
from dataclasses import dataclass, field
from datetime import datetime, date
from collections import defaultdict

import openpyxl
from openpyxl.utils import get_column_letter, column_index_from_string

SCHWEREGRAD_REIHENFOLGE = {"kritisch": 0, "hoch": 1, "mittel": 2, "hinweis": 3}

ZELLE_RE = re.compile(r"(?<![A-Za-z0-9_.!])(\$?)([A-Z]{1,3})(\$?)(\d{1,7})(?![\(\d])")
BLATTBEZUG_RE = re.compile(
    r"(?:'([^']+)'|([A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_]*))!\$?([A-Z]{1,3})\$?(\d+)"
)
BEREICH_RE = re.compile(
    r"(?:(?:'([^']+)'|([A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_]*))!)?"
    r"\$?([A-Z]{1,3})\$?(\d{1,7}):\$?([A-Z]{1,3})\$?(\d{1,7})"
)
VOLATILE_FUNKTIONEN = ("HEUTE(", "TODAY(", "JETZT(", "NOW(", "ZUFALLSZAHL(", "RAND(",
                       "RANDBETWEEN(", "ZUFALLSBEREICH(", "INDIREKT(", "INDIRECT(",
                       "VERSCHIEBUNG(", "OFFSET(")
FEHLERWERTE = ("#REF!", "#VALUE!", "#WERT!", "#DIV/0!", "#N/A", "#NV", "#NAME?",
               "#NAME!", "#NULL!", "#BEZUG!", "#ZAHL!", "#NUM!")
DATUM_MUSTER = re.compile(r"^\s*\d{1,2}[./]\d{1,2}[./]\d{2,4}\s*$")


@dataclass
class Finding:
    schweregrad: str          # kritisch | hoch | mittel | hinweis
    kategorie: str            # kurzer Kategoriename
    fundort: str              # z.B. "Blatt 'Masterfile', Spalte J"
    befund: str                # was technisch gefunden wurde
    risiko: str                 # was das für das Geschäft bedeutet
    empfehlung: str

    def sortkey(self):
        return (SCHWEREGRAD_REIHENFOLGE.get(self.schweregrad, 9), self.kategorie)


@dataclass
class Bericht:
    dateiname: str
    erstellt: datetime
    anzahl_blaetter: int
    anzahl_formeln: int
    findings: list = field(default_factory=list)

    def nach_schweregrad(self, grad):
        return [f for f in self.findings if f.schweregrad == grad]

    def sortiert(self):
        return sorted(self.findings, key=lambda f: f.sortkey())


def _letzte_zeile_mit_daten(ws, spalte_idx=None, start_zeile=1):
    letzte = start_zeile - 1
    if spalte_idx is not None:
        for r in range(start_zeile, ws.max_row + 1):
            if ws.cell(r, spalte_idx).value not in (None, ""):
                letzte = r
    else:
        for r in range(start_zeile, ws.max_row + 1):
            if any(c.value not in (None, "") for c in ws[r]):
                letzte = r
    return letzte


def _ist_formel(zelle):
    return isinstance(zelle.value, str) and zelle.value.startswith("=")


def _kopfzeile(blatt, max_scan=15):
    """Findet die Kopfzeile heuristisch: die erste Zeile, deren Zellen
    ausschliesslich Text sind (keine Formeln, keine Zahlen) und auf die
    eine Zeile mit mindestens einer Formel folgt. Verhindert, dass
    Titel-/Kennzahlzeilen oberhalb der eigentlichen Kopfzeile (z.B. eine
    Kapazitätsanzeige in Zeile 1) fälschlich als Datenzeile gewertet werden."""
    for r in range(1, min(max_scan, blatt.max_row) + 1):
        zeile = blatt[r]
        nichtleer = [c for c in zeile if c.value not in (None, "")]
        if not nichtleer:
            continue
        alle_text = all(isinstance(c.value, str) and not c.value.startswith("=") for c in nichtleer)
        if not alle_text:
            continue
        if r + 1 <= blatt.max_row and any(_ist_formel(c) for c in blatt[r + 1]):
            return r
    return 1


def _ist_randzeile_abweichung(abweich_zeilen, alle_zeilen):
    """True, wenn die abweichenden Zeilen genau einen zusammenhängenden
    Block am Anfang oder am Ende des Bereichs bilden (typisch für eine
    Summen-/Total-/Globalkennzahlen-Block, kein Fehler). Verstreute oder
    mittige Abweichungen gelten dagegen als Befund."""
    if not abweich_zeilen:
        return True
    n = len(abweich_zeilen)
    if n >= len(alle_zeilen):
        return False
    abweich_set = set(abweich_zeilen)
    return abweich_set == set(alle_zeilen[-n:]) or abweich_set == set(alle_zeilen[:n])


def _normalisiere_formel(formel, zeile_offset):
    """Ersetzt relative Zeilenbezüge durch einen Platzhalter, damit sich
    Formeln aus verschiedenen Zeilen derselben Spalte vergleichen lassen."""
    def ersetze(m):
        dollar_sp, sp, dollar_z, z = m.groups()
        if dollar_z == "$":
            return m.group(0)
        z_neu = int(z) - zeile_offset
        return f"{dollar_sp}{sp}{dollar_z}#{z_neu}"
    return ZELLE_RE.sub(ersetze, formel)


# ------------------------------------------------------------- Prüfungen

def pruefe_datenverlust_durch_feste_bereiche(wb):
    """Kernrisiko aus der Praxis: eine Formel bezieht sich fest auf z.B.
    Zeile 5 bis 150, das Datenblatt hat aber laengst mehr Zeilen. Neue
    Zeilen fallen dann lautlos aus jeder Auswertung heraus."""
    funde = []
    letzte_zeile_cache = {}
    for blatt in wb.worksheets:
        for zeile in blatt.iter_rows():
            for zelle in zeile:
                if not _ist_formel(zelle):
                    continue
                formel = zelle.value
                for m in BEREICH_RE.finditer(formel):
                    blattname = m.group(1) or m.group(2) or blatt.title
                    if blattname not in wb.sheetnames:
                        continue
                    z1, z2 = int(m.group(4)), int(m.group(6))
                    ziel = wb[blattname]
                    if z2 - z1 < 3:
                        continue  # Einzelzellbezug, kein "Bereich mit Reserve"
                    try:
                        sp_idx = column_index_from_string(m.group(3))
                    except Exception:
                        continue
                    key = (blattname, sp_idx)
                    if key not in letzte_zeile_cache:
                        letzte_zeile_cache[key] = _letzte_zeile_mit_daten(ziel, sp_idx)
                    tatsaechlich_letzte = letzte_zeile_cache[key]
                    if tatsaechlich_letzte > z2:
                        funde.append(Finding(
                            schweregrad="kritisch",
                            kategorie="Datenverlust durch festen Bereich",
                            fundort=f"Blatt „{blatt.title}“, Zelle {zelle.coordinate}",
                            befund=(f"Formel bezieht sich nur bis Zeile {z2} von „{blattname}“, "
                                    f"dort stehen aber bereits Daten bis Zeile {tatsaechlich_letzte}."),
                            risiko=("Neue Einträge ab Zeile " + str(z2 + 1) + " fliessen in keine "
                                    "Auswertung, Summe oder Konsolidierung ein – ohne jede "
                                    "Fehlermeldung. Das Problem fällt erst auf, wenn ein konkreter "
                                    "Fall vermisst wird."),
                            empfehlung=("Bereich auf eine Tabelle (Strg+T) oder einen dynamischen "
                                        "Namen umstellen, der automatisch mitwächst."),
                        ))
    return _eindeutig(funde)


def pruefe_zirkelbezuege(wb):
    funde = []
    for blatt in wb.worksheets:
        graph = defaultdict(set)
        for zeile in blatt.iter_rows():
            for zelle in zeile:
                if not _ist_formel(zelle):
                    continue
                ziele = set()
                ohne_blatt = BLATTBEZUG_RE.sub("", zelle.value)
                for m in ZELLE_RE.finditer(ohne_blatt):
                    try:
                        sp_idx = column_index_from_string(m.group(2))
                    except Exception:
                        continue
                    ziele.add((sp_idx, int(m.group(4))))
                graph[(zelle.column, zelle.row)] |= ziele
        for start in list(graph):
            besucht, stapel = set(), [(start, [start])]
            while stapel:
                knoten, pfad = stapel.pop()
                for z in graph.get(knoten, ()):
                    if z == start:
                        ort = f"{get_column_letter(start[0])}{start[1]}"
                        funde.append(Finding(
                            schweregrad="kritisch",
                            kategorie="Zirkelbezug",
                            fundort=f"Blatt „{blatt.title}“, Zelle {ort}",
                            befund="Formel bezieht sich – direkt oder über Umwege – auf sich selbst.",
                            risiko=("Das Ergebnis hängt vom letzten Rechenlauf ab, nicht von einer "
                                    "eindeutigen Formel. Je nach Excel-Einstellung erscheint 0, der "
                                    "alte Wert oder eine Fehlermeldung."),
                            empfehlung="Formelkette prüfen und den Rückbezug auflösen.",
                        ))
                        stapel.clear()
                        break
                    if z not in besucht:
                        besucht.add(z)
                        stapel.append((z, pfad + [z]))
    return _eindeutig(funde)


def pruefe_formel_inkonsistenz(wb):
    """Innerhalb einer Spalte sollte dieselbe Formel (bis auf den
    Zeilenbezug) für jede Zeile gelten. Abweichungen sind fast immer ein
    Zeichen für eine von Hand überschriebene oder vergessene Zeile."""
    funde = []
    for blatt in wb.worksheets:
        if blatt.max_row < 6:
            continue
        kopf = _kopfzeile(blatt)
        pro_spalte = defaultdict(dict)
        for zeile in blatt.iter_rows(min_row=kopf + 1):
            for zelle in zeile:
                if _ist_formel(zelle):
                    pro_spalte[zelle.column][zelle.row] = zelle

        for sp, zellen in pro_spalte.items():
            if len(zellen) < 6:
                continue
            zeilen = sorted(zellen)
            muster_zaehler = defaultdict(list)
            for z in zeilen:
                norm = _normalisiere_formel(zellen[z].value, z)
                muster_zaehler[norm].append(z)
            if len(muster_zaehler) <= 1:
                continue
            haupt_muster = max(muster_zaehler.values(), key=len)
            if len(haupt_muster) < max(4, 0.6 * len(zeilen)):
                continue  # kein klares Mehrheitsmuster erkennbar -> nicht werten
            abweichler = [z for muster, zs in muster_zaehler.items() if zs is not haupt_muster
                          for z in zs]
            if not abweichler or _ist_randzeile_abweichung(abweichler, zeilen):
                continue
            beispiele = ", ".join(f"{get_column_letter(sp)}{z}" for z in sorted(abweichler)[:5])
            funde.append(Finding(
                schweregrad="hoch",
                kategorie="Uneinheitliche Formel in einer Spalte",
                fundort=f"Blatt „{blatt.title}“, Spalte {get_column_letter(sp)}",
                befund=(f"{len(abweichler)} von {len(zeilen)} Zeilen dieser Spalte verwenden eine "
                        f"andere Formel als der Rest, z.B. {beispiele}."),
                risiko=("Sehr häufige Fehlerquelle: eine Zeile wurde von Hand angepasst, beim "
                        "Kopieren übersprungen oder nachträglich eingefügt. Ergebnisse dieser "
                        "Zeilen sind mit dem Rest der Tabelle nicht vergleichbar, ohne dass das "
                        "auffällt."),
                empfehlung="Betroffene Zeilen prüfen und die einheitliche Formel wiederherstellen.",
            ))
    return funde


def pruefe_manuelle_ueberschreibung(wb):
    """Spalte besteht mehrheitlich aus Formeln, aber einzelne Zellen sind
    harte Werte -> jemand hat das Rechenergebnis von Hand ersetzt."""
    funde = []
    for blatt in wb.worksheets:
        kopf = _kopfzeile(blatt)
        pro_spalte = defaultdict(list)
        for zeile in blatt.iter_rows(min_row=kopf + 1):
            for zelle in zeile:
                if zelle.value is not None:
                    pro_spalte[zelle.column].append(zelle)
        for sp, zellen in pro_spalte.items():
            formeln = [z for z in zellen if _ist_formel(z)]
            werte = [z for z in zellen if not _ist_formel(z)]
            alle_zeilen = sorted(z.row for z in zellen)
            if (len(formeln) >= 6 and 0 < len(werte) <= max(1, 0.15 * len(zellen))
                    and not _ist_randzeile_abweichung([z.row for z in werte], alle_zeilen)):
                orte = ", ".join(z.coordinate for z in werte[:5])
                funde.append(Finding(
                    schweregrad="hoch",
                    kategorie="Formel von Hand überschrieben",
                    fundort=f"Blatt „{blatt.title}“, Spalte {get_column_letter(sp)}",
                    befund=(f"{len(werte)} von {len(zellen)} Zellen enthalten einen festen Wert, "
                            f"obwohl die Spalte sonst durchgehend berechnet wird (z.B. {orte})."),
                    risiko=("Diese Zellen aktualisieren sich nicht mehr mit – ändern sich die "
                            "Ausgangsdaten, bleibt hier der alte Stand stehen, ohne Warnung."),
                    empfehlung="Prüfen, ob die Überschreibung beabsichtigt war; sonst Formel wiederherstellen.",
                ))
    return funde


def pruefe_fehlerwerte(wb):
    funde = []
    fundorte = []
    for blatt in wb.worksheets:
        for zeile in blatt.iter_rows():
            for zelle in zeile:
                if isinstance(zelle.value, str) and any(f in zelle.value for f in FEHLERWERTE):
                    fundorte.append(f"„{blatt.title}“!{zelle.coordinate}")
    if fundorte:
        funde.append(Finding(
            schweregrad="hoch",
            kategorie="Fehlerwerte in der Datei",
            fundort=", ".join(fundorte[:8]) + (f" (+{len(fundorte)-8} weitere)" if len(fundorte) > 8 else ""),
            befund=f"{len(fundorte)} Zelle(n) enthalten einen Excel-Fehlerwert.",
            risiko=("Jede Formel, die sich auf eine solche Zelle bezieht, wird ebenfalls fehlerhaft "
                    "– der Fehler pflanzt sich unbemerkt durch die ganze Tabelle fort."),
            empfehlung="Ursache der Fehlerzelle beheben, bevor die Datei weiterverteilt wird.",
        ))
    return funde


def pruefe_volatile_funktionen(wb):
    funde = []
    zaehler = 0
    blaetter_betroffen = set()
    for blatt in wb.worksheets:
        for zeile in blatt.iter_rows():
            for zelle in zeile:
                if _ist_formel(zelle) and any(f in zelle.value.upper() for f in
                                               [v.upper() for v in VOLATILE_FUNKTIONEN]):
                    zaehler += 1
                    blaetter_betroffen.add(blatt.title)
    if zaehler >= 30:
        funde.append(Finding(
            schweregrad="mittel",
            kategorie="Viele „flüchtige“ Formeln",
            fundort=", ".join(f"„{b}“" for b in sorted(blaetter_betroffen)),
            befund=(f"{zaehler} Formeln verwenden HEUTE(), JETZT(), INDIREKT(), VERSCHIEBUNG() "
                    "oder ähnliche Funktionen, die bei jeder Änderung neu berechnet werden."),
            risiko=("Die gesamte Arbeitsmappe rechnet bei jeder Eingabe komplett neu – die Datei "
                    "wird mit wachsendem Bestand spürbar langsamer, unabhängig davon, wie viele "
                    "Zeilen tatsächlich geändert wurden."),
            empfehlung="Wo möglich durch stabile Formeln ersetzen oder Berechnung auf manuell umstellen.",
        ))
    return funde


def pruefe_externe_verknuepfungen(pfad):
    funde = []
    try:
        with zipfile.ZipFile(pfad) as z:
            namen = z.namelist()
            if any("externalLink" in n for n in namen):
                funde.append(Finding(
                    schweregrad="hoch",
                    kategorie="Verknüpfung zu externer Datei",
                    fundort="gesamte Arbeitsmappe",
                    befund="Die Datei enthält Formelbezüge auf eine andere, externe Datei.",
                    risiko=("Ist die verknüpfte Datei umbenannt, verschoben oder nicht erreichbar "
                            "(z.B. bei einer Weitergabe per E-Mail), liefern die betroffenen "
                            "Formeln veraltete oder falsche Werte, ohne dass das auffällt."),
                    empfehlung="Verknüpfung auflösen oder Werte in diese Datei einbetten.",
                ))
            if any("vbaProject" in n for n in namen):
                funde.append(Finding(
                    schweregrad="hinweis",
                    kategorie="Makros enthalten",
                    fundort="gesamte Arbeitsmappe",
                    befund="Die Datei enthält VBA-Makrocode.",
                    risiko=("Makros werden von vielen Firmen standardmässig blockiert; Empfänger "
                            "sehen dann eine Sicherheitswarnung oder der Makro-Teil funktioniert "
                            "gar nicht."),
                    empfehlung="Prüfen, ob die Makrologik durch reine Formeln ersetzt werden kann.",
                ))
    except (zipfile.BadZipFile, FileNotFoundError):
        pass
    return funde


def pruefe_datenpruefung_luecken(wb):
    funde = []
    for blatt in wb.worksheets:
        dvs = list(blatt.data_validations.dataValidation)
        if not dvs:
            continue
        letzte_zeile = _letzte_zeile_mit_daten(blatt)
        for dv in dvs:
            for bereich in str(dv.sqref).split():
                m = re.match(r"([A-Z]+)(\d+):([A-Z]+)(\d+)$", bereich)
                if not m:
                    continue
                z2 = int(m.group(4))
                if z2 < letzte_zeile and (letzte_zeile - z2) > 2:
                    funde.append(Finding(
                        schweregrad="mittel",
                        kategorie="Eingabeprüfung deckt nicht alle Zeilen ab",
                        fundort=f"Blatt „{blatt.title}“, Bereich {bereich}",
                        befund=(f"Die Prüfregel endet bei Zeile {z2}, Daten reichen aber bis "
                                f"Zeile {letzte_zeile}."),
                        risiko=("In den ungeprüften Zeilen kann eine falsche Eingabe (Tippfehler, "
                                "falscher Wert) unbemerkt stehen bleiben – genau dort, wo die "
                                "Prüfung eigentlich schützen sollte."),
                        empfehlung="Prüfregel auf den tatsächlichen Datenbereich erweitern oder als Tabelle führen.",
                    ))
                    break
    return funde


def pruefe_datum_als_text(wb):
    funde = []
    for blatt in wb.worksheets:
        text_treffer = defaultdict(int)
        echte_daten = defaultdict(int)
        for zeile in blatt.iter_rows(min_row=2):
            for zelle in zeile:
                if isinstance(zelle.value, str) and DATUM_MUSTER.match(zelle.value):
                    text_treffer[zelle.column] += 1
                elif isinstance(zelle.value, (datetime, date)):
                    echte_daten[zelle.column] += 1
        for sp, treffer in text_treffer.items():
            if treffer < 3:
                continue
            gemischt = echte_daten[sp] > 0
            funde.append(Finding(
                schweregrad="hoch",
                kategorie="Datum als Text gespeichert",
                fundort=f"Blatt „{blatt.title}“, Spalte {get_column_letter(sp)}",
                befund=(f"{treffer} Zellen sehen aus wie ein Datum, sind aber als Text "
                        "gespeichert, nicht als echtes Datum" +
                        (f" ({echte_daten[sp]} andere Zellen in derselben Spalte sind dagegen "
                         "echte Datumswerte)." if gemischt else ".")),
                risiko=("Vergleiche wie „liegt vor dem Stichtag“ oder Berechnungen wie "
                        "„Anzahl Tage“ liefern für diese Zellen falsche oder gar keine "
                        "Ergebnisse – meist ohne Fehlermeldung, die Zelle bleibt einfach leer "
                        "oder zeigt 0." + (" Da der Rest der Spalte korrekt ist, fällt gerade "
                        "dieser Fehler besonders leicht durch." if gemischt else "")),
                empfehlung="Spalte per Datenüberprüfung auf Datum umstellen und Werte neu einlesen.",
            ))
    return funde


def pruefe_zusammengefasste_zellen(wb):
    funde = []
    for blatt in wb.worksheets:
        anzahl = len(blatt.merged_cells.ranges)
        breite_bereiche = [r for r in blatt.merged_cells.ranges if (r.max_row - r.min_row) > 3
                            and r.min_row > 3]
        if breite_bereiche:
            funde.append(Finding(
                schweregrad="mittel",
                kategorie="Verbundene Zellen im Datenbereich",
                fundort=f"Blatt „{blatt.title}“",
                befund=f"{len(breite_bereiche)} verbundene Zellbereiche liegen im eigentlichen Datenbereich.",
                risiko=("Verbundene Zellen brechen Sortieren, Filtern und viele Formeln (z.B. "
                        "SVERWEIS/INDEX) unvorhersehbar – oft erst nach einer Sortierung merkt "
                        "man, dass Zeilen durcheinandergeraten sind."),
                empfehlung="Verbund im Datenbereich auflösen, Formatierung stattdessen über Zellrahmen lösen.",
            ))
    return funde


def pruefe_verwaiste_und_versteckte_blaetter(wb):
    funde = []
    referenziert = set()
    for blatt in wb.worksheets:
        for zeile in blatt.iter_rows():
            for zelle in zeile:
                if _ist_formel(zelle):
                    for m in BLATTBEZUG_RE.finditer(zelle.value):
                        name = m.group(1) or m.group(2)
                        referenziert.add(name)
    for blatt in wb.worksheets:
        hat_daten = any(any(c.value not in (None, "") for c in zeile) for zeile in blatt.iter_rows(max_row=30))
        if blatt.title not in referenziert and hat_daten and len(wb.worksheets) > 1:
            if blatt.sheet_state != "visible":
                funde.append(Finding(
                    schweregrad="mittel",
                    kategorie="Verstecktes, unreferenziertes Blatt",
                    fundort=f"Blatt „{blatt.title}“ (ausgeblendet)",
                    befund="Das Blatt enthält Daten, ist ausgeblendet und wird von keiner Formel referenziert.",
                    risiko=("Niemand weiss ohne Suchen, dass diese Daten existieren. Entweder sind "
                            "sie überflüssig, oder eine gewollte Anbindung fehlt."),
                    empfehlung="Klären, ob das Blatt gebraucht wird; sonst entfernen, sonst einbinden.",
                ))
    return funde


def pruefe_ungesicherte_formeln(wb):
    funde = []
    for blatt in wb.worksheets:
        if not blatt.protection or not blatt.protection.sheet:
            continue
        letzte = _letzte_zeile_mit_daten(blatt)
        stichproben = sorted({2, max(2, letzte // 2), letzte} & set(range(1, blatt.max_row + 1)))
        offene_formelzellen = []
        for r in stichproben:
            for zelle in blatt[r]:
                if _ist_formel(zelle) and zelle.protection and zelle.protection.locked is False:
                    offene_formelzellen.append(zelle.coordinate)
        if offene_formelzellen:
            funde.append(Finding(
                schweregrad="hoch",
                kategorie="Formel trotz Blattschutz überschreibbar",
                fundort=f"Blatt „{blatt.title}“, z.B. {', '.join(offene_formelzellen[:5])}",
                befund="Das Blatt ist geschützt, einzelne Formelzellen sind aber ausdrücklich als Eingabe freigegeben.",
                risiko="Der Schutz suggeriert Sicherheit, verhindert das versehentliche Überschreiben dieser Formeln aber nicht.",
                empfehlung="Formelzellen sperren, nur echte Eingabefelder offen lassen.",
            ))
    return funde


def pruefe_ueberlange_formeln(wb):
    funde = []
    schlimmste = None
    for blatt in wb.worksheets:
        for zeile in blatt.iter_rows():
            for zelle in zeile:
                if _ist_formel(zelle) and len(zelle.value) > 1500:
                    if schlimmste is None or len(zelle.value) > len(schlimmste[2].value):
                        schlimmste = (blatt.title, zelle.coordinate, zelle)
    if schlimmste:
        blatt_titel, coord, zelle = schlimmste
        funde.append(Finding(
            schweregrad="hinweis",
            kategorie="Sehr lange Formel",
            fundort=f"Blatt „{blatt_titel}“, Zelle {coord}",
            befund=f"Formel ist {len(zelle.value)} Zeichen lang (Excel-Grenze: 8192).",
            risiko="Kaum wartbar – niemand ausser der ursprünglichen Autorin kann eine solche Formel gefahrlos ändern.",
            empfehlung="In Hilfsspalten oder eine Named-Function aufteilen.",
        ))
    return funde


def pruefe_duplikate_kopfzeile(wb):
    funde = []
    for blatt in wb.worksheets:
        kopf_zeile = _kopfzeile(blatt)
        werte = [c.value for c in blatt[kopf_zeile] if c.value not in (None, "")]
        if not werte:
            continue
        gesehen = defaultdict(int)
        for w in werte:
            gesehen[str(w).strip()] += 1
        doppelt = [w for w, n in gesehen.items() if n > 1]
        if doppelt:
            funde.append(Finding(
                schweregrad="mittel",
                kategorie="Doppelte Spaltenüberschrift",
                fundort=f"Blatt „{blatt.title}“",
                befund=f"Überschrift(en) mehrfach vergeben: {', '.join(doppelt[:5])}.",
                risiko="Funktionen wie SVERWEIS/INDEX-VERGLEICH nach Spaltenname greifen dann auf die falsche Spalte zu.",
                empfehlung="Überschriften eindeutig benennen.",
            ))
    return funde


def _eindeutig(funde):
    gesehen, ergebnis = set(), []
    for f in funde:
        key = (f.kategorie, f.fundort)
        if key not in gesehen:
            gesehen.add(key)
            ergebnis.append(f)
    return ergebnis


ALLE_PRUEFUNGEN = [
    pruefe_datenverlust_durch_feste_bereiche,
    pruefe_zirkelbezuege,
    pruefe_formel_inkonsistenz,
    pruefe_manuelle_ueberschreibung,
    pruefe_fehlerwerte,
    pruefe_volatile_funktionen,
    pruefe_datenpruefung_luecken,
    pruefe_datum_als_text,
    pruefe_zusammengefasste_zellen,
    pruefe_verwaiste_und_versteckte_blaetter,
    pruefe_ungesicherte_formeln,
    pruefe_ueberlange_formeln,
    pruefe_duplikate_kopfzeile,
]


def analysiere_datei(pfad: str) -> Bericht:
    wb = openpyxl.load_workbook(pfad, data_only=False)
    findings = []
    for pruefung in ALLE_PRUEFUNGEN:
        findings.extend(pruefung(wb))
    findings.extend(pruefe_externe_verknuepfungen(pfad))

    anzahl_formeln = sum(
        1 for blatt in wb.worksheets for zeile in blatt.iter_rows() for zelle in zeile
        if _ist_formel(zelle)
    )
    return Bericht(
        dateiname=pfad,
        erstellt=datetime.now(),
        anzahl_blaetter=len(wb.worksheets),
        anzahl_formeln=anzahl_formeln,
        findings=findings,
    )


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Aufruf: python3 analyzer.py Datei.xlsx")
        sys.exit(1)
    bericht = analysiere_datei(sys.argv[1])
    print(f"{bericht.dateiname}: {bericht.anzahl_blaetter} Blätter, {bericht.anzahl_formeln} Formeln")
    print(f"{len(bericht.findings)} Befund(e)\n")
    for f in bericht.sortiert():
        print(f"[{f.schweregrad.upper():8}] {f.kategorie} — {f.fundort}")
        print(f"           {f.befund}")
        print(f"           Risiko: {f.risiko}")
        print(f"           Empfehlung: {f.empfehlung}\n")
