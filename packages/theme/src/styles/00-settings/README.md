# Settings

Design tokens and CSS custom properties.

## Breakpoints

Responsive breakpoints using rem units.

| Token | Value |
|-------|-------|
| `--breakpoint-sm` | 40rem (640px) |
| `--breakpoint-md` | 48rem (768px) |
| `--breakpoint-lg` | 64rem (1024px) |
| `--breakpoint-xl` | 80rem (1280px) |

### Custom Media Queries

```css
@media (--sm) { } /* min-width: 40rem */
@media (--md) { } /* min-width: 48rem */
@media (--lg) { } /* min-width: 64rem */
@media (--xl) { } /* min-width: 80rem */
```

---

## Colors

### Base Colors

| Token | Light | Dark |
|-------|-------|------|
| `--color-bg` | hsl(0, 0%, 98%) | hsl(210, 6%, 12%) |
| `--color-text` | hsl(203, 11%, 15%) | hsl(0, 0%, 84%) |
| `--color-link` | (same as text) | (same as text) |
| `--color-accent` | hsl(0, 0%, 18%) | hsl(0, 0%, 95%) |
| `--color-quote` | (same as accent) | (same as accent) |

### Gray Scale

| Token | Value |
|-------|-------|
| `--color-gray-100` | hsl(0, 0%, 98%) |
| `--color-gray-200` | hsl(0, 0%, 95%) |
| `--color-gray-300` | hsl(0, 0%, 88%) |
| `--color-gray-400` | hsl(0, 0%, 70%) |
| `--color-gray-500` | hsl(0, 0%, 50%) |
| `--color-gray-600` | hsl(0, 0%, 40%) |
| `--color-gray-700` | hsl(0, 0%, 30%) |
| `--color-gray-800` | hsl(0, 0%, 20%) |

### Admonition Colors

| Token | Value |
|-------|-------|
| `--color-blue-400` | hsl(199, 100%, 44%) |
| `--color-lime-500` | hsl(87, 45%, 48%) |
| `--color-purple-400` | hsl(251, 65%, 69%) |
| `--color-orange-400` | hsl(23, 78%, 57%) |
| `--color-red-500` | hsl(359, 72%, 55%) |

### Dark Theme

Dark theme activates via `html[data-theme="dark"]`.

---

## Typography

### Font Families

| Token | Value |
|-------|-------|
| `--font-sans` | Switzer, system-ui, ... |
| `--font-mono` | Roboto Mono, ui-monospace, ... |

### Font Sizes (Static)

| Token | Value |
|-------|-------|
| `--text-display` | 3.375rem (54px) |
| `--text-h1` | 2.5rem (40px) |
| `--text-h2` | 2rem (32px) |
| `--text-h3` | 1.5rem (24px) |
| `--text-h4` | 1.25rem (20px) |
| `--text-h5` | 1.125rem (18px) |
| `--text-base` | 1rem (16px) |
| `--text-small` | 0.875rem (14px) |

### Line Heights

| Token | Value |
|-------|-------|
| `--leading-display` | 1.1 |
| `--leading-h1` | 1.1 |
| `--leading-h2` | 1.2 |
| `--leading-h3` | 1.3 |
| `--leading-h4` | 1.4 |
| `--leading-h5` | 1.5 |
| `--leading-base` | 1.5 |
| `--leading-small` | 1.5 |

### Font Weights

| Token | Value |
|-------|-------|
| `--font-normal` | 400 |
| `--font-medium` | 500 |
| `--font-semibold` | 600 |
| `--font-bold` | 700 |

---

## Spacing

Fluid spacing system based on an 8px grid with separate mobile and desktop scales.

### Breakpoints

- **Mobile**: 375px → 1024px
- **Desktop**: 1024px → 1440px

Values scale fluidly within each range using `clamp()`. Mobile max values equal desktop min values for a smooth handoff at 1024px.

### Tokens

| Token | Mobile (375→1024) | Desktop (1024→1440) |
|-------|-------------------|---------------------|
| `--space-xs` | 4px → 6px | 6px → 8px |
| `--space-sm` | 8px → 12px | 12px → 16px |
| `--space-md` | 16px → 24px | 24px → 32px |
| `--space-lg` | 24px → 36px | 36px → 48px |
| `--space-xl` | 32px → 48px | 48px → 64px |
| `--space-2xl` | 48px → 72px | 72px → 96px |
| `--space-3xl` | 64px → 96px | 96px → 128px |
| `--space-4xl` | 80px → 120px | 120px → 160px |

### Usage

```css
.element {
  padding: var(--space-md);
  margin-block: var(--space-lg);
  gap: var(--space-sm);
}
```

---

## Fluid Utilities

Additional fluid tokens for one-off sizing needs.

### Fluid Space Scale

Named as `--fluid-space-{min}-{max}` where values are in pixels.

Examples:
- `--fluid-space-8-16` → 8px → 16px
- `--fluid-space-16-32` → 16px → 32px
- `--fluid-space-24-48` → 24px → 48px
- `--fluid-space-32-64` → 32px → 64px

### Fluid Typography Scale

| Token | Range |
|-------|-------|
| `--fluid-text-display` | 36px → 54px |
| `--fluid-text-h1` | 32px → 40px |
| `--fluid-text-h2` | 24px → 32px |
| `--fluid-text-h3` | 20px → 24px |
| `--fluid-text-h4` | 18px → 20px |
| `--fluid-text-h5` | 16px → 18px |
| `--fluid-text-base` | 16px → 18px |
| `--fluid-text-small` | 14px → 16px |

### Usage

```css
/* Instead of media queries */
.element {
  font-size: var(--fluid-text-h2);
  padding: var(--fluid-space-16-32);
}
```

---

## Grid Layout

Responsive 12-column grid system with wrapper containers.

### Wrapper Classes

| Class | Max Width |
|-------|-----------|
| `.wrapper` | 100% (base padding only) |
| `.wrapper--lg` | 75rem (1200px) |
| `.wrapper--md` | 62.25rem (996px) |

### Responsive Grid

The `.grid` class creates a responsive column grid:

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Mobile (< 640px) | 4 | 16px |
| Tablet (640px - 1024px) | 8 | 16px |
| Desktop (> 1024px) | 12 | 24px |

### Column Span Classes

```css
/* Full width */
.col-full { grid-column: 1 / -1; }

/* Mobile (4 col) */
.col-1, .col-2, .col-3, .col-4

/* Tablet (8 col) - prefix: sm */
.col-sm-1 ... .col-sm-8

/* Desktop (12 col) - prefix: lg */
.col-lg-1 ... .col-lg-12

/* Start position (desktop) */
.col-start-1 ... .col-start-7
```

### Usage

```html
<div class="wrapper wrapper--md">
  <div class="grid">
    <div class="col-full col-lg-8">Main content</div>
    <aside class="col-full col-lg-4">Sidebar</aside>
  </div>
</div>
```

---

## Design Files

- Mobile frame: 375px
- Desktop frame: 1440px

---

## CSS Nesting Guidelines

When using CSS nesting with BEM modifiers, use full selectors instead of `&--modifier` syntax:

```css
/* ✗ Avoid - causes build warnings */
.component__element {
  &--modifier {
    /* styles */
  }
}

/* ✓ Preferred - separate selector */
.component__element {
  /* base styles */
}

.component__element--modifier {
  /* modifier styles */
}
```

Pseudo-classes and pseudo-elements (`&:hover`, `&::before`) work correctly with nesting.
