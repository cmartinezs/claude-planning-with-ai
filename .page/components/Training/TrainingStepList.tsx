import type { TrainingStep } from '@/types/training'

interface Props {
  steps: TrainingStep[]
  currentStep: number
  completedSteps: Set<number>
}

export default function TrainingStepList({ steps, currentStep, completedSteps }: Props) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
        Pasos
      </p>
      {steps.map((step, i) => {
        const isDone = completedSteps.has(i)
        const isActive = i === currentStep
        const isPending = i > currentStep

        return (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
              isActive
                ? 'border-brand-500/30 bg-brand-500/10'
                : isDone
                  ? 'border-green-500/20 bg-green-500/5'
                  : 'border-surface-800 bg-surface-900/40 opacity-50'
            }`}
          >
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-brand-500 text-surface-900'
                  : isDone
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-surface-800 text-surface-600'
              }`}
            >
              {isDone ? '✓' : isActive ? '▶' : i + 1}
            </div>
            <div className="min-w-0">
              <code
                className={`block truncate font-mono text-xs ${
                  isActive ? 'text-brand-300' : isDone ? 'text-green-400' : 'text-surface-600'
                }`}
              >
                {step.command.split(' ')[0]}
              </code>
              {isActive && (
                <p className="mt-0.5 text-[11px] leading-relaxed text-surface-400">
                  {step.hint.slice(0, 60)}…
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
