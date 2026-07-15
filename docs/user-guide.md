# Planning with AI — User Guide

A practical reference for using the planning system in a project. The plugin is optimized for software repositories, but the same markdown workflow can be adapted to documentation, research, operations, or other project work.

## Concepts

### Planning

A self-contained initiative tracked by the system. A planning has its own folder, lifecycle files, stories, traceability, and optional generated documentation. One planning can represent a feature, refactor, migration, release slice, research effort, operational change, or documentation initiative.

### Story

The executable unit inside a planning. In software projects this is usually a user story or technical story. In general projects, treat it as a deliverable or work package with clear done criteria.

Each story lives under `02-deepening/story-NN-name.md`, has its own tasks, status, dependencies, repository/project area impact, and done criteria.

### Atomic Task

The smallest executable unit of work, produced by `/plan-atomize`. One task file lives under `02-deepening/story-NN-name/task-NN-name.md` and contains objective, technical design or approach, implementation steps, verification, and binary done criteria.

For software, verification means unit tests or the project test runner plus the configured local runtime smoke check. For non-software work, use concrete evidence such as a reviewed document, approved checklist, published asset, signed decision, or reproducible manual validation.

### Project Configuration

Each initialized project has `.planning/config.yml`. It controls:

| Key | Purpose |
|-----|---------|
| `project.type` | Selects the default planning style: `software`, `general`, `documentation`, `research`, or `operations` |
| `terminology.planning_item` | Lets a non-software project call stories `deliverable`, `workstream`, `experiment`, or another local term |
| `autonomy.level` | Controls `/plan-run` checkpoints: `manual`, `assisted`, or `autonomous` |
| `execution.requires_git` | Enables or disables git pre-flight checks |
| `execution.requires_tests` | Distinguishes test-backed verification from manual acceptance evidence |
| `integrations.external_issues` | Records whether external issue IDs come from GitHub, Jira, Linear, or are disabled |
| `software.smoke_tests_file` | Points to the project smoke test plan file under `.planning/` |
| `software.test_suite_generator` | Points to the deterministic script that generates planning/story/task test-suite matrices under `.planning/` |
| `software.logging_file` | Points to the project logging policy under `.planning/` |

For software projects, `.planning/config.yml` can point to a stack-specific smoke test plan file. The default file is `.planning/SMOKE-TESTS.md`, and the plan should describe the supporting services, build/start command, connectivity or schema checks, and the smallest smoke checks that prove the changed surface still works.

```yaml
software:
  smoke_tests_file: SMOKE-TESTS.md   # Optional override for the smoke-test plan file under .planning/
  test_suite_generator: scripts/generate-test-suite.sh
  logging_file: LOGGING.md
```

Software projects must define a logging mechanism in `.planning/LOGGING.md`. Every code task should add or preserve intelligent logging that helps trace execution across calls: correlation or trace ids, key execution milestones, external dependency calls, persistence boundaries, async/event handlers, retries, fallbacks, and errors. Log levels must be selected by criticality: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, and `FATAL` when supported. If no logging mechanism exists, `/plan-task` suggests the best option for the detected stack and waits for the human decision before implementing code logging.

`/plan-test-suite` generates deterministic quality-gate matrices before execution. It writes a plan-level `TEST-SUITE.md`, story-level `TEST-SUITE.md`, or task-level `test-suites/<task>-test-suite.md` by detecting repository tooling first: package scripts, Maven/Gradle tasks, Python/Go/Rust commands, Docker Compose, SonarQube, linters, typecheckers, coverage tools, and architecture-test conventions. The generated gates cover unit tests, coverage, integration, acceptance/e2e, static analysis, code style, architecture/design guide review (DDD, Hexagonal, DRY, SOLID, GoF, and project-specific guides), smoke, security/dependency scans, and mutation/test-strength checks when applicable.

For Maven services that use Cucumber/Gherkin, the preferred acceptance gate is an `acceptanceTests` Maven profile:

```bash
./mvnw -PacceptanceTests verify
```

That profile should boot the artifact in isolation and mock external dependencies with local fakes, WireMock, MockServer, Testcontainers, or equivalent fixtures. If `.feature` files or Cucumber/Gherkin dependencies exist without the profile, `/plan-test-suite` records the missing profile as a test-suite gap.

When that gap appears, the generated suite includes a `Maven Acceptance Test Configuration` scaffold with Failsafe includes, packaged-artifact path, `SPRING_PROFILES_ACTIVE=acceptance`, and the environment variables that redirect databases and external services to local fakes or containers. Treat that scaffold as implementation work: add or update a task to create the profile before claiming acceptance evidence.

Acceptance evidence also requires a complete dependency inventory. The generated suite must account for internal modules, sibling artifacts, databases, migrations, seed data, external HTTP APIs, queues, brokers, storage, caches, identity providers, SaaS providers, environment variables, secrets, ports, readiness checks, startup order, teardown, and cleanup. Each dependency must be mapped to real disposable infrastructure, Testcontainers, Docker Compose, WireMock/MockServer, a local fake, an in-memory fixture, or an explicit out-of-scope justification. Unresolved dependencies block acceptance evidence.

When `project.type: software`, `/plan-task`, `/plan-story`, and `/plan-done` must run the smoke test plan before final approval: start the supporting services required by the stack, build or start the app, check connectivity or schema behavior, and run the smoke checks. For git-enabled tasks, `/plan-task` then commits, pushes, and opens or reuses the task PR before asking for human developer code review, so external reviewers can comment on the PR. Requested corrections are implemented, verified, committed, and pushed to the same PR before review is requested again.

When a story changes database structure or ORM artifacts, `/plan-atomize` must add a separate validation task. That task statically checks consistency between migrations/schema and ORM models/entities/generated clients, then starts the local environment and runs a persistence smoke check. If the local environment cannot be inferred from repository files, the agent must ask the human for startup steps before finalizing or executing that validation.

When `execution.requires_git` is `true`, the git flow is layered:

- The story integration branch starts from `git.base_branch` (for example `develop`). `/plan-story` ensures it exists when orchestrating a story, and `/plan-task` also creates or reuses it when you start directly from a task.
- `/plan-task` creates and pushes a task branch from the story branch, commits the implementation, and opens or reuses a PR back to the story branch before human code review. Task branches are sibling refs named like `<story-branch>--task-NN-<slug>`, not nested under the story branch, because Git cannot keep both `refs/heads/<story-branch>` and `refs/heads/<story-branch>/task-NN-<slug>` at the same time. The task remains in progress while the PR is under review; after approval, `/plan-task` marks it `DONE` and pushes the closeout metadata to the same branch.
- For child plannings coordinated by a parent, run each child planning in a dedicated sibling worktree created with its own branch: `git worktree add ../<worktree-prefix> <branch>` for an existing branch, or `git worktree add -b <branch> ../<worktree-prefix> <base_branch>` for a new branch.
- Child worktree branches preserve the worktree prefix before the story/task portion, for example story branch `<worktree-prefix>/story-NN-<slug>` and task branch `<worktree-prefix>/story-NN-<slug>--task-NN-<slug>`.
- Task PRs are reviewed and merged into the story branch one by one before the next dependent task starts. After each task PR is merged, delete the local task branch with `git branch -d <task-branch>` from an updated story branch checkout.
- The story is closed only after all task PRs are merged into the story branch.
- The final story PR targets `git.base_branch`, so partial planning progress can still be released from the base branch without waiting for every story in the planning. After the story PR is merged into the base branch, delete the local story branch with `git branch -d <story-branch>` from an updated base branch checkout.

### Area

A distinct surface of the project tracked by the traceability matrix. `/plan-init` detects repository areas such as `AP` for `api/`, `WB` for `web/`, or `IN` for `infra/`. In general projects, areas can represent teams, workstreams, deliverables, departments, or folders.

### Lifecycle Phases

| Phase | Location | What it means |
|-------|----------|---------------|
| **INITIAL** | `.planning/NNN-slug/` | Idea captured: intent, why, rough overall scope |
| **EXPANSION** | `.planning/active/NNN-slug/` | Stories identified, dependencies mapped, area impact documented |
| **DEEPENING** | `.planning/active/NNN-slug/02-deepening/` | Stories and tasks are detailed and executed |
| **COMPLETED** | `.planning/finished/NNN-slug/` | All stories are done or intentionally skipped, traceability is updated, and the planning is archived |

### Traceability

Each planning records which terms, decisions, and concepts were introduced and which areas they affect. This makes the impact of a change easier to understand later.

### Project Decision Records

A Project Decision Record (PDR) is optional. It records an accepted or proposed decision that affects multiple stories, repository areas, shared terminology, planning policy, or future plannings. Routine task design stays in the task file; technical architecture choices can stay in ADRs if the project uses them.

`/plan-decision` is the only command that writes `pdr-*.md` files. Other commands may invoke it automatically when the decision is explicit, accepted, cross-cutting, and supported by enough evidence. Otherwise they suggest `/plan-decision` as a follow-up.

Common automatic triggers:

- `RECORD-INCONSISTENCY` / `RESOLVE-CONFLICT` when resolving a conflict establishes a durable cross-cutting rule.
- `CASCADE-CHANGE` when a policy, terminology, or contract change must be propagated across several documents or areas.
- `UPDATE-TRACEABILITY` / `CHECK-TRACEABILITY` when an accepted traced decision affects several areas or future plannings.
- `/plan-edge-case`, `/plan-retrospective`, `/plan-done`, and `/plan-archive` when completed work reveals an accepted cross-cutting decision that is not yet recorded.

## Setting Up A Project

Run once from the directory that should own the planning workspace:

```text
/plan-init
```

The plugin will scan top-level directories, propose area codes, ask you to confirm or adjust them, generate area guidance files, and pre-fill traceability headers.

Planning commands always use the current directory's `./.planning/`. They do not search parent directories. In a monorepo, run `/plan-init` separately in the parent and in each child artifact that should manage its own work.

For manual or non-standard setup:

```text
/plan-init --blank
```

This creates the `.planning/` structure with placeholder tables you can fill manually.

### Monorepo Parent/Child Planning

Use separate planning workspaces when a monorepo has independently managed artifacts:

- Run parent-level plans from the monorepo parent directory. The parent plan owns cross-artifact coordination, integration sequencing, shared docs, releases, and parent-scope changes.
- Run artifact-level plans from the artifact's dedicated worktree, not from the parent checkout. The artifact plan owns implementation inside that artifact.
- If a parent plan affects children with their own `.planning/`, `/plan-expand` creates or reuses linked child planning worktrees, creates linked child plannings there, and records them in the parent's `01-expansion.md`.
- The parent should track child planning status and sync checkpoints, not duplicate child implementation stories or tasks.

## Workflows

### Flow A — Existing Epic Or Story Container

Use this when you already have user stories or requirements in markdown.

```text
# Check and enrich the product backlog
/us-status docs/epics/epic-05/
/us-enrich docs/epics/epic-05/01-checkout.md
/epic-enrich docs/epics/epic-05/

# Generate execution planning from the container
/plan-from-epic 001 docs/epics/epic-05/

# Execute story by story
/plan-story 001-checkout story-01
/plan-done  001-checkout story-01
/plan-story 001-checkout story-02
/plan-done  001-checkout story-02

# Validate and archive when stories are complete
/plan-validate 001-checkout
/plan-retrospective 001-checkout
/plan-archive 001-checkout
```

Use this when a product backlog already exists and you want to bridge it into executable planning without rewriting it.

### Flow B — Starting From Scratch

Use this when you have an idea but no stories yet.

```text
# Option 1: quick capture
/plan-new 002-payment-gateway -- Integrate Stripe for subscription billing

# Option 2: rich capture
/plan-template payment-gateway
/plan-new 002-payment-gateway @.planning/ideas/payment-gateway.md

# Expand the idea into planning stories
/plan-expand 002-payment-gateway

# Optional: decompose one story into atomic tasks
/plan-atomize 002-payment-gateway story-01
/plan-task    002-payment-gateway story-01 task-01

# Execute all tasks in a story
/plan-story 002-payment-gateway story-01
/plan-done  002-payment-gateway story-01

# Close
/plan-validate 002-payment-gateway
/plan-retrospective 002-payment-gateway
/plan-archive 002-payment-gateway
```

### Flow C — Backlog Refinement Only

Use this when you want to improve the backlog before committing to execution.

```text
/us-new docs/epics/epic-03/
/us-enrich docs/epics/epic-03/07-new-story.md
/us-split docs/epics/epic-03/07-new-story.md
/epic-enrich docs/epics/epic-03/
/us-status docs/epics/epic-03/
```

No planning is created. Stories are enriched in place and can later feed `/plan-from-epic`.

### Flow D — Mid-Execution Adjustments

Use these when a planning is already active and reality has changed.

```text
# Add new planning stories discovered after expansion
/plan-enrich-epic 001-checkout

# Deepen a story that is underspecified
/plan-enrich-story 001-checkout story-04

# Split a story that is too large to execute as one unit
/plan-split-story 001-checkout story-02

# Skip a story that no longer applies
/plan-story-skip 001-checkout story-06 -- requirement dropped from MVP
```

Use backlog-layer commands (`/us-*`, `/epic-enrich`) before a story becomes part of `.planning/`. Use planning-layer commands (`/plan-enrich-*`, `/plan-split-story`) after the work is already represented in `.planning/active/`.

### Flow E — Autonomous Pipeline

Use this when the planning is clear enough for a guided autonomous run.

```text
/plan-run "Export reporting data as CSV"
```

`/plan-run` delegates to `/plan-agent-plan`, `/plan-agent-execute`, and `/plan-agent-validate`. It is autonomous except for critical checkpoints such as git state, blockers, or explicit user confirmation required by a called skill.

`autonomy.level` in `.planning/config.yml` adjusts how much it stops:

| Level | Behavior |
|-------|----------|
| `manual` | Stops before each phase so the user drives the sequence |
| `assisted` | Asks once for the run, then stops for blockers or risky conditions |
| `autonomous` | Continues through non-destructive phases when structure is valid |

### Flow F — Check State Before Choosing

Use this when you want to inspect current state before choosing the next command.

```text
/plan-status
/plan-status 002-payment-gateway
```

`/plan-status` reads planning state, dependencies, blockers, project type, and autonomy settings so you can decide the next command with context.

### Flow G — Documentation Audit

Use this after a planning created or changed project documentation.

```text
/plan-audit-docs 002-payment-gateway
/plan-audit-docs 002-payment-gateway --docs-dir docs
```

The audit compares expected docs from stories and tasks against actual files, local links, traceability, external issue references, and freshness.

## Command Reference

### Setup

| Command | Argument | Description |
|---------|----------|-------------|
| `/plan-init` | `[--blank] [--force]` | Initialize `.planning/` and configure areas |
| `/plan-git-config` | `[--base-branch <branch>]` | View or update planning git config |
| `/plan-smoke-config` | `[--blank]` | Generate or update the project smoke test plan |

### Backlog

| Command | Argument | Description |
|---------|----------|-------------|
| `/us-new` | `path/to/container [--interactive\|--blank]` | Add a new user story |
| `/us-enrich` | `path/to/story.md` or story ID | Enrich with DoD, notes, dependencies, complexity |
| `/us-split` | `path/to/story.md` | Split an oversized user story |
| `/us-status` | `path/to/container` | Show story readiness and enrichment status |
| `/epic-enrich` | `path/to/container` | Detect gaps and add missing stories |

### Planning And Execution

| Command | Argument | Description |
|---------|----------|-------------|
| `/plan-template` | `[slug] [--interactive\|--blank]` | Generate an idea document |
| `/plan-new` | `NNN-slug -- intent` or `NNN-slug @path.md` | Create a planning in INITIAL |
| `/plan-from-epic` | `NNN path/to/container [--filter field=value]` | Generate a planning from a story container |
| `/plan-expand` | `NNN-slug` | Advance INITIAL -> EXPANSION |
| `/plan-atomize` | `NNN-slug [story-NN]` | Decompose stories into atomic task files |
| `/plan-task` | `NNN-slug story-NN task-NN` | Execute a single atomic task |
| `/plan-task-validate` | `NNN-slug [story-NN] [task-NN]` | Audit atomic tasks |
| `/plan-test-suite` | `NNN-slug [story-NN] [task-NN] [--all]` | Generate deterministic test-suite matrices |
| `/plan-story` | `NNN-slug story-NN` | Execute all tasks in a story |
| `/plan-done` | `NNN-slug story-NN [task-N]` | Mark a task or story done |
| `/plan-status` | `[NNN-slug]` | Show planning state and story progress |
| `/plan-validate` | `[NNN-slug]` | Check structural integrity |
| `/plan-decision` | `NNN-slug -- decision title` | Record a cross-cutting PDR |
| `/plan-edge-case` | `[NNN-slug] [story-NN] -- note` | Record something unexpected for the final retrospective |
| `/plan-retrospective` | `NNN-slug` | Generate or refresh the planning retrospective |
| `/plan-update-version` | `<from> <to> [--dry-run] [--allow-dirty]` | Apply a versioned migration to an older `.planning/` workspace |
| `/plan-archive` | `NNN-slug` | Audit and archive to `finished/` |

### Automation, Maintenance, Docs, Releases

See [Command Reference](reference.md) for the complete list, including `/plan-run`, `/plan-agent-*`, `/doc-*`, `/plan-audit-docs`, `/release-*`, `/plan-health`, `/plan-doctor`, `/plan-report`, `/plan-export`, `/plan-smoke-config`, `/plan-update-version`, recovery commands, and history/status utilities.

## Choosing Similar Commands

| Situation | Command |
|-----------|---------|
| A source backlog story is missing DoD, notes, dependencies, or complexity | `/us-enrich` |
| A planning story is ambiguous or not executable enough | `/plan-enrich-story` |
| A source backlog container is missing stories | `/epic-enrich` |
| An active planning needs more stories | `/plan-enrich-epic` |
| A source backlog story is too broad | `/us-split` |
| An active planning story is too broad | `/plan-split-story` |
| You want to scan the entire `.planning/` system | `/plan-health` |
| You want a detailed audit of a planning | `/plan-validate` |
| You want to inspect current planning state before choosing | `/plan-status` |
| A decision affects multiple stories, areas, or future plannings | `/plan-decision` |
| You need a reproducible test strategy for a plan, story, or task | `/plan-test-suite` |
| You changed generated documentation and need coverage/freshness checks | `/plan-audit-docs` |
| You maintain this plugin and need a structural audit | `/plan-doctor` |

## Communication Outputs

| Need | Command | Output shape |
|------|---------|--------------|
| Daily sync | `/plan-standup` | Yesterday / today / blockers |
| Stakeholder summary | `/plan-report --metrics` | Objective, progress, risks, metrics, decisions, next steps |
| External artifact | `/plan-export` | PR description, ticket list, GitHub/Jira/Linear issue draft, markdown |
| Release readiness | `/release-status` | Release table, planning statuses, transition suggestions |

## Common Patterns

### Filtering Stories By Priority

```text
/plan-from-epic 003 docs/epics/epic-07/ --filter priority=P0
```

Only matching source stories generate planning stories.

### Decomposing A Story Into Atomic Tasks

```text
/plan-atomize 001-checkout story-02
/plan-task    001-checkout story-02 task-01
```

Use atomization when a story's task list hides design decisions or is too coarse to execute directly.

If a story changes database structure or ORM artifacts, atomization must include an explicit DB/ORM validation task after the implementation tasks.

With git enabled, each task runs in its own branch and opens a task PR into the story branch before human code review. Review feedback can be recorded in `.code-review/<story-dir>/<task-file>.md`; corrections are committed and pushed to the same task PR. Merge task PRs into the story branch before closing the story, then delete each merged task branch locally. After the final story PR is merged into the base branch, delete the local story branch too.

### Marking One Task Done

```text
/plan-done 001-checkout story-02 task-03
```

Useful for recording partial progress without closing the whole story.

### Checking Current State

```text
/plan-status
```

Shows plannings and story statuses.

### Validating Before Archive

```text
/plan-validate 001-checkout
```

This read-only audit checks file locations, story consistency, workflow IDs, dependencies, done criteria, and atomized task folders.

## General Projects

The default language is software-oriented, but the workflow also works for non-software projects:

| Software term | General project equivalent |
|---------------|----------------------------|
| Planning | Initiative |
| Story | Deliverable or work package |
| Atomic task | Action item |
| Unit tests | Verification evidence |
| Repository area | Project area, team, folder, or workstream |

For non-software projects, use `/plan-init --blank` if automatic repository area detection is not useful, then define areas manually in `.planning/GUIDE.md`, `.planning/TRACEABILITY-GLOBAL.md`, and area guidance files.

## Tips

- **One planning per initiative.** Avoid creating plannings for trivial one-off tasks.
- **Enrich before generating.** `/us-enrich` improves source stories before `/plan-from-epic`.
- **Atomize when tasks hide design decisions.** `/plan-atomize` forces approach, steps, verification, and done criteria to be explicit.
- **Use `/plan-status` as the dashboard.** Check it at the start of each session.
- **Run `/plan-validate` before `/plan-archive`.** It is read-only and can be used often.
- **Run `/plan-retrospective` before `/plan-archive`.** It turns raw edge-case notes into a professional retrospective.
- **Use `/plan-update-version <from> <to>` for old workspaces.** For example, `/plan-update-version 2.1.0 3.10.5` updates a `2.x` workspace to the current baseline using `.planning/update-version/2-3.md`.
- **Finished plannings are read-only.** Continue work by creating a new planning that references the archived one.
