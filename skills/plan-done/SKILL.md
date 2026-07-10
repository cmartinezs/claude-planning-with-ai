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
2. Read `.planning/active/<planning-id>/02-deepening/<story-id>-*.md` and `.planning/config.yml` if present. Extract `project.type`, `execution.requires_git`, and `software.smoke_tests_file`.
3. If a specific task number was given: find that task in the checklist and mark it `[x]`. Report and stop.
4. If no task number given (mark all):
   a. Mark all tasks `[x]` in the story file.
   b. Execute `[EXECUTE-STORY]` — verify done criteria are satisfied.
      - If `BLOCKED`: execute `[RECORD-EDGE-CASE]` in `RETROSPECTIVE-RAW.md` with the unmet criteria, report them, and do NOT advance.
      - If `DONE`: present the full `## Done Criteria` section of the story file to the user. For `project.type: software`, also present the latest available smoke-test evidence: supporting services, build/start command, connectivity or schema result, and smoke checks. If that evidence is missing or stale, rerun the smoke test plan before asking for approval.

        > "The system verified the done criteria automatically. Please open the story file and review the actual codebase before this story is marked DONE:"

        List every criterion with its current `[x]` / `[ ]` state. Then ask:

        > "Reply with **approved** to finalize the story after confirming all task PRs are merged into the story branch, or list the requested corrections."

        Do not advance until the user approves.

        If the reviewer requests corrections, execute `[RECORD-EDGE-CASE]` with the requested corrections, implement them in a task branch, rerun the relevant verification, rerun the smoke test plan when code, build, dependencies, migrations, startup, or configuration changed, and ask for a new human review. Do not mark the story `DONE` or open the story PR before approval.
      - After confirmation: set story status to `DONE` in the story file.
   c. Execute `[CHECK-TRACEABILITY]` — ensure all terms from this story are recorded.
   d. Execute `[NEXT-STORY]` to identify the next pending story.
      - If more stories exist: set next story to `IN PROGRESS`. Report which story is next.
      - If no more stories: execute `MILESTONE-FEEDBACK`, invoke `/plan-retrospective <planning-id>`, then trigger `/plan-archive <planning-id>`.
5. Update `.planning/active/README.md` to reflect new story statuses.

### Git finalize (conditional)

After step 4b, if no specific task number was given (story fully done), all task PRs are merged into the story branch, and the human developer review approved finalization:

6. Read `.planning/config.yml` and extract `git.base_branch` (default: `main` if absent) and `execution.requires_git` (default: `true`).
   - If `execution.requires_git` is `false`, skip steps 7–15 and note in the report that push, PR creation, and branch cleanup are disabled by `.planning/config.yml`.
7. Derive the expected branch name: `story-NN-<slug>` (the story filename without `.md`).
   - If this is a child planning running in a dedicated sibling worktree, derive `<worktree-prefix>` from the worktree directory name and prefix the branch: `<worktree-prefix>/story-NN-<slug>`.
   - Preserve an existing worktree prefix if the branch already has one. The prefix must appear before the rest of the branch name.
8. Check whether the current branch matches the story branch:
   ```bash
   git rev-parse --abbrev-ref HEAD
   ```
   - If the current branch is `<story-branch>`: proceed with task PR, branch cleanup, and story PR checks (steps 9–15).
   - If not: check out `<story-branch>` if it exists locally or on origin. If it cannot be found, skip git steps and note in the report that the story branch was not detected.
9. Verify all task PRs targeting the story branch are merged:
   ```bash
   gh pr list --base <story-branch> --state open
   ```
   If any PR is listed, stop and report it. If `gh` is not available, ask the user to confirm all task PRs have been reviewed and merged into `<story-branch>`.
10. Delete local task branches after their PRs are confirmed merged into the story branch:
   ```bash
   git checkout <story-branch>
   git pull --ff-only origin <story-branch>
   git branch -d <task-branch>
   ```
   Apply this to each local branch matching a completed task for this story, for example `<story-branch>/task-NN-<slug>` or `<worktree-prefix>/story-NN-<slug>/task-NN-<slug>` for child worktrees. If a task branch does not exist locally, skip it. Use `git branch -d` only; do not force-delete. If a local branch exists but cannot be deleted because Git does not recognize it as merged, stop and report the branch name so the user can confirm the PR merge state. Do not delete remote task branches here; that remains a PR/repository policy action.
11. Sync with the base branch before pushing:
   ```bash
   git fetch origin
   git checkout <story-branch>
   git pull --ff-only origin <story-branch>
   git rebase origin/<base_branch>
   ```
   If the rebase has conflicts: execute `[RECORD-EDGE-CASE]` with the conflicting files, then stop, list the conflicting files, and ask the user to resolve them.
12. Push the story branch:
    ```bash
    git push -u origin <story-branch>
    ```
13. Open or reuse a pull request from the story branch targeting `<base_branch>`:
    ```bash
    gh pr create \
      --title "<story-NN>: <story-name>" \
      --body "Closes story <story-id> of planning <planning-id>." \
      --base <base_branch> \
      --head <story-branch>
    ```
    If a story PR for `<story-branch>` already exists, reuse it instead of creating a duplicate. If `gh` shows that the existing story PR is already merged into `<base_branch>`, continue to local story branch cleanup in step 14. If `gh` is not available, execute `[RECORD-EDGE-CASE]` noting that PR creation or PR-state verification had to be completed manually, then print the push URL and instruct the user to open or verify the PR manually.
14. Handle story branch local cleanup:
    - If the story PR is already merged into `<base_branch>` or the user confirms it was merged manually, delete the local story branch now:
      ```bash
      git checkout <base_branch>
      git pull --ff-only origin <base_branch>
      git branch -d <story-branch>
      ```
    - If the story PR is still open, do not delete the branch yet. Report that after the PR is merged into `<base_branch>`, the local story branch must be deleted with the same commands:
      ```bash
      git checkout <base_branch>
      git pull --ff-only origin <base_branch>
      git branch -d <story-branch>
      ```
    Use `git branch -d` only; do not force-delete. If deletion fails, report that the branch is not recognized as merged locally and ask the user to confirm the story PR merge state. Do not delete the remote story branch here; that remains a PR/repository policy action.
15. Report the story PR URL/state and the story branch local cleanup status.
