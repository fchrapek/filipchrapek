---
name: task-start
description: Start a new task or feature. Creates a branch, verifies clean baseline, reads relevant project context, and sets up a plan. Pass a task name and short description as argument (e.g. "/task-start mobile-responsive – make all pages responsive on mobile"). Use when the user says "start task", "new task", "new feature", or "let's work on X".
---

# Task Start

## Step 1: Determine Task Name and Description

Check if a task name and description were provided as an argument.

Expected format: `<task-name> – <short description>`
Examples:
- `/task-start mobile-responsive – make all pages responsive on mobile`
- `/task-start footer-links – anchor links in footer should smooth-scroll on same page`

- **If both provided**: Use the task name as the branch name suffix (e.g., `mobile-responsive` becomes branch `feature/mobile-responsive`). Keep the description as context for the plan.
- **If only name provided**: Use it as the branch name suffix. Ask the user for a short description of what needs to be done before proceeding.
- **If nothing provided**: Read `docs/SESSION-LOG.md` and memory for open items and recent unfinished work, and ask the user which one to pick. Wait for their response before proceeding.

## Step 2: Branch Setup

Ensure we start from a clean, up-to-date base.

```bash
git status
```

- If there are uncommitted changes, STOP and ask the user what to do with them (commit, stash, or discard)
- If working tree is clean, create the new branch:

```bash
git checkout main
git pull origin main 2>/dev/null || true
git checkout -b feature/<task-name>
```

If the branch already exists, ask the user whether to switch to it or create a fresh one.

## Step 3: Dev Server & Build Baseline

Check whether a dev server is running; if not, ask which one to start (EN/PL/both) — do not start automatically. Then verify both sites build cleanly.

```bash
lsof -ti:4321 >/dev/null 2>&1 && echo "EN running" || echo "EN not running"
lsof -ti:4322 >/dev/null 2>&1 && echo "PL running" || echo "PL not running"

pnpm build:en 2>&1 | tail -15
pnpm build:pl 2>&1 | tail -15
```

If build fails, report it — these are pre-existing issues. Do NOT fix automatically.

## Step 4: Task Context

Gather context for the task:

- Read `README.md` — monorepo overview, CSS architecture, component patterns
- Read `CLAUDE.md` if it exists — project conventions and gotchas
- Read `docs/SESSION-LOG.md` — check last 2-3 entries for recent context
- Check if there are any related existing branches (`git branch --list "*<task-name>*"`)
- Check memory at `~/.claude/projects/-Users-filipchrapek-Desktop-dev-filipchrapek-sites/memory/` for any relevant past context about this area
- If the task touches shared components, inspect `packages/theme/` first since changes there cascade to both EN and PL sites

## Step 5: Plan

Based on the project docs, codebase context, and the task description, propose a **brief** starting plan (3-5 bullet points max). The detailed implementation plan should evolve during the conversation, not be fully mapped out upfront.

- What needs to be built/changed (high level)
- Which package(s) the change lives in (`theme`, `site-en`, `site-pl`) and whether it needs to be mirrored across both sites
- Which components/files are the likely starting point
- Any obvious prerequisites (seed content, images, translations, etc.)

Present the plan and ask the user to confirm or adjust before starting work.

## Step 6: Browser Baseline

Verify the site works in the browser before starting work, using Chrome DevTools MCP.

1. **Navigate** to `http://localhost:4321` (EN) and/or `http://localhost:4322` (PL) — whichever the task affects
2. **Take a screenshot** — this is the baseline state before changes
3. **Check for errors** — run JS in the console:
   ```js
   JSON.stringify({
     errors: window.__errors || [],
     readyState: document.readyState,
     title: document.title,
     status: document.querySelector('body') ? 'OK' : 'EMPTY'
   })
   ```

If there are pre-existing browser errors, note them so they're not confused with task-related issues later.

## Output Format

```
Branch:       feature/<task-name> (from main)
Task:         <short description>
Scope:        theme / site-en / site-pl / all
Build (EN):   Passing / Failing
Build (PL):   Passing / Failing
Dev server:   EN up / PL up / none
Browser:      OK / Errors
```

### Task Context
- Relevant project state summary
- Related prior work

### Starting Plan
- Bullet 1...
- Bullet 2...
- ...

Ready to start? (wait for user confirmation)
