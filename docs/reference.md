# Planning with AI — Command Reference

Full command listing with flags, arguments, and the structure installed by `/plan-init`.

---

## Commands

### Project initialization (run once per project)

| Command | What it does |
|---------|-------------|
| `/plan-init` | Creates `.planning/` structure and **discovers project areas interactively** |
| `/plan-init --blank` | Same, but skips area discovery (leave placeholders for manual editing) |
| `/plan-init --force` | Reinitializes system files without touching active plannings or area config |

### Product backlog layer (works on any story container)

| Command | What it does |
|---------|-------------|
| `/us-new path/to/container/` | Add a new story to a directory or markdown file |
| `/us-enrich path/to/story.md` | Add DoD, Technical Notes, Dependencies, Complexity |
| `/epic-enrich path/to/container/` | Detect gaps and add new stories |

### Bridge: product → execution

| Command | What it does |
|---------|-------------|
| `/plan-from-epic NNN path/to/container/` | Generate a full planning from a story container (1 story = 1 scope) |

### Planning lifecycle

| Command | What it does |
|---------|-------------|
| `/plan-template slug` | Generate an idea document interactively |
| `/plan-new NNN-slug -- intent` | Create a planning in INITIAL state |
| `/plan-new NNN-slug @path.md` | Create a planning from an idea document |
| `/plan-status` | Show all active plannings and their scopes |
| `/plan-expand NNN-slug` | Advance INITIAL → EXPANSION |
| `/plan-scope NNN-slug scope-NN` | Execute all tasks in a scope |
| `/plan-done NNN-slug scope-NN` | Mark a scope complete and advance |
| `/plan-archive NNN-slug` | Audit and archive to `finished/` |

### Mid-execution adjustments

| Command | What it does |
|---------|-------------|
| `/plan-enrich-epic NNN-slug` | Add new scopes to an active planning |
| `/plan-enrich-story NNN-slug scope-NN` | Deepen an underspecified scope |
| `/plan-split-story NNN-slug scope-NN` | Split an oversized scope |

---

## How area discovery works

When you run `/plan-init`, the plugin scans your project's top-level directories, detects the technology stack in each one, and proposes a short area code (e.g. `AP` for `api/`, `WB` for `web/`). You confirm or adjust the mapping, and the plugin generates:

- One `AREA-<CODE>-<dir>.md` file per area in `.planning/WORKFLOWS/05-SDLC-PHASE-GUIDANCE/`
- Pre-filled traceability matrix columns in `GUIDE.md`, `TRACEABILITY-GLOBAL.md`, and `_template/TRACEABILITY.md`

Areas are the columns of the traceability matrix — every planning scope tracks which areas it touches. If your project structure changes, update the area files and matrix headers manually.

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
│   │   └── scope-NN-name.md
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
├── METALANGUAGE.md
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
