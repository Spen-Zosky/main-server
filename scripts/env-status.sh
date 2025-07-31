#!/bin/bash

# Environment Status Check
# Shows status of both production and test environments

echo "🌐 Environment Status Check"
echo "==========================="

# Check Production Environment (Port 5173)
echo "📍 PRODUCTION (Port 5173):"
if lsof -ti:5173 > /dev/null; then
    PID=$(lsof -ti:5173)
    echo "   ✅ Running (PID: $PID)"
    if curl -f http://79.72.47.188:5173 > /dev/null 2>&1; then
        echo "   🌐 Accessible: http://79.72.47.188:5173"
    else
        echo "   ⚠️  Process running but not responding"
    fi
else
    echo "   ❌ Not running"
fi

echo ""

# Check Test Environment (Port 5174)
echo "🧪 TEST (Port 5174):"
if lsof -ti:5174 > /dev/null; then
    PID=$(lsof -ti:5174)
    echo "   ✅ Running (PID: $PID)"
    if curl -f http://79.72.47.188:5174 > /dev/null 2>&1; then
        echo "   🌐 Accessible: http://79.72.47.188:5174"
    else
        echo "   ⚠️  Process running but not responding"
    fi
else
    echo "   ❌ Not running"
fi

echo ""

# Check Backend
echo "🔧 BACKEND (Port 3000):"
if lsof -ti:3000 > /dev/null; then
    PID=$(lsof -ti:3000)
    echo "   ✅ Running (PID: $PID)"
    if curl -f http://79.72.47.188:3000/health > /dev/null 2>&1; then
        echo "   🌐 Accessible: http://79.72.47.188:3000/health"
    else
        echo "   ⚠️  Process running but not responding"
    fi
else
    echo "   ❌ Not running"
fi

echo ""

# Quick commands reminder
echo "🚀 Quick Commands:"
echo "   Start Test:       ./start-test-env.sh"
echo "   Sync from Prod:   ./sync-from-production.sh"  
echo "   Promote to Prod:  ./promote-to-production.sh"
echo "   Stop Test:        kill \$(lsof -ti:5174)"
echo ""
echo "🌐 URLs:"
echo "   Production: http://79.72.47.188:5173"
echo "   Test:       http://79.72.47.188:5174"
echo "   Backend:    http://79.72.47.188:3000/health"