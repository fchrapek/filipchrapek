# CLAUDE.md

Context for Claude Code working in this repo. `README.md` covers structure, URLs, content collections, deployment, and CSS conventions — don't re-explain them. This file covers what's **not** in README and would otherwise trip you up.

## Workspace & tooling

- **pnpm workspace** lists only `site-en` and `site-pl`; `packages/theme` is NOT a workspace package — it's pulled in via tsconfig path alias (see below). All shared deps live in the root `package.json`.
- **Lint/format stack**: Biome (code + imports), Prettier (non-MD formatting, second pass), stylelint (logical properties + ordering on `.css` and `.astro` via `postcss-html`). No pre-commit hooks — CI or manual only.
- **Build scripts run `lint:css:fix` first** — CSS auto-fix happens before `astro build`. A stylelint error can block the build.
- `pnpm check` runs `astro check` (TypeScript + Astro diagnostics).

## Shared theme imports

- Both sites import theme code via the `@/*` alias defined in each site's `tsconfig.json`:
  ```json
  "paths": { "@/*": ["src/*", "../theme/src/*"] }
  ```
- Import as `@/components/...`, `@/i18n/...`, `@/utils/...`. The alias resolves site-local first, then theme — so a site can shadow any theme file by putting it in its own `src/` at the same path.
- No barrel/index exports in theme; import directly from the file.
- Theme contains its own `site.config.ts` and `content.config.ts` — both **unused/stale**. Always look at the per-site versions under `packages/site-*/src/`.

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
4. For UI-visible changes, screenshot both locales — copy/layout often reveals only in one language (PL strings run longer).

## Build pipeline gotchas

- **Pagefind postbuild** runs `pagefind --site dist` after each site's build. It will fail loudly if `dist/` doesn't exist or is empty.
- **OG image generation** (`packages/site-en/src/pages/og-image/[...slug].png.ts`) uses `satori` + `@resvg/resvg-js` with raw TTF fonts loaded as buffers. Only runs for posts without an explicit `ogImage`. PL site has **no** OG image route — Polish posts fall back to `/social-card.png`.
- **Webmention cache** (`packages/theme/src/utils/webmentions.ts`) reads/writes `.data/webmentions.json`; writes are fire-and-forget (no await) so failures are silent. Requires `WEBMENTION_API_KEY` (server, secret) + optional `WEBMENTION_URL`, `WEBMENTION_PINGBACK`. All three are optional and the build won't fail if missing.
- `@resvg/resvg-js` is excluded from Vite's `optimizeDeps` — it's a native binding and breaks bundling otherwise. Don't remove that exclusion.
- `sharp` is pinned to `^0.34.2` via `pnpm.overrides`.

## Dev server

- EN on `4321` (Astro default), PL on `4322` (hardcoded `--port 4322` in `site-pl/package.json`).
- Both can run concurrently — separate `.astro/` and `dist/` per site, no collision.
- The `/session-start`, `/task-start`, `/task-done`, `/session-close` skills won't auto-start the dev server — they'll ask.

## Content collection schemas

Defined per-site in `src/content.config.ts`. Required frontmatter:
- **post / artykul**: `title` (max 100 EN / 150 PL), `description`, `publishDate`. Optional: `coverImage`, `ogImage`, `tags`, `updatedDate`, `draft` (default false), `pinned` (default false).
- **note / notatka**: `title`, optional `description`, `publishDate` (ISO 8601 with offset).
- **tag**: all optional.
- **pages** collection (site-local, not theme's) backs `home.md` and `about.md`.

## Known weirdness / tech debt

- `packages/theme/src/data-backup.ts` is an orphan — not imported anywhere. Appears to be a copy-paste artifact of PL's `data/post.ts`. Safe to ignore; ask before deleting.
- `packages/theme/src/site.config.ts` and `packages/theme/src/content.config.ts` — unused shadows of per-site files. Same deal: ignore or ask before deleting.
- Post slug handling uses `post.id.split("/").pop()` — flat slugs only. Nested directories inside `src/content/post/` will collapse incorrectly.
- `scripts/` folder is empty.

## Deployment quick reference

Coolify builds via `pnpm install && pnpm build:en` (and `:pl`). Output is `packages/site-{en,pl}/dist`. Nixpacks configs at repo root: `nixpacks.toml` (EN), `nixpacks-pl.toml` (PL). Domain mapping is in Coolify, not in code.
