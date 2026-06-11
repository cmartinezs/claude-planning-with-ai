# Planning Metalanguage — Syntax Reference

> [← planning/README.md](./README.md)

The Planning Metalanguage is a YAML authoring format for the planning system.
A `.yaml` file conforming to this spec compiles to the exact same markdown files
that the system uses for human authoring — `00-initial.md`, `01-expansion.md`,
`README.md`, `TRACEABILITY.md`, and one `02-deepening/scope-NN-*.md` per scope.

Machines emit YAML; humans may also author in YAML for consistency. Either way
the source of truth for version control is always the compiled markdown.

---

## Contents

1. [Design Goals](#design-goals)
2. [Top-Level Structure](#top-level-structure)
3. [Scopes](#scopes)
4. [Tasks](#tasks)
5. [Done Criteria](#done-criteria)
6. [Traceability Terms](#traceability-terms)
7. [Conventions](#conventions)
8. [Full Example](#full-example)
9. [Compiler CLI](#compiler-cli)

---

## Design Goals

- **No information loss** — every field in the markdown can be round-tripped to/from YAML.
- **Metadata + references** — YAML holds structured fields; prose content (prompts, long descriptions)
  lives in separate `.md` files and is referenced by path.
- **Additive only** — new YAML keys never remove markdown capability; unknown keys are ignored.
- **Schema-backed** — the YAML root object validates against `_schema/planning.schema.json`.

---

## Top-Level Structure

```yaml
# planning/<NNN>-<slug>.plan.yaml
$schema: "planning/_schema/planning.schema.json"

id: "017"                           # Three-digit, zero-padded
name: "Planning API & Metalanguage"
status: DEEPENING                   # INITIAL | EXPANSION | DEEPENING | FINISHED
phase: W                            # W = workflow/meta; 0–11 = SDLC phase
intent: >
  Define a machine-readable API surface and metalanguage so external tools
  can query planning state, advance scopes, and validate outputs.
source: "Carlos Martínez (2026-05-14)"
masterPlan: null                    # or parent planning ID e.g. "008"

initiators:
  - name: Carlos Martínez
    date: "2026-05-14"
    role: Engineer

dates:
  created: "2026-05-14"
  lastUpdated: "2026-05-14"
  finished: null

terms:                              # See: Traceability Terms section
  - term: Planning API
    definition: Machine-readable JSON surface for querying and advancing plannings
    sdlcPhase: W

scopes:                             # See: Scopes section
  - id: "01"
    name: "API Surface & JSON Schemas"
    dependsOn: []
    status: DONE
    tasks: [ ... ]
    doneCriteria: [ ... ]
```

---

## Scopes

Each entry in `scopes[]` maps 1-to-1 to a `02-deepening/scope-NN-<slug>.md` file.
The compiler derives the file slug from the name using kebab-case.

```yaml
scopes:
  - id: "01"
    name: "API Surface & JSON Schemas"
    slug: api-surface          # Optional: override computed slug
    dependsOn: []              # Scope IDs this one waits on
    status: PENDING            # PENDING | IN_PROGRESS | DONE | BLOCKED | SKIPPED
    objective: >
      Define the JSON API surface and JSON schemas for all planning entities.
    tasks: [ ... ]
    doneCriteria: [ ... ]
    inconsistencies: []        # Optional, populated during execution
    residuals: []              # Optional, populated during execution
```

---

## Tasks

Tasks compile to the `## Tasks` table in each scope file.

```yaml
tasks:
  - number: 1
    description: "Design `planning/_schema/planning.schema.json`"
    workflow: GENERATE-DOCUMENT
    status: DONE
    output: "`_schema/planning.schema.json`"
    dependencies: []           # Task numbers that must be DONE first

  - number: 2
    description: "Design `planning/_schema/scope.schema.json`"
    workflow: GENERATE-DOCUMENT
    status: PENDING
    output: "`_schema/scope.schema.json`"
    dependencies: [1]
```

**Workflow values** must match a workflow ID from the catalog. See `_schema/task.schema.json`
for the full enum.

---

## Done Criteria

Done criteria compile to the `## Done Criteria` checklist in each scope file.

```yaml
doneCriteria:
  - description: "All 5 JSON schemas validate their respective entity types"
    satisfied: true
    validationRule: "schema-files-complete"   # Optional: links to validation.schema.json

  - description: "`index.json` manifest exists with schema version"
    satisfied: false
```

Criteria with `satisfied: true` compile to `- [x]`; `false` compiles to `- [ ]`.

---

## Traceability Terms

Terms compile to `TRACEABILITY.md`.

```yaml
terms:
  - term: Planning API
    definition: Machine-readable JSON surface for querying and advancing plannings
    sdlcPhase: W

  - term: Validation engine
    definition: Schema-driven checklist checker for task output verification
    sdlcPhase: W
```

`sdlcPhase` must be one of `W`, `0`–`11`.

---

## Conventions

### Prose vs. structured data

- **Short strings** (name, description, output): inline YAML strings.
- **Multi-line prose** (intent, objective): use YAML block scalar (`>` for folded, `|` for literal).
- **Long prompts / detailed instructions**: do NOT embed in YAML. Instead, reference an `.md` file:

```yaml
objective:
  file: "02-deepening/scope-01-objective.md"   # compiler includes file content inline
```

### Mermaid diagrams

Mermaid diagrams in the README `## Dependency Map` section are auto-generated by the compiler
from the `scopes[].dependsOn` graph. You do not write them manually in YAML.

Override with:

```yaml
dependencyMapOverride: |
  flowchart TD
    S01 --> S02
```

### Tables

Scope tables (`## Scopes` in README, `## Tasks` in scope files) are always generated
from the YAML. Never write raw markdown tables in YAML strings — use the structured fields.

### Field naming

YAML keys use `camelCase`. They map directly to the JSON schema field names in `_schema/`.

---

## Full Example

```yaml
$schema: "planning/_schema/planning.schema.json"

id: "005"
name: "Tutorial Interactive"
status: FINISHED
phase: W
intent: >
  Provide an interactive tutorial that walks a new user through the full
  planning lifecycle from INITIAL to FINISHED using a toy project.
source: "planning/001-planning-system-bootstrap"
masterPlan: null

initiators:
  - name: Carlos Martínez
    date: "2025-09-01"

dates:
  created: "2025-09-01"
  lastUpdated: "2025-10-15"
  finished: "2025-10-15"

terms:
  - term: Interactive tutorial
    definition: A guided walkthrough of the planning system via a toy project
    sdlcPhase: W

scopes:
  - id: "01"
    name: "Tutorial Setup"
    dependsOn: []
    status: DONE
    objective: Create the toy project and initial planning scaffold.
    tasks:
      - number: 1
        description: "Create `planning/active/005-tutorial/` folder structure"
        workflow: CREATE-PLANNING
        status: DONE
        output: "Folder created"
    doneCriteria:
      - description: "Folder structure matches planning template"
        satisfied: true
```

---

## Compiler CLI

The compiler is at `planning/_compiler/yaml-to-markdown.ts`.
It is invoked by `archon planning compile` (planning 018).

```
Usage:
  archon planning compile --input <path/to/planning.yaml> --output planning/active/

Options:
  --input   Path to a .plan.yaml file (required)
  --output  Target directory; the compiler creates NNN-<slug>/ inside it (default: planning/active/)
  --dry-run Print generated files to stdout without writing
  --verify  After writing, diff the generated markdown against any existing files
```

The compiler validates the YAML against `_schema/planning.schema.json` before writing.
Validation errors abort with exit code 1 and a structured error report.

---

> [← planning/README.md](./README.md)
