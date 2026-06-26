const tutorialsPage = {
  meta: {
    title: 'Tutoriales - Planning with AI',
    description:
      'Tutoriales por escenario para usar Planning with AI en Claude Code: epics, backlog, ejecución, ajustes y agentes autónomos.',
  },
  back: 'Volver al landing',
  eyebrow: 'Guías por escenario',
  title: 'Tutoriales disponibles para cada flujo real de planning',
  intro:
    'Los tutoriales del template quedan visibles como rutas de trabajo: desde un epic existente, desde cero, refinamiento de backlog, ajustes en mitad de ejecución y pipeline autónomo con agentes.',
  commandsLink: 'Ver comandos',
  sourceLink: 'Ver fuentes en GitHub',
  whenLabel: 'Cuándo usarlo',
  outcomeLabel: 'Resultado',
  tutorials: [
    {
      id: 'flow-a',
      title: 'Flujo A - Planificar desde un epic existente',
      when:
        'Úsalo cuando ya hay un epic con stories definidas y quieres convertirlo en un planning ejecutable.',
      outcome:
        'Un planning activo donde cada story del epic queda representada como una story con criterios de cierre heredados.',
      steps: [
        'Revisar el epic y sus stories actuales.',
        'Enriquecer las stories que estén delgadas o sin Definition of Done.',
        'Detectar gaps del epic y agregar stories faltantes si corresponde.',
        'Crear el planning activo desde el container de stories.',
        'Ejecutar stories, cerrar avances y archivar al terminar.',
      ],
      commands: ['/us-status', '/us-enrich', '/epic-enrich', '/plan-from-epic', '/plan-story', '/plan-done', '/plan-archive'],
      source: 'planning-template/TUTORIAL/flow-01-epic.md',
    },
    {
      id: 'flow-b',
      title: 'Flujo B - Planning desde cero',
      when:
        'Úsalo para trabajo transversal, técnico o de infraestructura que no pertenece a una user story de producto.',
      outcome:
        'Una idea inicial se transforma en stories ejecutables dentro de .planning/active/.',
      steps: [
        'Capturar la idea en modo interactivo o como plantilla en blanco.',
        'Crear el planning desde el documento de idea o desde un intent inline.',
        'Expandir la idea para producir stories, dependencias y criterios de éxito.',
        'Atomizar stories si necesitas tareas técnicas más pequeñas.',
        'Ejecutar y cerrar cada story.',
      ],
      commands: ['/plan-template', '/plan-new', '/plan-expand', '/plan-atomize', '/plan-task', '/plan-story', '/plan-done'],
      source: 'planning-template/TUTORIAL/flow-02-general.md',
    },
    {
      id: 'flow-c',
      title: 'Flujo C - Refinar el backlog de producto',
      when:
        'Úsalo cuando no quieres ejecutar todavía; el objetivo es mejorar la calidad del backlog antes de planificar.',
      outcome:
        'Stories más claras, con DoD, notas técnicas, dependencias y cobertura de gaps antes de pasar a planning.',
      steps: [
        'Identificar stories incompletas dentro del container.',
        'Enriquecer stories una por una.',
        'Agregar stories nuevas cuando el epic no cubre algún comportamiento necesario.',
        'Dividir stories demasiado grandes antes de estimar o planificar.',
        'Revisar estado del container para confirmar que está listo.',
      ],
      commands: ['/us-status', '/us-enrich', '/us-new', '/us-split', '/epic-enrich'],
      source: 'planning-template/TUTORIAL/flow-03-backlog.md',
    },
    {
      id: 'flow-d',
      title: 'Flujo D - Ajustar durante la ejecución',
      when:
        'Úsalo cuando el planning ya está activo y aparece trabajo nuevo, ambigüedad, exceso de tamaño o cambios de alcance.',
      outcome:
        'El planning activo se adapta sin perder trazabilidad ni forzar trabajo obsoleto.',
      steps: [
        'Determinar si el cambio es solo de ejecución o también debe quedar en backlog de producto.',
        'Agregar stories nuevas al planning activo.',
        'Profundizar stories incompletas antes de ejecutarlas.',
        'Dividir stories demasiado amplias.',
        'Saltar, revertir o reintentar stories según el tipo de cambio.',
      ],
      commands: ['/plan-enrich-epic', '/plan-enrich-story', '/plan-split-story', '/plan-story-skip', '/plan-rollback', '/plan-retry'],
      source: 'planning-template/TUTORIAL/flow-04-mid-execution.md',
    },
    {
      id: 'flow-e',
      title: 'Flujo E - Pipeline autónomo con agentes',
      when:
        'Úsalo cuando quieres ejecutar un planning de punta a punta con mínima intervención manual.',
      outcome:
        'Un comando detecta estado, confirma una vez y delega planificación, ejecución y validación a agentes especializados.',
      steps: [
        'Ejecutar desde una descripción nueva o desde un planning existente.',
        'Revisar el plan de ejecución propuesto.',
        'Confirmar una sola vez.',
        'Dejar que el agente de planificación cree o expanda.',
        'Dejar que el agente de ejecución atomice y corra stories, y que el agente de cierre valide y archive.',
      ],
      commands: ['/plan-run', '/plan-agent-plan', '/plan-agent-execute', '/plan-agent-validate'],
      source: 'planning-template/TUTORIAL/flow-05-autonomous.md',
    },
    {
      id: 'reference',
      title: 'Referencia rápida de comandos',
      when:
        'Úsala cuando ya conoces el flujo y necesitas encontrar el comando correcto por capa del sistema.',
      outcome:
        'Mapa compacto de comandos para producto, puente, planning, ejecución, ajustes y pipeline autónomo.',
      steps: [
        'Ubicar si estás trabajando en backlog de producto o en .planning/.',
        'Elegir el comando según la fase del ciclo de vida.',
        'Verificar argumentos esperados antes de ejecutarlo.',
        'Consultar /plan-status o /plan-health cuando no esté claro el estado actual.',
      ],
      commands: ['/us-new', '/us-enrich', '/plan-from-epic', '/plan-new', '/plan-expand', '/plan-status', '/plan-health', '/plan-run'],
      source: 'planning-template/TUTORIAL/reference.md',
    },
  ],
}

export default tutorialsPage
