"""Bewertung der Kandidaten fuer die sechste Kernfunktion.

Kriterien je 0-10, Gewichte gemaess Auftrag. «Konkurrenz»: 10 = kaum gute Gratis-Alternative.
Aufruf: python3 kandidaten.py  ->  kandidaten.md
"""
import os

GEWICHTE = {"Haeufigkeit": .20, "Schmerz": .20, "Zahlungsbereitschaft": .15, "Synergie": .15,
            "Konkurrenz": .10, "Excel": .10, "Verkauf": .10}

# Name, Haeufigkeit, Schmerz, Zahlungsbereitschaft, Synergie, Konkurrenz, Excel, Verkauf, Notiz
KANDIDATEN = [
    ("Schaden & Kautionsabrechnung nach Lebensdauertabelle", 6, 9, 8, 10, 6, 9, 10,
     "jeder Auszug; Streitpunkt Nr. 1 bei der Rückgabe; Gratis-Tool von HEV/MV zeigt nur Lebensdauer, rechnet keine Abrechnung"),
    ("Mietzinsjournal & Mahnwesen (Art. 257d OR)", 9, 6, 5, 9, 5, 9, 5,
     "monatlich; Verzug selten, aber teuer; E-Banking deckt das Prüfen grösstenteils ab"),
    ("Fristen-Cockpit über alle Module", 8, 5, 5, 10, 7, 8, 6,
     "Integrationsschicht, keine eigenständige Aufgabe"),
    ("Steuer-Jahresübersicht Liegenschaft (Pauschal vs. effektiv)", 4, 7, 7, 8, 6, 8, 7,
     "jährlich; kantonale Unterschiede -> rechtlich heikel"),
    ("Korrespondenz-Vorlagen (Briefe ohne amtliche Formulare)", 5, 5, 5, 8, 3, 7, 6,
     "viele Gratis-Muster; amtliche Formulare kommen vom Kanton"),
    ("Mietzinsreduktion bei Mängeln (Art. 259d OR)", 2, 7, 5, 6, 6, 7, 6,
     "selten; Prozentsätze sind Gerichtspraxis, nicht Formel"),
    ("Überwälzung wertvermehrender Investitionen (Art. 14 VMWG)", 2, 7, 7, 8, 7, 8, 6,
     "gehört in den Mietzinsrechner, nicht als eigenes Modul"),
    ("Unterhaltsplanung / Erneuerungsbudget", 3, 5, 6, 7, 7, 8, 6,
     "nützlich, aber kein akuter Schmerz"),
    ("Mängel- und Handwerker-Tracker", 6, 5, 4, 6, 5, 7, 4,
     "Notizbuch reicht vielen"),
    ("Anfangsmietzins / Mietzinsfestlegung Neuvermietung", 3, 6, 6, 7, 4, 6, 6,
     "Anfechtungsrisiko; Portale zeigen Vergleichsmieten gratis"),
    ("Mieterauswahl / Bewerbungsvergleich", 4, 6, 4, 6, 5, 7, 5,
     "Datenschutz (DSG) heikel"),
    ("Mietvertrag-Generator", 3, 6, 6, 6, 2, 5, 6,
     "HEV-Formulare günstig und etabliert; Haftungsrisiko"),
    ("Kautionsverwaltung allein", 4, 5, 4, 8, 6, 9, 4,
     "Teil von Kandidat 1"),
    ("Zählerstände / verbrauchsabhängige Heizkosten", 5, 4, 3, 9, 6, 9, 3,
     "gehört in die Nebenkostenabrechnung"),
    ("Stockwerkeigentum-Abrechnung", 3, 6, 6, 4, 4, 8, 5,
     "andere Zielgruppe (Verwaltung der STWEG)"),
    ("Renditerechner Liegenschaft", 2, 3, 4, 4, 3, 9, 5,
     "viele Gratis-Rechner"),
    ("Inserattext-Generator", 4, 4, 3, 5, 3, 4, 4,
     "Portale und KI gratis"),
    ("Betreibung / Zahlungsbefehl-Hilfe", 1, 8, 5, 5, 5, 6, 4,
     "selten; Formular beim Betreibungsamt"),
    ("Versicherungs- und Vertragsübersicht", 2, 3, 2, 4, 5, 9, 2,
     "geringer Nutzen"),
    ("Untermiete / Kurzzeitvermietung prüfen", 1, 4, 2, 3, 5, 5, 3,
     "Randfall"),
]


def score(k):
    werte = dict(zip(GEWICHTE, k[1:8]))
    return round(sum(GEWICHTE[g] * werte[g] for g in GEWICHTE) * 10)


def main():
    zeilen = sorted(KANDIDATEN, key=score, reverse=True)
    out = ["| Rang | Kandidat | Häuf. 20% | Schmerz 20% | Zahl. 15% | Synergie 15% | Konk. 10% | Excel 10% | Verkauf 10% | Score | Notiz |",
           "|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|"]
    for i, k in enumerate(zeilen, 1):
        out.append(f"| {i} | {k[0]} | " + " | ".join(str(x) for x in k[1:8]) + f" | **{score(k)}** | {k[8]} |")
    pfad = os.path.join(os.path.dirname(os.path.abspath(__file__)), "kandidaten.md")
    with open(pfad, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    print("\n".join(out))


if __name__ == "__main__":
    main()
