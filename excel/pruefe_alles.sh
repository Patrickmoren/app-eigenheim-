#!/bin/sh
# Vollständiger Prüflauf. Reihenfolge: aufbauen, statisch prüfen,
# Formeln durchrechnen, Lastfälle erzwingen, Abdeckung belegen.
set -e
cd "$(dirname "$0")"

echo "── 1 · Arbeitsmappe aufbauen ────────────────────────────"
python3 build.py

echo "\n── 2 · statische Prüfung ────────────────────────────────"
python3 pruefung_statisch.py Leerstandsliste.xlsx

echo "\n── 3 · Lastfälle erzeugen und durchrechnen ──────────────"
python3 lastfaelle.py
python3 rechenprobe.py test-lastfaelle.xlsx 2>/dev/null | tail -4
python3 abdeckung.py  test-lastfaelle.xlsx 2>/dev/null | tail -2

echo "\n── 4 · Beispielblatt durchrechnen ───────────────────────"
python3 rechenprobe.py Leerstandsliste.xlsx Beispiele 2>/dev/null | tail -3

echo "\n── 5 · Lastfälle zu verschobenen Stichtagen ─────────────"
for V in -190 -31 0 31 190; do
  ZIEL_TEST=tv.xlsx VERSATZ=$V python3 lastfaelle.py >/dev/null
  R=$(python3 rechenprobe.py tv.xlsx 2>/dev/null | tail -1)
  printf "   Versatz %+5d Tage: %s\n" "$V" "$R"
done
rm -f tv.xlsx

echo "\nPrüflauf beendet."
