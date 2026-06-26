# Planning with AI — Command Reference

Full command listing with arguments and the structure installed by `/plan-init`.

---

## Commands

### Setup

| Command | What it does |
|---------|-------------|
| `/plan-init [--blank] [--force]` | Creates `.planning/`, installs templates/workflows/tutorials, discovers project areas, and writes config |
| `/plan-git-config [--base-branch <branch>]` | Shows or updates the planning system git base branch |

### Product Backlog

| Command | What it does |
|---------|-------------|
| `/us-new <path/to/container> [--interactive\|--blank]` | Adds a new user story to a directory or markdown file |
| `/us-enrich <path/to/story.md \| story-id>` | Adds DoD, Technical Notes, Dependencies, and Complexity |
| `/us-split <path/to/story.md>` | Splits an oversized user story into focused stories |
| `/us-status <path/to/container>` | Shows enrichment/readiness status for stories in a container |
| `/epic-enrich <path/to/container>` | Detects coverage gaps and adds missing stories |

### Product To Execution Bridge

| Command | What it does |
|---------|-------------|
| `/plan-from-epic <NNN> <path/to/container> [--filter field=value]` | Generates a full active planning from a story container; one source story becomes one planning story |

### Planning Lifecycle

| Command | What it does |
|---------|-------------|
| `/plan-template [slug] [--interactive\|--blank]` | Generates an idea document in `.planning/ideas/` |
| `/plan-new <NNN-slug> -- <intent>` | Creates a planning in INITIAL state from inline intent |
| `/plan-new <NNN-slug> @<path.md>` | Creates a planning in INITIAL state from an idea document |
| `/plan-expand <NNN-slug>` | Advances INITIAL -> EXPANSION and creates planning stories |
| `/plan-status` | Shows all plannings and story statuses |
| `/plan-validate [NNN-slug]` | Checks structural integrity for one or all plannings |
| `/plan-done <NNN-slug> <story-NN> [task-N]` | Marks one task or a whole story done |
| `/plan-archive <NNN-slug>` | Audits and moves a completed planning to `finished/` |

### Execution

| Command | What it does |
|---------|-------------|
| `/plan-atomize <NNN-slug> [story-NN]` | Decomposes one story or all pending stories into atomic task files |
| `/plan-task <NNN-slug> <story-NN> <task-NN>` | Executes one atomic task end to end |
| `/plan-task-validate <NNN-slug> [story-NN] [task-NN]` | Audits atomic tasks against the atomicity checklist |
| `/plan-story <NNN-slug> <story-NN>` | Executes all tasks in a story |

### Mid-Execution Adjustments

| Command | What it does |
|---------|-------------|
| `/plan-enrich-epic <NNN-slug>` | Adds new stories to an active planning |
| `/plan-enrich-story <NNN-slug> <story-NN>` | Deepens an underspecified planning story |
| `/plan-split-story <NNN-slug> <story-NN>` | Splits an oversized planning story |
| `/plan-story-skip <NNN-slug> <story-NN> -- <reason>` | Marks a no-longer-applicable story as SKIPPED |
| `/plan-merge <source-planning> <target-planning> <story-NN>` | Moves a story between active plannings |

### Automation Agents

| Command | What it does |
|---------|-------------|
| `/plan-run [NNN-slug \| "description"]` | Orchestrates planning, execution, validation, and archive from the current state |
| `/plan-agent-plan <NNN-slug \| "description">` | Runs the planning phase autonomously |
| `/plan-agent-execute <NNN-slug>` | Executes pending stories using dependency batches and subagents |
| `/plan-agent-validate <NNN-slug>` | Validates, closes, and archives a ready planning |

### Documentation

| Command | What it does |
|---------|-------------|
| `/doc-generate <NNN-slug> [story-NN] [task-NN]` | Generates task, story, or planning-level documentation |
| `/doc-task <NNN-slug> <story-NN> <task-NN>` | Thin wrapper for task-level documentation |
| `/doc-story <NNN-slug> <story-NN>` | Thin wrapper for story-level documentation |

### Release Planning

| Command | What it does |
|---------|-------------|
| `/release-init` | Initializes optional `.releases/` release planning |
| `/release-new <version> -- <purpose>` | Creates a release in DRAFT status |
| `/release-add <version> <planning-id...>` | Adds plannings to a release |
| `/release-remove <version> <planning-id>` | Removes a planning from a release |
| `/release-status [version] [--mark-*]` | Shows or updates release status |

### Maintenance And Recovery

| Command | What it does |
|---------|-------------|
| `/plan-health` | Scans the whole `.planning/` system for anomalies |
| `/plan-report <NNN-slug>` | Generates an executive planning summary |
| `/plan-history <NNN-slug>` | Shows status transitions from git history |
| `/plan-standup <NNN-slug>` | Generates standup text |
| `/plan-export <NNN-slug> --format <format>` | Exports a planning as PR text, ticket list, or markdown summary |
| `/plan-clone <source-id> <target-id>` | Clones a planning structure into a fresh ID |
| `/plan-retry <NNN-slug>` | Retries BLOCKED stories after blockers are resolved |
| `/plan-rollback <NNN-slug> <story-NN>` | Reverts story planning state from DONE to TODO |

---

## How area discovery works

When you run `/plan-init`, the plugin scans your project's top-level directories, detects the technology stack in each one, and proposes a short area code (e.g. `AP` for `api/`, `WB` for `web/`). You confirm or adjust the mapping, and the plugin generates:

- One `AREA-<CODE>-<dir>.md` file per area in `.planning/WORKFLOWS/05-SDLC-PHASE-GUIDANCE/`
- Pre-filled traceability matrix columns in `GUIDE.md`, `TRACEABILITY-GLOBAL.md`, and `_template/TRACEABILITY.md`

Areas are the columns of the traceability matrix. Every planning story records which areas it touches. If your project structure changes, update the area files and matrix headers manually.

### Area code mapping

| Directory name contains | Proposed code |
|------------------------|--------------|
| `api`, `backend`, `server` | `AP` |
| `web`, `frontend`, `ui`, `client` | `WB` |
| `docs`, `documentation`, `doc` | `DO` |
| `infra`, `infrastructure`, `terraform`, `deploy` | `IN` |
| `agent`, `agents`, `ai`, `ml` | `AG` |
| `mobile`, `ios`, `android` | `MB` |
| `lib`, `shared`, `common`, `core` | `LB` |
| `services`, `svc` | `SV` |
| `packages` (monorepo root) | one code per package |
| (no match) | first 2 letters, uppercased |

`W` (`.planning/`) is always added as the last area.

---

## Structure installed by `/plan-init`

```
.planning/
├── _template/              ← blueprint for each new planning
│   ├── 00-initial.md
│   ├── 01-expansion.md
│   ├── 02-deepening/
│   │   ├── story-NN-name.md
│   │   └── task-NN-name.md    ← atomic task blueprint (used by /plan-atomize)
│   └── TRACEABILITY.md     ← columns filled in by plan-init
├── WORKFLOWS/
│   ├── 01-PLANNING-WORKFLOWS/
│   ├── 02-EXECUTION-WORKFLOWS/
│   ├── 03-MAINTENANCE-WORKFLOWS/
│   ├── 04-SUB-WORKFLOWS/
│   └── 05-SDLC-PHASE-GUIDANCE/
│       ├── AREA-<CODE>-<dir>.md   ← one per project area (generated)
│       └── AREA-EXAMPLE.md        ← format reference
├── TUTORIAL/
├── active/                 ← plannings in EXPANSION or DEEPENING
├── finished/               ← completed plannings (read-only)
├── GUIDE.md                ← area table filled in by plan-init
├── GLOSSARY.md
├── PROMPTING.md
├── TRACEABILITY-GLOBAL.md  ← columns filled in by plan-init
└── README.md
```

---

## Tutorial

After running `/plan-init`, see `.planning/TUTORIAL/` for end-to-end flow guides.

---

## Further reading

| File | Audience |
|------|---------|
| [`docs/user-guide.md`](user-guide.md) | End users — concepts, flows, examples |
| [`docs/developer-guide.md`](developer-guide.md) | Contributors — architecture, skill format, how to extend |
