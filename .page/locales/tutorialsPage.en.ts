const tutorialsPage = {
  meta: {
    title: 'Tutorials - Planning with AI',
    description:
      'Scenario-based tutorials for using Planning with AI in Claude Code: epics, backlog, execution, adjustments, and autonomous agents.',
  },
  back: 'Back to landing',
  eyebrow: 'Scenario guides',
  title: 'Tutorials available for each real planning flow',
  intro:
    'The template tutorials are available as work routes: from an existing epic, from scratch, backlog refinement, mid-execution adjustments, and autonomous pipeline with agents.',
  commandsLink: 'View commands',
  sourceLink: 'View sources on GitHub',
  whenLabel: 'When to use it',
  outcomeLabel: 'Outcome',
  tutorials: [
    {
      id: 'flow-a',
      title: 'Flow A - Plan from an existing epic',
      when:
        'Use this when an epic already has defined stories and you want to turn it into an executable planning.',
      outcome:
        'An active planning where each epic story becomes a scope with inherited closure criteria.',
      steps: [
        'Review the epic and its current stories.',
        'Enrich stories that are thin or missing a Definition of Done.',
        'Detect epic gaps and add missing stories when needed.',
        'Create the active planning from the story container.',
        'Execute scopes, close progress, and archive when finished.',
      ],
      commands: ['/us-status', '/us-enrich', '/epic-enrich', '/plan-from-epic', '/plan-scope', '/plan-done', '/plan-archive'],
      source: 'planning-template/TUTORIAL/flow-01-epic.md',
    },
    {
      id: 'flow-b',
      title: 'Flow B - Planning from scratch',
      when:
        'Use this for transversal, technical, or infrastructure work that does not belong to a product user story.',
      outcome:
        'An initial idea turns into executable scopes inside .planning/active/.',
      steps: [
        'Capture the idea in interactive mode or as a blank template.',
        'Create the planning from the idea document or an inline intent.',
        'Expand the idea to produce scopes, dependencies, and success criteria.',
        'Atomize scopes if you need smaller technical tasks.',
        'Execute and close each scope.',
      ],
      commands: ['/plan-template', '/plan-new', '/plan-expand', '/plan-atomize', '/plan-task', '/plan-scope', '/plan-done'],
      source: 'planning-template/TUTORIAL/flow-02-general.md',
    },
    {
      id: 'flow-c',
      title: 'Flow C - Refine the product backlog',
      when:
        'Use this when you do not want to execute yet; the goal is to improve backlog quality before planning.',
      outcome:
        'Clearer stories with DoD, technical notes, dependencies, and gap coverage before moving into planning.',
      steps: [
        'Identify incomplete stories inside the container.',
        'Enrich stories one by one.',
        'Add new stories when the epic does not cover required behavior.',
        'Split oversized stories before estimating or planning.',
        'Review container status to confirm it is ready.',
      ],
      commands: ['/us-status', '/us-enrich', '/us-new', '/us-split', '/epic-enrich'],
      source: 'planning-template/TUTORIAL/flow-03-backlog.md',
    },
    {
      id: 'flow-d',
      title: 'Flow D - Adjust during execution',
      when:
        'Use this when a planning is already active and new work, ambiguity, oversizing, or scope changes appear.',
      outcome:
        'The active planning adapts without losing traceability or forcing obsolete work.',
      steps: [
        'Determine whether the change is execution-only or also needs product backlog tracking.',
        'Add new scopes to the active planning.',
        'Deepen incomplete scopes before executing them.',
        'Split oversized scopes.',
        'Skip, roll back, or retry scopes depending on the change.',
      ],
      commands: ['/plan-enrich-epic', '/plan-enrich-story', '/plan-split-story', '/plan-scope-skip', '/plan-rollback', '/plan-retry'],
      source: 'planning-template/TUTORIAL/flow-04-mid-execution.md',
    },
    {
      id: 'flow-e',
      title: 'Flow E - Autonomous pipeline with agents',
      when:
        'Use this when you want to execute a planning end-to-end with minimal manual intervention.',
      outcome:
        'One command detects state, asks for one confirmation, and delegates planning, execution, and validation to specialized agents.',
      steps: [
        'Run from a new description or an existing planning.',
        'Review the proposed execution plan.',
        'Confirm once.',
        'Let the planning agent create or expand.',
        'Let the execution agent atomize and run scopes, and the closure agent validate and archive.',
      ],
      commands: ['/plan-run', '/plan-agent-plan', '/plan-agent-execute', '/plan-agent-validate'],
      source: 'planning-template/TUTORIAL/flow-05-autonomous.md',
    },
    {
      id: 'reference',
      title: 'Quick command reference',
      when:
        'Use this when you already know the flow and need to find the right command for a system layer.',
      outcome:
        'Compact command map for product, bridge, planning, execution, adjustments, and autonomous pipeline.',
      steps: [
        'Identify whether you are working in product backlog or .planning/.',
        'Choose the command for the lifecycle phase.',
        'Check expected arguments before running it.',
        'Use /plan-status or /plan-health when the current state is unclear.',
      ],
      commands: ['/us-new', '/us-enrich', '/plan-from-epic', '/plan-new', '/plan-expand', '/plan-status', '/plan-health', '/plan-run'],
      source: 'planning-template/TUTORIAL/reference.md',
    },
  ],
}

export default tutorialsPage
