#!/bin/bash
# Startet den Schaeppi Verkaufsunterlagen (Oberfläche + automatischer Eingangsordner).
cd "$(dirname "$0")/../.." || exit 1
if ! command -v node >/dev/null; then
  echo "Node.js ist nicht installiert (https://nodejs.org)."; read -r; exit 1
fi
[ -d node_modules ] || npm install --omit=dev --no-audit --no-fund
exec node scripts/desktop.js "$@"
