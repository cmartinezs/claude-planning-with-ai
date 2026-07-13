---
name: plan-decision
description: Create or update a Project Decision Record (PDR) for a significant cross-cutting planning decision.
argument-hint: '<NNN-slug> -- <decision title> | <NNN-slug> pdr-NNN-title'
allowed-tools: [Read, Write, Bash, Glob]
---

Create or update a Project Decision Record (PDR) inside a planning.

Use this only for decisions that affect multiple stories, repository areas, lifecycle rules, glossary terms, or future plannings. Do not create a PDR for routine task-level implementation choices; record those in the task `Technical Design` section or in an ADR if the project already uses ADRs.

## Automatic Callers

`/plan-decision` is the only command that writes PDR files. Other skills and workflows may invoke it when they detect a decision that crosses task boundaries.

Create or update a PDR directly when all of these are true:

- The decision is accepted, approved, explicitly requested by the user, or forced by an authoritative source hierarchy rule.
- The decision affects more than one story, more than one repository area, shared terminology, planning policy, or future plannings.
- The agent has enough evidence to fill `Context`, `Decision`, `Rationale`, `Affected Areas`, and `Related` without inventing facts.

Suggest `/plan-decision` instead of writing when any of these are true:

- The decision is only a candidate, lesson, open question, or retrospective signal.
- The effect appears local to one task or one implementation file.
- The decision needs human approval, product judgment, or missing rationale.
- The agent cannot identify the affected planning, story/task, or repository areas.

Expected automatic callers:

- `RECORD-INCONSISTENCY` / `[RESOLVE-CONFLICT]` — create or update a PDR when resolving a cross-cutting conflict establishes a durable rule.
- `CASCADE-CHANGE` — create or update a PDR before propagating a policy, terminology, or contract change across several documents or areas.
- `UPDATE-TRACEABILITY` / `[CHECK-TRACEABILITY]` — invoke `/plan-decision` when a traced decision is accepted and cross-cutting; otherwise record it only in traceability and suggest the PDR follow-up.
- `/plan-edge-case` and `RECORD-EDGE-CASE` — normally record a raw note and suggest `/plan-decision`; create directly only when the note contains an explicit accepted cross-cutting decision.
- `MILESTONE-FEEDBACK`, `/plan-retrospective`, `/plan-done`, and `/plan-archive` — scan completed work for accepted cross-cutting decisions missing PDRs; create when evidence is complete, otherwise list candidates.

## Arguments

`$ARGUMENTS` supports:

```bash
NNN-slug -- decision title
NNN-slug pdr-NNN-title
```

- `NNN-slug` — planning id.
- `decision title` — human-readable title. The command derives the next `pdr-NNN-<title>.md` filename.
- `pdr-NNN-title` — existing PDR file to update.

## Steps

1. **Workspace boundary.** Use only `./.planning/` in the current working directory. Do not search parent directories for `.planning/`.

2. Locate the planning in this order:
   - `.planning/active/<planning-id>/`
   - `.planning/<planning-id>/`
   - `.planning/finished/<planning-id>/`

   If only the finished planning exists, allow read/update only if the user explicitly asked to amend an archived record; otherwise stop and ask for a follow-up planning.

3. Read the planning context:
   - `00-initial.md`
   - `01-expansion.md` if present
   - relevant story/task files if the user named one
   - `TRACEABILITY.md` if present
   - existing `pdr-*.md` files in the planning root

4. Decide whether a PDR is appropriate:
   - Use a PDR for accepted or proposed decisions that change planning policy, cross-story behavior, shared terminology, repository-area contracts, or future workflow expectations.
   - Do not use a PDR for one-off bug fixes, local task design, transient blockers, or raw retrospective notes.
   - If the decision is not PDR-worthy, stop and recommend the better location: task `Technical Design`, `RETROSPECTIVE-RAW.md` via `/plan-edge-case`, `TRACEABILITY.md`, or an ADR.
   - If another workflow invoked this command automatically, apply the direct-create vs. suggest thresholds above before writing.

5. Create or update the PDR:
   - If updating an existing PDR, preserve its filename and refresh only the sections supported by current evidence.
   - If creating a new PDR, copy `.planning/PDR-TEMPLATE.md` to `<planning-root>/pdr-NNN-<slug>.md`, where `NNN` is the next sequential number among existing PDRs in that planning.
   - Fill `Context`, `Decision`, `Rationale`, `Alternatives Considered`, `Consequences`, `Affected Areas`, and `Related`.
   - Set status to `Proposed` unless the user explicitly said the decision is accepted, approved, or already final.

6. Update traceability:
   - If `TRACEABILITY.md` exists, add or update one row under `## Decisions Made` with the PDR id, decision summary, rationale, affected areas, and today's date.
   - If the PDR creates a new term or unresolved follow-up, add it to the appropriate traceability table.

7. Report:
   - PDR path created or updated.
   - Status (`Proposed`, `Accepted`, etc.).
   - Traceability row updated, or why it was not updated.

> PDR files are optional. A planning should contain zero PDRs unless a real cross-cutting decision needs a durable record.
