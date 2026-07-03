---
name: plan-agent-plan
description: Execute the planning phase autonomously — creates a new planning (if needed) and advances it from INITIAL to EXPANSION without intermediate confirmations.
argument-hint: <NNN-slug | "description">
allowed-tools: [Read, Write, Bash, Glob]
---

Execute the planning phase: create (if mode is from-scratch) and expand a planning from INITIAL to EXPANSION. No confirmations between steps.

## Arguments

`$ARGUMENTS` — one of:
- `NNN-slug` — ID of an existing planning in INITIAL state (e.g. `001-user-auth-api`)
- `"free text"` — description to create a new planning from scratch; the agent assigns the next available NNN and a slug

## Steps

0. **Workspace boundary.** Use only `./.planning/` in the current working directory. Do not search parent directories for `.planning/`. If `./.planning/` does not exist, stop and ask the user to run `/plan-init` in the current directory.

1. **Detect mode:**
   - If `$ARGUMENTS` matches `\d{3}-[a-z0-9-]+`: **resume mode** — planning already exists in INITIAL state.
   - Otherwise: **from-scratch mode** — treat `$ARGUMENTS` as the planning description.

2. **From-scratch mode only:** Determine the next available planning number by reading `.planning/README.md`. Derive a kebab-case slug from the description (max 4 words). Invoke `/plan-new <NNN-slug> -- <description>` using the derived ID.

3. **Resume mode only:** Read `.planning/<NNN-slug>/00-initial.md`. Verify the planning is in INITIAL state (not inside `active/`). If it is already in EXPANSION or further, report "already past INITIAL — nothing to do" and stop.

4. Invoke `/plan-expand <NNN-slug>`.
   - Do NOT ask for story descriptions from the user — infer all stories from `00-initial.md` content. The agent must derive the story list autonomously.

5. Verify the planning is now in `.planning/active/<NNN-slug>/` with `01-expansion.md` and at least one `02-deepening/story-NN-*.md` file.

6. Optionally invoke `/plan-enrich-epic <NNN-slug>` if any created story file is missing an `Objective` or has fewer than two tasks in its task table — this indicates an underspecified story.

7. Report: planning ID, number of stories created, list of story names.

> Called by `/plan-run`. Can also be used independently for the planning phase only.
