#!/bin/bash

# Script di backup per MongoDB
BACKUP_DIR="/backup/$(date +%Y%m%d_%H%M%S)"
MONGO_CONTAINER=$(docker ps --filter "ancestor=mongo" --format "{{.Names}}" | head -1)

if [ -z "$MONGO_CONTAINER" ]; then
    echo "❌ Container MongoDB non trovato"
    exit 1
fi

echo "📦 Creazione backup MongoDB..."
docker exec $MONGO_CONTAINER mongodump --out $BACKUP_DIR

echo "🗜️ Compressione backup..."
tar -czf "$BACKUP_DIR.tar.gz" -C "/backup" "$(basename $BACKUP_DIR)"
rm -rf "$BACKUP_DIR"

echo "✅ Backup completato: $BACKUP_DIR.tar.gz"
