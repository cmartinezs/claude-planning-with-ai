# Specialized Agents Design

**Date:** 2026-06-13
**Status:** Approved

## Summary

Add four new skills to the plugin that implement a three-layer agent architecture: an orchestrator (`/plan-run`), three phase agents (`/plan-agent-plan`, `/plan-agent-execute`, `/plan-agent-validate`), and real parallel subagent execution for independent scopes. Existing skills are not modified — agents invoke them.

---

## Architecture

```
/plan-run  (orchestrator)
    │
    ├─ detect current planning state
    ├─ build execution plan (which phases remain)
    ├─ show full plan + single confirmation
    │
    ├──► /plan-agent-plan      (INITIAL → EXPANSION)
    │        plan-new → plan-expand → plan-enrich-epic?
    │
    ├──► /plan-agent-execute   (EXPANSION → DEEPENING executed)
    │        plan-atomize ──► [parallel subagents per scope]
    │        plan-scope   ──► [parallel subagents per independent scope]
    │
    └──► /plan-agent-validate  (EXECUTION → COMPLETED)
             plan-validate → plan-done → plan-archive
```

**New skills:** `plan-run`, `plan-agent-plan`, `plan-agent-execute`, `plan-agent-validate`

**Implementation model:** Hybrid. The orchestrator and phase agents are chained skills (single Claude instance following a multi-skill workflow). `plan-agent-execute` uses the `Agent` tool to spawn real parallel subagents for concurrent scope execution.

**Autonomy model:** Single human confirmation point. The orchestrator presents the full execution plan once and waits for approval. After that, no interruptions unless a critical blocker is encountered (broken dependency, missing file).

---

## Skill Specifications

### `/plan-run`

**Signature:** `/plan-run [planning-id | "free text description"]`

**Allowed tools:** `Read`, `Bash`, `Glob`, `Agent`

**Behavior:**

1. **Input detection:**
   - Existing planning ID (`NNN-slug`): read `00-initial.md`, determine current state (INITIAL / EXPANSION / DEEPENING)
   - Free text: create-from-scratch mode — will drive `plan-new` in `plan-agent-plan`

2. **Execution plan construction:** Build a table showing which phases will run, scope count (if planning exists), and estimated parallel vs. sequential execution shape.

3. **Single confirmation:** Present the full plan and wait for yes/no. If approved, no further questions except critical blockers.

4. **Phase delegation:**
   ```
   INITIAL   → plan-agent-plan → plan-agent-execute → plan-agent-validate
   EXPANSION → plan-agent-execute → plan-agent-validate
   DEEPENING → plan-agent-execute (resumes pending scopes) → plan-agent-validate
   ```

5. **Final report:** N scopes completed, N tasks executed, errors (if any), archived path.

**What it does NOT do:** Contains no planning logic. All intelligence lives in phase agents and existing skills.

---

### `/plan-agent-plan`

**Signature:** `/plan-agent-plan <planning-id | "description">`

**Allowed tools:** `Read`, `Write`, `Bash`, `Glob`

**Behavior:**

Invokes in sequence, without intermediate confirmations:
1. `plan-new` if in create-from-scratch mode
2. `plan-expand` to advance from INITIAL to EXPANSION
3. Optionally `plan-enrich-epic` if any scope files are detected as underspecified (missing objective or acceptance criteria)

Terminates with the planning in EXPANSION state and all scope files created under `02-deepening/`.

**Invocable independently:** Yes — can be used without going through `/plan-run`.

---

### `/plan-agent-execute`

**Signature:** `/plan-agent-execute <planning-id>`

**Allowed tools:** `Read`, `Write`, `Bash`, `Glob`, `Agent`

**Behavior:**

1. Read all scope files and build the dependency graph from `Depends On` fields
2. Identify **scopes with no pending dependencies** (available for parallel execution)
3. For each parallel batch:
   - Launch one subagent per scope using the `Agent` tool, passing `planning-id` and `scope-id`
   - Each subagent runs: `plan-atomize <id> <scope>` → `plan-scope <id> <scope>`
4. When a subagent completes, unlock dependent scopes and launch the next batch
5. On subagent failure: mark the scope as BLOCKED in its file, continue with independent scopes, list all blocked scopes in final report

**Parallelism:** If a planning has N scopes with no inter-dependencies, N subagents run simultaneously. Dependency graphs are respected by processing in topological order batches.

**Invocable independently:** Yes.

---

### `/plan-agent-validate`

**Signature:** `/plan-agent-validate <planning-id>`

**Allowed tools:** `Read`, `Write`, `Bash`, `Glob`

**Behavior:**

1. Run `plan-validate` (structural consistency check)
2. If validation passes: run `plan-done <id>` → `plan-archive`
3. If validation reports inconsistencies: list all issues, do not archive, suggest manual fix

**Invocable independently:** Yes.

---

## Handoff Contract

The planning state on disk is the only communication channel between agents. No complex parameter passing — each phase agent reads the current state from `.planning/active/<id>/` and acts on what it finds. This means if a phase agent fails mid-execution, it can be re-invoked and will resume from the saved state.

---

## Error Handling

| Situation | Behavior |
|-----------|----------|
| Scope blocked by broken dependency | Report, skip, continue with independent scopes |
| Scope subagent fails | Mark scope BLOCKED in file, continue, list at end |
| `plan-validate` finds inconsistencies | List issues, do not archive, suggest manual fix |
| Planning file not found | Stop immediately with clear message |
| Planning already COMPLETED | Stop and inform — no work to do |

---

## Files to Create

```
skills/plan-run/SKILL.md
skills/plan-agent-plan/SKILL.md
skills/plan-agent-execute/SKILL.md
skills/plan-agent-validate/SKILL.md
```

No existing skills are modified. No changes to `planning-template/`.

---

## Out of Scope

- Automatic retry of failed scopes (manual re-run of `/plan-agent-execute` handles this)
- Agent manifest directory (`agents/`) — premature abstraction for current needs
- Progress UI or status streaming — the harness task list provides sufficient visibility
