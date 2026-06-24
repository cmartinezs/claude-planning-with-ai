import { useState } from 'react'
import Link from 'next/link'
import TrainingStepList from './TrainingStepList'
import TrainingWorkspace from './TrainingWorkspace'
import type { TrainingScenario, WorkspaceState } from '@/types/training'

interface Props {
  scenario: TrainingScenario
  meta: {
    title: string
    difficultyLabel: string
    completedLabel: string
    stepLabel: string
    ofLabel: string
    contextLabel: string
    nextLabel: string
    finishedTitle: string
    finishedSubtitle: string
    backLabel: string
    restartLabel: string
  }
  onComplete?: () => void
}

const DIFFICULTY_STARS: Record<string, string> = {
  basic: '★☆☆',
  intermediate: '★★☆',
  advanced: '★★★',
}

const EMPTY_STATE: WorkspaceState = { files: [], tab: '', code: [] }

export default function TrainingRunner({ scenario, meta, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [executedSteps, setExecutedSteps] = useState<Set<number>>(new Set())
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const step = scenario.steps[currentStep]
  const isExecuted = executedSteps.has(currentStep)
  const isLastStep = currentStep === scenario.steps.length - 1
  const progress = Math.round((executedSteps.size / scenario.steps.length) * 100)

  // What the workspace editor and file tree show:
  // - Before executing current step → show previous step's result (or initial state for step 0)
  // - While running or after executing → show current step's result
  const viewState: WorkspaceState | undefined = (!isRunning && !isExecuted)
    ? (currentStep === 0
        ? (scenario.initial ?? EMPTY_STATE)
        : scenario.steps[currentStep - 1])
    : undefined

  const handleRun = () => {
    if (isRunning || isExecuted) return
    setIsRunning(true)
  }

  const handleAnimationComplete = () => {
    setIsRunning(false)
    setExecutedSteps((prev) => new Set(prev).add(currentStep))
  }

  const handleNext = () => {
    if (!isExecuted) return
    if (isLastStep) {
      setIsFinished(true)
      onComplete?.()
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep === 0) return
    setCurrentStep((s) => s - 1)
  }

  const handleNavigateTo = (index: number) => {
    setCurrentStep(index)
    setIsRunning(false)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setExecutedSteps(new Set())
    setIsRunning(false)
    setIsFinished(false)
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 text-6xl">🎉</div>
        <h2 className="text-3xl font-bold text-surface-50">{meta.finishedTitle}</h2>
        <p className="mt-3 max-w-md text-surface-400">{meta.finishedSubtitle}</p>
        <div className="mt-8 flex gap-4">
          <Link href="/training" className="btn-primary">{meta.backLabel}</Link>
          <button onClick={handleRestart} className="btn-secondary">{meta.restartLabel}</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-400">{DIFFICULTY_STARS[scenario.difficulty]}</span>
            <h1 className="text-xl font-bold text-surface-50">{meta.title}</h1>
          </div>
          <span className="shrink-0 font-mono text-sm text-surface-500">
            {meta.stepLabel} {currentStep + 1} {meta.ofLabel} {scenario.steps.length}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-surface-800">
          <div
            className="h-1.5 rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-surface-800 bg-surface-900/60 overflow-hidden">
            <TrainingStepList
              steps={scenario.steps}
              currentStep={currentStep}
              executedSteps={executedSteps}
              onNavigate={handleNavigateTo}
            />
          </div>

          <div className="rounded-2xl border border-surface-800 bg-surface-900/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
              {meta.contextLabel}
            </p>
            <p className="text-sm leading-relaxed text-surface-300">{step.hint}</p>
          </div>

          {isExecuted && step.reviewNote && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                ⚠ Antes de continuar
              </p>
              <p className="text-sm leading-relaxed text-surface-300">{step.reviewNote}</p>
            </div>
          )}

          {isExecuted && !isLastStep && (
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-brand-400">
                {meta.nextLabel}
              </p>
              <p className="text-sm leading-relaxed text-surface-300">{step.nextHint}</p>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="lg:sticky lg:top-24">
          <TrainingWorkspace
            step={step}
            viewState={viewState}
            isRunning={isRunning}
            isExecuted={isExecuted}
            onRun={handleRun}
            onComplete={handleAnimationComplete}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-surface-800 pt-6">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-900/60 px-5 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-surface-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <span aria-hidden="true">←</span>
          Anterior
        </button>

        <span className="font-mono text-xs text-surface-600">
          {executedSteps.size}/{scenario.steps.length} ejecutados
        </span>

        <button
          onClick={handleNext}
          disabled={!isExecuted}
          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
            isLastStep
              ? 'border-green-500/40 bg-green-500/10 text-green-300 hover:bg-green-500/20'
              : 'border-brand-500/40 bg-brand-500/10 text-brand-300 hover:bg-brand-500/20'
          }`}
        >
          {isLastStep ? 'Finalizar' : 'Siguiente'}
          <span aria-hidden="true">{isLastStep ? ' ✓' : ' →'}</span>
        </button>
      </div>
    </div>
  )
}
