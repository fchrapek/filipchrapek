---
title: "Jak dodać własną domenę do Coolify na serwerze Mikrus przez CloudFlare"
description: "Masz serwer VPS na Mikrusie, zainstalowałeś Coolify i chcesz podpiąć własną domenę z SSL? W tym poradniku pokażę Ci krok po kroku, jak to zrobić używając CloudFlare jako proxy z darmowym certyfikatem SSL."
publishDate: "10 October 2025"
tags: ["coolify", "cloudflare", "ssl", "self-hosted"]
---

Masz serwer VPS na Mikrusie, zainstalowałeś Coolify i chcesz podpiąć własną domenę z SSL? W tym poradniku pokażę Ci krok po kroku, jak to zrobić używając CloudFlare jako proxy z darmowym certyfikatem SSL.

![Cool dude](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXA3bTV1NjM2MW5ja2xscTgydWZtbzBwZ3d5NDc0ZXJjZWE0YTFyaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KXY5lB8yOarLy/giphy.gif)

## Czego potrzebujesz?

- Serwer VPS na [Mikrusie](https://mikr.us/) (Mini, Midi lub Maxi)
- Zainstalowane [Coolify](https://coolify.io/)
- Własna domena (np. z OVH, home.pl, CloudFlare)
- Konto [CloudFlare](https://www.cloudflare.com/) (darmowe)

## Dlaczego CloudFlare?

Serwery Mikrus mają zablokowane standardowe porty 80 i 443, co uniemożliwia bezpośrednie wystawienie strony na własnej domenie. CloudFlare rozwiązuje ten problem, działając jako proxy i zapewniając darmowy certyfikat SSL.

:::note[Dlaczego IPv6?]
Mikrus udostępnia pełny dostęp do IPv6, podczas gdy IPv4 jest ograniczony. CloudFlare doskonale współpracuje z IPv6, co pozwala ominąć ograniczenia portów 80/443. Użytkownicy końcowi nadal korzystają z IPv4 - CloudFlare automatycznie tłumaczy ruch! Więcej o tym przeczytasz w [poradniku Mikrusa o IPv6](https://wiki.mikr.us/o_co_chodzi_z_ipv6/).
:::

**Bonus:** CloudFlare zapewnia również ochronę przed atakami DDoS, cache CDN i wiele innych funkcji - wszystko za darmo!

## Krok 1: Sprawdź adresy IP swojego serwera

Zaloguj się przez SSH do serwera Mikrus i sprawdź swoje adresy IP:

```bash
# IPv4
curl -4 ifconfig.me

# IPv6
curl -6 ifconfig.me
```

Zapisz oba adresy - **adres IPv6 będzie kluczowy** dla tej konfiguracji!

## Krok 2: Dodaj domenę do CloudFlare

1. Zaloguj się do [dashboardu CloudFlare](https://dash.cloudflare.com/)
2. Kliknij **"Add a Site"**
3. Wpisz swoją domenę i kliknij **"Add site"**
4. Wybierz plan **Free** i kliknij **"Continue"**
5. CloudFlare zeskanuje Twoje obecne rekordy DNS

## Krok 3: Zmień serwery nazw u rejestratora domeny

CloudFlare wyświetli Ci dwa serwery nazw (nameservers), np.:
```
anna.ns.cloudflare.com
brad.ns.cloudflare.com
```

Przejdź do panelu swojego rejestratora domeny (OVH, home.pl, etc.) i zmień nameservery na te z CloudFlare.

:::warning[Czas propagacji]
Propagacja DNS może zająć od kilku minut do 24 godzin.
:::

## Krok 4: Skonfiguruj rekordy DNS w CloudFlare

W CloudFlare przejdź do **DNS → Records** i dodaj rekordy **AAAA** (IPv6):

### Dla głównej domeny:
| Pole             | Wartość                          |
| ---------------- | -------------------------------- |
| **Type**         | AAAA                             |
| **Name**         | @                                |
| **IPv6 address** | [Twój adres IPv6 z kroku 1]      |
| **Proxy status** | Proxied (pomarańczowa chmurka) |
| **TTL**          | Auto                             |

### Dla subdomeny www:
| Pole | Wartość |
|------|---------|
| **Type** | AAAA |
| **Name** | www |
| **IPv6 address** | [Ten sam adres IPv6] |
| **Proxy status** | Proxied |
| **TTL** | Auto |

:::important[Ważne]
Jeśli masz rekordy typu **A** (IPv4), usuń je! Konfiguracja z Mikrusem wymaga używania wyłącznie IPv6 z CloudFlare jako proxy.
:::

### Dla poczty (jeśli używasz osobnego serwera pocztowego):

Zostaw istniejące rekordy **MX** bez zmian i upewnij się, że mają **Proxy status: DNS only** (szara chmurka).

## Krok 5: Skonfiguruj SSL/TLS w CloudFlare

1. W menu CloudFlare przejdź do **SSL/TLS → Overview**
2. Wybierz tryb **Flexible**
3. Przejdź do **SSL/TLS → Edge Certificates**
4. Włącz:
   - **Always Use HTTPS**
   - **Automatic HTTPS Rewrites**

### Dlaczego Flexible?

W trybie **Flexible**:
- **Użytkownik ↔ CloudFlare:** HTTPS (szyfrowane)
- **CloudFlare ↔ Twój serwer:** HTTP (nieszyfrowane)

Jest to wystarczające dla większości zastosowań (blogi, portfolio, strony informacyjne). Dla aplikacji przetwarzających wrażliwe dane (loginy, płatności) zalecam przejście na tryb **Full** z CloudFlare Origin Certificate.

| Tryb SSL | Kiedy używać | Bezpieczeństwo |
|----------|--------------|----------------|
| **Flexible** | Blogi, portfolio, strony informacyjne | Podstawowe |
| **Full** | Aplikacje z danymi wrażliwymi | Wysokie (end-to-end) |
| **Full (Strict)** | E-commerce, bankowość, dane medyczne | Maksymalne |

## Krok 6: Sprawdź czy Coolify nasłuchuje na IPv6

Na serwerze wykonaj:

```bash
netstat -plnt | grep :80
```

Powinieneś zobaczyć linię zawierającą `:::80` - oznacza to, że Traefik (proxy w Coolify) nasłuchuje na IPv6.

Przykładowy output:
```
tcp6       0      0 :::80                   :::*                    LISTEN      3851120/docker-prox
```

## Krok 7: Skonfiguruj domenę w Coolify

1. Zaloguj się do panelu Coolify (np. `http://srv32.mikr.us:30143`)
2. Przejdź do swojej aplikacji
3. Kliknij **Configuration → Domains**
4. W polu **Domains** wpisz:
   ```
   http://twojadomena.pl,http://www.twojadomena.pl
   ```

:::warning[Używaj http://]
Używaj `http://` (nie `https://`), ponieważ CloudFlare łączy się z Twoim serwerem przez HTTP w trybie Flexible!
:::

5. W polu **Direction** wybierz:
   - **"Redirect to non-www"** - jeśli chcesz przekierowywać www na domenę główną
   - **"Allow www & non-www"** - jeśli chcesz obsługiwać obie wersje

6. Kliknij **Set Direction**
7. Kliknij **Save**
8. Na górze strony kliknij **Redeploy**

### Dlaczego http:// w Coolify?

Może się to wydawać dziwne, ale to jest **poprawna konfiguracja**:

```
Użytkownik → [HTTPS] → CloudFlare → [HTTP] → Twój serwer → Coolify
```

- Użytkownik **zawsze** widzi HTTPS (dzięki CloudFlare)
- CloudFlare łączy się z Twoim serwerem przez HTTP (tryb Flexible)
- Coolify musi akceptować połączenia HTTP, stąd `http://` w konfiguracji

Jeśli wpiszesz `https://` w Coolify, powstanie konflikt i dostaniesz błąd "Too Many Redirects".

## Krok 8: Testowanie

Poczekaj 2-5 minut na propagację konfiguracji, a następnie sprawdź:

- `https://twojadomena.pl` - powinna działać
- `https://www.twojadomena.pl` - powinna działać lub przekierowywać
- `http://twojadomena.pl` - powinna przekierowywać na HTTPS

Możesz też przetestować z linii komend:
```bash
curl -I https://twojadomena.pl
```

![Successful Borat](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDduZXoxaGFmc2Q2eGtxdWZyOGlzNDF6NnpicXc3a2RiemdxYnBqdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2YWpMxS3En6fDxfy/giphy.gif)

## Rozwiązywanie problemów

### Błąd 404

Sprawdź logi Traefik:
```bash
docker logs coolify-proxy --tail 50 | grep twojadomena
```

Jeśli widzisz błędy związane z `PathPrefix` lub pustym `Host()`, upewnij się, że:
- Domenę w Coolify wpisałeś z `http://` (nie `https://`)
- Kliknąłeś **Redeploy** po zapisaniu zmian
- W polu Direction wybrałeś odpowiednią opcję i kliknąłeś **Set Direction**

### Too Many Redirects (Pętla przekierowań)

To oznacza konflikt SSL. Sprawdź:
- CloudFlare SSL/TLS jest ustawione na **Flexible** (nie Full)
- W Coolify używasz `http://` w domenach (nie `https://`)

### Strona nie ładuje się

- Poczekaj na propagację DNS (do 24h)
- Sprawdź czy rekordy AAAA są **Proxied** (pomarańczowa chmurka w CloudFlare)
- Wyczyść cache przeglądarki lub testuj w trybie incognito
- Sprawdź czy nameservery zostały zmienione: `dig NS twojadomena.pl`

### CloudFlare pokazuje błąd 502 Bad Gateway

- Sprawdź czy Coolify działa: `docker ps | grep coolify`
- Sprawdź logi: `docker logs coolify-proxy --tail 100`
- Upewnij się, że aplikacja jest uruchomiona w Coolify

## Dodatkowe zasoby

- [Oficjalny poradnik Mikrusa o podpięciu domeny przez CloudFlare](https://wiki.mikr.us/podpiecie_domeny_przez_cloudflare/)
- [O co chodzi z IPv6 na Mikrusie?](https://wiki.mikr.us/o_co_chodzi_z_ipv6/)
- [Dokumentacja Coolify](https://coolify.io/docs)
- [CloudFlare Docs - SSL/TLS modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)

## Podsumowanie

Gratulacje! Twoja aplikacja na Coolify jest teraz dostępna pod własną domeną z darmowym certyfikatem SSL od CloudFlare.

Ta konfiguracja:
- Działa z architekturą Mikrusa (IPv6 + CloudFlare)
- Zapewnia darmowy SSL
- Automatycznie przekierowuje HTTP → HTTPS
- Jest łatwa w utrzymaniu
- Daje ochronę DDoS i CDN za darmo

### Następne kroki:

**Dla większego bezpieczeństwa (aplikacje z danymi wrażliwymi):**
1. Wygeneruj CloudFlare Origin Certificate (SSL/TLS → Origin Server)
2. Zainstaluj certyfikat w Coolify
3. Zmień CloudFlare SSL na **Full**
4. W Coolify zmień domeny na `https://`

**Dla lepszej wydajności:**
- Skonfiguruj cache rules w CloudFlare
- Włącz Brotli compression
- Użyj CloudFlare Workers dla dynamicznych treści

---

**Przydatne linki:**
- [Mikrus](https://mikr.us/)
- [Coolify](https://coolify.io/)
- [CloudFlare](https://www.cloudflare.com/)
