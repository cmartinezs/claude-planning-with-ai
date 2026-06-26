---
name: plan-done
description: Mark a specific task (or all tasks in a story) as done and advance the planning if all stories are complete.
argument-hint: <NNN-slug> <story-NN> [task-N]
allowed-tools: [Read, Write, Bash, Glob]
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
2. Read `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`.
3. If a specific task number was given: find that task in the checklist and mark it `[x]`. Report and stop.
4. If no task number given (mark all):
   a. Mark all tasks `[x]` in the story file.
   b. Execute `[EXECUTE-STORY]` — verify done criteria are satisfied.
      - If `BLOCKED`: report unmet criteria, do NOT advance.
      - If `DONE`: present the full `## Done Criteria` section of the story file to the user and ask explicitly:

        > "The system verified the done criteria automatically. Please open the story file and confirm each criterion below is truly satisfied in the codebase before this story is marked DONE:"

        List every criterion with its current `[x]` / `[ ]` state. Then ask:

        > "Reply with **confirmed** to finalize, or indicate which criteria still need work."

        Do not advance until the user confirms.
      - After confirmation: set story status to `DONE` in the story file.
   c. Execute `[CHECK-TRACEABILITY]` — ensure all terms from this story are recorded.
   d. Execute `[NEXT-STORY]` to identify the next pending story.
      - If more stories exist: set next story to `IN PROGRESS`. Report which story is next.
      - If no more stories: execute `MILESTONE-FEEDBACK` → trigger `/plan-archive <planning-id>`.
5. Update `.planning/active/README.md` to reflect new story statuses.

### Git finalize (conditional)

After step 4b, if no specific task number was given (story fully done):

6. Read `.planning/config.yml` and extract `git.base_branch` (default: `main` if absent) and `execution.requires_git` (default: `true`).
   - If `execution.requires_git` is `false`, skip steps 7–11 and note in the report that push and PR creation are disabled by `.planning/config.yml`.
7. Derive the expected branch name: `story-NN-<slug>` (the story filename without `.md`).
8. Check whether the current branch matches the story branch:
   ```bash
   git rev-parse --abbrev-ref HEAD
   ```
   - If the current branch is `<story-branch>`: proceed with push and PR (steps 9–11).
   - If not: skip git steps entirely and note in the report that the branch was not detected.
9. Sync with the base branch before pushing:
   ```bash
   git fetch origin
   git rebase origin/<base_branch>
   ```
   If the rebase has conflicts: stop, list the conflicting files, and ask the user to resolve them.
10. Push the story branch:
    ```bash
    git push -u origin <branch-name>
    ```
11. Open a pull request targeting `<base_branch>`:
    ```bash
    gh pr create \
      --title "<story-NN>: <story-name>" \
      --body "Closes story <story-id> of planning <planning-id>." \
      --base <base_branch>
    ```
    If `gh` is not available, print the push URL and instruct the user to open the PR manually.
