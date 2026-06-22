---
name: release-remove
description: Remove a planning from a release. Requires explicit confirmation if the release has already shipped.
argument-hint: <vX.Y.Z> <NNN-slug>
allowed-tools: [Read, Write, Bash]
---

Remove a planning from a release's `## Included Plannings` table. Adjusts row numbers and updates the README count automatically.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z NNN-slug`

- `version` — the release version (e.g. `v1.0.0`)
- `NNN-slug` — the planning ID to remove (e.g. `002-dashboard`)

Example: `v1.0.0 002-dashboard`

## Steps

1. Split `$ARGUMENTS` on whitespace into `version` (first token) and `planning-id` (second token). Stop if either is missing.

2. Locate `.releases/<version>.md`. If not found, stop: "Release `<version>` not found."

3. Read the `> **Status:**` line from the release file.
   - If status is `RELEASED`: warn the user — "Release `<version>` has already shipped. Removing a planning from it rewrites its history. Confirm? (yes/no)". Stop if the user does not confirm.

4. Scan the `## Included Plannings` table for a row whose second column (`Planning`) contains `<planning-id>`. If no such row exists, stop: "Planning `<planning-id>` is not in release `<version>`."

5. Remove that row. Renumber all remaining data rows: set the `#` column to 1, 2, 3… in order.

6. If the table now has no data rows, restore the placeholder row: `| — | — | — | — |`

7. Recount the table: `COMPLETED/TOTAL`. Update the `Plannings` column in `.releases/README.md` for this release.

8. Report: "Planning `<planning-id>` removed from release `<version>`. Plannings remaining: <TOTAL> (<COMPLETED> completed)."
