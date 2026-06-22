# Release Planning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 new skills (`release-init`, `release-new`, `release-add`, `release-remove`, `release-status`) that let users group plannings into versioned releases with lifecycle tracking.

**Architecture:** One SKILL.md per command under `skills/`, following the exact pattern of existing skills (YAML frontmatter + `## Arguments` + `## Steps`). No changes to `planning-template/` or `plan-init` — releases are opt-in via `/release-init`.

**Tech Stack:** Markdown skill files only. No code. Verification is grep-based consistency checks.

## Global Constraints

- All skill files follow the frontmatter pattern: `name`, `description`, `argument-hint` (optional), `allowed-tools`.
- Release files live in `.releases/` at the project root (NOT inside `.planning/`).
- Version format: `vX.Y.Z` (semantic versioning, lowercase v).
- Target period format: `YYYY-QN-MN-WN` (e.g. `2026-Q1-M1-W2`).
- `release-new` must stop if `.releases/` does not exist — same guard pattern as `plan-new` with `.planning/`.
- `release-status` reads planning states live from `.planning/`, never from cached values in the release file.

---

### Task 1: `release-init` skill

**Files:**
- Create: `skills/release-init/SKILL.md`

**Interfaces:**
- Produces: `.releases/` directory + `.releases/README.md` (consumed by all other release skills)

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p skills/release-init
```

- [ ] **Step 2: Write `skills/release-init/SKILL.md`**

```markdown
---
name: release-init
description: Initialize the .releases/ directory for release planning. Run once per project, independent of /plan-init.
allowed-tools: [Bash, Write]
---

Initialize `.releases/` for release planning. This is a one-time setup command, independent of `/plan-init` — not every project that uses the planning system needs release management.

## Steps

1. Check whether `.releases/` already exists at the project root. If it does, stop: "`.releases/` already initialized — run `/release-status` to see existing releases."

2. Create the `.releases/` directory.

3. Write `.releases/README.md` with the following content:

\`\`\`markdown
# 🚀 Releases

| Version | Target | Status | Est. Date | Plannings |
|---------|--------|--------|-----------|-----------|
| — | — | — | — | — |
\`\`\`

4. Report: "`.releases/` initialized. Next step: `/release-new <vX.Y.Z> -- <purpose>`."
```

- [ ] **Step 3: Verify the file was created and has key content**

```bash
grep -c "release-init\|release-status\|releases/" skills/release-init/SKILL.md
```

Expected output: `3` (or more)

- [ ] **Step 4: Commit**

```bash
git add skills/release-init/SKILL.md
git commit -m "feat: add release-init skill"
```

---

### Task 2: `release-new` skill

**Files:**
- Create: `skills/release-new/SKILL.md`

**Interfaces:**
- Consumes: `.releases/` (must exist — created by `release-init`)
- Produces: `.releases/<version>.md` + updated `.releases/README.md` row

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p skills/release-new
```

- [ ] **Step 2: Write `skills/release-new/SKILL.md`**

```markdown
---
name: release-new
description: Create a new release in DRAFT status. Requires /release-init to have been run first.
argument-hint: <vX.Y.Z> -- <purpose>
allowed-tools: [Read, Write, Bash]
---

Create a new release entry in `.releases/`. Requires `/release-init` to have been run first.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z -- <purpose>`

- `vX.Y.Z` — semantic version (e.g. `v1.0.0`)
- `purpose` — one-sentence description of why this release exists

Example: `v1.0.0 -- First public API release with JWT auth and admin dashboard`

## Steps

1. Check `.releases/` exists at the project root. If not, stop: "Run `/release-init` first."

2. Parse `$ARGUMENTS` by splitting on the first ` -- `:
   - Left side = `version` (trimmed)
   - Right side = `purpose` (trimmed)
   - Validate `version` matches the pattern `v<digits>.<digits>.<digits>` (e.g. `v1.0.0`, `v2.3.14`). If it does not, stop: "Invalid version format. Use `vX.Y.Z` (e.g. `v1.0.0`)."
   - Stop if `purpose` is empty.

3. Check `.releases/<version>.md` does not already exist. If it does, stop: "Release `<version>` already exists. Use `/release-add <version> <NNN-slug>` to add plannings to it."

4. Ask the user for:
   - **Target period** — format `YYYY-QN-MN-WN` (e.g. `2026-Q1-M1-W2`). This encodes: year, quarter (Q1–Q4), month within that quarter (M1–M3), week within that month (W1–W4).
   - **Estimated date** — format `YYYY-MM-DD` (the specific target date within the period above).

5. Write `.releases/<version>.md` with the following content (substituting values):

\`\`\`markdown
# 🚀 Release <version>

> **Status:** DRAFT
> **Target:** <target>
> **Estimated Date:** <estimated-date>
> [← .releases/README.md](README.md)

---

## Purpose

<purpose>

---

## Scope

[Which areas, services, or repositories are affected by this release.]

---

## Included Plannings

| # | Planning | Summary | Status |
|---|----------|---------|--------|
| — | — | — | — |

---

## Done Criteria

- [ ] All included plannings are COMPLETED
- [ ] Release notes drafted and reviewed

---

## Release Notes

> *Fill when the release is delivered. Summarize what changed for end users.*

*(pending)*

---

> [← .releases/README.md](README.md)
\`\`\`

6. Update `.releases/README.md`:
   - If the table contains only the placeholder row (`| — | — | — | — | — |`): replace that row with the new entry.
   - Otherwise: append a new row at the end of the table.
   - Row format: `| [<version>](<version>.md) | <target> | DRAFT | <estimated-date> | 0/0 |`

7. Report: "Release `<version>` created at `.releases/<version>.md` (status: DRAFT, target: <target>). Next step: `/release-add <version> <NNN-slug>`."
```

- [ ] **Step 3: Verify key guards are present**

```bash
grep -c "release-init\|vX.Y.Z\|DRAFT\|Plannings" skills/release-new/SKILL.md
```

Expected output: `4` (or more)

- [ ] **Step 4: Commit**

```bash
git add skills/release-new/SKILL.md
git commit -m "feat: add release-new skill"
```

---

### Task 3: `release-add` skill

**Files:**
- Create: `skills/release-add/SKILL.md`

**Interfaces:**
- Consumes: `.releases/<version>.md`, `.planning/active/<id>/00-initial.md` or `.planning/finished/<id>/00-initial.md`
- Produces: updated `## Included Plannings` table in release file + updated `Plannings` count in README

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p skills/release-add
```

- [ ] **Step 2: Write `skills/release-add/SKILL.md`**

```markdown
---
name: release-add
description: Add one or more plannings to an existing release. Reads planning summaries and current statuses from .planning/ automatically.
argument-hint: <vX.Y.Z> <NNN-slug> [<NNN-slug> ...]
allowed-tools: [Read, Write, Bash, Glob]
---

Add one or more plannings to a release's `## Included Plannings` table. Planning summaries and current statuses are read from `.planning/` automatically — no manual entry needed.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z NNN-slug [NNN-slug ...]`

- First token: release version (e.g. `v1.0.0`)
- Remaining tokens: one or more planning IDs (e.g. `001-user-auth-api 002-dashboard`)

Example: `v1.0.0 001-user-auth-api 002-dashboard`

## Steps

1. Split `$ARGUMENTS` on whitespace: first token = `version`, remaining = list of planning IDs. Stop if no planning IDs are provided.

2. Locate `.releases/<version>.md`. If not found, stop: "Release `<version>` not found. Create it first with `/release-new <version> -- <purpose>`."

3. For each planning ID in the list:

   a. Search for the planning folder: check `.planning/active/<planning-id>/` and `.planning/finished/<planning-id>/` (in that order). If neither exists, stop: "Planning `<planning-id>` not found in `.planning/active/` or `.planning/finished/`."

   b. Read `00-initial.md` from the found folder. Extract the `Intent` field — the text on the line immediately after `## Intent`, taking only the first sentence (up to the first `.`). Strip any surrounding `[` `]` characters if the field is still a placeholder.

   c. Extract the planning's current status: look for the line matching `> **Status:**` in `00-initial.md`. Take the value after the colon. If not found, use `UNKNOWN`.

   d. Check whether `<planning-id>` already appears in any cell of the `## Included Plannings` table. If it does, skip this planning and record: "`<planning-id>` already in release — skipped."

   e. Count existing data rows in the table (skip the placeholder row `| — | — | — | — |`). Next row number = count + 1.

   f. If the table contains only the placeholder row, replace it with the new row. Otherwise append the new row at the end.

   g. New row format: `| <N> | <planning-id> | <intent-first-sentence> | <status> |`

4. After processing all planning IDs, recount the `## Included Plannings` table:
   - `TOTAL` = number of data rows
   - `COMPLETED` = number of rows whose `Status` column is exactly `COMPLETED`
   - Update the `Plannings` column in `.releases/README.md` for this release to `<COMPLETED>/<TOTAL>`.

5. Report: `N planning(s) added, M skipped (already present).` Print the updated `## Included Plannings` table.
```

- [ ] **Step 3: Verify key behaviors documented**

```bash
grep -c "already in release\|COMPLETED\|placeholder\|00-initial" skills/release-add/SKILL.md
```

Expected output: `4` (or more)

- [ ] **Step 4: Commit**

```bash
git add skills/release-add/SKILL.md
git commit -m "feat: add release-add skill"
```

---

### Task 4: `release-remove` skill

**Files:**
- Create: `skills/release-remove/SKILL.md`

**Interfaces:**
- Consumes: `.releases/<version>.md`, `.releases/README.md`
- Produces: updated release file with row removed, updated README count

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p skills/release-remove
```

- [ ] **Step 2: Write `skills/release-remove/SKILL.md`**

```markdown
---
name: release-remove
description: Remove a planning from a release. Requires explicit confirmation if the release has already shipped.
argument-hint: <vX.Y.Z> <NNN-slug>
allowed-tools: [Read, Write, Bash]
---

Remove a planning from a release's `## Included Plannings` table. Adjusts row numbers and updates the README count automatically.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z NNN-slug`

- `version` — the release version (e.g. `v1.0.0`)
- `NNN-slug` — the planning ID to remove (e.g. `002-dashboard`)

Example: `v1.0.0 002-dashboard`

## Steps

1. Split `$ARGUMENTS` on whitespace into `version` (first token) and `planning-id` (second token). Stop if either is missing.

2. Locate `.releases/<version>.md`. If not found, stop: "Release `<version>` not found."

3. Read the `> **Status:**` line from the release file.
   - If status is `RELEASED`: warn the user — "Release `<version>` has already shipped. Removing a planning from it rewrites its history. Confirm? (yes/no)". Stop if the user does not confirm.

4. Scan the `## Included Plannings` table for a row whose second column (`Planning`) contains `<planning-id>`. If no such row exists, stop: "Planning `<planning-id>` is not in release `<version>`."

5. Remove that row. Renumber all remaining data rows: set the `#` column to 1, 2, 3… in order.

6. If the table now has no data rows (all were removed or only one was removed), restore the placeholder row: `| — | — | — | — |`

7. Recount the table: `COMPLETED/TOTAL`. Update the `Plannings` column in `.releases/README.md` for this release.

8. Report: "Planning `<planning-id>` removed from release `<version>`. Plannings remaining: <TOTAL> (<COMPLETED> completed)."
```

- [ ] **Step 3: Verify RELEASED guard and renumbering are documented**

```bash
grep -c "RELEASED\|Renumber\|placeholder\|Confirm" skills/release-remove/SKILL.md
```

Expected output: `4` (or more)

- [ ] **Step 4: Commit**

```bash
git add skills/release-remove/SKILL.md
git commit -m "feat: add release-remove skill"
```

---

### Task 5: `release-status` skill

**Files:**
- Create: `skills/release-status/SKILL.md`

**Interfaces:**
- Consumes: `.releases/*.md`, `.planning/active/*/00-initial.md`, `.planning/finished/*/00-initial.md`
- Produces: console output only (no file writes, except `--mark-released` / `--mark-cancelled` flags which update the release file and README)

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p skills/release-status
```

- [ ] **Step 2: Write `skills/release-status/SKILL.md`**

```markdown
---
name: release-status
description: Show live status of all releases or a specific release, reading planning states from .planning/. Use --mark-released or --mark-cancelled to transition status.
argument-hint: [<vX.Y.Z>] [--mark-released | --mark-cancelled]
allowed-tools: [Read, Write, Bash, Glob]
---

Show release status with live planning states read from `.planning/` (the source of truth — not from cached values in the release file). Optionally transition a release to RELEASED or CANCELLED.

## Arguments

`$ARGUMENTS` — one of:

- *(empty)* — summary table of all releases
- `vX.Y.Z` — full detail for one release with live planning statuses
- `vX.Y.Z --mark-released` — mark as RELEASED (requires all plannings COMPLETED)
- `vX.Y.Z --mark-cancelled` — mark as CANCELLED regardless of planning states

## Steps

### No argument — all releases summary

1. Verify `.releases/` exists. If not, stop: "Run `/release-init` first."

2. Glob all `.releases/v*.md` files (exclude `README.md`). If none found, report: "No releases yet. Create one with `/release-new <vX.Y.Z> -- <purpose>`."

3. For each release file:
   a. Read: version (from filename), `> **Status:**`, `> **Target:**`, `> **Estimated Date:**`.
   b. Read each data row in `## Included Plannings` to collect planning IDs (skip the placeholder row `| — |`).
   c. For each planning ID: look up current status by reading `.planning/active/<id>/00-initial.md` or `.planning/finished/<id>/00-initial.md` — whichever exists. Extract `> **Status:**`. If neither file is found, mark status as `NOT FOUND`.
   d. Compute `COMPLETED_COUNT` (rows with live status `COMPLETED`) and `TOTAL_COUNT`.
   e. Determine suggestion:
      - Any planning `NOT FOUND` → `⚠️ planning not found in .planning/`
      - Any planning has live status `BLOCKED` and release status ≠ `BLOCKED` → `⚠️ has BLOCKED planning`
      - All plannings `COMPLETED` and release status ≠ `RELEASED` → `✅ ready — run \`/release-status <version> --mark-released\``
      - `COMPLETED_COUNT > 0` but not all done and release status is `DRAFT` → `consider moving to IN PROGRESS`
      - `TOTAL_COUNT = 0` → `add plannings with \`/release-add <version> <NNN-slug>\``
      - No suggestion → `—`

4. Print summary table:

\`\`\`
| Version | Target        | Status      | Est. Date  | Progress | Suggestion                                  |
|---------|--------------|-------------|------------|----------|---------------------------------------------|
| v1.0.0  | 2026-Q1-M1-W2 | IN PROGRESS | 2026-01-12 | 2/3      | ✅ ready — run --mark-released              |
| v1.1.0  | 2026-Q2-M1-W1 | DRAFT       | 2026-04-05 | 0/0      | add plannings with /release-add             |
\`\`\`

---

### With version — detail view

1. Locate `.releases/<version>.md`. Stop if not found.

2. Read all fields: status, target, estimated date, purpose, scope, done criteria, release notes.

3. Read each data row in `## Included Plannings`. For each planning ID:
   - Read live status from `.planning/active/<id>/00-initial.md` or `.planning/finished/<id>/00-initial.md`.
   - If live status differs from the cached value in the release file, annotate: `COMPLETED (cached: IN PROGRESS)`.
   - If not found: annotate `NOT FOUND`.

4. Print the full release detail, replacing the Status column in `## Included Plannings` with live values.

5. Print suggestion below the output:
   - All plannings COMPLETED and status ≠ RELEASED → "✅ All plannings done — run `/release-status <version> --mark-released` to ship."
   - Any planning BLOCKED → "⚠️ Planning `<id>` is BLOCKED — consider `/release-remove <version> <id>` or resolve the blocker first."
   - No data rows → "No plannings — add with `/release-add <version> <NNN-slug>`."
   - No suggestion needed → omit.

---

### `--mark-released` flag

1. Parse `version` from `$ARGUMENTS`. Locate `.releases/<version>.md`. Stop if not found.

2. Read all planning IDs from `## Included Plannings` (skip placeholder row).

3. For each planning ID: read live status from `.planning/`. Collect all IDs whose live status is not `COMPLETED`.

4. If any planning is not `COMPLETED`: stop — "Cannot mark as RELEASED. The following plannings are not COMPLETED: [list each with its live status]. Remove them with `/release-remove <version> <id>` or wait until they complete."

5. In `.releases/<version>.md`: replace the line `> **Status:** <old>` with `> **Status:** RELEASED`.

6. In `.releases/README.md`: find the table row where the Version column contains `<version>` and replace its Status column value with `RELEASED`.

7. Report: "Release `<version>` marked as RELEASED. 🎉"

---

### `--mark-cancelled` flag

1. Parse `version` from `$ARGUMENTS`. Locate `.releases/<version>.md`. Stop if not found.

2. In `.releases/<version>.md`: replace the line `> **Status:** <old>` with `> **Status:** CANCELLED`.

3. In `.releases/README.md`: find the table row where the Version column contains `<version>` and replace its Status column value with `CANCELLED`.

4. Report: "Release `<version>` marked as CANCELLED."
```

- [ ] **Step 3: Verify all four modes and the BLOCKED guard are present**

```bash
grep -c "mark-released\|mark-cancelled\|BLOCKED\|NOT FOUND\|live status" skills/release-status/SKILL.md
```

Expected output: `5` (or more)

- [ ] **Step 4: Commit**

```bash
git add skills/release-status/SKILL.md
git commit -m "feat: add release-status skill"
```

---

### Task 6: Update plugin manifest and finalize

**Files:**
- Modify: `.claude-plugin/plugin.json`

- [ ] **Step 1: Update the description in `plugin.json` to include the new commands**

In the `description` field, append to the utilities list: `/release-init, /release-new, /release-add, /release-remove, /release-status`.

Current description ends with: `..., /us-split, /us-status."`

New ending: `..., /us-split, /us-status, /release-init, /release-new, /release-add, /release-remove, /release-status."`

- [ ] **Step 2: Bump version to `2.1.0`**

Change `"version": "2.0.0"` to `"version": "2.1.0"`.

- [ ] **Step 3: Verify**

```bash
grep "version\|release-init" .claude-plugin/plugin.json
```

Expected:
```
"version": "2.1.0",
...release-init, /release-new...
```

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/plugin.json
git commit -m "chore: bump to v2.1.0 — release planning commands"
```

---

## Self-Review

**Spec coverage check:**
- ✅ `release-init` — Task 1
- ✅ `release-new` with version validation, interactive target/date — Task 2
- ✅ `release-add` with auto-read summary + dedup — Task 3
- ✅ `release-remove` with RELEASED guard + renumbering — Task 4
- ✅ `release-status` all four modes + transition suggestions — Task 5
- ✅ `release-new` blocked if `.releases/` missing — Task 2 step 1
- ✅ RELEASED blocked until all plannings COMPLETED — Task 5 `--mark-released`
- ✅ Plugin manifest updated — Task 6

**Placeholder scan:** No TBDs, no "implement later", all steps have concrete content.

**Consistency check:**
- All skills use `Bash, Read, Write` subset of allowed-tools — ✅
- `release-add` and `release-status` both read live status from `00-initial.md` > `**Status:**` — ✅
- Placeholder row format `| — | — | — | — |` consistent across release-add, release-remove, release-status — ✅
- README Plannings column format `COMPLETED/TOTAL` consistent across release-add, release-remove, release-status — ✅
