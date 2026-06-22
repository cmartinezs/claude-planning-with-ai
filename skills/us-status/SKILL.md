---
name: us-status
description: Show the enrichment status of all stories in a container — which have DoD, Technical Notes, Dependencies; which are already linked to a active planning story.
argument-hint: <path/to/container/>
allowed-tools: [Read, Bash, Glob]
---

Audit all user stories in a container directory for completeness and planning linkage. The product-layer equivalent of `/plan-status`.

## Arguments

`$ARGUMENTS` — path to a story container (directory or file). Can be:
- A directory: `docs/product/user-stories/epic-01-auth/`
- A single story file: `docs/product/user-stories/epic-01-auth/03-teacher-login.md`
- Empty: scans from the current directory recursively for all story-shaped markdown files

## Steps

1. Resolve the target from `$ARGUMENTS`. If a directory: find all `*.md` files within it (non-recursive first, then recursive if none found). If a file: treat as a single-story scan. If empty: scan recursively from the current directory.

2. For each file found, determine if it is a user story by checking for at least one of: a `## Acceptance Criteria` section, an `## As a…` / `**As a**` line, or a `US-NNN` ID anywhere in the file. Skip files that don't look like stories.

3. For each story, collect:
   - **ID** — look for `US-NNN` pattern in the content or filename.
   - **Title** — first `#` heading or filename without extension.
   - **DoD** — presence of a `## Definition of Done` or `## DoD` section (✅ / ❌).
   - **Technical Notes** — presence of `## Technical Notes` section (✅ / ❌).
   - **Dependencies** — presence of `## Dependencies` section (✅ / ❌).
   - **Complexity** — presence of a Complexity estimate (✅ / ❌).
   - **In Planning** — search `.planning/active/*/01-expansion.md` files for a reference to this story's ID or filename. If found, record which planning (`NNN-slug`).

4. Output a status table:

```
## Story Status — <container path>

| Story | DoD | Tech Notes | Deps | Complexity | Planning |
|-------|-----|------------|------|------------|----------|
| US-001 Teacher Login | ✅ | ✅ | ❌ | ✅ | 001-jwt-auth |
| US-002 Token Refresh | ✅ | ❌ | ❌ | ❌ | — |
| US-003 Logout | ❌ | ❌ | ❌ | ❌ | — |

Summary: 3 stories — 2 have DoD, 1 has Technical Notes, 0 have Dependencies, 1 linked to a planning.

Stories needing enrichment: US-002 (missing Technical Notes, Complexity), US-003 (missing DoD, Technical Notes, Dependencies, Complexity)
Suggestion: `/us-enrich US-002` · `/us-enrich US-003`
```

5. If no story files are found, report clearly and suggest the correct path.

> Read-only. Does not modify any files.
