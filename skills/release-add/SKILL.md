---
name: release-add
description: Add one or more plannings to an existing release. Reads planning summaries and current statuses from .planning/ automatically.
argument-hint: <vX.Y.Z> <NNN-slug> [<NNN-slug> ...]
allowed-tools: [Read, Write, Bash, Glob]
---

Add one or more plannings to a release's `## Included Plannings` table. Planning summaries and current statuses are read from `.planning/` automatically — no manual entry needed.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z NNN-slug [NNN-slug ...]`

- First token: release version (e.g. `v1.0.0`)
- Remaining tokens: one or more planning IDs (e.g. `001-user-auth-api 002-dashboard`)

Example: `v1.0.0 001-user-auth-api 002-dashboard`

## Steps

1. Split `$ARGUMENTS` on whitespace: first token = `version`, remaining = list of planning IDs. Stop if no planning IDs are provided.

2. Locate `.releases/<version>.md`. If not found, stop: "Release `<version>` not found. Create it first with `/release-new <version> -- <purpose>`."

3. For each planning ID in the list:

   a. Search for the planning folder: check `.planning/active/<planning-id>/` and `.planning/finished/<planning-id>/` (in that order). If neither exists, stop: "Planning `<planning-id>` not found in `.planning/active/` or `.planning/finished/`."

   b. Read `00-initial.md` from the found folder. Extract the `Intent` field — the text on the line immediately after `## Intent`, taking only the first sentence (up to the first `.`). Strip any surrounding `[` `]` characters if the field is still a placeholder.

   c. Extract the planning's current status: look for the line matching `> **Status:**` in `00-initial.md`. Take the value after the colon. If not found, use `UNKNOWN`.

   d. Check whether `<planning-id>` already appears in any cell of the `## Included Plannings` table. If it does, skip this planning and record: "`<planning-id>` already in release — skipped."

   e. Count existing data rows in the table (skip the placeholder row `| — | — | — | — |`). Next row number = count + 1.

   f. If the table contains only the placeholder row, replace it with the new row. Otherwise append the new row at the end.

   g. New row format: `| <N> | <planning-id> | <intent-first-sentence> | <status> |`

4. After processing all planning IDs, recount the `## Included Plannings` table:
   - `TOTAL` = number of data rows
   - `COMPLETED` = number of rows whose `Status` column is exactly `COMPLETED`
   - Update the `Plannings` column in `.releases/README.md` for this release to `<COMPLETED>/<TOTAL>`.

5. Report: `N planning(s) added, M skipped (already present).` Print the updated `## Included Plannings` table.
