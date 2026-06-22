# Release Planning — Design Spec

**Date:** 2026-06-22
**Status:** Approved

---

## Context

The planning system tracks work via plannings (INITIAL → EXPANSION → DEEPENING → COMPLETED). There is currently no mechanism to group plannings into a shippable release, assign a target date, or track delivery status. This feature adds release planning as a first-class concept in the plugin.

---

## Goals

- Group one or more plannings into a named release with semantic version.
- Track release purpose, scope, target period, estimated date, and status.
- Allow adding and removing plannings from a release at any time.
- Block a release from being marked RELEASED until all included plannings are COMPLETED.
- Provide a live status view that reads planning state from `.planning/` directly.

---

## Out of Scope

- Automatic deployment or CI/CD integration.
- Linking releases to git tags.
- Release dependencies (release A requires release B).

---

## Directory Structure

Releases live in `.releases/` at the project root, outside `.planning/`. Created by `/release-new` on first use.

```
.releases/
├── README.md       # Index table of all releases
├── v1.0.0.md       # One file per release
└── v1.1.0.md
```

### Release file format (`v1.0.0.md`)

```markdown
# 🚀 Release v1.0.0

> **Status:** DRAFT
> **Target:** 2026-Q1-M1-W2
> **Estimated Date:** 2026-01-12
> [← .releases/README.md](README.md)

---

## Purpose

[Why this release exists — the value it delivers to users or the system.]

---

## Scope

[Which areas, services, or repositories are affected.]

---

## Included Plannings

| # | Planning | Summary | Status |
|---|----------|---------|--------|
| 1 | 001-user-auth-api | JWT authentication for API layer | COMPLETED |
| 2 | 002-dashboard | Admin dashboard v1 | IN PROGRESS |

---

## Done Criteria

- [ ] All included plannings are COMPLETED
- [ ] Release notes drafted and reviewed

---

## Release Notes

> *Fill when the release is delivered. Summarize what changed for end users.*

*(pending)*

---

> [← .releases/README.md](README.md)
```

### Index file format (`.releases/README.md`)

```markdown
# 🚀 Releases

| Version | Target | Status | Est. Date | Plannings |
|---------|--------|--------|-----------|-----------|
| [v1.0.0](v1.0.0.md) | 2026-Q1-M1-W2 | IN PROGRESS | 2026-01-12 | 1/2 |
```

The `Plannings` column shows `COMPLETED/TOTAL` as a quick progress indicator.

---

## Status Lifecycle

```
DRAFT → PLANNED → IN PROGRESS → RELEASED
                              → CANCELLED
  * → BLOCKED  (any included planning is BLOCKED)
```

| Status | Meaning |
|--------|---------|
| `DRAFT` | Being planned; scope not finalized |
| `PLANNED` | Scope locked, date set, execution not started |
| `IN PROGRESS` | At least one planning is IN PROGRESS or COMPLETED |
| `BLOCKED` | At least one planning is BLOCKED |
| `RELEASED` | All plannings COMPLETED, manually confirmed |
| `CANCELLED` | Release abandoned |

Transitions are **manual** — `/release-status` detects and suggests the right next state; the user confirms by re-running with a flag or invoking a separate confirm step (see skill details).

---

## Skills

### `/release-new`

**Argument:** `<version> -- <purpose>`
**Example:** `release-new v1.0.0 -- First public API release`

Steps:
1. Validate version format (`vX.Y.Z`). Stop if a release with that version already exists.
2. Create `.releases/` if it doesn't exist.
3. Ask interactively: **Target period** (format `YYYY-QN-MN-WN`) and **Estimated date** (`YYYY-MM-DD`).
4. Create `.releases/v1.0.0.md` from template, status `DRAFT`.
5. Create or update `.releases/README.md`: add a row for the new release.
6. Report: release created, path, next step (`/release-add`).

---

### `/release-add`

**Argument:** `<version> <NNN-slug> [<NNN-slug> ...]`
**Example:** `release-add v1.0.0 001-user-auth-api 002-dashboard`

Steps:
1. Locate `.releases/<version>.md`. Stop if not found.
2. For each planning ID: search `.planning/active/` and `.planning/finished/` for a matching folder. Extract the one-line intent from `00-initial.md` as summary. Stop if not found.
3. Skip any planning already in the table (no duplicates).
4. Append a row per planning to the `## Included Plannings` table with current status.
5. Update the `Plannings` count in `.releases/README.md`.
6. Report: N plannings added, current release status.

---

### `/release-remove`

**Argument:** `<version> <NNN-slug>`
**Example:** `release-remove v1.0.0 002-dashboard`

Steps:
1. Locate `.releases/<version>.md`. Stop if not found.
2. If release status is `RELEASED`: warn — "This release has already shipped. Removing a planning from it rewrites history. Confirm? (yes/no)". Stop if not confirmed.
3. Find and remove the row for `<NNN-slug>` from `## Included Plannings`. Stop if planning is not in the table.
4. Update the `Plannings` count in `.releases/README.md`.
5. Report: planning removed, updated count, current release status.

---

### `/release-status`

**Argument:** `[<version>]`
**Example (no arg):** `release-status` — shows all releases
**Example (with arg):** `release-status v1.0.0` — shows one release in detail

**Without argument:**
1. Read all `.releases/*.md` files (exclude `README.md`).
2. For each release, read each planning's current status from `.planning/` directly (source of truth, not the cached value in the release file).
3. Compute live `COMPLETED/TOTAL` ratio per release.
4. Print a summary table: Version | Target | Status | Est. Date | Progress | State suggestion.
5. If any release has a suggested state transition, note it inline.

**With version argument:**
1. Read `.releases/<version>.md`.
2. For each planning in the table: look it up in `.planning/active/` or `.planning/finished/`, read its current status, and update the row in the output (not in the file — display only).
3. Print full release detail with live planning statuses.
4. Evaluate and print suggested state transition:
   - All plannings COMPLETED + status ≠ RELEASED → "All plannings done — run `/release-status v1.0.0 --mark-released` to mark as RELEASED."
   - Any planning BLOCKED + status ≠ BLOCKED → "Planning NNN is BLOCKED — consider removing it or resolving the blocker."
5. `--mark-released` flag: sets status to `RELEASED` in the file and updates README. Requires all plannings to be COMPLETED; stops with an error otherwise listing which are not.
6. `--mark-cancelled` flag: sets status to `CANCELLED` regardless of planning states.

---

## File creation responsibility

`.releases/` and `.releases/README.md` are created by `/release-new` on first use. `/plan-init` does **not** need to be modified.

---

## Error cases

| Situation | Behavior |
|-----------|----------|
| Version already exists | Stop with error in `/release-new` |
| Planning not found in `.planning/` | Stop with error in `/release-add` |
| Planning already in release | Skip silently with note |
| Removing from RELEASED release | Require explicit confirmation |
| Marking RELEASED with incomplete plannings | Stop, list incomplete ones |
| Invalid version format | Stop with format hint |
