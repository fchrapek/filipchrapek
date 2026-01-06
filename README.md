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

# Lint CSS (check for issues)
pnpm lint:css

# Lint CSS and auto-fix
pnpm lint:css:fix
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

## CSS Architecture

### Directory Structure

```
packages/theme/src/styles/
├── 00-settings/          # Variables, tokens, typography settings
├── 01-utilities/         # Utility classes (.text--dimmed, .sr-only, etc.)
├── 02-generic/           # Reset, base styles
├── 03-elements/          # Global elements (prose, typography, admonition, github-card)
├── 04-layouts/           # Layout styles (grid, blog-post)
└── 06-themes/            # Theme variations (motherfuckingwebsite)
```

### Naming Conventions

**No BEM** - Use simple, scoped class names instead:

```css
/* Good - simple names, scoped by Astro */
.button { }
.title { }
.item { }

/* Bad - BEM naming */
.button__icon { }
.card__title { }
```

### Scoped Styles

Component styles are scoped using Astro's built-in scoping. Use `:global()` when targeting child components:

```astro
<style>
  .container {
    /* scoped to this component */
  }

  .container :global(.child-class) {
    /* targets child component classes */
  }
</style>
```

### Logical Properties

Use CSS logical properties instead of physical ones:

```css
/* Good - logical properties */
margin-block-end: 1rem;
padding-inline: 1rem;
inline-size: 100%;
inset-block-start: 0;

/* Bad - physical properties */
margin-bottom: 1rem;
padding-left: 1rem;
padding-right: 1rem;
width: 100%;
top: 0;
```

### Stylelint

CSS is automatically linted and fixed on build. Rules enforce:
- Logical properties over physical (`margin-bottom` → `margin-block-end`)
- Consistent property ordering

### Custom Media Queries

Custom media queries don't work in Astro scoped styles. Use actual values:

```css
/* In scoped styles - use actual values */
@media (min-width: 40rem) { }

/* In global CSS - custom media works */
@media (--md) { }
```

### PostCSS Features

- `rem()` function for conversions: `rem(16)` → `1rem`
- CSS nesting supported
- Custom media queries (in global styles only)

## Component Patterns

### Navigation

- `DesktopNav.astro` - Horizontal nav, hidden on mobile
- `MobileNav.astro` - Hamburger menu, hidden on desktop
- Both used in Header, DesktopNav also used in Footer

### Utility Classes

```css
.text--dimmed      /* Muted text color */
.text--small       /* Smaller font size */
.text--large       /* Larger font size */
.section-title     /* Section heading style */
.list-reset        /* Remove list styling */
.sr-only           /* Screen reader only */
.prose             /* Rich text styling */
.prose--sm         /* Smaller prose */
.prose--dimmed     /* Dimmed prose text */
```
