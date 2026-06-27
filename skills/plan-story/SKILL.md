---
name: plan-story
description: Execute all tasks within a story, following the GENERATE-DOCUMENT workflow for each task.
argument-hint: <NNN-slug> <story-NN>  (e.g. 001-user-auth-api story-01)
allowed-tools: [Read, Write, Edit, Bash, Glob]
---

Execute all tasks within a story, following the GENERATE-DOCUMENT workflow for each task.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/GENERATE-DOCUMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/EXECUTE-STORY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-PHASE-CONTEXT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN` (e.g. `001-user-auth-api story-01`)

## Steps

### Git pre-flight

Before executing any story work:

0. Read `.planning/config.yml` and extract `git.base_branch` (default: `main` if file or key is absent), `project.type` (default: `software`), `execution.requires_git` (default: `true`), and `software.smoke_tests_file` (default: `SMOKE-TESTS.md`).
   - If `execution.requires_git` is `false`, skip the remaining Git pre-flight steps and continue directly to story execution.

0a. **Story context check:** If `execution.requires_git` is `true`, execute `[CHECK-STORY-CONTEXT]`.
   - If **ABORT**: stop immediately; report that the user chose to stay on the current story branch.
   - If **STASHED**, **COMMITTED**, **COMMITTED_PUSHED**, or **STANDBY**: continue to step 1.
   - If **OK** (no conflicting story branch): continue to step 1.

1. Derive the branch name from the story filename: the story file is `story-NN-<slug>.md` → branch name is `story-NN-<slug>` (the filename without `.md`).
2. Check for an existing local branch:
   ```bash
   git branch --list <branch-name>
   ```
   - If the branch already exists: ask whether to resume on it (`git checkout <branch-name>`) or abort. Do not recreate it.
   - If it does not exist: proceed.
3. Sync the base branch and create the story branch:
   ```bash
   git fetch origin
   git checkout <base_branch>
   git pull origin <base_branch>
   git checkout -b <branch-name>
   ```
   If any step fails, stop and report the error before touching any story files.

---

1. Parse `$ARGUMENTS` to extract: planning id and story id.
2. Read `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. If it doesn't exist, stop and report.
3. Read the story file completely: tasks list, done criteria, repository area, and workflow type. Check whether the story is **atomized**: a folder `02-deepening/<story-id>-*/` containing `task-NN-*.md` files.
3b. **Task file pre-flight:** For each row in the `## Tasks` table, verify that its `task-NN-*.md` file exists under the story subfolder. If any file is missing:
    - Create the story subfolder if it doesn't exist yet.
    - Generate the missing `task-NN-slug.md` from `_template/02-deepening/task-NN-name.md`, filling all sections (Objective, Technical Design, Implementation Steps, Verification, Software Smoke Test Check when `project.type: software`, Done Criteria) using the story file, `00-initial.md`, and `01-expansion.md` as context.
    - Update the story's `## Tasks` table so each task name links to its file.
    - Do not proceed to step 4 until all task files exist.
4. Execute `[CHECK-PHASE-CONTEXT]` for the story's area — verify required `docs/` contracts exist and have been read.
   - If `MISSING`: stop and list which `docs/` files must be read first.
5. Set story status to `IN PROGRESS` in the story file.
6. For each task in the story (in order):
   - **If the story is atomized:** execute each `task-NN-*.md` in dependency order following the full `/plan-task` procedure, including readiness checks, technical design, implementation steps, verification, software smoke tests, human developer code review, correction loop, DONE marking, and post-approval task commit. Skip tasks already `DONE`.
   - **If not atomized**, for each row in the `## Tasks` table:
     a. Announce the task being worked on.
     b. Execute the task using the workflow type specified (GENERATE-DOCUMENT, or other).
     c. Execute `[CHECK-AGNOSTIC-BOUNDARY]` — verify output is consistent with `docs/` contracts.
     d. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.
     e. Mark the task as done (`[x]`) in the story file.
7. After all tasks: execute `[EXECUTE-STORY]` to verify done criteria are met.
   - If `BLOCKED`: list unmet criteria and stop.
   - If `DONE`: before setting the status or pushing/opening a PR, present:
     - the full `## Done Criteria` section of the story file
     - all task verification summaries
     - for software projects, smoke-test evidence from the final task run or a fresh story-level run if the task evidence is stale
     - the commits that will be pushed

     Then ask explicitly:

     > "All tasks are complete. Please perform the final human developer code review for this story. Reply with **approved** to mark the story DONE, push the branch, and create the PR, or list the requested corrections."

   Wait for approval before setting story status to `DONE` in the story file.

   If the reviewer requests corrections:
   - implement the corrections
   - rerun relevant task/story verification
   - for software projects, rerun the smoke test plan when code, build, dependencies, migrations, startup, or configuration changed
   - present the updated review summary again
   - wait for a new human review

   Do not mark the story `DONE`, push, or create a PR before approval.
7b. Invoke `/doc-story <planning-id> <story-id>`. If the story area is DO or W this is a silent no-op. Include any files written in the final report.

### Git finalize

After the story is marked DONE and the human developer review has approved push/PR:

8. If `execution.requires_git` is `false`, skip Git finalize and report that branch, push, and PR creation were disabled by `.planning/config.yml`.

9. Sync with the base branch before pushing:
   ```bash
   git fetch origin
   git rebase origin/<base_branch>
   ```
   If the rebase has conflicts: stop, list the conflicting files, and ask the user to resolve them before continuing.
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

12. Report: story completed, N tasks done, done criteria satisfied, doc files written (from step 7b), branch `<branch-name>` pushed, PR URL when git is enabled.

> To find the next story, use `/plan-status`, then run `/plan-story <planning-id> <next-story-id>`.
> To decompose a story into atomic task files before executing it, use `/plan-atomize <planning-id> <story-id>`. To execute a single atomic task, use `/plan-task`.
