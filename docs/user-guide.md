# Planning with AI — User Guide

A complete reference for using the planning system in your project.

---

## Concepts

### Planning
A self-contained unit of work tracked by the system. Each planning has a lifecycle, its own folder, and a traceability matrix. One planning = one initiative (a feature, a refactor, a migration, an epic).

### Scope
A transversal work unit inside a planning. Maps to one area of your project (a service, a module, a directory). Each scope has its own tasks, done criteria, and status.

### Atomic task
The smallest executable unit of work, produced by decomposing a scope with `/plan-atomize`. One file per task under `02-deepening/scope-NN-name/`, each containing its own technical design, implementation steps, unit test plan, and binary done criteria — granular enough to be implemented directly in a single session.

### Area
A distinct surface of your project that the traceability matrix tracks. Configured once during `/plan-init`. Examples: `AP` for `api/`, `WB` for `web/`, `IN` for `infra/`. Every scope declares which areas it touches.

### Lifecycle phases

| Phase | Location | What it means |
|-------|----------|---------------|
| **INITIAL** | `.planning/NNN-slug/` | Idea captured — intent, motivation, rough scope |
| **EXPANSION** | `.planning/active/NNN-slug/` | Scopes identified, dependencies mapped, area impact documented |
| **DEEPENING** | `.planning/active/NNN-slug/02-deepening/` | Tasks defined per scope; execution happens here |
| **COMPLETED** | `.planning/finished/NNN-slug/` | All scopes done, traceability updated, archived |

### Traceability
Each planning records which terms, decisions, and concepts were introduced and which areas they affect. This produces a matrix that makes it easy to understand the blast radius of any change.

---

## Setting up a project

Run once, from the root of your project:

```
/plan-init
```

The plugin will:
1. Scan your top-level directories
2. Propose area codes based on detected stacks
3. Ask you to confirm or adjust
4. Generate area files and pre-fill all traceability headers

If you prefer manual setup:

```
/plan-init --blank
```

This creates the `.planning/` structure with placeholder tables that you fill in by hand.

---

## Workflows

### Flow A — Starting from an existing epic / story container

Use this when you already have user stories written somewhere (a directory of markdown files, a single doc with sections, etc.).

```
# Enrich stories that are missing DoD or Technical Notes
/us-enrich docs/epics/epic-05/01-checkout.md

# Detect gaps and add missing stories
/epic-enrich docs/epics/epic-05/

# Generate the execution planning from the container
/plan-from-epic 001 docs/epics/epic-05/

# Execute scope by scope
/plan-scope 001-checkout scope-01
/plan-done  001-checkout scope-01
/plan-scope 001-checkout scope-02
/plan-done  001-checkout scope-02

# Archive when all scopes are done
/plan-archive 001-checkout
```

**When to use:** you have a product backlog already defined and want to bridge it to an execution plan without rewriting everything.

### Flow B — Starting from scratch

Use this when you have an idea but no stories yet.

```
# Option 1: quick capture
/plan-new 002-payment-gateway -- Integrate Stripe for subscription billing

# Option 2: rich capture (interactive)
/plan-template payment-gateway
# ... Claude asks questions and creates .planning/ideas/payment-gateway.md
/plan-new 002-payment-gateway @.planning/ideas/payment-gateway.md

# Expand the idea into scopes
/plan-expand 002-payment-gateway

# Optional: decompose a scope into atomic tasks (design + implementation + unit tests per task)
/plan-atomize 002-payment-gateway scope-01
/plan-task    002-payment-gateway scope-01 task-01

# Execute (runs atomic tasks in order if the scope was atomized)
/plan-scope 002-payment-gateway scope-01
/plan-done  002-payment-gateway scope-01
...
/plan-archive 002-payment-gateway
```

**When to use:** greenfield initiative with no existing stories.

### Flow C — Backlog refinement only (no execution yet)

Use this when you want to enrich the backlog before committing to an execution plan.

```
# Add a new story
/us-new docs/epics/epic-03/

# Enrich it
/us-enrich docs/epics/epic-03/07-new-story.md

# Detect coverage gaps
/epic-enrich docs/epics/epic-03/
```

No planning is created. Stories are enriched in place and ready for a future `/plan-from-epic`.

### Flow D — Mid-execution adjustments

Use these when a planning is already active and reality has changed.

```
# Add new scopes discovered after expansion
/plan-enrich-epic 001-checkout

# Deepen a scope that turned out to be underspecified
/plan-enrich-story 001-checkout scope-04

# Split a scope that is too large to execute as a unit
/plan-split-story 001-checkout scope-02
```

---

## Command reference

### Initialization

| Command | Flags | Description |
|---------|-------|-------------|
| `/plan-init` | `--blank`, `--force` | Initialize `.planning/` and configure areas |

### Backlog

| Command | Argument | Description |
|---------|----------|-------------|
| `/us-new` | `path/to/container [--interactive\|--blank]` | Add a new user story |
| `/us-enrich` | `path/to/story.md` or story ID | Enrich with DoD, Technical Notes, Dependencies, Complexity |
| `/epic-enrich` | `path/to/container` | Detect gaps and add missing stories |

### Bridge

| Command | Argument | Description |
|---------|----------|-------------|
| `/plan-from-epic` | `NNN path/to/container [--filter field=value]` | Generate a full planning from a story container |

### Lifecycle

| Command | Argument | Description |
|---------|----------|-------------|
| `/plan-template` | `[slug] [--interactive\|--blank]` | Generate an idea document |
| `/plan-new` | `NNN-slug -- intent` or `NNN-slug @path.md` | Create a planning in INITIAL |
| `/plan-status` | — | Show all plannings and scope statuses |
| `/plan-validate` | `[NNN-slug]` | Check structural integrity of one or all plannings (read-only) |
| `/plan-expand` | `NNN-slug` | Advance INITIAL → EXPANSION |
| `/plan-atomize` | `NNN-slug scope-NN` | Decompose a scope into atomic task files |
| `/plan-task` | `NNN-slug scope-NN task-NN` | Execute a single atomic task |
| `/plan-task-validate` | `NNN-slug [scope-NN] [task-NN]` | Audit atomic tasks against the atomicity checklist (read-only) |
| `/plan-scope` | `NNN-slug scope-NN` | Execute all tasks in a scope |
| `/plan-done` | `NNN-slug scope-NN [task-N]` | Mark a scope (or single task) done |
| `/plan-archive` | `NNN-slug` | Audit and archive to `finished/` |

### Mid-execution

| Command | Argument | Description |
|---------|----------|-------------|
| `/plan-enrich-epic` | `NNN-slug` | Add new scopes to an active planning |
| `/plan-enrich-story` | `NNN-slug scope-NN` | Deepen an underspecified scope |
| `/plan-split-story` | `NNN-slug scope-NN` | Split an oversized scope into two or more |

---

## Common patterns

### Filtering stories by priority

```
/plan-from-epic 003 docs/epics/epic-07/ --filter priority=P0
```

Only P0 stories generate scopes. The rest are ignored for now.

### Decomposing a scope into atomic tasks

```
/plan-atomize 001-checkout scope-02
/plan-task    001-checkout scope-02 task-01
```

When a scope's tasks are too coarse to implement directly, `/plan-atomize` proposes a breakdown into atomic tasks — one file each under `02-deepening/scope-02-*/`, with technical design, implementation steps, unit tests, and binary done criteria. Execute them one at a time with `/plan-task`, or all in dependency order with `/plan-scope`. Audit the breakdown anytime with `/plan-task-validate` (read-only).

### Marking a single task done (not the whole scope)

```
/plan-done 001-checkout scope-02 task-3
```

Useful when you want to record partial progress without closing the scope.

### Check current state at any time

```
/plan-status
```

Shows all plannings (INITIAL, active, completed) and the status of each scope.

### Validate structure before archiving

```
/plan-validate 001-checkout
```

Read-only structural audit: file locations per state, scope table ↔ scope file consistency, workflow IDs against the catalog, dependency references, done criteria, and atomized task folders. Run it without arguments to validate every planning. Fix any FAIL it reports before `/plan-archive`.

---

## Working with areas

Areas are defined once at `/plan-init` time. They become the columns of the traceability matrix — each scope records which areas it touches (`✅` impacted, `N/A` not applicable, blank = not evaluated yet).

If you add a new directory to your project and want it tracked:

1. Create `.planning/WORKFLOWS/05-SDLC-PHASE-GUIDANCE/AREA-<CODE>-<dir>.md` (copy from `AREA-EXAMPLE.md`)
2. Add a row to the area table in `.planning/GUIDE.md`
3. Add the column to `.planning/TRACEABILITY-GLOBAL.md` and `.planning/_template/TRACEABILITY.md`

---

## Tips

- **One planning per initiative.** Don't create a planning for a task that takes 30 minutes. Use plannings for work that spans multiple sessions or areas.
- **Enrich before generating.** Running `/us-enrich` on stories before `/plan-from-epic` produces richer scopes with better done criteria.
- **Atomize when tasks hide design decisions.** If a scope row says "implement validation" and you can't start typing from it, `/plan-atomize` forces the design, tests, and steps to be decided before execution.
- **`/plan-status` is your dashboard.** Check it at the start of every session to orient yourself.
- **`/plan-validate` before `/plan-archive`.** A clean validation report means the audit will pass without surprises. It's read-only, so run it as often as you like.
- **Residuals are not failures.** If something can't be resolved in the current scope, record it as a residual (it moves to the next planning). The system is designed for this.
- **`finished/` is read-only.** Never edit archived plannings. If you need to continue the work, create a new planning that references the archived one.
