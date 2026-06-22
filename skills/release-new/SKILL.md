---
name: release-new
description: Create a new release in DRAFT status. Requires /release-init to have been run first.
argument-hint: <vX.Y.Z> -- <purpose>
allowed-tools: [Read, Write, Bash]
---

Create a new release entry in `.releases/`. Requires `/release-init` to have been run first.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z -- <purpose>`

- `vX.Y.Z` — semantic version (e.g. `v1.0.0`)
- `purpose` — one-sentence description of why this release exists

Example: `v1.0.0 -- First public API release with JWT auth and admin dashboard`

## Steps

1. Check `.releases/` exists at the project root. If not, stop: "Run `/release-init` first."

2. Parse `$ARGUMENTS` by splitting on the first ` -- `:
   - Left side = `version` (trimmed)
   - Right side = `purpose` (trimmed)
   - Validate `version` matches the pattern `v<digits>.<digits>.<digits>` (e.g. `v1.0.0`, `v2.3.14`). If it does not, stop: "Invalid version format. Use `vX.Y.Z` (e.g. `v1.0.0`)."
   - Stop if `purpose` is empty.

3. Check `.releases/<version>.md` does not already exist. If it does, stop: "Release `<version>` already exists. Use `/release-add <version> <NNN-slug>` to add plannings to it."

4. Ask the user for:
   - **Target period** — format `YYYY-QN-MN-WN` (e.g. `2026-Q1-M1-W2`). This encodes: year, quarter (Q1–Q4), month within that quarter (M1–M3), week within that month (W1–W4).
   - **Estimated date** — format `YYYY-MM-DD` (the specific target date within the period above).

5. Write `.releases/<version>.md` with the following content (substituting values):

```markdown
# 🚀 Release <version>

> **Status:** DRAFT
> **Target:** <target>
> **Estimated Date:** <estimated-date>
> [← .releases/README.md](README.md)

---

## Purpose

<purpose>

---

## Scope

[Which areas, services, or repositories are affected by this release.]

---

## Included Plannings

| # | Planning | Summary | Status |
|---|----------|---------|--------|
| — | — | — | — |

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

6. Update `.releases/README.md`:
   - If the table contains only the placeholder row (`| — | — | — | — | — |`): replace that row with the new entry.
   - Otherwise: append a new row at the end of the table.
   - Row format: `| [<version>](<version>.md) | <target> | DRAFT | <estimated-date> | 0/0 |`

7. Report: "Release `<version>` created at `.releases/<version>.md` (status: DRAFT, target: <target>). Next step: `/release-add <version> <NNN-slug>`."
