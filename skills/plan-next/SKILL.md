---
name: plan-next
description: Recommend the next safest planning action based on current state, blocked work, dependencies, project mode, and configured autonomy.
argument-hint: [NNN-slug]
allowed-tools: [Read, Bash, Glob]
---

# plan-next

Read the planning system and recommend the next command to run. This command is advisory and read-only.

## Arguments

`$ARGUMENTS`
- `NNN-slug` — inspect one planning
- *(empty)* — inspect all active and initial plannings, then rank the next actions

## Steps

1. Read `.planning/config.yml` if present. Extract:
   - `project.type` defaulting to `software`
   - `terminology.planning_item` defaulting to `story`
   - `autonomy.level` defaulting to `assisted`
   - `execution.requires_git` defaulting to `true`
   - `execution.requires_tests` defaulting to `true`

2. Locate candidate plannings:
   - `.planning/NNN-slug/` for INITIAL
   - `.planning/active/NNN-slug/` for EXPANSION, DEEPENING, EXECUTION, or READY TO CLOSE
   - Ignore `.planning/finished/` unless the requested planning is already completed.

3. For each candidate, inspect:
   - presence of `00-initial.md`
   - presence and completeness of `01-expansion.md`
   - story files under `02-deepening/`
   - task files under `02-deepening/story-*/`
   - story/task status values
   - blockers, residuals, open inconsistencies, and dependency notes

4. Choose the next action with this priority:

   | Condition | Recommend |
   |-----------|-----------|
   | planning only has `00-initial.md` | `/plan-expand NNN-slug` |
   | expansion exists but no story files | `/plan-atomize NNN-slug` if stories are ready, otherwise `/plan-enrich-story` or `/plan-enrich-epic` |
   | story has TODO status but no task files | `/plan-atomize NNN-slug story-NN` |
   | task files exist and pending tasks remain | `/plan-task NNN-slug story-NN task-NN` |
   | story tasks are done but story is not DONE | `/plan-done NNN-slug story-NN` |
   | all stories are DONE or SKIPPED | `/plan-validate NNN-slug`, then `/plan-archive NNN-slug` |
   | blocked stories exist | `/plan-retry NNN-slug` after blockers are resolved |
   | structure looks inconsistent | `/plan-validate NNN-slug` or `/plan-health` |

5. Adjust for project mode:
   - `software`: include test and git expectations when relevant.
   - `documentation`: prefer `/doc-generate`, `/doc-story`, `/doc-task`, and `/plan-audit-docs` for documentation-heavy pending work.
   - `research`: treat experiments, evidence, and decision logs as primary outputs.
   - `operations` or `general`: accept manual verification when `execution.requires_tests` is `false`.

6. Adjust for autonomy:
   - `manual`: recommend one command only and ask the user to confirm execution.
   - `assisted`: recommend a short sequence of 2-3 commands with checkpoints.
   - `autonomous`: recommend `/plan-run NNN-slug` when the planning is structurally ready and no unresolved blockers exist.

7. Output:

```markdown
## Recommended Next Action

Planning: NNN-slug
State: <INITIAL | EXPANSION | EXECUTION | READY TO CLOSE | BLOCKED>
Recommended command: `/command ...`
Why: <one or two concrete reasons>

## Supporting Findings
- <status count or blocker>
- <dependency note>
- <verification expectation>

## Alternatives
| Command | Use when |
|---------|----------|
| `/plan-validate NNN-slug` | You want a structural check before continuing |
| `/plan-report NNN-slug` | You need a stakeholder summary instead of execution |
```

Do not modify files.
