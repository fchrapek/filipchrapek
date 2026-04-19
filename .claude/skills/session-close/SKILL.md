---
name: session-close
description: End-of-session review checklist. Run before closing a work session to verify build passes, check for uncommitted changes, list unmerged branches, review security patterns, and update documentation and memory. Use when the user says "close session", "wrap up", "end session", or "session review".
---

# Session Close Checklist

Run through each step in order. Report findings as a summary table at the end.

## Step 1: Build Check
Verify both sites build cleanly, plus lint checks.

```bash
pnpm build:en 2>&1 | tail -15
pnpm build:pl 2>&1 | tail -15
pnpm lint:css 2>&1 | tail -15
pnpm check 2>&1 | tail -15
```

If any build or check fails, report the errors. Do NOT fix automatically — report to the user.

## Step 2: Uncommitted Changes
Check for uncommitted work.

```bash
git status
git diff --stat
```

If there are uncommitted changes, list the files and ask the user if they should be committed or discarded.

## Step 3: Branch State
List all local branches and their relationship to main.

```bash
git branch -v
git log --oneline main..HEAD  # if not on main
```

Flag any branches that haven't been merged. List how many commits each is ahead.

## Step 4: Security Quick Check
Scan for common security anti-patterns in recently changed files.

```bash
git diff main..HEAD --name-only 2>/dev/null || git diff HEAD~5..HEAD --name-only
```

Check changed JS/TS/Astro files for:
- `set:html` / `innerHTML` / `dangerouslySetInnerHTML` with user-controlled or markdown-derived content that hasn't been sanitized
- Unsanitized content from frontmatter or remote data rendered directly into HTML
- Missing `rel="noopener noreferrer"` on `target="_blank"` external links
- Hardcoded API keys, secrets, or tokens
- `eval()` usage

Report any findings.

## Step 5: Documentation

**MANDATORY — do NOT skip this step.**

Read project docs and compare against the session's changes.

```bash
ls *.md docs/*.md 2>/dev/null
```

For each file, actually read its contents and check for gaps:
- **README.md** — New conventions, architecture changes, utility classes, component patterns, deployment changes
- **CLAUDE.md** (if it exists) — New conventions, gotchas, or patterns discovered
- `docs/SESSION-LOG.md` — about to be updated in Step 9

For each file, report one of:
- Up to date — no changes needed
- Needs update — describe what's missing

Fix any gaps before closing. Do not just list the files — read them and verify.

## Step 6: Memory Lint
Review existing memory files for staleness and accuracy.

```bash
ls ~/.claude/projects/-Users-filipchrapek-Desktop-dev-filipchrapek-sites/memory/
```

For each memory file:
- If it references a file path → verify the file still exists
- If it references a function, flag, variable, or component → grep for it
- If the information is now documented in README.md / CLAUDE.md → mark as redundant

Report:
- **Stale**: memories referencing things that no longer exist
- **Redundant**: memories duplicating what's in project docs
- **Current**: memories still valid

Ask the user before deleting or updating any stale memories.

## Step 7: Capture Key Decisions
Review the conversation for decisions and insights worth preserving:

- Architecture or design decisions made (and *why*)
- Debugging insights that weren't obvious ("X broke because of Y")
- User preferences or workflow patterns discovered
- Anything the user explicitly said to remember
- Bilingual/i18n gotchas that apply to both sites

For each candidate, check if it's already covered by an existing memory or project doc. Only save what's genuinely new and useful for future sessions. Present candidates to the user for approval before saving.

## Step 8: Time Spent

Ask the user how much time was spent this session. Wait for their answer before proceeding — do NOT guess or skip.

Example: "How much time did you spend this session?"

## Step 9: Session Log
Append an entry to `docs/SESSION-LOG.md`. Format:

```markdown
## [YYYY-MM-DD] branch-name | Xh Ym

- What was done (2-4 bullets)
- Key decisions: any non-obvious choices made and why
```

Keep entries concise — the log should be scannable. Use absolute dates, not relative.

## Output Format
Present a summary table:

| Check | Status | Notes |
|-------|--------|-------|
| Build (EN) | Pass/Fail | Build status |
| Build (PL) | Pass/Fail | Build status |
| Lint CSS | Pass/Fail | Stylelint status |
| Astro check | Pass/Fail | Type check status |
| Uncommitted | Clean/Dirty | N files |
| Branches | - | All merged / N unmerged |
| Security | Pass/Fail | No issues / N findings |
| Docs | Pass/Fail | Up to date / Needs update |
| Memory lint | Pass/Fail | N stale / N redundant / N current |
| Decisions | - | N captured / none |
| Time spent | - | User-confirmed time |
| Session log | Done | Entry appended |
