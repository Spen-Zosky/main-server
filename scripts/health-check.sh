#!/bin/bash

# Health check per tutti i servizi
SERVICES=("ai-hrms" "nose" "web-hunter")

check_service() {
    local service=$1
    local url="http://localhost:3000/health"
    
    if curl -f -s "$url" > /dev/null; then
        echo "✅ $service: OK"
    else
        echo "❌ $service: FAIL"
        return 1
    fi
}

echo "🔍 Controllo stato servizi..."
for service in "${SERVICES[@]}"; do
    check_service "$service"
done

echo "🔍 Controllo database..."
if docker exec mongodb mongo --eval "db.runCommand('ping').ok" > /dev/null 2>&1; then
    echo "✅ MongoDB: OK"
else
    echo "❌ MongoDB: FAIL"
fi

echo "🔍 Controllo Redis..."
if docker exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: OK"
else
    echo "❌ Redis: FAIL"
fi
