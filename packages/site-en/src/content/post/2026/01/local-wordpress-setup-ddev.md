---
title: "Refreshing your WordPress local setup with DDEV"
description: "DDEV is a Docker-based local development environment that makes WordPress setup consistent and reproducible. Let me show you how you can use it for your local WordPress environment and live happy ever after."
publishDate: "4 January 2026"
tags: ["wordpress", "ddev", "docker"]
---

## Why DDEV?

- **Consistent environments** across team members and machines
- **Docker-based** - no conflicts with system PHP/MySQL versions
- **WP-CLI built-in** - powerful command-line WordPress management
- **Hooks system** - automate repetitive setup tasks
- **Easy SSL** - HTTPS works out of the box
- **Multiple PHP versions** - switch easily between projects

:::note[ ]
I'm not gonna lie, before the AI takeover, using DDEV or Docker alone and dealing with different project config bullshit was giving me nightmares. 

Since I don't have to worry about spending a whole day making the config work for this and that specific project and environment, I'm basically using Docker (with DDEV if it makes sense) for everything.
:::

![Developer happiness](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTZ6YWtsNnlpZmRxN2phdnhydnl2ZDdqeW1vNzF2aWN0ejBoODQzNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hNmaZtvOzG1pe/giphy.gif)

## Initial setup

### 1. Install DDEV

```bash
# macOS
brew install ddev/ddev/ddev

# Windows (using Chocolatey)
choco install ddev

# Linux
curl -fsSL https://ddev.com/install.sh | bash
```

### 2. Create your WordPress project

```bash
mkdir my-wordpress-project
cd my-wordpress-project
ddev config --project-type=wordpress --docroot="" --php-version=8.4
```

This creates a `.ddev/config.yaml` file with your project configuration.

## The automation magic

Instead of manually installing WordPress, configuring settings, and installing plugins every time, we automate everything using DDEV's post-start hook.

### Create the automation file

Create `.ddev/config.wp-setup.yaml` and paste the complete configuration:

```yaml
#ddev-generated
# Automated WordPress setup configuration
# This file will run after 'ddev start' if WordPress is not installed

hooks:
  post-start:
    - exec: |
        if ! wp core is-installed 2>/dev/null; then
          echo "WordPress not installed. Setting up automatically..."
          echo ""

          # CONFIGURATION VARIABLES
          if [ -t 0 ]; then
            echo "============================================"
            echo "WordPress Installation Setup"
            echo "============================================"
            echo ""

            read -p "Site Title [Local Site]: " SITE_TITLE
            SITE_TITLE="${SITE_TITLE:-Local Site}"

            read -p "Admin Username [webmaster]: " ADMIN_USER
            ADMIN_USER="${ADMIN_USER:-webmaster}"

            read -p "Admin Password [test1234]: " ADMIN_PASS
            ADMIN_PASS="${ADMIN_PASS:-test1234}"

            echo ""
          else
            SITE_TITLE="${WP_SITE_TITLE:-Local Site}"
            ADMIN_USER="${WP_ADMIN_USER:-webmaster}"
            ADMIN_PASS="${WP_ADMIN_PASS:-test1234}"
          fi

          # 1. DOWNLOAD WORDPRESS CORE
          if [ ! -f "wp-load.php" ]; then
            echo "[1/11] Downloading WordPress core..."
            wp core download
          fi

          # 2. INSTALL WORDPRESS
          echo "[2/11] Installing WordPress..."
          wp core install \
            --url="https://${DDEV_SITENAME}.${DDEV_TLD}" \
            --title="$SITE_TITLE" \
            --admin_user="$ADMIN_USER" \
            --admin_password="$ADMIN_PASS" \
            --admin_email="${ADMIN_USER}@${DDEV_SITENAME}.local" \
            --skip-email

          # 3. CLEAN UP DEFAULT THEMES
          echo "[3/11] Cleaning up default themes..."
          THEMES_TO_DELETE=$(wp theme list --field=name --status=inactive 2>/dev/null | grep "^twenty" || true)
          if [ -n "$THEMES_TO_DELETE" ]; then
            echo "$THEMES_TO_DELETE" | xargs -r wp theme delete --quiet 2>/dev/null || true
          fi

          # 4. REMOVE DEFAULT PLUGINS
          echo "[4/11] Removing default plugins..."
          wp plugin delete akismet hello --quiet 2>/dev/null || true

          # 5. INSTALL & ACTIVATE PLUGINS
          echo "[5/11] Installing ACF Pro plugin..."
          ACF_PRO_KEY=""
          ACF_PRO_URL="https://connect.advancedcustomfields.com/v2/plugins/download?p=pro&k=${ACF_PRO_KEY}"
          wp plugin install "$ACF_PRO_URL" --activate --quiet 2>/dev/null || echo "ACF Pro installation failed, please install manually"

          # Additional useful plugins (uncomment as needed):
          # wp plugin install wordpress-seo --activate --quiet
          # wp plugin install query-monitor --activate --quiet
          # wp plugin install duplicate-post --activate --quiet

          # 6. CONFIGURE CATEGORIES
          echo "[6/11] Setting up categories..."
          NEWS_ID=$(wp term create category News --slug=news --porcelain 2>/dev/null || wp term list category --slug=news --field=term_id)
          wp option update default_category "$NEWS_ID" --quiet
          wp term delete category uncategorized --by=slug 2>/dev/null || true

          # 7. CREATE MENUS
          echo "[7/11] Creating navigation menus..."
          PRIMARY_MENU_ID=$(wp menu create "Primary Menu" --porcelain 2>/dev/null || echo "")
          FOOTER_MENU_ID=$(wp menu create "Footer Menu" --porcelain 2>/dev/null || echo "")
          if [ -n "$PRIMARY_MENU_ID" ]; then
            wp menu location assign "$PRIMARY_MENU_ID" primary --quiet 2>/dev/null || true
          fi
          if [ -n "$FOOTER_MENU_ID" ]; then
            wp menu location assign "$FOOTER_MENU_ID" footer --quiet 2>/dev/null || true
          fi

          # 8. REMOVE SAMPLE CONTENT
          echo "[8/11] Removing sample content..."
          DEFAULT_POST_IDS=$(wp post list --post_type=post --format=ids 2>/dev/null)
          if [ -n "$DEFAULT_POST_IDS" ]; then
            wp post delete $DEFAULT_POST_IDS --force --quiet 2>/dev/null || true
          fi
          wp post delete $(wp post list --post_type=page --name=sample-page --format=ids 2>/dev/null) --force --quiet 2>/dev/null || true
          wp comment delete 1 --force --quiet 2>/dev/null || true

          # 9. CONFIGURE WORDPRESS SETTINGS
          echo "[9/11] Configuring WordPress settings..."
          wp rewrite structure '/%postname%/' --hard --quiet
          wp option update blog_public 0 --quiet
          wp option update timezone_string 'Europe/Warsaw' --quiet
          wp option update date_format 'Y-m-d' --quiet
          wp option update time_format 'H:i' --quiet
          wp option update start_of_week 1 --quiet
          wp option update default_ping_status 'closed' --quiet
          wp option update default_comment_status 'closed' --quiet

          # 10. SECURITY & PERFORMANCE
          echo "[10/11] Applying security settings..."
          wp config set DISALLOW_FILE_EDIT true --raw --type=constant --quiet 2>/dev/null || true
          wp config set WP_DEBUG true --raw --type=constant --quiet 2>/dev/null || true
          wp config set WP_DEBUG_LOG true --raw --type=constant --quiet 2>/dev/null || true
          wp config set WP_DEBUG_DISPLAY false --raw --type=constant --quiet 2>/dev/null || true

          # 11. CREATE STARTER CONTENT
          echo "[11/11] Creating starter pages..."
          EXISTING_HOME=$(wp post list --post_type=page --title='Home' --field=ID --format=csv 2>/dev/null | tail -n 1)
          if [ -n "$EXISTING_HOME" ] && [ "$EXISTING_HOME" != "ID" ]; then
            HOME_ID="$EXISTING_HOME"
          else
            HOME_ID=$(wp post create --post_type=page --post_title='Home' --post_status=publish --post_content='Welcome to the homepage.' --porcelain 2>/dev/null || echo "")
          fi

          if [ -n "$HOME_ID" ]; then
            wp option update show_on_front 'page' --quiet
            wp option update page_on_front "$HOME_ID" --quiet
          fi

          # SETUP COMPLETE
          echo ""
          echo "============================================"
          echo "WordPress setup complete!"
          echo "============================================"
          echo "URL:      https://${DDEV_SITENAME}.${DDEV_TLD}"
          echo "Title:    $SITE_TITLE"
          echo "Username: $ADMIN_USER"
          echo "Password: $ADMIN_PASS"
          echo "============================================"
          echo ""
        fi
```

### What this script does

1. Downloads WordPress core files
2. Installs WordPress with your credentials
3. Removes unused default themes (Twenty* themes)
4. Removes default plugins (Akismet, Hello Dolly)
5. Installs ACF Pro (requires license key)
6. Replaces "Uncategorized" with "News" category
7. Creates Primary and Footer navigation menus
8. Removes sample posts, pages, and comments
9. Configures permalinks, timezone, and WordPress settings
10. Sets up development constants (WP_DEBUG, etc.)
11. Creates a homepage and sets it as the front page

### Start your project

```bash
ddev start
```

That's it! WordPress is now fully installed and configured.

![Impressed Michael Scott](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzAyMGp4ejN5enQ5b3N4N2hkenl4Mm16ZndsMzF3Mms4eW5xa3YxZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vptzm88vH0xxbqHtKE/giphy.gif)

## Working with custom themes

### Installing a theme from Git

Clone your theme on your host machine (not inside the container):

```bash
cd wp-content/themes
git clone git@github.com:username/your-theme.git
```

DDEV automatically syncs files between your host and container.

### Auto-update themes on start

Add this section to your hook script to pull theme updates automatically:

```bash
# After step 11, add:
if [ -d "wp-content/themes/your-theme/.git" ]; then
  echo "Updating theme from Git..."
  cd wp-content/themes/your-theme
  git pull origin main --quiet 2>/dev/null || echo "Theme update skipped"
  cd ../../..
fi
```

## Customization tips

### Add your ACF Pro license

Replace the empty `ACF_PRO_KEY=""` with your license key:

```bash
ACF_PRO_KEY="your-actual-license-key-here"
```

### Install additional plugins

Uncomment or add plugin installation commands:

```bash
wp plugin install wordpress-seo --activate --quiet
wp plugin install query-monitor --activate --quiet
```

### Change default settings

Modify any WordPress options:

```bash
wp option update timezone_string 'America/New_York' --quiet
wp option update date_format 'F j, Y' --quiet
```

### Use environment variables

For non-interactive automation, set environment variables in `.ddev/config.yaml`:

```yaml
web_environment:
  - WP_SITE_TITLE=My Awesome Project
  - WP_ADMIN_USER=admin
  - WP_ADMIN_PASS=secure_password_here
```

## Troubleshooting

### ACF Pro installation failed

**Problem:** Free ACF doesn't include Options Pages functionality.

**Solution:** Get an ACF Pro license or remove the ACF installation step if not needed.

### Permission errors

**Problem:** Docker/Mutagen sync issues.

**Solution:** Run `ddev mutagen reset` followed by `ddev restart`.

## Best practices

### Error handling

Always add error handling to prevent script failures:

```bash
wp plugin install some-plugin --activate --quiet 2>/dev/null || true
```

The `|| true` ensures the script continues even if a command fails.

### Use quiet mode

Reduce output noise with `--quiet` flags:

```bash
wp option update timezone_string 'Europe/Warsaw' --quiet
```

### Check before creating

Avoid duplicates by checking if resources exist:

```bash
NEWS_ID=$(wp term create category News --porcelain 2>/dev/null || \
  wp term list category --slug=news --field=term_id)
```

### Version control

Keep your automation script in version control and share it across projects. Create a template repository with your standard DDEV configuration for instant project setup.

## Benefits

With this automated setup:

- **New projects start in seconds** - not minutes
- **Consistency across all environments** - no configuration drift
- **Easy team onboarding** - one command gets everyone started
- **No more "works on my machine"** - everyone has identical setups

## Resources

- [DDEV Documentation](https://ddev.readthedocs.io/)
- [WP-CLI Commands](https://developer.wordpress.org/cli/commands/)
- [DDEV Hooks Reference](https://ddev.readthedocs.io/en/stable/users/configuration/hooks/)

---

**Pro Tip:** Create a template repository with your standard DDEV configuration, then use it to bootstrap new projects instantly with `git clone` + `ddev start`.
