# ⚙️ Szybka Konfiguracja Nginx dla Photo Katharsis

## 📋 Informacje konfiguracyjne:

- **Folder:** `/var/www/photokatharsis`
- **PM2 nazwa:** `photo-katharsis`
- **Port:** `3001`
- **Domena:** `katharsis.risegen.pl`

---

## 🚀 KROK 1: Skopiuj plik konfiguracji

```bash
# Na VPS, w katalogu projektu
cd /var/www/photokatharsis

# Skopiuj plik nginx.conf do Nginx
sudo cp nginx.conf /etc/nginx/sites-available/photo-katharsis
```

---

## 🚀 KROK 2: Aktywuj konfigurację

```bash
# Utwórz symlink
sudo ln -s /etc/nginx/sites-available/photo-katharsis /etc/nginx/sites-enabled/

# Test konfiguracji
sudo nginx -t

# Powinno pokazać:
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

## 🚀 KROK 3: Przeładuj Nginx

```bash
sudo systemctl reload nginx

# Sprawdź status
sudo systemctl status nginx
```

---

## 🚀 KROK 4: Sprawdź czy działa

```bash
# Test portu aplikacji
curl http://localhost:3001

# Test przez Nginx
curl http://katharsis.risegen.pl

# Lub otwórz w przeglądarce:
# http://katharsis.risegen.pl
```

---

## 🔒 KROK 5: Dodaj SSL (HTTPS)

```bash
# Zainstaluj certyfikat Let's Encrypt
sudo certbot --nginx -d katharsis.risegen.pl

# Certbot automatycznie:
# - Wygeneruje certyfikat
# - Zaktualizuje konfigurację Nginx
# - Doda przekierowanie HTTP → HTTPS
```

---

## ✅ Weryfikacja - Czy wszystko działa?

### **Test 1: Aplikacja działa**
```bash
pm2 status
# photo-katharsis | online ✅
```

### **Test 2: Port nasłuchuje**
```bash
sudo lsof -i :3001
# node (PM2) ✅
```

### **Test 3: Nginx działa**
```bash
sudo systemctl status nginx
# active (running) ✅
```

### **Test 4: Strona ładuje się**
```bash
curl -I http://katharsis.risegen.pl
# HTTP/1.1 200 OK ✅
```

---

## 🔧 Troubleshooting

### **Problem: 502 Bad Gateway**

```bash
# Sprawdź czy aplikacja działa
pm2 logs photo-katharsis

# Restart aplikacji
pm2 restart photo-katharsis

# Sprawdź port
sudo lsof -i :3001
```

### **Problem: 404 Not Found**

```bash
# Sprawdź czy Nginx ma konfigurację
ls -la /etc/nginx/sites-enabled/ | grep photo

# Powinno pokazać symlink do photo-katharsis
```

### **Problem: Certbot błąd**

```bash
# Sprawdź czy DNS działa
dig katharsis.risegen.pl +short

# Jeśli nie pokazuje IP VPS, poczekaj na propagację DNS
```

---

## 📝 Kompletna konfiguracja Nginx

Plik już istnieje w projekcie: `nginx.conf`

Kluczowe ustawienia:
```nginx
server_name katharsis.risegen.pl;        # Subdomena
proxy_pass http://localhost:3001;        # Port aplikacji
alias /var/www/photokatharsis/...;       # Folder projektu
```

---

## 🎯 Quick Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (bez downtime)
sudo systemctl reload nginx

# Test konfiguracji
sudo nginx -t

# Logi Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart PM2
pm2 restart photo-katharsis

# Logi PM2
pm2 logs photo-katharsis
```

---

## ✅ Checklist

- [ ] DNS skonfigurowany (rekord A: katharsis → IP VPS)
- [ ] Aplikacja działa na VPS (pm2 status = online)
- [ ] Plik nginx.conf skopiowany do `/etc/nginx/sites-available/`
- [ ] Symlink utworzony w `/etc/nginx/sites-enabled/`
- [ ] `sudo nginx -t` = successful
- [ ] Nginx przeładowany (`sudo systemctl reload nginx`)
- [ ] Strona ładuje się w przeglądarce
- [ ] SSL zainstalowany (`sudo certbot --nginx`)
- [ ] HTTPS działa (zielona kłódka)

**🎉 Nginx skonfigurowany pomyślnie!**
