const commandsPage = {
  meta: {
    title: 'Comandos de Claude - Planning with AI',
    description: 'Listado completo y extenso de comandos Claude Code incluidos en el plugin Planning with AI.',
  },
  back: 'Volver al landing',
  eyebrow: 'Referencia Claude Code',
  title: 'comandos para planificar, ejecutar y cerrar trabajo con Claude',
  intro:
    'Inventario completo de comandos expuestos por el plugin. Cada entrada resume argumentos, comportamiento esperado, casos de uso y el archivo fuente donde vive la implementación.',
  tutorialsLink: 'Ver tutoriales',
  sourceLink: 'Ver skills en GitHub',
  categoriesLabel: 'Categorías',
  categories: [
    {
      title: 'Inicialización y captura',
      description: 'Comandos para preparar el sistema de planning y capturar ideas antes de expandirlas.',
      commands: [
        {
          name: '/plan-init',
          usage: '/plan-init [--blank] [--force]',
          description: 'Inicializa el sistema de planning en el proyecto actual.',
          details: [
            'Copia workflows, templates, tutoriales y glosario desde planning-template/.',
            'Crea la estructura .planning/, detecta áreas del repositorio y configura la rama base git.',
            'Debe ejecutarse una vez antes de usar el resto de comandos plan-*.',
          ],
          source: 'skills/plan-init/SKILL.md',
        },
        {
          name: '/plan-git-config',
          usage: '/plan-git-config [--base-branch <branch>]',
          description: 'Ve o actualiza la configuración git del sistema de planning.',
          details: [
            'Útil en proyectos que ya tienen .planning/ inicializado antes de la configuración git.',
            'Sin argumentos, muestra la config actual y ofrece editarla.',
            'Con --base-branch <branch>, establece la rama base para nuevas ramas de story.',
          ],
          source: 'skills/plan-git-config/SKILL.md',
        },
        {
          name: '/plan-template',
          usage: '/plan-template [slug] [--interactive | --blank]',
          description: 'Genera un documento de idea listo para alimentar /plan-new.',
          details: [
            'Guarda la idea en .planning/ideas/.',
            'Permite capturar intent, contexto, restricciones, criterios de éxito y preguntas abiertas.',
            'Sirve para trabajos que todavía necesitan aclaración antes de convertirse en planning.',
          ],
          source: 'skills/plan-template/SKILL.md',
        },
        {
          name: '/plan-new',
          usage: '/plan-new <NNN-slug> -- <intent> | /plan-new <NNN-slug> @<path/to/idea.md>',
          description: 'Crea una nueva entrada de planning en estado INITIAL.',
          details: [
            'Acepta una captura inline rápida o un documento de idea enriquecido.',
            'Crea los archivos base del planning sin expandir todavía las stories.',
            'Requiere que .planning/ exista previamente.',
          ],
          source: 'skills/plan-new/SKILL.md',
        },
      ],
    },
    {
      title: 'Backlog de producto',
      description: 'Herramientas para crear, enriquecer y dividir historias o épicas antes de ejecutar.',
      commands: [
        {
          name: '/us-new',
          usage: '/us-new <path/to/container> [--interactive | --blank]',
          description: 'Agrega una nueva user story a un container existente.',
          details: [
            'El container puede ser un directorio de stories o un único documento markdown.',
            'Respeta el formato y convenciones que encuentra en el proyecto.',
            'Actualiza índices cuando corresponde.',
          ],
          source: 'skills/us-new/SKILL.md',
        },
        {
          name: '/us-enrich',
          usage: '/us-enrich <path/to/story.md> | <story-id> | <partial-filename>',
          description: 'Enriquece una story con secciones ejecutables faltantes.',
          details: [
            'Agrega Definition of Done, Technical Notes, Dependencies y Complexity cuando faltan.',
            'Puede resolver la story por path, ID o coincidencia parcial.',
            'Lee contexto del epic si existe para mantener coherencia.',
          ],
          source: 'skills/us-enrich/SKILL.md',
        },
        {
          name: '/us-split',
          usage: '/us-split <path/to/story.md>',
          description: 'Divide una user story en dos historias con referencias cruzadas.',
          details: [
            'Mantiene el flujo principal en la story original.',
            'Extrae comportamiento secundario o independiente a una nueva story.',
            'Deja trazabilidad entre ambas piezas.',
          ],
          source: 'skills/us-split/SKILL.md',
        },
        {
          name: '/us-status',
          usage: '/us-status <path/to/container/>',
          description: 'Muestra el estado de enriquecimiento de las stories de un container.',
          details: [
            'Detecta si cada story tiene DoD, notas técnicas y dependencias.',
            'Indica si ya está vinculada a una story activa del planning.',
            'Sirve para preparar backlog antes de planificar.',
          ],
          source: 'skills/us-status/SKILL.md',
        },
        {
          name: '/epic-enrich',
          usage: '/epic-enrich <path/to/epic-dir/> | <path/to/stories.md>',
          description: 'Agrega nuevas stories a un container existente detectando gaps.',
          details: [
            'Lee el contenido actual y el contexto de epic.',
            'Identifica cobertura faltante, edge cases y dependencias no representadas.',
            'Guía la adición de nuevas stories sin imponer una estructura fija.',
          ],
          source: 'skills/epic-enrich/SKILL.md',
        },
        {
          name: '/plan-from-epic',
          usage: '/plan-from-epic <NNN> <path/to/container> [--filter field=value]',
          description: 'Genera un planning activo completo desde un container de stories.',
          details: [
            'Convierte cada story en una story ejecutable.',
            'Hereda criterios de aceptación y Definition of Done como done criteria de la story.',
            'Actúa como puente entre backlog de producto y ejecución técnica.',
          ],
          source: 'skills/plan-from-epic/SKILL.md',
        },
      ],
    },
    {
      title: 'Expansión y preparación',
      description: 'Comandos para convertir una idea inicial en stories y tareas listas para ejecutar.',
      commands: [
        {
          name: '/plan-expand',
          usage: '/plan-expand <NNN-slug>',
          description: 'Avanza un planning desde INITIAL a EXPANSION.',
          details: [
            'Completa 01-expansion.md con stories, dependencias y criterios de éxito.',
            'Crea archivos de story en 02-deepening/.',
            'Mueve el planning a active/ y actualiza índices.',
          ],
          source: 'skills/plan-expand/SKILL.md',
        },
        {
          name: '/plan-atomize',
          usage: '/plan-atomize <NNN-slug> [story-NN]',
          description: 'Descompone una story en tareas atómicas.',
          details: [
            'Crea un archivo por tarea con diseño técnico, pasos de implementación, tests y done criteria.',
            'Puede aplicarse a una story específica o a todo el planning.',
            'Se usa después de expandir y antes de ejecutar cuando se necesita más granularidad.',
          ],
          source: 'skills/plan-atomize/SKILL.md',
        },
        {
          name: '/plan-task-validate',
          usage: '/plan-task-validate <NNN-slug> [story-NN] [task-NN]',
          description: 'Audita tareas atómicas contra el checklist de atomicidad.',
          details: [
            'Es de solo lectura.',
            'Valida una tarea, una story o todas las stories atomizadas.',
            'Compara tareas con el índice de la story y criterios de atomicidad.',
          ],
          source: 'skills/plan-task-validate/SKILL.md',
        },
      ],
    },
    {
      title: 'Ejecución y cierre',
      description: 'Comandos centrales para ejecutar stories, cerrar tareas y archivar trabajo terminado.',
      commands: [
        {
          name: '/plan-task',
          usage: '/plan-task <NNN-slug> <story-NN> <task-NN>',
          description: 'Ejecuta una tarea atómica individual.',
          details: [
            'Sigue el diseño técnico de la tarea y aplica implementación y tests.',
            'Marca la tarea como DONE y hace un commit con formato convencional (feat/fix/refactor/docs/…).',
            'Puede disparar documentación de nivel tarea.',
          ],
          source: 'skills/plan-task/SKILL.md',
        },
        {
          name: '/plan-story',
          usage: '/plan-story <NNN-slug> <story-NN>',
          description: 'Ejecuta todas las tareas dentro de una story.',
          details: [
            'Crea rama desde la base configurada, ejecuta cada tarea y hace commit convencional por tarea.',
            'Al finalizar: rebase, push y apertura de PR hacia la rama base.',
            'Es el comando principal de ejecución por stories.',
          ],
          source: 'skills/plan-story/SKILL.md',
        },
        {
          name: '/plan-done',
          usage: '/plan-done <NNN-slug> <story-NN> [task-N]',
          description: 'Marca una tarea o toda una story como terminada.',
          details: [
            'Verifica criterios de completitud antes de avanzar.',
            'Al cerrar una story completa: hace push y abre PR si la rama de la story está activa.',
            'Avanza el planning cuando todas las stories están completas.',
          ],
          source: 'skills/plan-done/SKILL.md',
        },
        {
          name: '/plan-validate',
          usage: '/plan-validate [NNN-slug]',
          description: 'Valida la integridad estructural de uno o todos los plannings.',
          details: [
            'Revisa ubicación de archivos, consistencia de stories, workflows, dependencias y done criteria.',
            'Incluye validaciones sobre archivos de tareas atomizadas.',
            'Es una auditoría previa útil antes de cerrar o archivar.',
          ],
          source: 'skills/plan-validate/SKILL.md',
        },
        {
          name: '/plan-archive',
          usage: '/plan-archive <NNN-slug>',
          description: 'Audita un planning completado y lo mueve a finished/.',
          details: [
            'Ejecuta AUDIT-PLANNING antes de mover archivos.',
            'Preserva la trazabilidad del trabajo terminado.',
            'Cierra el ciclo de vida del planning.',
          ],
          source: 'skills/plan-archive/SKILL.md',
        },
      ],
    },
    {
      title: 'Ajustes durante ejecución',
      description: 'Operaciones para adaptar un planning activo cuando cambia el alcance o aparece ambigüedad.',
      commands: [
        {
          name: '/plan-enrich-epic',
          usage: '/plan-enrich-epic <NNN-slug>',
          description: 'Agrega nuevas stories a un planning activo.',
          details: [
            'Se usa cuando aparece cobertura faltante después de la expansión inicial.',
            'Funciona sobre plannings en EXPANSION o DEEPENING.',
            'Mantiene la coherencia de índices y archivos de story.',
          ],
          source: 'skills/plan-enrich-epic/SKILL.md',
        },
        {
          name: '/plan-enrich-story',
          usage: '/plan-enrich-story <NNN-slug> <story-NN>',
          description: 'Profundiza una story underspecified, ambigua o incompleta.',
          details: [
            'No cambia el estado de la story.',
            'Agrega detalle suficiente para poder ejecutar con menor incertidumbre.',
            'Sirve cuando la story existe pero no tiene criterios o contexto suficiente.',
          ],
          source: 'skills/plan-enrich-story/SKILL.md',
        },
        {
          name: '/plan-split-story',
          usage: '/plan-split-story <NNN-slug> <story-NN>',
          description: 'Divide una story demasiado grande en stories más pequeñas.',
          details: [
            'Reemplaza la story original por dos o más stories enfocadas.',
            'Actualiza 01-expansion.md y los archivos bajo 02-deepening/.',
            'Es útil cuando una story mezcla responsabilidades o excede un tamaño ejecutable.',
          ],
          source: 'skills/plan-split-story/SKILL.md',
        },
        {
          name: '/plan-merge',
          usage: '/plan-merge <NNN-source> <story-NN> <NNN-target>',
          description: 'Mueve una story desde un planning activo a otro.',
          details: [
            'Actualiza ambos archivos 01-expansion.md.',
            'Relocaliza el archivo de story.',
            'Preserva carpetas de tareas atomizadas cuando existen.',
          ],
          source: 'skills/plan-merge/SKILL.md',
        },
        {
          name: '/plan-story-skip',
          usage: '/plan-story-skip <NNN-slug> <story-NN> [-- reason]',
          description: 'Marca una story como SKIPPED sin ejecutarla.',
          details: [
            'Sirve cuando la story ya no aplica por cambios de requerimiento.',
            'Permite cerrar un planning sin forzar trabajo obsoleto.',
            'Registra una razón cuando se entrega.',
          ],
          source: 'skills/plan-story-skip/SKILL.md',
        },
        {
          name: '/plan-rollback',
          usage: '/plan-rollback <NNN-slug> <story-NN>',
          description: 'Revierte una story de DONE a TODO.',
          details: [
            'Se usa cuando una ejecución dejó el código en mal estado y debe repetirse.',
            'Puede remover carpeta de tareas atomizadas asociada.',
            'Prepara la story para re-ejecución controlada.',
          ],
          source: 'skills/plan-rollback/SKILL.md',
        },
        {
          name: '/plan-retry',
          usage: '/plan-retry <NNN-slug>',
          description: 'Reintenta todas las stories BLOCKED de un planning.',
          details: [
            'Resetea stories bloqueadas a TODO.',
            'Re-ejecuta plan-story para retomarlos.',
            'Debe usarse después de resolver el bloqueo externo o técnico.',
          ],
          source: 'skills/plan-retry/SKILL.md',
        },
      ],
    },
    {
      title: 'Estado, reportes y reutilización',
      description: 'Consultas, reportes ejecutivos, historiales, exportación y diagnósticos globales.',
      commands: [
        {
          name: '/plan-status',
          usage: '/plan-status',
          description: 'Muestra el estado actual de todos los plannings.',
          details: [
            'Lista plannings activos y sus stories.',
            'Ayuda a decidir el siguiente comando a ejecutar.',
            'Opera sobre el sistema .planning/.',
          ],
          source: 'skills/plan-status/SKILL.md',
        },
        {
          name: '/plan-health',
          usage: '/plan-health',
          description: 'Escanea todo .planning/ buscando anomalías estructurales.',
          details: [
            'Detecta IDs duplicados, archivos huérfanos, plannings stale e índices inconsistentes.',
            'Es más amplio que plan-validate porque revisa el sistema completo.',
            'Produce un reporte global de salud.',
          ],
          source: 'skills/plan-health/SKILL.md',
        },
        {
          name: '/plan-history',
          usage: '/plan-history <NNN-slug>',
          description: 'Muestra la línea de tiempo de cambios de estado de un planning.',
          details: [
            'Extrae transiciones desde git history.',
            'Ayuda a reconstruir avance, bloqueos y cierres.',
            'Produce una vista temporal por planning.',
          ],
          source: 'skills/plan-history/SKILL.md',
        },
        {
          name: '/plan-report',
          usage: '/plan-report <NNN-slug>',
          description: 'Genera un resumen ejecutivo del planning.',
          details: [
            'Incluye objetivo, avance de stories, decisiones técnicas, duración y siguientes pasos.',
            'Sirve para comunicar estado fuera del equipo técnico.',
            'Resume también preguntas abiertas cuando existen.',
          ],
          source: 'skills/plan-report/SKILL.md',
        },
        {
          name: '/plan-standup',
          usage: '/plan-standup <NNN-slug>',
          description: 'Genera texto de standup para un planning.',
          details: [
            'Resume que se completó desde ayer.',
            'Indica que está en progreso hoy.',
            'Expone bloqueantes actuales.',
          ],
          source: 'skills/plan-standup/SKILL.md',
        },
        {
          name: '/plan-export',
          usage: '/plan-export <NNN-slug> [--format pr|tickets|markdown]',
          description: 'Exporta un planning como documento formateado.',
          details: [
            'Puede generar descripción de PR, lista de tickets o markdown standalone.',
            'Incluye stories, done criteria, preguntas abiertas y referencias.',
            'Es de solo lectura sobre el planning.',
          ],
          source: 'skills/plan-export/SKILL.md',
        },
        {
          name: '/plan-clone',
          usage: '/plan-clone <NNN-source-slug> <NNN-target-slug>',
          description: 'Clona un planning con un nuevo ID.',
          details: [
            'Copia la estructura de stories.',
            'Resetea todos los estados a TODO.',
            'Sirve para repetir un patrón probado en otro contexto.',
          ],
          source: 'skills/plan-clone/SKILL.md',
        },
      ],
    },
    {
      title: 'Documentación generada',
      description: 'Comandos para producir documentación desde artefactos de planning completados.',
      commands: [
        {
          name: '/doc-generate',
          usage: '/doc-generate <NNN-slug> [<story-NN> [<task-NN>]]',
          description: 'Genera documentación desde artefactos de planning.',
          details: [
            'Puede trabajar a nivel tarea, story o planning.',
            'Produce inline docs, ADRs, changelogs o guías de usuario según área y nivel.',
            'Detecta el área afectada antes de decidir el tipo de documentación.',
          ],
          source: 'skills/doc-generate/SKILL.md',
        },
        {
          name: '/doc-task',
          usage: '/doc-task <NNN-slug> <story-NN> <task-NN>',
          description: 'Genera documentación para una tarea atómica completada.',
          details: [
            'Wrapper delgado sobre doc-generate.',
            'Se invoca automáticamente desde plan-task cuando corresponde.',
            'Produce documentación inline o ADR según el área de la story.',
          ],
          source: 'skills/doc-task/SKILL.md',
        },
        {
          name: '/doc-story',
          usage: '/doc-story <NNN-slug> <story-NN>',
          description: 'Genera documentación para una story completada.',
          details: [
            'Wrapper delgado sobre doc-generate.',
            'Puede generar changelog, guía de usuario o ADR consolidado.',
            'Se integra al cierre de story.',
          ],
          source: 'skills/doc-story/SKILL.md',
        },
      ],
    },
    {
      title: 'Planificación de releases',
      description: 'Comandos para gestionar releases: agrupa plannings bajo versiones semánticas y controla su ciclo de vida.',
      commands: [
        {
          name: '/release-init',
          usage: '/release-init',
          description: 'Inicializa .releases/ para gestión de releases. Se ejecuta una vez, independiente de /plan-init.',
          details: [
            'Crea el directorio .releases/ y su README índice.',
            'Opt-in: no todos los proyectos necesitan gestión de releases.',
            'Prerequisito para usar el resto de comandos release-*.',
          ],
          source: 'skills/release-init/SKILL.md',
        },
        {
          name: '/release-new',
          usage: '/release-new <vX.Y.Z> -- <purpose>',
          description: 'Crea una nueva release en estado DRAFT con versión semántica.',
          details: [
            'Genera un archivo de release con versión, período objetivo y descripción.',
            'Estado inicial: DRAFT — sin plannings asignados todavía.',
            'Requiere /release-init previo.',
          ],
          source: 'skills/release-new/SKILL.md',
        },
        {
          name: '/release-add',
          usage: '/release-add <vX.Y.Z> <NNN-slug> [<NNN-slug> ...]',
          description: 'Agrega uno o más plannings a una release existente.',
          details: [
            'Lee resúmenes y estados actuales desde .planning/ automáticamente.',
            'Actualiza la tabla de plannings incluidos en el archivo de release.',
            'Admite múltiples plannings en un solo comando.',
          ],
          source: 'skills/release-add/SKILL.md',
        },
        {
          name: '/release-remove',
          usage: '/release-remove <vX.Y.Z> <NNN-slug>',
          description: 'Elimina un planning de una release.',
          details: [
            'Requiere confirmación explícita si la release ya fue publicada.',
            'Reajusta numeración de filas y actualiza el README índice.',
            'No elimina el planning del sistema, solo lo desvincula de la release.',
          ],
          source: 'skills/release-remove/SKILL.md',
        },
        {
          name: '/release-status',
          usage: '/release-status [<vX.Y.Z>] [--mark-planned | --mark-in-progress | --mark-blocked | --mark-released | --mark-cancelled]',
          description: 'Muestra el estado en vivo de todas las releases o de una en detalle.',
          details: [
            'Lee el estado actual de los plannings desde .planning/ — no de valores cacheados.',
            'Sin argumentos: tabla resumen de todas las releases.',
            'Con flag --mark-*: transiciona la release a PLANNED, IN PROGRESS, BLOCKED, RELEASED o CANCELLED.',
          ],
          source: 'skills/release-status/SKILL.md',
        },
      ],
    },
    {
      title: 'Pipeline autónomo',
      description: 'Comandos de mayor nivel para delegar el flujo completo a agentes especializados.',
      commands: [
        {
          name: '/plan-run',
          usage: '/plan-run [NNN-slug | "description"]',
          description: 'Ejecuta un planning de punta a punta desde su estado actual.',
          details: [
            'Detecta automáticamente en qué fase está el planning.',
            'Muestra un plan de ejecución y pide una única confirmación.',
            'Luego delega a agentes de fase para planificar, ejecutar y validar.',
          ],
          source: 'skills/plan-run/SKILL.md',
        },
        {
          name: '/plan-agent-plan',
          usage: '/plan-agent-plan <NNN-slug | "description">',
          description: 'Agente de planificación autónoma.',
          details: [
            'Crea un planning si hace falta.',
            'Avanza desde INITIAL a EXPANSION sin confirmaciones intermedias.',
            'Prepara la base que luego ejecutan otros agentes.',
          ],
          source: 'skills/plan-agent-plan/SKILL.md',
        },
        {
          name: '/plan-agent-execute',
          usage: '/plan-agent-execute <NNN-slug>',
          description: 'Agente de ejecución de stories pendientes.',
          details: [
            'Atomiza y ejecuta stories independientes en paralelo usando subagentes.',
            'Respeta orden de dependencias.',
            'Se enfoca en avanzar el trabajo pendiente de un planning.',
          ],
          source: 'skills/plan-agent-execute/SKILL.md',
        },
        {
          name: '/plan-agent-validate',
          usage: '/plan-agent-validate <NNN-slug>',
          description: 'Agente de validación y cierre.',
          details: [
            'Ejecuta plan-validate.',
            'Marca done y archiva si todas las stories pasan.',
            'Se detiene sin archivar si encuentra problemas.',
          ],
          source: 'skills/plan-agent-validate/SKILL.md',
        },
      ],
    },
  ],
}

export default commandsPage
