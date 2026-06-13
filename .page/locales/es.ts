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
    },
  },
  hero: {
    badge: 'Plugin oficial para Claude Code',
    titleLine1: 'Planificación',
    titleHighlight: 'estructurada',
    titleBetween: 'para',
    titleLine2: 'tu software',
    subtitle:
      'Desde la idea inicial hasta el archivo del proyecto. Un sistema completo de ciclo de vida que transforma la forma en que planificas con Claude Code.',
    installBtn: 'Instalar plugin',
    demoBtn: 'Ver demo',
    stats: [
      { value: '5', label: 'Estados del ciclo' },
      { value: '16', label: 'Comandos' },
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
        title: 'Ejecución por alcances',
        description: 'Divide el trabajo en scopes ejecutables. Cada scope se procesa de principio a fin.',
      },
      {
        title: 'Estados graduales',
        description: 'Cada plan avanza por fases: INITIAL → EXPANSION → DEEPENING → COMPLETED → archivo.',
      },
      {
        title: 'Ajustes en mitad del plan',
        description: 'Enriquece, divide o añade scopes sin perder el progreso actual.',
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
        description: 'Claude expande la idea: alcances, tareas, dependencias, criterios de éxito.',
      },
      {
        label: 'Ejecución',
        description: 'Claude ejecuta scope por scope. Cada comando /plan-scope avanza el plan.',
      },
      {
        label: 'Completado',
        description: 'Marca scopes completados con /plan-done. El plan se acerca a su fin.',
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
    titlePrefix: 'Comandos',
    titleHighlight: 'esenciales',
    subtitle: '23 comandos cubren todo el ciclo de vida. Sin flags crípticas. Sin configuraciones infinitas.',
    categories: [
      {
        title: 'Inicialización',
        description: 'Ejecutar una vez por proyecto',
        commands: [{ cmd: '/plan-init', desc: 'Crea la estructura .planning/ en el proyecto' }],
      },
      {
        title: 'Backlog',
        description: 'Gestión de historias y épicas',
        commands: [
          { cmd: '/us-new ruta/', desc: 'Añade una nueva historia a un directorio o archivo' },
          { cmd: '/us-enrich historia.md', desc: 'Añade DoD, notas técnicas, dependencias' },
          { cmd: '/epic-enrich ruta/', desc: 'Detecta gaps y añade nuevas historias' },
          { cmd: '/plan-from-epic NNN ruta/', desc: 'Genera un plan completo desde una épica' },
        ],
      },
      {
        title: 'Planificación',
        description: 'Crear y gestionar planes',
        commands: [
          { cmd: '/plan-template slug', desc: 'Genera un documento de idea interactivo' },
          { cmd: '/plan-new NNN-slug -- intento', desc: 'Crea un plan en estado INITIAL' },
          { cmd: '/plan-new NNN-slug @ruta.md', desc: 'Crea un plan desde un documento de idea' },
          { cmd: '/plan-expand NNN-slug', desc: 'Avanza de INITIAL → EXPANSION' },
        ],
      },
      {
        title: 'Tareas atómicas',
        description: 'Descomposición opcional antes de ejecutar',
        commands: [
          { cmd: '/plan-atomize NNN-slug scope-NN', desc: 'Descompone un scope en tareas atómicas' },
          { cmd: '/plan-task NNN-slug scope-NN task-NN', desc: 'Ejecuta una sola tarea atómica' },
          { cmd: '/plan-task-validate NNN-slug', desc: 'Audita las tareas atómicas contra el checklist de atomicidad' },
        ],
      },
      {
        title: 'Ejecución',
        description: 'Ejecutar y cerrar scopes',
        commands: [
          { cmd: '/plan-scope NNN-slug scope-NN', desc: 'Ejecuta todas las tareas de un scope' },
          { cmd: '/plan-done NNN-slug scope-NN', desc: 'Marca un scope como completado' },
          { cmd: '/plan-status', desc: 'Muestra todos los planes activos y sus scopes' },
          { cmd: '/plan-validate', desc: 'Verifica la integridad estructural de los plannings' },
          { cmd: '/plan-archive NNN-slug', desc: 'Audita y archiva en finished/' },
        ],
      },
      {
        title: 'Ajustes',
        description: 'Modificaciones en mitad del plan',
        commands: [
          { cmd: '/plan-enrich-epic NNN-slug', desc: 'Añade nuevos scopes a un plan activo' },
          { cmd: '/plan-enrich-story NNN-slug scope-NN', desc: 'Profundiza un scope poco definido' },
          { cmd: '/plan-split-story NNN-slug scope-NN', desc: 'Divide un scope demasiado grande' },
        ],
      },
      {
        title: 'Agentes autónomos',
        description: 'Pipeline completo con un solo comando',
        commands: [
          { cmd: '/plan-run NNN-slug', desc: 'Ejecuta un plan de punta a punta — detecta estado, confirma una vez, delega a agentes' },
          { cmd: '/plan-agent-plan NNN-slug', desc: 'Agente de planificación: crea y expande sin interrupciones' },
          { cmd: '/plan-agent-execute NNN-slug', desc: 'Agente de ejecución: atomiza y ejecuta scopes en paralelo' },
          { cmd: '/plan-agent-validate NNN-slug', desc: 'Agente de cierre: valida, marca done y archiva' },
        ],
      },
    ],
    docsLink: 'Ver documentación completa en GitHub',
  },
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
          '    └── 📄 scope-01.md',
          '',
        ],
      },
      {
        label: '/plan-expand 001-mi-feature',
        desc: 'Expande la idea en scopes ejecutables',
        command: '/plan-expand 001-mi-feature',
        output: [
          '  ⟳ Expandiendo plan 001-mi-feature con Claude...',
          '    ├── scope-01: Configuración inicial',
          '    ├── scope-02: Implementación core',
          '    └── scope-03: Pruebas y documentación',
          '',
          '  ✓ Plan expandido a 3 scopes. Estado → EXPANSION',
          '',
        ],
      },
      {
        label: '/plan-scope 001-mi-feature scope-01',
        desc: 'Ejecuta todas las tareas del primer scope',
        command: '/plan-scope 001-mi-feature scope-01',
        output: [
          '  ⟳ Ejecutando scope-01: Configuración inicial...',
          '    ✓ estructura de directorios creada',
          '    ✓ dependencias configuradas',
          '    ✓ archivos base generados',
          '',
          '  ✓ Scope scope-01 completado exitosamente',
          '  ➜ Siguiente: /plan-done 001-mi-feature scope-01',
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
        '# scope-01: Configuración inicial',
        '',
        '- Crear estructura base',
        '- Configurar dependencias',
        '- Preparar validaciones',
      ],
      [
        '# scope-01: Configuración inicial',
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
          { label: 'Instalación', href: '#instalacion' },
          { label: 'Comandos', href: '#comandos' },
        ],
      },
      {
        title: 'Recursos',
        links: [
          { label: 'Documentación', href: 'https://github.com/cmartinezs/claude-planning-with-ai' },
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
