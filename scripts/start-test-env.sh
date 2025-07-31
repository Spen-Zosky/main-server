#!/bin/bash

# Start Test Environment Script
# Starts frontend test environment on port 5174

echo "🚀 Starting Test Environment..."
echo "======================================="

# Check if production environment is running
if lsof -ti:5173 > /dev/null; then
    echo "✅ Production environment detected on port 5173 (safe)"
else
    echo "⚠️  Warning: Production environment not running on port 5173"
fi

# Check if test port is free
if lsof -ti:5174 > /dev/null; then
    echo "❌ Port 5174 is already in use. Stopping existing process..."
    kill -9 $(lsof -ti:5174) 2>/dev/null || true
    sleep 2
fi

# Navigate to test frontend directory
cd "$(dirname "$0")/../src/frontend-test" || {
    echo "❌ Error: Cannot find test frontend directory"
    exit 1
}

echo "📁 Working directory: $(pwd)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start test environment using test configuration
echo "🟢 Starting frontend test server on port 5174..."
echo "🌐 Test URL: http://79.72.47.188:5174"
echo "======================================="

# Use test environment file
export NODE_ENV=test
cp .env.test .env

# Start Vite dev server with test configuration
npm run dev

echo "======================================="
echo "✅ Test environment started successfully!"
echo "📝 Production URL: http://79.72.47.188:5173 (unchanged)"
echo "🧪 Test URL: http://79.72.47.188:5174 (your playground)"