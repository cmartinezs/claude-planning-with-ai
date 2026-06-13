# Specialized Agents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four new skills (`plan-agent-plan`, `plan-agent-execute`, `plan-agent-validate`, `plan-run`) that let a planning run end-to-end from a single command, with parallel scope execution.

**Architecture:** Three phase agents wrap the existing skills and are coordinated by an orchestrator (`plan-run`). No existing skills are modified. `plan-agent-execute` dispatches real Claude subagents (via the `Agent` tool) to atomize and execute independent scopes in parallel. The planning state on disk is the only handoff channel between agents.

**Tech Stack:** Markdown, YAML frontmatter, Claude Code skills (`SKILL.md` pattern). No executable code.

---

## File Map

| Action | Path |
|--------|------|
| Create | `skills/plan-agent-plan/SKILL.md` |
| Create | `skills/plan-agent-execute/SKILL.md` |
| Create | `skills/plan-agent-validate/SKILL.md` |
| Create | `skills/plan-run/SKILL.md` |
| Modify | `.claude-plugin/plugin.json` (version bump + description) |

---

## Task 1: `plan-agent-plan`

**Files:**
- Create: `skills/plan-agent-plan/SKILL.md`

- [ ] **Step 1: Verify the path does not exist yet**

```bash
ls skills/plan-agent-plan/SKILL.md 2>/dev/null && echo "EXISTS — unexpected" || echo "OK — path is free"
```

Expected: `OK — path is free`

- [ ] **Step 2: Create the skill file**

Create `skills/plan-agent-plan/SKILL.md` with this exact content:

```markdown
---
name: plan-agent-plan
description: Execute the planning phase autonomously — creates a new planning (if needed) and advances it from INITIAL to EXPANSION without intermediate confirmations.
argument-hint: <NNN-slug | "description">
allowed-tools: [Read, Write, Bash, Glob]
---

Execute the planning phase: create (if mode is from-scratch) and expand a planning from INITIAL to EXPANSION. No confirmations between steps.

## Arguments

`$ARGUMENTS` — one of:
- `NNN-slug` — ID of an existing planning in INITIAL state (e.g. `001-user-auth-api`)
- `"free text"` — description to create a new planning from scratch; the agent assigns the next available NNN and a slug

## Steps

1. **Detect mode:**
   - If `$ARGUMENTS` matches `\d{3}-[a-z0-9-]+`: **resume mode** — planning already exists in INITIAL state.
   - Otherwise: **from-scratch mode** — treat `$ARGUMENTS` as the planning description.

2. **From-scratch mode only:** Determine the next available planning number by reading `.planning/README.md`. Derive a kebab-case slug from the description (max 4 words). Invoke `/plan-new <NNN-slug> -- <description>` using the derived ID.

3. **Resume mode only:** Read `.planning/<NNN-slug>/00-initial.md`. Verify the planning is in INITIAL state (not inside `active/`). If it is already in EXPANSION or further, report "already past INITIAL — nothing to do" and stop.

4. Invoke `/plan-expand <NNN-slug>`.
   - Do NOT ask for scope descriptions from the user — infer all scopes from `00-initial.md` content. The agent must derive the scope list autonomously.

5. Verify the planning is now in `.planning/active/<NNN-slug>/` with `01-expansion.md` and at least one `02-deepening/scope-NN-*.md` file.

6. Optionally invoke `/plan-enrich-epic <NNN-slug>` if any created scope file is missing an `Objective` or has fewer than two tasks in its task table — this indicates an underspecified scope.

7. Report: planning ID, number of scopes created, list of scope names.

> Called by `/plan-run`. Can also be used independently for the planning phase only.
```

- [ ] **Step 3: Verify file was created and frontmatter is valid**

```bash
python3 -c "
import re, sys
content = open('skills/plan-agent-plan/SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if not m: sys.exit('NO FRONTMATTER')
import yaml
data = yaml.safe_load(m.group(1))
assert data['name'] == 'plan-agent-plan', 'wrong name'
assert 'Agent' not in data.get('allowed-tools', []), 'should not have Agent tool'
print('OK')
"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add skills/plan-agent-plan/SKILL.md
git commit -m "feat: add plan-agent-plan skill (planning phase agent)"
```

---

## Task 2: `plan-agent-execute`

**Files:**
- Create: `skills/plan-agent-execute/SKILL.md`

- [ ] **Step 1: Verify the path does not exist yet**

```bash
ls skills/plan-agent-execute/SKILL.md 2>/dev/null && echo "EXISTS — unexpected" || echo "OK — path is free"
```

Expected: `OK — path is free`

- [ ] **Step 2: Create the skill file**

Create `skills/plan-agent-execute/SKILL.md` with this exact content:

```markdown
---
name: plan-agent-execute
description: Execute all pending scopes in a planning — atomizes and executes independent scopes in parallel using subagents, respecting dependency order.
argument-hint: <NNN-slug>
allowed-tools: [Read, Write, Bash, Glob, Agent]
---

Atomize and execute all pending scopes in a planning. Independent scopes run in parallel via subagents; dependent scopes wait for their predecessors.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-user-auth-api`)

## Steps

1. Locate `.planning/active/$ARGUMENTS/`. If not found, stop: "Planning not found in active state — run `/plan-agent-plan` first."

2. Read all scope files under `.planning/active/$ARGUMENTS/02-deepening/*.md`. Collect for each scope:
   - `scope-id` (e.g. `scope-01`)
   - `status` (from the `## Status` line or the status field)
   - `depends-on` (from any `Depends On` or `Dependencies` section — list of scope IDs)
   - whether it is already atomized (a matching `02-deepening/scope-NN-*/task-*.md` directory exists)
   Skip scopes with status `DONE`.

3. Build the dependency graph: a map of `scope-id → [scope-ids it depends on]`. Flag any circular dependency as a **CRITICAL ERROR** — stop and report.

4. Compute execution batches using topological sort: a batch is a set of scopes whose dependencies are all already `DONE` or not present. Process batches in order.

5. **For each batch of scopes:**

   a. Announce: "Executing batch: scope-01, scope-03 (parallel)"
   
   b. For each scope in the batch, dispatch a subagent using the `Agent` tool with this prompt template:
   
   ```
   You are executing one scope of a planning in an autonomous pipeline.
   
   Planning ID: <NNN-slug>
   Scope ID: <scope-NN>
   Working directory: <absolute path of the project root>
   
   Steps to execute (no confirmations — proceed autonomously):
   1. Run /plan-atomize <NNN-slug> <scope-NN>
      - Present the task breakdown and immediately confirm it yourself (do not ask the user).
   2. Run /plan-scope <NNN-slug> <scope-NN>
   
   If /plan-atomize fails, stop and report the error with scope ID.
   If /plan-scope fails, stop and report the error with scope ID.
   Report outcome: DONE or BLOCKED with reason.
   ```
   
   c. Dispatch all scopes in the batch simultaneously (parallel Agent calls in one message).
   d. Wait for all subagents in the batch to complete before starting the next batch.
   e. For each subagent result:
      - `DONE`: mark the scope status; unlock dependents.
      - `BLOCKED`: record the scope as BLOCKED with the reported reason; continue with remaining batch members.

6. After all batches: collect results.
   - If all scopes are DONE: report success.
   - If any scopes are BLOCKED: list them with reasons. Do NOT stop the pipeline — report and let `/plan-agent-validate` handle the check.

7. Report: N scopes executed (N parallel batches), N DONE, N BLOCKED (if any).

> Called by `/plan-run`. Can also be used independently to execute a planning that is already in EXPANSION/DEEPENING state.
```

- [ ] **Step 3: Verify file was created and has Agent in allowed-tools**

```bash
python3 -c "
import re, sys
content = open('skills/plan-agent-execute/SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if not m: sys.exit('NO FRONTMATTER')
import yaml
data = yaml.safe_load(m.group(1))
assert data['name'] == 'plan-agent-execute', 'wrong name'
assert 'Agent' in data.get('allowed-tools', []), 'must have Agent tool'
print('OK')
"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add skills/plan-agent-execute/SKILL.md
git commit -m "feat: add plan-agent-execute skill (parallel scope execution agent)"
```

---

## Task 3: `plan-agent-validate`

**Files:**
- Create: `skills/plan-agent-validate/SKILL.md`

- [ ] **Step 1: Verify the path does not exist yet**

```bash
ls skills/plan-agent-validate/SKILL.md 2>/dev/null && echo "EXISTS — unexpected" || echo "OK — path is free"
```

Expected: `OK — path is free`

- [ ] **Step 2: Create the skill file**

Create `skills/plan-agent-validate/SKILL.md` with this exact content:

```markdown
---
name: plan-agent-validate
description: Validate and close a planning — runs plan-validate, then plan-done and plan-archive if all scopes pass. Stops without archiving if validation finds issues.
argument-hint: <NNN-slug>
allowed-tools: [Read, Write, Bash, Glob]
---

Validate structural integrity, close all scopes, and archive a completed planning. No confirmations.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-user-auth-api`)

## Steps

1. Locate `.planning/active/$ARGUMENTS/`. If not found, stop and report.

2. Invoke `/plan-validate $ARGUMENTS`.
   - Read the validation output and parse the result:
     - If any **FAIL** items are present: stop. Report all failing checks. Do NOT proceed to done/archive. Suggest manual fix and re-running `/plan-agent-validate`.
     - If only **WARN** items: continue (warnings do not block closure).
     - If all **PASS**: continue.

3. Read all scope files under `.planning/active/$ARGUMENTS/02-deepening/*.md` and check statuses:
   - If any scope is not `DONE`: list the non-DONE scopes and stop — the planning is not ready to close.
   - If all scopes are `DONE`: continue.

4. Invoke `/plan-done $ARGUMENTS` (without scope argument — marks the full planning done).

5. Invoke `/plan-archive $ARGUMENTS`.

6. Verify the planning now exists at `.planning/finished/$ARGUMENTS/`.

7. Report: planning archived at `.planning/finished/$ARGUMENTS/`. List scopes closed and the archive timestamp.

> Called by `/plan-run`. Can also be used independently to close and archive any planning that is ready.
```

- [ ] **Step 3: Verify file was created and frontmatter is valid**

```bash
python3 -c "
import re, sys
content = open('skills/plan-agent-validate/SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if not m: sys.exit('NO FRONTMATTER')
import yaml
data = yaml.safe_load(m.group(1))
assert data['name'] == 'plan-agent-validate', 'wrong name'
assert 'Agent' not in data.get('allowed-tools', []), 'should not have Agent tool'
print('OK')
"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add skills/plan-agent-validate/SKILL.md
git commit -m "feat: add plan-agent-validate skill (validation and archive agent)"
```

---

## Task 4: `plan-run` (orchestrator)

**Files:**
- Create: `skills/plan-run/SKILL.md`

- [ ] **Step 1: Verify the path does not exist yet**

```bash
ls skills/plan-run/SKILL.md 2>/dev/null && echo "EXISTS — unexpected" || echo "OK — path is free"
```

Expected: `OK — path is free`

- [ ] **Step 2: Create the skill file**

Create `skills/plan-run/SKILL.md` with this exact content:

```markdown
---
name: plan-run
description: Run a planning end-to-end from the current state — detects where the planning is, shows a full execution plan, asks for one confirmation, then delegates to phase agents autonomously.
argument-hint: [NNN-slug | "description"]
allowed-tools: [Read, Bash, Glob]
---

Orchestrate a complete planning run. Detects state, confirms once, then delegates to `/plan-agent-plan`, `/plan-agent-execute`, and `/plan-agent-validate` without further interruptions.

## Arguments

`$ARGUMENTS` — one of:
- `NNN-slug` — existing planning ID; the orchestrator detects its current state and runs from there
- `"free text"` — description to create a new planning from scratch (from-scratch mode)
- *(empty)* — list active plannings and ask which one to run

## Steps

1. **Resolve the target planning:**
   - If `$ARGUMENTS` is empty: list all plannings in `.planning/` (INITIAL), `.planning/active/` (EXPANSION/DEEPENING), and ask the user which to run. Stop until answered.
   - If `$ARGUMENTS` matches `\d{3}-[a-z0-9-]+`: check all three directories for the planning.
   - Otherwise: from-scratch mode — `$ARGUMENTS` is a description for a new planning.

2. **Determine current state:**

   | Location | State |
   |----------|-------|
   | `.planning/NNN-slug/` | INITIAL |
   | `.planning/active/NNN-slug/` with no scope files | EXPANSION incomplete |
   | `.planning/active/NNN-slug/` with scope files, some not DONE | DEEPENING/EXECUTION |
   | `.planning/active/NNN-slug/` with all scopes DONE | READY TO CLOSE |
   | `.planning/finished/NNN-slug/` | COMPLETED — nothing to do |

3. **Build the execution plan.** Determine which phases need to run:

   | Phase | Agent | Runs when |
   |-------|-------|-----------|
   | Planning | `/plan-agent-plan` | state is INITIAL or from-scratch |
   | Execute | `/plan-agent-execute` | state is INITIAL, EXPANSION incomplete, or DEEPENING |
   | Validate | `/plan-agent-validate` | always (last phase) |

   If the planning is already COMPLETED, report and stop.

   If the planning has scope files, read them and report: N total scopes, N pending, N already DONE. Show whether any scopes have inter-dependencies (parallel vs. sequential execution shape).

4. **Present the execution plan to the user** in this format:

   ```
   Planning: NNN-slug
   Current state: INITIAL / EXPANSION / DEEPENING
   
   Phases to execute:
   ✓ plan-agent-plan   — create/expand planning
   ✓ plan-agent-execute — atomize + execute N scopes (X parallel batches)
   ✓ plan-agent-validate — validate + archive
   
   Parallel execution: scopes A, B, C can run simultaneously; scope D waits for C.
   
   Proceed? (yes/no)
   ```

5. **Wait for confirmation.** If the user says no or requests changes: stop. If yes: continue without further questions for the rest of the run (unless a critical error occurs).

6. **Execute phases in sequence:**
   - If Planning phase is needed: invoke `/plan-agent-plan` with the planning ID or description.
   - Invoke `/plan-agent-execute` with the planning ID.
   - Invoke `/plan-agent-validate` with the planning ID.
   
   Each agent is invoked directly (same Claude session, not via Agent tool — phase agents are skills, not subagents). Subagent parallelism happens inside `/plan-agent-execute`.

7. **Report final summary:**

   ```
   Planning NNN-slug completed.
   
   Phases run: plan-agent-plan, plan-agent-execute, plan-agent-validate
   Scopes: N completed, N blocked (if any)
   Tasks executed: N total
   Archived: .planning/finished/NNN-slug/
   
   Blocked scopes (if any):
   - scope-NN: <reason>
   ```

> This is the entry point for the full autonomous pipeline. For phase-by-phase control, use the individual phase agents directly.
```

- [ ] **Step 3: Verify file was created and frontmatter is valid**

```bash
python3 -c "
import re, sys
content = open('skills/plan-run/SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if not m: sys.exit('NO FRONTMATTER')
import yaml
data = yaml.safe_load(m.group(1))
assert data['name'] == 'plan-run', 'wrong name'
assert 'Agent' not in data.get('allowed-tools', []), 'plan-run delegates to phase skills inline — no Agent tool needed'
print('OK')
"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add skills/plan-run/SKILL.md
git commit -m "feat: add plan-run orchestrator skill"
```

---

## Task 5: Update plugin manifest

**Files:**
- Modify: `.claude-plugin/plugin.json`

- [ ] **Step 1: Read current manifest**

```bash
cat .claude-plugin/plugin.json
```

- [ ] **Step 2: Update version and description**

Edit `.claude-plugin/plugin.json`:
- Bump `version` from `"1.1.0"` to `"1.2.0"`
- Replace the `description` value with:

```
Structured planning system for software projects. Full autonomous pipeline (/plan-run), phase agents (/plan-agent-plan, /plan-agent-execute, /plan-agent-validate), lifecycle management (plan-new, plan-expand, plan-scope, plan-done, plan-archive), atomic task decomposition (plan-atomize, plan-task, plan-task-validate), backlog enrichment (us-enrich, us-new, epic-enrich), and epic-to-planning bridge (plan-from-epic).
```

- [ ] **Step 3: Verify JSON is valid**

```bash
python3 -c "import json; data = json.load(open('.claude-plugin/plugin.json')); print(data['version'])"
```

Expected: `1.2.0`

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/plugin.json
git commit -m "chore: bump version to 1.2.0 — add specialized agents"
```

---

## Task 6: Update CHANGELOG

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Read the current CHANGELOG header**

```bash
head -40 CHANGELOG.md
```

- [ ] **Step 2: Prepend v1.2.0 entry**

Add the following block at the top of the changelog (after the `# Changelog` heading):

```markdown
## [1.2.0] — 2026-06-13

### Added

- `/plan-run` — orchestrator skill that runs a planning end-to-end from the current state. Detects planning state, presents a full execution plan with a single confirmation, then delegates to phase agents autonomously.
- `/plan-agent-plan` — phase agent for the planning phase. Creates a new planning (if needed) and advances it from INITIAL to EXPANSION without intermediate confirmations.
- `/plan-agent-execute` — phase agent for scope execution. Atomizes and executes independent scopes in parallel using Claude subagents; respects dependency order between scopes.
- `/plan-agent-validate` — phase agent for validation and closure. Runs structural validation, marks the planning done, and archives it.
```

- [ ] **Step 3: Verify the entry was added**

```bash
grep -n "1.2.0" CHANGELOG.md
```

Expected: line number with `## [1.2.0]`

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: add v1.2.0 changelog entry for specialized agents"
```
