#!/bin/bash

# Script per configurare automaticamente il file .env

set -e

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
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

# Funzione per sostituire in modo sicuro (evita problemi con caratteri speciali)
safe_replace() {
    local file="$1"
    local old_pattern="$2"
    local new_value="$3"
    
    # Crea file temporaneo
    local temp_file=$(mktemp)
    
    # Sostituisci usando awk (più sicuro di sed per caratteri speciali)
    awk -v old="$old_pattern" -v new="$new_value" '{gsub(old, new); print}' "$file" > "$temp_file"
    
    # Sostituisci il file originale
    mv "$temp_file" "$file"
}

configure_env() {
    print_step "Configurazione file .env..."
    
    # Verifica se esiste .env.example
    if [ ! -f ".env.example" ]; then
        print_error "File .env.example non trovato!"
        echo "Assicurati di aver eseguito prima il setup base"
        exit 1
    fi
    
    # Copia .env.example in .env
    cp .env.example .env
    print_success "File .env copiato da .env.example"
    
    # Genera JWT secret casuale
    print_step "Generazione JWT secret..."
    JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    
    # Genera password MongoDB casuale
    print_step "Generazione password MongoDB..."
    MONGO_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/\n" | cut -c1-16)
    
    # Chiedi all'utente le preferenze
    echo ""
    echo "🔧 CONFIGURAZIONE PERSONALIZZATA"
    echo "================================="
    
    # Nome del progetto
    read -p "📁 Nome del progetto [main-server]: " PROJECT_NAME
    PROJECT_NAME=${PROJECT_NAME:-main-server}
    
    # Porta
    read -p "🌐 Porta del server [3000]: " PORT
    PORT=${PORT:-3000}
    
    # Ambiente
    echo ""
    echo "🚀 Ambiente di sviluppo:"
    echo "1) development (default)"
    echo "2) production"
    echo "3) staging"
    read -p "Scegli (1-3) [1]: " ENV_CHOICE
    
    case $ENV_CHOICE in
        2) NODE_ENV="production" ;;
        3) NODE_ENV="staging" ;;
        *) NODE_ENV="development" ;;
    esac
    
    # Log level
    echo ""
    echo "📊 Livello di log:"
    echo "1) info (default)"
    echo "2) debug"
    echo "3) warn"
    echo "4) error"
    read -p "Scegli (1-4) [1]: " LOG_CHOICE
    
    case $LOG_CHOICE in
        2) LOG_LEVEL="debug" ;;
        3) LOG_LEVEL="warn" ;;
        4) LOG_LEVEL="error" ;;
        *) LOG_LEVEL="info" ;;
    esac
    
    # Sostituisci i valori nel file .env usando il metodo sicuro
    print_step "Applicazione configurazioni..."
    
    # Sostituisci JWT_SECRET
    safe_replace ".env" "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" "JWT_SECRET=$JWT_SECRET"
    
    # Sostituisci MONGO_ROOT_PASSWORD
    safe_replace ".env" "MONGO_ROOT_PASSWORD=changeme123" "MONGO_ROOT_PASSWORD=$MONGO_PASSWORD"
    
    # Sostituisci MONGO_URI con nome progetto
    safe_replace ".env" "MONGO_URI=mongodb://mongo:27017/myapp" "MONGO_URI=mongodb://mongo:27017/$PROJECT_NAME"
    
    # Sostituisci PORT
    safe_replace ".env" "PORT=3000" "PORT=$PORT"
    
    # Sostituisci NODE_ENV
    safe_replace ".env" "NODE_ENV=development" "NODE_ENV=$NODE_ENV"
    
    # Sostituisci LOG_LEVEL
    safe_replace ".env" "LOG_LEVEL=info" "LOG_LEVEL=$LOG_LEVEL"
    
    print_success "Configurazioni applicate!"
    
    # Mostra il risultato
    echo ""
    echo "📋 CONFIGURAZIONE FINALE:"
    echo "========================="
    echo "🏷️  Progetto: $PROJECT_NAME"
    echo "🌐 Porta: $PORT"
    echo "🚀 Ambiente: $NODE_ENV"
    echo "📊 Log Level: $LOG_LEVEL"
    echo "🔑 JWT Secret: [GENERATO - $(echo $JWT_SECRET | cut -c1-20)...]"
    echo "🔒 MongoDB Password: [GENERATO - $(echo $MONGO_PASSWORD | cut -c1-8)...]"
    echo ""
    
    # Mostra contenuto completo del file .env (mascherando i segreti)
    echo "📄 CONTENUTO FILE .env:"
    echo "======================="
    sed 's/\(JWT_SECRET=\).*/\1[NASCOSTO]/g; s/\(MONGO_ROOT_PASSWORD=\).*/\1[NASCOSTO]/g' .env
    echo ""
    
    # Opzione per modificare manualmente
    read -p "Vuoi modificare manualmente il file .env? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Apertura editor..."
        ${EDITOR:-nano} .env
        print_success "File .env modificato"
    fi
    
    # Verifica finale
    print_step "Verifica configurazione..."
    if [ -f ".env" ] && [ -s ".env" ]; then
        print_success "File .env configurato correttamente!"
        
        # Crea backup
        cp .env .env.backup
        print_info "Backup creato in .env.backup"
        
        # Avviso sicurezza
        echo ""
        echo "⚠️  SICUREZZA:"
        echo "==============="
        echo "• Il file .env contiene informazioni sensibili"
        echo "• Non committare mai il file .env in Git"
        echo "• Mantieni sicure le password generate"
        echo "• Cambia le password in produzione"
        echo ""
        
        # Aggiungi .env al .gitignore se non c'è
        if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
            echo ".env" >> .gitignore
            print_success ".env aggiunto al .gitignore"
        fi
        
    else
        print_error "Problema nella configurazione del file .env"
        exit 1
    fi
}

# Funzione per mostrare il contenuto attuale
show_current_env() {
    if [ -f ".env" ]; then
        echo "📄 CONFIGURAZIONE ATTUALE:"
        echo "=========================="
        # Mostra .env mascherando i valori sensibili
        sed 's/\(JWT_SECRET=\).*/\1[NASCOSTO]/g; s/\(MONGO_ROOT_PASSWORD=\).*/\1[NASCOSTO]/g' .env
        echo ""
    else
        print_info "File .env non trovato"
    fi
}

# Funzione per reset
reset_env() {
    print_step "Reset configurazione..."
    
    if [ -f ".env.backup" ]; then
        read -p "Vuoi ripristinare dal backup? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp .env.backup .env
            print_success "Configurazione ripristinata dal backup"
            return
        fi
    fi
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Configurazione ripristinata da .env.example"
    else
        print_error "Impossibile ripristinare: .env.example non trovato"
    fi
}

# Menu principale
show_menu() {
    echo "=================================="
    echo "🔧 CONFIGURAZIONE FILE .env"
    echo "=================================="
    echo ""
    echo "1) 📝 Configura .env (automatico)"
    echo "2) ✏️  Modifica .env (manuale)"
    echo "3) 👁️  Mostra configurazione attuale"
    echo "4) 🔄 Reset configurazione"
    echo "5) 🧪 Testa configurazione"
    echo ""
    echo "0) ❌ Esci"
    echo ""
}

# Test configurazione
test_configuration() {
    print_step "Test configurazione..."
    
    if [ ! -f ".env" ]; then
        print_error "File .env non trovato!"
        return 1
    fi
    
    # Carica variabili
    source .env
    
    # Test variabili obbligatorie
    local errors=0
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secret-jwt-key-change-this-in-production" ]; then
        print_error "JWT_SECRET non configurato correttamente"
        errors=$((errors + 1))
    fi
    
    if [ -z "$MONGO_ROOT_PASSWORD" ] || [ "$MONGO_ROOT_PASSWORD" = "changeme123" ]; then
        print_error "MONGO_ROOT_PASSWORD non configurato correttamente"
        errors=$((errors + 1))
    fi
    
    if [ -z "$MONGO_URI" ]; then
        print_error "MONGO_URI non configurato"
        errors=$((errors + 1))
    fi
    
    if [ -z "$PORT" ]; then
        print_error "PORT non configurato"
        errors=$((errors + 1))
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "Configurazione valida!"
        echo ""
        echo "✅ Tutte le variabili sono configurate correttamente"
        echo "🌐 Server sarà avviato sulla porta: $PORT"
        echo "🏷️  Database: $(echo $MONGO_URI | sed 's/.*\///g')"
        echo "🚀 Ambiente: $NODE_ENV"
    else
        print_error "Trovati $errors errori nella configurazione"
        echo "Risolvi i problemi e riprova"
    fi
}

# Loop principale
main() {
    while true; do
        show_menu
        read -p "Scegli un'opzione (0-5): " choice
        
        case $choice in
            1) configure_env ;;
            2) 
                if [ -f ".env" ]; then
                    ${EDITOR:-nano} .env
                    print_success "File .env modificato"
                else
                    print_error "File .env non trovato. Esegui prima la configurazione automatica"
                fi
                ;;
            3) show_current_env ;;
            4) reset_env ;;
            5) test_configuration ;;
            0) 
                print_info "Configurazione terminata!"
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
