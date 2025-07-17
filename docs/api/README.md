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
