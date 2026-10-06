#!/bin/sh
# Baut beide Dateien, rechnet sie mit LibreOffice durch und vergleicht mit Python.
set -e
cd "$(dirname "$0")"
python3 build.py
T=$(mktemp -d)
soffice --headless --convert-to xlsx --outdir "$T" Nebenkostenabrechnung-CH-Beispiel.xlsx >/dev/null 2>&1
python3 pruefe.py "$T/Nebenkostenabrechnung-CH-Beispiel.xlsx"
rm -rf "$T"
