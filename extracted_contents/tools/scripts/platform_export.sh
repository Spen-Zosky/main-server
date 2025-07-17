#!/bin/bash
set -e
OUTPUT_DIR=~/main-server/examples
INPUT_FILE="$OUTPUT_DIR/risposte_latest.json"
EXPORT_FILE="$OUTPUT_DIR/risposta_export.md"
if [ ! -f "$INPUT_FILE" ]; then
  echo "❌ Nessuna risposta trovata: $INPUT_FILE"
  exit 1
fi
python3 ~/main-server/json_to_md.py "$INPUT_FILE" > "$EXPORT_FILE"
echo "✅ Esportazione completata: $EXPORT_FILE"
