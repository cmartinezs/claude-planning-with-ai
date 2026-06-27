---
name: plan-run
description: Run a planning end-to-end from the current state — detects where the planning is, shows a full execution plan, asks for one confirmation, then delegates to phase agents autonomously except for critical checkpoints.
argument-hint: [NNN-slug | "description"]
allowed-tools: [Read, Bash, Glob]
---

Orchestrate a complete planning run. Detects state, confirms once, then delegates to `/plan-agent-plan`, `/plan-agent-execute`, and `/plan-agent-validate` with only critical checkpoints such as blockers, git state, or configured manual verification.

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
   | `.planning/active/NNN-slug/` with no story files | EXPANSION incomplete |
   | `.planning/active/NNN-slug/` with story files, some not DONE | DEEPENING/EXECUTION |
   | `.planning/active/NNN-slug/` with all stories DONE | READY TO CLOSE |
   | `.planning/finished/NNN-slug/` | COMPLETED — nothing to do |

2b. **Planning context check:** Read `.planning/config.yml` if it exists and extract `execution.requires_git` (default: `true`) and `autonomy.level` (default: `assisted`). If `execution.requires_git` is `true`, execute `[CHECK-PLANNING-CONTEXT]`. If `execution.requires_git` is `false`, skip this check and continue to step 3.
   - If **ABORT**: stop immediately; do not modify anything.
   - If **INSPECT**: the sub-workflow loops internally until the user makes a definitive choice.
   - If **STABILIZED** or **PROCEED**: continue to step 3.

   Apply `autonomy.level` throughout the run:
   - `manual`: stop for confirmation before each phase.
   - `assisted`: ask once before the full run, then stop only for blockers, destructive actions, or missing verification.
   - `autonomous`: proceed through all non-destructive phases when the planning is structurally valid, stopping only for blockers or explicit user input requirements.

3. **Build the execution plan.** Determine which phases need to run:

   | Phase | Agent | Runs when |
   |-------|-------|-----------|
   | Planning | `/plan-agent-plan` | state is INITIAL or from-scratch |
   | Execute | `/plan-agent-execute` | state is INITIAL, EXPANSION incomplete, or DEEPENING |
   | Validate | `/plan-agent-validate` | always (last phase) |

   If the planning is already COMPLETED, report and stop.

   If the planning has story files, read them and report: N total stories, N pending, N already DONE. Show whether any stories have inter-dependencies (parallel vs. sequential execution shape).

4. **Present the execution plan to the user** in this format:

   ```
   Planning: NNN-slug
   Current state: INITIAL / EXPANSION / DEEPENING

   Phases to execute:
   ✓ plan-agent-plan   — create/expand planning
   ✓ plan-agent-execute — atomize + execute N stories (X parallel batches)
   ✓ plan-agent-validate — validate + archive

   Parallel execution: stories A, B, C can run simultaneously; story D waits for C.

   Proceed? (yes/no)
   ```

5. **Wait for confirmation.** If the user says no or requests changes: stop. If yes: continue according to `autonomy.level`.

6. **Execute phases in sequence:**
   - If Planning phase is needed: invoke `/plan-agent-plan` with the planning ID or description.
   - Invoke `/plan-agent-execute` with the planning ID.
   - Invoke `/plan-agent-validate` with the planning ID.

   Each phase agent is invoked as a skill (inline, same session) — not via the Agent tool. Subagent parallelism happens inside `/plan-agent-execute`.

7. **Report final summary:**

   ```
   Planning NNN-slug completed.

   Phases run: plan-agent-plan, plan-agent-execute, plan-agent-validate
   Stories: N completed, N blocked (if any)
   Tasks executed: N total
   Archived: .planning/finished/NNN-slug/

   Blocked stories (if any):
   - story-NN: <reason>
   ```

> This is the entry point for the full autonomous pipeline. For phase-by-phase control, use the individual phase agents directly.
