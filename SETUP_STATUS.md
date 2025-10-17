# Monorepo Setup Status

## ✅ Completed

### Structure
- [x] Created monorepo root with pnpm workspace
- [x] Created `packages/theme` with shared components, layouts, styles, utils
- [x] Created `packages/site-en` for English site
- [x] Created `packages/site-pl` for Polish site
- [x] Copied all shared code to theme package
- [x] Set up package.json for all packages
- [x] Created content structure for both sites

### Configuration
- [x] Created site.config.ts for both sites (different URLs, languages)
- [x] Created content.config.ts for both sites
  - English: `post`, `note`, `tag`, `pages`
  - Polish: `artykul`, `notatka`, `tag`, `pages`
- [x] Updated index.astro for both sites to use theme imports
- [x] Created home.md content for both languages

## 🚧 To Do

### 1. Install Dependencies
```bash
cd /Users/filipchrapek/Desktop/dev/filipchrapek-sites
pnpm install
```

### 2. Update Data Files
Both sites have `src/data/post.ts` that needs to be updated:
- **site-en**: Change references to use `post` collection
- **site-pl**: Change references to use `artykul` collection

### 3. Create Polish Routes
Polish site needs route folders renamed:
- Rename `/posts/` → `/artykuly/`
- Rename `/notes/` → `/notatki/`  
- Rename `/tags/` → `/tagi/`
- Create `/o-mnie.astro` (Polish about page)

### 4. Update All Page Files
All `.astro` files in both sites need imports updated from:
```astro
import Component from "@/components/..."
```
To:
```astro
import Component from "@filipchrapek/theme/components/..."
```

### 5. Create About Page Content
- Create `src/content/pages/about.md` for both sites

### 6. Add Polish Content
- Add Polish articles to `site-pl/src/content/artykul/`
- Add Polish notes to `site-pl/src/content/notatka/`

### 7. Test Locally
```bash
# Test English site
pnpm dev:en
# Visit http://localhost:4321

# Test Polish site  
pnpm dev:pl
# Visit http://localhost:4322
```

### 8. Fix TypeScript Paths
Update `tsconfig.json` in both sites to include theme package paths.

## Next Steps

1. Run `pnpm install` to install all dependencies
2. Update the data files to use correct collection names
3. Rename Polish route folders
4. Test both sites locally
5. Fix any remaining import issues

## Notes

- Theme package uses workspace protocol: `"@filipchrapek/theme": "workspace:*"`
- English site runs on port 4321 (default)
- Polish site runs on port 4322
- Both sites share the same theme, only content and routes differ
