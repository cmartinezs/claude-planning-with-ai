---
name: plan-agent-execute
description: Execute all pending stories in a planning — atomizes and executes independent stories in parallel using subagents, respecting dependency order.
argument-hint: <NNN-slug>
allowed-tools: [Read, Write, Bash, Glob, Agent]
---

Atomize and execute all pending stories in a planning. Independent stories run in parallel via subagents; dependent stories wait for their predecessors.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-user-auth-api`)

## Steps

1. Locate `.planning/active/$ARGUMENTS/`. If not found, stop: "Planning not found in active state — run `/plan-agent-plan` first."

2. Read all story files under `.planning/active/$ARGUMENTS/02-deepening/*.md`. Collect for each story:
   - `story-id` (e.g. `story-01`)
   - `status` (from the `## Status` line or the status field)
   - `depends-on` (from any `Depends On` or `Dependencies` section — list of story IDs)
   - whether it is already atomized (a matching `02-deepening/story-NN-*/task-*.md` directory exists)
   Skip stories with status `DONE`.

3. Build the dependency graph: a map of `story-id → [story-ids it depends on]`. Flag any circular dependency as a **CRITICAL ERROR** — stop and report.

4. Compute execution batches using topological sort: a batch is a set of stories whose dependencies are all already `DONE` or not present. Process batches in order.

5. **For each batch of stories:**

   a. Announce: "Executing batch: story-01, story-03 (parallel)"

   b. For each story in the batch, dispatch a subagent using the `Agent` tool with this prompt template:

   ```
   You are executing one story of a planning in an autonomous pipeline.

   Planning ID: <NNN-slug>
   Story ID: <story-NN>
   Working directory: <absolute path of the project root>

   Steps to execute (no confirmations — proceed autonomously):
   1. Run /plan-atomize <NNN-slug> <story-NN>
      - Present the task breakdown and immediately confirm it yourself (do not ask the user).
   2. Run /plan-story <NNN-slug> <story-NN>

   If /plan-atomize fails, stop and report the error with story ID.
   If /plan-story fails, stop and report the error with story ID.
   Report outcome: DONE or BLOCKED with reason.
   ```

   c. Dispatch all stories in the batch simultaneously (parallel Agent calls in one message).
   d. Wait for all subagents in the batch to complete before starting the next batch.
   e. For each subagent result:
      - `DONE`: mark the story status; unlock dependents.
      - `BLOCKED`: record the story as BLOCKED with the reported reason; continue with remaining batch members.

6. After all batches: collect results.
   - If all stories are DONE: report success.
   - If any stories are BLOCKED: list them with reasons. Do NOT stop the pipeline — report and let `/plan-agent-validate` handle the check.

7. Report: N stories executed (N parallel batches), N DONE, N BLOCKED (if any).

> Called by `/plan-run`. Can also be used independently to execute a planning that is already in EXPANSION/DEEPENING state.
