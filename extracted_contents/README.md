# main-server Claude Integration

## 📦 Installazione

1. Estrai il pacchetto:
   ```bash
   unzip claude_vscode_platform_pack_verified.zip -d ~/
   ```

2. Rendi eseguibili gli script:
   ```bash
   chmod +x ~/main-server/platform
   chmod +x ~/main-server/tools/scripts/*.sh
   ```

3. Esegui l'inizializzazione:
   ```bash
   ~/main-server/platform init
   ```

## 📁 Struttura
- `platform` — CLI di controllo
- `tools/scripts/` — Script bash di automazione
- `examples/` — Prompt Claude e risposte
- `html/` — Dashboard interattiva
- `.github/` — Automazione GitHub Actions

## 🧠 Comandi principali

```bash
~/main-server/platform init      # Inizializza ambiente
~/main-server/platform export    # Esporta risposte Claude in Markdown
~/main-server/platform logs      # Visualizza log cron
```
