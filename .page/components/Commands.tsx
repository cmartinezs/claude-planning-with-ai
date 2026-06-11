const categories = [
  {
    title: 'Inicialización',
    description: 'Ejecutar una vez por proyecto',
    color: 'border-l-brand-500',
    commands: [
      { cmd: '/plan-init', desc: 'Crea la estructura .planning/ en el proyecto' },
    ],
  },
  {
    title: 'Backlog',
    description: 'Gestión de historias y épicas',
    color: 'border-l-cyan-500',
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
    color: 'border-l-emerald-500',
    commands: [
      { cmd: '/plan-template slug', desc: 'Genera un documento de idea interactivo' },
      { cmd: '/plan-new NNN-slug -- intento', desc: 'Crea un plan en estado INITIAL' },
      { cmd: '/plan-new NNN-slug @ruta.md', desc: 'Crea un plan desde un documento de idea' },
      { cmd: '/plan-expand NNN-slug', desc: 'Avanza de INITIAL → EXPANSION' },
    ],
  },
  {
    title: 'Ejecución',
    description: 'Ejecutar y cerrar scopes',
    color: 'border-l-amber-500',
    commands: [
      { cmd: '/plan-scope NNN-slug scope-NN', desc: 'Ejecuta todas las tareas de un scope' },
      { cmd: '/plan-done NNN-slug scope-NN', desc: 'Marca un scope como completado' },
      { cmd: '/plan-status', desc: 'Muestra todos los planes activos y sus scopes' },
      { cmd: '/plan-archive NNN-slug', desc: 'Audita y archiva en finished/' },
    ],
  },
  {
    title: 'Ajustes',
    description: 'Modificaciones en mitad del plan',
    color: 'border-l-purple-500',
    commands: [
      { cmd: '/plan-enrich-epic NNN-slug', desc: 'Añade nuevos scopes a un plan activo' },
      { cmd: '/plan-enrich-story NNN-slug scope-NN', desc: 'Profundiza un scope poco definido' },
      { cmd: '/plan-split-story NNN-slug scope-NN', desc: 'Divide un scope demasiado grande' },
    ],
  },
]

export default function Commands() {
  return (
    <section id="comandos" className="relative py-24 md:py-32 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            Comandos{' '}
            <span className="gradient-text">esenciales</span>
          </h2>
          <p className="section-subtitle">
            Una docena de comandos cubren todo el ciclo de vida.
            Sin flags crípticas. Sin configuraciones infinitas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className={`glass-card overflow-hidden ${cat.color} border-l-2`}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-surface-50 mb-1">
                  {cat.title}
                </h3>
                <p className="text-sm text-surface-500 mb-5">{cat.description}</p>
                <div className="space-y-3">
                  {cat.commands.map((c) => (
                    <div key={c.cmd} className="group">
                      <div className="code-block p-3">
                        <code className="text-brand-400 text-xs leading-relaxed block">
                          {c.cmd}
                        </code>
                      </div>
                      <p className="text-xs text-surface-500 mt-1.5 pl-1">
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/cmartinezs/claude-planning-with-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Ver documentación completa en GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
