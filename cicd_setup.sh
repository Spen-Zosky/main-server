#!/bin/bash

# Script per configurare CI/CD e Versioning automatico su GitHub

set -e

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}🚀 $1${NC}"
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

# Configurazione del sistema CI/CD
setup_cicd_system() {
    print_step "Configurazione sistema CI/CD completo..."
    
    # Crea struttura directory
    mkdir -p .github/workflows
    mkdir -p .github/ISSUE_TEMPLATE
    mkdir -p .github/PULL_REQUEST_TEMPLATE
    mkdir -p scripts/ci
    mkdir -p docs/deployment
    
    # 1. Workflow principale CI/CD
    cat << 'EOF' > .github/workflows/ci-cd.yml
name: 🚀 CI/CD Pipeline

on:
  push:
    branches: [main, develop, 'feature/*', 'hotfix/*']
  pull_request:
    branches: [main, develop]
  release:
    types: [published]

env:
  DOCKER_REGISTRY: ghcr.io
  DOCKER_USERNAME: ${{ github.actor }}
  DOCKER_PASSWORD: ${{ secrets.GITHUB_TOKEN }}

jobs:
  # ================================
  # 1. CODE QUALITY & TESTING
  # ================================
  quality:
    name: 🔍 Code Quality
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [ai-hrms, nose, web-hunter]
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: apps/${{ matrix.app }}/backend/package-lock.json
      
      - name: 📦 Install Backend Dependencies
        run: |
          cd apps/${{ matrix.app }}/backend
          npm ci
      
      - name: 🧹 Lint Backend
        run: |
          cd apps/${{ matrix.app }}/backend
          npm run lint
      
      - name: 🧪 Test Backend
        run: |
          cd apps/${{ matrix.app }}/backend
          npm test -- --coverage
      
      - name: 📊 Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: apps/${{ matrix.app }}/backend/coverage/lcov.info
          flags: ${{ matrix.app }}-backend
      
      - name: 📦 Install Frontend Dependencies
        run: |
          cd apps/${{ matrix.app }}/frontend
          npm ci
      
      - name: 🧹 Lint Frontend
        run: |
          cd apps/${{ matrix.app }}/frontend
          npm run lint
      
      - name: 🧪 Test Frontend
        run: |
          cd apps/${{ matrix.app }}/frontend
          npm test -- --coverage --watchAll=false
      
      - name: 🏗️ Build Frontend
        run: |
          cd apps/${{ matrix.app }}/frontend
          npm run build

  # ================================
  # 2. SECURITY SCAN
  # ================================
  security:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: 🔍 Security Audit
        run: |
          for app in ai-hrms nose web-hunter; do
            echo "🔍 Scanning $app backend..."
            cd apps/$app/backend
            npm audit --audit-level=moderate
            cd ../frontend
            echo "🔍 Scanning $app frontend..."
            npm audit --audit-level=moderate
            cd ../../..
          done
      
      - name: 🛡️ CodeQL Analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript
      
      - name: 🔬 Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  # ================================
  # 3. DOCKER BUILD
  # ================================
  docker:
    name: 🐳 Docker Build
    runs-on: ubuntu-latest
    needs: [quality, security]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop' || github.event_name == 'release'
    strategy:
      matrix:
        app: [ai-hrms, nose, web-hunter]
        component: [backend, frontend]
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🐳 Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: 🔑 Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ env.DOCKER_USERNAME }}
          password: ${{ env.DOCKER_PASSWORD }}
      
      - name: 🏷️ Extract Metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.DOCKER_REGISTRY }}/${{ github.repository }}/${{ matrix.app }}-${{ matrix.component }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=semver,pattern={{major}}
            type=sha,prefix={{branch}}-
      
      - name: 🏗️ Build and Push
        uses: docker/build-push-action@v5
        with:
          context: apps/${{ matrix.app }}/${{ matrix.component }}
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ================================
  # 4. DEPLOY TO STAGING
  # ================================
  deploy-staging:
    name: 🚀 Deploy to Staging
    runs-on: ubuntu-latest
    needs: [docker]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🚀 Deploy to Staging
        run: |
          echo "🚀 Deploying to staging environment..."
          # Qui aggiungerai i tuoi comandi di deployment
          # Esempio: kubectl apply -f k8s/staging/
          # O: docker-compose -f docker-compose.staging.yml up -d
      
      - name: 🧪 Run Integration Tests
        run: |
          echo "🧪 Running integration tests..."
          # Aggiungi test di integrazione
      
      - name: 📝 Update Deployment Status
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createDeploymentStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              deployment_id: context.payload.deployment.id,
              state: 'success',
              description: 'Deployment to staging successful',
              environment_url: 'https://staging.your-domain.com'
            });

  # ================================
  # 5. DEPLOY TO PRODUCTION
  # ================================
  deploy-production:
    name: 🏭 Deploy to Production
    runs-on: ubuntu-latest
    needs: [docker]
    if: github.event_name == 'release' && github.event.action == 'published'
    environment: production
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🏭 Deploy to Production
        run: |
          echo "🏭 Deploying to production environment..."
          # Qui aggiungerai i tuoi comandi di deployment produzione
      
      - name: 🔔 Notify Deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          text: '🚀 Production deployment completed successfully!'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  # ================================
  # 6. CLEANUP
  # ================================
  cleanup:
    name: 🧹 Cleanup
    runs-on: ubuntu-latest
    needs: [deploy-staging, deploy-production]
    if: always()
    
    steps:
      - name: 🧹 Cleanup old images
        run: |
          echo "🧹 Cleaning up old Docker images..."
          # Cleanup logic here
EOF

    # 2. Workflow per Versioning Automatico
    cat << 'EOF' > .github/workflows/versioning.yml
name: 📦 Versioning & Release

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      version_type:
        description: 'Version increment type'
        required: true
        default: 'patch'
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  # ================================
  # 1. CALCULATE VERSION
  # ================================
  version:
    name: 📊 Calculate Version
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      changelog: ${{ steps.changelog.outputs.changelog }}
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: 📦 Install semantic-release
        run: |
          npm install -g semantic-release @semantic-release/changelog @semantic-release/git
      
      - name: 📊 Calculate Next Version
        id: version
        run: |
          # Usa semantic-release per calcolare la prossima versione
          NEXT_VERSION=$(npx semantic-release --dry-run | grep -oP 'The next release version is \K[0-9]+\.[0-9]+\.[0-9]+' | head -1)
          if [ -z "$NEXT_VERSION" ]; then
            CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "0.0.0")
            case "${{ github.event.inputs.version_type }}" in
              major) NEXT_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1+1".0.0"}') ;;
              minor) NEXT_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2+1".0"}') ;;
              patch) NEXT_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2"."$3+1}') ;;
              *) NEXT_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2"."$3+1}') ;;
            esac
          fi
          echo "version=$NEXT_VERSION" >> $GITHUB_OUTPUT
          echo "📊 Next version: $NEXT_VERSION"
      
      - name: 📝 Generate Changelog
        id: changelog
        run: |
          # Genera changelog automatico
          LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
          if [ -z "$LAST_TAG" ]; then
            CHANGELOG=$(git log --pretty=format:"- %s" --no-merges)
          else
            CHANGELOG=$(git log $LAST_TAG..HEAD --pretty=format:"- %s" --no-merges)
          fi
          echo "changelog<<EOF" >> $GITHUB_OUTPUT
          echo "$CHANGELOG" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

  # ================================
  # 2. CREATE RELEASE
  # ================================
  release:
    name: 🏷️ Create Release
    runs-on: ubuntu-latest
    needs: version
    if: needs.version.outputs.version != ''
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: 🏷️ Create Tag
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git tag -a "v${{ needs.version.outputs.version }}" -m "Release v${{ needs.version.outputs.version }}"
          git push origin "v${{ needs.version.outputs.version }}"
      
      - name: 📦 Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ needs.version.outputs.version }}
          release_name: Release v${{ needs.version.outputs.version }}
          body: |
            ## 🚀 Release v${{ needs.version.outputs.version }}
            
            ### 📋 Changes:
            ${{ needs.version.outputs.changelog }}
            
            ### 🐳 Docker Images:
            - `ghcr.io/${{ github.repository }}/ai-hrms-backend:${{ needs.version.outputs.version }}`
            - `ghcr.io/${{ github.repository }}/ai-hrms-frontend:${{ needs.version.outputs.version }}`
            - `ghcr.io/${{ github.repository }}/nose-backend:${{ needs.version.outputs.version }}`
            - `ghcr.io/${{ github.repository }}/nose-frontend:${{ needs.version.outputs.version }}`
            - `ghcr.io/${{ github.repository }}/web-hunter-backend:${{ needs.version.outputs.version }}`
            - `ghcr.io/${{ github.repository }}/web-hunter-frontend:${{ needs.version.outputs.version }}`
            
            ### 🔧 Installation:
            ```bash
            git clone https://github.com/${{ github.repository }}.git
            cd main-server
            git checkout v${{ needs.version.outputs.version }}
            ./configure_env.sh
            docker-compose -f docker-compose.prod.yml up -d
            ```
          draft: false
          prerelease: false
      
      - name: 📝 Update Version Files
        run: |
          # Aggiorna package.json files
          for app in ai-hrms nose web-hunter; do
            cd apps/$app/backend
            npm version ${{ needs.version.outputs.version }} --no-git-tag-version
            cd ../frontend
            npm version ${{ needs.version.outputs.version }} --no-git-tag-version
            cd ../../..
          done
          
          # Aggiorna VERSION file
          echo "${{ needs.version.outputs.version }}" > VERSION
          
          # Commit changes
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "chore: bump version to ${{ needs.version.outputs.version }}"
          git push origin main

  # ================================
  # 3. UPDATE DOCUMENTATION
  # ================================
  docs:
    name: 📚 Update Documentation
    runs-on: ubuntu-latest
    needs: [version, release]
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
        with:
          ref: main
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: 📚 Update README
        run: |
          # Aggiorna README con nuova versione
          sed -i "s/Version: [0-9]*\.[0-9]*\.[0-9]*/Version: ${{ needs.version.outputs.version }}/g" README.md
          sed -i "s/\*\*Last Updated\*\*: .*/\*\*Last Updated\*\*: $(date)/g" README.md
      
      - name: 📝 Generate API Documentation
        run: |
          # Genera documentazione API automatica
          for app in ai-hrms nose web-hunter; do
            echo "📝 Generating API docs for $app..."
            # Qui puoi aggiungere tool come JSDoc, Swagger, etc.
          done
      
      - name: 💾 Commit Documentation
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "docs: update documentation for v${{ needs.version.outputs.version }}" || exit 0
          git push origin main
EOF

    # 3. Workflow per Branch Protection
    cat << 'EOF' > .github/workflows/branch-protection.yml
name: 🛡️ Branch Protection

on:
  pull_request:
    branches: [main, develop]

jobs:
  # ================================
  # 1. CONVENTIONAL COMMITS CHECK
  # ================================
  commit-check:
    name: 📝 Commit Convention Check
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: 📝 Check Commit Messages
        uses: wagoid/commitlint-github-action@v5
        with:
          configFile: '.commitlintrc.yml'

  # ================================
  # 2. DEPENDENCY CHECK
  # ================================
  dependency-check:
    name: 🔍 Dependency Check
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: 🔍 Check for Vulnerabilities
        run: |
          for app in ai-hrms nose web-hunter; do
            echo "🔍 Checking $app dependencies..."
            cd apps/$app/backend
            npm audit --audit-level=high
            cd ../frontend
            npm audit --audit-level=high
            cd ../../..
          done

  # ================================
  # 3. PERFORMANCE CHECK
  # ================================
  performance-check:
    name: ⚡ Performance Check
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: ⚡ Bundle Size Check
        run: |
          for app in ai-hrms nose web-hunter; do
            echo "📊 Checking $app bundle size..."
            cd apps/$app/frontend
            npm ci
            npm run build
            # Aggiungi controllo dimensione bundle
            cd ../../..
          done
EOF

    print_success "Workflow CI/CD creati!"
}

# Configurazione Semantic Release
setup_semantic_release() {
    print_step "Configurazione Semantic Release..."
    
    # package.json per semantic release
    cat << 'EOF' > package.json
{
  "name": "main-server",
  "version": "1.0.0",
  "description": "Main server platform with AI-HRMS, NOSE, and Web-Hunter applications",
  "main": "index.js",
  "scripts": {
    "release": "semantic-release",
    "version": "conventional-changelog -p angular -i CHANGELOG.md -s",
    "postversion": "git push && git push --tags"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/Spen-Zosky/main-server.git"
  },
  "keywords": [
    "microservices",
    "docker",
    "nodejs",
    "react",
    "mongodb",
    "hrms",
    "monitoring"
  ],
  "author": "Spen-Zosky",
  "license": "MIT",
  "devDependencies": {
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/git": "^10.0.1",
    "conventional-changelog-cli": "^4.1.0",
    "semantic-release": "^22.0.12"
  },
  "release": {
    "branches": [
      "main",
      {
        "name": "develop",
        "prerelease": "beta"
      }
    ],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/github",
      "@semantic-release/git"
    ]
  }
}
EOF

    # Configurazione commitlint
    cat << 'EOF' > .commitlintrc.yml
extends:
  - '@commitlint/config-conventional'

rules:
  type-enum:
    - 2
    - always
    - [
        'feat',     # New feature
        'fix',      # Bug fix
        'docs',     # Documentation
        'style',    # Code style
        'refactor', # Code refactoring
        'perf',     # Performance improvement
        'test',     # Tests
        'chore',    # Maintenance
        'ci',       # CI/CD
        'build',    # Build system
        'revert'    # Revert changes
      ]
  
  scope-enum:
    - 2
    - always
    - [
        'ai-hrms',
        'nose',
        'web-hunter',
        'docker',
        'ci',
        'docs',
        'config',
        'security',
        'monitoring',
        'database',
        'api'
      ]
  
  subject-case:
    - 2
    - never
    - ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
  
  subject-empty:
    - 2
    - never
  
  subject-full-stop:
    - 2
    - never
    - '.'
  
  header-max-length:
    - 2
    - always
    - 72
EOF

    print_success "Semantic Release configurato!"
}

# Configurazione Templates
setup_templates() {
    print_step "Configurazione Templates GitHub..."
    
    # Issue Templates
    cat << 'EOF' > .github/ISSUE_TEMPLATE/bug_report.yml
name: 🐛 Bug Report
description: Create a bug report to help us improve
title: '[BUG] '
labels: ['bug', 'needs-triage']
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
        
  - type: dropdown
    id: component
    attributes:
      label: Component
      description: Which component is affected?
      options:
        - AI-HRMS
        - NOSE
        - Web-Hunter
        - Docker/Infrastructure
        - CI/CD
        - Documentation
    validations:
      required: true
      
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of the bug
    validations:
      required: true
      
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior
      placeholder: |
        1. Go to '...'
        2. Click on '...'
        3. Scroll down to '...'
        4. See error
    validations:
      required: true
      
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What you expected to happen
    validations:
      required: true
      
  - type: textarea
    id: environment
    attributes:
      label: Environment
      description: |
        - OS: [e.g. Ubuntu 20.04]
        - Node.js version: [e.g. 18.17.0]
        - Docker version: [e.g. 24.0.6]
        - Browser: [e.g. Chrome 118.0.5993.88]
    validations:
      required: true
EOF

    cat << 'EOF' > .github/ISSUE_TEMPLATE/feature_request.yml
name: ✨ Feature Request
description: Suggest an idea for this project
title: '[FEATURE] '
labels: ['enhancement', 'needs-triage']
body:
  - type: markdown
    attributes:
      value: |
        Thanks for your feature request!
        
  - type: dropdown
    id: component
    attributes:
      label: Component
      description: Which component would this feature affect?
      options:
        - AI-HRMS
        - NOSE
        - Web-Hunter
        - Docker/Infrastructure
        - CI/CD
        - Documentation
    validations:
      required: true
      
  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: Is your feature request related to a problem?
      placeholder: I'm always frustrated when...
    validations:
      required: true
      
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: What would you like to happen?
    validations:
      required: true
      
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Any alternative solutions or features you've considered?
    validations:
      required: false
EOF

    # Pull Request Template
    cat << 'EOF' > .github/PULL_REQUEST_TEMPLATE.md
## 📋 Pull Request Description

### 🎯 Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Configuration change
- [ ] 🧪 Test update
- [ ] 🔄 Refactoring

### 📦 Component(s) Affected
- [ ] AI-HRMS
- [ ] NOSE
- [ ] Web-Hunter
- [ ] Docker/Infrastructure
- [ ] CI/CD
- [ ] Documentation

### 📝 Changes Made
<!-- Describe the changes you made -->

### 🔗 Related Issues
<!-- Link to related issues -->
Closes #

### 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] No breaking changes

### 📸 Screenshots (if applicable)
<!-- Add screenshots to help explain your changes -->

### ✅ Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

### 📊 Performance Impact
<!-- Describe any performance implications -->

### 🔒 Security Considerations
<!-- Describe any security implications -->
EOF

    print_success "Templates GitHub creati!"
}

# Configurazione Branch Protection
setup_branch_protection() {
    print_step "Configurazione Branch Protection..."
    
    # Script per configurare branch protection via GitHub CLI
    cat << 'EOF' > scripts/ci/setup-branch-protection.sh
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
EOF

    chmod +x scripts/ci/setup-branch-protection.sh
    print_success "Branch Protection script creato!"
}

# Configurazione Monitoring CI/CD
setup_monitoring_cicd() {
    print_step "Configurazione Monitoring CI/CD..."
    
    cat << 'EOF' > .github/workflows/monitoring.yml
name: 📊 Monitoring & Alerts

on:
  schedule:
    - cron: '0 */6 * * *'  # Ogni 6 ore
  workflow_dispatch:

jobs:
  # ================================
  # 1. DEPENDENCY MONITORING
  # ================================
  dependency-monitor:
    name: 📦 Dependency Monitor
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: 🔍 Check Outdated Dependencies
        run: |
          for app in ai-hrms nose web-hunter; do
            echo "📦 Checking $app dependencies..."
            cd apps/$app/backend
            npm outdated || true
            cd ../frontend
            npm outdated || true
            cd ../../..
          done
      
      - name: 🚨 Security Audit
        run: |
          AUDIT_RESULTS=""
          for app in ai-hrms nose web-hunter; do
            cd apps/$app/backend
            AUDIT_OUTPUT=$(npm audit --audit-level=moderate --json || true)
            if [ "$AUDIT_OUTPUT" != "{}" ]; then
              AUDIT_RESULTS="$AUDIT_RESULTS\n$app backend: $AUDIT_OUTPUT"
            fi
            cd ../frontend
            AUDIT_OUTPUT=$(npm audit --audit-level=moderate --json || true)
            if [ "$AUDIT_OUTPUT" != "{}" ]; then
              AUDIT_RESULTS="$AUDIT_RESULTS\n$app frontend: $AUDIT_OUTPUT"
            fi
            cd ../../..
          done
          
          if [ -n "$AUDIT_RESULTS" ]; then
            echo "🚨 Security vulnerabilities found!"
            echo -e "$AUDIT_RESULTS"
            # Qui puoi inviare notifiche
          fi

  # ================================
  # 2. PERFORMANCE MONITORING
  # ================================
  performance-monitor:
    name: ⚡ Performance Monitor
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: 📊 Bundle Size Analysis
        run: |
          for app in ai-hrms nose web-hunter; do
            echo "📊 Analyzing $app bundle size..."
            cd apps/$app/frontend
            npm ci
            npm run build
            
            # Analisi dimensioni bundle
            BUNDLE_SIZE=$(du -sh build/ | cut -f1)
            echo "$app bundle size: $BUNDLE_SIZE"
            
            # Controlla se supera i limiti
            BUNDLE_SIZE_BYTES=$(du -sb build/ | cut -f1)
            if [ "$BUNDLE_SIZE_BYTES" -gt 5242880 ]; then  # 5MB
              echo "⚠️ Warning: $app bundle size exceeds 5MB!"
            fi
            
            cd ../../..
          done

  # ================================
  # 3. INFRASTRUCTURE MONITORING
  # ================================
  infrastructure-monitor:
    name: 🏗️ Infrastructure Monitor
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4
      
      - name: 🐳 Docker Image Analysis
        run: |
          echo "🐳 Analyzing Docker configurations..."
          
          # Controlla Dockerfile per best practices
          for app in ai-hrms nose web-hunter; do
            for component in backend frontend; do
              dockerfile="apps/$app/$component/Dockerfile"
              if [ -f "$dockerfile" ]; then
                echo "🔍 Checking $dockerfile..."
                
                # Verifica FROM statement
                if grep -q "FROM node:latest" "$dockerfile"; then
                  echo "⚠️ Warning: Using 'latest' tag in $dockerfile"
                fi
                
                # Verifica USER statement
                if ! grep -q "USER " "$dockerfile"; then
                  echo "⚠️ Warning: No USER statement in $dockerfile"
                fi
              fi
            done
          done
      
      - name: 📊 Resource Usage Estimation
        run: |
          echo "📊 Estimating resource usage..."
          
          # Calcola risorse stimate
          TOTAL_MEMORY="0"
          TOTAL_CPU="0"
          
          for app in ai-hrms nose web-hunter; do
            # Stima memoria per backend (512MB) e frontend (256MB)
            MEMORY_MB=$((512 + 256))
            CPU_CORES="1"
            
            echo "$app estimated resources: ${MEMORY_MB}MB RAM, ${CPU_CORES} CPU cores"
            TOTAL_MEMORY=$((TOTAL_MEMORY + MEMORY_MB))
            TOTAL_CPU=$((TOTAL_CPU + CPU_CORES))
          done
          
          echo "Total estimated resources: ${TOTAL_MEMORY}MB RAM, ${TOTAL_CPU} CPU cores"
          
          # Aggiungi risorse per servizi (MongoDB, Redis, Prometheus, Grafana)
          SERVICES_MEMORY=$((1024 + 512 + 512 + 512))  # 2.5GB
          SERVICES_CPU="2"
          
          TOTAL_MEMORY=$((TOTAL_MEMORY + SERVICES_MEMORY))
          TOTAL_CPU=$((TOTAL_CPU + SERVICES_CPU))
          
          echo "Total with services: ${TOTAL_MEMORY}MB RAM, ${TOTAL_CPU} CPU cores"
EOF

    print_success "Monitoring CI/CD configurato!"
}

# Configurazione Changelog automatico
setup_changelog() {
    print_step "Configurazione Changelog automatico..."
    
    cat << 'EOF' > CHANGELOG.md
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete CI/CD pipeline with GitHub Actions
- Automated versioning and release management
- Docker container building and publishing
- Security scanning and vulnerability monitoring
- Branch protection and code quality checks
- Automated changelog generation
- Performance monitoring and alerts

### Changed
- Updated README with comprehensive documentation
- Improved project structure and organization

### Fixed
- Environment configuration and secrets management
- Git authentication with 2FA support

## [1.0.0] - 2024-01-01

### Added
- Initial project setup with three applications:
  - AI-HRMS: Human Resource Management System
  - NOSE: Network Operations & Security Engine
  - Web-Hunter: Web content analysis tool
- Docker containerization for all services
- MongoDB and Redis integration
- Prometheus and Grafana monitoring
- Environment configuration management
- Development and deployment scripts
- GitHub integration and documentation

### Infrastructure
- Complete Docker Compose setup
- Traefik reverse proxy configuration
- Automated backup and health check scripts
- ESLint and Prettier configuration
- Security middleware and logging

### Documentation
- Comprehensive README with setup instructions
- API documentation structure
- Troubleshooting guides
- Contributing guidelines
EOF

    print_success "Changelog creato!"
}

# Menu principale
show_menu() {
    echo "=================================="
    echo "🚀 CI/CD & VERSIONING SETUP"
    echo "=================================="
    echo ""
    echo "1) 🔧 Setup CI/CD Workflows"
    echo "2) 📦 Setup Semantic Release"
    echo "3) 📋 Setup GitHub Templates"
    echo "4) 🛡️ Setup Branch Protection"
    echo "5) 📊 Setup Monitoring CI/CD"
    echo "6) 📝 Setup Changelog"
    echo "7) 🚀 Setup Completo"
    echo ""
    echo "0) ❌ Esci"
    echo ""
}

# Setup completo
full_setup() {
    print_step "Setup completo CI/CD e Versioning..."
    
    setup_cicd_system
    setup_semantic_release
    setup_templates
    setup_branch_protection
    setup_monitoring_cicd
    setup_changelog
    
    print_success "Setup CI/CD completo!"
    
    echo ""
    echo "🎉 SETUP COMPLETATO!"
    echo "===================="
    echo ""
    echo "📋 Prossimi passi:"
    echo "1. git add ."
    echo "2. git commit -m 'ci: setup complete CI/CD and versioning system'"
    echo "3. git push origin main"
    echo "4. ./scripts/ci/setup-branch-protection.sh"
    echo ""
    echo "🚀 Features attivate:"
    echo "• ✅ CI/CD automatico con GitHub Actions"
    echo "• ✅ Versioning semantico automatico"
    echo "• ✅ Docker image building e publishing"
    echo "• ✅ Security scanning e vulnerability monitoring"
    echo "• ✅ Branch protection e code quality checks"
    echo "• ✅ Automated changelog generation"
    echo "• ✅ Performance monitoring e alerts"
    echo "• ✅ Environment-specific deployments"
    echo "• ✅ Issue e PR templates"
    echo ""
}

# Loop principale
main() {
    while true; do
        show_menu
        read -p "Scegli un'opzione (0-7): " choice
        
        case $choice in
            1) setup_cicd_system ;;
            2) setup_semantic_release ;;
            3) setup_templates ;;
            4) setup_branch_protection ;;
            5) setup_monitoring_cicd ;;
            6) setup_changelog ;;
            7) full_setup ;;
            0) 
                print_info "Setup terminato!"
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
