#!/usr/bin/env bash
# Täglicher Loop: Verkäufe holen, Produkt prüfen, Finanzbericht, Auszahlungscheck.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 agent/sync_gumroad.py
( cd products/vermieter-toolkit-ch && python3 build.py >/dev/null && BEISPIEL=1 python3 build.py >/dev/null && python3 tests/pruefe.py | tail -1 )
python3 analytics/report.py
python3 monitoring/payout_check.py | tee -a "logs/report-$(date +%F).md"
echo "$(date -u +%FT%RZ) loop       daily_loop ausgeführt" >> logs/actions.log
