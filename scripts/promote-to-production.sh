#!/bin/bash

# Promote Test Changes to Production
# CAREFUL: This replaces production with test environment changes

echo "⚠️  PROMOTE TO PRODUCTION - DANGEROUS OPERATION"
echo "=================================================="
echo "This will replace production interfaces with test changes!"
echo "Production URL: http://79.72.47.188:5173"
echo ""

# Safety confirmation
read -p "Are you ABSOLUTELY sure? Type 'PROMOTE' to continue: " confirm
if [ "$confirm" != "PROMOTE" ]; then
    echo "❌ Operation cancelled for safety"
    exit 1
fi

echo ""
echo "🔄 Starting promotion process..."

# Get directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$(dirname "$SCRIPT_DIR")/src/frontend-test"
PROD_DIR="/home/ubuntu/main-server/src/frontend"

echo "📁 Test Source: $TEST_DIR"
echo "📁 Production Target: $PROD_DIR"

# Create production backup FIRST
PROD_BACKUP_DIR="/home/ubuntu/main-server/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PROD_BACKUP_FILE="$PROD_BACKUP_DIR/production-backup-before-promotion-$TIMESTAMP.tar.gz"

echo "💾 Creating CRITICAL production backup..."
mkdir -p "$PROD_BACKUP_DIR"
cd "$PROD_DIR" || exit 1
tar -czf "$PROD_BACKUP_FILE" --exclude=node_modules --exclude=dist . 2>/dev/null
echo "✅ Production backup: $PROD_BACKUP_FILE"

# Stop production frontend if running
if lsof -ti:5173 > /dev/null; then
    echo "🛑 Stopping production frontend..."
    kill -9 $(lsof -ti:5173) 2>/dev/null || true
    sleep 3
fi

# Test environment must be working before promotion
echo "🧪 Verifying test environment works..."
if ! curl -f http://79.72.47.188:5174 > /dev/null 2>&1; then
    echo "❌ Test environment not responding! Aborting promotion."
    echo "   Start test environment first: ./start-test-env.sh"
    exit 1
fi
echo "✅ Test environment verified working"

# Sync from test to production
echo "🔄 Promoting test changes to production..."

# Sync source code
rsync -av --exclude=node_modules --exclude=dist --exclude=backups \
    "$TEST_DIR/src/" "$PROD_DIR/src/" || {
    echo "❌ Error: Failed to sync src directory"
    exit 1
}

# Sync configuration files but restore production-specific settings
cp "$TEST_DIR/package.json" "$PROD_DIR/package-temp.json"
# Restore production package.json settings
sed 's/"main-server-frontend-test"/"main-server-frontend"/' "$PROD_DIR/package-temp.json" > "$PROD_DIR/package.json"
sed -i 's/6007/6006/' "$PROD_DIR/package.json"
rm "$PROD_DIR/package-temp.json"

# Copy other updated files
cp "$TEST_DIR/index.html" "$PROD_DIR/"
cp "$TEST_DIR/postcss.config.js" "$PROD_DIR/"
cp "$TEST_DIR/tailwind.config.js" "$PROD_DIR/"

# Restore production vite.config.js (port 5173)
cat > "$PROD_DIR/vite.config.js" << 'EOF'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determine backend URL - auto-detect IP if not specified
  const getBackendURL = () => {
    if (env.VITE_API_BASE_URL) {
      return env.VITE_API_BASE_URL.replace('/api/v1', '')
    }
    
    // Auto-detect server IP from environment - VM private IP preferred
    const serverIP = env.SERVER_IP || env.VM_PRIVATE_IP || env.VM_PUBLIC_IP || 'localhost'
    const backendPort = env.BACKEND_PORT || '3000'
    return `http://${serverIP}:${backendPort}`
  }

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.FRONTEND_PORT) || 5173,
      host: '0.0.0.0', // Allow external access
      strictPort: true,
      // Serve static homepage at root
      middlewareMode: false,
      proxy: {
        '/api': {
          target: getBackendURL(),
          changeOrigin: true,
          secure: false
        },
      }
    },
    // Configura la homepage statica
    publicDir: 'public',
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            charts: ['chart.js', 'react-chartjs-2', 'd3']
          }
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  }
})
EOF

echo "📦 Installing production dependencies..."
cd "$PROD_DIR" || exit 1
npm install

echo "🏗️  Building production..."
npm run build

echo "🚀 Starting production environment..."
nohup npm run dev > /dev/null 2>&1 &
sleep 5

# Verify production is working
if curl -f http://79.72.47.188:5173 > /dev/null 2>&1; then
    echo "=================================================="
    echo "✅ PROMOTION SUCCESSFUL!"
    echo "🌐 Production URL: http://79.72.47.188:5173"
    echo "🧪 Test URL: http://79.72.47.188:5174 (still available)"
    echo "💾 Backup saved: $PROD_BACKUP_FILE"
    echo ""
    echo "🎉 Your test changes are now LIVE in production!"
else
    echo "❌ Production not responding after promotion!"
    echo "💾 Backup available for recovery: $PROD_BACKUP_FILE"
    exit 1
fi