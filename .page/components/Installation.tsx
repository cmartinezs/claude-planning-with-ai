import { useState } from 'react'
import TerminalAnimation, { type TerminalScript } from './TerminalAnimation'

const installMethods = [
  {
    title: 'Desde marketplace',
    description: 'Plugin publicado en el marketplace de Claude Code:',
    code: '/plugin install claude-planning-with-ai',
  },
  {
    title: 'Desde local (symlink)',
    description: 'Clona el repo y enlázalo donde Claude busca plugins:',
    code: '',
    cloneInstructions: true,
  },
]

const steps = [
  {
    id: 0,
    label: '/plan-init',
    desc: 'Crea .planning/ y detecta las áreas del proyecto',
    script: {
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
  },
  {
    id: 1,
    label: '/plan-new 001-mi-feature -- Mi feature',
    desc: 'Crea el plan en estado INITIAL',
    script: {
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
  },
  {
    id: 2,
    label: '/plan-expand 001-mi-feature',
    desc: 'Expande la idea en scopes ejecutables',
    script: {
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
  },
  {
    id: 3,
    label: '/plan-scope 001-mi-feature scope-01',
    desc: 'Ejecuta todas las tareas del primer scope',
    script: {
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
  },
]

const demoScripts: TerminalScript[] = steps.map((s) => s.script)

const workspaceStates = [
  {
    files: [
      { name: '.planning', level: 0, type: 'folder' },
      { name: '_template', level: 1, type: 'folder' },
      { name: 'WORKFLOWS', level: 1, type: 'folder' },
      { name: 'AREA-AP-api.md', level: 2, type: 'file' },
      { name: 'AREA-WB-web.md', level: 2, type: 'file' },
      { name: 'active', level: 1, type: 'folder' },
      { name: 'finished', level: 1, type: 'folder' },
    ],
    tab: 'GUIDE.md',
    code: [
      '| Code | Repository / Area |',
      '|------|------------------|',
      '| `AP` | `api/` — backend service |',
      '| `WB` | `web/` — frontend app |',
      '| `DO` | `docs/` — documentation |',
      '| `IN` | `infra/` — infrastructure |',
      '| `W`  | `.planning/` — meta |',
    ],
  },
  {
    files: [
      { name: '.planning', level: 0, type: 'folder' },
      { name: 'active', level: 1, type: 'folder' },
      { name: '001-mi-feature', level: 2, type: 'folder' },
      { name: 'plan.md', level: 3, type: 'file' },
      { name: 'scope-01.md', level: 3, type: 'file' },
      { name: 'finished', level: 1, type: 'folder' },
    ],
    tab: 'plan.md',
    code: [
      '# 001-mi-feature',
      '',
      'Estado: INITIAL',
      '',
      '## Idea',
      'Mi feature pendiente de expansión.',
    ],
  },
  {
    files: [
      { name: '.planning', level: 0, type: 'folder' },
      { name: 'active', level: 1, type: 'folder' },
      { name: '001-mi-feature', level: 2, type: 'folder' },
      { name: 'plan.md', level: 3, type: 'file' },
      { name: 'scope-01.md', level: 3, type: 'file' },
      { name: 'scope-02.md', level: 3, type: 'file' },
      { name: 'scope-03.md', level: 3, type: 'file' },
    ],
    tab: 'scope-01.md',
    code: [
      '# scope-01: Configuración inicial',
      '',
      '- Crear estructura base',
      '- Configurar dependencias',
      '- Preparar validaciones',
    ],
  },
  {
    files: [
      { name: '.planning', level: 0, type: 'folder' },
      { name: 'active', level: 1, type: 'folder' },
      { name: '001-mi-feature', level: 2, type: 'folder' },
      { name: 'plan.md', level: 3, type: 'file' },
      { name: 'scope-01.md', level: 3, type: 'file', done: true },
      { name: 'scope-02.md', level: 3, type: 'file' },
      { name: 'scope-03.md', level: 3, type: 'file' },
    ],
    tab: 'scope-01.md',
    code: [
      '# scope-01: Configuración inicial',
      '',
      'Estado: DONE',
      '',
      '- [x] estructura de directorios creada',
      '- [x] dependencias configuradas',
      '- [x] archivos base generados',
    ],
  },
]

function WorkspaceMock({
  activeStep,
  completedStep,
  onStepComplete,
}: {
  activeStep: number | null
  completedStep: number | null
  onStepComplete: (index: number) => void
}) {
  const state = completedStep === null ? null : workspaceStates[completedStep]

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/15 via-cyan-500/10 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-surface-600/70 bg-surface-950 shadow-2xl shadow-brand-500/10">
        <div className="grid min-h-[560px] grid-cols-[44px_minmax(128px,180px)_1fr] bg-surface-900/70">
          <div className="flex flex-col items-center gap-4 border-r border-surface-800 bg-surface-950 py-4 text-surface-500">
            <span className="text-lg text-surface-200">▣</span>
            <span className="text-lg">⌕</span>
            <span className="text-lg">⑂</span>
            <span className="mt-auto text-lg text-brand-400">⚙</span>
          </div>

          <aside className="border-r border-surface-800 bg-surface-900/80">
            <div className="border-b border-surface-800 px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
              Explorer
            </div>
            <div className="px-2 py-3">
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase text-surface-400">
                mi-proyecto
              </div>
              {(state?.files ?? [{ name: 'src', level: 0, type: 'folder' }, { name: 'README.md', level: 0, type: 'file' }]).map((file) => (
                <div
                  key={`${file.level}-${file.name}`}
                  className={`flex items-center gap-1.5 rounded px-1.5 py-1 text-xs ${
                    file.name === state?.tab
                      ? 'bg-brand-500/10 text-brand-300'
                      : 'text-surface-400'
                  }`}
                  style={{ paddingLeft: `${file.level * 12 + 6}px` }}
                >
                  <span className={file.type === 'folder' ? 'text-brand-400' : 'text-cyan-500'}>
                    {file.type === 'folder' ? '▸' : file.done ? '✓' : 'md'}
                  </span>
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <div className="flex border-b border-surface-800 bg-surface-900">
              <div className="border-r border-surface-800 bg-surface-950 px-4 py-2 text-xs font-mono text-surface-300">
                {state?.tab ?? 'README.md'}
              </div>
            </div>

            <div className="grid flex-1 grid-rows-[minmax(180px,1fr)_minmax(260px,320px)]">
              <pre className="overflow-hidden bg-surface-950/80 p-5 font-mono text-xs leading-6 text-surface-300">
                {(state?.code ?? ['# mi-proyecto', '', 'Selecciona /plan-init para iniciar el flujo.', 'Los siguientes pasos se habilitan en orden.']).map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-6 shrink-0 text-right text-surface-700">{i + 1}</span>
                    <span className={line.startsWith('#') ? 'text-brand-300' : line.includes('[x]') ? 'text-green-400' : 'text-surface-300'}>
                      {line || ' '}
                    </span>
                  </div>
                ))}
              </pre>

              <div className="min-h-0 border-t border-surface-800 bg-surface-950">
                <div className="flex items-center gap-5 border-b border-surface-800 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
                  <span>Problems</span>
                  <span>Output</span>
                  <span className="text-brand-400">Terminal</span>
                </div>
                {activeStep === null ? (
                  <div className="p-5 font-mono text-sm text-surface-500">
                    <span className="text-cyan-400">└─</span>
                    <span className="text-yellow-400">▪</span>{' '}
                    <span className="text-surface-600">esperando comando...</span>
                  </div>
                ) : (
                  <TerminalAnimation
                    key={activeStep}
                    script={demoScripts[activeStep]}
                    embedded
                    onComplete={() => onStepComplete(activeStep)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InstallCard({
  title,
  description,
  code,
  cloneInstructions,
}: {
  title: string
  description: string
  code: string
  cloneInstructions?: boolean
}) {
  return (
    <div className="glass-card p-6 md:p-8">
      <h3 className="text-lg font-semibold text-surface-50 mb-2">{title}</h3>
      <p className="text-sm text-surface-400 mb-5">{description}</p>

      {cloneInstructions ? (
        <div className="space-y-4">
          <div className="code-block">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-900/50 border-b border-surface-700">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/50" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <span className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-surface-600 font-mono">terminal</span>
            </div>
            <div className="p-4 space-y-2">
              <code className="text-sm text-brand-400 font-mono block">
                git clone git@github.com:cmartinezs/claude-planning-with-ai.git
              </code>
              <code className="text-sm text-green-400 font-mono block">
                ln -s $(pwd)/claude-planning-with-ai ~/.claude/plugins/claude-planning-with-ai
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500 bg-surface-800/50 rounded-xl px-4 py-3 border border-surface-700/50">
            <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              El symlink apunta el plugin directamente a tu clon local.
              Cualquier cambio en el repo queda disponible de inmediato, sin reinstalar.
            </span>
          </div>
        </div>
      ) : (
        <div className="code-block">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-900/50 border-b border-surface-700">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/50" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <span className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-xs text-surface-600 font-mono">terminal</span>
          </div>
          <div className="p-4">
            <code className="text-sm text-brand-400 font-mono leading-relaxed block">
              {code}
            </code>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Installation() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [completedStep, setCompletedStep] = useState<number | null>(null)
  const [maxEnabledStep, setMaxEnabledStep] = useState(0)

  const handleStepClick = (index: number) => {
    if (index > maxEnabledStep) return

    setActiveStep(index)
  }

  const handleStepComplete = (index: number) => {
    setCompletedStep((current) => (current === null ? index : Math.max(current, index)))
    setMaxEnabledStep((current) => Math.min(steps.length - 1, Math.max(current, index + 1)))
  }

  return (
    <>
      <section id="instalacion" className="relative pt-24 md:pt-32 pb-8 scroll-mt-24">
        <div className="absolute inset-0 bg-surface-800/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              Instalación en{' '}
              <span className="gradient-text">2 pasos</span>
            </h2>
            <p className="section-subtitle">
              El plugin funciona con cualquier proyecto que use markdown.
              Sin dependencias externas. Sin configuración previa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {installMethods.map((method) => (
              <InstallCard key={method.title} {...method} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-16 bg-surface-800/50">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-surface-50 text-center mb-12">
            Primeros pasos
          </h3>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 items-start">
            <div className="space-y-3">
              {steps.map((step, i) => {
                const isActive = activeStep === i
                const isEnabled = i <= maxEnabledStep
                const isDone = completedStep !== null && i <= completedStep

                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={!isEnabled}
                    aria-disabled={!isEnabled}
                    onClick={() => handleStepClick(i)}
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-500/10 border-brand-500/30 shadow-sm shadow-brand-500/10'
                        : isEnabled
                          ? 'bg-surface-700/30 border-surface-700/50 hover:bg-surface-700/50 hover:border-surface-600'
                          : 'bg-surface-900/40 border-surface-800/70 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-brand-500 text-surface-900 font-bold'
                          : isDone
                            ? 'bg-green-500/15 border border-green-500/30 text-green-400 font-bold'
                            : isEnabled
                              ? 'bg-surface-700 border border-surface-600 text-surface-300 font-semibold'
                              : 'bg-surface-900 border border-surface-800 text-surface-600 font-semibold'
                      }`}
                    >
                      {isDone ? '✓' : i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className={`code-block inline-block mb-1 ${!isEnabled ? 'border-surface-800 bg-surface-900/40' : ''}`}>
                        <code className={`text-sm font-mono px-3 py-1.5 block whitespace-nowrap ${!isEnabled ? 'text-surface-600' : ''}`}>
                          {step.label}
                        </code>
                      </div>
                      <p className={`text-sm ${isEnabled ? 'text-surface-400' : 'text-surface-600'}`}>{step.desc}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 shrink-0 mt-2 transition-all duration-200 ${
                        isActive
                          ? 'text-brand-400 rotate-0'
                          : isEnabled
                            ? 'text-surface-500 -rotate-45'
                            : 'text-surface-700 -rotate-45'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )
              })}
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="text-xs text-surface-500 font-mono mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                interactivo — ejecuta los pasos en orden
              </div>
              <WorkspaceMock
                activeStep={activeStep}
                completedStep={completedStep}
                onStepComplete={handleStepComplete}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
