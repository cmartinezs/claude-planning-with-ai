---
name: us-split
description: Split a user story into two — the original keeps its core flow, a new story gets the extracted behaviour. Both get cross-references.
argument-hint: <path/to/story.md>
allowed-tools: [Read, Write, Bash, Glob]
---

Split an oversized or mixed-concern user story into two focused stories. The counterpart of `/plan-split-story` at the product backlog layer.

## Arguments

`$ARGUMENTS` — path to the story file to split (e.g. `docs/product/user-stories/epic-01-auth/03-teacher-login.md`)

## Steps

1. Read the story file at `$ARGUMENTS`. If not found, stop and report.

2. Identify the story's container directory (the parent directory of the file). Look for a container index (`README.md` or a file listing stories) to understand existing IDs and naming conventions.

3. Analyse the story content and identify the natural split point — sections of the Acceptance Criteria, Description, or Technical Notes that address a distinct concern from the rest.

4. Ask the user: "I suggest splitting into:
   - **Story A (keep):** <summary of what stays>
   - **Story B (new):** <summary of what goes to the new story>
   Split point: <which AC items / sections move>
   Confirm? (yes / describe a different split)"
   Wait for confirmation before writing anything.

5. Once confirmed:
   a. Determine the new story's filename: follow the container's numbering convention (e.g., if the highest story is `05-*.md`, new one is `06-*.md`). Derive a kebab-case name from the new story's topic.
   b. Create the new story file at `<container>/<new-number>-<slug>.md`. Populate it with:
      - The extracted AC items, description sections, or Technical Notes.
      - Copy the header fields (Epic, Priority, etc.) from the original, adjusting the title.
      - Add: `Split from: [<original-filename>](<original-filename>)`.
   c. Update the original story file:
      - Remove the extracted content.
      - Add a cross-reference at the bottom: `Related: [<new-story-title>](<new-filename>)`.

6. If the container has an index (`README.md` with a story table): add an entry for the new story. If no index exists, skip this step.

7. Report: two story files now exist. List which AC items stayed and which moved. If either story now looks underspecified, suggest `/us-enrich <path>`.

> Does NOT touch the `.planning/` system. If this story is already linked to a planning scope, you may need to run `/plan-enrich-epic` to add a scope for the new story.
