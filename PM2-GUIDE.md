# 🔧 Konfiguracja PM2 dla Photo Katharsis

PM2 to menedżer procesów Node.js, który zapewnia:
- ✅ Auto-restart przy crashu
- ✅ Uruchamianie przy starcie systemu
- ✅ Logi aplikacji
- ✅ Monitoring CPU/RAM
- ✅ Zarządzanie wieloma aplikacjami

---

## 📋 KROK 1: Instalacja PM2 na VPS

### **Zainstaluj PM2 globalnie:**
```bash
sudo npm install -g pm2
```

### **Sprawdź wersję:**
```bash
pm2 --version
# Powinna być 5.x lub nowsza
```

---

## 📋 KROK 2: Uruchomienie aplikacji

### **Metoda 1: Użyj ecosystem.config.js (ZALECANE):**

Plik `ecosystem.config.js` już istnieje w projekcie!

```bash
cd /var/www/photo-katharsis

# Uruchom aplikację
pm2 start ecosystem.config.js

# Zapisz konfigurację
pm2 save

# Dodaj PM2 do autostartu systemowego
pm2 startup
# Skopiuj i wykonaj komendę którą PM2 wyświetli!
```

### **Metoda 2: Bezpośrednie uruchomienie:**
```bash
pm2 start npm --name "photo-katharsis" -- start
```

---

## 📋 KROK 3: Podstawowe komendy PM2

### **Status aplikacji:**
```bash
pm2 status
# lub
pm2 list
# lub
pm2 ls
```

**Przykład output:**
```
┌─────┬────────────────┬─────────┬────────┬───────┬─────────┐
│ id  │ name           │ status  │ cpu    │ memory│ restart │
├─────┼────────────────┼─────────┼────────┼───────┼─────────┤
│ 0   │ risegen        │ online  │ 0%     │ 45mb  │ 0       │
│ 1   │ photo-katharsis│ online  │ 0%     │ 48mb  │ 0       │
└─────┴────────────────┴─────────┴────────┴───────┴─────────┘
```

### **Sprawdź logi:**
```bash
# Wszystkie logi
pm2 logs

# Logi konkretnej aplikacji
pm2 logs photo-katharsis

# Ostatnie 50 linii
pm2 logs photo-katharsis --lines 50

# Tylko błędy
pm2 logs photo-katharsis --err

# Logi w czasie rzeczywistym + czyszczenie ekranu
pm2 flush  # Wyczyść stare logi
pm2 logs photo-katharsis --lines 0
```

### **Restart aplikacji:**
```bash
# Restart konkretnej aplikacji
pm2 restart photo-katharsis

# Restart wszystkich
pm2 restart all

# Restart z przeładowaniem kodu (graceful reload)
pm2 reload photo-katharsis
```

### **Stop/Start:**
```bash
# Stop
pm2 stop photo-katharsis

# Start ponownie
pm2 start photo-katharsis

# Stop wszystkich
pm2 stop all

# Delete (usuwa z listy PM2)
pm2 delete photo-katharsis
```

### **Monitoring:**
```bash
# Monitor CPU/RAM w czasie rzeczywistym
pm2 monit

# Szczegóły aplikacji
pm2 show photo-katharsis

# Szczegóły w JSON
pm2 jlist
```

---

## 📋 KROK 4: Autorestart przy restarcie serwera

### **Skonfiguruj PM2 do autostartu:**

```bash
# Generuj skrypt startup dla systemd
pm2 startup

# PM2 wyświetli komendę typu:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u USERNAME --hp /home/USERNAME

# SKOPIUJ I WYKONAJ TĘ KOMENDĘ!

# Następnie zapisz aktualną listę aplikacji
pm2 save
```

### **Test autostartu:**
```bash
# Restart serwera
sudo reboot

# Po restarcie SSH się ponownie i sprawdź
pm2 list
# Aplikacje powinny być uruchomione automatycznie!
```

### **Usuń autstart (jeśli potrzeba):**
```bash
pm2 unstartup
```

---

## 📋 KROK 5: Zarządzanie logami

### **Rotacja logów (aby nie zapełniały dysku):**

```bash
# Zainstaluj moduł rotacji logów
pm2 install pm2-logrotate

# Konfiguracja (opcjonalnie)
pm2 set pm2-logrotate:max_size 10M          # Max rozmiar pliku log
pm2 set pm2-logrotate:retain 30             # Zachowaj 30 plików
pm2 set pm2-logrotate:compress true         # Kompresuj stare logi
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD # Format daty
```

### **Ręczne czyszczenie logów:**
```bash
pm2 flush  # Wyczyść wszystkie logi
```

### **Lokalizacja logów:**
```
~/.pm2/logs/
├── photo-katharsis-out.log     # stdout
├── photo-katharsis-error.log   # stderr
```

Lub (jeśli są w projekcie jak w ecosystem.config.js):
```
/var/www/photo-katharsis/logs/
├── out.log
├── err.log
```

---

## 📋 KROK 6: Zmienne środowiskowe

### **Metoda 1: W ecosystem.config.js (ZALECANE):**

```javascript
module.exports = {
  apps: [{
    name: 'photo-katharsis',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DATABASE_URL: 'file:./dev.db'
    }
  }]
}
```

### **Metoda 2: Odczyt z pliku .env:**

PM2 automatycznie odczyta plik `.env` z katalogu projektu.

```bash
# Sprawdź czy PM2 widzi zmienne
pm2 show photo-katharsis
# Zobacz sekcję "Environment"
```

---

## 📋 KROK 7: Aktualizacja aplikacji z PM2

### **Standardowa aktualizacja:**

```bash
cd /var/www/photo-katharsis

# 1. Pobierz nowy kod
git pull origin main

# 2. Zainstaluj nowe zależności (jeśli są)
npm install

# 3. Przebuduj (jeśli zmiany w kodzie)
npm run build

# 4. Restart aplikacji
pm2 restart photo-katharsis

# 5. Sprawdź logi
pm2 logs photo-katharsis --lines 50
```

### **Lub użyj skryptu deploy.sh:**

```bash
cd /var/www/photo-katharsis
./deploy.sh
```

---

## 📋 KROK 8: Monitoring i alerty

### **Web dashboard (PM2 Plus - opcjonalne, płatne):**

```bash
pm2 plus
# Zarejestruj się i połącz aplikację
```

**Funkcje PM2 Plus:**
- 📊 Dashboard w przeglądarce
- 🔔 Alerty email/SMS
- 📈 Metryki historyczne
- 🐛 Error tracking

### **Proste monitoring bez PM2 Plus:**

```bash
# Status co 2 sekundy
watch -n 2 pm2 status

# Metryki
pm2 show photo-katharsis

# CPU/RAM w czasie rzeczywistym
pm2 monit
```

---

## 📋 KROK 9: Troubleshooting

### **Aplikacja się crashuje:**

```bash
# Sprawdź logi błędów
pm2 logs photo-katharsis --err --lines 100

# Sprawdź szczegóły
pm2 show photo-katharsis

# Sprawdź czy port jest zajęty
sudo lsof -i :3001

# Restart
pm2 restart photo-katharsis
```

### **PM2 nie uruchamia się po restarcie:**

```bash
# Skonfiguruj ponownie
pm2 unstartup
pm2 startup
# Wykonaj komendę którą PM2 wyświetli
pm2 save
```

### **Brak miejsca na dysku (logi za duże):**

```bash
# Wyczyść logi
pm2 flush

# Sprawdź rozmiar
du -sh ~/.pm2/logs/

# Zainstaluj rotację logów
pm2 install pm2-logrotate
```

### **Aplikacja używa za dużo pamięci:**

```bash
# Sprawdź użycie
pm2 monit

# Ustaw limit auto-restartu
pm2 restart photo-katharsis --max-memory-restart 500M

# Lub zaktualizuj ecosystem.config.js:
max_memory_restart: '500M'
```

---

## 📋 KROK 10: Zaawansowana konfiguracja ecosystem.config.js

### **Pełna konfiguracja z wszystkimi opcjami:**

```javascript
module.exports = {
  apps: [{
    // Podstawowe
    name: 'photo-katharsis',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/photo-katharsis',
    
    // Wydajność
    instances: 1,                    // Liczba instancji (1 dla SQLite!)
    exec_mode: 'fork',               // 'fork' lub 'cluster'
    
    // Auto-restart
    autorestart: true,
    watch: false,                    // NIE włączaj w produkcji!
    max_memory_restart: '1G',        // Restart po przekroczeniu limitu
    min_uptime: '10s',               // Min czas działania przed uznaniem za "online"
    max_restarts: 10,                // Max restartów w czasie
    
    // Czas
    kill_timeout: 5000,              // Czas na graceful shutdown (ms)
    listen_timeout: 3000,            // Czas oczekiwania na nasłuch portu
    
    // Środowisko
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    
    // Logi
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Źródło kontroli
    post_update: ['npm install', 'npm run build']  // Po git pull
  }]
}
```

---

## 📋 KROK 11: Cluster Mode (dla większego ruchu)

⚠️ **Uwaga:** Cluster mode NIE działa z SQLite! 
Jeśli chcesz cluster, musisz użyć PostgreSQL/MySQL.

### **Dla PostgreSQL (przyszłość):**

```javascript
module.exports = {
  apps: [{
    name: 'photo-katharsis',
    script: 'npm',
    args: 'start',
    instances: 'max',        // Tyle ile CPU
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DATABASE_URL: 'postgresql://...'  // PostgreSQL!
    }
  }]
}
```

---

## ✅ Checklist PM2:

- [ ] PM2 zainstalowany globalnie
- [ ] Aplikacja uruchomiona: `pm2 start ecosystem.config.js`
- [ ] Sprawdzony status: `pm2 status` pokazuje "online"
- [ ] Skonfigurowany autostart: `pm2 startup` + `pm2 save`
- [ ] Zainstalowana rotacja logów: `pm2 install pm2-logrotate`
- [ ] Przetestowany restart serwera (aplikacja wstaje automatycznie)
- [ ] Logi działają: `pm2 logs photo-katharsis`

---

## 🎯 Najczęściej używane komendy:

```bash
# Codzienne użycie
pm2 status                          # Status wszystkich
pm2 logs photo-katharsis            # Logi
pm2 restart photo-katharsis         # Restart
pm2 monit                          # Monitoring

# Deployment
pm2 stop photo-katharsis           # Stop przed aktualizacją
pm2 start ecosystem.config.js       # Start po aktualizacji
pm2 save                           # Zapisz stan

# Troubleshooting
pm2 logs photo-katharsis --err     # Tylko błędy
pm2 flush                          # Wyczyść logi
pm2 restart photo-katharsis --update-env  # Restart z nowymi env vars
```

---

## 📚 Dokumentacja PM2:

- Oficjalna dokumentacja: https://pm2.keymetrics.io/docs/usage/quick-start/
- Ecosystem File: https://pm2.keymetrics.io/docs/usage/application-declaration/
- PM2 Plus: https://app.pm2.io/

**🎉 PM2 skonfigurowany i gotowy do użycia!**
