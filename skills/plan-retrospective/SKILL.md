---
name: plan-retrospective
description: Generate or refresh the professional retrospective in a planning README from RETROSPECTIVE-RAW.md and planning context.
argument-hint: '<NNN-slug>'
allowed-tools: [Read, Write, Bash, Glob]
---

Generate or refresh the final retrospective for a planning.

Reads `.planning/active/<planning-id>/RETROSPECTIVE-RAW.md`, planning context, story statuses, and traceability notes. Writes a polished `## Retrospective` section into the planning `README.md`.

## Arguments

`$ARGUMENTS` — the planning id (e.g. `001-user-auth-api`)

## Steps

1. Parse `$ARGUMENTS`. If missing, stop and ask for the planning id.

2. Locate the planning:
   - Prefer `.planning/active/<planning-id>/`.
   - If not found, check `.planning/<planning-id>/` and allow a draft retrospective for INITIAL/EXPANSION work.
   - If only `.planning/finished/<planning-id>/` exists, stop unless the user explicitly asked to update a finished planning; finished plannings are normally read-only.

3. Read:
   - `README.md`
   - `RETROSPECTIVE-RAW.md` if present
   - `00-initial.md`
   - `01-expansion.md` if present
   - all story files under `02-deepening/` if present
   - `TRACEABILITY.md` if present

4. If `RETROSPECTIVE-RAW.md` is missing or contains only `*(No unexpected events recorded yet.)*`, continue using the planning files, but include a short note in the report that no raw edge-case notes were available.

5. Analyze the raw notes and planning context. Distinguish:
   - delivered outcomes
   - deviations from original scope or expected workflow
   - blockers, corrections, retries, rollbacks, skipped work, and validation failures
   - decisions made during execution
   - unresolved follow-ups
   - lessons that should inform future planning

6. Replace or create the `## Retrospective` section in `README.md`.
   - Preserve all content before `## Retrospective`.
   - Replace the existing retrospective section, including placeholder content.
   - If sections follow `## Retrospective`, preserve them after the new retrospective.

7. Use this output structure:

   ```md
   ## Retrospective

   Generated from `RETROSPECTIVE-RAW.md` and planning context on YYYY-MM-DD.

   ### Executive Summary

   <2-4 sentence summary of the completed planning and how execution actually unfolded.>

   ### Outcomes

   - <concrete delivered outcome, decision, or artifact>

   ### Deviations And Edge Cases

   - <unexpected event, blocker, correction, skip, retry, rollback, validation issue, or "None recorded">

   ### Decisions And Tradeoffs

   - <decision made during execution and why it was reasonable>

   ### Follow-ups

   - <open improvement, deferred work, or next planning candidate>

   ### Lessons For Future Plannings

   - <planning/process lesson>
   ```

8. Quality bar:
   - Do not copy raw notes verbatim unless the wording is already concise and factual.
   - Do not invent outcomes or resolutions not supported by the raw notes or planning files.
   - Keep the retrospective professional, specific, and useful for future planning.
   - If something is unresolved, name it as unresolved instead of smoothing it over.

9. Update the `## Current State` checklist in `README.md` if present:
   - Mark `Retrospective is complete` as `[x]`.
   - Mark other items only if the planning files clearly support them.

10. Report the updated path and summarize:
    - number of raw entries considered
    - whether unresolved follow-ups remain
    - whether the planning appears ready for `/plan-archive`
