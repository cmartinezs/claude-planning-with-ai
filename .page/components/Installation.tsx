import { useState } from 'react'
import TerminalAnimation, { Prompt, type TerminalScript } from './TerminalAnimation'
import { useTranslation } from '../locales'

const workspaceFiles = [
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
  },
  {
    files: [
      { name: '.planning', level: 0, type: 'folder' },
      { name: 'active', level: 1, type: 'folder' },
      { name: '001-feature', level: 2, type: 'folder' },
      { name: 'plan.md', level: 3, type: 'file' },
      { name: 'scope-01.md', level: 3, type: 'file' },
      { name: 'finished', level: 1, type: 'folder' },
    ],
    tab: 'plan.md',
  },
  {
    files: [
      { name: '.planning', level: 0, type: 'folder' },
      { name: 'active', level: 1, type: 'folder' },
      { name: '001-feature', level: 2, type: 'folder' },
      { name: 'plan.md', level: 3, type: 'file' },
      { name: 'scope-01.md', level: 3, type: 'file' },
      { name: 'scope-02.md', level: 3, type: 'file' },
      { name: 'scope-03.md', level: 3, type: 'file' },
    ],
    tab: 'scope-01.md',
  },
  {
    files: [
      { name: '.planning', level: 0, type: 'folder' },
      { name: 'active', level: 1, type: 'folder' },
      { name: '001-feature', level: 2, type: 'folder' },
      { name: 'plan.md', level: 3, type: 'file' },
      { name: 'scope-01.md', level: 3, type: 'file', done: true },
      { name: 'scope-02.md', level: 3, type: 'file' },
      { name: 'scope-03.md', level: 3, type: 'file' },
    ],
    tab: 'scope-01.md',
  },
]

function WorkspaceMock({
  activeStep,
  completedStep,
  onStepComplete,
  workspaceStates,
  workspaceProject,
  initialHint,
  waitingLabel,
  demoScripts,
}: {
  activeStep: number | null
  completedStep: number | null
  onStepComplete: (index: number) => void
  workspaceStates: Array<{ files: Array<{ name: string; level: number; type: string; done?: boolean }>; tab: string; code: string[] }>
  workspaceProject: string
  initialHint: string[]
  waitingLabel: string
  demoScripts: TerminalScript[]
}) {
  const state = completedStep === null ? null : workspaceStates[completedStep]

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/15 via-cyan-500/10 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-surface-600/70 bg-surface-950 shadow-2xl shadow-brand-500/10">
        <div className="grid min-h-[560px] grid-cols-[44px_1fr] md:grid-cols-[44px_minmax(128px,180px)_1fr] bg-surface-900/70">
          <div className="flex flex-col items-center gap-4 border-r border-surface-800 bg-surface-950 py-4 text-surface-500">
            <span className="text-lg text-surface-200">▣</span>
            <span className="text-lg">⌕</span>
            <span className="text-lg">⑂</span>
            <span className="mt-auto text-lg text-brand-400">⚙</span>
          </div>

          <aside className="hidden md:block border-r border-surface-800 bg-surface-900/80">
            <div className="border-b border-surface-800 px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
              Explorer
            </div>
            <div className="px-2 py-3">
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase text-surface-400">
                {workspaceProject}
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
                {(state?.code ?? initialHint).map((line, i) => (
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
                  <div className="p-5">
                    <Prompt />
                    <span className="font-mono text-sm text-surface-600">{waitingLabel}</span>
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
  lines,
  windowLabel,
}: {
  title: string
  description: string
  lines: string[]
  windowLabel: string
}) {
  return (
    <div className="glass-card p-6 md:p-8">
      <h3 className="text-lg font-semibold text-surface-50 mb-2">{title}</h3>
      <p className="text-sm text-surface-400 mb-5">{description}</p>

      <div className="code-block">
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-900/50 border-b border-surface-700">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/50" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <span className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs text-surface-600 font-mono">{windowLabel}</span>
        </div>
        <div className="p-4 space-y-2">
          {lines.map((line) => (
            <code key={line} className="text-sm text-brand-400 font-mono block break-words">
              {line}
            </code>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Installation() {
  const t = useTranslation()
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [completedStep, setCompletedStep] = useState<number | null>(null)
  const [maxEnabledStep, setMaxEnabledStep] = useState(0)

  const steps = t.installation.steps
  const workspaceStates = workspaceFiles.map((w, i) => ({
    ...w,
    code: t.installation.workspaceCodes[i],
  }))
  const demoScripts: TerminalScript[] = steps.map((s) => ({
    command: s.command,
    output: s.output,
  }))

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
      <section id="installation" className="relative pt-24 md:pt-32 pb-8 scroll-mt-24">
        <div className="absolute inset-0 bg-surface-800/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              {t.installation.titlePrefix}{' '}
              <span className="gradient-text">{t.installation.titleHighlight}</span>
            </h2>
            <p className="section-subtitle">
              {t.installation.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <InstallCard
              title={t.installation.marketplace.title}
              description={t.installation.marketplace.description}
              windowLabel="claude"
              lines={[
                '/plugin marketplace add cmartinezs/claude-planning-with-ai',
                '/plugin install claude-planning-with-ai@cmartinezs',
              ]}
            />
            <InstallCard
              title={t.installation.terminal.title}
              description={t.installation.terminal.description}
              windowLabel="terminal"
              lines={[
                'claude plugin marketplace add cmartinezs/claude-planning-with-ai',
                'claude plugin install claude-planning-with-ai@cmartinezs',
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-surface-400">
            <span>{t.installation.updateNote}</span>
            <code className="code-block px-3 py-1.5 text-sm font-mono text-brand-400">
              claude plugin update claude-planning-with-ai@cmartinezs
            </code>
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-16 bg-surface-800/50">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-surface-50 text-center mb-12">
            {t.installation.firstSteps}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 items-start">
            <div className="space-y-3">
              {steps.map((step, i) => {
                const isActive = activeStep === i
                const isEnabled = i <= maxEnabledStep
                const isDone = completedStep !== null && i <= completedStep

                return (
                  <button
                    key={i}
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
                      <div className={`code-block inline-block max-w-full mb-1 ${!isEnabled ? 'border-surface-800 bg-surface-900/40' : ''}`}>
                        <code className={`text-sm font-mono px-3 py-1.5 block break-words ${!isEnabled ? 'text-surface-600' : ''}`}>
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
                {t.installation.interactive}
              </div>
              <WorkspaceMock
                activeStep={activeStep}
                completedStep={completedStep}
                onStepComplete={handleStepComplete}
                workspaceStates={workspaceStates}
                workspaceProject={t.installation.workspaceProject}
                initialHint={t.installation.workspaceInitialHint}
                waitingLabel={t.installation.waiting}
                demoScripts={demoScripts}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
