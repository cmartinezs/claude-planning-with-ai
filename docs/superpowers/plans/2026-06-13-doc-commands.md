# Documentation Commands Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `doc-generate`, `doc-task`, and `doc-scope` skills that automatically generate functional and technical documentation when tasks and scopes complete, and wire them into `plan-task` and `plan-scope`.

**Architecture:** `doc-generate` is the central skill that detects level (task/scope/planning) and area (WB/AP/IN/AG/DO/W) and generates the appropriate docs into `docs/adr/`, `docs/guides/`, and `docs/changelog/`. `doc-task` and `doc-scope` are thin wrappers called from `plan-task` and `plan-scope` respectively. Two existing skills gain one new step each.

**Tech Stack:** Markdown, YAML frontmatter, Claude Code skills (`SKILL.md` pattern). No executable code — all validation via Python3 frontmatter parsing.

---

## File Map

| Action | Path |
|--------|------|
| Create | `skills/doc-generate/SKILL.md` |
| Create | `skills/doc-task/SKILL.md` |
| Create | `skills/doc-scope/SKILL.md` |
| Modify | `skills/plan-task/SKILL.md` (add step 10b, update allowed-tools) |
| Modify | `skills/plan-scope/SKILL.md` (add step 7b) |
| Modify | `.claude-plugin/plugin.json` (version 1.3.0 → 1.4.0) |
| Modify | `CHANGELOG.md` (add v1.4.0 entry) |

---

## Task 1: `doc-generate`

**Files:**
- Create: `skills/doc-generate/SKILL.md`

- [ ] **Step 1: Verify path is free**

```bash
ls /home/carlos/projects/claude-planning-with-ai/skills/doc-generate/SKILL.md 2>/dev/null && echo "EXISTS" || echo "OK"
```

Expected: `OK`

- [ ] **Step 2: Create the skill directory and file**

```bash
mkdir -p /home/carlos/projects/claude-planning-with-ai/skills/doc-generate
```

Write `skills/doc-generate/SKILL.md`:

```markdown
---
name: doc-generate
description: Generate functional and technical documentation from a completed task, scope, or planning — inline docs, ADRs, changelogs, and user guides written to docs/ based on the scope's area.
argument-hint: <NNN-slug> [scope-NN] [task-NN]
allowed-tools: [Read, Write, Bash, Glob]
---

Generate documentation from completed planning work. Detects level (task / scope / planning) and scope area, then writes the appropriate docs to `docs/adr/`, `docs/guides/`, and `docs/changelog/`.

## Arguments

`$ARGUMENTS` — one of:
- `NNN-slug` — planning level: consolidate all scope docs into RELEASE.md and README.md
- `NNN-slug scope-NN` — scope level: changelog entry + user guide (WB/AP) or consolidated ADR (IN)
- `NNN-slug scope-NN task-NN` — task level: inline doc (WB/AP/AG) and/or ADR (IN/AP/AG)

## Area logic

| Area | Inline doc | ADR | Changelog | User guide |
|------|-----------|-----|-----------|------------|
| WB | ✅ | — | ✅ | ✅ |
| AP | ✅ | ✅ | ✅ | ✅ |
| IN | — | ✅ | — | — |
| AG | ✅ | ✅ | — | — |
| DO | silent no-op | | | |
| W  | silent no-op | | | |
| unknown | ✅ | ✅ | ✅ | ✅ |

## Steps

### Shared setup

1. Parse `$ARGUMENTS`:
   - Three tokens → task level: planning-id, scope-id, task-id.
   - Two tokens → scope level: planning-id, scope-id.
   - One token → planning level: planning-id.

2. Locate the planning in `.planning/` (INITIAL), `.planning/active/`, or `.planning/finished/`. If not found, stop and report.

3. Ensure `docs/` exists in the project root. If not, create it.

---

### Task level (`NNN-slug scope-NN task-NN`)

4. Locate `.planning/active/<planning-id>/02-deepening/<scope-id>-*/<task-id>-*.md`. Read it fully. If not found, stop.

5. Read the scope file `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md` to determine the **area code** (look for `Area:` or `Repository Area:` field).

6. If area is `DO` or `W`: exit silently with no output.

7. **Inline doc** (areas WB, AP, AG, or unknown):
   - Extract from the task file: `Objective` section, `Implementation Steps` section (interfaces, endpoints, props, schemas), `Done Criteria` section.
   - Target path: `docs/guides/<planning-id>/<scope-id>/<task-id>.md`
   - If the file already exists: append a new dated section (`## Update — YYYY-MM-DD`) instead of overwriting.
   - If it does not exist: write the full inline doc using this format:

   ```markdown
   # <component name from Objective>

   **Source:** <task-id> | **Area:** <area> | **Date:** <today>

   ## What it does
   <Objective section verbatim or lightly paraphrased>

   ## How to use it
   <Derived from Implementation Steps: interfaces, endpoints, props, schemas — written as usage instructions, not as implementation steps>

   ## Example
   <Minimal usage example inferred from the component type and interfaces defined in Implementation Steps>
   ```

8. **ADR** (areas IN, AP, AG, or unknown):
   - Scan the task's `Technical Design` section for decision indicator phrases: "chose", "decided to", "over", "instead of", "alternative discarded", "alternative considered", "rejected", "we avoid".
   - If the `Technical Design` section is empty or has no indicator phrases: report "no architectural decision detected — ADR skipped" and stop this sub-step.
   - If indicators found: write `docs/adr/<YYYY-MM-DD>-<task-id-slug>.md` (derive slug from task filename without the `task-NN-` prefix). If the file exists: append a new dated section instead of overwriting.
   - ADR format:

   ```markdown
   # ADR: <task Objective as title>

   **Date:** <today>
   **Status:** Accepted
   **Planning:** <planning-id> / <scope-id> / <task-id>

   ## Context
   <Technical Design — Approach field verbatim>

   ## Decision
   <Sentence(s) containing decision indicator phrases, extracted from Technical Design>

   ## Consequences
   <Technical Design — Design notes field (edge cases, constraints)>

   ## Alternatives Considered
   <Sentences containing "alternative", "discarded", "rejected", "instead of" — or "None documented" if absent>
   ```

9. Report: list each file written with its path, and each sub-step skipped with reason.

---

### Scope level (`NNN-slug scope-NN`)

4. Locate `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`. Read it fully.

5. Determine area code from the scope file.

6. If area is `DO` or `W`: exit silently.

7. Collect any existing task inline docs under `docs/guides/<planning-id>/<scope-id>/` to use as source material.

8. **Changelog entry** (areas WB, AP, or unknown):
   - Derive user-facing bullets from: scope `Objective`, `Done Criteria`, and task Objectives (from task files or inline docs).
   - Target: `docs/changelog/<planning-id>/<scope-id>.md`. If exists: append dated section.
   - Format:

   ```markdown
   # <scope name in plain language>

   **Planning:** <planning-id> | **Date:** <today> | **Area:** <area>

   ## What changed
   - <user-facing bullet from scope objective — written as "Users can now…" or "Fixed…" or "Added…">
   - <additional bullets from done criteria, rewritten in user language>

   ## Who is affected
   <Inferred from area: WB → "Web users"; AP → "API consumers"; unknown → "End users and API consumers">
   ```

9. **User guide** (areas WB, AP, or unknown):
   - Target: `docs/guides/<planning-id>/<scope-id>.md`. If exists: append dated section.
   - Format:

   ```markdown
   # <scope name — feature title>

   **Date:** <today> | **Area:** <area>

   ## Overview
   <Scope objective rephrased for end users — no technical jargon>

   ## How to use
   <Narrative guide derived from: task inline docs (if available), done criteria, scope task descriptions>

   ## Related components
   <Links to task-level inline docs under docs/guides/<planning-id>/<scope-id>/ — or "None" if no task docs exist>
   ```

10. **Consolidated ADR** (area IN):
    - Collect all ADR files under `docs/adr/` whose filename contains the scope-id slug.
    - Target: `docs/adr/<YYYY-MM-DD>-<scope-slug>.md`. If exists: append dated section.
    - Format:

    ```markdown
    # ADR Summary: <scope name>

    **Date:** <today>
    **Status:** Accepted
    **Planning:** <planning-id> / <scope-id>
    **Source ADRs:** <list of task ADR filenames>

    ## Decisions Made in This Scope
    <One paragraph per source ADR summarising its Decision section>

    ## Combined Consequences
    <Merged Consequences from all source ADRs>
    ```

11. Report: list each file written with its path, each skipped with reason.

---

### Planning level (`NNN-slug`)

4. Locate the planning (any state). Determine its root path.

5. Collect all files matching `docs/changelog/<planning-id>/scope-*.md`. If none exist: report "no scope changelog entries found — run /doc-scope for each completed scope first" and stop.

6. Consolidate into `docs/changelog/<planning-id>/RELEASE.md`:
   ```markdown
   # Release Notes — <planning-id>

   **Generated:** <today>

   <contents of each scope-*.md file, separated by `---` and ordered by scope number>
   ```
   If RELEASE.md already exists: overwrite (it is always a full regeneration).

7. Collect all files matching `docs/guides/<planning-id>/scope-*.md`. Consolidate into `docs/guides/<planning-id>/README.md`:
   ```markdown
   # User Guide — <planning-id>

   **Generated:** <today>

   ## Table of Contents
   <one link per scope guide>

   <contents of each scope-*.md file, separated by `---` and ordered by scope number>
   ```
   If README.md already exists: overwrite.

8. Report: RELEASE.md and README.md written, N scope entries consolidated.
```

- [ ] **Step 3: Verify frontmatter**

```bash
python3 -c "
import re, yaml
content = open('/home/carlos/projects/claude-planning-with-ai/skills/doc-generate/SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
assert m, 'NO FRONTMATTER'
data = yaml.safe_load(m.group(1))
assert data['name'] == 'doc-generate'
assert 'allowed-tools' in data
print('OK —', data['name'])
"
```

Expected: `OK — doc-generate`

- [ ] **Step 4: Commit**

```bash
git -C /home/carlos/projects/claude-planning-with-ai add skills/doc-generate/SKILL.md
git -C /home/carlos/projects/claude-planning-with-ai commit -m "feat: add doc-generate skill (central documentation generator)"
```

---

## Task 2: `doc-task`

**Files:**
- Create: `skills/doc-task/SKILL.md`

- [ ] **Step 1: Verify path is free**

```bash
ls /home/carlos/projects/claude-planning-with-ai/skills/doc-task/SKILL.md 2>/dev/null && echo "EXISTS" || echo "OK"
```

Expected: `OK`

- [ ] **Step 2: Create skill directory and file**

```bash
mkdir -p /home/carlos/projects/claude-planning-with-ai/skills/doc-task
```

Write `skills/doc-task/SKILL.md`:

```markdown
---
name: doc-task
description: Generate documentation for a completed atomic task — inline component doc and/or ADR, depending on the scope area. Thin wrapper around doc-generate invoked automatically by plan-task.
argument-hint: <NNN-slug> <scope-NN> <task-NN>
allowed-tools: [Read, Write, Bash, Glob]
---

Generate task-level documentation for a completed atomic task. Reads the scope area and delegates to `/doc-generate`. Silent no-op for areas DO and W.

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN task-NN` (e.g. `001-jwt-auth-api scope-03 task-01`)

## Steps

1. Parse `$ARGUMENTS` into planning-id, scope-id, task-id.
2. Read `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md` to determine the area code. If the scope file is not found, stop and report.
3. If area is `DO` or `W`: exit silently — no output, no files written.
4. Invoke `/doc-generate <planning-id> <scope-id> <task-id>`.
5. Pass through the output from `doc-generate` verbatim as this skill's report.

> Called automatically by `/plan-task` (step 10b). Can also be invoked manually to regenerate documentation for an already-completed task.
```

- [ ] **Step 3: Verify frontmatter**

```bash
python3 -c "
import re, yaml
content = open('/home/carlos/projects/claude-planning-with-ai/skills/doc-task/SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
assert m, 'NO FRONTMATTER'
data = yaml.safe_load(m.group(1))
assert data['name'] == 'doc-task'
print('OK —', data['name'])
"
```

Expected: `OK — doc-task`

- [ ] **Step 4: Commit**

```bash
git -C /home/carlos/projects/claude-planning-with-ai add skills/doc-task/SKILL.md
git -C /home/carlos/projects/claude-planning-with-ai commit -m "feat: add doc-task skill (task-level doc wrapper)"
```

---

## Task 3: `doc-scope`

**Files:**
- Create: `skills/doc-scope/SKILL.md`

- [ ] **Step 1: Verify path is free**

```bash
ls /home/carlos/projects/claude-planning-with-ai/skills/doc-scope/SKILL.md 2>/dev/null && echo "EXISTS" || echo "OK"
```

Expected: `OK`

- [ ] **Step 2: Create skill directory and file**

```bash
mkdir -p /home/carlos/projects/claude-planning-with-ai/skills/doc-scope
```

Write `skills/doc-scope/SKILL.md`:

```markdown
---
name: doc-scope
description: Generate documentation for a completed scope — changelog entry and user guide (WB/AP) or consolidated ADR (IN). Thin wrapper around doc-generate invoked automatically by plan-scope.
argument-hint: <NNN-slug> <scope-NN>
allowed-tools: [Read, Write, Bash, Glob]
---

Generate scope-level documentation for a completed scope. Reads the scope area and delegates to `/doc-generate`. Silent no-op for areas DO and W.

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN` (e.g. `001-jwt-auth-api scope-03`)

## Steps

1. Parse `$ARGUMENTS` into planning-id and scope-id.
2. Read `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md` to determine the area code. If not found, stop and report.
3. If area is `DO` or `W`: exit silently — no output, no files written.
4. Invoke `/doc-generate <planning-id> <scope-id>`.
5. Pass through the output from `doc-generate` verbatim as this skill's report.

> Called automatically by `/plan-scope` (step 7b). Can also be invoked manually to regenerate documentation for an already-completed scope.
```

- [ ] **Step 3: Verify frontmatter**

```bash
python3 -c "
import re, yaml
content = open('/home/carlos/projects/claude-planning-with-ai/skills/doc-scope/SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
assert m, 'NO FRONTMATTER'
data = yaml.safe_load(m.group(1))
assert data['name'] == 'doc-scope'
print('OK —', data['name'])
"
```

Expected: `OK — doc-scope`

- [ ] **Step 4: Commit**

```bash
git -C /home/carlos/projects/claude-planning-with-ai add skills/doc-scope/SKILL.md
git -C /home/carlos/projects/claude-planning-with-ai commit -m "feat: add doc-scope skill (scope-level doc wrapper)"
```

---

## Task 4: Wire `doc-task` into `plan-task`

**Files:**
- Modify: `skills/plan-task/SKILL.md`

- [ ] **Step 1: Verify current step 10 text (find insertion point)**

```bash
grep -n "Mark the task" /home/carlos/projects/claude-planning-with-ai/skills/plan-task/SKILL.md
```

Expected: a line like `10. Mark the task \`DONE\`...`

- [ ] **Step 2: Insert step 10b between step 10 and step 11**

In `skills/plan-task/SKILL.md`, replace:

```
10. Mark the task `DONE`: check all done criteria boxes, set the status in the task file, and update the row in the scope's `## Tasks` index.
11. Report: task completed, files created/changed, test results, and the next pending task in the scope — or, if all tasks are `DONE`, suggest `/plan-done <planning-id> <scope-id>`.
```

With:

```
10. Mark the task `DONE`: check all done criteria boxes, set the status in the task file, and update the row in the scope's `## Tasks` index.
10b. Invoke `/doc-task <planning-id> <scope-id> <task-id>`. If the scope area is DO or W this is a silent no-op. Include any files written in the final report.
11. Report: task completed, files created/changed, test results, doc files written (from step 10b), and the next pending task in the scope — or, if all tasks are `DONE`, suggest `/plan-done <planning-id> <scope-id>`.
```

- [ ] **Step 3: Verify the edit**

```bash
grep -n "10b\|doc-task" /home/carlos/projects/claude-planning-with-ai/skills/plan-task/SKILL.md
```

Expected: two lines — one for `10b.` and one mentioning `doc-task`.

- [ ] **Step 4: Commit**

```bash
git -C /home/carlos/projects/claude-planning-with-ai add skills/plan-task/SKILL.md
git -C /home/carlos/projects/claude-planning-with-ai commit -m "feat: wire doc-task into plan-task (step 10b)"
```

---

## Task 5: Wire `doc-scope` into `plan-scope`

**Files:**
- Modify: `skills/plan-scope/SKILL.md`

- [ ] **Step 1: Verify current step 7 text (find insertion point)**

```bash
grep -n "DONE\|Report" /home/carlos/projects/claude-planning-with-ai/skills/plan-scope/SKILL.md
```

Expected: lines for step 7 (`DONE`: set scope status) and step 8 (Report).

- [ ] **Step 2: Insert step 7b between step 7 and step 8**

In `skills/plan-scope/SKILL.md`, replace:

```
   - If `DONE`: set scope status to `DONE` in the scope file.
8. Report: scope completed, N tasks done, done criteria satisfied.
```

With:

```
   - If `DONE`: set scope status to `DONE` in the scope file.
7b. Invoke `/doc-scope <planning-id> <scope-id>`. If the scope area is DO or W this is a silent no-op. Include any files written in the final report.
8. Report: scope completed, N tasks done, done criteria satisfied, doc files written (from step 7b).
```

- [ ] **Step 3: Verify the edit**

```bash
grep -n "7b\|doc-scope" /home/carlos/projects/claude-planning-with-ai/skills/plan-scope/SKILL.md
```

Expected: two lines — one for `7b.` and one mentioning `doc-scope`.

- [ ] **Step 4: Commit**

```bash
git -C /home/carlos/projects/claude-planning-with-ai add skills/plan-scope/SKILL.md
git -C /home/carlos/projects/claude-planning-with-ai commit -m "feat: wire doc-scope into plan-scope (step 7b)"
```

---

## Task 6: Bump version and update CHANGELOG

**Files:**
- Modify: `.claude-plugin/plugin.json`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Bump version to 1.4.0**

In `.claude-plugin/plugin.json`, change `"version": "1.3.0"` to `"version": "1.4.0"`.

- [ ] **Step 2: Verify JSON is valid**

```bash
python3 -c "import json; d=json.load(open('/home/carlos/projects/claude-planning-with-ai/.claude-plugin/plugin.json')); print(d['version'])"
```

Expected: `1.4.0`

- [ ] **Step 3: Prepend v1.4.0 entry to CHANGELOG.md**

Add after the `## [Unreleased]` line:

```markdown
## [1.4.0] — 2026-06-13

### Added

- `/doc-generate` — central documentation generator: detects level (task/scope/planning) and scope area, writes inline docs, ADRs, changelog entries, and user guides to `docs/`.
- `/doc-task` — thin wrapper invoked automatically by `/plan-task` after each task completes; generates task-level inline doc and/or ADR based on area.
- `/doc-scope` — thin wrapper invoked automatically by `/plan-scope` after each scope completes; generates changelog entry, user guide, or consolidated ADR based on area.

### Changed

- `/plan-task` — added step 10b: automatically invokes `/doc-task` after marking a task DONE.
- `/plan-scope` — added step 7b: automatically invokes `/doc-scope` after marking a scope DONE.
```

- [ ] **Step 4: Verify changelog entry**

```bash
grep -n "1.4.0" /home/carlos/projects/claude-planning-with-ai/CHANGELOG.md
```

Expected: line with `## [1.4.0]`

- [ ] **Step 5: Commit and push**

```bash
git -C /home/carlos/projects/claude-planning-with-ai add .claude-plugin/plugin.json CHANGELOG.md docs/superpowers/plans/2026-06-13-doc-commands.md
git -C /home/carlos/projects/claude-planning-with-ai commit -m "chore: bump to v1.4.0, update changelog and add implementation plan"
git -C /home/carlos/projects/claude-planning-with-ai push origin master
```
