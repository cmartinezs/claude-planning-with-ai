---
name: release-status
description: Show live status of all releases or a specific release, reading planning states from .planning/. Use --mark-released or --mark-cancelled to transition status.
argument-hint: [<vX.Y.Z>] [--mark-planned | --mark-in-progress | --mark-blocked | --mark-released | --mark-cancelled]
allowed-tools: [Read, Write, Bash, Glob]
---

Show release status with live planning states read from `.planning/` (the source of truth — not from cached values in the release file). Optionally transition a release to RELEASED or CANCELLED.

## Arguments

`$ARGUMENTS` — one of:

- *(empty)* — summary table of all releases
- `vX.Y.Z` — full detail for one release with live planning statuses
- `vX.Y.Z --mark-planned` — transition to PLANNED
- `vX.Y.Z --mark-in-progress` — transition to IN PROGRESS
- `vX.Y.Z --mark-blocked` — mark as BLOCKED (when a planning is blocking progress)
- `vX.Y.Z --mark-released` — mark as RELEASED (requires all plannings COMPLETED)
- `vX.Y.Z --mark-cancelled` — mark as CANCELLED regardless of planning states

## Steps

### No argument — all releases summary

1. Verify `.releases/` exists. If not, stop: "Run `/release-init` first."

2. Glob all `.releases/v*.md` files (exclude `README.md`). If none found, report: "No releases yet. Create one with `/release-new <vX.Y.Z> -- <purpose>`."

3. For each release file:
   a. Read: version (from filename), `> **Status:**`, `> **Target:**`, `> **Estimated Date:**`.
   b. Read each data row in `## Included Plannings` to collect planning IDs (skip the placeholder row `| — |`).
   c. For each planning ID: look up current status by reading `.planning/active/<id>/00-initial.md` or `.planning/finished/<id>/00-initial.md` — whichever exists. Extract `> **Status:**`. If neither file is found, mark status as `NOT FOUND`.
   d. Compute `COMPLETED_COUNT` (rows with live status `COMPLETED`) and `TOTAL_COUNT`.
   e. Determine suggestion:
      - Any planning `NOT FOUND` → `⚠️ planning not found in .planning/`
      - Any planning has live status `BLOCKED` and release status ≠ `BLOCKED` → `⚠️ has BLOCKED planning — run \`/release-status <version> --mark-blocked\` or resolve the blocker`
      - All plannings `COMPLETED` and release status ≠ `RELEASED` → `✅ ready — run \`/release-status <version> --mark-released\``
      - `COMPLETED_COUNT > 0` but not all done and release status is `DRAFT` → `consider moving to IN PROGRESS — run \`/release-status <version> --mark-in-progress\``
      - `TOTAL_COUNT = 0` → `add plannings with \`/release-add <version> <NNN-slug>\``
      - No suggestion → `—`

4. Print summary table:

```
| Version | Target        | Status      | Est. Date  | Progress | Suggestion                                  |
|---------|--------------|-------------|------------|----------|---------------------------------------------|
| v1.0.0  | 2026-Q1-M1-W2 | IN PROGRESS | 2026-01-12 | 2/3      | ✅ ready — run --mark-released              |
| v1.1.0  | 2026-Q2-M1-W1 | DRAFT       | 2026-04-05 | 0/0      | add plannings with /release-add             |
```

---

### With version — detail view

1. Locate `.releases/<version>.md`. Stop if not found.

2. Read all fields: status, target, estimated date, purpose, scope, done criteria, release notes.

3. Read each data row in `## Included Plannings`. For each planning ID:
   - Read live status from `.planning/active/<id>/00-initial.md` or `.planning/finished/<id>/00-initial.md`.
   - If live status differs from the cached value in the release file, annotate: `COMPLETED (cached: IN PROGRESS)`.
   - If not found: annotate `NOT FOUND`.

4. Print the full release detail, replacing the Status column in `## Included Plannings` with live values.

5. Print suggestion below the output:
   - All plannings COMPLETED and status ≠ RELEASED → "✅ All plannings done — run `/release-status <version> --mark-released` to ship."
   - Any planning BLOCKED → "⚠️ Planning `<id>` is BLOCKED — run `/release-status <version> --mark-blocked` or resolve the blocker first, then remove with `/release-remove`."
   - No data rows → "No plannings — add with `/release-add <version> <NNN-slug>`."
   - No suggestion needed → omit.

---

### `--mark-released` flag

1. Parse `version` from `$ARGUMENTS`. Locate `.releases/<version>.md`. Stop if not found.

2. Read all planning IDs from `## Included Plannings` (skip placeholder row).

3. For each planning ID: read live status from `.planning/`. Collect all IDs whose live status is not `COMPLETED`.

4. If any planning is not `COMPLETED`: stop — "Cannot mark as RELEASED. The following plannings are not COMPLETED: [list each with its live status]. Remove them with `/release-remove <version> <id>` or wait until they complete."

5. In `.releases/<version>.md`: replace the line `> **Status:** <old>` with `> **Status:** RELEASED`.

6. In `.releases/README.md`: find the table row where the Version column contains `<version>` and replace its Status column value with `RELEASED`.

7. Report: "Release `<version>` marked as RELEASED. 🎉"

---

### `--mark-cancelled` flag

1. Parse `version` from `$ARGUMENTS`. Locate `.releases/<version>.md`. Stop if not found.

2. In `.releases/<version>.md`: replace the line `> **Status:** <old>` with `> **Status:** CANCELLED`.

3. In `.releases/README.md`: find the table row where the Version column contains `<version>` and replace its Status column value with `CANCELLED`.

4. Report: "Release `<version>` marked as CANCELLED."

---

### `--mark-planned` flag

1. Parse `version` from `$ARGUMENTS`. Locate `.releases/<version>.md`. Stop if not found.

2. In `.releases/<version>.md`: replace the line `> **Status:** <old>` with `> **Status:** PLANNED`.

3. In `.releases/README.md`: find the table row where the Version column contains `<version>` and replace its Status column value with `PLANNED`.

4. Report: "Release `<version>` marked as PLANNED."

---

### `--mark-in-progress` flag

1. Parse `version` from `$ARGUMENTS`. Locate `.releases/<version>.md`. Stop if not found.

2. In `.releases/<version>.md`: replace the line `> **Status:** <old>` with `> **Status:** IN PROGRESS`.

3. In `.releases/README.md`: find the table row where the Version column contains `<version>` and replace its Status column value with `IN PROGRESS`.

4. Report: "Release `<version>` marked as IN PROGRESS."

---

### `--mark-blocked` flag

1. Parse `version` from `$ARGUMENTS`. Locate `.releases/<version>.md`. Stop if not found.

2. Read each planning ID from `## Included Plannings` (skip placeholder row `| — |`). For each, read its live status from `.planning/active/<id>/00-initial.md` or `.planning/finished/<id>/00-initial.md`. If no planning has live status `BLOCKED`, warn: "No included planning is currently BLOCKED. Mark anyway? (yes/no)". Stop if not confirmed.

3. In `.releases/<version>.md`: replace the line `> **Status:** <old>` with `> **Status:** BLOCKED`.

4. In `.releases/README.md`: find the table row where the Version column contains `<version>` and replace its Status column value with `BLOCKED`.

5. Report: "Release `<version>` marked as BLOCKED."
