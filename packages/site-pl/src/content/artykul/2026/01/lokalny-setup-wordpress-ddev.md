---
title: "Lokalny setup dla WP w minutę"
description: "DDEV to środowisko deweloperskie oparte na Dockerze, które zapewnia spójną i powtarzalną konfigurację WordPress. Ten przewodnik pokazuje, jak zautomatyzować całą instalację WordPress przy użyciu hooków DDEV."
publishDate: "4 January 2026"
tags: ["wordpress", "ddev", "docker"]
---

## Dlaczego DDEV?

- **Spójne środowiska** dla wszystkich członków zespołu i maszyn
- **Oparte na Dockerze** - brak konfliktów z systemowym PHP/MySQL
- **Wbudowane WP-CLI** - potężne zarządzanie WordPress z linii komend
- **System hooków** - automatyzacja powtarzalnych zadań konfiguracyjnych
- **Prosty SSL** - HTTPS działa od razu
- **Wiele wersji PHP** - łatwe przełączanie między projektami

![Developer happiness](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXFqMnBhYmRxNnJxOHBxcDVqMXBnOXVrZ2F6Y2RyZnRtaHBkcXFnbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7btNa0RUYa5E7iiQ/giphy.gif)

## Wstępna konfiguracja

### 1. Zainstaluj DDEV

```bash
# macOS
brew install ddev/ddev/ddev

# Windows (używając Chocolatey)
choco install ddev

# Linux
curl -fsSL https://ddev.com/install.sh | bash
```

### 2. Utwórz projekt WordPress

```bash
mkdir moj-projekt-wordpress
cd moj-projekt-wordpress
ddev config --project-type=wordpress --docroot="" --php-version=8.3
```

To polecenie tworzy plik `.ddev/config.yaml` z konfiguracją projektu.

## Magia automatyzacji

Zamiast ręcznej instalacji WordPress, konfigurowania ustawień i instalowania wtyczek za każdym razem, automatyzujemy wszystko przy użyciu hooka post-start DDEV.

### Utwórz plik automatyzacji

Utwórz plik `.ddev/config.wp-setup.yaml` i wklej pełną konfigurację:

```yaml
#ddev-generated
# Automatyczna konfiguracja WordPress
# Ten plik uruchomi się po 'ddev start' jeśli WordPress nie jest zainstalowany

hooks:
  post-start:
    - exec: |
        if ! wp core is-installed 2>/dev/null; then
          echo "WordPress nie jest zainstalowany. Uruchamiam automatyczną instalację..."
          echo ""

          # ZMIENNE KONFIGURACYJNE
          if [ -t 0 ]; then
            echo "============================================"
            echo "Instalacja WordPress"
            echo "============================================"
            echo ""

            read -p "Tytuł strony [Lokalna Strona]: " SITE_TITLE
            SITE_TITLE="${SITE_TITLE:-Lokalna Strona}"

            read -p "Nazwa użytkownika admin [webmaster]: " ADMIN_USER
            ADMIN_USER="${ADMIN_USER:-webmaster}"

            read -p "Hasło administratora [test1234]: " ADMIN_PASS
            ADMIN_PASS="${ADMIN_PASS:-test1234}"

            echo ""
          else
            SITE_TITLE="${WP_SITE_TITLE:-Lokalna Strona}"
            ADMIN_USER="${WP_ADMIN_USER:-webmaster}"
            ADMIN_PASS="${WP_ADMIN_PASS:-test1234}"
          fi

          # 1. POBIERZ PLIKI WORDPRESS
          if [ ! -f "wp-load.php" ]; then
            echo "[1/11] Pobieranie plików WordPress..."
            wp core download
          fi

          # 2. INSTALUJ WORDPRESS
          echo "[2/11] Instalacja WordPress..."
          wp core install \
            --url="https://${DDEV_SITENAME}.${DDEV_TLD}" \
            --title="$SITE_TITLE" \
            --admin_user="$ADMIN_USER" \
            --admin_password="$ADMIN_PASS" \
            --admin_email="${ADMIN_USER}@${DDEV_SITENAME}.local" \
            --skip-email

          # 3. USUŃ DOMYŚLNE MOTYWY
          echo "[3/11] Usuwanie domyślnych motywów..."
          THEMES_TO_DELETE=$(wp theme list --field=name --status=inactive 2>/dev/null | grep "^twenty" || true)
          if [ -n "$THEMES_TO_DELETE" ]; then
            echo "$THEMES_TO_DELETE" | xargs -r wp theme delete --quiet 2>/dev/null || true
          fi

          # 4. USUŃ DOMYŚLNE WTYCZKI
          echo "[4/11] Usuwanie domyślnych wtyczek..."
          wp plugin delete akismet hello --quiet 2>/dev/null || true

          # 5. INSTALUJ I AKTYWUJ WTYCZKI
          echo "[5/11] Instalacja wtyczki ACF Pro..."
          ACF_PRO_KEY=""
          ACF_PRO_URL="https://connect.advancedcustomfields.com/v2/plugins/download?p=pro&k=${ACF_PRO_KEY}"
          wp plugin install "$ACF_PRO_URL" --activate --quiet 2>/dev/null || echo "Instalacja ACF Pro nie powiodła się, zainstaluj ręcznie"

          # Dodatkowe przydatne wtyczki (odkomentuj według potrzeb):
          # wp plugin install wordpress-seo --activate --quiet
          # wp plugin install query-monitor --activate --quiet
          # wp plugin install duplicate-post --activate --quiet

          # 6. KONFIGURUJ KATEGORIE
          echo "[6/11] Konfiguracja kategorii..."
          NEWS_ID=$(wp term create category Aktualności --slug=aktualnosci --porcelain 2>/dev/null || wp term list category --slug=aktualnosci --field=term_id)
          wp option update default_category "$NEWS_ID" --quiet
          wp term delete category uncategorized --by=slug 2>/dev/null || true

          # 7. UTWÓRZ MENU
          echo "[7/11] Tworzenie menu nawigacyjnych..."
          PRIMARY_MENU_ID=$(wp menu create "Menu główne" --porcelain 2>/dev/null || echo "")
          FOOTER_MENU_ID=$(wp menu create "Menu stopka" --porcelain 2>/dev/null || echo "")
          if [ -n "$PRIMARY_MENU_ID" ]; then
            wp menu location assign "$PRIMARY_MENU_ID" primary --quiet 2>/dev/null || true
          fi
          if [ -n "$FOOTER_MENU_ID" ]; then
            wp menu location assign "$FOOTER_MENU_ID" footer --quiet 2>/dev/null || true
          fi

          # 8. USUŃ PRZYKŁADOWĄ TREŚĆ
          echo "[8/11] Usuwanie przykładowej treści..."
          DEFAULT_POST_IDS=$(wp post list --post_type=post --format=ids 2>/dev/null)
          if [ -n "$DEFAULT_POST_IDS" ]; then
            wp post delete $DEFAULT_POST_IDS --force --quiet 2>/dev/null || true
          fi
          wp post delete $(wp post list --post_type=page --name=sample-page --format=ids 2>/dev/null) --force --quiet 2>/dev/null || true
          wp comment delete 1 --force --quiet 2>/dev/null || true

          # 9. KONFIGURUJ USTAWIENIA WORDPRESS
          echo "[9/11] Konfiguracja ustawień WordPress..."
          wp rewrite structure '/%postname%/' --hard --quiet
          wp option update blog_public 0 --quiet
          wp option update timezone_string 'Europe/Warsaw' --quiet
          wp option update date_format 'Y-m-d' --quiet
          wp option update time_format 'H:i' --quiet
          wp option update start_of_week 1 --quiet
          wp option update default_ping_status 'closed' --quiet
          wp option update default_comment_status 'closed' --quiet

          # 10. BEZPIECZEŃSTWO I WYDAJNOŚĆ
          echo "[10/11] Stosowanie ustawień bezpieczeństwa..."
          wp config set DISALLOW_FILE_EDIT true --raw --type=constant --quiet 2>/dev/null || true
          wp config set WP_DEBUG true --raw --type=constant --quiet 2>/dev/null || true
          wp config set WP_DEBUG_LOG true --raw --type=constant --quiet 2>/dev/null || true
          wp config set WP_DEBUG_DISPLAY false --raw --type=constant --quiet 2>/dev/null || true

          # 11. UTWÓRZ PODSTAWOWĄ TREŚĆ
          echo "[11/11] Tworzenie podstawowych stron..."
          EXISTING_HOME=$(wp post list --post_type=page --title='Strona główna' --field=ID --format=csv 2>/dev/null | tail -n 1)
          if [ -n "$EXISTING_HOME" ] && [ "$EXISTING_HOME" != "ID" ]; then
            HOME_ID="$EXISTING_HOME"
          else
            HOME_ID=$(wp post create --post_type=page --post_title='Strona główna' --post_status=publish --post_content='Witamy na stronie głównej.' --porcelain 2>/dev/null || echo "")
          fi

          if [ -n "$HOME_ID" ]; then
            wp option update show_on_front 'page' --quiet
            wp option update page_on_front "$HOME_ID" --quiet
          fi

          # INSTALACJA ZAKOŃCZONA
          echo ""
          echo "============================================"
          echo "Instalacja WordPress zakończona!"
          echo "============================================"
          echo "URL:      https://${DDEV_SITENAME}.${DDEV_TLD}"
          echo "Tytuł:    $SITE_TITLE"
          echo "Login:    $ADMIN_USER"
          echo "Hasło:    $ADMIN_PASS"
          echo "============================================"
          echo ""
        fi
```

### Co robi ten skrypt

1. Pobiera pliki rdzenia WordPress
2. Instaluje WordPress z podanymi danymi logowania
3. Usuwa nieużywane domyślne motywy (motywy Twenty*)
4. Usuwa domyślne wtyczki (Akismet, Hello Dolly)
5. Instaluje ACF Pro (wymaga klucza licencyjnego)
6. Zamienia kategorię "Bez kategorii" na "Aktualności"
7. Tworzy menu nawigacyjne główne i stopki
8. Usuwa przykładowe wpisy, strony i komentarze
9. Konfiguruje permalinki, strefę czasową i ustawienia WordPress
10. Ustawia stałe deweloperskie (WP_DEBUG, itp.)
11. Tworzy stronę główną i ustawia ją jako pierwszą stronę

### Uruchom projekt

```bash
ddev start
```

To wszystko! WordPress jest teraz w pełni zainstalowany i skonfigurowany.

![It's alive](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2VkYnE5ZGVqNnBxdWVkNnN5cXF0Z3NxNGFuMnV4cTl0bXFxNHBnbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tze1mGedykiuk/giphy.gif)

## Praca z własnymi motywami

### Instalacja motywu z Git

Sklonuj motyw na swoim komputerze (nie wewnątrz kontenera):

```bash
cd wp-content/themes
git clone git@github.com:username/twoj-motyw.git
```

DDEV automatycznie synchronizuje pliki między hostem a kontenerem.

### Automatyczna aktualizacja motywu przy starcie

Dodaj tę sekcję do skryptu hooka, aby automatycznie pobierać aktualizacje motywu:

```bash
# Po kroku 11, dodaj:
if [ -d "wp-content/themes/twoj-motyw/.git" ]; then
  echo "Aktualizacja motywu z Git..."
  cd wp-content/themes/twoj-motyw
  git pull origin main --quiet 2>/dev/null || echo "Aktualizacja motywu pominięta"
  cd ../../..
fi
```

## Wskazówki dotyczące dostosowania

### Dodaj swój klucz licencyjny ACF Pro

Zastąp pusty `ACF_PRO_KEY=""` swoim kluczem licencyjnym:

```bash
ACF_PRO_KEY="twoj-rzeczywisty-klucz-licencyjny"
```

### Instaluj dodatkowe wtyczki

Odkomentuj lub dodaj komendy instalacji wtyczek:

```bash
wp plugin install wordpress-seo --activate --quiet
wp plugin install query-monitor --activate --quiet
wp plugin install duplicate-post --activate --quiet
```

### Zmień domyślne ustawienia

Modyfikuj dowolne opcje WordPress:

```bash
wp option update timezone_string 'Europe/Warsaw' --quiet
wp option update date_format 'd.m.Y' --quiet
```

### Użyj zmiennych środowiskowych

Dla nieinteraktywnej automatyzacji ustaw zmienne środowiskowe w `.ddev/config.yaml`:

```yaml
web_environment:
  - WP_SITE_TITLE=Mój Wspaniały Projekt
  - WP_ADMIN_USER=admin
  - WP_ADMIN_PASS=bezpieczne_haslo
```

## Testowanie konfiguracji

Aby przetestować, czy wszystko działa:

```bash
# Usuń pliki WordPress
ddev exec "rm -rf wp-*"

# Uruchom ponownie DDEV (uruchamia automatyzację)
ddev restart

# Sprawdź instalację
ddev wp plugin list
ddev wp theme list
ddev wp option get blogname
```

## Rozwiązywanie problemów

### Instalacja ACF Pro nie powiodła się

**Problem:** Darmowa wersja ACF nie zawiera funkcjonalności Options Pages.

**Rozwiązanie:** Zdobądź licencję ACF Pro lub usuń krok instalacji ACF, jeśli nie jest potrzebny.

### Motyw nie znaleziony

**Problem:** Motyw nie został sklonowany lub jest w złym katalogu.

**Rozwiązanie:** Upewnij się, że motyw znajduje się w katalogu `wp-content/themes/`.

### Błędy uprawnień

**Problem:** Problemy z synchronizacją Docker/Mutagen.

**Rozwiązanie:** Uruchom `ddev mutagen reset`, a następnie `ddev restart`.

### Skrypt uruchamia się przy każdym starcie

**Problem:** Skrypt wciąż ponownie instaluje WordPress.

**Rozwiązanie:** Skrypt uruchamia się tylko wtedy, gdy `wp core is-installed` zwraca false. Jeśli WordPress jest zainstalowany, skrypt jest pomijany.

## Dobre praktyki

### Obsługa błędów

Zawsze dodawaj obsługę błędów, aby zapobiec awariom skryptu:

```bash
wp plugin install jakas-wtyczka --activate --quiet 2>/dev/null || true
```

`|| true` zapewnia, że skrypt będzie kontynuowany, nawet jeśli polecenie się nie powiedzie.

### Tryb cichy

Ogranicz nadmiar komunikatów za pomocą flag `--quiet`:

```bash
wp option update timezone_string 'Europe/Warsaw' --quiet
```

### Sprawdzaj przed tworzeniem

Unikaj duplikatów, sprawdzając, czy zasoby istnieją:

```bash
NEWS_ID=$(wp term create category Aktualności --porcelain 2>/dev/null || \
  wp term list category --slug=aktualnosci --field=term_id)
```

### Kontrola wersji

Trzymaj skrypt automatyzacji w kontroli wersji i udostępniaj go między projektami. Utwórz szablon repozytorium ze standardową konfiguracją DDEV do natychmiastowej konfiguracji projektu.

## Korzyści

Dzięki tej automatycznej konfiguracji:

- **Nowe projekty startują w sekundy** - nie w minuty
- **Spójność we wszystkich środowiskach** - brak rozbieżności konfiguracji
- **Łatwe wdrażanie zespołu** - jedno polecenie uruchamia wszystkich
- **Koniec z "u mnie działa"** - wszyscy mają identyczne konfiguracje

![Team success](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjRxNWRxNnRxNXRxNXRxNXRxNXRxNXRxNXRxNXRxNXRxNXRxNXRxNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPjzfv0sI2p7fDW/giphy.gif)

## Zasoby

- [Dokumentacja DDEV](https://ddev.readthedocs.io/)
- [Komendy WP-CLI](https://developer.wordpress.org/cli/commands/)
- [Dokumentacja hooków DDEV](https://ddev.readthedocs.io/en/stable/users/configuration/hooks/)

---

**Wskazówka:** Utwórz szablon repozytorium ze standardową konfiguracją DDEV, a następnie użyj go do błyskawicznego uruchamiania nowych projektów za pomocą `git clone` + `ddev start`.
