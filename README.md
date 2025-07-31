# Main Server

Enterprise-grade platform with clean architecture.

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Spen-Zosky/main-server.git
cd main-server
```

### 2. Install dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd src/frontend
npm install
cd ../..

# Frontend-test dependencies  
cd src/frontend-test
npm install
cd ../..
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start the application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
main-server/
├── src/
│   ├── frontend/          # Production frontend (React)
│   └── frontend-test/     # Test frontend environment
├── docs/                  # Documentation
│   ├── ENTERPRISE-METHODOLOGY.md
│   └── SYSTEM-KNOWLEDGE-BASE.md
├── scripts/               # Utility scripts
│   ├── env-status.sh
│   ├── promote-to-production.sh
│   ├── start-test-env.sh
│   └── sync-from-production.sh
├── tools/                 # Development tools
├── server.js              # Express server
├── package.json           # Backend dependencies
├── package-lock.json      # Locked dependencies
├── session-closure.js     # Session management
├── ecosystem.config.cjs   # PM2 configuration
└── .env.example           # Environment template
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

- **Server Settings**: Port, environment mode
- **Database**: MongoDB connection string
- **Security**: JWT and session secrets
- **Frontend URLs**: Development and test URLs
- **API Settings**: Prefix and version
- **CORS**: Allowed origins

### Frontend Configuration

Both frontend applications have their own configuration:
- Production frontend: `src/frontend/`
- Test frontend: `src/frontend-test/`

## 📦 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm test` - Run tests

### Frontend Scripts
Navigate to `src/frontend/` or `src/frontend-test/` first:
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Utility Scripts
- `scripts/start-test-env.sh` - Start test environment
- `scripts/promote-to-production.sh` - Promote test to production
- `scripts/env-status.sh` - Check environment status
- `scripts/sync-from-production.sh` - Sync from production

## 🛠️ Development

### Frontend Development

The project includes two frontend environments:

1. **Production Frontend** (`src/frontend/`)
   - Main application UI
   - Material-UI components
   - Design system integrated

2. **Test Frontend** (`src/frontend-test/`)
   - Testing environment
   - Storybook integration
   - Component development

### Backend Development

- Express.js server
- MongoDB integration
- JWT authentication
- Session management

## 📋 Requirements

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (for database features)
- **Git** for version control

## 🚀 Deployment

### Using PM2

The project includes PM2 configuration for production deployment:

```bash
pm2 start ecosystem.config.cjs
```

### Manual Deployment

1. Build frontend applications
2. Set NODE_ENV=production
3. Configure production database
4. Start with `npm start`

## 📚 Documentation

- [Enterprise Methodology](docs/ENTERPRISE-METHODOLOGY.md)
- [System Knowledge Base](docs/SYSTEM-KNOWLEDGE-BASE.md)
- [Test Environment Guide](README-TEST-ENV.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🏗️ Architecture

The platform follows a clean architecture pattern with:
- Separation of concerns
- Modular structure
- Scalable design
- Enterprise-ready components

## 🔒 Security

- JWT-based authentication
- Session management
- CORS configuration
- Environment variable protection
- Input validation

## 🧪 Testing

Run tests with:
```bash
npm test
```

The project includes:
- Unit tests
- Integration tests
- Component testing (Storybook)

## 📞 Support

For issues and questions:
- Check existing [Issues](https://github.com/Spen-Zosky/main-server/issues)
- Create a new issue if needed
- Review documentation in `/docs`

---

**Version**: 1.0.0  
**Last Updated**: July 2025