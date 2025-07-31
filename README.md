# Main Server

Enterprise-grade platform with clean architecture.

## Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/Spen-Zosky/main-server.git
cd main-server

Install dependencies:

bash# Backend dependencies
npm install

# Frontend dependencies
cd src/frontend
npm install
cd ../..

# Frontend-test dependencies  
cd src/frontend-test
npm install
cd ../..

Configure environment:

bashcp .env.example .env
# Edit .env with your configuration

Start the application:

bash# Development mode
npm run dev

# Production mode
npm start
Project Structure
main-server/
├── src/
│   ├── frontend/          # Production frontend (React)
│   └── frontend-test/     # Test frontend environment
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── tools/                 # Development tools
├── server.js              # Express server
├── package.json           # Backend dependencies
└── .env.example           # Environment template
Requirements

Node.js >= 18.0.0
npm >= 9.0.0
MongoDB (if using database features)

License
MIT
