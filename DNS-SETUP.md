# 🌐 Konfiguracja DNS dla Strony Szymona

## Wymagania:
- Własna domena (np. `szymon-fotografia.pl`)
- Dostęp do panelu DNS u swojego operatora domeny
- IP serwera VPS

---

## 📋 KROK 1: Sprawdź IP swojego VPS

Zaloguj się na VPS i sprawdź publiczny adres IP:

```bash
curl ifconfig.me
# lub
ip addr show
```

Zapisz ten adres IP (np. `123.45.67.89`)

---

## 📋 KROK 2: Konfiguracja DNS u operatora domeny

### **Popularne operatorzy:**
- **OVH** - https://www.ovh.pl/manager/
- **home.pl** - https://panel.home.pl
- **Cloudflare** - https://dash.cloudflare.com
- **nazwa.pl** - https://panel.nazwa.pl
- **GoDaddy** - https://dcc.godaddy.com

### **Dodaj następujące rekordy DNS:**

#### **Rekord A (podstawowy):**
```
Type: A
Name: @ (lub pozostaw puste)
Value: 123.45.67.89 (TWÓJ_IP_VPS)
TTL: 3600 (lub Auto)
```

#### **Rekord A dla www:**
```
Type: A
Name: www
Value: 123.45.67.89 (TWÓJ_IP_VPS)
TTL: 3600 (lub Auto)
```

#### **Alternatywnie: Rekord CNAME dla www:**
```
Type: CNAME
Name: www
Value: @ (lub twoja-domena.pl)
TTL: 3600
```

### **Przykład konfiguracji:**

| Typ   | Nazwa            | Wartość           | TTL  |
|-------|------------------|-------------------|------|
| A     | @                | 123.45.67.89      | 3600 |
| A     | www              | 123.45.67.89      | 3600 |

---

## 📋 KROK 3: Sprawdź propagację DNS

DNS może potrzebować do 48h na propagację (zazwyczaj 1-4h).

### **Sprawdź online:**
- https://dnschecker.org
- https://www.whatsmydns.net

### **Sprawdź z terminala:**
```bash
# Sprawdź rekord A
dig twoja-domena.pl +short
nslookup twoja-domena.pl

# Sprawdź www
dig www.twoja-domena.pl +short
```

Jeśli widzisz IP swojego VPS - DNS działa! ✅

---

## 📋 KROK 4: Opcjonalne rekordy DNS

### **MX (email)** - jeśli chcesz odbierać email na @twoja-domena.pl:
```
Type: MX
Name: @
Value: mail.twoja-domena.pl
Priority: 10
```

### **TXT (weryfikacja, SPF):**
```
Type: TXT
Name: @
Value: "v=spf1 ip4:123.45.67.89 -all"
```

---

## 🔍 Weryfikacja przed SSL

Przed uruchomieniem Certbot (SSL), upewnij się że:

```bash
# Na VPS sprawdź czy domena wskazuje na serwer:
ping twoja-domena.pl
ping www.twoja-domena.pl

# Powinno pokazać IP twojego VPS
```

---

## 🌐 Konfiguracja dla Cloudflare (jeśli używasz)

Jeśli używasz Cloudflare jako DNS:

1. **Dodaj domenę do Cloudflare**
2. **Zmień nameservery u operatora domeny** na:
   ```
   NS1: nico.ns.cloudflare.com
   NS2: tina.ns.cloudflare.com
   ```
3. **W Cloudflare dodaj rekordy A:**
   - `@` → IP_VPS
   - `www` → IP_VPS

4. **Wyłącz proxy (pomarańczowa chmurka) podczas instalacji SSL!**
   - Kliknij pomarańczową chmurką aby była szara
   - Po zainstalowaniu SSL możesz włączyć proxy

---

## 📱 Subdomena (opcjonalnie)

Jeśli chcesz mieć `portfolio.twoja-domena.pl`:

```
Type: A
Name: portfolio
Value: 123.45.67.89
TTL: 3600
```

Potem w Nginx użyj `server_name portfolio.twoja-domena.pl;`

---

## ⚠️ Częste problemy

### **DNS nie działa po 24h:**
- Sprawdź czy nameservery są poprawne
- Wyczyść cache DNS: `sudo systemd-resolve --flush-caches`
- Sprawdź u operatora czy domena jest aktywna

### **Certbot pokazuje błąd:**
```
Error: DNS problem: NXDOMAIN looking up A for twoja-domena.pl
```
**Rozwiązanie:** DNS jeszcze się nie rozpropagowało, poczekaj kilka godzin.

### **Strona nie działa ale ping działa:**
- Sprawdź Nginx: `sudo nginx -t`
- Sprawdź porty: `sudo ufw status`
- Sprawdź logi: `sudo tail -f /var/log/nginx/error.log`

---

## ✅ Checklist DNS:

- [ ] Mam dostęp do panelu DNS u operatora domeny
- [ ] Znam IP swojego VPS
- [ ] Dodałem rekord A dla `@` wskazujący na IP VPS
- [ ] Dodałem rekord A (lub CNAME) dla `www`
- [ ] DNS się rozpropagował (sprawdzone przez dnschecker.org)
- [ ] `ping twoja-domena.pl` zwraca IP VPS
- [ ] `ping www.twoja-domena.pl` zwraca IP VPS
- [ ] Gotowy do uruchomienia Certbot dla SSL

**🎉 DNS skonfigurowany poprawnie!**

---

## 📞 Popularne panele DNS - linki:

- **OVH:** Panel → Domeny → Twoja domena → Strefa DNS
- **home.pl:** Domeny → Zarządzaj → DNS
- **Cloudflare:** DNS → Add record
- **nazwa.pl:** Usługi → Twoja domena → Zmień serwery DNS
- **GoDaddy:** My Products → Domain → DNS
