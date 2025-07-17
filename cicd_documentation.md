# 🚀 CI/CD e Versioning - Guida Completa

## 📋 Panoramica

Il sistema CI/CD implementa un workflow completamente automatizzato per:
- **Continuous Integration**: Test, quality check, security scan
- **Continuous Deployment**: Deploy automatico su staging e production
- **Semantic Versioning**: Versioning automatico basato su conventional commits
- **Release Management**: Generazione automatica di release e changelog
- **Monitoring**: Monitoraggio continuo di performance e sicurezza

## 🔧 Setup Iniziale

### 1. Installa il Sistema CI/CD

```bash
# Crea e esegui lo script di setup
nano cicd_setup.sh
# Copia il contenuto dal primo artifact
chmod +x cicd_setup.sh
./cicd_setup.sh
```

### 2. Configurazione Completa

```bash
# Esegui il setup completo (opzione 7)
./cicd_setup.sh
# Scegli: 7) 🚀 Setup Completo
```

### 3. Push delle Configurazioni

```bash
# Commit e push delle configurazioni
git add .
git commit -m "ci: setup complete CI/CD and versioning system

- Add comprehensive GitHub Actions workflows
- Implement semantic versioning with automated releases
- Configure branch protection and code quality checks
- Add issue and PR templates
- Setup monitoring and security scanning
- Configure automated changelog generation"

git push origin main
```

### 4. Configurazione Branch Protection

```bash
# Installa GitHub CLI se non presente
sudo apt install gh

# Autentica GitHub CLI
gh auth login

# Configura branch protection
./scripts/ci/setup-branch-protection.sh
```

## 🌊 Workflow di Sviluppo

### Branch Strategy

```
main (production)
├── develop (staging)
│   ├── feature/user-authentication
│   ├── feature/dashboard-ui
│   └── hotfix/security-patch
```

### 1. Sviluppo Feature

```bash
# Crea branch feature
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Sviluppa la feature
# ... codice ...

# Commit con conventional commits
git add .
git commit -m "feat(ai-hrms): add user authentication system

- Implement JWT-based authentication
- Add login/logout endpoints
- Add user session management
- Add password encryption with bcrypt"

git push origin feature/user-authentication
```

### 2. Pull Request

- Crea PR da `feature/user-authentication` → `develop`
- Il sistema eseguirà automaticamente:
  - ✅ **Code Quality**: Lint, test, build
  - ✅ **Security Scan**: Vulnerability check
  - ✅ **Commit Check**: Conventional commits validation
  - ✅ **Performance**: Bundle size analysis

### 3. Merge e Deploy

```bash
# Merge in develop triggera deploy su staging
# URL: https://staging.your-domain.com

# Merge in main triggera:
# 1. Calcolo nuova versione
# 2. Creazione release
# 3. Build Docker images
# 4. Deploy in production
```

## 📦 Semantic Versioning

### Conventional Commits

```bash
# PATCH version (1.0.0 → 1.0.1)
git commit -m "fix(ai-hrms): resolve login validation issue"

# MINOR version (1.0.0 → 1.1.0)
git commit -m "feat(nose): add network monitoring dashboard"

# MAJOR version (1.0.0 → 2.0.0)
git commit -m "feat(web-hunter): redesign API endpoints

BREAKING CHANGE: API endpoints now use /v2/ prefix"
```

### Scopes Disponibili

- `ai-hrms`: Human Resource Management System
- `nose`: Network Operations & Security Engine
- `web-hunter`: Web content analysis tool
- `docker`: Docker configurations
- `ci`: CI/CD pipeline
- `docs`: Documentation
- `config`: Configuration files
- `security`: Security improvements
- `monitoring`: Monitoring setup
- `database`: Database changes
- `api`: API changes

### Tipi di Commit

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert changes

## 🚀 Release Process

### Automatico (Raccomandato)

```bash
# Il sistema calcola automaticamente la versione
# basata sui commit conventional

# Push su main triggera:
# 1. Analisi commit per calcolare versione
# 2. Generazione changelog
# 3. Creazione tag e release
# 4. Build e publish Docker images
# 5. Deploy in production
```

### Manuale

```bash
# Trigger manuale del workflow versioning
gh workflow run versioning.yml -f version_type=minor

# Opzioni disponibili:
# - patch: 1.0.0 → 1.0.1
# - minor: 1.0.0 → 1.1.0
# - major: 1.0.0 → 2.0.0
```

## 🐳 Docker Images

### Naming Convention

```bash
# Format: ghcr.io/spen-zosky/main-server/[APP]-[COMPONENT]:[VERSION]
ghcr.io/spen-zosky/main-server/ai-hrms-backend:1.2.0
ghcr.io/spen-zosky/main-server/ai-hrms-frontend:1.2.0
ghcr.io/spen-zosky/main-server/nose-backend:1.2.0
ghcr.io/spen-zosky/main-server/nose-frontend:1.2.0
ghcr.io/spen-zosky/main-server/web-hunter-backend:1.2.0
ghcr.io/spen-zosky/main-server/web-hunter-frontend:1.2.0
```

### Usage

```bash
# Pull immagine specifica
docker pull ghcr.io/spen-zosky/main-server/ai-hrms-backend:1.2.0

# Usa in docker-compose
version: '3.8'
services:
  ai-hrms-backend:
    image: ghcr.io/spen-zosky/main-server/ai-hrms-backend:1.2.0
```

## 🏗️ Environments

### Development

```bash
# Branch: feature/*, develop
# Trigger: Push
# Actions: Test, Build, Quality Check
```

### Staging

```bash
# Branch: develop
# Trigger: Push to develop
# Actions: Test, Build, Deploy to staging
# URL: https://staging.your-domain.com
```

### Production

```bash
# Branch: main
# Trigger: Release published
# Actions: Build, Deploy to production
# URL: https://your-domain.com
# Requires: Manual approval
```

## 📊 Monitoring e Alerts

### Dependency Monitoring

```bash
# Eseguito ogni 6 ore
# Controlla:
# - Dipendenze obsolete
# - Vulnerabilità di sicurezza
# - Aggiornamenti disponibili
```

### Performance Monitoring

```bash
# Controlla:
# - Dimensioni bundle
# - Tempo di build
# - Utilizzo risorse
```

### Security Scanning

```bash
# Eseguito su ogni PR e push
# Include:
# - npm audit
# - CodeQL analysis
# - Container security scan
```

## 🛡️ Security

### Branch Protection

#### Main Branch
- ✅ Richiede review (1 approvazione)
- ✅ Richiede status check (CI/CD)
- ✅ Dismiss stale reviews
- ✅ Require code owner reviews
- ❌ Force push disabled
- ❌ Deletion disabled

#### Develop Branch
- ✅ Richiede review (1 approvazione)
- ✅ Richiede status check (CI/CD)
- ✅ Dismiss stale reviews
- ❌ Force push disabled
- ❌ Deletion disabled

### Secret Management

```bash
# Repository Secrets (Settings > Secrets)
DOCKER_USERNAME        # GitHub username
DOCKER_PASSWORD        # GitHub token
SLACK_WEBHOOK_URL      # Slack notifications
DEPLOY_KEY            # Production deploy key
```

## 📝 Issue e PR Templates

### Bug Report Template

```markdown
## 🐛 Bug Report

### Component
- [ ] AI-HRMS
- [ ] NOSE
- [ ] Web-Hunter

### Description
[Descrizione del bug]

### Steps to Reproduce
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

### Expected Behavior
[Comportamento atteso]

### Environment
- OS: [Ubuntu 20.04]
- Node.js: [18.17.0]
- Docker: [24.0.6]
```

### Feature Request Template

```markdown
## ✨ Feature Request

### Component
- [ ] AI-HRMS
- [ ] NOSE  
- [ ] Web-Hunter

### Problem Statement
[Problema da risolvere]

### Proposed Solution
[Soluzione proposta]
```

### Pull Request Template

```markdown
## 📋 Pull Request

### Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentation

### Component(s) Affected
- [ ] AI-HRMS
- [ ] NOSE
- [ ] Web-Hunter

### Changes Made
[Descrizione delle modifiche]

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
```

## 🔧 Comandi Utili

### GitHub CLI

```bash
# Visualizza workflow runs
gh run list

# Visualizza workflow specifico
gh run view [RUN_ID]

# Trigger workflow manuale
gh workflow run ci-cd.yml

# Visualizza releases
gh release list

# Crea release manuale
gh release create v1.2.0 --title "Release v1.2.0" --notes "Release notes"
```

### Docker

```bash
# Lista immagini build
docker images | grep main-server

# Pulizia immagini vecchie
docker image prune -a

# Visualizza utilizzo risorse
docker system df
```

### Git

```bash
# Visualizza tag
git tag -l

# Visualizza changelog
git log --oneline --decorate --graph

# Verifica conventional commits
npx commitlint --from HEAD~1 --to HEAD --verbose
```

## 🚨 Troubleshooting

### Workflow Fallisce

```bash
# 1. Controlla logs
gh run view [RUN_ID]

# 2. Verifica status checks
gh pr status

# 3. Debug locale
npm run lint
npm test
npm run build
```

### Release Non Creata

```bash
# 1. Verifica commit format
git log --oneline -10

# 2. Verifica conventional commits
npx commitlint --from HEAD~10 --to HEAD --verbose

# 3. Trigger manuale
gh workflow run versioning.yml -f version_type=patch
```

### Docker Build Fallisce

```bash
# 1. Test build locale
docker build -t test-image apps/ai-hrms/backend/

# 2. Verifica Dockerfile
docker run --rm -it test-image /bin/bash

# 3. Controlla dependencies
npm audit
```

### Branch Protection Bypass

```bash
# 1. Verifica protezioni
gh api repos/Spen-Zosky/main-server/branches/main/protection

# 2. Riconfigura
./scripts/ci/setup-branch-protection.sh
```

## 📚 Risorse Aggiuntive

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

### Semantic Versioning
- [Semantic Versioning Specification](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Docker
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

**Ultima modifica**: $(date)
**Versione**: 1.0.0
