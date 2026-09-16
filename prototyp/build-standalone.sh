#!/bin/sh
# Erzeugt aus der Artifact-Quelle eine eigenständige HTML-Datei, die sich lokal
# im Browser öffnen lässt. Die Artifact-Veröffentlichung ergänzt diese Hülle
# selbst; ohne sie fehlen Zeichensatz und Viewport-Angabe.
set -e
QUELLE="${1:-leerstandsmanager.html}"
ZIEL="${2:-Leerstandsmanager.html}"
{
  echo '<!doctype html>'
  echo '<html lang="de-CH">'
  echo '<head>'
  echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  echo '<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'
  cat "$QUELLE"
  echo '</head>'
  echo '<body></body>'
  echo '</html>'
} > "$ZIEL"
echo "$ZIEL erstellt ($(wc -c < "$ZIEL") Bytes)"
