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
            'Creates the .planning/ structure and detects repository areas for traceability.',
            'Must be run once before using the rest of the plan-* commands.',
          ],
          source: 'skills/plan-init/SKILL.md',
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
            'Creates the base planning files without expanding scopes yet.',
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
            'Indicates whether it is already linked to an active planning scope.',
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
            'Converts each story into an executable scope.',
            'Inherits acceptance criteria and Definition of Done as scope done criteria.',
            'Acts as the bridge between product backlog and technical execution.',
          ],
          source: 'skills/plan-from-epic/SKILL.md',
        },
      ],
    },
    {
      title: 'Expansion and preparation',
      description: 'Commands that turn an initial idea into scopes and tasks ready to execute.',
      commands: [
        {
          name: '/plan-expand',
          usage: '/plan-expand <NNN-slug>',
          description: 'Advances a planning from INITIAL to EXPANSION.',
          details: [
            'Fills 01-expansion.md with scopes, dependencies, and success criteria.',
            'Creates scope files under 02-deepening/.',
            'Moves the planning to active/ and updates indexes.',
          ],
          source: 'skills/plan-expand/SKILL.md',
        },
        {
          name: '/plan-atomize',
          usage: '/plan-atomize <NNN-slug> [scope-NN]',
          description: 'Decomposes a scope into atomic tasks.',
          details: [
            'Creates one file per task with technical design, implementation steps, tests, and done criteria.',
            'Can apply to a specific scope or the whole planning.',
            'Used after expansion and before execution when more granularity is needed.',
          ],
          source: 'skills/plan-atomize/SKILL.md',
        },
        {
          name: '/plan-task-validate',
          usage: '/plan-task-validate <NNN-slug> [scope-NN] [task-NN]',
          description: 'Audits atomic tasks against the atomicity checklist.',
          details: [
            'Read-only command.',
            'Validates one task, one scope, or all atomized scopes.',
            'Compares tasks with the scope index and atomicity criteria.',
          ],
          source: 'skills/plan-task-validate/SKILL.md',
        },
      ],
    },
    {
      title: 'Execution and closure',
      description: 'Core commands to execute scopes, close tasks, and archive finished work.',
      commands: [
        {
          name: '/plan-task',
          usage: '/plan-task <NNN-slug> <scope-NN> <task-NN>',
          description: 'Executes one atomic task.',
          details: [
            'Follows the task technical design and applies implementation and tests.',
            'Marks the task DONE in both the task file and the scope index.',
            'Can trigger task-level documentation.',
          ],
          source: 'skills/plan-task/SKILL.md',
        },
        {
          name: '/plan-scope',
          usage: '/plan-scope <NNN-slug> <scope-NN>',
          description: 'Executes all tasks inside a scope.',
          details: [
            'Follows the GENERATE-DOCUMENT workflow for each task.',
            'Works on a specific active planning scope.',
            'Main block-based execution command.',
          ],
          source: 'skills/plan-scope/SKILL.md',
        },
        {
          name: '/plan-done',
          usage: '/plan-done <NNN-slug> <scope-NN> [task-N]',
          description: 'Marks one task or a whole scope as done.',
          details: [
            'Checks completion criteria before advancing.',
            'Can close a specific task or a complete scope.',
            'Advances the planning when all scopes are complete.',
          ],
          source: 'skills/plan-done/SKILL.md',
        },
        {
          name: '/plan-validate',
          usage: '/plan-validate [NNN-slug]',
          description: 'Validates structural integrity for one or all plannings.',
          details: [
            'Checks file locations, scope consistency, workflows, dependencies, and done criteria.',
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
      description: 'Operations for adapting an active planning when scope changes or ambiguity appears.',
      commands: [
        {
          name: '/plan-enrich-epic',
          usage: '/plan-enrich-epic <NNN-slug>',
          description: 'Adds new scopes to an active planning.',
          details: [
            'Used when missing coverage appears after initial expansion.',
            'Works on plannings in EXPANSION or DEEPENING.',
            'Keeps scope files and indexes coherent.',
          ],
          source: 'skills/plan-enrich-epic/SKILL.md',
        },
        {
          name: '/plan-enrich-story',
          usage: '/plan-enrich-story <NNN-slug> <scope-NN>',
          description: 'Deepens an underspecified, ambiguous, or incomplete scope.',
          details: [
            'Does not change scope status.',
            'Adds enough detail to execute with less uncertainty.',
            'Useful when the scope exists but lacks criteria or context.',
          ],
          source: 'skills/plan-enrich-story/SKILL.md',
        },
        {
          name: '/plan-split-story',
          usage: '/plan-split-story <NNN-slug> <scope-NN>',
          description: 'Splits an oversized scope into smaller scopes.',
          details: [
            'Replaces the original scope with two or more focused scopes.',
            'Updates 01-expansion.md and files under 02-deepening/.',
            'Useful when a scope mixes responsibilities or exceeds executable size.',
          ],
          source: 'skills/plan-split-story/SKILL.md',
        },
        {
          name: '/plan-merge',
          usage: '/plan-merge <NNN-source> <scope-NN> <NNN-target>',
          description: 'Moves a scope from one active planning to another.',
          details: [
            'Updates both 01-expansion.md files.',
            'Relocates the scope file.',
            'Preserves atomized task folders when present.',
          ],
          source: 'skills/plan-merge/SKILL.md',
        },
        {
          name: '/plan-scope-skip',
          usage: '/plan-scope-skip <NNN-slug> <scope-NN> [-- reason]',
          description: 'Marks a scope SKIPPED without executing it.',
          details: [
            'Useful when the scope no longer applies after requirement changes.',
            'Allows a planning to close without forcing obsolete work.',
            'Records a reason when provided.',
          ],
          source: 'skills/plan-scope-skip/SKILL.md',
        },
        {
          name: '/plan-rollback',
          usage: '/plan-rollback <NNN-slug> <scope-NN>',
          description: 'Reverts a scope from DONE back to TODO.',
          details: [
            'Used when an execution left code in a bad state and must be rerun.',
            'Can remove the associated atomized task folder.',
            'Prepares the scope for controlled re-execution.',
          ],
          source: 'skills/plan-rollback/SKILL.md',
        },
        {
          name: '/plan-retry',
          usage: '/plan-retry <NNN-slug>',
          description: 'Retries all BLOCKED scopes in a planning.',
          details: [
            'Resets blocked scopes to TODO.',
            'Re-runs plan-scope for them.',
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
            'Lists active plannings and their scopes.',
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
            'Includes objective, scope progress, technical decisions, duration, and next steps.',
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
            'Includes scopes, done criteria, open questions, and references.',
            'Read-only over the planning.',
          ],
          source: 'skills/plan-export/SKILL.md',
        },
        {
          name: '/plan-clone',
          usage: '/plan-clone <NNN-source-slug> <NNN-target-slug>',
          description: 'Clones a planning with a new ID.',
          details: [
            'Copies the scope structure.',
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
          usage: '/doc-generate <NNN-slug> [<scope-NN> [<task-NN>]]',
          description: 'Generates documentation from planning artifacts.',
          details: [
            'Can work at task, scope, or planning level.',
            'Produces inline docs, ADRs, changelogs, or user guides based on area and level.',
            'Detects the affected area before deciding the documentation type.',
          ],
          source: 'skills/doc-generate/SKILL.md',
        },
        {
          name: '/doc-task',
          usage: '/doc-task <NNN-slug> <scope-NN> <task-NN>',
          description: 'Generates documentation for a completed atomic task.',
          details: [
            'Thin wrapper around doc-generate.',
            'Invoked automatically from plan-task when applicable.',
            'Produces inline documentation or an ADR depending on the scope area.',
          ],
          source: 'skills/doc-task/SKILL.md',
        },
        {
          name: '/doc-scope',
          usage: '/doc-scope <NNN-slug> <scope-NN>',
          description: 'Generates documentation for a completed scope.',
          details: [
            'Thin wrapper around doc-generate.',
            'Can generate a changelog, user guide, or consolidated ADR.',
            'Integrates into scope closure.',
          ],
          source: 'skills/doc-scope/SKILL.md',
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
          description: 'Pending-scope execution agent.',
          details: [
            'Atomizes and executes independent scopes in parallel using subagents.',
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
            'Marks done and archives if all scopes pass.',
            'Stops without archiving if it finds issues.',
          ],
          source: 'skills/plan-agent-validate/SKILL.md',
        },
      ],
    },
  ],
}

export default commandsPage
