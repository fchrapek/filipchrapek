# SEO Hreflang Implementation Guide

## What's Implemented

### 1. ✅ Hreflang Tags
Automatically added in `BaseHead.astro` when you provide alternate language URLs.

### 2. ✅ JSON-LD Structured Data
- **Blog posts**: Includes BlogPosting schema with author, dates, images, keywords
- **Website**: Includes WebSite schema for homepage and other pages
- Automatically added via `StructuredData.astro` component

### 3. ✅ Dynamic RSS Feeds
RSS feed paths automatically adjust based on site language:
- English: `/rss.xml`, `/notes/rss.xml`
- Polish: `/rss.xml`, `/notatki/rss.xml`

## How to Use Hreflang Tags

For pages that have translations, pass `alternateLanguages` to the meta prop:

### Example: Homepage with Translation

**English site (`packages/site-en/src/pages/index.astro`):**
```astro
<PageLayout 
  meta={{ 
    title: "Home",
    alternateLanguages: [
      { lang: "pl-PL", url: "https://filipchrapek.pl/" }
    ]
  }}
>
```

**Polish site (`packages/site-pl/src/pages/index.astro`):**
```astro
<PageLayout 
  meta={{ 
    title: "Strona główna",
    alternateLanguages: [
      { lang: "en-GB", url: "https://filipchrapek.com/" }
    ]
  }}
>
```

### Example: Blog Post with Translation

If you have a translated version of a blog post:

```astro
<PageLayout 
  meta={{ 
    title: "My Post Title",
    alternateLanguages: [
      { lang: "pl-PL", url: "https://filipchrapek.pl/artykuly/moj-post/" }
    ]
  }}
>
```

## Generated HTML

This will generate:
```html
<!-- Current page -->
<link rel="alternate" hreflang="en-GB" href="https://filipchrapek.com/" />
<!-- Alternate language -->
<link rel="alternate" hreflang="pl-PL" href="https://filipchrapek.pl/" />

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "author": { "@type": "Person", "name": "Filip Chrapek" },
  ...
}
</script>
```

## SEO Benefits

1. **Hreflang tags**: Help Google show the right language version to users
2. **Structured data**: Rich snippets in search results (author, date, reading time)
3. **RSS auto-discovery**: Browsers and feed readers can find your feeds
4. **Proper canonicals**: Prevents duplicate content issues

## Testing

- **Structured Data**: Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
- **Hreflang**: Use [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)
