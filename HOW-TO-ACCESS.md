# 🌐 Jak Połączyć się ze Stroną Szymon Baranowski Portfolio

---

## 🏠 LOKALNIE (na twoim komputerze)

### **Uruchom serwer deweloperski:**

```bash
cd "/Users/michaldygdon/Library/Mobile Documents/com~apple~CloudDocs/Projekty/Strony/Strona Szymona/szymon-next"

# Uruchom
npm run dev
```

### **Otwórz w przeglądarce:**
- **Strona główna:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin/login
  - Email: `admin@admin.com`
  - Hasło: `admin`

---

## 🌍 NA VPS (po deployment)

### **Opcja 1: Przez subdomenę (ZALECANE)**

Po skonfigurowaniu DNS i SSL:

```
https://szymonbaranowski.pl
```

**Admin panel:**
```
https://szymonbaranowski.pl/admin/login
```

### **Opcja 2: Bezpośrednio przez IP (przed DNS)**

Jeśli DNS jeszcze nie działa, możesz użyć IP:

```
http://IP_TWOJEGO_VPS:3001
```

⚠️ **Uwaga:** Nginx musi być skonfigurowany, inaczej użyj portu bezpośrednio.

### **Opcja 3: Przez tunel SSH (testowanie)**

Jeśli chcesz przetestować przed konfiguracją Nginx:

```bash
# Na swoim komputerze (nie na VPS!)
ssh -L 3001:localhost:3001 user@IP_VPS

# Następnie otwórz:
http://localhost:3001
```

---

## 📋 KROK PO KROKU: Pierwsza wizyta po deployment

### **1. Sprawdź czy aplikacja działa na VPS:**

```bash
# Zaloguj się na VPS
ssh user@IP_VPS

# Sprawdź status PM2
pm2 status

# Powinno pokazać:
# szymonbaranowski | online
```

### **2. Sprawdź czy port nasłuchuje:**

```bash
# Na VPS
curl http://localhost:3001

# Powinno zwrócić HTML strony
```

### **3. Sprawdź Nginx:**

```bash
# Na VPS
sudo nginx -t
sudo systemctl status nginx

# Nginx powinien być active (running)
```

### **4. Sprawdź DNS (jeśli używasz domeny):**

```bash
# Na swoim komputerze
dig szymonbaranowski.pl +short

# Powinno pokazać IP twojego VPS
```

### **5. Otwórz w przeglądarce:**

**Bez SSL (przed certbot):**
```
http://szymonbaranowski.pl
```

**Z SSL (po certbot):**
```
https://szymonbaranowski.pl
```

---

## 🔐 Logowanie do Admin Panel

### **Domyślne dane logowania:**

```
URL: https://szymonbaranowski.pl/admin/login
Email: admin@admin.com
Hasło: admin
```

⚠️ **WAŻNE:** Zmień hasło po pierwszym logowaniu!

### **Jak zmienić hasło:**

Po wdrożeniu na VPS, zmień hasło admina:

1. Zaloguj się na VPS
2. Wejdź do katalogu projektu:
   ```bash
   cd /var/www/szymonbaranowski
   ```
3. Utwórz nowego admina z nowym hasłem:
   ```bash
   # Edytuj scripts/seed-admin.js i zmień hasło
   nano scripts/seed-admin.js
   
   # Uruchom ponownie
   node scripts/seed-admin.js
   ```

---

## 🚨 Troubleshooting - Strona nie działa

### **Problem 1: Strona nie ładuje się**

**Sprawdź:**
```bash
# Na VPS
pm2 status                      # Czy aplikacja działa?
pm2 logs szymonbaranowski --err  # Czy są błędy?
sudo nginx -t                   # Czy Nginx jest OK?
sudo systemctl status nginx     # Czy Nginx działa?
```

**Rozwiązanie:**
```bash
pm2 restart szymonbaranowski
sudo systemctl restart nginx
```

### **Problem 2: DNS nie działa**

**Sprawdź:**
```bash
# Na swoim komputerze
ping szymonbaranowski.pl

# Powinno pokazać IP VPS
```

**Jeśli nie działa:**
- Sprawdź konfigurację DNS u operatora domeny
- Poczekaj 1-4h na propagację DNS
- Użyj https://dnschecker.org do sprawdzenia

### **Problem 3: SSL nie działa**

**Sprawdź certyfikat:**
```bash
# Na VPS
sudo certbot certificates
```

**Odnów certyfikat:**
```bash
sudo certbot renew --dry-run
sudo certbot --nginx -d szymonbaranowski.pl
```

### **Problem 4: 502 Bad Gateway**

**Przyczyna:** Nginx nie może połączyć się z aplikacją.

**Sprawdź:**
```bash
pm2 status                    # Czy aplikacja działa?
sudo lsof -i :3001           # Czy port 3001 nasłuchuje?
pm2 logs szymonbaranowski     # Czy są błędy?
```

**Rozwiązanie:**
```bash
pm2 restart szymonbaranowski
```

### **Problem 5: 404 Not Found**

**Przyczyna:** Nginx nie ma konfiguracji dla tej domeny.

**Sprawdź:**
```bash
ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-enabled/szymonbaranowski
```

**Rozwiązanie:**
```bash
sudo ln -s /etc/nginx/sites-available/szymonbaranowski /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📱 Dostęp z różnych urządzeń

### **Z komputera:**
```
https://szymonbaranowski.pl
```

### **Z telefonu (ta sama sieć WiFi):**
```
https://szymonbaranowski.pl
```

### **Z telefonu (internet mobilny):**
```
https://szymonbaranowski.pl
```

Wszystkie urządzenia korzystają z tej samej domeny!

---

## 🔒 Bezpieczeństwo

### **Po pierwszym wdrożeniu:**

1. ✅ Zmień hasło admina
2. ✅ Sprawdź czy SSL działa (HTTPS)
3. ✅ Sprawdź czy firewall jest aktywny:
   ```bash
   sudo ufw status
   ```
4. ✅ Regularnie aktualizuj system:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

---

## 📊 Dashboard i Statystyki

### **Monitoring aplikacji (PM2):**
```bash
# Na VPS
pm2 monit
```

### **Logi Nginx:**
```bash
# Na VPS
sudo tail -f /var/log/nginx/access.log  # Dostępy
sudo tail -f /var/log/nginx/error.log   # Błędy
```

### **Logi aplikacji:**
```bash
# Na VPS
pm2 logs szymonbaranowski
```

---

## 🎯 Szybki Test - Czy wszystko działa?

### **Checklist:**

- [ ] `pm2 status` pokazuje "online"
- [ ] `curl http://localhost:3001` zwraca HTML
- [ ] `sudo nginx -t` pokazuje "successful"
- [ ] `dig szymonbaranowski.pl` pokazuje IP VPS
- [ ] Strona ładuje się w przeglądarce
- [ ] HTTPS działa (zielona kłódka)
- [ ] Admin panel działa (/admin/login)
- [ ] Można zalogować się domyślnymi danymi

---

## 📞 Szybkie adresy URL

| Co                  | URL                                      |
|---------------------|------------------------------------------|
| Strona główna       | https://szymonbaranowski.pl             |
| Portfolio           | https://szymonbaranowski.pl/portfolio   |
| Kontakt             | https://szymonbaranowski.pl/kontakt     |
| O mnie              | https://szymonbaranowski.pl/o-mnie      |
| Admin Login         | https://szymonbaranowski.pl/admin/login |
| Admin Dashboard     | https://szymonbaranowski.pl/admin/dashboard |
| Admin Kategorie     | https://szymonbaranowski.pl/admin/categories |
| Admin Portfolio     | https://szymonbaranowski.pl/admin/portfolio |

---

## 💡 Wskazówki

1. **Używaj HTTPS:** Zawsze używaj `https://` po skonfigurowaniu SSL
2. **Zakładka prywatna:** Jeśli widzisz starą wersję, użyj trybu prywatnego (Ctrl+Shift+N)
3. **Cache:** Wyczyść cache przeglądarki jeśli zmiany nie są widoczne (Ctrl+Shift+R)
4. **Mobilne przeglądanie:** Testuj na telefonie w trybie prywatnym

**🎉 Powodzenia z Szymon Baranowski Portfolio!**
