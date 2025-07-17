#!/bin/bash

# Script di Setup Graduale per Main Server Platform
# Perfetto per chi sta iniziando lo sviluppo

set -e

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}🎯 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Menu principale
show_menu() {
    clear
    echo "=================================="
    echo "🚀 MAIN SERVER SETUP GRADUALE"
    echo "=================================="
    echo ""
    echo "Scegli cosa fare:"
    echo ""
    echo "SETUP INIZIALE:"
    echo "1) 📁 Setup base (cartelle e file)"
    echo "2) 🔧 Configurazione ambiente"
    echo "3) 🐳 Avvia servizi base (MongoDB, Redis)"
    echo ""
    echo "SVILUPPO:"
    echo "4) 💻 Sviluppa AI-HRMS"
    echo "5) 💻 Sviluppa NOSE"
    echo "6) 💻 Sviluppa Web-Hunter"
    echo ""
    echo "MONITORING (quando pronto):"
    echo "7) 📊 Attiva monitoring"
    echo "8) 🔍 Health check"
    echo ""
    echo "UTILITY:"
    echo "9) 📋 Stato sistema"
    echo "10) 🛑 Ferma tutto"
    echo "11) 🗑️  Pulisci tutto"
    echo ""
    echo "0) ❌ Esci"
    echo ""
}

# 1. Setup base
setup_base() {
    print_step "Setup base in corso..."
    
    # Esegui lo script di platform improvements
    if [ -f "platform_improvements.sh" ]; then
        ./platform_improvements.sh
        print_success "Setup base completato"
    else
        print_error "File platform_improvements.sh non trovato"
        echo "Crealo prima usando l'artifact fornito"
        return 1
    fi
}

# 2. Configurazione ambiente
setup_environment() {
    print_step "Configurazione ambiente..."
    
    # Crea .env se non esiste
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            
            # Genera secrets casuali
            JWT_SECRET=$(openssl rand -base64 32)
            MONGO_PASSWORD=$(openssl rand -base64 16)
            
            # Sostituisci i placeholder
            sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/g" .env
            sed -i "s/changeme123/$MONGO_PASSWORD/g" .env
            
            print_success "File .env creato con secrets generati"
        else
            print_error ".env.example non trovato. Esegui prima il setup base"
            return 1
        fi
    else
        print_info "File .env già esistente"
    fi
    
    echo ""
    echo "🔧 Configurazione attuale:"
    echo "========================="
    grep -E "^[^#]" .env 2>/dev/null || echo "Nessuna configurazione trovata"
    echo ""
    
    read -p "Vuoi modificare il file .env? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env
        print_success "Configurazione aggiornata"
    fi
}

# 3. Avvia servizi base
start_base_services() {
    print_step "Avvio servizi base..."
    
    # Crea docker-compose per servizi base
    cat << 'EOF' > docker-compose.base.yml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    container_name: main-server-mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME:-admin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-changeme123}
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongo localhost:27017/test --quiet
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:alpine
    container_name: main-server-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mongo_data:
  redis_data:
EOF

    # Avvia i servizi
    docker-compose -f docker-compose.base.yml up -d
    
    print_info "Attendendo che i servizi si avviino..."
    sleep 10
    
    # Verifica stato
    if docker ps | grep -q "main-server-mongo"; then
        print_success "MongoDB: Attivo"
    else
        print_error "MongoDB: Problemi di avvio"
    fi
    
    if docker ps | grep -q "main-server-redis"; then
        print_success "Redis: Attivo"
    else
        print_error "Redis: Problemi di avvio"
    fi
}

# 4-6. Sviluppo applicazioni
develop_app() {
    local app_name=$1
    print_step "Sviluppo $app_name..."
    
    if [ ! -d "apps/$app_name" ]; then
        print_error "Applicazione $app_name non trovata"
        return 1
    fi
    
    cd "apps/$app_name"
    
    echo ""
    echo "🚀 Modalità di sviluppo:"
    echo "1) 🐳 Docker (raccomandato per principianti)"
    echo "2) 💻 Locale (Node.js diretto)"
    echo ""
    read -p "Scegli modalità (1-2): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_info "Avvio $app_name in modalità Docker..."
            docker-compose up --build
            ;;
        2)
            print_info "Avvio $app_name in modalità locale..."
            
            # Backend
            echo "🔧 Avvio backend..."
            cd backend
            npm install
            npm run dev &
            BACKEND_PID=$!
            
            # Frontend
            echo "🔧 Avvio frontend..."
            cd ../frontend
            npm install
            npm start &
            FRONTEND_PID=$!
            
            print_success "$app_name avviato in modalità locale"
            print_info "Backend PID: $BACKEND_PID"
            print_info "Frontend PID: $FRONTEND_PID"
            print_info "Premi Ctrl+C per terminare"
            
            # Aspetta terminazione
            wait $BACKEND_PID $FRONTEND_PID
            ;;
        *)
            print_error "Scelta non valida"
            ;;
    esac
    
    cd "../.."
}

# 7. Attiva monitoring
activate_monitoring() {
    print_step "Attivazione monitoring..."
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "docker-compose.prod.yml non trovato. Esegui prima il setup base"
        return 1
    fi
    
    # Avvia solo i servizi di monitoring
    docker-compose -f docker-compose.prod.yml up -d prometheus grafana
    
    print_info "Attendendo che i servizi di monitoring si avviino..."
    sleep 15
    
    print_success "Monitoring attivato!"
    echo ""
    echo "🔗 Accesso:"
    echo "- Prometheus: http://localhost:9090"
    echo "- Grafana: http://localhost:3001 (admin/admin)"
}

# 8. Health check
health_check() {
    print_step "Controllo stato sistema..."
    
    if [ -f "scripts/health-check.sh" ]; then
        ./scripts/health-check.sh
    else
        print_info "Script health-check.sh non trovato, controllo manuale..."
        
        echo ""
        echo "🐳 Container attivi:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        echo ""
        echo "🌐 Test connettività:"
        
        # Test MongoDB
        if docker exec main-server-mongo mongo --eval "db.runCommand('ping').ok" &>/dev/null; then
            print_success "MongoDB: Connesso"
        else
            print_error "MongoDB: Non raggiungibile"
        fi
        
        # Test Redis
        if docker exec main-server-redis redis-cli ping &>/dev/null; then
            print_success "Redis: Connesso"
        else
            print_error "Redis: Non raggiungibile"
        fi
    fi
}

# 9. Stato sistema
show_status() {
    print_step "Stato sistema completo..."
    
    echo ""
    echo "📊 RISORSE SISTEMA:"
    echo "==================="
    echo "💾 Spazio disco:"
    df -h / | tail -1
    echo "🖥️  Memoria:"
    free -h | head -2
    echo "🔧 CPU:"
    top -bn1 | grep "Cpu(s)" | head -1
    
    echo ""
    echo "🐳 CONTAINER DOCKER:"
    echo "===================="
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo "💾 VOLUMI DOCKER:"
    echo "================="
    docker volume ls
    
    echo ""
    echo "🌐 PORTE IN ASCOLTO:"
    echo "===================="
    netstat -tulpn | grep -E ":27017|:6379|:3000|:3001|:9090|:80|:8080" 2>/dev/null || echo "Nessuna porta rilevata"
    
    echo ""
    echo "📁 STRUTTURA PROGETTO:"
    echo "======================"
    tree -L 3 . 2>/dev/null || find . -type d -name ".*" -prune -o -type d -print | head -20
}

# 10. Ferma tutto
stop_all() {
    print_step "Arresto di tutti i servizi..."
    
    # Ferma tutti i docker-compose
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.base.yml down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    # Ferma container specifici
    docker stop main-server-mongo main-server-redis 2>/dev/null || true
    
    print_success "Tutti i servizi fermati"
}

# 11. Pulisci tutto
clean_all() {
    print_step "Pulizia completa..."
    
    echo "⚠️  ATTENZIONE: Questa operazione eliminerà:"
    echo "- Tutti i container Docker"
    echo "- Tutti i volumi Docker (DATI PERMANENTI)"
    echo "- Tutte le immagini Docker non utilizzate"
    echo ""
    read -p "Sei sicuro? Digita 'CONFIRM' per procedere: " confirm
    
    if [ "$confirm" = "CONFIRM" ]; then
        # Ferma tutto
        stop_all
        
        # Rimuovi container
        docker rm -f $(docker ps -aq) 2>/dev/null || true
        
        # Rimuovi volumi
        docker volume prune -f
        
        # Rimuovi immagini non utilizzate
        docker image prune -f
        
        print_success "Pulizia completata"
    else
        print_info "Pulizia annullata"
    fi
}

# Loop principale
main() {
    while true; do
        show_menu
        read -p "Scegli un'opzione (0-11): " choice
        
        case $choice in
            1) setup_base ;;
            2) setup_environment ;;
            3) start_base_services ;;
            4) develop_app "ai-hrms" ;;
            5) develop_app "nose" ;;
            6) develop_app "web-hunter" ;;
            7) activate_monitoring ;;
            8) health_check ;;
            9) show_status ;;
            10) stop_all ;;
            11) clean_all ;;
            0) 
                print_info "Arrivederci!"
                exit 0
                ;;
            *)
                print_error "Scelta non valida"
                ;;
        esac
        
        echo ""
        read -p "Premi ENTER per continuare..." -r
    done
}

# Esegui se chiamato direttamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
