#!/bin/bash

# Script per sviluppo con hot reload
APP_NAME=${1:-"ai-hrms"}

if [ ! -d "apps/$APP_NAME" ]; then
    echo "❌ Applicazione '$APP_NAME' non trovata"
    echo "Applicazioni disponibili:"
    ls -1 apps/
    exit 1
fi

echo "🚀 Avvio sviluppo per $APP_NAME..."

# Avvia i servizi di supporto
docker-compose up -d mongodb redis

# Avvia l'applicazione in modalità sviluppo
cd "apps/$APP_NAME"
docker-compose up --build

echo "✅ Sviluppo avviato per $APP_NAME"
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:80"
