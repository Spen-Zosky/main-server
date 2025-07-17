#!/bin/bash

# Function to handle errors
handle_error() {
  echo "Error occurred at line $1"
  exit 1
}

# Trap errors
trap 'handle_error $LINENO' ERR

# Function to print progress
print_progress() {
  echo "🚀 $1"
}

print_progress "Inizializzazione miglioramenti piattaforma..."

# Crea tutte le directory necessarie PRIMA di creare i file
print_progress "Creazione struttura directory..."
mkdir -p scripts
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources
mkdir -p .github/workflows
mkdir -p logs
mkdir -p backup

# 1. Aggiungi supporto per environment variables
print_progress "Configurazione environment variables..."
cat << 'EOF' > .env.example
# Database
MONGO_URI=mongodb://mongo:27017/myapp
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=changeme123

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://redis:6379

# Server
NODE_ENV=development
PORT=3000

# Logging
LOG_LEVEL=info

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
EOF

# 2. Aggiungi docker-compose per produzione
print_progress "Creazione docker-compose.prod.yml..."
cat << 'EOF' > docker-compose.prod.yml
version: '3.8'
services:
  traefik:
    image: traefik:v2.9
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@yourdomain.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.localhost`)"
      - "traefik.http.routers.traefik.entrypoints=web"

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:5.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongo localhost:27017/test --quiet
      interval: 30s
      timeout: 10s
      retries: 3

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.prometheus.rule=Host(`prometheus.localhost`)"
      - "traefik.http.routers.prometheus.entrypoints=web"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana:/etc/grafana/provisioning
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.grafana.rule=Host(`grafana.localhost`)"
      - "traefik.http.routers.grafana.entrypoints=web"

  # AI-HRMS
  ai-hrms-backend:
    build: ./apps/ai-hrms/backend
    environment:
      - MONGO_URI=mongodb://mongodb:27017/ai-hrms
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
      - redis
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ai-hrms-api.rule=Host(`localhost`) && PathPrefix(`/api/ai-hrms`)"
      - "traefik.http.routers.ai-hrms-api.entrypoints=web"

  ai-hrms-frontend:
    build: ./apps/ai-hrms/frontend
    environment:
      - REACT_APP_API_URL=http://localhost/api/ai-hrms
    depends_on:
      - ai-hrms-backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ai-hrms.rule=Host(`ai-hrms.localhost`)"
      - "traefik.http.routers.ai-hrms.entrypoints=web"

  # NOSE
  nose-backend:
    build: ./apps/nose/backend
    environment:
      - MONGO_URI=mongodb://mongodb:27017/nose
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
      - redis
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nose-api.rule=Host(`localhost`) && PathPrefix(`/api/nose`)"
      - "traefik.http.routers.nose-api.entrypoints=web"

  nose-frontend:
    build: ./apps/nose/frontend
    environment:
      - REACT_APP_API_URL=http://localhost/api/nose
    depends_on:
      - nose-backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nose.rule=Host(`nose.localhost`)"
      - "traefik.http.routers.nose.entrypoints=web"

  # Web-Hunter
  web-hunter-backend:
    build: ./apps/web-hunter/backend
    environment:
      - MONGO_URI=mongodb://mongodb:27017/web-hunter
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
      - redis
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web-hunter-api.rule=Host(`localhost`) && PathPrefix(`/api/web-hunter`)"
      - "traefik.http.routers.web-hunter-api.entrypoints=web"

  web-hunter-frontend:
    build: ./apps/web-hunter/frontend
    environment:
      - REACT_APP_API_URL=http://localhost/api/web-hunter
    depends_on:
      - web-hunter-backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web-hunter.rule=Host(`web-hunter.localhost`)"
      - "traefik.http.routers.web-hunter.entrypoints=web"

volumes:
  redis_data:
  mongo_data:
  prometheus_data:
  grafana_data:
EOF

# 3. Crea struttura per monitoraggio
print_progress "Configurazione monitoraggio..."

cat << 'EOF' > monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'main-server'
    static_configs:
      - targets: ['localhost:3000']
  
  - job_name: 'ai-hrms'
    static_configs:
      - targets: ['ai-hrms-backend:3000']
  
  - job_name: 'nose'
    static_configs:
      - targets: ['nose-backend:3000']
  
  - job_name: 'web-hunter'
    static_configs:
      - targets: ['web-hunter-backend:3000']
EOF

# Grafana datasource
cat << 'EOF' > monitoring/grafana/datasources/prometheus.yml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF

# 4. Aggiungi GitHub Actions
print_progress "Configurazione CI/CD..."

cat << 'EOF' > .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [ai-hrms, nose, web-hunter]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd apps/${{ matrix.app }}/backend
        npm ci
    
    - name: Run tests
      run: |
        cd apps/${{ matrix.app }}/backend
        npm test
    
    - name: Run linting
      run: |
        cd apps/${{ matrix.app }}/backend
        npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: yourorg/main-server:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Add your deployment commands here
EOF

# 5. Aggiungi script di backup
print_progress "Creazione script di backup..."
cat << 'EOF' > scripts/backup.sh
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
EOF

# 6. Aggiungi script di health check
print_progress "Creazione health check..."
cat << 'EOF' > scripts/health-check.sh
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
EOF

# 7. Aggiungi configurazione ESLint
print_progress "Configurazione ESLint..."
cat << 'EOF' > .eslintrc.js
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'react/prop-types': 'off',
  },
};
EOF

# 8. Aggiungi configurazione Prettier
print_progress "Configurazione Prettier..."
cat << 'EOF' > .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF

# 9. Crea script di sviluppo migliorato
print_progress "Creazione script di sviluppo..."
cat << 'EOF' > scripts/dev.sh
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
EOF

# 10. Crea documentazione API
print_progress "Creazione documentazione API..."
mkdir -p docs/api

cat << 'EOF' > docs/api/README.md
# API Documentation

## Endpoints Comuni

### Autenticazione
- `POST /auth/login` - Login utente
- `POST /auth/register` - Registrazione utente
- `POST /auth/refresh` - Rinnovo token
- `POST /auth/logout` - Logout utente

### Health Check
- `GET /health` - Stato del servizio
- `GET /metrics` - Metriche Prometheus

### Utenti
- `GET /users` - Lista utenti
- `GET /users/:id` - Dettaglio utente
- `PUT /users/:id` - Aggiornamento utente
- `DELETE /users/:id` - Eliminazione utente

## Applicazioni Specifiche

### AI-HRMS
- `GET /api/ai-hrms/employees` - Lista dipendenti
- `POST /api/ai-hrms/employees` - Creazione dipendente

### NOSE
- `GET /api/nose/networks` - Lista reti
- `GET /api/nose/alerts` - Lista alert

### Web-Hunter
- `GET /api/web-hunter/searches` - Lista ricerche
- `POST /api/web-hunter/search` - Nuova ricerca
EOF

# 11. Rendi eseguibili tutti gli script
print_progress "Impostazione permessi script..."
chmod +x scripts/*.sh

# 12. Crea .gitignore migliorato
print_progress "Creazione .gitignore..."
cat << 'EOF' > .gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Docker
.dockerignore

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Backup
backup/
*.tar.gz

# SSL certificates
letsencrypt/
EOF

print_progress "✅ Miglioramenti completati!"
echo ""
echo "📋 Prossimi passi:"
echo "1. Copia .env.example in .env e configura le variabili"
echo "2. Esegui: docker-compose -f docker-compose.prod.yml up -d"
echo "3. Configura i secrets GitHub per CI/CD"
echo "4. Testa con: ./scripts/health-check.sh"
echo "5. Avvia sviluppo con: ./scripts/dev.sh ai-hrms"
echo ""
echo "🔧 Strumenti disponibili:"
echo "- Prometheus: http://localhost:9090"
echo "- Grafana: http://localhost:3001 (admin/admin)"
echo "- Traefik Dashboard: http://localhost:8080"
