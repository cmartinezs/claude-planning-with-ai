import { useState } from 'react'
import Link from 'next/link'
import TrainingStepList from './TrainingStepList'
import TrainingWorkspace from './TrainingWorkspace'
import type { TrainingScenario } from '@/types/training'

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

export default function TrainingRunner({ scenario, meta, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const step = scenario.steps[currentStep]
  const progress = Math.round((completedSteps.size / scenario.steps.length) * 100)

  const handleRun = () => {
    if (isRunning || completedSteps.has(currentStep)) return
    setIsRunning(true)
  }

  const handleComplete = () => {
    setIsRunning(false)
    const next = new Set(completedSteps)
    next.add(currentStep)
    setCompletedSteps(next)

    if (currentStep + 1 >= scenario.steps.length) {
      setIsFinished(true)
      onComplete?.()
    } else {
      setTimeout(() => setCurrentStep((s) => s + 1), 600)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setCompletedSteps(new Set())
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
              completedSteps={completedSteps}
            />
          </div>

          <div className="rounded-2xl border border-surface-800 bg-surface-900/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
              {meta.contextLabel}
            </p>
            <p className="text-sm leading-relaxed text-surface-300">{step.hint}</p>
          </div>

          {completedSteps.has(currentStep) && currentStep + 1 < scenario.steps.length && (
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
            isRunning={isRunning}
            isDone={completedSteps.has(currentStep)}
            onRun={handleRun}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  )
}
