# Test Environment - Main Server Platform

**Creato**: 2025-07-25T18:10:00  
**Scopo**: Ambiente isolato per modificare interfacce web senza rischi  
**Status**: ✅ CONFIGURATO E PRONTO ALL'USO  

## 🎯 Obiettivo

Ambiente di test separato dove puoi:
- ✅ **Modificare interfacce web** senza toccare la produzione
- ✅ **Testare cambiamenti** in sicurezza  
- ✅ **Promuovere** solo quando soddisfatto
- ✅ **Rollback** immediato se necessario

## 🌐 Configurazione Ambienti

### Production Environment (INTOCCABILE)
- **Frontend**: http://79.72.47.188:5173
- **Backend**: http://79.72.47.188:3000
- **Storybook**: http://79.72.47.188:6006
- **Status**: 🔒 PROTETTO - Solo per uso finale

### Test Environment (PLAYGROUND)  
- **Frontend**: http://79.72.47.188:5174
- **Backend**: http://79.72.47.188:3001 (futuro)
- **Storybook**: http://79.72.47.188:6007
- **Status**: 🧪 APERTO - Fai tutte le modifiche qui

## 🚀 Come Usare

### 1. Avviare Test Environment
```bash
cd /home/ubuntu/main-server-test/scripts
./start-test-env.sh
```
**Risultato**: Frontend test disponibile su porta 5174

### 2. Verificare Status Ambienti
```bash
./env-status.sh
```
**Risultato**: Mostra stato di production e test

### 3. Sviluppare Modifiche
1. **Apri**: http://79.72.47.188:5174 (test environment)
2. **Modifica**: Files in `/home/ubuntu/main-server-test/src/frontend-test/`
3. **Testa**: Cambiamenti visibili immediatamente (hot-reload)
4. **Confronta**: Con production su http://79.72.47.188:5173

### 4. Sincronizzare da Production (se necessario)
```bash
./sync-from-production.sh
```
**Usa quando**: Vuoi ripartire dallo stato production aggiornato

### 5. Promuovere a Production (quando soddisfatto)
```bash
./promote-to-production.sh
```
**ATTENZIONE**: Sostituisce production con le tue modifiche test

## 📁 Struttura Directory

```
/home/ubuntu/main-server-test/
├── src/
│   └── frontend-test/          # Frontend test (porta 5174)
│       ├── src/
│       │   ├── components/     # ← MODIFICA QUI I COMPONENTI
│       │   ├── pages/         # ← MODIFICA QUI LE PAGINE  
│       │   ├── context/       # ← MODIFICA QUI I CONTEXT
│       │   └── services/      # ← MODIFICA QUI I SERVIZI
│       ├── package.json       # Config test environment
│       ├── vite.config.js     # Porta 5174 configurata
│       └── .env.test         # Variabili test environment
└── scripts/
    ├── start-test-env.sh      # Avvia test environment
    ├── env-status.sh          # Status ambienti
    ├── sync-from-production.sh # Sincronizza da production
    └── promote-to-production.sh # Promuovi a production
```

## 🛡️ Sicurezza

### ✅ Cosa è SICURO
- Modificare qualsiasi file in `/home/ubuntu/main-server-test/`
- Avviare/fermare test environment (porta 5174)
- Testare cambiamenti senza limiti
- Sincronizzare da production

### ⚠️ Cosa è PERICOLOSO  
- `promote-to-production.sh` - Sostituisce production
- Modificare files in `/home/ubuntu/main-server/` (production)

### 🔒 Protezioni Implementate
- **Backup automatico** prima di ogni promozione
- **Conferma esplicita** per operazioni pericolose
- **Verifica funzionamento** prima di sostituzioni
- **Rollback capabilities** con backup salvati

## 🧪 Workflow di Sviluppo

### Scenario Tipico
1. **Start**: `./start-test-env.sh` → Test environment su 5174
2. **Develop**: Modifica `/home/ubuntu/main-server-test/src/frontend-test/src/pages/LandingPage.jsx`
3. **Test**: Verifica su http://79.72.47.188:5174
4. **Compare**: Con production su http://79.72.47.188:5173  
5. **Promote**: `./promote-to-production.sh` quando soddisfatto

### Esempio Modifica
```bash
# 1. Avvia test
cd /home/ubuntu/main-server-test/scripts
./start-test-env.sh

# 2. In altro terminale, modifica file
nano /home/ubuntu/main-server-test/src/frontend-test/src/pages/LandingPage.jsx

# 3. Visualizza immediatamente su:
# http://79.72.47.188:5174

# 4. Quando soddisfatto:
./promote-to-production.sh
```

## 📊 Vantaggi

### Per Lo Sviluppatore
- ✅ **Zero rischi** - Production mai toccata durante sviluppo
- ✅ **Hot reload** - Cambiamenti visibili immediatamente
- ✅ **Rollback facile** - Backup automatici di ogni stato
- ✅ **Test reali** - Stesso stack production

### Per Il Sistema
- ✅ **Uptime garantito** - Production sempre online
- ✅ **Stabilità** - Solo codice testato va in production  
- ✅ **Traceability** - Backup di ogni cambiamento
- ✅ **Consistency** - Stesso environment setup

## 🔧 Troubleshooting

### Test Environment Non Si Avvia
```bash
# Verifica stato porte
./env-status.sh

# Uccidi processi su porta 5174
kill $(lsof -ti:5174)

# Riavvia
./start-test-env.sh
```

### Sincronizzazione Fallita  
```bash
# Verifica backup disponibili
ls -la /home/ubuntu/main-server-test/src/frontend-test/backups/

# Ripristina backup se necessario
cd /home/ubuntu/main-server-test/src/frontend-test/
tar -xzf backups/test-backup-TIMESTAMP.tar.gz
```

### Production Compromessa
```bash
# Usa backup automatico
cd /home/ubuntu/main-server/
ls -la backups/production-backup-*

# Ripristina
tar -xzf backups/production-backup-before-promotion-TIMESTAMP.tar.gz
npm install && npm run dev
```

## 🎉 Ready to Go!

**Test environment configurato e pronto all'uso!**

```bash
cd /home/ubuntu/main-server-test/scripts
./start-test-env.sh
```

**Poi apri**: http://79.72.47.188:5174 e inizia a modificare!