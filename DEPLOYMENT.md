# 🚀 Deployment Next.js na VPS - Strona Szymona

## Wymagania VPS:
- Ubuntu 22.04 LTS lub nowszy
- Minimum 2GB RAM
- Node.js 18+ (najlepiej 20 LTS)
- Nginx
- PM2 (process manager)

---

## 📋 KROK 1: Przygotowanie VPS

### 1.1 Połącz się z VPS przez SSH:
```bash
ssh root@TWOJ_IP_VPS
# lub
ssh user@TWOJ_IP_VPS
```

### 1.2 Zaktualizuj system:
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Zainstaluj Node.js (LTS):
```bash
# Dodaj repozytorium NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Zainstaluj Node.js
sudo apt install -y nodejs

# Sprawdź wersje
node --version  # Powinno być v20.x
npm --version
```

### 1.4 Zainstaluj PM2 globalnie:
```bash
sudo npm install -g pm2
```

### 1.5 Zainstaluj Nginx:
```bash
sudo apt install -y nginx
```

### 1.6 Zainstaluj Git:
```bash
sudo apt install -y git
```

---

## 📋 KROK 2: Sklonuj repozytorium

### 2.1 Utwórz katalog dla aplikacji:
```bash
sudo mkdir -p /var/www
cd /var/www
```

### 2.2 Sklonuj projekt:
```bash
sudo git clone https://github.com/TWOJE_KONTO/szymonbaranowski.git
cd szymonbaranowski
```

### 2.3 Nadaj uprawnienia:
```bash
sudo chown -R $USER:$USER /var/www/szymonbaranowski
```

---

## 📋 KROK 3: Konfiguracja środowiska

### 3.1 Utwórz plik `.env`:
```bash
nano .env
```

### 3.2 Wklej następującą konfigurację (zmień wartości!):
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="WYGENERUJ_LOSOWY_STRING_64_ZNAKI"
NEXTAUTH_URL="https://szymonbaranowski.pl"

# Node
NODE_ENV="production"
```

**Jak wygenerować NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Zapisz plik: `Ctrl + O`, `Enter`, `Ctrl + X`

---

## 📋 KROK 4: Instalacja i Build

### 4.1 Zainstaluj zależności:
```bash
npm install
# lub
npm ci --production
```

### 4.2 Wygeneruj Prisma Client:
```bash
npx prisma generate
```

### 4.3 Uruchom migracje bazy danych:
```bash
npx prisma migrate deploy
```

### 4.4 Utwórz konto admina:
```bash
node scripts/seed-admin.js
```

**Domyślne dane logowania:**
- Email: `admin@admin.com`
- Hasło: `admin`

⚠️ **WAŻNE: Zmień hasło po pierwszym logowaniu!**

### 4.5 Zbuduj aplikację:
```bash
npm run build
```

---

## 📋 KROK 5: Uruchomienie z PM2

### 5.1 Utwórz plik ecosystem.config.js:
```bash
nano ecosystem.config.js
```

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
      PORT: 3000
    }
  }]
}
```

### 5.2 Uruchom aplikację:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Komendy PM2:**
- `pm2 status` - status aplikacji
- `pm2 logs` - logi
- `pm2 restart szymonbaranowski` - restart
- `pm2 stop szymonbaranowski` - zatrzymaj
- `pm2 delete szymonbaranowski` - usuń

---

## 📋 KROK 6: Konfiguracja Nginx

### 6.1 Utwórz konfigurację Nginx:
```bash
sudo nano /etc/nginx/sites-available/szymonbaranowski
```

### 6.2 Wklej konfigurację (ZMIEŃ DOMENĘ!):
```nginx
server {
    listen 80;
    server_name szymonbaranowski.pl www.szymonbaranowski.pl;

    client_max_body_size 20M; # Max rozmiar uploadu

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Statyczne pliki (obrazy, CSS, JS)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        alias /var/www/szymonbaranowski/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.3 Aktywuj konfigurację:
```bash
sudo ln -s /etc/nginx/sites-available/szymonbaranowski /etc/nginx/sites-enabled/
sudo nginx -t  # Test konfiguracji
sudo systemctl restart nginx
```

---

## 📋 KROK 7: SSL (HTTPS) z Let's Encrypt

### 7.1 Zainstaluj Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Wygeneruj certyfikat SSL:
```bash
sudo certbot --nginx -d szymonbaranowski.pl -d www.szymonbaranowski.pl
```

Postępuj zgodnie z instrukcjami:
- Podaj email
- Zaakceptuj regulamin
- Wybierz "2" (przekieruj HTTP na HTTPS)

### 7.3 Auto-odnowienie (certbot robi to automatycznie):
```bash
sudo certbot renew --dry-run  # Test odnowienia
```

---

## 📋 KROK 8: Utwórz katalog na uploady

```bash
mkdir -p /var/www/szymonbaranowski/public/uploads
chmod 755 /var/www/szymonbaranowski/public/uploads
```

---

## 📋 KROK 9: Testowanie

### 9.1 Sprawdź status aplikacji:
```bash
pm2 status
pm2 logs szymonbaranowski --lines 50
```

### 9.2 Otwórz w przeglądarce:
```
https://szymonbaranowski.pl
```

### 9.3 Zaloguj się do admin panelu:
```
https://szymonbaranowski.pl/admin/login
Email: admin@admin.com
Hasło: admin
```

---

## 🔄 Aktualizacja aplikacji

Gdy wprowadzisz zmiany w kodzie:

```bash
cd /var/www/szymonbaranowski

# Pobierz nowe zmiany
git pull origin main

# Zainstaluj nowe zależności (jeśli są)
npm install

# Uruchom migracje (jeśli są)
npx prisma migrate deploy
npx prisma generate

# Przebuduj aplikację
npm run build

# Zrestartuj PM2
pm2 restart szymonbaranowski

# Sprawdź logi
pm2 logs szymonbaranowski
```

---

## 🛡️ Bezpieczeństwo

### ✅ Co zrobić po deployment:
1. **Zmień hasło admina** w `/admin/settings`
2. **Ustaw silny NEXTAUTH_SECRET** (64+ znaków)
3. **Regularnie aktualizuj system:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
4. **Konfiguruj firewall (UFW):**
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```
5. **Regularne backupy bazy danych:**
   ```bash
   cp prisma/dev.db prisma/dev.db.backup-$(date +%Y%m%d)
   ```

---

## 🐛 Troubleshooting

### Aplikacja nie działa:
```bash
pm2 logs szymonbaranowski  # Sprawdź logi
pm2 restart szymonbaranowski
sudo nginx -t  # Test Nginx
sudo systemctl status nginx
```

### Baza danych znikła:
```bash
npx prisma migrate deploy
node scripts/seed-admin.js
```

### Upload nie działa:
```bash
chmod -R 755 /var/www/szymonbaranowski/public/uploads
```

### Port 3000 zajęty:
```bash
lsof -ti:3000  # Zobacz co używa portu
kill $(lsof -ti:3000)  # Zabij proces
pm2 restart szymonbaranowski
```

---

## 📊 Monitoring

### Logi PM2:
```bash
pm2 logs szymonbaranowski
pm2 monit  # Interaktywny monitoring
```

### Logi Nginx:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Checklist przed uruchomieniem:

- [ ] VPS gotowy (Ubuntu, min 2GB RAM)
- [ ] Domena skierowana na IP VPS (A record)
- [ ] Node.js zainstalowany
- [ ] Repozytorium sklonowane
- [ ] Plik `.env` utworzony i skonfigurowany
- [ ] Baza danych zmigrowana
- [ ] Konto admina utworzone
- [ ] Aplikacja zbudowana (`npm run build`)
- [ ] PM2 uruchomiony
- [ ] Nginx skonfigurowany
- [ ] SSL certyfikat zainstalowany
- [ ] Firewall skonfigurowany
- [ ] Katalog uploads utworzony

**🎉 Gotowe! Twoja strona jest online!**
