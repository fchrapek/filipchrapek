# Filip Chrapek Sites - Monorepo

Monorepo containing shared theme and separate English/Polish sites.

## Structure

```
filipchrapek-sites/
├── packages/
│   ├── theme/              # Shared components, layouts, styles
│   ├── site-en/            # English site (filipchrapek.com)
│   └── site-pl/            # Polish site (filipchrapek.pl)
└── pnpm-workspace.yaml
```

## Setup

```bash
# Install dependencies
pnpm install

# Run English site
pnpm dev:en

# Run Polish site (on port 4322)
pnpm dev:pl

# Build English site
pnpm build:en

# Build Polish site
pnpm build:pl
```

## URLs

### English (filipchrapek.com)
- `/` - Home
- `/about/` - About
- `/posts/` - Blog posts
- `/notes/` - Notes
- `/tags/` - Tags

### Polish (filipchrapek.pl)
- `/` - Strona główna
- `/o-mnie/` - O mnie
- `/artykuly/` - Artykuły
- `/notatki/` - Notatki
- `/tagi/` - Tagi

## Content Collections

### English
- `post` - Blog posts
- `note` - Notes
- `tag` - Tags
- `pages` - Static pages (home.md, about.md)

### Polish
- `artykul` - Artykuły
- `notatka` - Notatki
- `tag` - Tagi
- `pages` - Strony statyczne (home.md, about.md)

## Deployment

### Coolify Setup

**App 1: English Site**
- Build command: `pnpm install && pnpm build:en`
- Build directory: `packages/site-en`
- Output directory: `packages/site-en/dist`
- Domain: `http://filipchrapek.com`

**App 2: Polish Site**
- Build command: `pnpm install && pnpm build:pl`
- Build directory: `packages/site-pl`
- Output directory: `packages/site-pl/dist`
- Domain: `http://filipchrapek.pl`
