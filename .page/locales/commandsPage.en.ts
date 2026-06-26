const commandsPage = {
  meta: {
    title: 'Claude Commands - Planning with AI',
    description: 'Complete, detailed list of Claude Code commands included in the Planning with AI plugin.',
  },
  back: 'Back to landing',
  eyebrow: 'Claude Code reference',
  title: 'commands to plan, execute, and close work with Claude',
  intro:
    'Complete inventory of commands exposed by the plugin. Each entry summarizes arguments, expected behavior, use cases, and the source file where the implementation lives.',
  tutorialsLink: 'View tutorials',
  sourceLink: 'View skills on GitHub',
  categoriesLabel: 'Categories',
  categories: [
    {
      title: 'Initialization and capture',
      description: 'Commands for preparing the planning system and capturing ideas before expanding them.',
      commands: [
        {
          name: '/plan-init',
          usage: '/plan-init [--blank] [--force]',
          description: 'Initializes the planning system in the current project.',
          details: [
            'Copies workflows, templates, tutorials, and glossary from planning-template/.',
            'Creates the .planning/ structure, detects repository areas, and configures the git base branch.',
            'Must be run once before using the rest of the plan-* commands.',
          ],
          source: 'skills/plan-init/SKILL.md',
        },
        {
          name: '/plan-git-config',
          usage: '/plan-git-config [--base-branch <branch>]',
          description: 'View or update the git configuration for the planning system.',
          details: [
            'Useful for projects with .planning/ initialized before git configuration was introduced.',
            'Without arguments, shows the current config and offers to edit it.',
            'With --base-branch <branch>, sets the base branch for new story branches.',
          ],
          source: 'skills/plan-git-config/SKILL.md',
        },
        {
          name: '/plan-template',
          usage: '/plan-template [slug] [--interactive | --blank]',
          description: 'Generates an idea document ready to feed into /plan-new.',
          details: [
            'Saves the idea in .planning/ideas/.',
            'Captures intent, context, constraints, success criteria, and open questions.',
            'Useful for work that still needs clarification before becoming a planning.',
          ],
          source: 'skills/plan-template/SKILL.md',
        },
        {
          name: '/plan-new',
          usage: '/plan-new <NNN-slug> -- <intent> | /plan-new <NNN-slug> @<path/to/idea.md>',
          description: 'Creates a new planning entry in INITIAL state.',
          details: [
            'Accepts either quick inline capture or an enriched idea document.',
            'Creates the base planning files without expanding stories yet.',
            'Requires .planning/ to exist first.',
          ],
          source: 'skills/plan-new/SKILL.md',
        },
      ],
    },
    {
      title: 'Product backlog',
      description: 'Tools to create, enrich, and split stories or epics before execution.',
      commands: [
        {
          name: '/us-new',
          usage: '/us-new <path/to/container> [--interactive | --blank]',
          description: 'Adds a new user story to an existing container.',
          details: [
            'The container can be a directory of story files or a single markdown document.',
            'Respects the format and conventions it finds in the project.',
            'Updates indexes when applicable.',
          ],
          source: 'skills/us-new/SKILL.md',
        },
        {
          name: '/us-enrich',
          usage: '/us-enrich <path/to/story.md> | <story-id> | <partial-filename>',
          description: 'Enriches a story with missing execution-ready sections.',
          details: [
            'Adds Definition of Done, Technical Notes, Dependencies, and Complexity when missing.',
            'Can resolve the story by path, ID, or partial filename.',
            'Reads epic context when available to keep coherence.',
          ],
          source: 'skills/us-enrich/SKILL.md',
        },
        {
          name: '/us-split',
          usage: '/us-split <path/to/story.md>',
          description: 'Splits one user story into two stories with cross-references.',
          details: [
            'Keeps the core flow in the original story.',
            'Extracts secondary or independent behavior into a new story.',
            'Leaves traceability between both pieces.',
          ],
          source: 'skills/us-split/SKILL.md',
        },
        {
          name: '/us-status',
          usage: '/us-status <path/to/container/>',
          description: 'Shows enrichment status for all stories in a container.',
          details: [
            'Detects whether each story has DoD, technical notes, and dependencies.',
            'Indicates whether it is already linked to an active planning story.',
            'Useful for preparing backlog before planning.',
          ],
          source: 'skills/us-status/SKILL.md',
        },
        {
          name: '/epic-enrich',
          usage: '/epic-enrich <path/to/epic-dir/> | <path/to/stories.md>',
          description: 'Adds new stories to an existing container by detecting gaps.',
          details: [
            'Reads current content and epic context.',
            'Identifies missing coverage, edge cases, and unrepresented dependencies.',
            'Guides adding new stories without imposing a fixed structure.',
          ],
          source: 'skills/epic-enrich/SKILL.md',
        },
        {
          name: '/plan-from-epic',
          usage: '/plan-from-epic <NNN> <path/to/container> [--filter field=value]',
          description: 'Generates a complete active planning from a story container.',
          details: [
            'Converts each story into an executable story.',
            'Inherits acceptance criteria and Definition of Done as story done criteria.',
            'Acts as the bridge between product backlog and technical execution.',
          ],
          source: 'skills/plan-from-epic/SKILL.md',
        },
      ],
    },
    {
      title: 'Expansion and preparation',
      description: 'Commands that turn an initial idea into stories and tasks ready to execute.',
      commands: [
        {
          name: '/plan-expand',
          usage: '/plan-expand <NNN-slug>',
          description: 'Advances a planning from INITIAL to EXPANSION.',
          details: [
            'Fills 01-expansion.md with stories, dependencies, and success criteria.',
            'Creates story files under 02-deepening/.',
            'Moves the planning to active/ and updates indexes.',
          ],
          source: 'skills/plan-expand/SKILL.md',
        },
        {
          name: '/plan-atomize',
          usage: '/plan-atomize <NNN-slug> [story-NN]',
          description: 'Decomposes a story into atomic tasks.',
          details: [
            'Creates one file per task with technical design, implementation steps, tests, and done criteria.',
            'Can apply to a specific story or the whole planning.',
            'Used after expansion and before execution when more granularity is needed.',
          ],
          source: 'skills/plan-atomize/SKILL.md',
        },
        {
          name: '/plan-task-validate',
          usage: '/plan-task-validate <NNN-slug> [story-NN] [task-NN]',
          description: 'Audits atomic tasks against the atomicity checklist.',
          details: [
            'Read-only command.',
            'Validates one task, one story, or all atomized stories.',
            'Compares tasks with the story index and atomicity criteria.',
          ],
          source: 'skills/plan-task-validate/SKILL.md',
        },
      ],
    },
    {
      title: 'Execution and closure',
      description: 'Core commands to execute stories, close tasks, and archive finished work.',
      commands: [
        {
          name: '/plan-task',
          usage: '/plan-task <NNN-slug> <story-NN> <task-NN>',
          description: 'Executes one atomic task.',
          details: [
            'Follows the task technical design and applies implementation and tests.',
            'Marks the task DONE and commits with conventional commit format (feat/fix/refactor/docs/…).',
            'Can trigger task-level documentation.',
          ],
          source: 'skills/plan-task/SKILL.md',
        },
        {
          name: '/plan-story',
          usage: '/plan-story <NNN-slug> <story-NN>',
          description: 'Executes all tasks inside a story.',
          details: [
            'Creates a branch from the configured base, executes each task with a conventional commit.',
            'When done: rebases, pushes, and opens a PR toward the base branch.',
            'Main story-based execution command.',
          ],
          source: 'skills/plan-story/SKILL.md',
        },
        {
          name: '/plan-done',
          usage: '/plan-done <NNN-slug> <story-NN> [task-N]',
          description: 'Marks one task or a whole story as done.',
          details: [
            'Checks completion criteria before advancing.',
            'When closing a full story: pushes and opens a PR if the story branch is active.',
            'Advances the planning when all stories are complete.',
          ],
          source: 'skills/plan-done/SKILL.md',
        },
        {
          name: '/plan-validate',
          usage: '/plan-validate [NNN-slug]',
          description: 'Validates structural integrity for one or all plannings.',
          details: [
            'Checks file locations, story consistency, workflows, dependencies, and done criteria.',
            'Includes validations for atomized task files.',
            'Useful audit before closing or archiving.',
          ],
          source: 'skills/plan-validate/SKILL.md',
        },
        {
          name: '/plan-archive',
          usage: '/plan-archive <NNN-slug>',
          description: 'Audits a completed planning and moves it to finished/.',
          details: [
            'Runs AUDIT-PLANNING before moving files.',
            'Preserves traceability for finished work.',
            'Closes the planning lifecycle.',
          ],
          source: 'skills/plan-archive/SKILL.md',
        },
      ],
    },
    {
      title: 'Mid-execution adjustments',
      description: 'Operations for adapting an active planning when story changes or ambiguity appears.',
      commands: [
        {
          name: '/plan-enrich-epic',
          usage: '/plan-enrich-epic <NNN-slug>',
          description: 'Adds new stories to an active planning.',
          details: [
            'Used when missing coverage appears after initial expansion.',
            'Works on plannings in EXPANSION or DEEPENING.',
            'Keeps story files and indexes coherent.',
          ],
          source: 'skills/plan-enrich-epic/SKILL.md',
        },
        {
          name: '/plan-enrich-story',
          usage: '/plan-enrich-story <NNN-slug> <story-NN>',
          description: 'Deepens an underspecified, ambiguous, or incomplete story.',
          details: [
            'Does not change story status.',
            'Adds enough detail to execute with less uncertainty.',
            'Useful when the story exists but lacks criteria or context.',
          ],
          source: 'skills/plan-enrich-story/SKILL.md',
        },
        {
          name: '/plan-split-story',
          usage: '/plan-split-story <NNN-slug> <story-NN>',
          description: 'Splits an oversized story into smaller stories.',
          details: [
            'Replaces the original story with two or more focused stories.',
            'Updates 01-expansion.md and files under 02-deepening/.',
            'Useful when a story mixes responsibilities or exceeds executable size.',
          ],
          source: 'skills/plan-split-story/SKILL.md',
        },
        {
          name: '/plan-merge',
          usage: '/plan-merge <NNN-source> <story-NN> <NNN-target>',
          description: 'Moves a story from one active planning to another.',
          details: [
            'Updates both 01-expansion.md files.',
            'Relocates the story file.',
            'Preserves atomized task folders when present.',
          ],
          source: 'skills/plan-merge/SKILL.md',
        },
        {
          name: '/plan-story-skip',
          usage: '/plan-story-skip <NNN-slug> <story-NN> [-- reason]',
          description: 'Marks a story SKIPPED without executing it.',
          details: [
            'Useful when the story no longer applies after requirement changes.',
            'Allows a planning to close without forcing obsolete work.',
            'Records a reason when provided.',
          ],
          source: 'skills/plan-story-skip/SKILL.md',
        },
        {
          name: '/plan-rollback',
          usage: '/plan-rollback <NNN-slug> <story-NN>',
          description: 'Reverts a story from DONE back to TODO.',
          details: [
            'Used when an execution left code in a bad state and must be rerun.',
            'Can remove the associated atomized task folder.',
            'Prepares the story for controlled re-execution.',
          ],
          source: 'skills/plan-rollback/SKILL.md',
        },
        {
          name: '/plan-retry',
          usage: '/plan-retry <NNN-slug>',
          description: 'Retries all BLOCKED stories in a planning.',
          details: [
            'Resets blocked stories to TODO.',
            'Re-runs plan-story for them.',
            'Should be used after resolving the external or technical blocker.',
          ],
          source: 'skills/plan-retry/SKILL.md',
        },
      ],
    },
    {
      title: 'Status, reports, and reuse',
      description: 'Queries, executive reports, history, export, and global diagnostics.',
      commands: [
        {
          name: '/plan-status',
          usage: '/plan-status',
          description: 'Shows current state for all plannings.',
          details: [
            'Lists active plannings and their stories.',
            'Helps decide the next command to run.',
            'Operates on the .planning/ system.',
          ],
          source: 'skills/plan-status/SKILL.md',
        },
        {
          name: '/plan-health',
          usage: '/plan-health',
          description: 'Scans all of .planning/ for structural anomalies.',
          details: [
            'Detects duplicate IDs, orphan files, stale plannings, and inconsistent indexes.',
            'Broader than plan-validate because it checks the whole system.',
            'Produces a global health report.',
          ],
          source: 'skills/plan-health/SKILL.md',
        },
        {
          name: '/plan-history',
          usage: '/plan-history <NNN-slug>',
          description: 'Shows the status-change timeline for a planning.',
          details: [
            'Extracts transitions from git history.',
            'Helps reconstruct progress, blockers, and closures.',
            'Produces a temporal view by planning.',
          ],
          source: 'skills/plan-history/SKILL.md',
        },
        {
          name: '/plan-report',
          usage: '/plan-report <NNN-slug>',
          description: 'Generates an executive summary of the planning.',
          details: [
            'Includes objective, story progress, technical decisions, duration, and next steps.',
            'Useful for communicating status outside the technical team.',
            'Also summarizes open questions when present.',
          ],
          source: 'skills/plan-report/SKILL.md',
        },
        {
          name: '/plan-standup',
          usage: '/plan-standup <NNN-slug>',
          description: 'Generates standup text for a planning.',
          details: [
            'Summarizes what was completed since yesterday.',
            'Indicates what is in progress today.',
            'Exposes current blockers.',
          ],
          source: 'skills/plan-standup/SKILL.md',
        },
        {
          name: '/plan-export',
          usage: '/plan-export <NNN-slug> [--format pr|tickets|markdown]',
          description: 'Exports a planning as a formatted document.',
          details: [
            'Can generate PR description, ticket list, or standalone markdown.',
            'Includes stories, done criteria, open questions, and references.',
            'Read-only over the planning.',
          ],
          source: 'skills/plan-export/SKILL.md',
        },
        {
          name: '/plan-clone',
          usage: '/plan-clone <NNN-source-slug> <NNN-target-slug>',
          description: 'Clones a planning with a new ID.',
          details: [
            'Copies the story structure.',
            'Resets every status to TODO.',
            'Useful for repeating a proven pattern in another context.',
          ],
          source: 'skills/plan-clone/SKILL.md',
        },
      ],
    },
    {
      title: 'Generated documentation',
      description: 'Commands for producing documentation from completed planning artifacts.',
      commands: [
        {
          name: '/doc-generate',
          usage: '/doc-generate <NNN-slug> [<story-NN> [<task-NN>]]',
          description: 'Generates documentation from planning artifacts.',
          details: [
            'Can work at task, story, or planning level.',
            'Produces inline docs, ADRs, changelogs, or user guides based on area and level.',
            'Detects the affected area before deciding the documentation type.',
          ],
          source: 'skills/doc-generate/SKILL.md',
        },
        {
          name: '/doc-task',
          usage: '/doc-task <NNN-slug> <story-NN> <task-NN>',
          description: 'Generates documentation for a completed atomic task.',
          details: [
            'Thin wrapper around doc-generate.',
            'Invoked automatically from plan-task when applicable.',
            'Produces inline documentation or an ADR depending on the story area.',
          ],
          source: 'skills/doc-task/SKILL.md',
        },
        {
          name: '/doc-story',
          usage: '/doc-story <NNN-slug> <story-NN>',
          description: 'Generates documentation for a completed story.',
          details: [
            'Thin wrapper around doc-generate.',
            'Can generate a changelog, user guide, or consolidated ADR.',
            'Integrates into story closure.',
          ],
          source: 'skills/doc-story/SKILL.md',
        },
      ],
    },
    {
      title: 'Release planning',
      description: 'Commands to manage releases: group plannings under semantic versions and control their lifecycle.',
      commands: [
        {
          name: '/release-init',
          usage: '/release-init',
          description: 'Initializes .releases/ for release management. Run once, independent of /plan-init.',
          details: [
            'Creates the .releases/ directory and its index README.',
            'Opt-in: not every project needs release management.',
            'Prerequisite for all other release-* commands.',
          ],
          source: 'skills/release-init/SKILL.md',
        },
        {
          name: '/release-new',
          usage: '/release-new <vX.Y.Z> -- <purpose>',
          description: 'Creates a new release in DRAFT status with a semantic version.',
          details: [
            'Generates a release file with version, target period, and description.',
            'Initial state: DRAFT — no plannings assigned yet.',
            'Requires /release-init first.',
          ],
          source: 'skills/release-new/SKILL.md',
        },
        {
          name: '/release-add',
          usage: '/release-add <vX.Y.Z> <NNN-slug> [<NNN-slug> ...]',
          description: 'Adds one or more plannings to an existing release.',
          details: [
            'Reads summaries and live statuses from .planning/ automatically.',
            'Updates the included plannings table in the release file.',
            'Accepts multiple plannings in a single command.',
          ],
          source: 'skills/release-add/SKILL.md',
        },
        {
          name: '/release-remove',
          usage: '/release-remove <vX.Y.Z> <NNN-slug>',
          description: 'Removes a planning from a release.',
          details: [
            'Requires explicit confirmation if the release has already shipped.',
            'Reindexes rows and updates the README index.',
            'Does not delete the planning — only unlinks it from the release.',
          ],
          source: 'skills/release-remove/SKILL.md',
        },
        {
          name: '/release-status',
          usage: '/release-status [<vX.Y.Z>] [--mark-planned | --mark-in-progress | --mark-blocked | --mark-released | --mark-cancelled]',
          description: 'Shows live status of all releases or one in detail.',
          details: [
            'Reads current planning states from .planning/ — not from cached values.',
            'No arguments: summary table of all releases.',
            'With --mark-* flag: transitions the release to PLANNED, IN PROGRESS, BLOCKED, RELEASED, or CANCELLED.',
          ],
          source: 'skills/release-status/SKILL.md',
        },
      ],
    },
    {
      title: 'Autonomous pipeline',
      description: 'Higher-level commands for delegating the full flow to specialized agents.',
      commands: [
        {
          name: '/plan-run',
          usage: '/plan-run [NNN-slug | "description"]',
          description: 'Runs a planning end-to-end from its current state.',
          details: [
            'Automatically detects which phase the planning is in.',
            'Shows an execution plan and asks for one confirmation.',
            'Then delegates to phase agents to plan, execute, and validate.',
          ],
          source: 'skills/plan-run/SKILL.md',
        },
        {
          name: '/plan-agent-plan',
          usage: '/plan-agent-plan <NNN-slug | "description">',
          description: 'Autonomous planning agent.',
          details: [
            'Creates a planning if needed.',
            'Advances from INITIAL to EXPANSION without intermediate confirmations.',
            'Prepares the base that later agents execute.',
          ],
          source: 'skills/plan-agent-plan/SKILL.md',
        },
        {
          name: '/plan-agent-execute',
          usage: '/plan-agent-execute <NNN-slug>',
          description: 'Pending-story execution agent.',
          details: [
            'Atomizes and executes independent stories in parallel using subagents.',
            'Respects dependency order.',
            'Focuses on advancing pending planning work.',
          ],
          source: 'skills/plan-agent-execute/SKILL.md',
        },
        {
          name: '/plan-agent-validate',
          usage: '/plan-agent-validate <NNN-slug>',
          description: 'Validation and closure agent.',
          details: [
            'Runs plan-validate.',
            'Marks done and archives if all stories pass.',
            'Stops without archiving if it finds issues.',
          ],
          source: 'skills/plan-agent-validate/SKILL.md',
        },
      ],
    },
  ],
}

export default commandsPage
