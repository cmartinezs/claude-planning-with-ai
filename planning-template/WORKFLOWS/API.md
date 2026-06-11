# 🔄 API Workflows — Catalog

> [← WORKFLOWS/README.md](./README.md) | [← planning/README.md](../README.md)

API workflows are programmatic operations added by planning 017. They are consumed by the
`archon planning` CLI (planning 018) and by CI pipelines. Each workflow references a typed
input/output model defined in `planning/_schema/`.

---

## Workflow Index

| ID | Group | Description |
|----|-------|-------------|
| [QUERY-PLANNING](#query-planning) | API | Return planning state as a structured JSON object |
| [LIST-PLANNINGS](#list-plannings) | API | List all plannings with status and location |
| [ADVANCE-SCOPE](#advance-scope) | API | Mark tasks done and update scope status in markdown |
| [VALIDATE-OUTPUT](#validate-output) | API | Run the validation engine against a scope's done criteria |
| [CREATE-PLANNING](#create-planning) | API | Create a new planning folder from a YAML/JSON template |
| [GET-GRAPH](#get-graph) | API | Return the machine-readable interdependency graph |

---

## QUERY-PLANNING

**ID:** `QUERY-PLANNING`
**Group:** API
**When to use:** An external tool needs the current state of a planning or one of its scopes.

### Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `planningId` | `planningId` | Yes | Three-digit planning ID (e.g., `"017"`) |
| `scopeId` | `scopeId` | No | Two-digit scope ID; if omitted, returns the full planning |
| `taskNumber` | `integer` | No | If set, returns only that task from the specified scope |

### Outputs

| Name | Type | Description |
|------|------|-------------|
| `planning` | `object` | Full planning object matching `_schema/planning.schema.json` |
| `scope` | `object` | Scope object matching `_schema/scope.schema.json` (when `scopeId` given) |
| `task` | `object` | Task object matching `_schema/task.schema.json` (when `taskNumber` given) |

### Steps

1. **READ** — Locate the planning folder in `planning/active/` or `planning/finished/` by ID.
2. **READ** — Parse `README.md` for top-level fields (id, name, status, scopes table).
3. **READ** — If `scopeId` given, parse `02-deepening/scope-NN-*.md` for tasks and criteria.
4. **COMPILE** — Assemble a JSON object matching the relevant schema.
5. **VALIDATE** — Validate the assembled object against `_schema/planning.schema.json` or `_schema/scope.schema.json`.
6. **WRITE** — Return JSON to stdout (CLI) or caller (library).

---

## LIST-PLANNINGS

**ID:** `LIST-PLANNINGS`
**Group:** API
**When to use:** Enumerate all plannings for a dashboard, dependency check, or filter operation.

### Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `string` | No | Filter: `INITIAL`, `EXPANSION`, `DEEPENING`, `FINISHED` |
| `phase` | `string` | No | Filter by SDLC phase (`W`, `0`–`11`) |

### Outputs

| Name | Type | Description |
|------|------|-------------|
| `plannings` | `array` | Array of planning summary objects from `_graph/plannings.json` |

### Steps

1. **READ** — Read `planning/_graph/plannings.json`.
2. **QUERY** — Apply `status` and `phase` filters if provided.
3. **WRITE** — Return filtered array to stdout or caller.

*If `_graph/plannings.json` does not exist, invoke `GET-GRAPH` first.*

---

## ADVANCE-SCOPE

**ID:** `ADVANCE-SCOPE`
**Group:** API
**When to use:** An automated tool has completed tasks and needs to mark them done, update scope status, and regenerate the graph.

### Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `planningId` | `planningId` | Yes | Target planning ID |
| `scopeId` | `scopeId` | Yes | Target scope ID |
| `taskResults` | `array` | Yes | Array of `{ number, status, output }` for each updated task |

### Outputs

| Name | Type | Description |
|------|------|-------------|
| `updatedFiles` | `array` | List of files written |
| `newScopeStatus` | `string` | The scope's status after update |
| `graphRegenerated` | `boolean` | Whether `_graph/plannings.json` was updated |

### Steps

1. **READ** — Parse `02-deepening/scope-NN-*.md` for the current task table.
2. **UPDATE** — Apply `taskResults`: set each task's status and output in the table.
3. **CHECK** — Evaluate all `doneCriteria`: if all satisfied, set scope status to `DONE`.
4. **WRITE** — Write the updated scope file.
5. **UPDATE** — Update the scope row in `README.md`.
6. **INVOKE-SUB-WORKFLOW** — Trigger `GET-GRAPH` to regenerate `_graph/plannings.json`.

### Preconditions

- Planning must be in `active/`.
- All `dependsOn` scopes must have status `DONE`.
- `taskResults` numbers must match existing task numbers in the scope.

---

## VALIDATE-OUTPUT

**ID:** `VALIDATE-OUTPUT`
**Group:** API
**When to use:** Verify that a scope's or task's output meets its done criteria before marking it DONE.

### Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `planningId` | `planningId` | Yes | Target planning ID |
| `scopeId` | `scopeId` | Yes | Target scope ID |
| `taskNumber` | `integer` | No | Validate only this task's output; omit to validate all criteria |
| `ruleSetFile` | `filePath` | No | Path to a custom `ValidationRuleSet` JSON; defaults to scope's built-in criteria |

### Outputs

| Name | Type | Description |
|------|------|-------------|
| `report` | `object` | `ValidationReport` JSON (see `_schema/validation.schema.json`) |
| `exitCode` | `integer` | `0` = all required rules passed; `1` = at least one required rule failed |

### Steps

1. **READ** — Load the scope's done criteria from `02-deepening/scope-NN-*.md`.
2. **READ** — If `ruleSetFile` given, load it instead; else convert criteria to internal `ValidationRuleSet`.
3. **VALIDATE** — Invoke `_engine/validate.ts` with the rule set and `planning/` as root.
4. **WRITE** — Print JSON validation report to stdout.
5. **CHECK** — Exit 0 if `report.passed`, exit 1 otherwise.

---

## CREATE-PLANNING

**ID:** `CREATE-PLANNING`
**Group:** API
**When to use:** A tool or AI agent needs to bootstrap a new planning from a structured YAML/JSON definition.

### Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `template` | `filePath` | Yes | Path to a `.plan.yaml` or `.plan.json` file (matches `_schema/planning.schema.json`) |
| `targetId` | `planningId` | Yes | Three-digit ID for the new planning |
| `outputDir` | `filePath` | No | Target directory; defaults to `planning/active/` |

### Outputs

| Name | Type | Description |
|------|------|-------------|
| `planningDir` | `filePath` | Path to the created folder |
| `filesCreated` | `array` | List of all created markdown files |

### Steps

1. **VALIDATE** — Validate template against `_schema/planning.schema.json`.
2. **CHECK** — Verify no existing folder with `targetId` in `active/` or `finished/`.
3. **COMPILE** — Invoke `_compiler/yaml-to-markdown.ts` to generate markdown files.
4. **WRITE** — Write all files to `planning/active/NNN-<slug>/`.
5. **UPDATE** — Append the new planning to `planning/_graph/plannings.json`.

---

## GET-GRAPH

**ID:** `GET-GRAPH`
**Group:** API
**When to use:** Regenerate or retrieve the machine-readable interdependency graph for all plannings.

### Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `planningId` | `planningId` | No | If given, regenerate only this planning's entries in the graph |
| `outputDir` | `filePath` | No | Where to write graph JSON; defaults to `planning/_graph/` |

### Outputs

| Name | Type | Description |
|------|------|-------------|
| `planningsJson` | `filePath` | Path to `_graph/plannings.json` |
| `scopeGraphJson` | `filePath` | Path to `_graph/scope-graph.json` |
| `termsJson` | `filePath` | Path to `_graph/terms.json` |
| `workflowGraphJson` | `filePath` | Path to `_graph/workflow-graph.json` |

### Steps

1. **READ** — Enumerate all folders in `planning/active/` and `planning/finished/`.
2. **READ** — For each planning, parse `README.md` for id, name, status, and scope table.
3. **READ** — For each planning, parse `TRACEABILITY.md` for terms.
4. **COMPILE** — Build `plannings.json`, `scope-graph.json`, `terms.json`, `workflow-graph.json`.
5. **VALIDATE** — Validate each JSON against its schema in `_schema/`.
6. **WRITE** — Write all four files to `_graph/`.

---

> [← WORKFLOWS/README.md](./README.md) | [← planning/README.md](../README.md)
