# 🔄 Konfiguracja Wielu Aplikacji Next.js na Jednym VPS

## Scenariusz:
Masz już jedną stronę Next.js działającą na VPS i chcesz dodać drugą (Strona Szymona).

---

## 📋 Założenia:

**Aplikacja 1 (istniejąca - np. RiseGen):**
- Katalog: `/var/www/risegen`
- Port: `3000`
- Domena: `risegen.pl`
- PM2 name: `risegen`

**Aplikacja 2 (nowa - Szymon):**
- Katalog: `/var/www/szymonbaranowski`
- Port: `3001` ⚠️ **INNY PORT!**
- Domena: `szymonbaranowski.pl`
- PM2 name: `szymonbaranowski`

---

## 📋 KROK 1: Sprawdź co już działa

```bash
# Sprawdź działające aplikacje PM2
pm2 list

# Sprawdź porty
sudo lsof -i :3000  # Pokazuje co używa portu 3000
sudo lsof -i :3001  # Powinno być puste

# Sprawdź konfiguracje Nginx
ls -la /etc/nginx/sites-enabled/
```

---

## 📋 KROK 2: Sklonuj nową aplikację

```bash
cd /var/www
sudo git clone https://github.com/TWOJE_KONTO/szymonbaranowski.git
sudo chown -R $USER:$USER /var/www/szymonbaranowski
cd szymonbaranowski
```

---

## 📋 KROK 3: Zaktualizuj ecosystem.config.js

**Ważne:** Zmień port na `3001`!

```javascript
module.exports = {
  apps: [{
    name: 'szymonbaranowski',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/szymonbaranowski',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001  // ⚠️ INNY PORT!
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
}
```

---

## 📋 KROK 4: Stwórz .env

```bash
nano .env
```

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="WYGENERUJ_NOWY_LOSOWY_STRING"
NEXTAUTH_URL="https://szymonbaranowski.pl"
NODE_ENV="production"
PORT=3001
```

**Wygeneruj secret:**
```bash
openssl rand -base64 32
```

---

## 📋 KROK 5: Build i uruchomienie

```bash
# Instaluj
npm install

# Prisma
npx prisma generate
npx prisma migrate deploy
node scripts/seed-admin.js

# Build
npm run build

# Uruchom z PM2
pm2 start ecosystem.config.js
pm2 save
```

---

## 📋 KROK 6: Konfiguracja Nginx (WIELE DOMEN)

### **Utwórz nową konfigurację dla Szymona:**

```bash
sudo nano /etc/nginx/sites-available/szymonbaranowski
```

**Wklej:**
```nginx
server {
    listen 80;
    server_name szymonbaranowski.pl www.szymonbaranowski.pl;

    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3001;  # ⚠️ PORT 3001!
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /uploads {
        alias /var/www/szymonbaranowski/public/uploads;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

### **Aktywuj konfigurację:**

```bash
sudo ln -s /etc/nginx/sites-available/szymonbaranowski /etc/nginx/sites-enabled/
sudo nginx -t  # Test
sudo systemctl reload nginx
```

---

## 📋 KROK 7: Sprawdź działanie obu aplikacji

```bash
# Lista PM2
pm2 list

# Powinno pokazać:
# ┌─────┬──────────────────┬─────────┬────────┬───────┐
# │ id  │ name             │ status  │ cpu    │ memory│
# ├─────┼──────────────────┼─────────┼────────┼───────┤
# │ 0   │ risegen          │ online  │ 0%     │ 50mb  │
# │ 1   │ szymonbaranowski │ online  │ 0%     │ 50mb  │
# └─────┴──────────────────┴─────────┴────────┴───────┘

# Sprawdź logi
pm2 logs szymonbaranowski --lines 20

# Test portów
curl http://localhost:3000  # RiseGen
curl http://localhost:3001  # Szymon
```

---

## 📋 KROK 8: SSL dla obu domen

### **Dla domeny Szymona:**

```bash
sudo certbot --nginx -d szymonbaranowski.pl -d www.szymonbaranowski.pl
```

Certbot automatycznie:
- Wygeneruje certyfikat SSL
- Zaktualizuje konfigurację Nginx
- Doda przekierowanie HTTP → HTTPS

### **Lista certyfikatów:**

```bash
sudo certbot certificates
```

Powinno pokazać obydwie domeny:
```
Found the following certs:
  Certificate Name: risegen.pl
    Domains: risegen.pl www.risegen.pl
  Certificate Name: szymonbaranowski.pl
    Domains: szymonbaranowski.pl www.szymonbaranowski.pl
```

---

## 📋 KROK 9: Struktura katalogów

Twoja struktura powinna wyglądać tak:

```
/var/www/
├── risegen/
│   ├── .next/
│   ├── node_modules/
│   ├── prisma/
│   │   └── dev.db
│   ├── public/
│   │   └── uploads/
│   ├── package.json
│   └── ecosystem.config.js (PORT: 3000)
│
└── szymonbaranowski/
    ├── .next/
    ├── node_modules/
    ├── prisma/
    │   └── dev.db
    ├── public/
    │   └── uploads/
    ├── package.json
    └── ecosystem.config.js (PORT: 3001)
```

---

## 📋 KROK 10: Firewall (jeśli używasz UFW)

```bash
# Sprawdź status
sudo ufw status

# Upewnij się że porty są otwarte
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH

# Status powinien pokazać:
# 80/tcp    ALLOW    Anywhere
# 443/tcp   ALLOW    Anywhere
# 22/tcp    ALLOW    Anywhere
```

⚠️ **Uwaga:** Porty 3000 i 3001 NIE powinny być otwarte publicznie! 
Nginx działa jako reverse proxy.

---

## 🔄 Aktualizacja aplikacji

### **RiseGen:**
```bash
cd /var/www/risegen
git pull
npm install
npm run build
pm2 restart risegen
```

### **Szymon Portfolio:**
```bash
cd /var/www/szymonbaranowski
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart szymonbaranowski
```

### **Lub użyj skryptu deploy.sh:**
```bash
cd /var/www/szymonbaranowski
./deploy.sh
```

---

## 📊 Monitoring wszystkich aplikacji

```bash
# Status wszystkich
pm2 status

# Logi wszystkich
pm2 logs

# Logi konkretnej aplikacji
pm2 logs risegen
pm2 logs szymonbaranowski

# Monitor CPU/RAM
pm2 monit

# Restart wszystkich
pm2 restart all

# Restart jednej
pm2 restart szymonbaranowski
```

---

## 🆘 Troubleshooting

### **Port już zajęty:**
```bash
# Sprawdź co używa portu
sudo lsof -i :3001

# Zabij proces jeśli potrzeba
kill -9 PID
```

### **Aplikacja się nie uruchamia:**
```bash
pm2 logs szymonbaranowski --err --lines 50
```

### **Nginx błąd:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### **Brak miejsca na dysku:**
```bash
df -h
pm2 flush  # Wyczyść logi PM2
```

### **Dwie aplikacje konfliktują:**
- Sprawdź czy używają różnych portów
- Sprawdź czy mają różne nazwy w PM2
- Sprawdź czy mają osobne bazy danych

---

## ✅ Checklist dla wielu aplikacji:

- [ ] Każda aplikacja ma swój katalog w `/var/www/`
- [ ] Każda aplikacja ma UNIKALNY port (3000, 3001, 3002...)
- [ ] Każda aplikacja ma swoją konfigurację Nginx w `/etc/nginx/sites-available/`
- [ ] Każda aplikacja ma UNIKALNĄ nazwę w PM2
- [ ] Każda aplikacja ma swoją bazę danych (osobny plik .db)
- [ ] Każda aplikacja ma swoją domenę skonfigurowaną w DNS
- [ ] Każda aplikacja ma swój certyfikat SSL
- [ ] UFW firewall pozwala na ruch HTTP/HTTPS (80, 443)
- [ ] Porty aplikacji (3000, 3001) NIE są otwarte publicznie

**🎉 Obydwie aplikacje działają równolegle!**

---

## 📈 Optymalizacja dla wielu aplikacji

### **Zwiększ limity PM2:**
```bash
pm2 set pm2:max_memory_restart 2G
```

### **Dodaj więcej RAM jeśli potrzeba:**
- 2 aplikacje: minimum 2GB RAM
- 3-4 aplikacje: 4GB RAM zalecane

### **Monitoruj zasoby:**
```bash
htop  # Monitorowanie CPU/RAM
pm2 monit  # Monitoring PM2
```
