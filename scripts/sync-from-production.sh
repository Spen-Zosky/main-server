#!/bin/bash

# Sync from Production to Test Environment
# Copies working interfaces from production to test environment

echo "🔄 Syncing from Production to Test Environment..."
echo "=================================================="

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$(dirname "$SCRIPT_DIR")/src/frontend-test"
PROD_DIR="/home/ubuntu/main-server/src/frontend"

echo "📁 Production: $PROD_DIR"
echo "📁 Test: $TEST_DIR"

# Create backup of current test state
BACKUP_DIR="$TEST_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/test-backup-$TIMESTAMP.tar.gz"

echo "💾 Creating backup of test environment..."
mkdir -p "$BACKUP_DIR"
cd "$TEST_DIR" || exit 1
tar -czf "$BACKUP_FILE" --exclude=node_modules --exclude=dist --exclude=backups . 2>/dev/null
echo "✅ Backup created: $BACKUP_FILE"

# Stop test environment if running
if lsof -ti:5174 > /dev/null; then
    echo "🛑 Stopping test environment..."
    kill -9 $(lsof -ti:5174) 2>/dev/null || true
    sleep 2
fi

# Sync specific directories/files from production
echo "🔄 Syncing components and pages..."

# Sync core application files
rsync -av --exclude=node_modules --exclude=dist --exclude=backups \
    "$PROD_DIR/src/" "$TEST_DIR/src/" || {
    echo "❌ Error: Failed to sync src directory"
    exit 1
}

# Sync configuration files but preserve test-specific settings
cp "$PROD_DIR/package.json" "$TEST_DIR/package-temp.json"
# Update package.json with test-specific changes
sed 's/"main-server-frontend"/"main-server-frontend-test"/' "$TEST_DIR/package-temp.json" > "$TEST_DIR/package.json"
sed -i 's/6006/6007/' "$TEST_DIR/package.json"
rm "$TEST_DIR/package-temp.json"

# Copy other config files
cp "$PROD_DIR/index.html" "$TEST_DIR/"
cp "$PROD_DIR/postcss.config.js" "$TEST_DIR/"
cp "$PROD_DIR/tailwind.config.js" "$TEST_DIR/"

# Preserve test-specific vite.config.js and .env
echo "⚙️  Preserving test-specific configurations..."
# vite.config.js already has test port 5174
# .env.test already configured

echo "📦 Installing/updating dependencies..."
cd "$TEST_DIR" || exit 1
npm install

# Restore test environment configuration
cp .env.test .env

echo "=================================================="
echo "✅ Sync completed successfully!"
echo "📝 Production URL: http://79.72.47.188:5173 (unchanged)"
echo "🧪 Test URL ready: http://79.72.47.188:5174"
echo "💾 Backup saved: $BACKUP_FILE"
echo ""
echo "🚀 To start test environment:"
echo "   cd $(dirname "$SCRIPT_DIR")/scripts"
echo "   ./start-test-env.sh"