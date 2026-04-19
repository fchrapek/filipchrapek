---
name: task-done
description: Wrap up a task before merging. Runs build, reviews all changes on the branch, checks for security issues, updates project docs, and prepares a PR summary or commit. Use when the user says "task done", "wrap up task", "ready to merge", or "finish task".
---

# Task Done Checklist

Run through each step in order. Report findings as a summary at the end.

## Step 1: Build Verification

Verify both sites build cleanly, plus lint checks.

```bash
pnpm build:en 2>&1 | tail -15
pnpm build:pl 2>&1 | tail -15
pnpm lint:css 2>&1 | tail -15
pnpm check 2>&1 | tail -15
```

If any build or check fails, report the errors. Do NOT fix automatically — report to the user.

## Step 2: Branch Review

Review all work done on this branch vs main.

```bash
git log --oneline main..HEAD
git diff --stat main..HEAD
```

Summarize:
- Number of commits and what they cover
- Files changed, grouped by package (`theme/`, `site-en/`, `site-pl/`)
- Whether changes to `theme/` are properly consumed by both sites
- Any large diffs that might need splitting

## Step 3: Security Quick Check

Scan changed files for common security anti-patterns.

```bash
git diff main..HEAD --name-only
```

Check changed JS/TS/Astro files for:
- `set:html` / `innerHTML` / `dangerouslySetInnerHTML` with user-controlled or markdown-derived content that hasn't been sanitized
- Unsanitized content from frontmatter or remote data rendered directly into HTML
- Missing `rel="noopener noreferrer"` on `target="_blank"` external links
- Hardcoded API keys, secrets, or tokens (especially `WEBMENTION_API_KEY` or similar env values inlined)
- `eval()` usage
- External fetch calls without URL validation

Report any findings.

## Step 4: Asset Check

Check if any new assets were added and whether they need attention:

```bash
git diff main..HEAD --name-only | grep -E '\.(jpg|jpeg|png|gif|svg|webp|avif|mp4|pdf)$'
```

Flag:
- Images not using Astro's `<Image>` / `<Picture>` component where appropriate
- Oversized originals (>500 KB) that should be optimized
- Missing WebP/AVIF variants for large hero images
- Unminified SVGs
- Assets added to only one of `site-en/public` or `site-pl/public` when both sites need them

## Step 5: Browser Verification

Verify the changes look correct in the browser using Chrome DevTools MCP.

1. **Navigate** to `http://localhost:4321` (EN) and/or `http://localhost:4322` (PL), plus any specific pages affected by the changes
2. **Take a screenshot** of the affected page(s) on both locales if the change lives in `theme/`
3. **Check for errors** — run JS in the console:
   ```js
   JSON.stringify({
     errors: window.__errors || [],
     readyState: document.readyState,
     title: document.title,
     status: document.querySelector('body') ? 'OK' : 'EMPTY'
   })
   ```
4. If the task involved visual changes, compare against the baseline from task-start
5. For layout changes, check at least one narrow viewport (e.g. 375px) since the project emphasizes mobile responsiveness

Report any rendering issues, console errors, or visual regressions.

## Step 6: Documentation Update

Check if project documentation needs updating based on changes:

- **README.md** — New conventions, architecture changes, new utility classes, new component patterns, deployment changes
- **CLAUDE.md** (if it exists) — New conventions, gotchas, or architecture changes discovered
- Check `docs/` for any gaps

Propose specific edits if needed. Ask the user to confirm before making changes.

## Step 7: Time Spent

Ask the user how much time was spent on this task. Wait for their answer before proceeding — do NOT guess or skip.

Example: "How much time did you spend on this task?"

Store the answer for the output summary and session log.

## Step 8: PR / Merge Preparation

Based on the branch review, draft a summary:

- **Title**: Short, descriptive (under 70 chars)
- **Summary**: What was built/changed and why (2-3 bullets)
- **Checklist**: Visual verification items (both EN and PL if shared theme changed)

Present the draft and ask the user if they want to:
- Create a PR
- Merge directly to `main`
- Make adjustments first

## Output Format

| Check | Status | Notes |
|-------|--------|-------|
| Build (EN) | Pass/Fail | Build status |
| Build (PL) | Pass/Fail | Build status |
| Lint CSS | Pass/Fail | Stylelint status |
| Astro check | Pass/Fail | Type check status |
| Security | Pass/Fail | No issues / N findings |
| Assets | Pass/Fail | All optimized / N to check |
| Browser | Pass/Fail | No errors / N issues |
| Commits | - | N commits on branch |
| Docs | - | Up to date / N items to update |
| Time spent | - | User-confirmed time |

### Summary
**Title:** ...
**Changes:** ...
**Checklist:** ...

How to proceed? (wait for user confirmation)
