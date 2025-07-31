# 🧪 **Guida Completa al Testing del Design System**

## 🌐 **Accesso Esterno Configurato**

**IMPORTANTE**: Tutti i servizi sono configurati per essere accessibili da browser esterni con `--host 0.0.0.0`.

---

## 🚀 **Test Rapidi (5 minuti)**

### 1. **Server di Sviluppo**
```bash
cd /home/ubuntu/main-server/src/frontend
npm run dev
```

**Accesso:**
- **Locale**: http://localhost:5173
- **Esterno**: http://[IP-SERVER]:5173
- **VM**: http://[VM-IP]:5173

### 2. **Storybook (Documentazione Interattiva)**
```bash
npm run storybook
```

**Accesso:**
- **Locale**: http://localhost:6006
- **Esterno**: http://[IP-SERVER]:6006
- **VM**: http://[VM-IP]:6006

### 3. **Pagina Test Completa**
Vai a: **`/design-system-test`**

**URL Completi:**
- http://[IP-SERVER]:5173/design-system-test
- http://localhost:5173/design-system-test

---

## 🔧 **Configurazione IP Server**

### Trova l'IP del tuo server:
```bash
# IP pubblico
curl -s ifconfig.me

# IP privato
hostname -I | awk '{print $1}'

# Tutti gli IP
ip addr show
```

### Test connettività:
```bash
# Test porte aperte
netstat -tlnp | grep -E ":(5173|6006)"

# Test accesso esterno
curl -I http://0.0.0.0:5173
curl -I http://0.0.0.0:6006
```

---

## 📋 **Checklist Test Accesso Esterno**

### ✅ **Server di Sviluppo (5173)**
- [ ] Carica da localhost
- [ ] Carica da IP esterno
- [ ] Routing funziona (`/design-system-test`)
- [ ] Hot reload funziona
- [ ] API proxy funziona

### ✅ **Storybook (6006)**
- [ ] Carica da localhost  
- [ ] Carica da IP esterno
- [ ] Tutte le stories caricano
- [ ] Controlli interattivi funzionano
- [ ] Theme switcher funziona

---

## 🎨 **Cosa Testare nel Design System**

### **Pagina Test Completa** (`/design-system-test`)

#### **Componenti Atomici**
- ✅ **Button**: 6 varianti (primary, secondary, accent, ghost, disabled, loading)
- ✅ **Text**: 8 varianti tipografiche (display, h1-h3, body, bodyLarge, caption, code)
- ✅ **Input**: 4 stati (standard, required, error, disabled)
- ✅ **Card**: 4 varianti (default, elevated, outlined, ghost)
- ✅ **Badge**: Status e semantic colors

#### **Componenti Molecolari**
- ✅ **SearchBox**: Input + submit button, interazione completa
- ✅ **Form**: Validazione in tempo reale, error handling

#### **Componenti Organismi**
- ✅ **Header**: 4 temi (default, ai, nose, hunter)

#### **Design Tokens**
- ✅ **Colors**: Brand, semantic, module colors
- ✅ **Spacing**: Scala modulare visualizzata
- ✅ **Shadows**: Sistema elevation completo

#### **Temi Modulo**
- 🤖 **AI-HRMS**: Blu intelligence, gradiente tech
- 🔬 **NOSE Research**: Verde growth, tema accademico  
- 🕸️ **Web-Hunter**: Arancione energy, tema mining

---

## 🔍 **Test Avanzati**

### **Test Responsivo**
Usa DevTools per testare:
- 📱 **Mobile**: 375px (iPhone)
- 📱 **Tablet**: 768px (iPad)
- 💻 **Desktop**: 1920px
- 🖥️ **Ultrawide**: 2560px

### **Test Accessibilità**
1. **Navigazione Keyboard**: Tab attraverso tutti gli elementi
2. **Screen Reader**: Test con lettore schermo browser
3. **Contrasto**: Verifica leggibilità colori
4. **Zoom**: 200% zoom browser

### **Test Performance**
```bash
# Build produzione
npm run build

# Preview build
npm run preview
# Accesso: http://[IP-SERVER]:4173

# Analisi bundle
ls -la dist-test/assets/
```

---

## 🌐 **Storybook - Test Completo**

### **Sezioni da Testare:**

#### **1. Design System/Introduction**
- Overview completo sistema
- Quick start guide
- Module themes showcase

#### **2. Design System/Design Tokens**
- Reference completo tokens
- Esempi usage CSS/JS
- Color palette interattiva

#### **3. Components/**
- Atoms: Button, Text, Input, Card, Badge
- Molecules: SearchBox, Form
- Organisms: Header

#### **4. Controlli Storybook**
- **Controls**: Modifica props in tempo reale
- **Actions**: Test eventi e callbacks
- **Accessibility**: Test automatici axe-core
- **Docs**: Documentazione auto-generata

#### **5. Toolbar Features**
- 🌓 **Theme Switcher**: Light/Dark
- 🤖 **Module Themes**: AI/NOSE/Hunter
- 📱 **Viewport**: Mobile/Tablet/Desktop
- 🌍 **Locale**: EN/IT/ES/FR

---

## 🚨 **Risoluzione Problemi**

### **Servizio non accessibile esternamente:**
```bash
# Verifica binding
netstat -tlnp | grep :5173
netstat -tlnp | grep :6006

# Verifica firewall (Ubuntu)
sudo ufw status
sudo ufw allow 5173
sudo ufw allow 6006

# Restart servizi
pkill -f "vite\|storybook"
npm run dev &
npm run storybook &
```

### **Errori di build:**
```bash
# Pulisci e ricostruisci
rm -rf node_modules dist dist-test
npm install
npm run tokens:build
npm run build
```

### **HMR non funziona:**
```bash
# Verifica HMR port (config vite.config.js)
# HMR usa porta +1000 (6173 per dev, 7006 per storybook)
sudo ufw allow 6173
sudo ufw allow 7006
```

---

## 🎯 **URL di Test Completi**

### **Sviluppo:**
- **Frontend**: http://[IP-SERVER]:5173
- **Test Page**: http://[IP-SERVER]:5173/design-system-test  
- **Storybook**: http://[IP-SERVER]:6006

### **Produzione:**
- **Preview**: http://[IP-SERVER]:4173
- **Built Storybook**: Servire `storybook-static/`

### **API Testing:**
- **Backend**: http://[IP-SERVER]:3000/api
- **Health**: http://[IP-SERVER]:3000/health

---

## 🏆 **Risultati Attesi**

Se tutto funziona:

✅ **Design System**: Tutti i componenti con stili coerenti
✅ **Accesso Esterno**: Raggiungibile da qualsiasi browser
✅ **Interattività**: Form, search, theme switching funzionanti  
✅ **Responsive**: Perfetto su tutti i device
✅ **Performance**: Caricamento veloce < 3s
✅ **Accessibilità**: WCAG 2.1 AA compliant
✅ **Documentation**: Storybook completo e navigabile

---

## 📊 **Metriche di Successo**

- **Lighthouse Score**: > 90 Performance, Accessibility, Best Practices
- **Bundle Size**: < 500KB gzipped per chunk
- **Load Time**: < 3s first load, < 1s subsequent
- **Accessibility**: 100% keyboard navigation, screen reader compatible
- **Cross-browser**: Chrome, Firefox, Safari compatible
- **Responsive**: Perfect layout 320px → 2560px

**🎉 Il design system è pronto per lo sviluppo enterprise dei moduli AI-HRMS, NOSE e Web-Hunter!**