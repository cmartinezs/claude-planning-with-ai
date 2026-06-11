const stages = [
  {
    phase: 'INITIAL',
    icon: '💡',
    label: 'Idea',
    description: 'Captura la idea inicial con /plan-new. Una semilla, sin estructura.',
    color: 'text-brand-400',
    border: 'border-brand-500/30',
    bg: 'bg-brand-500/5',
  },
  {
    phase: 'EXPANSION',
    icon: '🔬',
    label: 'Expansión',
    description: 'Claude expande la idea: alcances, tareas, dependencias, criterios de éxito.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/5',
  },
  {
    phase: 'DEEPENING',
    icon: '⚡',
    label: 'Ejecución',
    description: 'Claude ejecuta scope por scope. Cada comando /plan-scope avanza el plan.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
  },
  {
    phase: 'COMPLETED',
    icon: '✅',
    label: 'Completado',
    description: 'Marca scopes completados con /plan-done. El plan se acerca a su fin.',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
  },
  {
    phase: 'ARCHIVE',
    icon: '📦',
    label: 'Archivo',
    description: 'Auditoría final y archivo en finished/. Todo queda documentado.',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5',
  },
]

export default function Lifecycle() {
  return (
    <section id="ciclo" className="relative py-24 md:py-32 bg-surface-800/50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            Ciclo de vida{' '}
            <span className="gradient-text">completo</span>
          </h2>
          <p className="section-subtitle">
            Cada plan navega por 5 estados. El plugin guía cada transición
            con comandos específicos.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500/30 via-cyan-500/30 to-purple-500/30 -translate-y-1/2" />

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-4">
            {stages.map((stage, i) => (
              <div key={stage.phase} className="relative">
                <div className="glass-card-hover p-6 text-center relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${stage.bg} ${stage.border} border flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {stage.icon}
                  </div>
                  <div className={`text-xs font-mono font-semibold ${stage.color} mb-1`}>
                    {stage.phase}
                  </div>
                  <h3 className="text-surface-50 font-semibold mb-2">
                    {stage.label}
                  </h3>
                  <p className="text-sm text-surface-500 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {i < stages.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-20 w-6 h-6 rounded-full bg-surface-700 border-2 border-surface-600 items-center justify-center">
                    <svg className="w-3 h-3 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-surface-700/50 border border-surface-600/50">
            <span className="text-surface-400 text-sm">
              Estado actual del plan:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              /plan-status
            </span>
            <span className="text-surface-500 text-sm">— consulta en vivo</span>
          </div>
        </div>
      </div>
    </section>
  )
}
