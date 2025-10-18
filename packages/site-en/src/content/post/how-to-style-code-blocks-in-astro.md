---
title: Write your code like a decent human being – how Astro Expressive Code makes your snippets beautiful
description: "Have you ever looked at your fresh block of code and wanted to gouge your freaking eyes out? Yeah, me neither. I've been using Astro Expressive Code, cause I'm not an idiot."
publishDate: "30 June 2025"
tags: ["astro", "expressive-code", "presentation", "code"]
---

Have you ever looked at a block of code and wanted to gouge your freaking eyes out?

No? Yeah, me neither.

I've been using `astro-expressive-code`, cause I'm not an idiot.

If you're still presenting your code like an ape with just the basic styling, then I'm sorry – you're an idiot.

BUT, worry no more, cause today I'll show you how with just a couple of lines of code you can stop being one (an idiot, I mean).

![Don't be an idiot](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOW56aWpiMHBpMWx3YWxzMzJmZDU1ZGZ5M2h2Y3c5YnE1ZGJ6cGFvcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pVDt8O8GIqDLenIsQe/giphy.gif)

## Introducing Astro Expressive Code

The beauty of Expressive Code is that it integrates seamlessly with Astro and gives you professional-looking code blocks with minimal setup. Line numbers, syntax highlighting, line markers, titles – all of that jazz works out of the box.

**Let's make your code look pretty in no time!**

### 1. Install the package

```bash
pnpm add astro-expressive-code
```

(or `npm install` if you're into that sort of thing)

:::tip[Quick start]
You can get started with zero configuration. Just install the package, add it to your integrations, and you're good to go. The defaults are already pretty solid.
:::

If you're interested in how it works under the hood, check out the [docs](https://expressive-code.com/).

### 2. Adjust the `astro.config` file

```ts title="astro.config.ts" {2, 7}
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";

export default defineConfig({
  integrations: [
    // Add it BEFORE your markdown/mdx integration
    expressiveCode({
      themes: ["dracula", "github-light"],
    }),
  ],
});
```

At a minimum, you need to add the integration and choose your themes. The plugin handles the rest.

:::important[ ]
Make sure to add `expressiveCode` **before** any MDX integration in your config. Order matters here.
:::

### 3. Configure it (optional but recommended)

You can customize Expressive Code to match your site's vibe. Here's what I'm using:

```ts title="site.config.ts"
export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
  styleOverrides: {
    borderRadius: "4px",
    codeFontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    codeFontSize: "0.875rem",
    codeLineHeight: "1.7142857rem",
    codePaddingInline: "1rem",
    frames: {
      frameBoxShadowCssValue: "none",
    },
    uiLineHeight: "inherit",
  },
  themes: ["dracula", "github-light"],
  useThemedScrollbars: false,
};
```

Then import it in your `astro.config.ts`:

```ts title="astro.config.ts"
import { expressiveCodeOptions } from "./src/site.config";

export default defineConfig({
  integrations: [expressiveCode(expressiveCodeOptions)],
});
```

:::note[Theme switching]
If you're using dark/light mode on your site, Expressive Code can automatically switch themes based on your theme selector. Check the `themeCssSelector` option in the config.
:::

## What you get out of the box

### Syntax highlighting

Just write your code blocks with the language specified:

```js
function demo() {
  console.log("Beautiful syntax highlighting");
  return true;
}
```

### Code titles

Add a title to give context:

```js title="my-awesome-function.js"
function myAwesomeFunction() {
  return "This has a title!";
}
```

### Line highlighting

Mark specific lines as inserted, deleted, or highlighted:

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log("this line is marked as deleted");
  // This line and the next one are marked as inserted
  console.log("Hello");

  return "this line uses the neutral default marker type";
}
```

### Terminal-style blocks

Perfect for showing bash commands:

```bash
pnpm install astro-expressive-code
pnpm dev
```

## The result

Your code blocks will look professional, readable, and actually pleasant to look at. No more ugly, unstyled code that makes people want to close the tab.

![Professional doggo](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzhqaW90ejNya29wNmZlNnp6emdwZHh0MGR5aGh5MHJuejA2MXFiZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fbyGEE9mlqDyE/giphy.gif)

Expressive Code handles:
- **Syntax highlighting** for dozens of languages
- **Line numbers** (optional)
- **Line markers** (insertions, deletions, highlights)
- **Code titles** for context
- **Theme switching** (dark/light mode support)
- **Copy button** for easy code copying
- **And much more** – check the [docs](https://expressive-code.com/reference/configuration/)

## Summary

If you're building with Astro and you care even a little bit about how your code looks, use Expressive Code. It takes 5 minutes to set up and makes your content look 100x more professional.

Stop being an idiot. Install it now.

---

**Useful links:**
- [Astro Expressive Code Documentation](https://expressive-code.com/)
- [Available Themes](https://expressive-code.com/guides/themes/)
- [Configuration Reference](https://expressive-code.com/reference/configuration/)
