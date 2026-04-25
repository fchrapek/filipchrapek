# CLAUDE.md

Single source of truth for this repo — conventions, workflows, and gotchas. Used by both Claude Code and humans.

## Monorepo layout

```
filipchrapek-sites/
├── packages/
│   ├── theme/              # Shared components, layouts, styles, utils, i18n
│   ├── site-en/            # English site (filipchrapek.com)
│   └── site-pl/            # Polish site (filipchrapek.pl)
├── .claude/skills/         # Project-scoped Claude Code skills
├── docs/SESSION-LOG.md     # Chronological work log
├── CLAUDE.md               # This file
├── ROADMAP.md              # Forward-looking plans
└── pnpm-workspace.yaml
```

## Setup & common commands

```bash
pnpm install           # install deps
pnpm dev:en            # dev EN on port 4321
pnpm dev:pl            # dev PL on port 4322
pnpm build:en          # build EN (runs lint:css:fix first, then astro build, then pagefind)
pnpm build:pl          # build PL
pnpm lint:css          # stylelint check
pnpm lint:css:fix      # stylelint autofix
pnpm check             # astro check (types + diagnostics)
pnpm format            # biome + prettier + import sort
```

## URLs

**English (filipchrapek.com)** — `/`, `/about/`, `/posts/`, `/notes/`, `/tags/`
**Polish (filipchrapek.pl)** — `/`, `/o-mnie/`, `/artykuly/`, `/notatki/`, `/tagi/`

## Workspace & tooling

- **pnpm workspace** lists only `site-en` and `site-pl`; `packages/theme` is NOT a workspace package — it's pulled in via tsconfig path alias. All shared deps live in the root `package.json`.
- **Lint/format stack**: Biome (code + imports), Prettier (non-MD formatting, second pass), stylelint (logical properties + ordering on `.css` and `.astro` via `postcss-html`). No pre-commit hooks — CI or manual only.
- **Build scripts run `lint:css:fix` first** — CSS auto-fix happens before `astro build`. A stylelint error can block the build.

## Shared theme imports

- Both sites import theme code via the `@/*` alias defined in each site's `tsconfig.json`:
  ```json
  "paths": { "@/*": ["src/*", "../theme/src/*"] }
  ```
- Import as `@/components/...`, `@/i18n/...`, `@/utils/...`. The alias resolves site-local first, then theme — a site can shadow any theme file by putting it in its own `src/` at the same path.
- No barrel/index exports in theme; import directly from the file.
- Theme contains its own `site.config.ts` and `content.config.ts` — both **unused/stale**. Always look at the per-site versions under `packages/site-*/src/`.

## CSS conventions

- **No BEM** — simple class names scoped by Astro's built-in scoping. Use `:global(.child)` to pierce scope when targeting child components.
- **Logical properties only** — `margin-block-end`, `padding-inline`, `inline-size`, `inset-block-start`; never `margin-bottom`/`padding-left`/`width`/`top`. Enforced by stylelint.
- **Custom media queries** work in global CSS but NOT in Astro scoped `<style>` blocks — use actual values (`@media (min-width: 40rem)`) inside scoped styles.
- **PostCSS features**: `rem(16)` function (→ `1rem`), CSS nesting, custom media queries in global only.
- **Directory structure** under `packages/theme/src/styles/`:
  - `00-settings/` — variables, tokens, typography
  - `01-utilities/` — utility classes
  - `02-generic/` — reset, base
  - `03-elements/` — prose, typography, admonition, github-card
  - `04-layouts/` — grid, blog-post
  - `06-themes/` — theme variations

Utility classes available: `.text--dimmed`, `.text--small`, `.text--large`, `.section-title`, `.list-reset`, `.sr-only`, `.prose`, `.prose--sm`, `.prose--dimmed`.

## Component patterns

- `DesktopNav.astro` — horizontal nav, hidden on mobile (used in Header + Footer)
- `MobileNav.astro` — hamburger, hidden on desktop
- Header uses both; Footer uses DesktopNav only.
- `blog/TagPill.astro` — the canonical "tag brick" used by `/tags`, `/tagi`, the post listings, and the blog post footer. Props: `tag`, `href`, optional `count`, optional `title`. Lives in theme so all four call sites stay in sync.
- `LogosGrid.astro` — paper-themed client logos grid used on the home page. Default set ships from each site's `public/logos/<brand>.svg`. 4 columns ≥`--sm`, 2 columns mobile.
- Section heads (label + hint with a hairline underline) are followed by their grid/list with `margin-block-start: var(--gap-section-head)` (= `1.75rem`) — defined in `_breakpoints.css`. Use this token for any new section, don't reinvent the spacing.

## Bilingual / i18n patterns

- Content collections have different names per site: EN uses `post` / `note`, PL uses `artykul` / `notatka`. Any theme component that queries collections must branch on language (e.g. `NotesList.astro`: `lang === "pl" ? "notatka" : "note"`).
- Each site has its own `src/data/post.ts` exporting `getAllPosts()` — theme components import this function and each site returns its own collection. Don't try to make this generic in theme.
- UI strings live in `packages/theme/src/i18n/translations.ts`. Components pick locale via `getLang(siteConfig.lang)` from `packages/theme/src/utils/i18n.ts` (also exposes `isPolish()` / `isEnglish()`).
- Locale-specific date formatting lives in each site's `site.config.ts`, not in theme.
- Hreflang alternate URLs in `BaseHead.astro` are **hardcoded** to `filipchrapek.com` ↔ `filipchrapek.pl` — update there if domains change.
- Drafts are filtered in prod only: `import.meta.env.PROD ? !data.draft : true`. Drafts are visible in dev.

## Theme change workflow

Any change under `packages/theme/` affects both sites. Default workflow:
1. Edit the theme file.
2. Run `pnpm build:en` AND `pnpm build:pl`.
3. Verify in browser at both `localhost:4321` and `localhost:4322`.
4. For UI-visible changes, screenshot both locales — PL strings typically run longer, so layout issues often appear only in one language.

## Content collection schemas

Defined per-site in `src/content.config.ts`. Required frontmatter:
- **post / artykul**: `title` (max 100 EN / 150 PL), `description`, `publishDate`. Optional: `coverImage`, `ogImage`, `tags`, `updatedDate`, `draft` (default false), `pinned` (default false).
- **note / notatka**: `title`, optional `description`, `publishDate` (ISO 8601 with offset).
- **tag**: all optional.
- **pages** collection (site-local, not theme's) backs `home.md` and `about.md`.

## Build pipeline gotchas

- **Pagefind postbuild** runs `pagefind --site dist` after each site's build. It will fail loudly if `dist/` doesn't exist or is empty.
- **OG image generation** uses `satori` + `@resvg/resvg-js` with raw TTF fonts loaded as buffers (paper-and-ink design). Two routes:
  - `pages/social-card.png.ts` — default fallback (both sites). Generated at build time from `siteConfig` — bump the design here, not by checking in a static PNG.
  - `pages/og-image/[...slug].png.ts` — per-post card. **EN only**; PL posts fall back to the default `/social-card.png`. Filling this gap on PL is tracked in `ROADMAP.md`.
- **Webmention cache** (`packages/theme/src/utils/webmentions.ts`) reads/writes `.data/webmentions.json`; writes are fire-and-forget (no await) so failures are silent. Requires `WEBMENTION_API_KEY` (server, secret) + optional `WEBMENTION_URL`, `WEBMENTION_PINGBACK`. All three are optional and the build won't fail if missing.
- `@resvg/resvg-js` is excluded from Vite's `optimizeDeps` — native binding; don't remove the exclusion.
- `sharp` is pinned to `^0.34.2` via `pnpm.overrides`.

## Dev server

- EN on `4321` (Astro default), PL on `4322` (hardcoded `--port 4322` in `site-pl/package.json`).
- Both can run concurrently — separate `.astro/` and `dist/` per site, no collision.
- The `/session-start`, `/task-start`, `/task-done`, `/session-close` skills won't auto-start the dev server — they'll ask which one to start.

## Known weirdness / tech debt

- `packages/theme/src/data-backup.ts` is an orphan — not imported anywhere. Copy-paste artifact of PL's `data/post.ts`. Safe to ignore; ask before deleting.
- `packages/theme/src/site.config.ts` and `packages/theme/src/content.config.ts` — unused shadows of per-site files. Same deal.
- Post slug handling uses `post.id.split("/").pop()` — flat slugs only. Nested directories inside `src/content/post/` will collapse incorrectly.
- `scripts/` folder is empty.
- PL site has no per-post OG image generation route (see build pipeline section); parity gap tracked in `ROADMAP.md`. The default `/social-card.png` IS generated for PL.

## Deployment

Coolify builds each site separately:

**EN** — Build: `pnpm install && pnpm build:en` • Output: `packages/site-en/dist` • Domain: `filipchrapek.com`
**PL** — Build: `pnpm install && pnpm build:pl` • Output: `packages/site-pl/dist` • Domain: `filipchrapek.pl`

Nixpacks configs at repo root: `nixpacks.toml` (EN), `nixpacks-pl.toml` (PL). Domain mapping lives in Coolify, not in code.

**Mikrus / Coolify build constraints** (learned the hard way 2026-04-25):
- Astro v6 requires Node `>=22.12.0`. The Coolify-pinned nixpkgs only ships `nodejs_22 = 22.11.0`; nixpacks is set to `nodejs_23` to clear the floor. Don't downgrade.
- Mikrus is OpenVZ — `swapon` returns "Operation not permitted". With ~1–2GB free RAM and other dev containers running, the default parallel `pnpm install` OOM-kills mid-install (exit 255, no stderr). nixpacks `[phases.install]` runs `pnpm install --frozen-lockfile --network-concurrency=2 --child-concurrency=1` to keep peak RSS in check. Slower install, but it finishes.
- Deploy logs live in the `coolify-db` postgres: `SELECT logs FROM application_deployment_queues WHERE deployment_uuid='...';`. Useful when the helper container is gone.

## PR preview deployments (EN only, set up 2026-04-26)

Vercel-style preview deploys are wired up for `filipchrapek.com`. PR #N → `https://N.filipchrapek.com`. Setup details:

- **Coolify dashboard**: `https://coolify.filipchrapek.com` (was SSH-tunnel-only before).
- **Source**: GitHub App `fchrapek-coolify` (was Public GitHub polling). Webhook delivery confirmed via App's "Recent Deliveries" tab on github.com.
- **Wildcard DNS**: `*.filipchrapek.com` AAAA → Mikrus IPv6, proxied via Cloudflare.
- **Cloudflare SSL mode**: stays **Flexible** zone-wide (Mikrus stack assumes this). Going Full breaks the apex because origin only listens on port 80.
- **Coolify v4-beta quirk**: webhook arrives on `pull_request.opened` but Coolify does NOT auto-enqueue a deploy. You must hit **Preview Deployments → Load Pull Requests → Deploy** manually (or, when scripted, the equivalent API calls). Closing/merging the PR DOES auto-tear-down the preview correctly.
- **Traefik patch on Mikrus** (load-bearing — don't lose it): the auto-generated `coolify-http` router in `/data/coolify/proxy/dynamic/coolify.yaml` had a `redirect-to-https` middleware that loops with CF Flexible. Backup file is `coolify.yaml.bak.before-redirect-fix`. If Coolify ever rewrites this file (e.g. on a settings change or major upgrade), the dashboard will start 307-looping again — re-apply the same `sed` (see `resources/coolify-pr-previews-on-mikrus/notes-en.md` for the exact command + reasoning).

**PL site** (`filipchrapek.pl`) is still on Netlify — not yet migrated to Coolify. When it moves, the same recipe applies.
