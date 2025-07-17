# Main Server Repository

This repository contains the main server and various applications designed to work together as a cohesive platform. The main server acts as the central hub, while each application serves a specific purpose within the larger ecosystem.

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Spen-Zosky/main-server.git
cd main-server

# 2. Configure environment
./configure_env.sh

# 3. Start development environment
./gradual_setup_script.sh
```

## 📋 Table of Contents

- [Overview](#overview)
- [Applications](#applications)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

### Project Philosophy

#### Methodological Principles
- **Modularity**: Each application is designed as an independent module, facilitating maintenance and development
- **Scalability**: The platform is designed to be scalable, allowing new applications or services to be added without disruption
- **Automation**: Initial installation and configuration are automated through scripts, reducing human error and ensuring consistent configuration

#### Architectural Principles
- **Microservices**: Each application is implemented as a microservice, communicating through well-defined APIs
- **Containerization**: All applications are containerized using Docker, ensuring consistent and environment-independent distribution
- **Separation of Concerns**: Backend and frontend are completely separated, allowing developers to work independently

#### Functional Principles
- **API-First**: Each application exposes a RESTful or GraphQL API, facilitating integration with other systems
- **Authentication and Authorization**: All applications use a centralized authentication system (JWT) to ensure security
- **Logging and Monitoring**: All applications implement standard logging and performance monitoring

## 🏗️ Applications

### 1. AI-HRMS (Human Resource Management System)
**Purpose**: AI-powered Human Resource Management System for comprehensive employee management.

**Features**:
- Employee database management
- AI-powered performance analysis
- Automated reporting and analytics
- Integration with external HR systems

**Tech Stack**:
- Backend: Node.js, Express.js, MongoDB
- Frontend: React, Material-UI
- AI/ML: TensorFlow.js integration ready

### 2. NOSE (Network Operations & Security Engine)
**Purpose**: Network monitoring and security operations platform.

**Features**:
- Real-time network monitoring
- Security threat detection
- Automated alert system
- Network performance analytics

**Tech Stack**:
- Backend: Node.js, Express.js, MongoDB
- Frontend: React, D3.js for visualizations
- Real-time: WebSocket integration

### 3. Web-Hunter
**Purpose**: Web content analysis and search optimization tool.

**Features**:
- Web content scraping and analysis
- SEO optimization recommendations
- Competitive analysis
- Content performance tracking

**Tech Stack**:
- Backend: Node.js, Express.js, MongoDB
- Frontend: React, Chart.js
- Analysis: Custom algorithms for content analysis

## 🔧 Prerequisites

### System Requirements
- **Operating System**: Ubuntu 18.04 or higher
- **RAM**: Minimum 4GB, recommended 8GB
- **Storage**: Minimum 20GB free space
- **Network**: Internet connection for Docker images and dependencies

### Software Dependencies
The setup scripts will automatically install:
- **Node.js** (version 18+)
- **npm** (Node Package Manager)
- **Docker CE** (Community Edition)
- **Docker Compose** (latest version)
- **Git** (version control)

### GitHub Requirements
- GitHub account with 2FA enabled
- Personal Access Token for Git operations
- Repository access permissions

## 🚀 Installation

### Method 1: Automated Setup (Recommended)

```bash
# 1. Initial system setup
./setup_main_server.sh

# 2. Platform improvements
./platform_improvements.sh

# 3. Environment configuration
./configure_env.sh

# 4. Git and GitHub setup
./git_setup.sh
```

### Method 2: Manual Installation

#### Step 1: System Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Project Setup
```bash
# Clone repository
git clone https://github.com/Spen-Zosky/main-server.git
cd main-server

# Install dependencies for all applications
for app in ai-hrms nose web-hunter; do
  cd apps/$app/backend && npm install && cd ../frontend && npm install && cd ../../..
done
```

## ⚙️ Configuration

### Environment Variables

The project uses environment variables for configuration. Use the automated configuration script:

```bash
./configure_env.sh
```

#### Manual Configuration

Copy and modify the environment file:

```bash
cp .env.example .env
# Edit .env with your preferred editor
nano .env
```

#### Key Configuration Variables

```bash
# Database Configuration
MONGO_URI=mongodb://mongo:27017/main-server
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password

# JWT Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Redis Cache
REDIS_URL=redis://redis:6379

# Server Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
```

### Docker Configuration

The project includes multiple Docker Compose configurations:

- **docker-compose.yml**: Development environment
- **docker-compose.prod.yml**: Production environment with monitoring
- **docker-compose.base.yml**: Base services only (MongoDB, Redis)

### GitHub Authentication

For GitHub operations with 2FA enabled:

1. **Create Personal Access Token**:
   - Go to https://github.com/settings/tokens
   - Generate new token (classic)
   - Select `repo` scope
   - Copy the token

2. **Configure Git with Token**:
   ```bash
   git remote set-url origin https://Spen-Zosky:YOUR_TOKEN@github.com/Spen-Zosky/main-server.git
   ```

3. **Alternative: Use GitHub CLI**:
   ```bash
   sudo apt install gh
   gh auth login
   ```

## 🛠️ Development

### Development Environment Setup

Use the gradual setup script for interactive development:

```bash
./gradual_setup_script.sh
```

#### Menu Options:
1. **Setup base** - Initialize project structure
2. **Configure environment** - Set up .env file
3. **Start base services** - MongoDB, Redis
4. **Develop applications** - Individual app development
5. **Activate monitoring** - Prometheus, Grafana
6. **Health checks** - System status verification

### Individual Application Development

#### Start Development for Specific App
```bash
# Using the development script
./scripts/dev.sh ai-hrms full

# Manual startup
cd apps/ai-hrms
docker-compose up --build
```

#### Development Workflow
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up --build ai-hrms-backend
```

### Code Quality

#### ESLint Configuration
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

#### Prettier Configuration
```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing

#### Unit Tests
```bash
# Run tests for all applications
for app in ai-hrms nose web-hunter; do
  cd apps/$app/backend && npm test && cd ../../..
done
```

#### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Production Deployment

#### Using Docker Compose
```bash
# Production environment
docker-compose -f docker-compose.prod.yml up -d

# Scaling services
docker-compose -f docker-compose.prod.yml up --scale ai-hrms-backend=3 -d
```

#### Environment-Specific Configurations
- **Development**: `docker-compose.yml`
- **Staging**: `docker-compose.staging.yml`
- **Production**: `docker-compose.prod.yml`

### CI/CD Pipeline

The project includes GitHub Actions workflows:

#### Workflow Features
- **Automated testing** on push/PR
- **Multi-app matrix testing**
- **Docker image building**
- **Security scanning**
- **Deployment automation**

#### Workflow Configuration
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### Deployment Scripts

#### Staging Deployment
```bash
./scripts/deploy.sh staging
```

#### Production Deployment
```bash
./scripts/deploy.sh production
```

## 📊 Monitoring

### Monitoring Stack

#### Prometheus Metrics
- **URL**: http://localhost:9090
- **Configuration**: `monitoring/prometheus.yml`
- **Metrics**: Application performance, system resources

#### Grafana Dashboards
- **URL**: http://localhost:3001
- **Credentials**: admin/admin
- **Dashboards**: Pre-configured for all applications

#### Traefik Dashboard
- **URL**: http://localhost:8080
- **Features**: Routing, load balancing, SSL termination

### Health Checks

#### Automated Health Monitoring
```bash
# Run health checks
./scripts/health-check.sh
```

#### Manual Health Verification
```bash
# Check individual services
curl http://localhost:3000/health
curl http://localhost:9090/-/healthy
curl http://localhost:3001/api/health
```

### Log Management

#### Centralized Logging
```bash
# View aggregated logs
docker-compose logs -f

# Application-specific logs
docker-compose logs -f ai-hrms-backend
```

#### Log Rotation
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/main-server
```

## 🔍 Troubleshooting

### Common Issues

#### Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

#### MongoDB Connection Issues
```bash
# Check MongoDB container
docker ps | grep mongo

# Check MongoDB logs
docker logs <mongo_container_name>

# Reset MongoDB
docker-compose down
docker volume rm main-server_mongo_data
docker-compose up -d
```

#### Environment Variables Not Loading
```bash
# Verify .env file exists
ls -la .env

# Check .env content
cat .env

# Test configuration
./configure_env.sh
# Choose option 5: Test configuration
```

#### Git Authentication Problems
```bash
# Check remote configuration
git remote -v

# Test connection
git ls-remote origin

# Reconfigure with token
git remote set-url origin https://Spen-Zosky:YOUR_TOKEN@github.com/Spen-Zosky/main-server.git
```

### Advanced Troubleshooting

#### Container Debugging
```bash
# Enter container shell
docker exec -it <container_name> /bin/bash

# Container resource usage
docker stats

# Container logs with timestamps
docker logs -t <container_name>
```

#### Network Issues
```bash
# Check Docker networks
docker network ls

# Inspect network
docker network inspect main-server_default

# Test inter-container connectivity
docker exec -it <container> ping <other_container>
```

### Performance Optimization

#### Resource Monitoring
```bash
# System resource usage
htop

# Docker resource usage
docker system df

# Clean up unused resources
docker system prune -a
```

## 📁 Project Structure

```
main-server/
├── README.md
├── .env.example
├── .env                          # Generated by configure_env.sh
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── docker-compose.yml           # Development
├── docker-compose.prod.yml      # Production
├── docker-compose.base.yml      # Base services
├── 
├── apps/
│   ├── ai-hrms/
│   │   ├── backend/
│   │   │   ├── Dockerfile
│   │   │   ├── app.js
│   │   │   ├── package.json
│   │   │   ├── middleware/
│   │   │   │   ├── security.js
│   │   │   │   └── logging.js
│   │   │   ├── routes/
│   │   │   │   └── metrics.js
│   │   │   └── logs/
│   │   ├── frontend/
│   │   │   ├── Dockerfile
│   │   │   ├── src/
│   │   │   │   └── App.js
│   │   │   ├── package.json
│   │   │   └── public/
│   │   └── docker-compose.yml
│   ├── nose/
│   │   ├── backend/
│   │   ├── frontend/
│   │   └── docker-compose.yml
│   └── web-hunter/
│       ├── backend/
│       ├── frontend/
│       └── docker-compose.yml
├── 
├── scripts/
│   ├── setup_main_server.sh      # Initial system setup
│   ├── platform_improvements.sh  # Platform enhancements
│   ├── configure_env.sh          # Environment configuration
│   ├── gradual_setup_script.sh   # Interactive development
│   ├── git_setup.sh              # Git and GitHub setup
│   ├── github_auth_helper.sh     # GitHub authentication
│   ├── backup.sh                 # Database backup
│   ├── health-check.sh           # System health check
│   ├── dev.sh                    # Development environment
│   └── deploy.sh                 # Deployment automation
├── 
├── monitoring/
│   ├── prometheus.yml
│   └── grafana/
│       ├── dashboards/
│       └── datasources/
│           └── prometheus.yml
├── 
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── 
├── docs/
│   └── api/
│       └── README.md
├── 
├── logs/                         # Application logs
├── backup/                       # Database backups
└── letsencrypt/                  # SSL certificates
```

## 🔧 Available Scripts

### Setup Scripts
- `./setup_main_server.sh` - Initial system and project setup
- `./platform_improvements.sh` - Add advanced features and configurations
- `./configure_env.sh` - Interactive environment configuration
- `./git_setup.sh` - Git and GitHub repository setup

### Development Scripts
- `./gradual_setup_script.sh` - Interactive development environment
- `./scripts/dev.sh <app> <mode>` - Start development for specific app
- `./scripts/health-check.sh` - System health verification

### Maintenance Scripts
- `./scripts/backup.sh` - Database backup
- `./scripts/deploy.sh <env>` - Deployment automation

### Authentication Scripts
- `./github_auth_helper.sh` - GitHub authentication management

## 🌐 Service URLs

### Development Environment
- **AI-HRMS**: http://ai-hrms.localhost
- **NOSE**: http://nose.localhost
- **Web-Hunter**: http://web-hunter.localhost

### Monitoring Services
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **Traefik Dashboard**: http://localhost:8080

### API Endpoints
- **AI-HRMS API**: http://localhost/api/ai-hrms
- **NOSE API**: http://localhost/api/nose
- **Web-Hunter API**: http://localhost/api/web-hunter

## 🔒 Security

### Authentication
- **JWT-based authentication** for all APIs
- **2FA required** for GitHub operations
- **Personal Access Tokens** for Git operations

### Environment Security
- **Environment variables** for sensitive data
- **.env file excluded** from version control
- **Secrets management** for production deployment

### Container Security
- **Non-root containers** where possible
- **Regular security updates** for base images
- **Network isolation** between services

## 📈 Performance

### Optimization Features
- **Redis caching** for frequently accessed data
- **Database indexing** for optimal query performance
- **Docker multi-stage builds** for smaller images
- **Load balancing** with Traefik

### Scalability
- **Horizontal scaling** with Docker Compose
- **Microservices architecture** for independent scaling
- **Database sharding** support (configurable)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Jest** for unit testing
- **JSDoc** for API documentation

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 🆘 Support

### Documentation
- **API Documentation**: `/docs/api/README.md`
- **Setup Guides**: Individual script documentation
- **Troubleshooting**: See troubleshooting section above

### Community
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Pull Requests**: Contributions welcome

### Contact
- **Repository**: https://github.com/Spen-Zosky/main-server
- **Maintainer**: Spen-Zosky

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Docker** for containerization platform
- **Node.js** ecosystem for backend development
- **React** for frontend framework
- **MongoDB** for database solution
- **Prometheus & Grafana** for monitoring
- **GitHub Actions** for CI/CD pipeline

---

**Last Updated**: 2025/07/17
**Version**: 1.0.0
**Status**: Active Development
