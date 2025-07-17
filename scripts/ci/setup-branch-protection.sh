#!/bin/bash

# Script per configurare branch protection su GitHub

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

# Verifica GitHub CLI
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) non installato. Installalo con: sudo apt install gh"
    exit 1
fi

# Verifica autenticazione
if ! gh auth status &> /dev/null; then
    print_error "GitHub CLI non autenticato. Esegui: gh auth login"
    exit 1
fi

print_step "Configurazione Branch Protection Rules..."

# Configura protezione per main branch
gh api repos/Spen-Zosky/main-server/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["🔍 Code Quality","🔒 Security Scan","📝 Commit Convention Check"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

print_success "Branch protection configurato per main!"

# Configura protezione per develop branch
gh api repos/Spen-Zosky/main-server/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["🔍 Code Quality","🔒 Security Scan"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

print_success "Branch protection configurato per develop!"

# Configura Environments
print_step "Configurazione Environments..."

# Staging Environment
gh api repos/Spen-Zosky/main-server/environments/staging \
  --method PUT \
  --field wait_timer=0 \
  --field reviewers='[]' \
  --field deployment_branch_policy='{"protected_branches":false,"custom_branch_policies":true}'

# Production Environment
gh api repos/Spen-Zosky/main-server/environments/production \
  --method PUT \
  --field wait_timer=300 \
  --field reviewers='[{"type":"User","id":YOUR_USER_ID}]' \
  --field deployment_branch_policy='{"protected_branches":true,"custom_branch_policies":false}'

print_success "Environments configurati!"

print_step "Configurazione completata!"
echo ""
echo "🛡️ Branch Protection attivo per:"
echo "  - main (richiede review + status checks)"
echo "  - develop (richiede review + status checks)"
echo ""
echo "🌍 Environments configurati:"
echo "  - staging (auto-deploy da develop)"
echo "  - production (richiede approval per release)"
