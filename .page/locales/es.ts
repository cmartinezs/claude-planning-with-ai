import commandsPage from './commandsPage.es'
import tutorialsPage from './tutorialsPage.es'

const es = {
  meta: {
    title: 'Planning with AI — Plugin de planificación para Claude Code',
    description:
      'Plugin de planificación estructurada para Claude Code. Ciclo de vida completo: idea, expansión, ejecución, finalización y archivo.',
  },
  header: {
    nav: {
      install: 'Instalación',
      whatItDoes: 'Qué hace',
      lifecycle: 'Ciclo de vida',
      commands: 'Comandos',
      tutorials: 'Tutoriales',
      training: 'Entrenamientos',
    },
  },
  hero: {
    badge: 'Plugin oficial para Claude Code',
    titleLine1: 'Planificación',
    titleHighlight: 'estructurada',
    titleBetween: 'para',
    titleLine2: 'tus proyectos',
    subtitle:
      'Desde la idea inicial hasta el archivo del proyecto. Un sistema completo de ciclo de vida que transforma la forma en que planificas con Claude Code.',
    installBtn: 'Instalar plugin',
    demoBtn: 'Ver demo',
    stats: [
      { value: '5', label: 'Estados del ciclo' },
      { value: '51', label: 'Comandos' },
      { value: 'Markdown', label: 'Formato nativo' },
      { value: '0', label: 'Dependencias' },
    ],
  },
  whatItDoes: {
    titlePrefix: '¿Qué hace',
    titleHighlight: 'Planning with AI',
    titleSuffix: '?',
    subtitle:
      'Un plugin que trae planificación estructurada a Claude Code. Desde la chispa inicial hasta el archivo del proyecto.',
    features: [
      {
        title: 'Adaptado a tu proyecto',
        description:
          'plan-init detecta la estructura de tu repositorio y configura las áreas de trazabilidad automáticamente.',
      },
      {
        title: 'Backlog enriquecido',
        description:
          'Añade criterios de aceptación, notas técnicas, dependencias y complejidad a tus historias.',
      },
      {
        title: 'Ejecución por stories',
        description: 'Divide el trabajo en stories ejecutables. Cada story se procesa de principio a fin.',
      },
      {
        title: 'Estados graduales',
        description: 'Cada plan avanza por fases: INITIAL → EXPANSION → DEEPENING → COMPLETED → archivo.',
      },
      {
        title: 'Ajustes en mitad del plan',
        description: 'Enriquece, divide o añade stories sin perder progreso. Al cambiar de planning o story, el plugin detecta el conflicto git, ofrece alternativas (stash, WIP, STANDBY) y protege el trabajo en curso.',
      },
      {
        title: 'Archivo automático',
        description:
          'Al completar, se audita y archiva todo el plan en finished/ con trazabilidad completa.',
      },
    ],
  },
  lifecycle: {
    titlePrefix: 'Ciclo de vida',
    titleHighlight: 'completo',
    subtitle: 'Cada plan navega por 5 estados. El plugin guía cada transición con comandos específicos.',
    stages: [
      { label: 'Idea', description: 'Captura la idea inicial con /plan-new. Una semilla, sin estructura.' },
      {
        label: 'Expansión',
        description: 'Claude expande la idea: stories, tareas, dependencias, criterios de éxito.',
      },
      {
        label: 'Ejecución',
        description: 'Claude ejecuta story por story. Cada comando /plan-story avanza el plan.',
      },
      {
        label: 'Completado',
        description: 'Marca stories completadas con /plan-done. El plan se acerca a su fin.',
      },
      {
        label: 'Archivo',
        description: 'Auditoría final y archivo en finished/. Todo queda documentado.',
      },
    ],
    statusLabel: 'Estado actual del plan:',
    statusNote: '— consulta en vivo',
  },
  commands: {
    titlePrefix: 'Referencia',
    titleHighlight: 'de uso',
    subtitle: 'El listado completo vive en /commands. El landing deja solo las entradas principales para orientarte rápido.',
    cards: [
      {
        title: 'Comandos completos',
        description: 'Consulta los 52 comandos con argumentos, comportamiento, fuente y casos de uso.',
        href: '/commands',
        linkLabel: 'Abrir referencia',
        iconPath: 'M4 6h16M4 12h16M4 18h10',
      },
      {
        title: 'Tutoriales por flujo',
        description: 'Elige el recorrido correcto: desde epic, desde cero, backlog, smoke tests, ajustes o agentes autónomos.',
        href: '/tutorials',
        linkLabel: 'Ver tutoriales',
        iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      },
      {
        title: 'Primer comando',
        description: 'Empieza con /plan-init para crear .planning/ y detectar las áreas del proyecto.',
        href: '/#installation',
        linkLabel: 'Ir a instalación',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      },
      {
        title: 'Entrenamientos',
        description: '10 escenarios interactivos para practicar el plugin paso a paso, desde básico hasta avanzado.',
        href: '/training',
        linkLabel: 'Ir a entrenamientos',
        iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      },
    ],
  },
  training: {
    runner: {
      stepLabel: 'Paso',
      ofLabel: 'de',
      contextLabel: 'Contexto',
      nextLabel: 'Siguiente paso',
      difficultyLabel: 'Dificultad',
      completedLabel: 'Completado',
      finishedTitle: '¡Entrenamiento completado!',
      finishedSubtitle: 'Practicaste el flujo completo del plugin. Elige otro entrenamiento para seguir aprendiendo.',
      backLabel: 'Volver al catálogo',
      restartLabel: 'Repetir',
    },
  },
  commandsPage,
  tutorialsPage,
  installation: {
    titlePrefix: 'Instalación en',
    titleHighlight: '2 pasos',
    subtitle: 'El plugin funciona con cualquier proyecto que use markdown. Sin dependencias externas. Sin configuración previa.',
    marketplace: {
      title: 'Desde Claude Code',
      description: 'Agrega el marketplace e instala el plugin:',
    },
    terminal: {
      title: 'Desde tu terminal',
      description: 'Los mismos dos pasos usando la CLI de Claude Code:',
    },
    updateNote: 'Para actualizar a la última versión más adelante:',
    firstSteps: 'Primeros pasos',
    interactive: 'interactivo — ejecuta los pasos en orden',
    waiting: 'esperando comando...',
    workspaceProject: 'mi-proyecto',
    workspaceInitialHint: [
      '# mi-proyecto',
      '',
      'Selecciona /plan-init para iniciar el flujo.',
      'Los siguientes pasos se habilitan en orden.',
    ],
    steps: [
      {
        label: '/plan-init',
        desc: 'Crea .planning/ y detecta las áreas del proyecto',
        command: '/plan-init',
        output: [
          '  ⟳ Detectando estructura del proyecto...',
          '',
          '    api/    → AP  (Java/Spring Boot)',
          '    web/    → WB  (Next.js)',
          '    docs/   → DO  (Markdown)',
          '    infra/  → IN  (Terraform)',
          '',
          '  ¿Es correcta esta configuración? (Enter) ✓',
          '',
          '  ✓ Áreas configuradas: AP · WB · DO · IN',
          '  ✓ Estructura .planning/ creada',
          '',
        ],
      },
      {
        label: '/plan-new 001-mi-feature -- Mi feature',
        desc: 'Crea el plan en estado INITIAL',
        command: '/plan-new 001-mi-feature -- Mi feature',
        output: [
          '  ✓ Plan 001-mi-feature creado en estado INITIAL',
          '',
          '    📁 .planning/active/001-mi-feature/',
          '    ├── 📄 plan.md',
          '    └── 📄 story-01.md',
          '',
        ],
      },
      {
        label: '/plan-expand 001-mi-feature',
        desc: 'Expande la idea en stories ejecutables',
        command: '/plan-expand 001-mi-feature',
        output: [
          '  ⟳ Expandiendo plan 001-mi-feature con Claude...',
          '    ├── story-01: Configuración inicial',
          '    ├── story-02: Implementación core',
          '    └── story-03: Pruebas y documentación',
          '',
          '  ✓ Plan expandido a 3 stories. Estado → EXPANSION',
          '',
        ],
      },
      {
        label: '/plan-story 001-mi-feature story-01',
        desc: 'Ejecuta todas las tareas de la primera story',
        command: '/plan-story 001-mi-feature story-01',
        output: [
          '  ⟳ Ejecutando story-01: Configuración inicial...',
          '    ✓ estructura de directorios creada',
          '    ✓ dependencias configuradas',
          '    ✓ archivos base generados',
          '',
          '  ✓ Story story-01 completada exitosamente',
          '  ➜ Siguiente: /plan-done 001-mi-feature story-01',
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
        '# 001-mi-feature',
        '',
        'Estado: INITIAL',
        '',
        '## Idea',
        'Mi feature pendiente de expansión.',
      ],
      [
        '# story-01: Configuración inicial',
        '',
        '- Crear estructura base',
        '- Configurar dependencias',
        '- Preparar validaciones',
      ],
      [
        '# story-01: Configuración inicial',
        '',
        'Estado: DONE',
        '',
        '- [x] estructura de directorios creada',
        '- [x] dependencias configuradas',
        '- [x] archivos base generados',
      ],
    ],
  },
  cta: {
    title: 'Planifica mejor. Construye más rápido.',
    titleHighlight: 'Con Claude Code.',
    subtitle:
      'Planning with AI transforma la forma en que Claude Code aborda proyectos complejos. Estructura, claridad y trazabilidad en cada paso.',
    installBtn: 'Instalar ahora',
    githubBtn: 'Ver en GitHub',
  },
  footer: {
    description: 'Plugin de planificación estructurada para Claude Code. Construye proyectos con orden y claridad.',
    groups: [
      {
        title: 'Plugin',
        links: [
          { label: 'GitHub', href: 'https://github.com/cmartinezs/claude-planning-with-ai' },
          { label: 'Instalación', href: '/#installation' },
          { label: 'Comandos', href: '/commands' },
          { label: 'Tutoriales', href: '/tutorials' },
          { label: 'Entrenamientos', href: '/training' },
        ],
      },
      {
        title: 'Recursos',
        links: [
          { label: 'Documentación', href: 'https://github.com/cmartinezs/claude-planning-with-ai' },
          { label: 'Tutoriales', href: '/tutorials' },
          { label: 'Claude Code', href: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
        ],
      },
      {
        title: 'Autor',
        links: [
          { label: 'cmartinezs', href: 'https://github.com/cmartinezs' },
          { label: 'Contacto', href: 'mailto:carlos.f.martinez.s@gmail.com' },
        ],
      },
    ],
    copyright: 'Hecho con',
    copyrightEnd: 'para la comunidad de Claude.',
  },
  splash: {
    slides: [
      {
        icon: '🎯',
        question: '¿Tus historias de usuario llegan sin criterios de aceptación claros?',
        answer: 'Después vienen los malentendidos. Y el retrabajo.',
      },
      {
        icon: '⏳',
        question: '¿Pasas más tiempo organizando tareas que escribiendo código?',
        answer: 'El caos no planificado consume tu energía creativa.',
      },
      {
        icon: '📅',
        question: '¿Tus planes de proyecto se desactualizan en cuestión de días?',
        answer: 'El software es cambio constante. Tu plan debería adaptarse.',
      },
      {
        icon: '🤖',
        question: '¿Te gustaría que Claude Code ejecute planes completos por sí solo?',
        answer: 'Idea → Expansión → Ejecución → Archivo. Sin supervisión constante.',
      },
    ],
    skip: 'Saltar introducción',
    identify: '¿Te sientes identificado?',
    revealTitle: 'Planning with AI resuelve',
    revealGradient: 'todo esto',
    revealSubtitle:
      'Un plugin para Claude Code que estructura cada fase de tu proyecto. Desde la idea hasta el archivo, con trazabilidad completa.',
    revealBtn: 'Ver el plugin',
  },
}

export default es
