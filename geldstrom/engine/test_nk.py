"""Tests für den Rechenkern. Aufruf: python3 -m unittest test_nk.py"""
import copy
import datetime as dt
import json
import os
import tempfile
import unittest

import nk

HIER = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(HIER, "beispiel", "mfh-beispielweg.json"), encoding="utf-8") as f:
    BEISPIEL = json.load(f)


def minimal(**extra):
    daten = {
        "vermieter": {"name": "V", "iban": "CH00"},
        "liegenschaft": {"bezeichnung": "L", "adresse": "A"},
        "periode": {"von": "2025-07-01", "bis": "2026-06-30"},
        "einheiten": [{"id": "A", "schluessel": {"m2": 60}}, {"id": "B", "schluessel": {"m2": 40}}],
        "mietverhaeltnisse": [
            {"einheit": "A", "mieter": "Mieter A", "von": "2020-01-01", "akonto_monatlich": 100},
            {"einheit": "B", "mieter": "Mieter B", "von": "2020-01-01", "akonto_monatlich": 100},
        ],
        "kosten": [{"position": "Wasser", "kategorie": "nebenkosten", "schluessel": "m2", "betrag": 1000}],
    }
    daten.update(extra)
    return daten


class Tabellen(unittest.TestCase):
    def test_heizgradtage_ergeben_100_prozent(self):
        self.assertAlmostEqual(sum(nk.HGT_OHNE_WW), 100.0, places=6)
        self.assertAlmostEqual(sum(nk.HGT_MIT_WW), 100.0, places=6)

    def test_auszug_ende_november_ohne_ww_wie_tabelle(self):
        # Tabelle mp: letzte Abrechnung Ende Juni, Auszug Ende November -> 24.50 %
        voll = nk.gewicht(dt.date(2025, 7, 1), dt.date(2026, 6, 30), "hgt")
        teil = nk.gewicht(dt.date(2025, 7, 1), dt.date(2025, 11, 30), "hgt")
        self.assertAlmostEqual(teil / voll * 100, 24.5, places=6)

    def test_einzug_dezember_mit_ww_wie_tabelle(self):
        # Tabelle mp mit WW: Einzug Anfang Dezember, nächste Abrechnung Ende Juni -> 68.80 %
        voll = nk.gewicht(dt.date(2025, 7, 1), dt.date(2026, 6, 30), "hgt_ww")
        teil = nk.gewicht(dt.date(2025, 12, 1), dt.date(2026, 6, 30), "hgt_ww")
        self.assertAlmostEqual(teil / voll * 100, 68.8, places=6)


class Verteilung(unittest.TestCase):
    def test_einfache_verteilung_nach_m2(self):
        erg, befund = nk.rechne(minimal())
        a, b = erg["mietverhaeltnisse"]
        self.assertAlmostEqual(a["_kosten"], 600.0, places=2)
        self.assertAlmostEqual(b["_kosten"], 400.0, places=2)
        self.assertAlmostEqual(a["_akonto"], 1200.0, places=2)
        self.assertAlmostEqual(a["_saldo"], -600.0, places=2)
        self.assertFalse(befund.hat_fehler)

    def test_leerstand_traegt_vermieter(self):
        daten = minimal()
        daten["mietverhaeltnisse"][1]["von"] = "2026-01-01"
        erg, _ = nk.rechne(daten)
        b = erg["mietverhaeltnisse"][1]
        tage_b = (dt.date(2026, 6, 30) - dt.date(2026, 1, 1)).days + 1
        self.assertAlmostEqual(b["_kosten"], 400 * tage_b / 365, places=2)
        self.assertAlmostEqual(erg["vermieter"]["leerstand"], 400 - b["_kosten"], places=2)

    def test_kontrollsumme_im_beispiel(self):
        erg, befund = nk.rechne(copy.deepcopy(BEISPIEL))
        verteilt = sum(m["_kosten"] for m in erg["mietverhaeltnisse"])
        v = erg["vermieter"]
        self.assertAlmostEqual(verteilt + v["leerstand"] + v["nicht_vereinbart"], erg["total_kosten"], places=1)
        self.assertFalse(befund.hat_fehler)

    def test_nicht_vereinbarte_position_geht_an_vermieter(self):
        daten = minimal()
        daten["mietverhaeltnisse"][0]["vereinbarte_positionen"] = ["Heizung"]
        erg, befund = nk.rechne(daten)
        self.assertAlmostEqual(erg["mietverhaeltnisse"][0]["_kosten"], 0.0, places=2)
        self.assertAlmostEqual(erg["vermieter"]["nicht_vereinbart"], 600.0, places=2)
        self.assertTrue(any("nicht vereinbart" in t for _, t in befund.eintraege))

    def test_ueberschneidung_ist_fehler(self):
        daten = minimal()
        daten["mietverhaeltnisse"].append({"einheit": "A", "mieter": "Doppelt", "von": "2025-12-01"})
        _, befund = nk.rechne(daten)
        self.assertTrue(befund.hat_fehler)

    def test_unzulaessige_position_wird_gemeldet(self):
        daten = minimal()
        daten["kosten"].append({"position": "Reparatur Storen", "schluessel": "gleich", "betrag": 300})
        _, befund = nk.rechne(daten)
        self.assertTrue(any("Reparatur Storen" in t for s, t in befund.eintraege if s == "WARNUNG"))

    def test_direkte_zuweisung_muss_aufgehen(self):
        daten = minimal()
        daten["kosten"].append({"position": "Waschmarken", "schluessel": "direkt", "betrag": 100,
                                "direkt": {"A": 30, "B": 60}})
        _, befund = nk.rechne(daten)
        self.assertTrue(befund.hat_fehler)

    def test_verwaltungshonorar(self):
        erg, _ = nk.rechne(minimal(verwaltungshonorar_prozent=4))
        a = erg["mietverhaeltnisse"][0]
        self.assertAlmostEqual(a["_honorar"], 24.0, places=2)
        self.assertAlmostEqual(a["_total"], 624.0, places=2)

    def test_saldo_auf_5_rappen(self):
        daten = minimal()
        daten["kosten"][0]["betrag"] = 1000.07
        erg, _ = nk.rechne(daten)
        for m in erg["mietverhaeltnisse"]:
            self.assertAlmostEqual(m["_saldo"] * 20, round(m["_saldo"] * 20), places=6)


class Rechtliches(unittest.TestCase):
    def test_wasserzins_ist_keine_warnung(self):
        daten = minimal()
        daten["kosten"][0]["position"] = "Wasserzins"
        _, befund = nk.rechne(daten)
        self.assertFalse(any("Wasserzins" in t for s, t in befund.eintraege if s == "WARNUNG"))

    def test_hypothekarzins_ist_warnung(self):
        daten = minimal()
        daten["kosten"].append({"position": "Hypothekarzins", "schluessel": "gleich", "betrag": 100})
        _, befund = nk.rechne(daten)
        self.assertTrue(any("Hypothekarzins" in t for s, t in befund.eintraege if s == "WARNUNG"))

    def test_verwaltungsaufwand_ohne_vereinbarung_nur_auf_heizung(self):
        daten = minimal(verwaltungshonorar_prozent=4)
        daten["kosten"].append({"position": "Heizung", "kategorie": "heizung", "schluessel": "m2", "betrag": 1000})
        for mv in daten["mietverhaeltnisse"]:
            mv["vereinbarte_positionen"] = ["Wasser", "Heizung"]
        erg, _ = nk.rechne(daten)
        a = erg["mietverhaeltnisse"][0]
        self.assertAlmostEqual(a["_honorar"], 600 * 0.04, places=2)   # nur Heizanteil 600

    def test_verwaltungsaufwand_mit_vereinbarung_auf_alles(self):
        daten = minimal(verwaltungshonorar_prozent=4)
        daten["kosten"].append({"position": "Heizung", "kategorie": "heizung", "schluessel": "m2", "betrag": 1000})
        for mv in daten["mietverhaeltnisse"]:
            mv["vereinbarte_positionen"] = ["Wasser", "Heizung", "Verwaltungsaufwand"]
        erg, _ = nk.rechne(daten)
        self.assertAlmostEqual(erg["mietverhaeltnisse"][0]["_honorar"], 1200 * 0.04, places=2)

    def test_pauschale_wird_nicht_abgerechnet(self):
        daten = minimal()
        daten["mietverhaeltnisse"][1]["nebenkosten_art"] = "pauschal"
        erg, _ = nk.rechne(daten)
        self.assertEqual(len(erg["mietverhaeltnisse"]), 1)
        self.assertAlmostEqual(erg["vermieter"]["leerstand"], 400.0, places=2)

    def test_kontrollsumme_viele_mieter_ohne_rundungsfehler(self):
        daten = minimal()
        daten["einheiten"] = [{"id": f"E{i}", "schluessel": {"m2": 33 + i}} for i in range(12)]
        daten["mietverhaeltnisse"] = [{"einheit": f"E{i}", "mieter": f"M{i}", "von": "2020-01-01",
                                       "bis": "2025-10-17"} for i in range(12)] + \
                                     [{"einheit": f"E{i}", "mieter": f"N{i}", "von": "2025-10-18"} for i in range(12)]
        daten["kosten"][0]["betrag"] = 9999.99
        _, befund = nk.rechne(daten)
        self.assertFalse(befund.hat_fehler, befund.text())

    def test_keine_akonto_empfehlung_bei_auszug_am_periodenende(self):
        daten = minimal()
        daten["mietverhaeltnisse"][0]["bis"] = "2026-06-30"
        erg, _ = nk.rechne(daten)
        self.assertIsNone(erg["mietverhaeltnisse"][0]["_akonto_empfehlung"])
        self.assertIsNotNone(erg["mietverhaeltnisse"][1]["_akonto_empfehlung"])


class Heizoel(unittest.TestCase):
    def test_fifo_bewertung(self):
        lager = {"anfangsbestand_liter": 1000, "anfangsbestand_chf": 900,
                 "einkaeufe": [{"datum": "2025-10-01", "liter": 2000, "chf": 2200}],
                 "endbestand_liter": 1500}
        chf_betrag, _ = nk.heizoel_verbrauch(lager, nk.Befund(), "Heizöl")
        # Endbestand 1500 l aus dem Einkauf zu 1.10 = 1650; Verbrauch 900 + 2200 - 1650
        self.assertAlmostEqual(chf_betrag, 1450.0, places=2)

    def test_endbestand_zu_gross(self):
        befund = nk.Befund()
        nk.heizoel_verbrauch({"anfangsbestand_liter": 100, "anfangsbestand_chf": 100,
                              "endbestand_liter": 500}, befund, "Heizöl")
        self.assertTrue(befund.hat_fehler)


class Ausgabe(unittest.TestCase):
    def test_dateien_werden_geschrieben(self):
        erg, befund = nk.rechne(copy.deepcopy(BEISPIEL))
        with tempfile.TemporaryDirectory() as out:
            dateien = nk.schreibe(erg, befund, out)
            self.assertEqual(len(dateien), len(erg["mietverhaeltnisse"]) + 1)
            with open(os.path.join(out, "Abrechnung_EG_rechts_Marco_Rossi.html"), encoding="utf-8") as f:
                rossi = f.read()
            self.assertIn("Guthaben zu Ihren Gunsten", rossi)
            self.assertNotIn("empfehlen wir eine Akontozahlung", rossi)  # ausgezogen


if __name__ == "__main__":
    unittest.main()
