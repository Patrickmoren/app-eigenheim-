"""CFO-Ledger: Einnahmen, Kosten und menschliche Zeit je Einnahmequelle.

    python3 cfo.py stream  <id> <name> [status]        Quelle anlegen (TEST/PROFITABLE/SCALE/WATCH/STOP)
    python3 cfo.py ein     <id> <chf> <text>           Einnahme buchen (netto nach Plattformgebuehr)
    python3 cfo.py aus     <id> <chf> <text>           Kosten buchen
    python3 cfo.py zeit    <id> <minuten> <text>       menschliche Zeit buchen
    python3 cfo.py status  <id> <status>               Status setzen
    python3 cfo.py report                              Bericht je Quelle

Budgetregel: Summe aller Kosten <= CHF 50, solange keine Quelle PROFITABLE ist.
"""
import os
import sqlite3
import sys

DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ledger.sqlite")
TESTBUDGET = 50.0
STATI = ("TEST", "PROFITABLE", "SCALE", "WATCH", "STOP")


def db():
    con = sqlite3.connect(DB)
    con.executescript("""
        CREATE TABLE IF NOT EXISTS stream(id TEXT PRIMARY KEY, name TEXT, status TEXT DEFAULT 'TEST');
        CREATE TABLE IF NOT EXISTS buchung(
            ts TEXT DEFAULT CURRENT_TIMESTAMP, stream TEXT REFERENCES stream(id),
            art TEXT CHECK(art IN ('ein','aus','zeit')), wert REAL, text TEXT);
    """)
    return con


def summe(con, stream, art):
    return con.execute("SELECT COALESCE(SUM(wert),0) FROM buchung WHERE stream=? AND art=?",
                       (stream, art)).fetchone()[0]


def report(con):
    zeilen = con.execute("SELECT id, name, status FROM stream ORDER BY id").fetchall()
    print(f"{'Quelle':28} {'Status':10} {'Umsatz':>9} {'Kosten':>8} {'Gewinn':>9} {'ROI':>7} {'Std':>6} {'CHF/h':>8}")
    tot_k = 0
    for sid, name, status in zeilen:
        e, a, m = summe(con, sid, "ein"), summe(con, sid, "aus"), summe(con, sid, "zeit")
        tot_k += a
        g = e - a
        roi = f"{g / a * 100:.0f}%" if a else "–"
        pph = f"{g / (m / 60):.0f}" if m else "–"
        print(f"{name[:28]:28} {status:10} {e:9.2f} {a:8.2f} {g:9.2f} {roi:>7} {m/60:6.2f} {pph:>8}")
    validiert = any(s in ("PROFITABLE", "SCALE") for _, _, s in zeilen)
    print(f"\nKosten total CHF {tot_k:.2f} · Testbudget {'aufgehoben (Quelle validiert)' if validiert else f'CHF {TESTBUDGET:.0f}, frei CHF {TESTBUDGET - tot_k:.2f}'}")


def main(a):
    con = db()
    if not a or a[0] == "report":
        report(con)
    elif a[0] == "stream":
        con.execute("INSERT OR REPLACE INTO stream VALUES(?,?,?)", (a[1], a[2], a[3] if len(a) > 3 else "TEST"))
    elif a[0] in ("ein", "aus", "zeit"):
        if a[0] == "aus":
            frei = TESTBUDGET - con.execute("SELECT COALESCE(SUM(wert),0) FROM buchung WHERE art='aus'").fetchone()[0]
            validiert = con.execute("SELECT 1 FROM stream WHERE status IN ('PROFITABLE','SCALE')").fetchone()
            if not validiert and float(a[2]) > frei:
                sys.exit(f"Abgelehnt: Testbudget ueberschritten (frei CHF {frei:.2f}). Menschliche Freigabe noetig.")
        con.execute("INSERT INTO buchung(stream, art, wert, text) VALUES(?,?,?,?)",
                    (a[1], a[0], float(a[2]), " ".join(a[3:])))
    elif a[0] == "status":
        assert a[2] in STATI, STATI
        con.execute("UPDATE stream SET status=? WHERE id=?", (a[2], a[1]))
    else:
        sys.exit(__doc__)
    con.commit()


if __name__ == "__main__":
    main(sys.argv[1:])
