---
name: plan-agent-execute
description: Execute all pending scopes in a planning — atomizes and executes independent scopes in parallel using subagents, respecting dependency order.
argument-hint: <NNN-slug>
allowed-tools: [Read, Write, Bash, Glob, Agent]
---

Atomize and execute all pending scopes in a planning. Independent scopes run in parallel via subagents; dependent scopes wait for their predecessors.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-user-auth-api`)

## Steps

1. Locate `.planning/active/$ARGUMENTS/`. If not found, stop: "Planning not found in active state — run `/plan-agent-plan` first."

2. Read all scope files under `.planning/active/$ARGUMENTS/02-deepening/*.md`. Collect for each scope:
   - `scope-id` (e.g. `scope-01`)
   - `status` (from the `## Status` line or the status field)
   - `depends-on` (from any `Depends On` or `Dependencies` section — list of scope IDs)
   - whether it is already atomized (a matching `02-deepening/scope-NN-*/task-*.md` directory exists)
   Skip scopes with status `DONE`.

3. Build the dependency graph: a map of `scope-id → [scope-ids it depends on]`. Flag any circular dependency as a **CRITICAL ERROR** — stop and report.

4. Compute execution batches using topological sort: a batch is a set of scopes whose dependencies are all already `DONE` or not present. Process batches in order.

5. **For each batch of scopes:**

   a. Announce: "Executing batch: scope-01, scope-03 (parallel)"

   b. For each scope in the batch, dispatch a subagent using the `Agent` tool with this prompt template:

   ```
   You are executing one scope of a planning in an autonomous pipeline.

   Planning ID: <NNN-slug>
   Scope ID: <scope-NN>
   Working directory: <absolute path of the project root>

   Steps to execute (no confirmations — proceed autonomously):
   1. Run /plan-atomize <NNN-slug> <scope-NN>
      - Present the task breakdown and immediately confirm it yourself (do not ask the user).
   2. Run /plan-scope <NNN-slug> <scope-NN>

   If /plan-atomize fails, stop and report the error with scope ID.
   If /plan-scope fails, stop and report the error with scope ID.
   Report outcome: DONE or BLOCKED with reason.
   ```

   c. Dispatch all scopes in the batch simultaneously (parallel Agent calls in one message).
   d. Wait for all subagents in the batch to complete before starting the next batch.
   e. For each subagent result:
      - `DONE`: mark the scope status; unlock dependents.
      - `BLOCKED`: record the scope as BLOCKED with the reported reason; continue with remaining batch members.

6. After all batches: collect results.
   - If all scopes are DONE: report success.
   - If any scopes are BLOCKED: list them with reasons. Do NOT stop the pipeline — report and let `/plan-agent-validate` handle the check.

7. Report: N scopes executed (N parallel batches), N DONE, N BLOCKED (if any).

> Called by `/plan-run`. Can also be used independently to execute a planning that is already in EXPANSION/DEEPENING state.
