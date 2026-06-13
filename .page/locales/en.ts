const en = {
  meta: {
    title: 'Planning with AI — Structured planning plugin for Claude Code',
    description:
      'Structured lifecycle planning plugin for Claude Code. Full lifecycle: idea, expansion, execution, completion and archive.',
  },
  header: {
    nav: {
      install: 'Installation',
      whatItDoes: 'What it does',
      lifecycle: 'Lifecycle',
      commands: 'Commands',
    },
  },
  hero: {
    badge: 'Official Claude Code plugin',
    titleLine1: 'Structured',
    titleHighlight: 'planning',
    titleBetween: 'for',
    titleLine2: 'your software',
    subtitle:
      'From the initial idea to the archived project. A complete lifecycle system that transforms the way you plan with Claude Code.',
    installBtn: 'Install plugin',
    demoBtn: 'See demo',
    stats: [
      { value: '5', label: 'Lifecycle states' },
      { value: '35', label: 'Commands' },
      { value: 'Markdown', label: 'Native format' },
      { value: '0', label: 'Dependencies' },
    ],
  },
  whatItDoes: {
    titlePrefix: 'What does',
    titleHighlight: 'Planning with AI',
    titleSuffix: ' do?',
    subtitle:
      'A plugin that brings structured planning to Claude Code. From the initial spark to the archived project.',
    features: [
      {
        title: 'Adapted to your project',
        description:
          'plan-init scans your repository structure and configures traceability areas automatically.',
      },
      {
        title: 'Enriched backlog',
        description: 'Add acceptance criteria, technical notes, dependencies and complexity to your stories.',
      },
      {
        title: 'Scope-based execution',
        description: 'Split work into executable scopes. Each scope is processed from start to finish.',
      },
      {
        title: 'Graduated states',
        description: 'Each plan advances through phases: INITIAL → EXPANSION → DEEPENING → COMPLETED → archive.',
      },
      {
        title: 'Mid-plan adjustments',
        description: 'Enrich, split or add scopes without losing current progress.',
      },
      {
        title: 'Automatic archiving',
        description:
          'On completion, the entire plan is audited and archived in finished/ with full traceability.',
      },
    ],
  },
  lifecycle: {
    titlePrefix: 'Complete',
    titleHighlight: 'lifecycle',
    subtitle: 'Each plan navigates through 5 states. The plugin guides every transition with specific commands.',
    stages: [
      { label: 'Idea', description: 'Capture the initial idea with /plan-new. A seed, no structure yet.' },
      {
        label: 'Expansion',
        description: 'Claude expands the idea: scopes, tasks, dependencies, success criteria.',
      },
      {
        label: 'Execution',
        description: 'Claude executes scope by scope. Each /plan-scope command advances the plan.',
      },
      {
        label: 'Completed',
        description: 'Mark scopes done with /plan-done. The plan approaches its end.',
      },
      {
        label: 'Archive',
        description: 'Final audit and archive in finished/. Everything is documented.',
      },
    ],
    statusLabel: 'Current plan state:',
    statusNote: '— live query',
  },
  commands: {
    titlePrefix: 'Essential',
    titleHighlight: 'commands',
    subtitle: '35 commands cover the entire lifecycle. No cryptic flags. No endless configuration.',
    categories: [
      {
        title: 'Initialization',
        description: 'Run once per project',
        commands: [{ cmd: '/plan-init', desc: 'Creates the .planning/ structure in the project' }],
      },
      {
        title: 'Backlog',
        description: 'Story and epic management',
        commands: [
          { cmd: '/us-new path/', desc: 'Adds a new story to a directory or file' },
          { cmd: '/us-enrich story.md', desc: 'Adds DoD, technical notes, dependencies' },
          { cmd: '/epic-enrich path/', desc: 'Detects gaps and adds new stories' },
          { cmd: '/plan-from-epic NNN path/', desc: 'Generates a full plan from an epic' },
        ],
      },
      {
        title: 'Planning',
        description: 'Create and manage plans',
        commands: [
          { cmd: '/plan-template slug', desc: 'Generates an interactive idea document' },
          { cmd: '/plan-new NNN-slug -- intent', desc: 'Creates a plan in INITIAL state' },
          { cmd: '/plan-new NNN-slug @path.md', desc: 'Creates a plan from an idea document' },
          { cmd: '/plan-expand NNN-slug', desc: 'Advances from INITIAL → EXPANSION' },
        ],
      },
      {
        title: 'Atomic tasks',
        description: 'Optional decomposition before executing',
        commands: [
          { cmd: '/plan-atomize NNN-slug scope-NN', desc: 'Decomposes a scope into atomic task files' },
          { cmd: '/plan-task NNN-slug scope-NN task-NN', desc: 'Executes a single atomic task' },
          { cmd: '/plan-task-validate NNN-slug', desc: 'Audits atomic tasks against the atomicity checklist' },
        ],
      },
      {
        title: 'Execution',
        description: 'Run and close scopes',
        commands: [
          { cmd: '/plan-scope NNN-slug scope-NN', desc: 'Runs all tasks in a scope' },
          { cmd: '/plan-done NNN-slug scope-NN', desc: 'Marks a scope as complete' },
          { cmd: '/plan-status', desc: 'Shows all active plans and their scopes' },
          { cmd: '/plan-validate', desc: 'Checks structural integrity of plannings' },
          { cmd: '/plan-archive NNN-slug', desc: 'Audits and archives in finished/' },
        ],
      },
      {
        title: 'Adjustments',
        description: 'Mid-plan modifications',
        commands: [
          { cmd: '/plan-enrich-epic NNN-slug', desc: 'Adds new scopes to an active plan' },
          { cmd: '/plan-enrich-story NNN-slug scope-NN', desc: 'Deepens an underspecified scope' },
          { cmd: '/plan-split-story NNN-slug scope-NN', desc: 'Splits an oversized scope' },
        ],
      },
      {
        title: 'Utilities',
        description: 'Recovery, reports, and reuse',
        commands: [
          { cmd: '/plan-retry NNN-slug', desc: 'Retry all BLOCKED scopes after resolving a blocker' },
          { cmd: '/plan-scope-skip NNN-slug scope-NN', desc: 'Mark a scope SKIPPED without executing it' },
          { cmd: '/plan-rollback NNN-slug scope-NN', desc: 'Revert a DONE scope to TODO for re-execution' },
          { cmd: '/plan-standup NNN-slug', desc: 'Generate standup text: yesterday / today / blockers' },
          { cmd: '/plan-report NNN-slug', desc: 'Executive summary: scopes, technical decisions, duration' },
          { cmd: '/plan-history NNN-slug', desc: 'Timeline of status changes extracted from git history' },
          { cmd: '/plan-clone NNN-slug NNN-new', desc: 'Clone a planning with all statuses reset to TODO' },
          { cmd: '/plan-export NNN-slug', desc: 'Export as PR description, tickets, or markdown' },
          { cmd: '/plan-health', desc: 'Full-system diagnostic of the .planning/ directory' },
          { cmd: '/plan-merge NNN-source scope-NN NNN-target', desc: 'Move a scope between active plannings' },
          { cmd: '/us-split story.md', desc: 'Split a story into two with cross-references' },
          { cmd: '/us-status path/', desc: 'Enrichment status of all stories in a container' },
        ],
      },
      {
        title: 'Documentation',
        description: 'Auto-generate docs from completed work',
        commands: [
          { cmd: '/doc-generate NNN [scope] [task]', desc: 'Generate inline docs, ADRs, changelogs, or user guides based on area and level' },
          { cmd: '/doc-task NNN scope-NN task-NN', desc: 'Generate task-level docs after a task is marked DONE' },
          { cmd: '/doc-scope NNN scope-NN', desc: 'Generate scope-level docs after a scope is completed' },
        ],
      },
      {
        title: 'Autonomous agents',
        description: 'Full pipeline with a single command',
        commands: [
          { cmd: '/plan-run NNN-slug', desc: 'Runs a plan end-to-end — detects state, confirms once, delegates to agents' },
          { cmd: '/plan-agent-plan NNN-slug', desc: 'Planning agent: creates and expands without interruptions' },
          { cmd: '/plan-agent-execute NNN-slug', desc: 'Execution agent: atomizes and runs scopes in parallel' },
          { cmd: '/plan-agent-validate NNN-slug', desc: 'Closing agent: validates, marks done, and archives' },
        ],
      },
    ],
    docsLink: 'See full documentation on GitHub',
  },
  installation: {
    titlePrefix: 'Install in',
    titleHighlight: '2 steps',
    subtitle: 'The plugin works with any markdown-based project. No external dependencies. No prior configuration.',
    marketplace: {
      title: 'From within Claude Code',
      description: 'Add the marketplace and install the plugin:',
    },
    terminal: {
      title: 'From your terminal',
      description: 'The same two steps using the Claude Code CLI:',
    },
    updateNote: 'To update to the latest version later:',
    firstSteps: 'First steps',
    interactive: 'interactive — run the steps in order',
    waiting: 'waiting for command...',
    workspaceProject: 'my-project',
    workspaceInitialHint: [
      '# my-project',
      '',
      'Select /plan-init to start the flow.',
      'The following steps are enabled in order.',
    ],
    steps: [
      {
        label: '/plan-init',
        desc: 'Creates .planning/ and detects project areas',
        command: '/plan-init',
        output: [
          '  ⟳ Detecting project structure...',
          '',
          '    api/    → AP  (Java/Spring Boot)',
          '    web/    → WB  (Next.js)',
          '    docs/   → DO  (Markdown)',
          '    infra/  → IN  (Terraform)',
          '',
          '  Is this configuration correct? (Enter) ✓',
          '',
          '  ✓ Areas configured: AP · WB · DO · IN',
          '  ✓ .planning/ structure created',
          '',
        ],
      },
      {
        label: '/plan-new 001-my-feature -- My feature',
        desc: 'Creates the plan in INITIAL state',
        command: '/plan-new 001-my-feature -- My feature',
        output: [
          '  ✓ Plan 001-my-feature created in INITIAL state',
          '',
          '    📁 .planning/active/001-my-feature/',
          '    ├── 📄 plan.md',
          '    └── 📄 scope-01.md',
          '',
        ],
      },
      {
        label: '/plan-expand 001-my-feature',
        desc: 'Expands the idea into executable scopes',
        command: '/plan-expand 001-my-feature',
        output: [
          '  ⟳ Expanding plan 001-my-feature with Claude...',
          '    ├── scope-01: Initial setup',
          '    ├── scope-02: Core implementation',
          '    └── scope-03: Testing and documentation',
          '',
          '  ✓ Plan expanded to 3 scopes. State → EXPANSION',
          '',
        ],
      },
      {
        label: '/plan-scope 001-my-feature scope-01',
        desc: 'Runs all tasks in the first scope',
        command: '/plan-scope 001-my-feature scope-01',
        output: [
          '  ⟳ Running scope-01: Initial setup...',
          '    ✓ directory structure created',
          '    ✓ dependencies configured',
          '    ✓ base files generated',
          '',
          '  ✓ Scope scope-01 completed successfully',
          '  ➜ Next: /plan-done 001-my-feature scope-01',
          '',
        ],
      },
    ],
    workspaceCodes: [
      [
        '| Code | Repository / Area |',
        '|------|------------------|',
        '| `AP` | `api/` — backend service |',
        '| `WB` | `web/` — frontend app |',
        '| `DO` | `docs/` — documentation |',
        '| `IN` | `infra/` — infrastructure |',
        '| `W`  | `.planning/` — meta |',
      ],
      [
        '# 001-my-feature',
        '',
        'State: INITIAL',
        '',
        '## Idea',
        'My feature pending expansion.',
      ],
      [
        '# scope-01: Initial setup',
        '',
        '- Create base structure',
        '- Configure dependencies',
        '- Prepare validations',
      ],
      [
        '# scope-01: Initial setup',
        '',
        'State: DONE',
        '',
        '- [x] directory structure created',
        '- [x] dependencies configured',
        '- [x] base files generated',
      ],
    ],
  },
  cta: {
    title: 'Plan better. Build faster.',
    titleHighlight: 'With Claude Code.',
    subtitle:
      'Planning with AI transforms how Claude Code approaches complex projects. Structure, clarity and traceability at every step.',
    installBtn: 'Install now',
    githubBtn: 'View on GitHub',
  },
  footer: {
    description: 'Structured planning plugin for Claude Code. Build projects with order and clarity.',
    groups: [
      {
        title: 'Plugin',
        links: [
          { label: 'GitHub', href: 'https://github.com/cmartinezs/claude-planning-with-ai' },
          { label: 'Installation', href: '#instalacion' },
          { label: 'Commands', href: '#comandos' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', href: 'https://github.com/cmartinezs/claude-planning-with-ai' },
          { label: 'Claude Code', href: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
        ],
      },
      {
        title: 'Author',
        links: [
          { label: 'cmartinezs', href: 'https://github.com/cmartinezs' },
          { label: 'Contact', href: 'mailto:carlos.f.martinez.s@gmail.com' },
        ],
      },
    ],
    copyright: 'Made with',
    copyrightEnd: 'for the Claude community.',
  },
  splash: {
    slides: [
      {
        icon: '🎯',
        question: 'Do your user stories arrive without clear acceptance criteria?',
        answer: 'Misunderstandings follow. Then rework.',
      },
      {
        icon: '⏳',
        question: 'Do you spend more time organizing tasks than writing code?',
        answer: 'Unplanned chaos drains your creative energy.',
      },
      {
        icon: '📅',
        question: 'Do your project plans go stale within days?',
        answer: 'Software is constant change. Your plan should adapt.',
      },
      {
        icon: '🤖',
        question: 'Would you like Claude Code to run complete plans on its own?',
        answer: 'Idea → Expansion → Execution → Archive. No constant supervision.',
      },
    ],
    skip: 'Skip intro',
    identify: 'Sound familiar?',
    revealTitle: 'Planning with AI solves',
    revealGradient: 'all of this',
    revealSubtitle:
      'A Claude Code plugin that structures every phase of your project. From idea to archive, with complete traceability.',
    revealBtn: 'See the plugin',
  },
}

export default en
