# Theme Configuration

## Adding a New Theme

1. **Add theme to `themes.ts`:**

```typescript
{
  id: 'your-theme-id',
  label: {
    en: 'Your Theme Name',
    pl: 'Nazwa Twojego Motywu',
  },
  description: {
    en: 'Optional description',
    pl: 'Opcjonalny opis',
  },
}
```

2. **Create theme CSS file:**

Create `/styles/06-themes/_your-theme-id.css`:

```css
html[data-style-theme="your-theme-id"] {
  /* Your theme styles here */
}
```

3. **Import in `main.css`:**

```css
@import "./06-themes/_your-theme-id.css";
```

That's it! The theme will automatically appear in the dropdown with the correct language.

## Theme Structure

- **Config**: `/config/themes.ts` - Central theme registry
- **Styles**: `/styles/06-themes/_themename.css` - Theme-specific CSS
- **Component**: `/components/ThemeSwitcher.astro` - Auto-loads from config

## Language Support

The system automatically detects the site language from `siteConfig.lang` and displays the appropriate labels.

Supported languages: `en`, `pl`
