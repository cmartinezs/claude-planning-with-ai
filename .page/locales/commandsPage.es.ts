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
            'Crea la estructura .planning/ y detecta áreas del repositorio para trazabilidad.',
            'Debe ejecutarse una vez antes de usar el resto de comandos plan-*.',
          ],
          source: 'skills/plan-init/SKILL.md',
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
            'Crea los archivos base del planning sin expandir todavía los scopes.',
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
            'Indica si ya está vinculada a un scope activo de planning.',
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
            'Convierte cada story en un scope ejecutable.',
            'Hereda criterios de aceptación y Definition of Done como done criteria del scope.',
            'Actúa como puente entre backlog de producto y ejecución técnica.',
          ],
          source: 'skills/plan-from-epic/SKILL.md',
        },
      ],
    },
    {
      title: 'Expansión y preparación',
      description: 'Comandos para convertir una idea inicial en scopes y tareas listas para ejecutar.',
      commands: [
        {
          name: '/plan-expand',
          usage: '/plan-expand <NNN-slug>',
          description: 'Avanza un planning desde INITIAL a EXPANSION.',
          details: [
            'Completa 01-expansion.md con scopes, dependencias y criterios de éxito.',
            'Crea archivos de scope en 02-deepening/.',
            'Mueve el planning a active/ y actualiza índices.',
          ],
          source: 'skills/plan-expand/SKILL.md',
        },
        {
          name: '/plan-atomize',
          usage: '/plan-atomize <NNN-slug> [scope-NN]',
          description: 'Descompone un scope en tareas atómicas.',
          details: [
            'Crea un archivo por tarea con diseño técnico, pasos de implementación, tests y done criteria.',
            'Puede aplicarse a un scope específico o a todo el planning.',
            'Se usa después de expandir y antes de ejecutar cuando se necesita más granularidad.',
          ],
          source: 'skills/plan-atomize/SKILL.md',
        },
        {
          name: '/plan-task-validate',
          usage: '/plan-task-validate <NNN-slug> [scope-NN] [task-NN]',
          description: 'Audita tareas atómicas contra el checklist de atomicidad.',
          details: [
            'Es de solo lectura.',
            'Valida una tarea, un scope o todos los scopes atomizados.',
            'Compara tareas con el índice del scope y criterios de atomicidad.',
          ],
          source: 'skills/plan-task-validate/SKILL.md',
        },
      ],
    },
    {
      title: 'Ejecución y cierre',
      description: 'Comandos centrales para ejecutar scopes, cerrar tareas y archivar trabajo terminado.',
      commands: [
        {
          name: '/plan-task',
          usage: '/plan-task <NNN-slug> <scope-NN> <task-NN>',
          description: 'Ejecuta una tarea atómica individual.',
          details: [
            'Sigue el diseño técnico de la tarea y aplica implementación y tests.',
            'Marca la tarea como DONE en el archivo de tarea y en el índice del scope.',
            'Puede disparar documentación de nivel tarea.',
          ],
          source: 'skills/plan-task/SKILL.md',
        },
        {
          name: '/plan-scope',
          usage: '/plan-scope <NNN-slug> <scope-NN>',
          description: 'Ejecuta todas las tareas dentro de un scope.',
          details: [
            'Sigue el workflow GENERATE-DOCUMENT para cada tarea.',
            'Trabaja sobre un scope específico del planning activo.',
            'Es el comando principal de ejecución por bloques.',
          ],
          source: 'skills/plan-scope/SKILL.md',
        },
        {
          name: '/plan-done',
          usage: '/plan-done <NNN-slug> <scope-NN> [task-N]',
          description: 'Marca una tarea o todo un scope como terminado.',
          details: [
            'Verifica criterios de completitud antes de avanzar.',
            'Puede cerrar una tarea específica o un scope completo.',
            'Avanza el planning cuando todos los scopes están completos.',
          ],
          source: 'skills/plan-done/SKILL.md',
        },
        {
          name: '/plan-validate',
          usage: '/plan-validate [NNN-slug]',
          description: 'Valida la integridad estructural de uno o todos los plannings.',
          details: [
            'Revisa ubicación de archivos, consistencia de scopes, workflows, dependencias y done criteria.',
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
          description: 'Agrega nuevos scopes a un planning activo.',
          details: [
            'Se usa cuando aparece cobertura faltante después de la expansión inicial.',
            'Funciona sobre plannings en EXPANSION o DEEPENING.',
            'Mantiene la coherencia de índices y archivos de scope.',
          ],
          source: 'skills/plan-enrich-epic/SKILL.md',
        },
        {
          name: '/plan-enrich-story',
          usage: '/plan-enrich-story <NNN-slug> <scope-NN>',
          description: 'Profundiza un scope underspecified, ambiguo o incompleto.',
          details: [
            'No cambia el estado del scope.',
            'Agrega detalle suficiente para poder ejecutar con menor incertidumbre.',
            'Sirve cuando el scope existe pero no tiene criterios o contexto suficiente.',
          ],
          source: 'skills/plan-enrich-story/SKILL.md',
        },
        {
          name: '/plan-split-story',
          usage: '/plan-split-story <NNN-slug> <scope-NN>',
          description: 'Divide un scope demasiado grande en scopes más pequeños.',
          details: [
            'Reemplaza el scope original por dos o más scopes enfocados.',
            'Actualiza 01-expansion.md y los archivos bajo 02-deepening/.',
            'Es útil cuando un scope mezcla responsabilidades o excede un tamaño ejecutable.',
          ],
          source: 'skills/plan-split-story/SKILL.md',
        },
        {
          name: '/plan-merge',
          usage: '/plan-merge <NNN-source> <scope-NN> <NNN-target>',
          description: 'Mueve un scope desde un planning activo a otro.',
          details: [
            'Actualiza ambos archivos 01-expansion.md.',
            'Relocaliza el archivo de scope.',
            'Preserva carpetas de tareas atomizadas cuando existen.',
          ],
          source: 'skills/plan-merge/SKILL.md',
        },
        {
          name: '/plan-scope-skip',
          usage: '/plan-scope-skip <NNN-slug> <scope-NN> [-- reason]',
          description: 'Marca un scope como SKIPPED sin ejecutarlo.',
          details: [
            'Sirve cuando el scope ya no aplica por cambios de requerimiento.',
            'Permite cerrar un planning sin forzar trabajo obsoleto.',
            'Registra una razón cuando se entrega.',
          ],
          source: 'skills/plan-scope-skip/SKILL.md',
        },
        {
          name: '/plan-rollback',
          usage: '/plan-rollback <NNN-slug> <scope-NN>',
          description: 'Revierte un scope de DONE a TODO.',
          details: [
            'Se usa cuando una ejecución dejó el código en mal estado y debe repetirse.',
            'Puede remover carpeta de tareas atomizadas asociada.',
            'Prepara el scope para re-ejecución controlada.',
          ],
          source: 'skills/plan-rollback/SKILL.md',
        },
        {
          name: '/plan-retry',
          usage: '/plan-retry <NNN-slug>',
          description: 'Reintenta todos los scopes BLOCKED de un planning.',
          details: [
            'Resetea scopes bloqueados a TODO.',
            'Re-ejecuta plan-scope para retomarlos.',
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
            'Lista plannings activos y sus scopes.',
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
            'Incluye objetivo, avance de scopes, decisiones técnicas, duración y siguientes pasos.',
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
            'Incluye scopes, done criteria, preguntas abiertas y referencias.',
            'Es de solo lectura sobre el planning.',
          ],
          source: 'skills/plan-export/SKILL.md',
        },
        {
          name: '/plan-clone',
          usage: '/plan-clone <NNN-source-slug> <NNN-target-slug>',
          description: 'Clona un planning con un nuevo ID.',
          details: [
            'Copia la estructura de scopes.',
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
          usage: '/doc-generate <NNN-slug> [<scope-NN> [<task-NN>]]',
          description: 'Genera documentación desde artefactos de planning.',
          details: [
            'Puede trabajar a nivel tarea, scope o planning.',
            'Produce inline docs, ADRs, changelogs o guías de usuario según área y nivel.',
            'Detecta el área afectada antes de decidir el tipo de documentación.',
          ],
          source: 'skills/doc-generate/SKILL.md',
        },
        {
          name: '/doc-task',
          usage: '/doc-task <NNN-slug> <scope-NN> <task-NN>',
          description: 'Genera documentación para una tarea atómica completada.',
          details: [
            'Wrapper delgado sobre doc-generate.',
            'Se invoca automáticamente desde plan-task cuando corresponde.',
            'Produce documentación inline o ADR según el área del scope.',
          ],
          source: 'skills/doc-task/SKILL.md',
        },
        {
          name: '/doc-scope',
          usage: '/doc-scope <NNN-slug> <scope-NN>',
          description: 'Genera documentación para un scope completado.',
          details: [
            'Wrapper delgado sobre doc-generate.',
            'Puede generar changelog, guía de usuario o ADR consolidado.',
            'Se integra al cierre de scope.',
          ],
          source: 'skills/doc-scope/SKILL.md',
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
          description: 'Agente de ejecución de scopes pendientes.',
          details: [
            'Atomiza y ejecuta scopes independientes en paralelo usando subagentes.',
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
            'Marca done y archiva si todos los scopes pasan.',
            'Se detiene sin archivar si encuentra problemas.',
          ],
          source: 'skills/plan-agent-validate/SKILL.md',
        },
      ],
    },
  ],
}

export default commandsPage
