#!/usr/bin/env bash
# Täglicher Loop: Produkt bauen und prüfen, Finanzbericht und Dashboard erzeugen.
set -euo pipefail
cd "$(dirname "$0")/.."
( cd products/vermieter-toolkit-ch && python3 build.py && BEISPIEL=1 python3 build.py && python3 tests/pruefe.py | tail -1 )
python3 analytics/report.py
echo "$(date -u +%FT%RZ) loop       daily_loop ausgeführt" >> logs/actions.log
