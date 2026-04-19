---
name: session-start
description: Beginning-of-session orientation. Run at the start of a new work session to get context on where things left off — branch state, recent commits, uncommitted work, build status, and project status. Use when the user says "start session", "new session", "where did we leave off", or "catch me up".
---

# Session Start Checklist

Run through each step in order. Present a concise orientation summary at the end.

## Step 1: Branch & Working Tree State
Check current branch, uncommitted changes, and stash.

```bash
git branch -v
git status
git stash list
```

If there's uncommitted work or stashes, flag them — they may be leftovers from the last session.

## Step 2: Recent History
Show what happened recently on this branch and on main.

```bash
git log --oneline -10          # current branch
git log --oneline -5 main      # recent main activity
```

If the current branch is behind main, note how many commits behind.

## Step 3: Build Check
Verify both sites build cleanly.

```bash
pnpm build:en 2>&1 | tail -15
pnpm build:pl 2>&1 | tail -15
```

If a build fails, report it — these are pre-existing issues to be aware of, NOT things to fix automatically.

## Step 4: Project Context
Read project docs and memory to remind what's in progress and what's next.

- Read `README.md` — monorepo overview, CSS architecture, component patterns, deployment
- Read `CLAUDE.md` if it exists — project conventions, gotchas
- Read `docs/SESSION-LOG.md` — check the last 2-3 entries to understand what happened in recent sessions
- Read project memory at `~/.claude/projects/-Users-filipchrapek-Desktop-dev-filipchrapek-sites/memory/MEMORY.md` — surface relevant context from past sessions

## Step 5: Dev Server Check
Verify a dev server is running. If not, ask whether to start EN (port 4321), PL (port 4322), or both — do NOT start it automatically.

```bash
lsof -ti:4321 >/dev/null 2>&1 && echo "EN running on 4321" || echo "EN not running"
lsof -ti:4322 >/dev/null 2>&1 && echo "PL running on 4322" || echo "PL not running"
```

To start: `pnpm dev:en` or `pnpm dev:pl` (launch in background).

## Step 6: Browser Verification
Once a dev server is running, verify the site loads correctly using Chrome DevTools MCP.

1. **Navigate** to the running site: `http://localhost:4321` (EN) or `http://localhost:4322` (PL)
2. **Take a screenshot** to verify the homepage renders correctly
3. **Check for errors** — run JS in the console:
   ```js
   JSON.stringify({
     errors: window.__errors || [],
     readyState: document.readyState,
     title: document.title,
     status: document.querySelector('body') ? 'OK' : 'EMPTY'
   })
   ```

If the page doesn't load or shows errors, report them. If there are console JS errors, list them.

## Step 7: Log Session Start
Append a session start marker to `docs/SESSION-LOG.md`:

```markdown
## [YYYY-MM-DD] Session started at HH:MM
```

Use the current date and time. This will be completed by session-close with branch name, duration, and work summary.

## Output Format
Present a summary:

| Check | Status | Notes |
|-------|--------|-------|
| Branch | - | `feature/xyz`, 3 ahead of main |
| Working tree | Clean/Dirty | N uncommitted files |
| Build (EN) | Pass/Fail | Build status |
| Build (PL) | Pass/Fail | Build status |
| Dev server | Up/Down | EN/PL status |
| Browser | Pass/Fail | Site loads, no console errors |

### Where We Left Off
- Brief summary based on SESSION-LOG.md, git log, and memory
- Any unfinished work or open branches

### What's Next
- Open items from roadmap or memory
- Suggested next task based on project priorities
