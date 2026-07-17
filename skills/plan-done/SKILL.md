---
name: plan-done
description: Mark a specific task (or all tasks in a story) as done and advance the planning if all stories are complete.
argument-hint: <NNN-slug> <story-NN> [task-N]
allowed-tools: [Read, Bash]
---

Mark a specific task (or all tasks in a story) as done and advance the planning if all stories are complete.

Reference workflow: `.planning/WORKFLOWS/01-PLANNING-WORKFLOWS/ADVANCE-PLANNING.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN [task-N]`
- `NNN-slug` — planning id (e.g. `001-user-auth-api`)
- `story-NN` — story id (e.g. `story-01`)
- `task-N` — optional; specific task number to mark done (e.g. `task-3`). If omitted, mark all tasks done.

## Steps

1. Parse `$ARGUMENTS`.
2. Use only `./.planning/` in the current working directory. Do not search parent directories.
3. If `.planning/scripts/planning-mutate.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
4. If a specific task number was given, run:
   ```bash
   node .planning/scripts/planning-mutate.mjs done <planning-id> <story-id> <task-id> --format markdown
   ```
   Report the script output verbatim and stop.
5. If no task number was given, run review mode first:
   ```bash
   node .planning/scripts/planning-mutate.mjs done <planning-id> <story-id> --format markdown
   ```
6. Present the script output to the user. For `project.type: software`, also present the latest available smoke-test evidence from `.planning/<software.smoke_tests_file>` or the task/story test-suite artifacts. For every applicable generated, detected, or manually supplied gate, the evidence must include test type, exact command, parameters or profiles, environment, relevant configuration and scripts, output log or CI/report link, and result. If that evidence is missing or stale, rerun the smoke test plan or ask the user for the missing manual-test evidence before asking for approval.
7. Ask:
   > "Reply with **approved** to finalize the story after confirming all task PRs are merged into the story branch, or list the requested corrections."

   Do not advance until the user approves.
8. If the reviewer requests corrections, execute `[RECORD-EDGE-CASE]` with the requested corrections, implement them in a task branch, rerun the relevant verification, refresh the evidence metadata for each impacted gate, rerun the smoke test plan when code, build, dependencies, migrations, startup, or configuration changed, and ask for a new human review. Do not mark the story `DONE` or open the story PR before approval.
9. After approval, run:
   ```bash
   node .planning/scripts/planning-mutate.mjs done <planning-id> <story-id> --finalize-story --format markdown
   ```
   Report the script output verbatim. The script updates the story status, task table statuses, `01-expansion.md`, and the next eligible story when present.
10. Execute `[CHECK-TRACEABILITY]` — ensure all terms from this story are recorded.
    - If traceability finds an accepted cross-cutting decision without a PDR, invoke `/plan-decision <planning-id> -- <decision title>` before continuing. If the decision is only a candidate or lacks approval, report it as a suggested PDR follow-up.
11. If no next story remains, execute `MILESTONE-FEEDBACK`, invoke `/plan-retrospective <planning-id>`, then trigger `/plan-archive <planning-id>`.

> The script owns task/story status changes, story task table updates, `01-expansion.md` status updates, done-criteria extraction, and next-story selection. This skill owns human approval, traceability/PDR follow-up, retrospective/archive orchestration, and git/PR finalization.

### Git finalize (conditional)

After step 4b, if no specific task number was given (story fully done), all task PRs are merged into the story branch, and the human developer review approved finalization:

6. Generate the git finalization checklist:
   ```bash
   node .planning/scripts/planning-mutate.mjs done <planning-id> <story-id> --git-plan --format markdown
   ```
7. Follow the generated checklist:
   - If `execution.requires_git` is `false`, skip git operations and report that `.planning/config.yml` disables them.
   - Verify no task PRs targeting the story branch remain open before deleting local task branches.
   - Use `git branch -d` only; never force-delete task or story branches.
   - Rebase the story branch onto `git.base_branch`, push it, and open or reuse the story PR.
   - If the story PR is already merged, delete the local story branch from an updated base branch checkout. If it is still open, report the exact cleanup command to run after merge.
   - Do not delete remote branches; that remains a PR/repository policy action.
8. Report the story PR URL/state and local branch cleanup status.
