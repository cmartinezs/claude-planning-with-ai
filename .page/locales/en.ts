import commandsPage from './commandsPage.en'
import tutorialsPage from './tutorialsPage.en'

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
      tutorials: 'Tutorials',
      training: 'Training',
    },
  },
  hero: {
    badge: 'Official Claude Code plugin',
    titleLine1: 'Structured',
    titleHighlight: 'planning',
    titleBetween: 'for',
    titleLine2: 'your projects',
    subtitle:
      'From the initial idea to the archived project. A complete lifecycle system that transforms the way you plan with Claude Code.',
    installBtn: 'Install plugin',
    demoBtn: 'See demo',
    stats: [
      { value: '5', label: 'Lifecycle states' },
      { value: '50', label: 'Commands' },
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
        title: 'Story-based execution',
        description: 'Split work into executable stories. Each story is processed from start to finish.',
      },
      {
        title: 'Graduated states',
        description: 'Each plan advances through phases: INITIAL → EXPANSION → DEEPENING → COMPLETED → archive.',
      },
      {
        title: 'Mid-plan adjustments',
        description: 'Enrich, split, or add stories without losing progress. When switching planning or story context, the plugin detects git conflicts, offers safe alternatives (stash, WIP commit, STANDBY), and protects work in progress.',
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
        description: 'Claude expands the idea: stories, tasks, dependencies, success criteria.',
      },
      {
        label: 'Execution',
        description: 'Claude executes story by story. Each /plan-story command advances the plan.',
      },
      {
        label: 'Completed',
        description: 'Mark stories done with /plan-done. The plan approaches its end.',
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
    titlePrefix: 'Usage',
    titleHighlight: 'reference',
    subtitle: 'The complete list lives at /commands. The landing now keeps only the main entry points for quick orientation.',
    cards: [
      {
        title: 'Complete commands',
        description: 'Browse all 50 commands with arguments, behavior, source, and use cases.',
        href: '/commands',
        linkLabel: 'Open reference',
        iconPath: 'M4 6h16M4 12h16M4 18h10',
      },
      {
        title: 'Flow tutorials',
        description: 'Choose the right route: from epic, from scratch, backlog, smoke tests, adjustments, or autonomous agents.',
        href: '/tutorials',
        linkLabel: 'View tutorials',
        iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      },
      {
        title: 'First command',
        description: 'Start with /plan-init to create .planning/ and detect project areas.',
        href: '/#installation',
        linkLabel: 'Go to installation',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      },
      {
        title: 'Training',
        description: '10 interactive scenarios to practice the plugin step by step, from basic to advanced.',
        href: '/training',
        linkLabel: 'Go to training',
        iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      },
    ],
  },
  training: {
    runner: {
      stepLabel: 'Step',
      ofLabel: 'of',
      contextLabel: 'Context',
      nextLabel: 'Next step',
      difficultyLabel: 'Difficulty',
      completedLabel: 'Completed',
      finishedTitle: 'Training completed!',
      finishedSubtitle: 'You practiced the full plugin flow. Choose another training to keep learning.',
      backLabel: 'Back to catalog',
      restartLabel: 'Repeat',
    },
  },
  commandsPage,
  tutorialsPage,
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
          '    └── 📄 story-01.md',
          '',
        ],
      },
      {
        label: '/plan-expand 001-my-feature',
        desc: 'Expands the idea into executable stories',
        command: '/plan-expand 001-my-feature',
        output: [
          '  ⟳ Expanding plan 001-my-feature with Claude...',
          '    ├── story-01: Initial setup',
          '    ├── story-02: Core implementation',
          '    └── story-03: Testing and documentation',
          '',
          '  ✓ Plan expanded to 3 stories. State → EXPANSION',
          '',
        ],
      },
      {
        label: '/plan-story 001-my-feature story-01',
        desc: 'Runs all tasks in the first story',
        command: '/plan-story 001-my-feature story-01',
        output: [
          '  ⟳ Running story-01: Initial setup...',
          '    ✓ directory structure created',
          '    ✓ dependencies configured',
          '    ✓ base files generated',
          '',
          '  ✓ Story story-01 completed successfully',
          '  ➜ Next: /plan-done 001-my-feature story-01',
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
        '# story-01: Initial setup',
        '',
        '- Create base structure',
        '- Configure dependencies',
        '- Prepare validations',
      ],
      [
        '# story-01: Initial setup',
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
          { label: 'Installation', href: '/#installation' },
          { label: 'Commands', href: '/commands' },
          { label: 'Tutorials', href: '/tutorials' },
          { label: 'Training', href: '/training' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', href: 'https://github.com/cmartinezs/claude-planning-with-ai' },
          { label: 'Tutorials', href: '/tutorials' },
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
